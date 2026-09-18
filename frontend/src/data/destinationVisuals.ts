export const heroImage = '/images/vietnam-hero.webp';

const destinationImages: Record<string, string> = {
  'ha-giang': '/images/ha-giang.webp',
  'ninh-binh': '/images/ninh-binh.webp',
  'hoi-an': '/images/hoi-an.webp',
  'ho-chi-minh': '/images/ho-chi-minh.webp',
  'da-lat': '/images/da-lat.webp',
  'phu-quoc': '/images/phu-quoc.webp',
  'nha-trang': heroImage,
  'da-nang': '/images/hoi-an.webp',
  'vung-tau': '/images/phu-quoc.webp',
};

export function getDestinationImage(id: string) {
  return destinationImages[id] || heroImage;
}
