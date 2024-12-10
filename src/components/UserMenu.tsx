import { User } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { auth } from '../lib/firebase/config';
import { signOut } from 'firebase/auth';
import { toast } from 'sonner';

export default function UserMenu() {
  const { user } = useAuthContext();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logout realizado com sucesso');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button 
        onClick={handleLogout}
        className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      >
        <User className="h-6 w-6" />
      </button>
    </div>
  );
}
