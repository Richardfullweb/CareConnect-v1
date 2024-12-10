import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const registerSchema = z.object({
  name: z.string().min(3, 'Nome completo é obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  confirmPassword: z.string(),
  role: z.enum(['client', 'caregiver'], {
    required_error: 'Selecione um tipo de conta'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword']
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
}

export default function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const handleFormSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      toast.success('Conta criada com sucesso!');
    } catch (error: any) {
      toast.error(
        error.code === 'auth/email-already-in-use'
          ? 'Este e-mail já está em uso'
          : 'Erro ao criar conta. Tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nome Completo
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="input-primary pl-10"
            placeholder="Seu nome completo"
          />
        </div>
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.name.message}
          </p>
        )}
      </div>

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
            type="email"
            {...register('email')}
            className="input-primary pl-10"
            placeholder="seu@email.com"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Senha
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="input-primary pl-10"
            placeholder="********"
          />
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirmar Senha
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className="input-primary pl-10"
            placeholder="********"
          />
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tipo de Conta
        </label>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <label className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none hover:border-indigo-500">
            <input
              type="radio"
              value="client"
              {...register('role')}
              className="sr-only peer"
            />
            <span className="flex flex-1">
              <span className="flex flex-col">
                <span className="block text-sm font-medium text-gray-900 peer-checked:text-indigo-600">
                  Cliente
                </span>
                <span className="mt-1 flex items-center text-sm text-gray-500 peer-checked:text-indigo-600">
                  Procuro um cuidador
                </span>
              </span>
            </span>
            <span
              className="pointer-events-none absolute -inset-px rounded-lg border-2 peer-checked:border-indigo-600"
              aria-hidden="true"
            />
          </label>
          <label className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none hover:border-indigo-500">
            <input
              type="radio"
              value="caregiver"
              {...register('role')}
              className="sr-only peer"
            />
            <span className="flex flex-1">
              <span className="flex flex-col">
                <span className="block text-sm font-medium text-gray-900 peer-checked:text-indigo-600">
                  Cuidador
                </span>
                <span className="mt-1 flex items-center text-sm text-gray-500 peer-checked:text-indigo-600">
                  Ofereço serviços
                </span>
              </span>
            </span>
            <span
              className="pointer-events-none absolute -inset-px rounded-lg border-2 peer-checked:border-indigo-600"
              aria-hidden="true"
            />
          </label>
        </div>
        {errors.role && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.role.message}
          </p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full btn-primary ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
              <span className="ml-2">Criando conta...</span>
            </div>
          ) : (
            'Criar Conta'
          )}
        </button>
      </div>

      <div className="text-center">
        <span className="text-sm text-gray-600">
          Já tem uma conta?{' '}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Entrar
          </Link>
        </span>
      </div>
    </form>
  );
}