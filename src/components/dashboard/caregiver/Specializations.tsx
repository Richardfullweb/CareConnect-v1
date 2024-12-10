import React, { useState, useEffect } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
import { toast } from 'sonner';
import { PlusCircle, X, AlertCircle } from 'lucide-react';
import { useAuthContext } from '../../../contexts/AuthContext';

interface SpecializationsProps {
  caregiverId?: string;
}

type Profession = 'medico' | 'enfermeiro' | 'fisioterapeuta' | 'cuidador';

const PROFESSIONS = [
  { id: 'medico', label: 'Médico(a)', icon: '👨‍⚕️' },
  { id: 'enfermeiro', label: 'Enfermeiro(a)', icon: '👨‍⚕️' },
  { id: 'fisioterapeuta', label: 'Fisioterapeuta', icon: '🏥' },
  { id: 'cuidador', label: 'Cuidador(a)', icon: '🤝' }
] as const;

const SPECIALIZATIONS_BY_PROFESSION: Record<Profession, string[]> = {
  medico: [
    'Geriatria',
    'Clínica Geral',
    'Cardiologia',
    'Neurologia',
    'Psiquiatria',
    'Ortopedia'
  ],
  enfermeiro: [
    'Enfermagem Geriátrica',
    'Cuidados Intensivos',
    'Administração de Medicamentos',
    'Curativos Complexos',
    'Cuidados com Sonda',
    'Cuidados Paliativos'
  ],
  fisioterapeuta: [
    'Fisioterapia Geriátrica',
    'Reabilitação Motora',
    'Fisioterapia Respiratória',
    'Fisioterapia Neurológica',
    'Hidroterapia',
    'Pilates'
  ],
  cuidador: [
    'Cuidados Básicos',
    'Primeiros Socorros',
    'Administração de Medicamentos',
    'Mobilidade Reduzida',
    'Alzheimer',
    'Parkinson',
    'Demência',
    'Acamados',
    'Pós-operatório',
    'Diabetes',
    'Hipertensão',
    'AVC',
    'Cuidados Paliativos'
  ]
};

export default function CaregiverSpecializations({ caregiverId }: SpecializationsProps) {
  const [profession, setProfession] = useState<Profession | ''>('');
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();

  // Use user.uid if caregiverId is not provided
  const effectiveCaregiverId = caregiverId || user?.uid;

  useEffect(() => {
    const fetchCaregiverData = async () => {
      if (!effectiveCaregiverId) {
        setError('Não foi possível identificar o cuidador. Por favor, faça login novamente.');
        setIsLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'caregivers', effectiveCaregiverId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSpecialties(data.specialties || []);
          setProfession(data.profession || '');
        } else {
          setError('Dados do cuidador não encontrados');
        }
      } catch (error) {
        console.error('Error fetching caregiver data:', error);
        setError('Erro ao carregar dados do profissional');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCaregiverData();
  }, [effectiveCaregiverId]);

  const handleProfessionChange = async (newProfession: Profession) => {
    if (!effectiveCaregiverId) {
      toast.error('ID do cuidador não disponível');
      return;
    }

    try {
      const docRef = doc(db, 'caregivers', effectiveCaregiverId);
      await updateDoc(docRef, {
        profession: newProfession,
        specialties: [] // Limpa as especialidades ao mudar a profissão
      });

      setProfession(newProfession);
      setSpecialties([]);
      toast.success('Profissão atualizada com sucesso!');
    } catch (error) {
      console.error('Error updating profession:', error);
      toast.error('Erro ao atualizar profissão');
    }
  };

  const handleSpecializationToggle = async (specialization: string) => {
    if (!effectiveCaregiverId) {
      toast.error('ID do cuidador não disponível');
      return;
    }

    try {
      const updatedSpecialties = specialties.includes(specialization)
        ? specialties.filter(s => s !== specialization)
        : [...specialties, specialization];

      const docRef = doc(db, 'caregivers', effectiveCaregiverId);
      await updateDoc(docRef, {
        specialties: updatedSpecialties
      });

      setSpecialties(updatedSpecialties);
      toast.success('Especializações atualizadas com sucesso!');
    } catch (error) {
      console.error('Error updating specialties:', error);
      toast.error('Erro ao atualizar especializações');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Profissão e Especializações</h3>
      
      {/* Seleção de Profissão */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selecione sua profissão
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {PROFESSIONS.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => handleProfessionChange(id as Profession)}
              className={`p-3 rounded-lg border ${
                profession === id
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-gray-300 hover:border-indigo-300'
              } flex items-center justify-center transition-colors`}
            >
              <span className="mr-2">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Especializações */}
      {profession && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione suas especializações
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {SPECIALIZATIONS_BY_PROFESSION[profession].map((specialization) => (
              <button
                key={specialization}
                onClick={() => handleSpecializationToggle(specialization)}
                className={`p-2 rounded-lg border ${
                  specialties.includes(specialization)
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 hover:border-indigo-300'
                } flex items-center justify-between transition-colors`}
              >
                <span>{specialization}</span>
                {specialties.includes(specialization) ? (
                  <X className="w-4 h-4" />
                ) : (
                  <PlusCircle className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
