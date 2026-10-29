create or replace function public.generate_payment_alerts() returns integer language plpgsql security invoker set search_path='' as $$
declare n integer; target date := (now() at time zone 'America/Bogota')::date+2; last_day integer;
begin
 last_day=extract(day from (date_trunc('month',target)+interval '1 month - 1 day'));
 insert into public.notifications(user_id,account_id,kind,due_date,message)
 select user_id,id,'payment',target,'En dos días vence el pago de '||name from public.accounts
 where kind='credit' and least(payment_day,last_day)=extract(day from target)
 on conflict(user_id,account_id,kind,due_date) do nothing;get diagnostics n=row_count;return n;
end $$;
create or replace function public.financial_summary(p_user_id uuid) returns jsonb language plpgsql security invoker set search_path='' as $$
declare result jsonb;cash numeric;future_income numeric;future_expense numeric;quotas numeric; today date:=(now() at time zone 'America/Bogota')::date;
begin
 if coalesce(auth.jwt()->>'role','')<>'service_role' and (p_user_id is distinct from auth.uid() or not private.session_active()) then raise insufficient_privilege;end if;
 select coalesce(sum(opening_balance),0) into cash from public.accounts where user_id=p_user_id and kind<>'credit';
 select cash+coalesce(sum(case when t.kind='income' then t.amount else -t.amount end),0) into cash from public.transactions t join public.accounts a on a.id=t.account_id and a.user_id=t.user_id where t.user_id=p_user_id and a.kind<>'credit';
 select coalesce(sum(amount) filter(where kind='income'),0),coalesce(sum(amount) filter(where kind='expense'),0) into future_income,future_expense from public.recurring_entries where user_id=p_user_id and day>extract(day from today);
 select coalesce(sum(payment),0) into quotas from public.amortizations where user_id=p_user_id and paid_at is null and due_date between today and (date_trunc('month',today)+interval '1 month - 1 day')::date;
 select jsonb_build_object('balance',cash,'income',coalesce(sum(amount) filter(where kind='income'),0),'expenses',coalesce(sum(amount) filter(where kind='expense'),0),'upcoming_installments',quotas,'projected_balance',cash+future_income-future_expense-quotas,'as_of',now(),'currency','COP') into result from public.transactions where user_id=p_user_id;
 return result;
end $$;
