import React from 'react';
import { Check } from 'lucide-react';

export default function Pricing() {
  return (
    <section className="py-20 bg-gray-50" id="precos">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Planos para Todos os Tamanhos de Oficina
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Escolha o plano ideal para suas necessidades e comece a transformar sua oficina hoje mesmo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PriceCard
            title="Básico"
            price="199"
            description="Ideal para oficinas pequenas"
            features={[
              "Identificação de peças via foto",
              "Acesso à documentação básica",
              "Suporte via chat",
              "1 usuário",
            ]}
          />
          <PriceCard
            title="Profissional"
            price="399"
            description="Para oficinas em crescimento"
            features={[
              "Tudo do plano Básico",
              "Múltiplos usuários",
              "Integração com fornecedores",
              "Relatórios avançados",
              "Suporte prioritário"
            ]}
            highlighted
          />
          <PriceCard
            title="Enterprise"
            price="Personalizado"
            description="Para redes de oficinas"
            features={[
              "Tudo do plano Profissional",
              "API personalizada",
              "Gerenciamento de múltiplas unidades",
              "Suporte 24/7",
              "Treinamento dedicado"
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function PriceCard({ 
  title, 
  price, 
  description, 
  features,
  highlighted = false 
}: {
  title: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div className={`
      rounded-2xl p-8 
      ${highlighted 
        ? 'bg-blue-600 text-white transform scale-105 shadow-xl' 
        : 'bg-white text-gray-900 shadow-lg'
      }
    `}>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className={highlighted ? 'text-blue-100' : 'text-gray-600'}>
        {description}
      </p>
      <div className="my-8">
        <span className="text-4xl font-bold">
          {price === 'Personalizado' ? '' : 'R$'}
        </span>
        <span className="text-5xl font-bold">{price}</span>
        {price !== 'Personalizado' && (
          <span className={highlighted ? 'text-blue-100' : 'text-gray-600'}>
            /mês
          </span>
        )}
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <Check className={`h-5 w-5 ${highlighted ? 'text-blue-100' : 'text-blue-600'}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button className={`
        w-full py-3 px-6 rounded-full font-semibold transition
        ${highlighted
          ? 'bg-white text-blue-600 hover:bg-blue-50'
          : 'bg-blue-600 text-white hover:bg-blue-700'
        }
      `}>
        Começar Agora
      </button>
    </div>
  );
}