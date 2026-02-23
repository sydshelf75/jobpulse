import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <Sidebar />
            <div className="md:ml-[var(--sidebar-width)]">
                <Topbar />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
