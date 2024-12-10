import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Star, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Avaliação é obrigatória').max(5),
  comment: z.string().min(10, 'Comentário deve ter pelo menos 10 caracteres'),
  recommendService: z.boolean()
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  caregiverId: string | null;
  userId: string;
}

export default function ReviewModal({
  isOpen,
  onClose,
  caregiverId,
  userId
}: ReviewModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [caregiver, setCaregiver] = React.useState<any>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
      recommendService: false
    }
  });

  const rating = watch('rating');

  React.useEffect(() => {
    if (caregiverId) {
      const loadCaregiver = async () => {
        try {
          const docRef = doc(db, 'cuidadores', caregiverId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setCaregiver(docSnap.data());
          }
        } catch (error) {
          console.error('Error loading caregiver:', error);
        }
      };
      loadCaregiver();
    }
  }, [caregiverId]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: ReviewFormData) => {
    if (!caregiverId) return;

    setIsSubmitting(true);
    try {
      const reviewData = {
        ...data,
        userId,
        createdAt: new Date().toISOString(),
        caregiverId
      };

      // Adicionar review ao documento do cuidador
      const caregiverRef = doc(db, 'cuidadores', caregiverId);
      await updateDoc(caregiverRef, {
        reviews: arrayUnion(reviewData),
        // Atualizar rating médio
        rating: caregiver ? 
          ((caregiver.rating * caregiver.reviews?.length || 0) + data.rating) / 
          (caregiver.reviews?.length + 1 || 1) : 
          data.rating
      });

      toast.success('Avaliação enviada com sucesso!');
      handleClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Erro ao enviar avaliação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleClose} />
        
        <div className="relative bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Avaliar Serviço</h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          {caregiver && (
            <div className="mb-6">
              <h3 className="font-medium">{caregiver.name}</h3>
              <p className="text-sm text-gray-600">{caregiver.specialty}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sua avaliação
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setValue('rating', value)}
                    onMouseEnter={() => setHoverRating(value)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        (hoverRating || rating) >= value
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {errors.rating && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.rating.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seu comentário
              </label>
              <textarea
                {...register('comment')}
                rows={4}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Conte sua experiência com o serviço..."
              />
              {errors.comment && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.comment.message}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('recommendService')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Recomendo este profissional
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
