import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, User, Heart, X } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import NotificationBell from './notifications/NotificationBell';
import { toast } from 'sonner';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <nav className="bg-white shadow-lg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Heart className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-2xl font-bold text-indigo-600">CareConnect</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              to="/search"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Buscar Cuidadores
            </Link>
            <Link
              to="/how-it-works"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Como Funciona
            </Link>
            <Link
              to="/pricing"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Preços
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <NotificationBell />
                <div className="relative">
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <User className="h-6 w-6" />
                    )}
                  </button>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sair
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Cadastrar
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/search"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              Buscar Cuidadores
            </Link>
            <Link
              to="/how-it-works"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              Como Funciona
            </Link>
            <Link
              to="/pricing"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              Preços
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}