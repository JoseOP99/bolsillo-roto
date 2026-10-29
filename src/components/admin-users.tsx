"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
type AppUser = {
  id: string;
  email: string;
  role: string;
  confirmed: boolean;
  created_at: string;
};
export default function AdminUsers() {
  const [users, setUsers] = useState<AppUser[]>([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [page, setPage] = useState(1);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    async function load() {
      try {
        const {
          data: { session },
        } = await supabase!.auth.getSession();
        if (!session) throw new Error("Inicia sesión de nuevo.");
        const res = await fetch(`/api/v1/admin/users?page=${page}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.error);
        if (active) setUsers(body.data);
      } catch (e) {
        if (active) setError((e as Error).message);
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [page]);
  return (
    <section className="panel">
      <span className="eyebrow">ADMINISTRACIÓN</span>
      <h2>Usuarios de Bolsillo Roto</h2>
      <p>
        Directorio básico de cuentas. Los movimientos financieros conservan sus
        permisos por propietario.
      </p>
      {loading && <p role="status">Cargando usuarios…</p>}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Confirmación</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.email}</td>
                    <td>
                      {u.role === "superadmin"
                        ? "Superadministrador"
                        : "Usuario"}
                    </td>
                    <td>{u.confirmed ? "Confirmado" : "Pendiente"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-tools" style={{ marginTop: 20 }}>
            <button
              className="button"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Anterior
            </button>
            <span>Página {page}</span>
            <button
              className="button"
              disabled={users.length < 50}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </section>
  );
}
