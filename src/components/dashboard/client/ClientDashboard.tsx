import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Grid,
  Container,
  CircularProgress,
  Chip,
  Avatar,
  Alert
} from '@mui/material';
import {
  Check,
  X
} from '@mui/icons-material';
import { useAuthContext } from '../../../contexts/AuthContext';
import { 
  query, 
  collection, 
  where, 
  getDocs, 
  doc, 
  updateDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Types
interface Appointment {
  id: string;
  caregiverId: string;
  caregiverName: string;
  caregiverImage?: string;
  caregiverEmail: string;
  caregiverPhone: string;
  hours: number;
  totalPrice: number;
  status: AppointmentStatus;
  date: string;
  time: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  patientName?: string;
  patientAge?: number;
}

type AppointmentStatus = 
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'completed'
  | 'cancelled';

interface AppointmentCardProps {
  appointment: Appointment;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  loading?: boolean;
}

// Helper Functions
const formatDate = (dateStr: string): string => {
  try {
    return format(new Date(dateStr), "dd/MM/yyyy", { locale: ptBR });
  } catch {
    return dateStr;
  }
};

const getStatusColor = (status: AppointmentStatus): string => {
  const colors = {
    pending: '#ed6c02',    // warning
    accepted: '#2e7d32',   // success
    rejected: '#d32f2f',   // error
    completed: '#1976d2',  // primary
    cancelled: '#9e9e9e',  // neutral
  };
  return colors[status] || colors.pending;
};

const getStatusText = (status: AppointmentStatus): string => {
  const texts = {
    pending: 'Pendente',
    accepted: 'Aceito',
    rejected: 'Recusado',
    completed: 'Concluído',
    cancelled: 'Cancelado'
  };
  return texts[status] || 'Pendente';
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Components
const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onAccept,
  onReject,
  loading = false,
}) => {
  return (
    <Card sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Avatar
              src={appointment.caregiverImage}
              alt={appointment.caregiverName}
              sx={{ width: 56, height: 56 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ color: 'primary.main', mb: 0.5 }}>
                {appointment.caregiverName}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Data: {formatDate(appointment.date)} às {appointment.time}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Duração: {appointment.hours}h
              </Typography>

              {appointment.patientName && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Paciente: {appointment.patientName}
                  {appointment.patientAge && ` (${appointment.patientAge} anos)`}
                </Typography>
              )}

              {appointment.notes && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Observações: {appointment.notes}
                </Typography>
              )}

              <Typography variant="h6" sx={{ mt: 2, color: 'primary.main' }}>
                {formatCurrency(appointment.totalPrice)}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'flex-end',
            height: '100%',
            gap: 2
          }}>
            <Chip
              label={getStatusText(appointment.status)}
              sx={{
                bgcolor: getStatusColor(appointment.status),
                color: '#fff',
                fontWeight: 500,
              }}
            />
            
            {appointment.status === 'pending' && (
              <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                {onReject && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => onReject(appointment.id)}
                    disabled={loading}
                    startIcon={<X />}
                  >
                    Recusar
                  </Button>
                )}
                {onAccept && (
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => onAccept(appointment.id)}
                    disabled={loading}
                    startIcon={<Check />}
                  >
                    Aceitar
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

const ClientDashboard: React.FC = () => {
  const { user } = useAuthContext();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Calcular totais com validação
  const totals = React.useMemo(() => {
    return appointments.reduce((acc, appointment) => {
      // Apenas considerar agendamentos aceitos ou concluídos
      if (appointment.status === 'accepted' || appointment.status === 'completed') {
        return {
          hours: acc.hours + (appointment.hours || 0),
          earnings: acc.earnings + (appointment.totalPrice || 0)
        };
      }
      return acc;
    }, { hours: 0, earnings: 0 });
  }, [appointments]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.uid) return;

      try {
        setLoading(true);
        setError(null);
        
        const q = query(
          collection(db, 'hireRequests'),
          where('clientId', '==', user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const appointmentsData: Appointment[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          // Validar dados obrigatórios
          if (!data.caregiverId || !data.caregiverName || !data.date || !data.time) {
            console.warn(`Skipping invalid appointment data for doc ${doc.id}`);
            return;
          }

          appointmentsData.push({
            id: doc.id,
            caregiverId: data.caregiverId,
            caregiverName: data.caregiverName,
            caregiverEmail: data.email || '',
            caregiverPhone: data.phone || '',
            caregiverImage: data.caregiverProfileImage || '',
            hours: Number(data.hours) || 0,
            totalPrice: Number(data.totalPrice) || 0,
            status: data.status || 'pending',
            date: data.date,
            time: data.time,
            notes: data.notes || '',
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            patientName: data.patientName || '',
            patientAge: Number(data.patientAge) || 0
          });
        });

        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Erro ao carregar agendamentos. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user?.uid]);

  const handleUpdateStatus = async (id: string, status: AppointmentStatus) => {
    if (!user?.uid) return;

    try {
      setActionLoading(true);
      
      const appointmentRef = doc(db, 'hireRequests', id);
      await updateDoc(appointmentRef, {
        status,
        updatedAt: Timestamp.now()
      });

      setAppointments(prev => 
        prev.map(app => 
          app.id === id ? { ...app, status, updatedAt: new Date().toISOString() } : app
        )
      );
    } catch (error) {
      console.error(`Error ${status === 'accepted' ? 'accepting' : 'rejecting'} appointment:`, error);
      setError(`Erro ao ${status === 'accepted' ? 'aceitar' : 'recusar'} o agendamento. Por favor, tente novamente.`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptAppointment = (id: string) => handleUpdateStatus(id, 'accepted');
  const handleRejectAppointment = (id: string) => handleUpdateStatus(id, 'rejected');

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Meus Agendamentos
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Total de Horas
            </Typography>
            <Typography variant="h4">
              {totals.hours}h
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Total de Ganhos
            </Typography>
            <Typography variant="h4">
              {formatCurrency(totals.earnings)}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {appointments.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Nenhum agendamento encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Quando você tiver agendamentos, eles aparecerão aqui.
          </Typography>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onAccept={handleAcceptAppointment}
              onReject={handleRejectAppointment}
              loading={actionLoading}
            />
          ))}
        </Box>
      )}
    </Container>
  );
};

export default ClientDashboard;
