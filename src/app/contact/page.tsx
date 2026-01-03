import { Metadata } from 'next'
import { ContactCTA } from '@/components/sections/ContactCTA';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch to start your next project. Whether you have a project in mind or just want to connect, I would love to hear from you.',
  openGraph: {
    title: 'Contact',
    description: 'Get in touch to start your next project. Whether you have a project in mind or just want to connect, I would love to hear from you.',
  },
};

export default function ContactPage() {
  return (
    <main>
      <ContactCTA />
    </main>
  );
}
