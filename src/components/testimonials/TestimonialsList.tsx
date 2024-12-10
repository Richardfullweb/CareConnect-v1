import React from 'react';
import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Testimonial, getCaregiverTestimonials } from '../../lib/firebase/services/testimonials';

interface TestimonialsListProps {
  caregiverId: string;
}

export default function TestimonialsList({ caregiverId }: TestimonialsListProps) {
  const [testimonials, setTestimonials] = React.useState<Testimonial[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCaregiverTestimonials(caregiverId);
        setTestimonials(data);
      } catch (error) {
        console.error('Error loading testimonials:', error);
        setError('Não foi possível carregar as avaliações. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, [caregiverId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-8">
        <Star className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Nenhuma avaliação
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Este cuidador ainda não recebeu avaliações.
        </p>
      </div>
    );
  }

  // Calcular a média das avaliações
  const averageRating =
    testimonials.reduce((acc, curr) => acc + curr.rating, 0) / testimonials.length;

  return (
    <div className="space-y-6">
      {/* Resumo das Avaliações */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">
              Média das Avaliações
            </h3>
            <div className="mt-1 flex items-center">
              <span className="text-3xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </span>
              <div className="ml-2 flex">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    className={`h-5 w-5 ${
                      value <= Math.round(averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-500">
              {testimonials.length} avaliação{testimonials.length !== 1 && 's'}
            </span>
          </div>
        </div>
      </div>

      {/* Lista de Depoimentos */}
      <div className="space-y-4">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      className={`h-5 w-5 ${
                        value <= testimonial.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-500">
                    {formatDistanceToNow(
                      new Date(testimonial.createdAt),
                      { locale: ptBR, addSuffix: true }
                    )}
                  </span>
                </div>
                <p className="mt-2 text-gray-600">{testimonial.comment}</p>
                <p className="mt-2 text-sm text-gray-500">
                  {testimonial.clientName || 'Cliente'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
