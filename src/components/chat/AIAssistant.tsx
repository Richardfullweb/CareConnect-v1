import React from 'react';
import { Send, Bot, User, Loader2, X } from 'lucide-react';
import { OpenAIService } from '../../services/OpenAIService';
import { toast } from 'sonner';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await OpenAIService.sendMessage(userMessage);
      const assistantMessage = typeof response.text === 'string' 
        ? response.text 
        : 'Desculpe, não consegui processar sua mensagem.';
        
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: assistantMessage
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl overflow-hidden z-50">
      {/* Header */}
      <div className="bg-indigo-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6" />
            <h3 className="font-semibold">Assistente CareConnect</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500">
            <p>Olá! Como posso ajudar você hoje?</p>
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`flex items-start space-x-2 max-w-[80%] ${
                message.role === 'assistant'
                  ? 'flex-row'
                  : 'flex-row-reverse space-x-reverse'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'assistant'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {message.role === 'assistant' ? (
                  <Bot className="h-5 w-5" />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </div>
              <div
                className={`p-3 rounded-lg ${
                  message.role === 'assistant'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <Bot className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="p-3 rounded-lg bg-gray-100">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}