import React from 'react';
import { Star } from 'lucide-react';
import type { ServiceRequest } from '../../types';

interface ReviewFormProps {
  serviceRequest: ServiceRequest;
  onSubmit: (data: { rating: number; comment: string }) => Promise<void>;
}

export default function ReviewForm({ serviceRequest, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const [hoveredRating, setHoveredRating] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ rating, comment });
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Avalie o atendimento
        </label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={`h-8 w-8 ${
                  value <= (hoveredRating || rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Seu comentário
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          rows={4}
          placeholder="Conte como foi sua experiência..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={rating === 0 || isSubmitting}
        className={`w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          (rating === 0 || isSubmitting) && 'opacity-50 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
      </button>
    </form>
  );
}