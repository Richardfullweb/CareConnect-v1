import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Wrench, ChevronDown } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const isLoggedIn = false; // Replace with actual auth state

  return (
    <header className="fixed w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">MechanicAI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <NavLinks />
            {isLoggedIn ? (
              <Link 
                to="/dashboard"
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Dashboard
              </Link>
            ) : (
              <button 
                onClick={() => location.pathname !== '/dashboard' && setIsOpen(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Começar Agora
              </button>
            )}
          </div>

          <button 
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4">
            <NavLinks mobile />
            <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition mt-4">
              Começar Agora
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

function NavLinks({ mobile }: { mobile?: boolean }) {
  const baseStyles = mobile
    ? "flex flex-col gap-4"
    : "flex items-center gap-8";

  return (
    <div className={baseStyles}>
      <NavDropdown 
        title="Soluções"
        items={["Identificação de Peças", "Documentação Técnica", "Gestão de Estoque"]}
      />
      <NavDropdown
        title="Recursos"
        items={["Para Oficinas", "Para Distribuidores", "Para Fabricantes"]}
      />
      <Link to="#precos" className="text-gray-600 hover:text-gray-900">Preços</Link>
      <Link to="#contato" className="text-gray-600 hover:text-gray-900">Contato</Link>
    </div>
  );
}

function NavDropdown({ title, items }: { title: string; items: string[] }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <ChevronDown className="h-4 w-4" />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
          {items.map((item) => (
            <Link
              key={item}
              to="#"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}