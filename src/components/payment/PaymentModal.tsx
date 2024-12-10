import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, CreditCard, Calendar, Lock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { ServiceRequest } from '../../types';

const paymentSchema = z.object({
  cardNumber: z.string()
    .min(16, 'Número do cartão inválido')
    .max(16, 'Número do cartão inválido')
    .regex(/^\d+$/, 'Apenas números são permitidos'),
  cardName: z.string().min(3, 'Nome do titular é obrigatório'),
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Data inválida (MM/YY)'),
  cvv: z.string()
    .min(3, 'CVV inválido')
    .max(4, 'CVV inválido')
    .regex(/^\d+$/, 'Apenas números são permitidos'),
  saveCard: z.boolean().optional(),
  installments: z.number().min(1).max(12)
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceRequest: ServiceRequest;
  totalAmount: number;
  onPaymentSuccess: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  serviceRequest,
  totalAmount,
  onPaymentSuccess
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema)
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: PaymentFormData) => {
    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would make an API call to your payment processor
      console.log('Processing payment:', {
        serviceRequest,
        paymentData: data,
        amount: totalAmount
      });

      toast.success('Pagamento realizado com sucesso!');
      onPaymentSuccess();
      handleClose();
    } catch (error) {
      toast.error('Erro ao processar pagamento. Tente novamente.');
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const installmentOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}x ${i === 0 ? 'de' : 'de R$'} ${(totalAmount / (i + 1)).toFixed(2)}${i === 0 ? ' à vista' : ''}`
  }));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleClose} />
        
        <div className="relative bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Pagamento Seguro</h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total a pagar:</p>
              <p className="text-2xl font-bold text-gray-900">R$ {totalAmount.toFixed(2)}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Número do Cartão
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  maxLength={16}
                  {...register('cardNumber')}
                  className="input-primary pl-10"
                  placeholder="0000 0000 0000 0000"
                />
              </div>
              {errors.cardNumber && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.cardNumber.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome do Titular
              </label>
              <input
                type="text"
                {...register('cardName')}
                className="mt-1 input-primary"
                placeholder="Nome como está no cartão"
              />
              {errors.cardName && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.cardName.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Validade
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...register('expiryDate')}
                    className="input-primary pl-10"
                    placeholder="MM/YY"
                  />
                </div>
                {errors.expiryDate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.expiryDate.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CVV
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    maxLength={4}
                    {...register('cvv')}
                    className="input-primary pl-10"
                    placeholder="123"
                  />
                </div>
                {errors.cvv && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.cvv.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Parcelamento
              </label>
              <select
                {...register('installments', { valueAsNumber: true })}
                className="mt-1 input-primary"
              >
                {installmentOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('saveCard')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Salvar cartão para próximos pagamentos
              </label>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full btn-primary"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    <span>Processando...</span>
                  </div>
                ) : (
                  'Pagar Agora'
                )}
              </button>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p className="flex items-center justify-center">
                <Lock className="h-4 w-4 mr-1" />
                Pagamento seguro e criptografado
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}