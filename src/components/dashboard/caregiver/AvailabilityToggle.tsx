import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase/config";
import { Switch } from "@headlessui/react";
import { toast } from "sonner";

interface AvailabilityToggleProps {
  caregiverId: string;
}

export default function AvailabilityToggle({ caregiverId }: AvailabilityToggleProps) {
  const [isAvailable, setIsAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!caregiverId) {
        console.error("caregiverId is required");
        setIsLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "caregivers", caregiverId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setIsAvailable(data.available ?? true);
        } else {
          // Se o documento não existir, cria com disponibilidade padrão como true
          await updateDoc(docRef, { 
            available: true,
            updatedAt: new Date().toISOString()
          });
          setIsAvailable(true);
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
        toast.error("Erro ao carregar status de disponibilidade");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, [caregiverId]);

  const toggleAvailability = async () => {
    if (!caregiverId) {
      toast.error("Erro ao atualizar status");
      return;
    }

    setIsLoading(true);
    try {
      const newState = !isAvailable;
      const docRef = doc(db, "caregivers", caregiverId);
      await updateDoc(docRef, { 
        available: newState,
        updatedAt: new Date().toISOString()
      });
      setIsAvailable(newState);
      toast.success(`Status atualizado para ${newState ? "Disponível" : "Indisponível"}`);
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error("Erro ao atualizar status de disponibilidade");
      setIsAvailable(!isAvailable);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Switch.Group>
      <div className="flex items-center justify-between">
        <Switch.Label className="mr-4">
          <span className="text-sm font-medium text-gray-900">
            Status: {isLoading ? "Carregando..." : (isAvailable ? "Disponível" : "Indisponível")}
          </span>
        </Switch.Label>
        <Switch
          checked={isAvailable}
          onChange={toggleAvailability}
          disabled={isLoading}
          className={`${
            isAvailable ? "bg-indigo-600" : "bg-gray-200"
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50`}
        >
          <span
            className={`${
              isAvailable ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>
    </Switch.Group>
  );
}
