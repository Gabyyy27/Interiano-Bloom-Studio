import CatalogSection from "@/components/home/CatalogSection";
import ContactSection from "@/components/home/ContactSection";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ServicesTicker from "@/components/home/ServicesTicker";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <HeroSection />
        <ServicesTicker />
        <CatalogSection />
        <ServicesSection />
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}