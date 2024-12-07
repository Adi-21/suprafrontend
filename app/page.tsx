import LendingInterface from '@/components/LendingInterface';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12">
        <h1 className="text-3xl font-bold text-center mb-12">
          Supra Lending Protocol
        </h1>
        <LendingInterface />
      </div>
    </main>
  );
}