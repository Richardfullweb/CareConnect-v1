import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Caregiver } from '../types/hire';
import HireRequestForm from './dashboard/HireRequestForm';

interface CaregiverCardProps {
  caregiver: Caregiver;
}

export default function CaregiverCard({ caregiver }: CaregiverCardProps) {
  const [showHireForm, setShowHireForm] = useState(false);
  const initial = caregiver.name ? caregiver.name.charAt(0).toUpperCase() : 'C';

  return (
    <>
      <div className="border rounded-lg p-4 hover:border-indigo-500 transition-colors cursor-pointer">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-2xl font-medium text-gray-600">{initial}</span>
          </div>
          <div>
            <h3 className="font-medium">{caregiver.name}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              {caregiver.rating?.toFixed(1)} ({caregiver.reviews} avaliações)
            </div>
            <p className="text-indigo-600 font-medium">
              R$ {caregiver.hourlyRate?.toFixed(2)}/hora
            </p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Especialidades:</p>
          <div className="flex flex-wrap gap-2">
            {(caregiver.specialties || []).map((specialty, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </div>

      {showHireForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Nova Solicitação</h2>
                <button
                  onClick={() => setShowHireForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <HireRequestForm
                caregiver={caregiver}
                onClose={() => setShowHireForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}