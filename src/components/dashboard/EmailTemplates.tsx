import React from 'react';
import { Mail, Send } from 'lucide-react';
import { sendEmail, emailTemplates } from '../../services/emailService';
import { toast } from 'react-toastify';

export default function EmailTemplates() {
  const [selectedTemplate, setSelectedTemplate] = React.useState('');
  const [emailData, setEmailData] = React.useState({
    to_email: '',
    to_name: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = React.useState(false);

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
    
    // Preenche os campos com o template selecionado
    switch (template) {
      case 'welcome':
        const welcome = emailTemplates.welcomeEmail(emailData.to_name);
        setEmailData(prev => ({
          ...prev,
          subject: welcome.subject,
          message: welcome.message
        }));
        break;
      case 'order':
        const order = emailTemplates.orderConfirmation('ORD-2024-001', ['Item 1', 'Item 2']);
        setEmailData(prev => ({
          ...prev,
          subject: order.subject,
          message: order.message
        }));
        break;
      // Adicione outros casos conforme necessário
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendEmail(emailData);
      toast.success('Email enviado com sucesso!');
      setEmailData({
        to_email: '',
        to_name: '',
        subject: '',
        message: ''
      });
      setSelectedTemplate('');
    } catch (error) {
      toast.error('Erro ao enviar email. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <Mail className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Templates de Email</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Template
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecione um template</option>
            <option value="welcome">Boas-vindas</option>
            <option value="order">Confirmação de Pedido</option>
            <option value="service">Lembrete de Serviço</option>
            <option value="stock">Alerta de Estoque</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email do Destinatário
          </label>
          <input
            type="email"
            value={emailData.to_email}
            onChange={(e) => setEmailData(prev => ({ ...prev, to_email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Destinatário
          </label>
          <input
            type="text"
            value={emailData.to_name}
            onChange={(e) => setEmailData(prev => ({ ...prev, to_name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assunto
          </label>
          <input
            type="text"
            value={emailData.subject}
            onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mensagem
          </label>
          <textarea
            value={emailData.message}
            onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          <Send className="h-4 w-4" />
          {loading ? 'Enviando...' : 'Enviar Email'}
        </button>
      </form>
    </div>
  );
}