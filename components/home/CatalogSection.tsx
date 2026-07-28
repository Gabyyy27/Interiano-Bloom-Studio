"use client";

import { useState } from "react";

import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";

import CatalogCard from "@/components/home/CatalogCard";
import CatalogDialog from "@/components/home/CatalogDialog";
import SectionContainer from "@/components/common/SectionContainer";
import {
  catalogCategories,
  type CatalogCategory,
  type CatalogItem,
} from "@/types/catalog";

const catalogItems: CatalogItem[] = [
  {
    id: "1",
    title: "Caja Floral de Cumpleaños",
    subtitle: "Rosas y detalles personalizados",
    description:
      "Una composición preparada especialmente para celebrar. Puedes personalizar los colores, el estilo de las flores y los complementos del arreglo.",
    category: "Cumpleaños",
    imageSrc: "/images/gallery/birthday-1.webp",
    imageAlt: "Caja floral personalizada para cumpleaños",
  },
  {
    id: "2",
    title: "Rosas Románticas",
    subtitle: "Un detalle para celebrar juntos",
    description:
      "Un arreglo floral romántico diseñado para aniversarios y fechas especiales. Los colores y complementos pueden adaptarse a tu idea.",
    category: "Aniversarios",
    imageSrc: "/images/gallery/anniversary-1.webp",
    imageAlt: "Arreglo de rosas para aniversario",
  },
  {
    id: "3",
    title: "Arreglo Floral para Boda",
    subtitle: "Elegancia para una ocasión inolvidable",
    description:
      "Una composición elegante para bodas y celebraciones. El diseño puede personalizarse según la decoración, la paleta de colores y el estilo del evento.",
    category: "Bodas",
    imageSrc: "/images/gallery/wedding-1.jpg",
    imageAlt: "Arreglo floral elegante para boda",
  },
  {
    id: "4",
    title: "Rosas Eternas Premium",
    subtitle: "Caja acrílica con acabado elegante",
    description:
      "Todos nuestros diseños son personalizables. Elige colores, complementos y un mensaje único; nosotros convertimos tu idea en un detalle especial.",
    category: "Detalles",
    imageSrc: "/images/gallery/detail-1.webp",
    imageAlt: "Rosas eternas dentro de una caja acrílica",
  },
  {
    id: "5",
    title: "Bouquet de Celebración",
    subtitle: "Color y alegría para su día",
    description:
      "Un bouquet alegre preparado para cumpleaños y celebraciones. Puede combinar flores, globos, chocolates y otros complementos.",
    category: "Cumpleaños",
    imageSrc: "/images/gallery/birthday-2.jpeg",
    imageAlt: "Bouquet floral colorido para cumpleaños",
  },
  {
    id: "6",
    title: "Composición Floral Elegante",
    subtitle: "Flores seleccionadas para eventos",
    description:
      "Una composición floral creada para complementar bodas y eventos especiales. Adaptamos el diseño a la ambientación de tu celebración.",
    category: "Bodas",
    imageSrc: "/images/gallery/wedding-2.jpg",
    imageAlt: "Composición floral para una boda",
  },
];

export default function CatalogSection() {
  const [selectedCategory, setSelectedCategory] =
    useState<CatalogCategory>("Todos");

  const [selectedItem, setSelectedItem] =
    useState<CatalogItem | null>(null);

  const filteredItems =
    selectedCategory === "Todos"
      ? catalogItems
      : catalogItems.filter(
          (item) => item.category === selectedCategory,
        );

  return (
    <>
      <SectionContainer id="catalogo">
        <Stack spacing={6}>
          <Stack
            spacing={2}
            sx={{
              maxWidth: 720,
            }}
          >
            <Typography
              component="p"
              variant="body2"
              sx={{
                color: "secondary.dark",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Nuestro catálogo
            </Typography>

            <Typography component="h2" variant="h2">
              Detalles creados para cada ocasión
            </Typography>

            <Typography color="text.secondary">
              Explora nuestros diseños y selecciona una categoría
              para encontrar el detalle adecuado.
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={1.5}
            useFlexGap
            sx={{
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            {catalogCategories.map((category) => {
              const isSelected =
                selectedCategory === category;

              return (
                <Button
                  key={category}
                  type="button"
                  variant={
                    isSelected
                      ? "contained"
                      : "outlined"
                  }
                  color="primary"
                  aria-pressed={isSelected}
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                >
                  {category}
                </Button>
              );
            })}
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(3, minmax(0, 1fr))",
              },
              gap: 3,
            }}
          >
            {filteredItems.map((item) => (
              <CatalogCard
                key={item.id}
                item={item}
                onViewDetails={() =>
                  setSelectedItem(item)
                }
              />
            ))}
          </Box>
        </Stack>
      </SectionContainer>

      <CatalogDialog
        item={selectedItem}
        open={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
}