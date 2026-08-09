import AdminGuard from "@/components/AdminGuard";
import AdminDashboard from "@/views/AdminDashboard";

export default function Page() {
  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  );
}
