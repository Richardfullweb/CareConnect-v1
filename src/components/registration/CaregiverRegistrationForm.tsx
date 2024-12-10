import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, MapPin, Briefcase, Award, Clock, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
const cepRegex = /^\d{5}-\d{3}$/;

// Schema unificado para o formulário
const caregiverSchema = z.object({
  // Dados Pessoais
  name: z.string().min(3, 'Nome completo é obrigatório'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().regex(phoneRegex, 'Telefone inválido - formato: (99) 99999-9999'),
  cpf: z.string().min(11, 'CPF inválido'),
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
  gender: z.enum(['M', 'F', 'O'], { required_error: 'Selecione um gênero' }),
  
  // Endereço
  address: z.object({
    street: z.string().min(1, 'Endereço é obrigatório'),
    number: z.string().min(1, 'Número é obrigatório'),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, 'Bairro é obrigatório'),
    city: z.string().min(1, 'Cidade é obrigatória'),
    state: z.string().min(2, 'Estado é obrigatório'),
    zipCode: z.string().regex(cepRegex, 'CEP inválido - formato: 99999-999')
  }),

  // Experiência Profissional
  experience: z.object({
    yearsOfExperience: z.number().min(0, 'Anos de experiência inválidos'),
    previousJobs: z.array(z.object({
      company: z.string(),
      position: z.string(),
      startDate: z.string(),
      endDate: z.string().optional(),
      description: z.string()
    })).optional(),
    specialties: z.array(z.string()).min(1, 'Selecione pelo menos uma especialidade'),
    certificates: z.array(z.object({
      name: z.string(),
      institution: z.string(),
      date: z.string()
    })).optional()
  }),

  // Disponibilidade
  availability: z.object({
    workDays: z.array(z.string()).min(1, 'Selecione os dias disponíveis'),
    workHours: z.object({
      start: z.string(),
      end: z.string()
    }),
    preferences: z.object({
      overnight: z.boolean(),
      weekends: z.boolean(),
      holidays: z.boolean()
    })
  }),

  // Serviços e Valores
  services: z.object({
    hourlyRate: z.number().min(1, 'Valor hora é obrigatório'),
    minimumHours: z.number().min(1, 'Mínimo de horas é obrigatório'),
    specializedServices: z.array(z.object({
      service: z.string(),
      additionalCost: z.number()
    })).optional()
  }),

  // Documentação
  documents: z.object({
    identityDocument: z.string().min(1, 'RG é obrigatório'),
    professionalCertification: z.string().optional(),
    criminalRecord: z.string().min(1, 'Certidão de antecedentes é obrigatória'),
    proofOfAddress: z.string().min(1, 'Comprovante de residência é obrigatório')
  }),

  // Informações Adicionais
  additionalInfo: z.object({
    bio: z.string().min(50, 'Biografia deve ter pelo menos 50 caracteres'),
    languages: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
    references: z.array(z.object({
      name: z.string(),
      phone: z.string(),
      relationship: z.string()
    })).optional()
  })
});

type CaregiverFormData = z.infer<typeof caregiverSchema>;

