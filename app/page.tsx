import CatalogSection from "@/components/home/CatalogSection";
import ContactSection from "@/components/home/ContactSection";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import ServicesTicker from "@/components/home/ServicesTicker";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getPublicCatalogPage } from "@/lib/catalog/getPublicCatalog";

interface HomeSearchParams {
  page?: string | string[];
  category?: string | string[];
}

interface HomeProps {
  searchParams: Promise<HomeSearchParams>;
}

function getFirstSearchParam(
  value: string | string[] | undefined,
) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function getPageNumber(
  value: string | string[] | undefined,
) {
  const rawValue =
    getFirstSearchParam(value);

  if (!rawValue) {
    return 1;
  }

  const parsedValue =
    Number(rawValue);

  if (
    !Number.isInteger(parsedValue) ||
    parsedValue < 1
  ) {
    return 1;
  }

  return parsedValue;
}

export default async function Home({
  searchParams,
}: HomeProps) {
  const params = await searchParams;

  const page =
    getPageNumber(params.page);

  const categoryId =
    getFirstSearchParam(
      params.category,
    ) ?? null;

  const catalog =
    await getPublicCatalogPage({
      page,
      categoryId,
    });

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
          serverPage={catalog.page}
          serverTotalPages={
            catalog.totalPages
          }
          serverCategoryId={
            catalog.categoryId
          }
        />

        <ServicesSection />

        <ContactSection />
      </main>

      <Footer />
    </>
  );
}