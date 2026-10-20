import { redirect } from "next/navigation";
import { verifySession } from "../lib/session";
import AdminNav from "./components/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--night)",
        color: "var(--text)",
      }}
    >
      <AdminNav />
      <main style={{ padding: "24px" }}>{children}</main>
    </div>
  );
}
