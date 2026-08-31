export const WHATSAPP_NUMBER = "50433219649";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export function getWhatsAppUrl(message?: string) {
  if (!message) {
    return WHATSAPP_URL;
  }

  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
}

export function getCatalogQuoteWhatsAppUrl({
  title,
  categoryName,
}: {
  title: string;
  categoryName: string;
}) {
  return getWhatsAppUrl(
    [
      "Hola, me interesa cotizar este producto:",
      `"${title}"`,
      `Categoría: ${categoryName}`,
    ].join("\n"),
  );
}
