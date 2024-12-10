import React, { useState } from 'react';
import { X } from 'lucide-react';
import { sendTrialSignupToN8N } from '../services/n8nService';

interface TrialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrialModal({ isOpen, onClose }: TrialModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await sendTrialSignupToN8N(formData);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({ name: '', email: '', company: '' });
      }, 2000);
    } catch (err) {
      setError('Ocorreu um erro. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Comece seu Período Gratuito
          </h3>
          <p className="text-gray-600">
            14 dias grátis, sem compromisso. Cancele a qualquer momento.
          </p>
        </div>

        {success ? (
          <div className="text-center text-green-600 py-8">
            <p className="text-xl font-semibold">Cadastro realizado com sucesso!</p>
            <p className="mt-2">Verifique seu email para próximos passos.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite seu nome"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Profissional
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Oficina
              </label>
              <input
                type="text"
                id="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nome da sua oficina"
                required
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition
                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
              {loading ? 'Processando...' : 'Começar Período Gratuito'}
            </button>
          </form>
        )}

        <p className="text-sm text-gray-500 text-center mt-4">
          Ao se cadastrar, você concorda com nossos{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Termos de Serviço
          </a>{' '}
          e{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Política de Privacidade
          </a>
        </p>
      </div>
    </div>
  );
}