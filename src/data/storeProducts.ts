export interface CookieProduct {
  id: string;
  name: string;
  category: 'Clásicas' | 'Rellenas' | 'Sin azúcar' | 'Integrales' | 'Especiales';
  flavor: string;
  brand: string;
  price: number;
  rating: number;
  ratingCount?: number;
  badge?: 'Más vendido' | 'Nuevo';
  image: string;
  description?: string;
  sugarFree?: boolean;
}

export const CATEGORIES_LIST = [
  'Todas las galletas',
  'Clásicas',
  'Rellenas',
  'Sin azúcar',
  'Integrales',
  'Especiales'
] as const;

export const FLAVORS_LIST = [
  'Chocolate',
  'Vainilla',
  'Fresa',
  'Limón',
  'Oreo',
  'Mantequilla de maní',
  'Coco',
  'Caramelo',
  'Café',
  'Red Velvet'
] as const;

export const BRANDS_LIST = [
  'Todas las marcas',
  'Cookie Dream',
  'Sweet Bites',
  "Nature's Cookies",
  'Oreo',
  'Chips Ahoy'
] as const;

export const STORE_COOKIES: CookieProduct[] = [
  {
    id: 'cookie-1',
    name: 'Galletas con Chispas de Chocolate',
    category: 'Clásicas',
    flavor: 'Chocolate',
    brand: 'Cookie Dream',
    price: 6.50,
    rating: 4.5,
    ratingCount: 142,
    badge: 'Más vendido',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80',
    description: 'Nuestra receta insignia con mantequilla dorada y abundantes chispas de chocolate belga semi-amargo.'
  },
  {
    id: 'cookie-2',
    name: 'Galletas Doble Chocolate',
    category: 'Especiales',
    flavor: 'Chocolate',
    brand: 'Sweet Bites',
    price: 7.50,
    rating: 4.7,
    ratingCount: 98,
    badge: 'Nuevo',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    description: 'Intensa masa de cacao puro horneada con trozos de chocolate negro fundente.'
  },
  {
    id: 'cookie-3',
    name: 'Galletas Rellenas de Oreo',
    category: 'Rellenas',
    flavor: 'Oreo',
    brand: 'Oreo',
    price: 6.90,
    rating: 4.6,
    ratingCount: 112,
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80',
    description: 'Crujiente masa artesanal rellena con una galleta Oreo entera y crema de vainilla.'
  },
  {
    id: 'cookie-4',
    name: 'Galletas de Fresa',
    category: 'Especiales',
    flavor: 'Fresa',
    brand: 'Sweet Bites',
    price: 6.50,
    rating: 4.4,
    ratingCount: 64,
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
    description: 'Delicada galleta horneada con trozos de fresas naturales y chocolate blanco.'
  },
  {
    id: 'cookie-5',
    name: 'Galletas de Avena',
    category: 'Integrales',
    flavor: 'Vainilla',
    brand: "Nature's Cookies",
    price: 5.90,
    rating: 4.3,
    ratingCount: 87,
    image: 'https://images.unsplash.com/photo-1597528662465-55ece5734101?auto=format&fit=crop&w=800&q=80',
    description: 'Avena integral de grano entero, un toque de canela ceilán y pasas rubias jugosas.'
  },
  {
    id: 'cookie-6',
    name: 'Galletas de Mantequilla de Maní',
    category: 'Clásicas',
    flavor: 'Mantequilla de maní',
    brand: 'Cookie Dream',
    price: 6.50,
    rating: 4.6,
    ratingCount: 104,
    image: 'https://images.unsplash.com/photo-1548848221-0c2e497ed557?auto=format&fit=crop&w=800&q=80',
    description: 'Mantequilla de maní tostado artesanal con su clásico entramado tradicional y pizca de sal marina.'
  },
  {
    id: 'cookie-7',
    name: 'Galletas de Limón',
    category: 'Especiales',
    flavor: 'Limón',
    brand: 'Sweet Bites',
    price: 6.50,
    rating: 4.4,
    ratingCount: 73,
    image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80',
    description: 'Frescura cítrica con ralladura de limón amarillo y suave cubierta craquelada con azúcar glas.'
  },
  {
    id: 'cookie-8',
    name: 'Galletas Red Velvet',
    category: 'Especiales',
    flavor: 'Red Velvet',
    brand: 'Sweet Bites',
    price: 7.50,
    rating: 4.6,
    ratingCount: 135,
    image: 'https://images.unsplash.com/photo-1612203985729-70726954388c?auto=format&fit=crop&w=800&q=80',
    description: 'Masa aterciopelada de cacao rojo con centro suave de crema de queso y chispas blancas.'
  },
  {
    id: 'cookie-9',
    name: 'Galletas de Chispas de Chocolate y Nueces',
    category: 'Clásicas',
    flavor: 'Chocolate',
    brand: 'Chips Ahoy',
    price: 7.50,
    rating: 4.5,
    ratingCount: 89,
    image: 'https://images.unsplash.com/photo-1548365328-8c6db3220e4c?auto=format&fit=crop&w=800&q=80',
    description: 'Equilibrio perfecto entre chocolate fundido y nueces crocantes tostadas al punto.'
  },
  {
    id: 'cookie-10',
    name: 'Galletas de Coco',
    category: 'Especiales',
    flavor: 'Coco',
    brand: "Nature's Cookies",
    price: 6.00,
    rating: 4.2,
    ratingCount: 52,
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80',
    description: 'Horneadas con coco rallado dorado, textura tierna por dentro y crocante por fuera.'
  },
  {
    id: 'cookie-11',
    name: 'Galletas Rellenas de Caramelo',
    category: 'Rellenas',
    flavor: 'Caramelo',
    brand: 'Cookie Dream',
    price: 7.50,
    rating: 4.7,
    ratingCount: 161,
    image: 'https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?auto=format&fit=crop&w=800&q=80',
    description: 'Sorprendente corazón líquido de dulce de caramelo salado derretido al primer mordisco.'
  },
  {
    id: 'cookie-12',
    name: 'Galletas de Café',
    category: 'Especiales',
    flavor: 'Café',
    brand: 'Cookie Dream',
    price: 6.50,
    rating: 4.3,
    ratingCount: 68,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    description: 'Aroma seductor de café espresso peruano con perlas de chocolate negro.'
  }
];
