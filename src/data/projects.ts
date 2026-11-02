import type { Lang } from '../i18n';

type L = Record<Lang, string>;
export interface Project {
  slug: string;
  title: L;
  /** Photos in display order; the first is the cover. `name` matches src/data/media.json. */
  photos: { name: string; alt: L }[];
}

const p = (name: string, en: string, es: string) => ({ name, alt: { en, es } });

// Slugs keep the old URLs (including deep-blue-see). Order as on the old Inspirations page.
export const PROJECTS: Project[] = [
  {
    slug: 'one-bedroom',
    title: { en: 'One bedroom', es: 'Un dormitorio' },
    photos: [
      p(
        'one-bedroom-1',
        'Kitchen with a tiled bar and three wooden stools',
        'Cocina con barra alicatada y tres taburetes de madera',
      ),
      p('one-bedroom-2', 'Stone archway opening onto a dining area', 'Arco de piedra que da a un comedor'),
      p(
        'one-bedroom-3',
        'Round dining table with black chairs and a palm',
        'Mesa redonda de comedor con sillas negras y una palmera',
      ),
    ],
  },
  {
    slug: 'man-cave',
    title: { en: 'Man cave', es: 'Cuarto de hombre' },
    photos: [
      p(
        'man-cave-1',
        'Timber staircase with a black railing and wall lights',
        'Escalera de madera con barandilla negra y apliques',
      ),
      p(
        'man-cave-2',
        'Wall of oak panelling in a concrete room',
        'Pared de paneles de roble en una estancia de hormigón',
      ),
      p(
        'man-cave-3',
        'Bedroom corner with a padded headboard and oak panel',
        'Rincón de dormitorio con cabecero tapizado y panel de roble',
      ),
      p('man-cave-4', 'Built-in oak shelving with a wine rack', 'Estantería de roble empotrada con botellero'),
    ],
  },
  {
    slug: 'home-from-home',
    title: { en: 'Home from home', es: 'Hogar lejos del hogar' },
    photos: [
      p(
        'home-from-home-1',
        'Beige sofa below a framed artwork on a panelled wall',
        'Sofá beige bajo una obra enmarcada en una pared con molduras',
      ),
      p('home-from-home-2', 'Bathroom with a freestanding bath behind glass', 'Baño con bañera exenta tras un cristal'),
      p(
        'home-from-home-3',
        'Bedroom with a pendant lamp and full-height curtains',
        'Dormitorio con lámpara colgante y cortinas hasta el suelo',
      ),
    ],
  },
  {
    slug: 'earthy-relax',
    title: { en: 'Earthy relax', es: 'Relajación terrenal' },
    photos: [
      p(
        'earthy-relax-1',
        'Living room in earth tones with sheer curtains and a palm',
        'Salón en tonos tierra con visillos y una palmera',
      ),
      p('earthy-relax-2', 'Bedroom with a tall upholstered headboard', 'Dormitorio con un alto cabecero tapizado'),
    ],
  },
  {
    slug: 'deep-blue-see',
    title: { en: 'Deep blue sea', es: 'Azul profundo' },
    photos: [
      p(
        'deep-blue-see-1',
        'View through a doorway to a blue kitchen, with cotton stems',
        'Vista por una puerta hacia una cocina azul, con ramas de algodón',
      ),
      p(
        'deep-blue-see-2',
        'Blue kitchen with a marble island and steel hood',
        'Cocina azul con isla de mármol y campana de acero',
      ),
      p(
        'deep-blue-see-3',
        'Blue cabinetry with a wine rack and marble counter',
        'Armarios azules con botellero y encimera de mármol',
      ),
    ],
  },
  {
    slug: 'blue-charm',
    title: { en: 'Blue charm', es: 'Encanto azul' },
    photos: [
      p(
        'blue-charm-1',
        'Open living and dining room with teal curtains',
        'Salón comedor abierto con cortinas verde azulado',
      ),
      p(
        'blue-charm-2',
        'Dining table seen from the living room by the window',
        'Mesa de comedor vista desde el salón junto a la ventana',
      ),
      p(
        'blue-charm-3',
        'Two armchairs under an arc lamp beside teal curtains',
        'Dos butacas bajo una lámpara de arco junto a cortinas verde azulado',
      ),
    ],
  },
  {
    slug: '20th-floor-apartment',
    title: { en: '20th floor apartment', es: 'Apartamento en la planta 20' },
    photos: [
      p(
        '20th-floor-apartment-1',
        'Dining table by floor-to-ceiling windows and a textured wall',
        'Mesa de comedor junto a ventanales y una pared con textura',
      ),
      p(
        '20th-floor-apartment-2',
        'White kitchen with bar stools and glazed partitions',
        'Cocina blanca con taburetes y mamparas de cristal',
      ),
      p(
        '20th-floor-apartment-3',
        'Open living space with black pendant lights',
        'Espacio de estar abierto con lámparas colgantes negras',
      ),
      p(
        '20th-floor-apartment-4',
        'Dining room framed by oak shelving and a city view',
        'Comedor enmarcado por estantes de roble y vistas a la ciudad',
      ),
    ],
  },
];
