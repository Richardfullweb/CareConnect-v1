import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../../contexts/AuthContext';
import { hireService } from '../../../services/hireService';
import { HireRequest, Evaluation } from '../../../types/hire';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import ScheduleList from './ScheduleList';
import CaregiverReviews from './CaregiverReviews';

export default function CaregiverDashboard() {
  const { user } = useAuthContext();
  const [requests, setRequests] = useState<HireRequest[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [caregiverRequests, caregiverEvaluations] = await Promise.all([
        hireService.getCaregiverRequests(user!.uid),
        hireService.getCaregiverEvaluations(user!.uid)
      ]);
      setRequests(caregiverRequests);
      setEvaluations(caregiverEvaluations);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="schedule">Agenda</TabsTrigger>
          <TabsTrigger value="reviews">Avaliações</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <ScheduleList 
            requests={requests} 
            onStatusChange={loadData} 
          />
        </TabsContent>

        <TabsContent value="reviews">
          <CaregiverReviews evaluations={evaluations} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
