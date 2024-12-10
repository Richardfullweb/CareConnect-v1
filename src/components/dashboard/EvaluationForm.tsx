import React, { useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { hireService } from '../../services/hireService';
import { toast } from 'sonner';
import { Star } from 'lucide-react';
import { HireRequest } from '../../types/hire';

interface EvaluationFormProps {
  request: HireRequest;
  onSubmit: () => void;
}

export default function EvaluationForm({ request, onSubmit }: EvaluationFormProps) {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Você precisa estar logado para enviar uma avaliação');
      return;
    }

    if (!rating || !comment.trim()) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      console.log('Enviando avaliação...', {
        requestId: request.id,
        caregiverId: request.caregiverId,
        clientId: user.uid,
        rating,
        comment
      });

      await hireService.createEvaluation({
        requestId: request.id,
        caregiverId: request.caregiverId,
        clientId: user.uid,
        rating,
        comment: comment.trim(),
        createdAt: new Date().toISOString()
      });

      toast.success('Avaliação enviada com sucesso!');
      onSubmit();
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      toast.error('Erro ao enviar avaliação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-semibold mb-6">
          Avaliar Atendimento
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações do Cuidador */}
          <div className="text-center mb-6">
            <p className="text-gray-600">Como foi seu atendimento com</p>
            <p className="font-medium text-lg">{request.caregiverName}?</p>
          </div>

          {/* Estrelas de Avaliação */}
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(null)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 ${
                    (hoveredRating !== null ? star <= hoveredRating : star <= rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Comentário */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comentário
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full border rounded-lg p-2"
              placeholder="Conte como foi sua experiência..."
              required
            />
          </div>

          {/* Botões */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onSubmit}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`
                flex-1 py-2 px-4 rounded-lg text-white font-medium
                ${loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'}
              `}
            >
              {loading ? 'Enviando...' : 'Enviar Avaliação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
