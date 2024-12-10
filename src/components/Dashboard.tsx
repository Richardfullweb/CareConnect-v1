import React from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import ClientDashboard from './dashboard/ClientDashboard';
import CaregiverDashboard from './dashboard/CaregiverDashboard';
import { toast } from 'sonner';
import { useNavigate, Outlet } from 'react-router-dom';

type UserRole = 'client' | 'caregiver' | null;

export default function Dashboard() {
  const { user } = useAuthContext();
  const [userRole, setUserRole] = React.useState<UserRole>(null);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    let isMounted = true;

    const loadUserRole = async () => {
      if (!user) {
        if (isMounted) {
          setLoading(false);
        }
        return;
      }

      try {
        // Verificar se o usuário existe na coleção de clientes
        const clientDoc = doc(db, 'clients', user.uid);
        const clientSnap = await getDoc(clientDoc);
        
        if (!isMounted) return;

        if (clientSnap.exists()) {
          setUserRole('client');
          setLoading(false);
          return;
        }

        // Se não for cliente, verificar se é cuidador
        const caregiverDoc = doc(db, 'caregivers', user.uid);
        const caregiverSnap = await getDoc(caregiverDoc);
        
        if (!isMounted) return;

        if (caregiverSnap.exists()) {
          setUserRole('caregiver');
          // Garantir que temos todos os campos necessários
          const data = caregiverSnap.data();
          if (!data.createdAt) {
            await setDoc(caregiverDoc, {
              ...data,
              createdAt: new Date(),
              updatedAt: new Date().toISOString(),
              available: data.available ?? true,
              hourlyRate: data.hourlyRate ?? 0,
              rating: data.rating ?? 0,
              certifications: data.certifications ?? [],
              specialties: data.specialties ?? [],
              workSchedule: data.workSchedule ?? {
                domingo: { enabled: false, timeSlots: [] },
                segunda: { enabled: false, timeSlots: [] },
                terca: { enabled: false, timeSlots: [] },
                quarta: { enabled: false, timeSlots: [] },
                quinta: { enabled: false, timeSlots: [] },
                sexta: { enabled: false, timeSlots: [] },
                sabado: { enabled: false, timeSlots: [] }
              }
            }, { merge: true });
          }
        } else {
          // Se não encontrar em nenhuma coleção, redirecionar para completar o perfil
          toast.error('Perfil não encontrado. Por favor, complete seu cadastro.');
          navigate('/complete-profile');
          return;
        }
      } catch (error) {
        console.error('Error loading user role:', error);
        if (isMounted) {
          toast.error('Erro ao carregar perfil. Tente novamente mais tarde.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUserRole();

    return () => {
      isMounted = false;
    };
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Acesso Negado</h2>
          <p className="mt-2 text-gray-600">Você precisa estar logado para acessar esta página.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Se não tiver um papel definido, não renderiza nada
  // (o usuário será redirecionado pelo useEffect)
  if (!userRole) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {userRole === 'client' ? (
          <>
            <ClientDashboard userId={user.uid} />
            <Outlet />
          </>
        ) : userRole === 'caregiver' ? (
          <CaregiverDashboard userId={user.uid} />
        ) : null}
      </div>
    </div>
  );
}