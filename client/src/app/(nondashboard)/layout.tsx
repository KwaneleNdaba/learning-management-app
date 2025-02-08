import NonDashboardNavbar from "@/components/NonDashboardNavbar";
import Footer from "@/components/Footer";
import { Suspense } from "react";
import Loading from "@/components/ui/Loading";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="nondashboard-layout">
      <NonDashboardNavbar />
      <main className="nondashboard-layout__main">
        <Suspense fallback={<Loading/>}>
        {children}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}