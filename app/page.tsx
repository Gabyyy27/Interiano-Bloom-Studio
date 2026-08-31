import CatalogSection from "@/components/home/CatalogSection";
import ContactSection from "@/components/home/ContactSection";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import ServicesTicker from "@/components/home/ServicesTicker";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getPublicCatalog } from "@/lib/catalog/getPublicCatalog";

export default async function Home() {
  const catalog = await getPublicCatalog();
  return (
    <>
      <Header />

      <main>
        <HeroSection />
        <ServicesTicker />
        <CatalogSection
          categories={catalog.categories}
          items={catalog.items}
          hasError={catalog.hasError}
        />
        <ServicesSection />
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}