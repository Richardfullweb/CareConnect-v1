import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, query, collection, where, getDocs, Timestamp, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { toast } from 'sonner';
import { 
  Calendar, 
  Clock, 
  Star, 
  Users, 
  Settings, 
  ChevronRight, 
  AlertCircle, 
  Briefcase, 
  Award, 
  MapPin,
  Home,
  DollarSign,
  FileText,
  Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AvailabilityToggle from './caregiver/AvailabilityToggle';
import HourlyRateManager from './caregiver/HourlyRateManager';
import MyEvaluations from './caregiver/MyEvaluations';
import ScheduleList from './caregiver/ScheduleList';
import Specializations from './caregiver/Specializations';
import WorkScheduleManager from './caregiver/WorkScheduleManager';
import EarningsCalculator from './caregiver/EarningsCalculator';
import { useAuthContext } from '../../contexts/AuthContext';
import { hireService } from '../../services/hireService';

interface TimeSlot {
  start: string;
  end: string;
}

interface DaySchedule {
  enabled: boolean;
  timeSlots: TimeSlot[];
}

interface WorkSchedule {
  domingo: DaySchedule;
  segunda: DaySchedule;
  terca: DaySchedule;
  quarta: DaySchedule;
  quinta: DaySchedule;
  sexta: DaySchedule;
  sabado: DaySchedule;
}

interface ServiceLocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  complement?: string;
  isDefault?: boolean;
}

interface CaregiverData {
  name: string;
  email: string;
  hourlyRate: number;
  rating: number;
  available: boolean;
  role: string;
  experience: string;
  certifications: string[];
  specialties: string[];
  workSchedule: WorkSchedule;
  createdAt: Date;
  updatedAt: string;
  profession?: 'medico' | 'enfermeiro' | 'fisioterapeuta' | 'cuidador';
  serviceLocations: ServiceLocation[];
  allowedDurations: number[];
}

