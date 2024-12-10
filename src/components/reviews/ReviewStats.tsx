import React from 'react';
import { Star } from 'lucide-react';
import type { Review } from '../../types';

interface ReviewStatsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export default function ReviewStats({ reviews, averageRating, totalReviews }: ReviewStatsProps) {
  const ratingCounts = React.useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      counts[review.rating as keyof typeof counts]++;
    });
    return counts;
  }, [reviews]);

  const getRatingPercentage = (rating: number) => {
    return totalReviews > 0 ? (ratingCounts[rating] / totalReviews) * 100 : 0;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex justify-center mb-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <Star
                key={value}
                className={`h-6 w-6 ${
                  value <= averageRating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-gray-600">{totalReviews} avaliações</p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center">
              <div className="flex items-center w-20">
                <span className="text-sm text-gray-600">{rating}</span>
                <Star className="h-4 w-4 text-yellow-400 fill-current ml-1" />
              </div>
              <div className="flex-1 h-4 mx-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${getRatingPercentage(rating)}%` }}
                />
              </div>
              <div className="w-16 text-right">
                <span className="text-sm text-gray-600">
                  {ratingCounts[rating]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}