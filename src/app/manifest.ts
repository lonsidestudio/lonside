import { MetadataRoute } from 'next';
import frMessages from '@/lib/i18n/messages/fr.json';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: frMessages.metadata.defaultTitle,
    short_name: 'Lonside',
    description: frMessages.metadata.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      { src: '/icon-48.png', sizes: '48x48', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  };
}
