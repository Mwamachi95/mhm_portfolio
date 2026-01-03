import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Illustrations',
  description: 'Browse illustration work and visual art by Heinz Mwamachi.',
  openGraph: {
    title: 'Illustrations',
    description: 'Browse illustration work and visual art by Heinz Mwamachi.',
  },
};

export default function IllustrationsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-6xl font-bold text-[#1B3033]">Illustrations</h1>
    </div>
  );
}
