import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { QueryProvider } from "@/components/providers/QueryProvider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <QueryProvider>
            <div className="flex h-screen overflow-hidden bg-gray-50">
                <AdminSidebar />
                <div className="flex flex-col flex-1 overflow-hidden">
                    <AdminHeader />
                    <main className="flex-1 overflow-y-auto px-6 py-6">
                        {children}
                    </main>
                </div>
            </div>
        </QueryProvider>
    );
}
