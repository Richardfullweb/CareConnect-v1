import React from 'react';
import { 
  LayoutDashboard,
  Wrench,
  Package,
  Clock,
  Users,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';

export default function DashboardNav() {
  return (
    <div className="fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-200 hidden lg:flex lg:flex-col">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">
        <Wrench className="h-8 w-8 text-blue-600" />
        <span className="text-2xl font-bold">MechanicAI</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavItem icon={<LayoutDashboard />} label="Dashboard" active />
        <NavItem icon={<Wrench />} label="Serviços" />
        <NavItem icon={<Package />} label="Inventário" />
        <NavItem icon={<Clock />} label="Agendamentos" />
        <NavItem icon={<Users />} label="Clientes" />
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <NavItem icon={<Settings />} label="Configurações" />
          <NavItem icon={<HelpCircle />} label="Ajuda" />
          <NavItem icon={<LogOut />} label="Sair" />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ icon, label, active = false }: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <a
      href="#"
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
        ${active 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }
      `}
    >
      {icon}
      {label}
    </a>
  );
}