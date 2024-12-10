import React from 'react';
import { Evaluation } from '../../../types/hire';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Star } from 'lucide-react';

interface CaregiverReviewsProps {
  evaluations: Evaluation[];
}

export default function CaregiverReviews({ evaluations }: CaregiverReviewsProps) {
  if (evaluations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhuma avaliação recebida ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Minhas Avaliações</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {evaluations.map((evaluation) => (
          <div key={evaluation.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-2">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`h-5 w-5 ${
                    index < evaluation.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-2">
                {evaluation.rating}/5
              </span>
            </div>
            
            <p className="text-gray-700 mb-4">{evaluation.comment}</p>
            
            <div className="text-sm text-gray-600">
              <p>
                <span className="font-medium">Data da Avaliação: </span>
                {format(new Date(evaluation.createdAt), "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
