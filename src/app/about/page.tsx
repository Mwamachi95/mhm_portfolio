import { Metadata } from 'next';
import { AboutContent } from '@/components/sections/AboutContent';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Heinz Mwamachi, a multidisciplinary designer based in Nairobi, Kenya, creating brand experiences and websites at the intersection of architecture and digital design.',
  openGraph: {
    title: 'About',
    description: 'Learn about Heinz Mwamachi, a multidisciplinary designer based in Nairobi, Kenya, creating brand experiences and websites at the intersection of architecture and digital design.',
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
