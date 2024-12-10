import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { hireService } from '../../services/hireService';
import { HireRequest, Caregiver } from '../../types/hire';
import CaregiverSelector from './CaregiverSelector';
import HireRequestForm from './HireRequestForm';
import RequestDetails from './RequestDetails';
import EvaluationForm from './EvaluationForm';
import RequestStatus from './RequestStatus';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card } from '../ui/card';
import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function ClientDashboard() {
  const { user } = useAuthContext();
  const location = useLocation();
  const [requests, setRequests] = useState<HireRequest[]>([]);
  const [selectedCaregiver, setSelectedCaregiver] = useState<Caregiver | null>(null);
  const [showHireForm, setShowHireForm] = useState(false);
  const [requestToEvaluate, setRequestToEvaluate] = useState<HireRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user]);

  const loadRequests = async () => {
    try {
      const userRequests = await hireService.getClientRequests(user!.uid);
      setRequests(userRequests);
    } catch (error) {
      console.error('Error loading requests:', error);
      toast.error('Erro ao carregar solicitações');
    } finally {
      setLoading(false);
    }
  };

  const handleCaregiverSelect = (caregiver: Caregiver) => {
    setSelectedCaregiver(caregiver);
    setShowHireForm(true);
  };

  const handleRequestCreated = () => {
    setShowHireForm(false);
    setSelectedCaregiver(null);
    loadRequests();
    toast.success('Solicitação criada com sucesso!');
  };

  const handleEvaluationSubmit = async () => {
    await loadRequests();
    toast.success('Avaliação enviada com sucesso!');
  };

  // Agrupar solicitações por status
  const groupedRequests = {
    pending: requests.filter(r => r.status === 'pending'),
    active: requests.filter(r => r.status === 'accepted'),
    completed: requests.filter(r => r.status === 'completed'),
    other: requests.filter(r => ['rejected', 'cancelled'].includes(r.status))
  };

  // Se estivermos na rota de busca, não renderizamos o dashboard
  if (location.pathname === '/dashboard/client/search') {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="requests">Minhas Solicitações</TabsTrigger>
          <TabsTrigger value="search">Buscar Cuidador</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Você ainda não tem solicitações.</p>
              <button
                onClick={() => {
                  const requestsTab = document.querySelector('[value="search"]');
                  if (requestsTab instanceof HTMLElement) {
                    requestsTab.click();
                  }
                }}
                className="mt-4 text-indigo-600 hover:text-indigo-700"
              >
                Buscar Cuidador
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {requests.map(request => (
                <RequestStatus 
                  key={request.id} 
                  request={request} 
                  onEvaluate={setRequestToEvaluate}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="search">
          <CaregiverSelector onSelect={handleCaregiverSelect} />
        </TabsContent>
      </Tabs>

      {/* Modal de Nova Solicitação */}
      {selectedCaregiver && showHireForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
                caregiver={selectedCaregiver}
                onRequestCreated={handleRequestCreated}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Avaliação */}
      {requestToEvaluate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Avaliar Atendimento</h2>
                <button
                  onClick={() => setRequestToEvaluate(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <EvaluationForm
                request={requestToEvaluate}
                onSubmit={() => {
                  handleEvaluationSubmit();
                  setRequestToEvaluate(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
