import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../../../lib/firebase/config";
import { Star } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Evaluation {
  id: string;
  rating: number;
  comment: string;
  clientName: string;
  createdAt: Timestamp;
}

interface MyEvaluationsProps {
  caregiverId: string;
}

export default function MyEvaluations({ caregiverId }: MyEvaluationsProps) {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const q = query(
          collection(db, "avaliacoes"),
          where("caregiverId", "==", caregiverId),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);

        const evals: Evaluation[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          evals.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt as Timestamp
          });
        });
        
        setEvaluations(evals);
      } catch (error) {
        console.error("Error fetching evaluations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, [caregiverId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (evaluations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhuma avaliação recebida ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {evaluations.map((evaluation) => (
        <div
          key={evaluation.id}
          className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">{evaluation.clientName}</h3>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="ml-1 font-medium">{evaluation.rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-gray-600">{evaluation.comment}</p>
          <div className="mt-2 text-sm text-gray-500">
            {format(evaluation.createdAt.toDate(), "dd 'de' MMMM 'de' yyyy", {
              locale: ptBR,
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
