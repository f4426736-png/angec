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
    image: '/src/assets/images/cookies_milk_tower_1789517244986.jpg',
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
    image: '/src/assets/images/chocolate_cookies_pile_1789517259017.jpg',
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
    image: '/src/assets/images/oreo_stuffed_cookie_1789528866846.jpg',
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
    image: '/src/assets/images/strawberry_cookie_1789517307657.jpg',
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
    image: '/oatmeal-raisin.png',
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
    image: '/src/assets/images/peanut_butter_cookie_1789517293237.jpg',
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
    image: '/src/assets/images/lemon_crinkle_cookie_1789517327460.jpg',
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
    image: '/src/assets/images/red_velvet_cookie_1789517277288.jpg',
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
    image: '/src/assets/images/walnut_cookie_1789528904769.jpg',
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
    image: '/src/assets/images/coconut_cookie_1789528881289.jpg',
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
    image: '/src/assets/images/caramel_filled_cookie_1789517343702.jpg',
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
    image: '/src/assets/images/coffee_mocha_cookie_1789528893426.jpg',
    description: 'Aroma seductor de café espresso peruano con perlas de chocolate negro.'
  }
];
