import NonDashboardNavbar from "@/components/NonDashboardNavbar";
import Image from "next/image";
import Landing from "./(nondashboard)/Landing/page";
import Footer from "@/components/Footer";

export default function Home() {
  return (
   <section className="nondashboard-layout">
    <NonDashboardNavbar/>
    <main className="nondashboard-layout__main">
      <Landing/>
      
    </main>
    <Footer/>
   </section>
  );
}
