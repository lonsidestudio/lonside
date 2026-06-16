import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'lonside — Design & Ingénierie Digitale Augmentés',
    short_name: 'lonside',
    description: 'Création de sites internet et applications sur-mesure par des experts augmentés par l\'IA.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#7c3aed',
    icons: [
      { src: '/icon', sizes: '32x32', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