export default function CaregiverDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [caregiverData, setCaregiverData] = useState<CaregiverData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthContext();

  const [newLocation, setNewLocation] = useState<ServiceLocation>({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    complement: '',
  });

  const [newCertification, setNewCertification] = useState('');

  useEffect(() => {
    const fetchCaregiverData = async () => {
      if (!user?.uid) {
        setIsLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'cuidadores', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log('Dados do cuidador:', data); // Debug
          const updatedData = {
            ...data,
            createdAt: data.createdAt instanceof Timestamp 
              ? data.createdAt.toDate() 
              : new Date(),
            updatedAt: data.updatedAt || new Date().toISOString(),
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
          };
          setCaregiverData(updatedData as CaregiverData);
        } else {
          // Se o documento não existir, criar com valores padrão
          const defaultData = {
            name: user.displayName || '',
            email: user.email || '',
            hourlyRate: 0,
            rating: 0,
            available: true,
            role: 'caregiver',
            experience: '',
            certifications: [],
            specialties: ['Cuidador(a) de Idosos'],
            workSchedule: {
              domingo: { enabled: false, timeSlots: [] },
              segunda: { enabled: false, timeSlots: [] },
              terca: { enabled: false, timeSlots: [] },
              quarta: { enabled: false, timeSlots: [] },
              quinta: { enabled: false, timeSlots: [] },
              sexta: { enabled: false, timeSlots: [] },
              sabado: { enabled: false, timeSlots: [] }
            },
            createdAt: new Date(),
            updatedAt: new Date().toISOString(),
            serviceLocations: [],
            allowedDurations: [4, 6, 8, 12]
          };

          await setDoc(docRef, defaultData);
          setCaregiverData(defaultData as CaregiverData);
        }
      } catch (error) {
        console.error('Error fetching caregiver data:', error);
        toast.error('Erro ao carregar dados do perfil');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAppointments = async () => {
      if (!user?.uid) return;
      
      try {
        console.log('Fetching appointments for caregiver:', user.uid); // Debug log
        const requests = await hireService.getCaregiverRequests(user.uid);
        console.log('Raw appointments data:', requests); // Debug log
        console.log('Pending appointments:', requests.filter(a => a.status === 'pending')); // Debug log
        setAppointments(requests);
      } catch (error) {
        console.error('Error loading appointments:', error);
        toast.error('Erro ao carregar agendamentos');
      }
    };

    fetchCaregiverData();
    fetchAppointments();
  }, [user]);

  const handleUpdateProfile = async (field: string, value: any) => {
    if (!user?.uid) return;

    try {
      const caregiverRef = doc(db, 'cuidadores', user.uid);
      const updateData = {
        [field]: value,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(caregiverRef, updateData);
      
      setCaregiverData(prev => prev ? {
        ...prev,
        [field]: value,
        updatedAt: new Date().toISOString()
      } : null);

      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar perfil');
    }
  };

  const handleAddLocation = async () => {
    if (!caregiverData || !user?.uid) return;

    try {
      const updatedLocations = [...(caregiverData.serviceLocations || []), newLocation];
      await handleUpdateProfile('serviceLocations', updatedLocations);
      setNewLocation({
        address: '',
        city: '',
        state: '',
        zipCode: '',
        complement: '',
      });
      toast.success('Local de atendimento adicionado com sucesso!');
    } catch (error) {
      console.error('Error adding location:', error);
      toast.error('Erro ao adicionar local de atendimento');
    }
  };

  const handleRemoveLocation = async (index: number) => {
    if (!caregiverData || !user?.uid) return;

    try {
      const updatedLocations = caregiverData.serviceLocations.filter((_, i) => i !== index);
      await handleUpdateProfile('serviceLocations', updatedLocations);
      toast.success('Local de atendimento removido com sucesso!');
    } catch (error) {
      console.error('Error removing location:', error);
      toast.error('Erro ao remover local de atendimento');
    }
  };

  const handleAddCertification = async () => {
    if (!caregiverData || !user?.uid || !newCertification.trim()) return;

    try {
      const updatedCertifications = [...(caregiverData.certifications || []), newCertification.trim()];
      await handleUpdateProfile('certifications', updatedCertifications);
      setNewCertification('');
      toast.success('Certificação adicionada com sucesso!');
    } catch (error) {
      console.error('Error adding certification:', error);
      toast.error('Erro ao adicionar certificação');
    }
  };

  const handleRemoveCertification = async (index: number) => {
    if (!caregiverData || !user?.uid) return;

    try {
      const updatedCertifications = caregiverData.certifications.filter((_, i) => i !== index);
      await handleUpdateProfile('certifications', updatedCertifications);
      toast.success('Certificação removida com sucesso!');
    } catch (error) {
      console.error('Error removing certification:', error);
      toast.error('Erro ao remover certificação');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  const renderOverviewTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Coluna 1: Informações Principais */}
      <div className="space-y-6">
        {/* Card de Perfil */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{caregiverData?.name}</h2>
              <p className="text-gray-600">{caregiverData?.profession || 'Profissão não definida'}</p>
            </div>
          </div>
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Avaliação</p>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="font-medium">{caregiverData?.rating?.toFixed(1) || 'N/A'}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Valor/Hora</p>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                  <span className="font-medium">R$ {caregiverData?.hourlyRate || '0'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card de Disponibilidade */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-indigo-600" />
            Disponibilidade
          </h3>
          {user?.uid && <AvailabilityToggle caregiverId={user.uid} />}
        </div>
      </div>

      {/* Coluna 2 e 3: Agendamentos */}
      <div className="lg:col-span-2 space-y-6">
        {/* Agendamentos Pendentes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Agendamentos Pendentes</h2>
          <ScheduleList
            appointments={appointments.filter(a => a.status === 'pending')}
            onStatusChange={() => {
              // Recarregar agendamentos após mudança de status
              if (user?.uid) {
                hireService.getCaregiverRequests(user.uid)
                  .then(setAppointments)
                  .catch(error => {
                    console.error('Error reloading appointments:', error);
                    toast.error('Erro ao recarregar agendamentos');
                  });
              }
            }}
            type="pending"
          />
        </div>

        {/* Agendamentos Aceitos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Agendamentos Aceitos</h2>
          <ScheduleList
            appointments={appointments.filter(a => a.status === 'accepted')}
            onStatusChange={() => {
              if (user?.uid) {
                hireService.getCaregiverRequests(user.uid)
                  .then(setAppointments)
                  .catch(error => {
                    console.error('Error reloading appointments:', error);
                    toast.error('Erro ao recarregar agendamentos');
                  });
              }
            }}
            type="accepted"
          />
        </div>

        {/* Agendamentos Concluídos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Agendamentos Concluídos</h2>
          <ScheduleList
            appointments={appointments.filter(a => a.status === 'completed')}
            onStatusChange={() => {
              if (user?.uid) {
                hireService.getCaregiverRequests(user.uid)
                  .then(setAppointments)
                  .catch(error => {
                    console.error('Error reloading appointments:', error);
                    toast.error('Erro ao recarregar agendamentos');
                  });
              }
            }}
            type="completed"
          />
        </div>
      </div>
    </div>
  );

  const renderScheduleTab = () => (
    <div className="space-y-6">
      {user?.uid && <WorkScheduleManager caregiverId={user.uid} />}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Agendamentos
        </h2>
        <ScheduleList appointments={appointments} />
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      {/* Informações Profissionais */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Informações Profissionais</h2>
        {user?.uid && <Specializations caregiverId={user.uid} />}
      </div>

      {/* Certificações */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2 text-indigo-600" />
          Certificações
        </h2>
        <div className="space-y-4">
          {/* Lista de Certificações */}
          <div className="space-y-2">
            {caregiverData?.certifications?.map((cert, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{cert}</span>
                </div>
                <button
                  onClick={() => handleRemoveCertification(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>

          {/* Adicionar Nova Certificação */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              placeholder="Digite o nome da certificação"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddCertification();
                }
              }}
            />
            <button
              onClick={handleAddCertification}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>

      {/* Locais de Atendimento */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-indigo-600" />
          Locais de Atendimento
        </h2>
        
        {/* Lista de Locais */}
        <div className="space-y-4 mb-6">
          {caregiverData?.serviceLocations?.map((location, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="flex items-center">
                  <Home className="h-4 w-4 text-gray-400 mr-2" />
                  <p className="font-medium">{location.address}</p>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {location.city}, {location.state} - {location.zipCode}
                </p>
                {location.complement && (
                  <p className="text-sm text-gray-500 mt-1">
                    Complemento: {location.complement}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleRemoveLocation(index)}
                className="text-red-600 hover:text-red-800 ml-4"
              >
                Remover
              </button>
            </div>
          ))}
        </div>

        {/* Formulário para Novo Local */}
        <div className="border-t pt-4">
          <h3 className="text-md font-medium mb-4">Adicionar Novo Local</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço
              </label>
              <input
                type="text"
                value={newLocation.address}
                onChange={(e) => setNewLocation(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cidade
              </label>
              <input
                type="text"
                value={newLocation.city}
                onChange={(e) => setNewLocation(prev => ({ ...prev, city: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <input
                type="text"
                value={newLocation.state}
                onChange={(e) => setNewLocation(prev => ({ ...prev, state: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CEP
              </label>
              <input
                type="text"
                value={newLocation.zipCode}
                onChange={(e) => setNewLocation(prev => ({ ...prev, zipCode: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Complemento (opcional)
              </label>
              <input
                type="text"
                value={newLocation.complement}
                onChange={(e) => setNewLocation(prev => ({ ...prev, complement: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <button
            onClick={handleAddLocation}
            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Adicionar Local
          </button>
        </div>
      </div>

      {/* Configurações de Pagamento */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Configurações de Pagamento</h2>
        {user?.uid && <HourlyRateManager caregiverId={user.uid} />}
      </div>

      {/* Calculadora de Ganhos */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Calculadora de Ganhos</h2>
        <EarningsCalculator hourlyRate={caregiverData?.hourlyRate || 0} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Alerta de Perfil Incompleto */}
      {(!caregiverData?.experience || !caregiverData?.certifications?.length || !caregiverData?.specialties?.length) && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <p className="ml-3 text-sm text-yellow-700">
              Complete seu perfil para aumentar suas chances de contratação.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Painel do Cuidador</h1>
            <p className="text-gray-600">Bem-vindo(a), {caregiverData?.name}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Bell className="h-6 w-6" />
            </button>
            <Link 
              to="/profile/settings"
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              <Settings className="h-6 w-6" />
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'schedule'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Agendamentos
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Configurações
            </button>
          </nav>
        </div>

        {/* Conteúdo das Tabs */}
        <div className="py-4">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'schedule' && renderScheduleTab()}
          {activeTab === 'settings' && renderSettingsTab()}
        </div>
      </div>
    </div>
  );
}