export default function UnifiedCaregiverForm() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<CaregiverFormData>({
    resolver: zodResolver(caregiverSchema)
  });

  const onSubmit = async (data: CaregiverFormData) => {
    try {
      // Aqui vai a lógica de submissão do formulário
      console.log('Dados do formulário:', data);
      toast.success('Cadastro realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      toast.error('Erro ao realizar cadastro. Tente novamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
      {/* Dados Pessoais */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Dados Pessoais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input
              type="text"
              {...register('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              {...register('email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Telefone</label>
            <input
              type="tel"
              {...register('phone')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CPF</label>
            <input
              type="text"
              {...register('cpf')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.cpf && (
              <p className="mt-1 text-sm text-red-600">{errors.cpf.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
            <input
              type="date"
              {...register('birthDate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.birthDate && (
              <p className="mt-1 text-sm text-red-600">{errors.birthDate.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gênero</label>
            <select
              {...register('gender')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Selecione um gênero</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="O">Outro</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
            )}
          </div>
        </div>
      </section>

      {/* Endereço */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Endereço</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Rua</label>
            <input
              type="text"
              {...register('address.street')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.address?.street && (
              <p className="mt-1 text-sm text-red-600">{errors.address.street.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Número</label>
            <input
              type="text"
              {...register('address.number')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.address?.number && (
              <p className="mt-1 text-sm text-red-600">{errors.address.number.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Complemento</label>
            <input
              type="text"
              {...register('address.complement')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bairro</label>
            <input
              type="text"
              {...register('address.neighborhood')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.address?.neighborhood && (
              <p className="mt-1 text-sm text-red-600">{errors.address.neighborhood.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cidade</label>
            <input
              type="text"
              {...register('address.city')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.address?.city && (
              <p className="mt-1 text-sm text-red-600">{errors.address.city.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <input
              type="text"
              {...register('address.state')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.address?.state && (
              <p className="mt-1 text-sm text-red-600">{errors.address.state.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CEP</label>
            <input
              type="text"
              {...register('address.zipCode')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.address?.zipCode && (
              <p className="mt-1 text-sm text-red-600">{errors.address.zipCode.message}</p>
            )}
          </div>
        </div>
      </section>

      {/* Experiência Profissional */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Experiência Profissional</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Anos de Experiência</label>
            <input
              type="number"
              {...register('experience.yearsOfExperience')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.experience?.yearsOfExperience && (
              <p className="mt-1 text-sm text-red-600">{errors.experience.yearsOfExperience.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Especialidades</label>
            <select
              {...register('experience.specialties')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Selecione uma especialidade</option>
              <option value="Cuidados com Idosos">Cuidados com Idosos</option>
              <option value="Primeiros Socorros">Primeiros Socorros</option>
              <option value="Alzheimer">Alzheimer</option>
              <option value="Parkinson">Parkinson</option>
              <option value="Mobilidade Reduzida">Mobilidade Reduzida</option>
              <option value="Cuidados Paliativos">Cuidados Paliativos</option>
              <option value="Reabilitação">Reabilitação</option>
              <option value="Pós-operatório">Pós-operatório</option>
            </select>
            {errors.experience?.specialties && (
              <p className="mt-1 text-sm text-red-600">{errors.experience.specialties.message}</p>
            )}
          </div>
        </div>
      </section>

      {/* Disponibilidade */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Disponibilidade</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Dias Disponíveis</label>
            <select
              {...register('availability.workDays')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Selecione os dias disponíveis</option>
              <option value="Segunda">Segunda</option>
              <option value="Terça">Terça</option>
              <option value="Quarta">Quarta</option>
              <option value="Quinta">Quinta</option>
              <option value="Sexta">Sexta</option>
              <option value="Sábado">Sábado</option>
              <option value="Domingo">Domingo</option>
            </select>
            {errors.availability?.workDays && (
              <p className="mt-1 text-sm text-red-600">{errors.availability.workDays.message}</p>
            )}
          </div>
        </div>
      </section>

      {/* Serviços e Valores */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Serviços e Valores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Valor Hora</label>
            <input
              type="number"
              {...register('services.hourlyRate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.services?.hourlyRate && (
              <p className="mt-1 text-sm text-red-600">{errors.services.hourlyRate.message}</p>
            )}
          </div>
        </div>
      </section>

      {/* Documentação */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Documentação</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">RG</label>
            <input
              type="text"
              {...register('documents.identityDocument')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.documents?.identityDocument && (
              <p className="mt-1 text-sm text-red-600">{errors.documents.identityDocument.message}</p>
            )}
          </div>
        </div>
      </section>

      {/* Informações Adicionais */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Informações Adicionais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Biografia</label>
            <textarea
              {...register('additionalInfo.bio')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.additionalInfo?.bio && (
              <p className="mt-1 text-sm text-red-600">{errors.additionalInfo.bio.message}</p>
            )}
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cadastrar
        </button>
      </div>
    </form>
  );
}