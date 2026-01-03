import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Websites',
  description: 'Explore website design and development projects by Heinz Mwamachi.',
  openGraph: {
    title: 'Websites',
    description: 'Explore website design and development projects by Heinz Mwamachi.',
  },
};

export default function WebsitesPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-6xl font-bold text-[#1B3033]">Websites</h1>
    </div>
  );
}
