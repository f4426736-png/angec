export interface GalleryItem {
  id: string;
  title: string;
  order: number;
  imageUrl: string;
  subtitle?: string;
  price?: string;
}

export type OutroSymbol = '8' | '$' | '^^' | '%' | '/';
