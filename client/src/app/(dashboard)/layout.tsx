"use client"
// import Navbar from "@/components/Navbar"
import NonDashboardNavbar from "@/components/NonDashboardNavbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Loading from "@/components/ui/Loading";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

    const pathname = usePathname();
    const [courseId, setCourseId] = useState("");
    const { user, isLoaded } = useUser();

    if (!isLoaded) {
        return <Loading />
    }

    if (!user) {
        return <div className="">Please signin to access this page.</div>
    }


    return (
        <SidebarProvider>
            <div className="dashboard">
<AppSidebar/>
                <div className="dashboard__content">
                    <div className={
                        cn(
                            "dashboard__main",
                        )
                    }
                        style={{
                            height: "100vh"
                        }}
                    >

                        <main className="dashboard__body">{children}</main>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}