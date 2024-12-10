import React from 'react';
import { 
  BarChart3, 
  Wrench,
  Package, 
  Clock, 
  Search,
  Bell,
  User,
  Settings,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Users,
  Car
} from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardNav from './DashboardNav';
import DashboardHeader from './DashboardHeader';
import RecentOrders from './RecentOrders';
import StatsGrid from './StatsGrid';
import InventoryStatus from './InventoryStatus';
import ServiceHistory from './ServiceHistory';
import EmailTemplates from './EmailTemplates';
import Calendar from './Calendar';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <div className="lg:pl-72">
        <DashboardHeader />
        
        <main className="p-8">
          <StatsGrid />
          
          <div className="mt-8">
            <Calendar />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <InventoryStatus />
            <ServiceHistory />
          </div>
          
          <div className="mt-8">
            <EmailTemplates />
          </div>
          
          <RecentOrders />
        </main>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}