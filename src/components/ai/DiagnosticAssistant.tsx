import React, { useState } from 'react';
import { MessageSquare, AlertTriangle, Tool, Wrench } from 'lucide-react';
import { AIService } from '../../services/aiService';
import ReactMarkdown from 'react-markdown';

interface DiagnosticAssistantProps {
  vehicleId: string;
  obd2Data?: any;
}

export default function DiagnosticAssistant({ vehicleId, obd2Data }: DiagnosticAssistantProps) {
  const [query, setQuery] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [manualQuery, setManualQuery] = useState('');
  const [manualResponse, setManualResponse] = useState('');
  const [isLoadingManual, setIsLoadingManual] = useState(false);

  const aiService = AIService.getInstance();

  const handleSymptomAdd = (symptom: string) => {
    if (symptom && !symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]);
    }
    setQuery('');
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const results = await aiService.analyzeDiagnostics({
        vehicleId,
        obd2Data: obd2Data || {},
        symptoms,
        dtcCodes: obd2Data?.dtcCodes || []
      });
      setSuggestions(results);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleManualQuery = async () => {
    if (!manualQuery.trim()) return;
    
    setIsLoadingManual(true);
    try {
      const explanation = await aiService.getManualExplanation(vehicleId, manualQuery);
      setManualResponse(explanation);
    } catch (error) {
      console.error('Manual query error:', error);
    } finally {
      setIsLoadingManual(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Assistente de Diagnóstico</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descreva os sintomas
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSymptomAdd(query)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Barulho ao frear..."
              />
              <button
                onClick={() => handleSymptomAdd(query)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Adicionar
              </button>
            </div>
          </div>

          {symptoms.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {symptoms.map((symptom, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                >
                  {symptom}
                  <button
                    onClick={() => setSymptoms(symptoms.filter((_, i) => i !== index))}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || symptoms.length === 0}
            className={`w-full py-2 rounded-lg font-medium transition
              ${isAnalyzing || symptoms.length === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
          >
            {isAnalyzing ? 'Analisando...' : 'Analisar Sintomas'}
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="mt-6 space-y-4">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h3 className="font-medium text-lg mb-2">{suggestion.issue}</h3>
                <p className="text-gray-600 mb-4">{suggestion.solution}</p>
                
                {suggestion.warnings.length > 0 && (
                  <div className="flex items-start gap-2 text-amber-600 mb-4">
                    <AlertTriangle className="h-5 w-5 mt-0.5" />
                    <ul className="text-sm">
                      {suggestion.warnings.map((warning: string, i: number) => (
                        <li key={i}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium flex items-center gap-2 mb-2">
                      <Tool className="h-4 w-4" />
                      Ferramentas Necessárias
                    </h4>
                    <ul className="text-sm text-gray-600">
                      {suggestion.tools.map((tool: string, i: number) => (
                        <li key={i}>{tool}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium flex items-center gap-2 mb-2">
                      <Wrench className="h-4 w-4" />
                      Peças Recomendadas
                    </h4>
                    <ul className="text-sm text-gray-600">
                      {suggestion.parts.map((part: string, i: number) => (
                        <li key={i}>{part}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>Tempo estimado: {suggestion.estimatedTime}</span>
                  <span>Dificuldade: {suggestion.difficulty}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Consulta ao Manual</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              O que você quer saber?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualQuery}
                onChange={(e) => setManualQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleManualQuery()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Como trocar o óleo..."
              />
              <button
                onClick={handleManualQuery}
                disabled={isLoadingManual || !manualQuery.trim()}
                className={`px-4 py-2 rounded-lg transition ${
                  isLoadingManual || !manualQuery.trim()
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isLoadingManual ? 'Consultando...' : 'Consultar'}
              </button>
            </div>
          </div>

          {manualResponse && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <ReactMarkdown className="prose max-w-none">
                {manualResponse}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}