/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem } from '../types.ts';

export const curatedMenuItems: MenuItem[] = [
  // COFFEE & ESPRESSO BAR (category: 'coffee')
  {
    id: 'coffee-espresso',
    name: 'Espresso Shot',
    price: 99,
    description: 'A single, robust shot of our signature high-mountain roasted blend with rich hazelnut crema.',
    category: 'coffee',
    image: '/src/assets/images/plush_espresso_shot_1781801452742.jpg',
    season: 'All Season'
  },
  {
    id: 'coffee-double-espresso',
    name: 'Double Espresso',
    price: 129,
    description: 'Two bold, concentrated shots of rich espresso for the perfect energy kickstart and premium amber crema.',
    category: 'coffee',
    image: '/src/assets/images/plush_double_espresso_1781801626136.jpg',
    season: 'All Season'
  },
  {
    id: 'coffee-americano',
    name: 'Americano',
    price: 149,
    description: 'Rich, bold espresso shots diluted with steaming hot water, bringing out sweet caramel notes.',
    category: 'coffee',
    image: '/src/assets/images/plush_americano_coffee_1781801608848.jpg',
    season: 'All Season'
  },
  {
    id: 'coffee-cappuccino',
    name: 'Cappuccino',
    price: 179,
    description: 'Double shot espresso topped with extra-thick cloud microfoam and an elegant cocoa stencil of our signature heart.',
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'coffee-latte',
    name: 'Café Latte',
    price: 169,
    description: 'Perfectly balanced single origin espresso and velvety steamed milk with a smooth finish.',
    category: 'coffee',
    image: '/src/assets/images/plush_cafe_latte_1781801642717.jpg',
    season: 'All Season'
  },
  {
    id: 'coffee-vanilla-latte',
    name: 'Vanilla Latte',
    price: 199,
    description: 'Signature espresso pulled with house-made natural beetroot-pink vanilla bean syrup and velvety warm milk.',
    category: 'coffee',
    isBestseller: true,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'coffee-hazelnut-latte',
    name: 'Hazelnut Latte',
    price: 209,
    description: 'Creamy espresso latte infused with rich, toasted roasted sweet hazelnut syrup.',
    category: 'coffee',
    image: '/src/assets/images/plush_hazelnut_latte_1781801656668.jpg',
    season: 'All Season'
  },
  {
    id: 'coffee-caramel-latte',
    name: 'Caramel Latte',
    price: 209,
    description: 'Airy, velvety latte finished with a rich drizzle of sweet artisanal caramel syrup.',
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'coffee-marshmallow',
    name: 'Marshmallow Latte',
    price: 189,
    description: 'Espresso with silky microfoam, topped with toasted gourmet marshmallows and chocolate drizzle.',
    category: 'coffee',
    image: '/src/assets/images/plush_marshmallow_latte_1781801673245.jpg',
    season: 'All Season'
  },
  {
    id: 'coffee-strawberry-latte',
    name: 'Strawberry Latte',
    price: 219,
    description: 'Enchanting pink-layered drink of robust espresso, warm velvety milk, and strawberry juice reduction.',
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1483168527879-c66136b56105?auto=format&fit=crop&q=80&w=600',
    season: 'Winter Only'
  },
  {
    id: 'coffee-white-mocha',
    name: 'White Chocolate Mocha',
    price: 229,
    description: 'Our luxurious espresso blended with velvety steamed milk, sweet white cocoa sauce, and delicious fluffy whipped cream topped with fine chocolate shavings.',
    category: 'coffee',
    image: '/src/assets/images/white_mocha_1781801770951.jpg',
    season: 'All Season'
  },
  {
    id: 'coffee-mocha',
    name: 'Café Mocha',
    price: 199,
    description: 'Smooth espresso, rich dark cocoa, and creamy steamed milk blended into cozy cold-weather luxury, styled with an adorable sleeping bear foam pattern.',
    category: 'coffee',
    image: '/src/assets/images/cafe_mocha_1781801785960.jpg',
    season: 'All Season'
  },
  {
    id: 'coffee-affogato',
    name: 'Affogato',
    price: 249,
    description: 'Premium vanilla bean ice cream drowned in a hot, luxurious shot of single origin espresso, styled beautifully on a wooden tray.',
    category: 'coffee',
    image: '/src/assets/images/affogato_1781801803900.jpg',
    season: 'All Season'
  },

  // PLUSH BUBBLE TEA COLLECTION (category: 'boba')
  {
    id: 'boba-brown-sugar',
    name: 'Brown Sugar Boba Milk Tea',
    price: 249,
    description: 'Decadent stripes of caramelized brown sugar molasses syrup, slow-brewed black milk tea, and chewy boba pearls.',
    category: 'boba',
    isBestseller: true,
    image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'boba-original-milk',
    name: 'Original Milk Tea',
    price: 229,
    description: 'Satisfying classic black milk tea with premium sweetened boba and velvety cream.',
    category: 'boba',
    image: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'boba-taro',
    name: 'Taro Milk Tea',
    price: 269,
    description: 'Delicate purple sweet taro root infusion, fresh milk, and signature honey tapioca boba clusters, styled beautifully with an elegant lavender taro gradient.',
    category: 'boba',
    image: '/src/assets/images/taro_milk_tea_1781801821114.jpg',
    season: 'All Season'
  },
  {
    id: 'boba-thai-milk',
    name: 'Thai Milk Tea',
    price: 259,
    description: 'Traditional sweet orange spiced Thai tea poured over dynamic crushed ice and chewy tapioca spheres, capturing the beautiful Jaipur twilight glow.',
    category: 'boba',
    image: '/src/assets/images/thai_milk_tea_1781801837789.jpg',
    season: 'All Season'
  },
  {
    id: 'boba-matcha',
    name: 'Kyoto Matcha Bubble Latte',
    price: 279,
    description: 'Authentic Kyoto Uji Matcha whisked fresh and poured over sweet honeyed milk, styled with meticulous bear-ears latte art in the cream.',
    category: 'boba',
    image: '/src/assets/images/kyoto_matcha_latte_1781774569718.jpg',
    season: 'All Season'
  },
  {
    id: 'boba-strawberry-milk',
    name: 'Strawberry Cloud Matcha Latte',
    price: 249,
    description: 'A gorgeous aesthetic three-layered drink of robust sweet highland strawberry reduction, cold organic milk, and rich whisked Kyoto Matcha foam.',
    category: 'boba',
    image: '/src/assets/images/strawberry_matcha_latte_1781774581384.jpg',
    season: 'All Season'
  },
  {
    id: 'boba-oreo-milk',
    name: 'Oreo Milk Tea',
    price: 269,
    description: 'Delicious creamy milk tea layered with plenty of dynamic crushed Oreo cookies and signature boba, served with a whole cookie on the rim.',
    category: 'boba',
    image: '/src/assets/images/oreo_milk_tea_1781801854506.jpg',
    season: 'All Season'
  },
  {
    id: 'boba-peach-green',
    name: 'Peach Green Tea',
    price: 229,
    description: 'Refreshing Darjeeling green tea cold shaked with fresh, sweet peach nectar and popping boba pearls, featuring juicy floating peach slices.',
    category: 'boba',
    image: '/src/assets/images/peach_green_tea_1781801888479.jpg',
    season: 'Summer Only'
  },
  {
    id: 'boba-lychee',
    name: 'Lychee Green Tea',
    price: 229,
    description: 'Refreshing organic Jasmine green tea cold brewed with sweet translucent lychee juice, delicious translucent pulp and boba bits.',
    category: 'boba',
    image: '/src/assets/images/lychee_green_tea_1781801870662.jpg',
    season: 'Summer Only'
  },
  {
    id: 'boba-mango-popping',
    name: 'Mango Popping Boba Tea',
    price: 249,
    description: 'Sweet, tropical Alphonso mango milk tea stacked over mango popping boba spheres that burst delightfully in the mouth.',
    category: 'boba',
    image: '/src/assets/images/mango_iced_latte_1781560724806.jpg',
    season: 'Summer Only'
  },
  {
    id: 'boba-passion-fruit',
    name: 'Passion Fruit Tea',
    price: 239,
    description: 'Tropical, zesty infusion of sweet passion fruit purée with green tea and popping boba.',
    category: 'boba',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=600',
    season: 'Summer Only'
  },
  {
    id: 'boba-blueberry-tea',
    name: 'Blueberry Tea',
    price: 239,
    description: 'Tangy and sweet blueberry nectar layered with organic chilled black tea, chewy honey boba, and fresh floating blueberries.',
    category: 'boba',
    image: '/src/assets/images/blueberry_tea_1781801907501.jpg',
    season: 'All Season'
  },

  // SIGNATURE PLUSH DRINKS (category: 'signature')
  {
    id: 'signature-cloud-brew',
    name: 'Plush Cloud Brew',
    price: 249,
    description: 'Our top-secret cold extraction coffee topped with an ultra-thick, luscious pink sweet cheese foam.',
    category: 'signature',
    isBestseller: true,
    image: '/src/assets/images/plush_cloud_brew_1781802269237.jpg',
    season: 'All Season'
  },
  {
    id: 'signature-strawberry-dream',
    name: 'Strawberry Dream Latte',
    price: 249,
    description: 'Iced organic strawberry milk base, fresh strawberries, finished with a heavy shot of smooth espresso.',
    category: 'signature',
    image: '/src/assets/images/strawberry_dream_latte_1781802283133.jpg',
    season: 'Summer Only'
  },
  {
    id: 'signature-cotton-candy',
    name: 'Cotton Candy Frappe',
    price: 269,
    description: 'A whimsical pink-and-blue frozen treat topped with real high-stacked organic cotton candy cloud.',
    category: 'signature',
    image: '/src/assets/images/cotton_candy_frappe_1781802298475.jpg',
    season: 'Summer Only'
  },
  {
    id: 'signature-pink-velvet',
    name: 'Pink Velvet Cold Coffee',
    price: 259,
    description: 'Jaipur’s absolute favorite! Rich vanilla cold coffee shaken with white chocolate and premium velvet sauce.',
    category: 'signature',
    image: '/src/assets/images/pink_velvet_cold_coffee_1781802311882.jpg',
    season: 'All Season'
  },
  {
    id: 'signature-berry-blast',
    name: 'Berry Blast Smoothie',
    price: 279,
    description: 'Chilled rich blend of organic raspberries, wild blueberries, strawberries, and thick, creamy low-fat yogurt.',
    category: 'signature',
    image: '/src/assets/images/berry_blast_smoothie_1781802325171.jpg',
    season: 'Summer Only'
  },
  {
    id: 'signature-marshmallow-hot',
    name: 'Marshmallow Hot Chocolate',
    price: 239,
    description: 'Rich 70% dark Belgian cocoa melted into warm milk, loaded with pillow-soft pink marshmallows and cocoa powder dust.',
    category: 'signature',
    image: '/src/assets/images/plush_marshmallow_latte_1781801673245.jpg',
    season: 'Winter Only'
  },
  {
    id: 'signature-biscoff-shake',
    name: 'Plush Biscoff Shake',
    price: 279,
    description: 'Thick, creamy cookie-butter milkshake loaded with crushed Lotus Biscoff biscuit crumbles and caramel drizzle.',
    category: 'signature',
    image: '/src/assets/images/plush_biscoff_shake_1781802339391.jpg',
    season: 'All Season'
  },
  {
    id: 'signature-strawberry-cheesecake-shake',
    name: 'Strawberry Cheesecake Shake',
    price: 289,
    description: 'Vanilla ice cream, real Philadelphia cream cheese chunk, wild forest berries, blended into a decadent liquid cake pastry experience.',
    category: 'signature',
    image: '/src/assets/images/strawberry_cheesecake_shake_1781802352845.jpg',
    season: 'All Season'
  },
  {
    id: 'signature-oreo-crunch',
    name: 'Oreo Crunch Shake',
    price: 279,
    description: 'Rich, thick vanilla milkshake loaded with Oreo cookie crumbs, fudge sauce, and heavy whipped cream.',
    category: 'signature',
    image: '/src/assets/images/oreo_milk_tea_1781801854506.jpg', // can reuse or keep high quality original
    season: 'All Season'
  },
  {
    id: 'signature-chocolate-avalanche',
    name: 'Chocolate Avalanche Shake',
    price: 299,
    description: 'Decadent luxury chocolate shake overflowing with brownie pieces, fudge tracks, and melted cocoa drizzle.',
    category: 'signature',
    image: '/src/assets/images/chocolate_avalanche_shake_1781802367619.jpg',
    season: 'All Season'
  },

  // REFRESHERS & COOLERS (category: 'special')
  {
    id: 'special-pink-lemonade',
    name: 'Pink Lemonade',
    price: 199,
    description: 'Bright citrus juice with organic raspberry syrups, served over ice crystals with a lemon wheel garnish.',
    category: 'special',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'special-strawberry-mojito',
    name: 'Strawberry Mojito',
    price: 229,
    description: 'Refreshing muddled mint leaves, sliced strawberries, fresh lime wedges, and bubbly premium sparkling water.',
    category: 'special',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=600',
    season: 'Summer Only'
  },
  {
    id: 'special-watermelon-cooler',
    name: 'Watermelon Cooler',
    price: 219,
    description: 'Chilled pureed sweet watermelon fruit juice with a touch of mint extract and black salt.',
    category: 'special',
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&q=80&w=600',
    season: 'Summer Only'
  },
  {
    id: 'special-peach-iced',
    name: 'Peach Iced Tea',
    price: 199,
    description: 'Golden-brewed black tea shaken with cold peach juice reduction and fresh mint sprigs.',
    category: 'special',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=600',
    season: 'Summer Only'
  },
  {
    id: 'special-blue-lagoon',
    name: 'Blue Lagoon',
    price: 239,
    description: 'A vibrant sparkling mocktail on cracked ice, infused with blue curaçao, sweet & sour syrup, and lime.',
    category: 'special',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=600',
    season: 'Summer Only'
  },
  {
    id: 'special-berry-sparkler',
    name: 'Berry Sparkler',
    price: 249,
    description: 'Mixed forest berry compote top-balanced with sparkling white grape juice and fizzy minerals.',
    category: 'special',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'special-mango-passion',
    name: 'Mango Passion Cooler',
    price: 249,
    description: 'Thick sweet mango purée balanced with dynamic tangy passion fruit extracts and lemon soda.',
    category: 'special',
    image: '/src/assets/images/mango_passion_cooler_1781802479036.jpg',
    season: 'Summer Only'
  },
  {
    id: 'special-cloudberry',
    name: 'Cloudberry Fizz',
    price: 239,
    description: 'A bright, carbonated botanical berry soda capped with sweet, velvety white coconut cloud foam on top.',
    category: 'special',
    image: '/src/assets/images/cloudberry_fizz_1781802508657.jpg',
    season: 'Summer Only'
  },
  {
    id: 'special-rainbow-cooler',
    name: 'Plush Rainbow Cooler',
    price: 259,
    description: 'Five layered vibrant fruit extracts (strawberry, mango, kiwi, lychee, butterfly pea), finished with crystal boba layers.',
    category: 'special',
    isBestseller: true,
    image: '/src/assets/images/plush_rainbow_cooler_1781802491094.jpg',
    season: 'All Season'
  },

  // PANCAKES & WAFFLES (category: 'pancake')
  {
    id: 'pancake-classic',
    name: 'Classic Maple Pancakes',
    price: 249,
    description: 'Triple stacked fluffy pancakes slathered with salted butter and sweet organic Canadian maple syrups.',
    category: 'pancake',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'pancake-nutella',
    name: 'Nutella Pancakes',
    price: 329,
    description: 'Warm thick pancake stack draped in warm rich chocolate Nutella sauce, toasted hazelnuts, and chocolate shavings.',
    category: 'pancake',
    image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'pancake-biscoff',
    name: 'Biscoff Pancakes',
    price: 339,
    description: 'Fluffy stack drizzled with Lotus Biscoff spread, white chocolate sauce, and crumbed Biscoff cookies on top.',
    category: 'pancake',
    image: 'https://images.unsplash.com/photo-1554520735-0a6b8b6ce8b7?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'pancake-strawberry',
    name: 'Strawberry Pancakes',
    price: 319,
    description: 'Fluffy stacks with rich sweet homemade strawberry reduction, whipped cream, and cookie flakes.',
    category: 'pancake',
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&q=80&w=600',
    season: 'Summer Only'
  },
  {
    id: 'pancake-marshmallow',
    name: 'Marshmallow Pancake Tower',
    price: 349,
    description: 'Gigantic, high fluffy tower with layers of warm, melting marshmallow fluff, loaded with hot fudge and toasted graham cracker sprinkles.',
    category: 'pancake',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600',
    season: 'Winter Only'
  },
  {
    id: 'waffle-chocolate',
    name: 'Chocolate Waffle',
    price: 299,
    description: 'Belgian waffle baked crispy black-golden, slathered inside out with thick hot dark chocolate fudge.',
    category: 'pancake',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'waffle-berry',
    name: 'Berry Waffle',
    price: 319,
    description: 'Golden grid waffle loaded with mixed forest berries compote, vanilla custard tracks, and white sugar dust.',
    category: 'pancake',
    image: '/src/assets/images/berry_waffle_1781802538639.jpg',
    season: 'Summer Only'
  },
  {
    id: 'waffle-ice-cream',
    name: 'Ice Cream Waffle',
    price: 339,
    description: 'Crisp waffle topped with two big scoops of vanilla bean and strawberry ice cream with caramel glaze.',
    category: 'pancake',
    image: '/src/assets/images/ice_cream_waffle_1781802521264.jpg',
    season: 'All Season'
  },

  // BAKERY & PASTRIES (category: 'bakery')
  {
    id: 'bakery-croissant-butter',
    name: 'Butter Croissant',
    price: 119,
    description: 'Flaky, buttery French puff pastry with gorgeous golden-brown hollow laminations, served warm with rich butter.',
    category: 'bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'bakery-croissant-chocolate',
    name: 'Chocolate Croissant',
    price: 189,
    description: 'Fresh baked pain au chocolat stuffed with premium Belgian dark chocolate bars and finished with sweet cocoa dusting.',
    category: 'bakery',
    image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'bakery-croissant-nutella',
    name: 'Nutella Croissant',
    price: 199,
    description: 'Wellington baked warm flaky croissant loaded on the inside with rich chocolate Nutella spreads and hazelnuts.',
    category: 'bakery',
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'bakery-croissant-strawberry',
    name: 'Strawberry Cream Croissant',
    price: 219,
    description: 'Fresh sliced croissant stuffed with real premium whipped Madagascar vanilla cream and lots of sweet fresh red strawberries.',
    category: 'bakery',
    image: 'https://images.unsplash.com/photo-1620921556328-1a9300dce76d?auto=format&fit=crop&q=80&w=600',
    season: 'Winter Only'
  },
  {
    id: 'bakery-croissant-biscoff',
    name: 'Biscoff Croissant',
    price: 229,
    description: 'Buttery flaky roll dressed in specs of warm cookie butter sauce, loaded with dynamic speculoos crumbs and biscuit bits.',
    category: 'bakery',
    image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'bakery-cinnamon-roll',
    name: 'Cinnamon Roll',
    price: 189,
    description: 'Danish pastry dough rolled with premium organic cinnamon, baked golden-brown and slathered with rich cream-cheese butter frosting.',
    category: 'bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'bakery-muffin-coco',
    name: 'Chocolate Muffin',
    price: 149,
    description: 'Dense, moist rich chocolate cake muffin loaded with dark cocoa chips and a soft, gooey core.',
    category: 'bakery',
    image: 'https://images.unsplash.com/photo-1624462966581-bc6d768cbce5?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'bakery-muffin-velvet',
    name: 'Red Velvet Muffin',
    price: 159,
    description: 'Bright red cocoa sponge muffin loaded with premium sweet core cream cheese icing and soft sprinkles.',
    category: 'bakery',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'bakery-muffin-blueberry',
    name: 'Blueberry Muffin',
    price: 159,
    description: 'Velvety sweet cake muffin exploding with organic forest blueberries and topped with a delicate golden sugar glaze.',
    category: 'bakery',
    image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'bakery-banana-cake',
    name: 'Banana Walnut Cake',
    price: 179,
    description: 'Moist slice of classic single-pan banana cake baked with organic honey and loaded with freshly roasted walnuts.',
    category: 'bakery',
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },

  // SANDWICHES & BAGELS (category: 'sandwich')
  {
    id: 'sandwich-three-cheese',
    name: 'Three Cheese Melt',
    price: 249,
    description: 'Grilled sourdough flat bread filled with hot, gooey, melting Cheddar, Mozzarella, and Monterey Jack cheese blend.',
    category: 'sandwich',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'sandwich-mushroom-melt',
    name: 'Mushroom Melt',
    price: 269,
    description: 'Sautéed mushrooms, herbs, garlic, and bubbly melted Swiss cheese over crispy toasted sourdough slices.',
    category: 'sandwich',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600',
    season: 'Winter Only'
  },
  {
    id: 'sandwich-veggie',
    name: 'Veggie Delight Sandwich',
    price: 239,
    description: 'Crisp layered cucumber, heirloom tomato, bell pepper bands, cheddar cheese, and fresh mint mayo inside home-baked whole wheat slices.',
    category: 'sandwich',
    image: 'https://images.unsplash.com/photo-1540713434306-53f2c2115091?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'sandwich-pesto-paneer',
    name: 'Pesto Paneer Sandwich',
    price: 279,
    description: 'Fresh cottage cheese blocks tossed in basil pesto, grilled between crusty sourdough panels with melted mozzarella.',
    category: 'sandwich',
    image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'bagel-garlic',
    name: 'Garlic Cheese Bagel',
    price: 229,
    description: 'Freshly toasted sesame bagel loaded with rich garlic-herb butter, cream cheese, and melting mozzarella locks.',
    category: 'sandwich',
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'bagel-avocado',
    name: 'Avocado Cream Cheese Bagel',
    price: 299,
    description: 'Fragrant open bagel stuffed with rich whipped cream cheese, smashed organic key-lime avocados, and herbs.',
    category: 'sandwich',
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'bagel-nutella',
    name: 'Nutella Strawberry Bagel',
    price: 269,
    description: 'Toasted sweet bagel slathered with rich cocoa hazelnut spread and plenty of fresh strawberry discs.',
    category: 'sandwich',
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=601',
    season: 'Winter Only'
  },
  {
    id: 'bagel-corn',
    name: 'Mexican Corn Bagel',
    price: 259,
    description: 'Toasted bagel topped with sweet grilled sweetcorn kernels, tangy chili powder, cream cheese and cilantro.',
    category: 'sandwich',
    image: 'https://images.unsplash.com/photo-1584770826886-dfc2c6204c31?auto=format&fit=crop&q=80&w=600',
    season: 'Summer Only'
  },

  // PASTA & SAVORY MEALS (category: 'savory')
  {
    id: 'savory-pasta-pink',
    name: 'Pink Sauce Pasta',
    price: 299,
    description: 'Penne pasta boiled and tossed in our highly aesthetic fusion of fresh tomato arrabbiata and velvety cream sauces, topped with basil.',
    category: 'savory',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'savory-pasta-alfredo',
    name: 'Alfredo Pasta',
    price: 329,
    description: 'Rich penne pasta tossed in a luxurious golden sauce of cream, sweet farm butter, and lots of shredded Parmesan cheese.',
    category: 'savory',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'savory-pasta-arrabbiata',
    name: 'Arrabbiata Pasta',
    price: 309,
    description: 'Fiery penne pasta simmered in rich pomodoro tomato ragù, garlic, red peppers, chili flakes, and virgin olive oil.',
    category: 'savory',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'savory-mac-cheese',
    name: 'Mac & Cheese',
    price: 319,
    description: 'Elbow macaroni tossed in a smooth, ultra-rich, dynamic cheese sauce made of four melted premium cheeses.',
    category: 'savory',
    image: 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'savory-baked-pasta',
    name: 'Cheesy Baked Pasta',
    price: 349,
    description: 'Succulent pasta layers, tomato compote, loaded inside out with a thick, golden, bubbly cheese crust.',
    category: 'savory',
    image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'savory-nachos',
    name: 'Veg Loaded Nachos',
    price: 289,
    description: 'Mountain of crispy tortilla chips slathered in warm pink cheese sauce, diced tomatoes, jalapeños, and sweetcorn.',
    category: 'savory',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'savory-french-fries',
    name: 'Peri Peri Fries',
    price: 229,
    description: 'Crisp golden potato fries tossed in fiery Peri-Peri seasoning, loaded with warm melted pink cheese sauce.',
    category: 'savory',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'savory-cheese-fries',
    name: 'Cheese Fries',
    price: 249,
    description: 'Fresh, golden fried batons drowned in rich, luxurious melted Cheddar cheese sauces.',
    category: 'savory',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'savory-garlic-bread',
    name: 'Garlic Bread',
    price: 199,
    description: 'Classic freshly toasted baguettes loaded with rich, fragrant garlic-herb butter.',
    category: 'savory',
    image: 'https://images.unsplash.com/photo-1573145952046-5216d54414f8?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'savory-cheesy-garlic',
    name: 'Cheesy Garlic Bread',
    price: 229,
    description: 'Toasted baguette slices with rich garlic-herb butter topped with premium bubbling Mozzarella strands.',
    category: 'savory',
    image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },

  // MINI CAFÉ PIZZAS (category: 'pizza')
  {
    id: 'pizza-margherita',
    name: 'Margherita Pizza (With Cheesy Bear!)',
    price: 299,
    description: 'Delicious personal Neapolitan thin crust pizza topped with rich pomodoro sauce, pull-apart premium mozzarella, fresh leafy basil, and a cute melted cheese bear-shape right in the center!',
    category: 'pizza',
    image: '/src/assets/images/margherita_bear_pizza_1781774501883.jpg',
    season: 'All Season'
  },
  {
    id: 'pizza-farm-fresh',
    name: 'Plush Fig & Goat Cheese Pizza',
    price: 349,
    description: 'An artisanal gourmet sweet & savory personal-size pizza topped with premium dark sliced figs, double melted mozzarella, soft goat cheese crumbles, and fresh green basil!',
    category: 'pizza',
    image: '/src/assets/images/plush_fig_pizza_1781774555610.jpg',
    season: 'All Season'
  },
  {
    id: 'pizza-corn-cheese',
    name: 'Corn & Cheese Pizza',
    price: 329,
    description: 'A sweet and savory fan favorite of loaded gold sweetcorn kernels and dynamic double-mozzarella cheese layers.',
    category: 'pizza',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=600',
    season: 'Summer Only'
  },
  {
    id: 'pizza-mushroom',
    name: 'Mushroom Lovers Pizza (With Chef Bear)',
    price: 359,
    description: 'A premium pizza loaded with sautéed button and wild forest mushrooms, white garlic spread, and bubbly melted mozzarella, served on a round plate next to a tiny chef teddy bear!',
    category: 'pizza',
    image: '/src/assets/images/mushroom_lovers_pizza_1781774516706.jpg',
    season: 'Winter Only'
  },
  {
    id: 'pizza-pink-sauce',
    name: 'Pink Sauce Pizza',
    price: 369,
    description: 'Our house-special fusion! Creamy tomato pink sauce base spread over pizza dough, loaded with cheeses and jalapeños.',
    category: 'pizza',
    isBestseller: true,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },

  // DESSERTS (category: 'dessert')
  {
    id: 'dessert-matcha-bear',
    name: 'Plush Matcha Bear Cake',
    price: 380,
    description: 'An elegant single-serving circular green matcha mousse cake styled on an elegant dish, topped with an adorable sweet edible fondant brown bear sitting on top!',
    category: 'dessert',
    image: '/src/assets/images/matcha_bear_cake_1781774534750.jpg',
    isBestseller: true,
    season: 'All Season'
  },
  {
    id: 'dessert-cheesecake-strawberry',
    name: 'Strawberry Cheesecake',
    price: 249,
    description: 'Creamy New York-style cheesecake slice topped with high glossy, sweet red strawberry glaze.',
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=600',
    season: 'Summer Only'
  },
  {
    id: 'dessert-cheesecake-blueberry',
    name: 'Blueberry Cheesecake',
    price: 259,
    description: 'Premium creamy cheesecake slice layered on buttery cracker crust, finished with a luscious sweet blueberry topping.',
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'dessert-cheesecake-biscoff',
    name: 'Biscoff Cheesecake',
    price: 269,
    description: 'Cheesecake baked with real Lotus speculoos spread, loaded with speculoos biscuits crumbs.',
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'dessert-brownie',
    name: 'Chocolate Brownie',
    price: 179,
    description: 'Dense, rich, ultra-fudgy cocoa brownie squares baked with lots of chocolate chunks.',
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'dessert-marshmallow-cup',
    name: 'Marshmallow Dream Cup',
    price: 279,
    description: 'Layered cup of warm fudge cake, fluffy sweet marshmallow creme, toasted top, and tiny strawberry stars.',
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600',
    season: 'Winter Only'
  },
  {
    id: 'dessert-sundae',
    name: 'Plush Sundae',
    price: 299,
    description: 'Three giant scoops of luxury strawberry and vanilla ice cream, loaded with marshmallows, fresh strawberries, and pink rainbow sprinkles.',
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=600',
    season: 'Summer Only'
  },
  {
    id: 'dessert-cookie-dough',
    name: 'Cookie Dough Cup',
    price: 249,
    description: 'Edible chocolate chip raw-cookie-butter chunks packed in sweet visual dessert cups with cream dollops.',
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1624462966581-bc6d768cbce5?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  },
  {
    id: 'dessert-lava-cake',
    name: 'Chocolate Lava Cake',
    price: 249,
    description: 'Warm cocoa rich sponge cake with an overflowing, decadent hot chocolate avalanche core.',
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600',
    season: 'All Season'
  }
];

// Assign unique Lucide-react iconography to each drink item in the menu data
curatedMenuItems.forEach(item => {
  if (item.category === 'coffee') {
    if (['coffee-espresso', 'coffee-double-espresso'].includes(item.id) || item.name.toLowerCase().includes('espresso')) {
      item.iconName = 'Bean';
    } else {
      item.iconName = 'Coffee';
    }
  } else if (item.category === 'boba') {
    item.iconName = 'CupSoda';
  } else if (item.category === 'signature') {
    if (['signature-cotton-candy', 'signature-berry-blast'].includes(item.id)) {
      item.iconName = 'Sparkles';
    } else if (item.name.toLowerCase().includes('latte') || item.name.toLowerCase().includes('chocolate')) {
      item.iconName = 'Coffee';
    } else {
      item.iconName = 'CupSoda';
    }
  } else if (item.category === 'special') {
    item.iconName = 'GlassWater';
  } else if (item.category === 'pizza') {
    item.iconName = 'Pizza';
  } else if (item.category === 'sandwich' || item.category === 'bagel' || item.id.includes('bagel')) {
    item.iconName = 'GlassWater'; // or default to general food icons
  } else if (item.category === 'bakery') {
    // Other categories can have safe placeholders or defaults
  }
});

