import React from 'react';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
import { toast } from 'sonner';
import { DollarSign } from 'lucide-react';

interface HourlyRateManagerProps {
  caregiverId: string;
}

export default function HourlyRateManager({ caregiverId }: HourlyRateManagerProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [hourlyRate, setHourlyRate] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchHourlyRate = async () => {
      if (!caregiverId) {
        console.error("caregiverId is required");
        return;
      }

      try {
        const docRef = doc(db, 'cuidadores', caregiverId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          const rate = data.hourlyRate;
          console.log('Valor por hora carregado:', rate); // Debug
          setHourlyRate(rate ?? 0);
        } else {
          await setDoc(docRef, {
            hourlyRate: 0,
            updatedAt: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Erro ao carregar valor por hora:', error);
        toast.error('Erro ao carregar valor por hora');
      }
    };

    fetchHourlyRate();
  }, [caregiverId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (hourlyRate < 0) {
      toast.error('O valor por hora não pode ser negativo');
      return;
    }

    setLoading(true);
    try {
      const caregiverRef = doc(db, 'cuidadores', caregiverId);
      const docSnap = await getDoc(caregiverRef);

      if (!docSnap.exists()) {
        // Criar documento se não existir
        await setDoc(caregiverRef, {
          hourlyRate: Number(hourlyRate),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } else {
        // Atualizar documento existente
        await updateDoc(caregiverRef, {
          hourlyRate: Number(hourlyRate),
          updatedAt: new Date().toISOString()
        });
      }

      toast.success('Valor por hora atualizado com sucesso!');
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar valor por hora:', error);
      toast.error('Erro ao atualizar valor por hora. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium">Valor por Hora</h3>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">R$</span>
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="0.00"
                disabled={loading}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">/hora</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-gray-900">
            R$ {hourlyRate.toFixed(2)}<span className="text-sm text-gray-500 ml-1">/hora</span>
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Editar
          </button>
        </div>
      )}
    </div>
  );
}
