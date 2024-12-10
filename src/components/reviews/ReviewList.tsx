import React from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import type { Review } from '../../types';

interface ReviewListProps {
  reviews: Review[];
  isLoading?: boolean;
}

export default function ReviewList({ reviews, isLoading }: ReviewListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Carregando avaliações...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Ainda não há avaliações.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <img
                src={review.clientImage || `https://ui-avatars.com/api/?name=${review.clientName}`}
                alt={review.clientName}
                className="h-10 w-10 rounded-full"
              />
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-900">{review.clientName}</h4>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`h-4 w-4 ${
                        index < review.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className="mt-4 text-gray-600">{review.comment}</p>

          <div className="mt-4 flex items-center justify-between">
            <button className="flex items-center text-gray-500 hover:text-gray-700">
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span className="text-sm">Útil</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}