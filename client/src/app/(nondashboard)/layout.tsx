import NonDashboardNavbar from "@/components/NonDashboardNavbar";
import Footer from "@/components/Footer";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section className="nondashboard-layout">
            <NonDashboardNavbar />
            <main className="nondashboard-layout__main">
                {
                    children
                }
            </main>
            <Footer />
        </section>
    );
}
