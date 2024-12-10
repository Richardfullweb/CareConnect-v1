import React from 'react';
import { Camera, Book, ShoppingCart } from 'lucide-react';
import TrialModal from './TrialModal';

export default function Hero() {
  const [isTrialModalOpen, setTrialModalOpen] = React.useState(false);

  return (
    <>
      <div className="pt-24 pb-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Inteligência Artificial para sua{' '}
              <span className="text-blue-600">Oficina Mecânica</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Identifique peças, acesse documentação técnica e gerencie seu estoque com a 
              plataforma mais avançada do mercado automotivo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setTrialModalOpen(true)}
                className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition"
              >
                Experimente Grátis
              </button>
              <button className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition">
                Agendar Demo
              </button>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Camera className="h-8 w-8 text-blue-600" />}
              title="Identificação Visual"
              description="Reconhecimento preciso de peças através de fotos usando IA avançada"
            />
            <FeatureCard
              icon={<Book className="h-8 w-8 text-blue-600" />}
              title="Documentação Técnica"
              description="Acesso instantâneo a manuais e especificações técnicas"
            />
            <FeatureCard
              icon={<ShoppingCart className="h-8 w-8 text-blue-600" />}
              title="Gestão de Estoque"
              description="Encontre fornecedores e gerencie seu inventário facilmente"
            />
          </div>
        </div>
      </div>

      <TrialModal 
        isOpen={isTrialModalOpen}
        onClose={() => setTrialModalOpen(false)}
      />
    </>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}