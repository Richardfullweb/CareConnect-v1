import React from 'react';
import { Wrench, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Wrench className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">MechanicAI</span>
            </div>
            <p className="text-gray-400 mb-6">
              Transformando oficinas mecânicas com inteligência artificial
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Facebook />} />
              <SocialIcon icon={<Twitter />} />
              <SocialIcon icon={<Instagram />} />
              <SocialIcon icon={<Linkedin />} />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Produto</h4>
            <FooterLinks
              links={[
                "Recursos",
                "Integrações",
                "Preços",
                "FAQ",
                "Atualizações"
              ]}
            />
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Empresa</h4>
            <FooterLinks
              links={[
                "Sobre nós",
                "Carreiras",
                "Blog",
                "Imprensa",
                "Parceiros"
              ]}
            />
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Suporte</h4>
            <FooterLinks
              links={[
                "Central de Ajuda",
                "Documentação",
                "Status",
                "Contato",
                "API"
              ]}
            />
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© 2024 MechanicAI. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <a
      href="#"
      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition"
    >
      {icon}
    </a>
  );
}

function FooterLinks({ links }: { links: string[] }) {
  return (
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link}>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition"
          >
            {link}
          </a>
        </li>
      ))}
    </ul>
  );
}