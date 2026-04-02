import { SiteHeader } from "@/components/site-header";
import { AdminDashboard } from "./admin-dashboard";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <AdminDashboard />
    </div>
  );
}
