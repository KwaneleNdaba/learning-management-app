import NonDashboardNavbar from "@/components/NonDashboardNavbar";
import Footer from "@/components/Footer";
import Landing from "./(nondashboard)/landing/page";

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
