import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ideas',
  description: 'Explore creative concepts and experimental design ideas by Heinz Mwamachi.',
  openGraph: {
    title: 'Ideas',
    description: 'Explore creative concepts and experimental design ideas by Heinz Mwamachi.',
  },
};

export default function IdeasPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-6xl font-bold text-[#1B3033]">Ideas</h1>
    </div>
  );
}
