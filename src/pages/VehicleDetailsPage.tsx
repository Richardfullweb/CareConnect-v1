import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  Car, 
  Wrench, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Camera,
  Settings,
  BarChart,
  MessageSquare
} from 'lucide-react';
import DiagnosticAssistant from '../components/ai/DiagnosticAssistant';

export default function VehicleDetailsPage() {
  const { id } = useParams();
  
  const vehicle = {
    id: '1',
    plate: 'ABC-1234',
    model: 'Honda Civic',
    year: '2020',
    owner: 'Carlos Silva',
    vin: '1HGCM82633A123456',
    lastService: '2024-02-15',
    nextService: '2024-05-15',
    mileage: '45.000',
    status: 'active'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:pl-72">
        <main className="p-8">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Car className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{vehicle.model}</h1>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-gray-600">Placa: {vehicle.plate}</span>
                    <span className="text-gray-600">Ano: {vehicle.year}</span>
                    <span className="text-gray-600">KM: {vehicle.mileage}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  <Wrench className="h-4 w-4" />
                  Novo Serviço
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <Camera className="h-4 w-4" />
                  Fotos
                </button>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Assistente AI</h2>
            </div>
            <DiagnosticAssistant vehicleId={id || '1'} />
          </div>
        </main>
      </div>
    </div>
  );
}