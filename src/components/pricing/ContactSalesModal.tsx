import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Mail, Phone, Building, User, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const contactSchema = z.object({
  name: z.string().min(3, 'Nome completo é obrigatório'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone é obrigatório'),
  company: z.string().optional(),
  message: z.string().min(10, 'Mensagem é obrigatória'),
  plan: z.string()
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: string;
}

export default function ContactSalesModal({
  isOpen,
  onClose,
  selectedPlan
}: ContactSalesModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      plan: selectedPlan
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // In a real app, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Contact form data:', data);
      toast.success('Mensagem enviada com sucesso! Em breve entraremos em contato.');
      reset();
      onClose();
    } catch (error) {
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Falar com Vendas</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome Completo
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
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
              <label className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
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
              <label className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  {...register('phone')}
                  className="input-primary pl-10"
                  placeholder="(00) 00000-0000"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Empresa (opcional)
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  {...register('company')}
                  className="input-primary pl-10"
                  placeholder="Nome da sua empresa"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mensagem
              </label>
              <textarea
                {...register('message')}
                rows={4}
                className="mt-1 input-primary"
                placeholder="Como podemos ajudar?"
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.message.message}
                </p>
              )}
            </div>

            <input type="hidden" {...register('plan')} />

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                    <span className="ml-2">Enviando...</span>
                  </div>
                ) : (
                  'Enviar Mensagem'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}