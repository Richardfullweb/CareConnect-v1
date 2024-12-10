import React from 'react';
import { 
  Camera, 
  Book, 
  ShoppingCart, 
  MessageSquare, 
  BarChart3,
  Wrench,
  Zap,
  Database,
  Shield,
  Clock
} from 'lucide-react';

export default function Features() {
  return (
    <section className="py-20 bg-white" id="recursos">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Recursos Completos para sua Oficina
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Uma plataforma completa que revoluciona a forma como você trabalha, 
            economizando tempo e aumentando a precisão.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Camera />}
            title="Reconhecimento de Imagem"
            description="Upload de fotos de peças com identificação automática e modelos compatíveis"
          />
          <FeatureCard
            icon={<Book />}
            title="Documentação Técnica"
            description="Acesso a manuais de peças, especificações e códigos de referência"
          />
          <FeatureCard
            icon={<ShoppingCart />}
            title="Gestão de Estoque"
            description="Encontre fornecedores próximos e compare preços em tempo real"
          />
          <FeatureCard
            icon={<MessageSquare />}
            title="Suporte Técnico"
            description="Chatbot especializado e guias passo a passo para instalação"
          />
          <FeatureCard
            icon={<BarChart3 />}
            title="Dashboard Administrativo"
            description="Gestão completa de catálogo e análise de dados"
          />
          <FeatureCard
            icon={<Wrench />}
            title="Ferramentas Recomendadas"
            description="Sugestões inteligentes de ferramentas para cada serviço"
          />
        </div>

        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher o MechanicAI?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <BenefitCard
              icon={<Zap />}
              title="Rápido e Preciso"
              description="Identificação de peças em segundos com alta precisão"
            />
            <BenefitCard
              icon={<Database />}
              title="Sempre Atualizado"
              description="Base de dados constantemente atualizada com novos modelos"
            />
            <BenefitCard
              icon={<Shield />}
              title="Seguro e Confiável"
              description="Dados protegidos com criptografia de ponta a ponta"
            />
            <BenefitCard
              icon={<Clock />}
              title="Economia de Tempo"
              description="Reduza o tempo de diagnóstico e pesquisa"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-500 transition-all duration-300 hover:shadow-lg">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
        <div className="text-blue-600">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function BenefitCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center p-6">
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <div className="text-blue-600">{icon}</div>
      </div>
      <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}