import React from 'react';
import { useClinical } from '../../context/ClinicalContext';
import { 
  FileCheck2, 
  Receipt, 
  BarChart3,
  Users,
  Bed,
  Calendar,
  Shield,
  FileText,
  ClipboardPen,
  TestTube2,
  CalendarDays,
  CheckSquare,
  Sparkles,
  Layers,
  Scroll,
  Lock,
  Clock,
  AlertTriangle,
  BookOpen,
  Activity,
  Droplets,
  ShieldCheck,
  Database,
  RefreshCw
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const { currentRole } = useClinical();

  if (!currentRole) return null;

  const getRoleMenuItems = () => {
    switch (currentRole) {
      case 'director':
        return [
          { id: 'cofepris', label: 'COFEPRIS', icon: FileCheck2 },
          { id: 'finance', label: 'Finanzas', icon: Receipt },
          { id: 'bi', label: 'Métricas', icon: BarChart3 }
        ];
      case 'admission':
        return [
          { id: 'census', label: 'Padrón', icon: Users },
          { id: 'beds', label: 'Camas', icon: Bed },
          { id: 'appointments', label: 'Citas', icon: Calendar },
          { id: 'insurance', label: 'Seguros', icon: Shield }
        ];
      case 'medical':
        return [
          { id: 'records', label: 'Expediente', icon: FileText },
          { id: 'notes', label: 'Notas SOAP', icon: ClipboardPen },
          { id: 'rx', label: 'Recetas', icon: TestTube2 }
        ];
      case 'surgical':
        return [
          { id: 'scheduling', label: 'Salas', icon: CalendarDays },
          { id: 'who_checklist', label: 'Checklist OMS', icon: CheckSquare },
          { id: 'implants', label: 'Implantes', icon: Sparkles },
          { id: 'ceye', label: 'CEYE', icon: Layers }
        ];
      case 'pharmacy':
        return [
          { id: 'dispensing', label: 'Surtido', icon: Scroll },
          { id: 'controlled', label: 'Controlados', icon: Lock },
          { id: 'fifo', label: 'Caducidades', icon: Clock },
          { id: 'crash_cart', label: 'Carro Rojo', icon: AlertTriangle }
        ];
      case 'nursing':
        return [
          { id: 'kardex', label: 'Kardex', icon: BookOpen },
          { id: 'vitals', label: 'Signos', icon: Activity },
          { id: 'fluids', label: 'Líquidos', icon: Droplets },
          { id: 'notes', label: 'Notas', icon: FileText }
        ];
      case 'tech':
        return [
          { id: 'rbac', label: 'Permisos', icon: ShieldCheck },
          { id: 'audit', label: 'Auditoría', icon: Lock },
          { id: 'backups', label: 'Respaldos', icon: Database },
          { id: 'supabase', label: 'Supabase', icon: RefreshCw }
        ];
    }
  };

  const menuItems = getRoleMenuItems();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-150 min-w-[56px] ${
                isActive
                  ? 'text-sky-700 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-sky-100 text-sky-700' : 'text-slate-500'}`}>
                <Icon className="w-5 h-5 shrink-0" />
              </div>
              <span className="text-[11px] leading-tight truncate mt-0.5 tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
