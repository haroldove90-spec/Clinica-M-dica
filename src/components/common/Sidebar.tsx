import React from 'react';
import { useClinical, ROLE_DEFINITIONS } from '../../context/ClinicalContext';
import { RoleId } from '../../types/clinical';
import { 
  Building2, 
  UserPlus, 
  Stethoscope, 
  Scissors, 
  Pill, 
  HeartPulse, 
  ShieldCheck,
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
  FileCheck,
  CalendarDays,
  CheckSquare,
  Sparkles,
  Layers,
  Scroll,
  Clock,
  AlertTriangle,
  Activity,
  Droplets,
  BookOpen,
  Lock,
  Database,
  RefreshCw,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenDataModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  onOpenDataModal
}) => {
  const { currentRole, switchRole, isDemoDataPurged, patients, beds, pharmacyMeds } = useClinical();

  if (!currentRole) return null;

  // Module menus tailored to the active role
  const getRoleMenuItems = () => {
    switch (currentRole) {
      case 'director':
        return [
          { id: 'cofepris', label: 'Cumplimiento COFEPRIS', icon: FileCheck2 },
          { id: 'finance', label: 'Finanzas y CFDI 4.0', icon: Receipt },
          { id: 'bi', label: 'Business Intelligence', icon: BarChart3 }
        ];
      case 'admission':
        return [
          { id: 'census', label: 'Padrón de Pacientes', icon: Users, badge: patients.length },
          { id: 'beds', label: 'Camas y Admisión', icon: Bed, badge: beds.filter(b => b.status === 'Ocupada').length + '/' + beds.length },
          { id: 'appointments', label: 'Agenda de Citas', icon: Calendar },
          { id: 'insurance', label: 'Seguros y Convenios', icon: Shield }
        ];
      case 'medical':
        return [
          { id: 'records', label: 'Expediente NOM-004', icon: FileText },
          { id: 'notes', label: 'Notas Médicas (SOAP)', icon: ClipboardPen },
          { id: 'rx', label: 'Recetas y Órdenes', icon: TestTube2 },
          { id: 'signatures', label: 'Firma y Cédulas', icon: FileCheck }
        ];
      case 'surgical':
        return [
          { id: 'scheduling', label: 'Programación Quirófanos', icon: CalendarDays },
          { id: 'who_checklist', label: 'Cirugía Segura (OMS)', icon: CheckSquare },
          { id: 'implants', label: 'Insumos e Implantes', icon: Sparkles },
          { id: 'ceye', label: 'CEYE y Esterilización', icon: Layers }
        ];
      case 'pharmacy':
        return [
          { id: 'dispensing', label: 'Surtido Intrahospitalario', icon: Scroll },
          { id: 'controlled', label: 'Libro de Controlados', icon: Lock },
          { id: 'fifo', label: 'Lotes y Caducidades', icon: Clock },
          { id: 'crash_cart', label: 'Stock & Carro Rojo', icon: AlertTriangle }
        ];
      case 'nursing':
        return [
          { id: 'kardex', label: 'Kardex Medicamentos', icon: BookOpen },
          { id: 'vitals', label: 'Signos Vitales & Dolor', icon: Activity },
          { id: 'fluids', label: 'Balance de Líquidos', icon: Droplets },
          { id: 'notes', label: 'Notas de Enfermería', icon: FileText }
        ];
      case 'tech':
        return [
          { id: 'rbac', label: 'Control de Roles (RBAC)', icon: ShieldCheck },
          { id: 'audit', label: 'Bitácoras de Seguridad', icon: Lock },
          { id: 'backups', label: 'Respaldos Base de Datos', icon: Database },
          { id: 'supabase', label: 'Conexión Supabase', icon: RefreshCw }
        ];
    }
  };

  const menuItems = getRoleMenuItems();
  const currentRoleInfo = ROLE_DEFINITIONS[currentRole];

  return (
    <aside 
      className={`hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-200 select-none ${
        isCollapsed ? 'w-20' : 'w-64 lg:w-72'
      }`}
    >
      {/* Role Info Bar in Sidebar */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-100">
            {currentRole === 'director' && <Building2 className="w-5 h-5 text-blue-700" />}
            {currentRole === 'admission' && <UserPlus className="w-5 h-5 text-teal-700" />}
            {currentRole === 'medical' && <Stethoscope className="w-5 h-5 text-sky-700" />}
            {currentRole === 'surgical' && <Scissors className="w-5 h-5 text-indigo-700" />}
            {currentRole === 'pharmacy' && <Pill className="w-5 h-5 text-emerald-700" />}
            {currentRole === 'nursing' && <HeartPulse className="w-5 h-5 text-rose-700" />}
            {currentRole === 'tech' && <ShieldCheck className="w-5 h-5 text-slate-800" />}
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Módulo Activo
              </h2>
              <p className="text-sm font-bold text-slate-900 truncate">
                {currentRoleInfo.name}
              </p>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 focus:outline-hidden"
            title="Colapsar menú"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {isCollapsed && (
        <div className="flex justify-center py-2 border-b border-slate-100">
          <button
            onClick={onToggleCollapse}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 focus:outline-hidden"
            title="Expandir menú"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Links for Current Role */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className={`px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider ${isCollapsed ? 'hidden' : 'block'}`}>
          Operaciones
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 focus:outline-hidden ${
                isActive
                  ? 'bg-sky-50 text-sky-900 font-semibold shadow-2xs border border-sky-200/60'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              } ${isCollapsed ? 'justify-center px-2' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
              {!isCollapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}
              {!isCollapsed && item.badge !== undefined && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono tabular-nums">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Roles Quick Switcher */}
        <div className="pt-4 mt-4 border-t border-slate-100">
          <div className={`px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider ${isCollapsed ? 'hidden' : 'block'}`}>
            Cambiar Área
          </div>
          <div className="space-y-1 mt-1">
            {(Object.keys(ROLE_DEFINITIONS) as RoleId[])
              .filter(r => r !== currentRole)
              .map((roleKey) => {
                const rInfo = ROLE_DEFINITIONS[roleKey];
                return (
                  <button
                    key={roleKey}
                    onClick={() => switchRole(roleKey)}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors ${
                      isCollapsed ? 'justify-center px-1' : ''
                    }`}
                    title={rInfo.name}
                  >
                    <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
                    {!isCollapsed && <span className="truncate">{rInfo.name}</span>}
                  </button>
                );
              })}
          </div>
        </div>
      </nav>

      {/* Sidebar Footer Controls */}
      <div className="p-3 border-t border-slate-100 space-y-2">
        <button
          onClick={onOpenDataModal}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors ${
            isCollapsed ? 'justify-center px-2' : ''
          }`}
          title="Gestión de Datos y Base de Datos"
        >
          <Database className="w-4 h-4 text-slate-500 shrink-0" />
          {!isCollapsed && (
            <span className="truncate">
              {isDemoDataPurged ? 'Base Limpia' : 'Control de Datos'}
            </span>
          )}
        </button>

        <button
          onClick={() => switchRole(null)}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 hover:text-rose-900 bg-rose-50/70 hover:bg-rose-100/70 border border-rose-200/60 transition-colors ${
            isCollapsed ? 'justify-center px-2' : ''
          }`}
          title="Cerrar Sesión"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="truncate">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};
