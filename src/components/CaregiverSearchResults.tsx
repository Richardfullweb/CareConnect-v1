import React from 'react';
import {
  Box,
  Card,
  Typography,
  Container,
  Grid,
  Avatar,
  Chip,
  Button,
  Rating,
  Divider
} from '@mui/material';
import { MapPin, Clock, DollarSign, Star } from 'lucide-react';
import { formatCurrency } from '../utils/format';

interface Caregiver {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  specialties: string[];
  experience: string;
  hourlyRate: number;
  availability: string;
  rating: number;
  totalReviews: number;
  profileImage?: string;
}

interface CaregiverSearchResultsProps {
  caregivers: Caregiver[];
  onSelect: (id: string) => void;
  loading?: boolean;
}

export default function CaregiverSearchResults({ 
  caregivers, 
  onSelect,
  loading = false 
}: CaregiverSearchResultsProps) {
  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
      </Box>
    );
  }

  if (caregivers.length === 0) {
    return (
      <Card sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Nenhum cuidador encontrado
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Tente ajustar seus filtros de busca.
        </Typography>
      </Card>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {caregivers.map((caregiver) => (
        <Card key={caregiver.id} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Avatar e Informações Básicas */}
            <Grid item xs={12} sm={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Avatar
                  src={caregiver.profileImage}
                  alt={caregiver.name}
                  sx={{ width: 100, height: 100 }}
                />
                <Typography variant="h6" align="center">
                  {caregiver.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Rating value={caregiver.rating} precision={0.5} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    ({caregiver.totalReviews})
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Detalhes */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MapPin size={16} />
                  <Typography variant="body2">{caregiver.address}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Clock size={16} />
                  <Typography variant="body2">
                    {caregiver.availability === 'available' ? 'Disponível Agora' : 'Agendamento'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DollarSign size={16} />
                  <Typography variant="body2">
                    {formatCurrency(caregiver.hourlyRate)}/hora
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {caregiver.specialties.map((specialty, index) => (
                    <Chip 
                      key={index} 
                      label={specialty} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Ações */}
            <Grid item xs={12} sm={3}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2,
                height: '100%',
                justifyContent: 'center'
              }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => onSelect(caregiver.id)}
                >
                  Ver Perfil
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => onSelect(caregiver.id)}
                >
                  Agendar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>
      ))}
    </Box>
  );
}
