export interface CookieProduct {
  id: string;
  name: string;
  category: string;
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
  'Postres',
  'Bebidas'
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
  // ROW 1
  {
    id: 'prod-1',
    name: 'Clásicas',
    category: 'Clásicas',
    flavor: 'Chocolate',
    brand: 'Cookie Dream',
    price: 2.50,
    rating: 4.8,
    ratingCount: 124,
    badge: 'Más vendido',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80',
    description: 'Nuestra clásica galleta horneada con mantequilla dorada y abundantes chispas de chocolate belga semi-amargo.'
  },
  {
    id: 'prod-2',
    name: 'Doble Chocolate',
    category: 'Clásicas',
    flavor: 'Chocolate',
    brand: 'Sweet Bites',
    price: 3.00,
    rating: 4.7,
    ratingCount: 98,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    description: 'Intensa masa de cacao puro horneada con trozos de chocolate negro fundente.'
  },
  {
    id: 'prod-3',
    name: 'Red Velvet',
    category: 'Clásicas',
    flavor: 'Red Velvet',
    brand: 'Sweet Bites',
    price: 2.75,
    rating: 4.8,
    ratingCount: 87,
    image: 'https://images.unsplash.com/photo-1612203985729-70726954388c?auto=format&fit=crop&w=800&q=80',
    description: 'Masa aterciopelada de cacao rojo con centro suave de crema de queso y chispas blancas.'
  },
  {
    id: 'prod-4',
    name: 'Avena',
    category: 'Clásicas',
    flavor: 'Vainilla',
    brand: "Nature's Cookies",
    price: 2.50,
    rating: 4.5,
    ratingCount: 76,
    image: 'https://images.unsplash.com/photo-1597528662465-55ece5734101?auto=format&fit=crop&w=800&q=80',
    description: 'Avena integral de grano entero, toque de canela ceilán y pasas rubias jugosas.'
  },
  {
    id: 'prod-5',
    name: 'Cookies & Oreo',
    category: 'Rellenas',
    flavor: 'Oreo',
    brand: 'Oreo',
    price: 3.25,
    rating: 4.8,
    ratingCount: 103,
    badge: 'Nuevo',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80',
    description: 'Crujiente masa artesanal rellena con galletas Oreo trituradas y crema de vainilla.'
  },

  // ROW 2
  {
    id: 'prod-6',
    name: "M&M's",
    category: 'Clásicas',
    flavor: 'Chocolate',
    brand: 'Cookie Dream',
    price: 2.75,
    rating: 4.7,
    ratingCount: 92,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80',
    description: 'Masa crujiente y divertida cubierta con grageas confitadas de chocolate con leche.'
  },
  {
    id: 'prod-7',
    name: 'Caramelo',
    category: 'Rellenas',
    flavor: 'Caramelo',
    brand: 'Cookie Dream',
    price: 3.00,
    rating: 4.6,
    ratingCount: 81,
    image: 'https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?auto=format&fit=crop&w=800&q=80',
    description: 'Sorprendente corazón líquido de dulce de caramelo salado derretido al primer mordisco.'
  },
  {
    id: 'prod-8',
    name: 'Limón',
    category: 'Clásicas',
    flavor: 'Limón',
    brand: 'Sweet Bites',
    price: 2.75,
    rating: 4.5,
    ratingCount: 69,
    image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80',
    description: 'Frescura cítrica con ralladura de limón amarillo y glaseado suave en espiral.'
  },
  {
    id: 'prod-9',
    name: 'Cheesecake',
    category: 'Postres',
    flavor: 'Fresa',
    brand: 'Sweet Bites',
    price: 4.25,
    rating: 4.9,
    ratingCount: 143,
    badge: 'Más vendido',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    description: 'Cremosa porción de cheesecake estilo New York horneada sobre base de galleta con salsa de frutos rojos.'
  },
  {
    id: 'prod-10',
    name: 'Brownie',
    category: 'Postres',
    flavor: 'Chocolate',
    brand: 'Cookie Dream',
    price: 3.50,
    rating: 4.7,
    ratingCount: 95,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    description: 'Brownie fudge con intenso sabor a chocolate belga, corteza craquelada y corazón húmedo.'
  },

  // ROW 3
  {
    id: 'prod-11',
    name: 'Alfajores',
    category: 'Postres',
    flavor: 'Caramelo',
    brand: 'Sweet Bites',
    price: 3.50,
    rating: 4.8,
    ratingCount: 112,
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80',
    description: 'Suaves tapitas de maicena que se deshacen en la boca, rellenas de abundante manjar blanco y coco rallado.'
  },
  {
    id: 'prod-12',
    name: 'Cupcakes',
    category: 'Postres',
    flavor: 'Vainilla',
    brand: 'Sweet Bites',
    price: 3.75,
    rating: 4.6,
    ratingCount: 78,
    image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=800&q=80',
    description: 'Bizcochuelo esponjoso decorado artesanalmente con frosting de crema batida y toques de frambuesa.'
  },
  {
    id: 'prod-13',
    name: 'Tiramisú',
    category: 'Postres',
    flavor: 'Café',
    brand: 'Sweet Bites',
    price: 4.50,
    rating: 4.9,
    ratingCount: 64,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
    description: 'Clásico postre italiano en vaso con bizcochos humedecidos en espresso, crema de mascarpone y cacao en polvo.'
  },
  {
    id: 'prod-14',
    name: 'Integrales',
    category: 'Clásicas',
    flavor: 'Vainilla',
    brand: "Nature's Cookies",
    price: 2.75,
    rating: 4.4,
    ratingCount: 58,
    image: 'https://images.unsplash.com/photo-1548848221-0c2e497ed557?auto=format&fit=crop&w=800&q=80',
    description: 'Elaboradas con harinas 100% integrales, semillas seleccionadas y miel orgánica.'
  },
  {
    id: 'prod-15',
    name: 'Chocolate Blanco',
    category: 'Clásicas',
    flavor: 'Chocolate',
    brand: 'Chips Ahoy',
    price: 3.25,
    rating: 4.6,
    ratingCount: 73,
    image: 'https://images.unsplash.com/photo-1548365328-8c6db3220e4c?auto=format&fit=crop&w=800&q=80',
    description: 'Delicadas y doradas galletas con generosos trozos de chocolate blanco cremoso y nueces tostadas.'
  }
];
