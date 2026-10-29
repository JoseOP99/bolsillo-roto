create table public.recurring_entries(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,name text not null check(length(name) between 1 and 100),kind text not null check(kind in ('income','expense')),amount numeric(18,2) not null check(amount>0 and amount<=1000000000000),day smallint not null check(day between 1 and 28),created_at timestamptz not null default now());
alter table public.recurring_entries enable row level security;
create index recurring_entries_user on public.recurring_entries(user_id);
create policy recurring_owner on public.recurring_entries for all to authenticated using(user_id=(select auth.uid()) and (select private.session_active())) with check(user_id=(select auth.uid()) and (select private.session_active()));
grant select,insert,update,delete on public.recurring_entries to authenticated;
grant all on public.recurring_entries to service_role;
-- Payment records cannot exceed principal, including concurrent requests.
revoke insert,update on public.loan_payments from authenticated;
create function private.pay_loan(p_loan_id uuid,p_amount numeric) returns uuid language plpgsql security definer set search_path='' as $$ declare l public.loans;paid numeric;result uuid;begin
 if auth.uid() is null or not private.session_active() then raise insufficient_privilege;end if;
 select * into l from public.loans where id=p_loan_id and user_id=auth.uid() for update;
 if not found then raise insufficient_privilege;end if;
 select coalesce(sum(amount),0) into paid from public.loan_payments where loan_id=l.id and user_id=auth.uid();
 if p_amount<=0 or p_amount>l.principal-paid or p_amount<>round(p_amount,2) then raise exception using errcode='22023',message='El abono no puede superar el saldo pendiente.';end if;
 insert into public.loan_payments(user_id,loan_id,amount) values(auth.uid(),l.id,p_amount) returning id into result;return result;end $$;
revoke all on function private.pay_loan(uuid,numeric) from public,anon;
grant execute on function private.pay_loan(uuid,numeric) to authenticated;
create function public.pay_loan(p_loan_id uuid,p_amount numeric) returns uuid language sql security invoker set search_path='' as $$ select private.pay_loan(p_loan_id,p_amount) $$;
revoke all on function public.pay_loan(uuid,numeric) from public,anon;
grant execute on function public.pay_loan(uuid,numeric) to authenticated;
-- Append-only payments; editing principal after payments would invalidate the ledger.
revoke update on public.loans from authenticated;
create function public.generate_payment_alerts() returns integer language plpgsql security invoker set search_path='' as $$ declare n integer;begin
 insert into public.notifications(user_id,account_id,kind,due_date,message)
 select user_id,id,'payment',current_date,'Se acerca el día de pago de '||name from public.accounts where kind='credit' and payment_day=extract(day from (now() at time zone 'America/Bogota')+interval '2 days')
 on conflict(user_id,account_id,kind,due_date) do nothing; get diagnostics n=row_count;return n;
end $$;
revoke all on function public.generate_payment_alerts() from public,anon,authenticated;
grant execute on function public.generate_payment_alerts() to service_role;
