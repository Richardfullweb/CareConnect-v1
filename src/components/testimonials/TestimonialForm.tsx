import React from 'react';
import { toast } from 'sonner';
import { Star } from 'lucide-react';
import { createTestimonial, getAppointmentTestimonial } from '../../lib/firebase/services/testimonials';

interface TestimonialFormProps {
  appointmentId: string;
  clientId: string;
  caregiverId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function TestimonialForm({
  appointmentId,
  clientId,
  caregiverId,
  onSuccess,
  onCancel
}: TestimonialFormProps) {
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [hasTestimonial, setHasTestimonial] = React.useState(false);

  React.useEffect(() => {
    const checkExistingTestimonial = async () => {
      try {
        const testimonial = await getAppointmentTestimonial(appointmentId);
        if (testimonial) {
          setHasTestimonial(true);
          toast.error('Você já avaliou este atendimento.');
          onCancel?.();
        }
      } catch (error) {
        console.error('Error checking testimonial:', error);
      }
    };

    checkExistingTestimonial();
  }, [appointmentId, onCancel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hasTestimonial) {
      toast.error('Você já avaliou este atendimento.');
      return;
    }

    if (!comment.trim()) {
      toast.error('Por favor, escreva um comentário sobre o atendimento.');
      return;
    }

    setLoading(true);

    try {
      await createTestimonial({
        appointmentId,
        clientId,
        caregiverId,
        rating,
        comment: comment.trim()
      });

      toast.success('Avaliação enviada com sucesso!');
      onSuccess?.();
    } catch (error) {
      console.error('Error creating testimonial:', error);
      toast.error('Erro ao enviar avaliação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (hasTestimonial) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Avalie o Atendimento
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Avaliação
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 ${
                    value <= rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Comentário
          </label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Conte como foi sua experiência com o atendimento..."
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Enviando...' : 'Enviar Avaliação'}
          </button>
        </div>
      </form>
    </div>
  );
}
