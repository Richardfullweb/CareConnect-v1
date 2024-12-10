import React from 'react';
import { Mail } from 'lucide-react';

export default function ForgotPasswordForm() {
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Handle password reset logic
  };

  if (submitted) {
    return (
      <div className="text-center">
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Mail className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                E-mail enviado com sucesso!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  Verifique sua caixa de entrada para instruções sobre como redefinir sua senha.
                </p>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Tentar outro e-mail
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          E-mail
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-primary pl-10"
            placeholder="seu@email.com"
          />
        </div>
      </div>

      <div>
        <button type="submit" className="w-full btn-primary">
          Enviar Link de Recuperação
        </button>
      </div>

      <div className="text-center">
        <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          Voltar para o login
        </a>
      </div>
    </form>
  );
}