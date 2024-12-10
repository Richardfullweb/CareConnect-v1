import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { Bell, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PendingRequest {
  id: string;
  clientName: string;
  createdAt: any;
  description: string;
}

export default function PendingRequestsAlert({ caregiverId }: { caregiverId: string }) {
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [hasNewRequests, setHasNewRequests] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "appointments"),
      where("caregiverId", "==", caregiverId),
      where("status", "==", "pending")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requests: PendingRequest[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        requests.push({
          id: doc.id,
          clientName: data.clientName,
          createdAt: data.createdAt?.toDate(),
          description: data.description
        });
      });

      setPendingRequests(requests);
      if (requests.length > 0) {
        setHasNewRequests(true);
        // Tocar um som de notificação
        const audio = new Audio('/notification.mp3');
        audio.play().catch(() => {});
      }
    });

    return () => unsubscribe();
  }, [caregiverId]);

  if (!isOpen || pendingRequests.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full bg-white rounded-lg shadow-lg border-l-4 border-orange-500 p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Bell className="h-6 w-6 text-orange-500" />
        </div>
        <div className="ml-3 w-full">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {pendingRequests.length} {pendingRequests.length === 1 ? 'nova solicitação' : 'novas solicitações'}
              </h3>
              <div className="mt-2 space-y-3">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="bg-orange-50 p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-900">
                      {request.clientName}
                    </p>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {request.description}
                    </p>
                    {request.createdAt && (
                      <p className="mt-1 text-xs text-gray-500">
                        Recebido há {formatDistanceToNow(request.createdAt, { locale: ptBR, addSuffix: false })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <a
                  href="#pending-requests"
                  className="text-sm font-medium text-orange-600 hover:text-orange-500"
                  onClick={() => setIsOpen(false)}
                >
                  Ver todas as solicitações
                </a>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="ml-4 text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
