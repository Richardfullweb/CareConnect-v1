import React from 'react';
import { seedCuidadores } from '../../lib/firebase/seed';

export function SeedButton() {
  const [loading, setLoading] = React.useState(false);

  const handleSeed = async () => {
    setLoading(true);
    try {
      await seedCuidadores();
      alert('Dados de exemplo adicionados com sucesso!');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao adicionar dados de exemplo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSeed}
      disabled={loading}
      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
    >
      {loading ? 'Adicionando...' : 'Adicionar Dados de Exemplo'}
    </button>
  );
}
