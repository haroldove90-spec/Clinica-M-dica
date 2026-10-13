import React from 'react';
import { useClinical } from '../../context/ClinicalContext';
import { 
  Download, 
  LogOut, 
  Database, 
  ChevronDown,
  Building2,
  UserPlus,
  Stethoscope,
  Scissors,
  Pill,
  HeartPulse,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface HeaderProps {
  onOpenDataModal: () => void;
  onOpenPWAModal: () => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenDataModal, 
  onOpenPWAModal,
  isSidebarOpen,
  onToggleSidebar 
}) => {
  const { currentRole, activeRoleConfig, switchRole, isDemoDataPurged } = useClinical();
  const { isInstalled, isInstallable, install } = usePWAInstall();

  const getRoleIcon = () => {
    switch (currentRole) {
      case 'director': return <Building2 className="w-4 h-4 text-blue-600" />;
      case 'admission': return <UserPlus className="w-4 h-4 text-teal-600" />;
      case 'medical': return <Stethoscope className="w-4 h-4 text-sky-600" />;
      case 'surgical': return <Scissors className="w-4 h-4 text-indigo-600" />;
      case 'pharmacy': return <Pill className="w-4 h-4 text-emerald-600" />;
      case 'nursing': return <HeartPulse className="w-4 h-4 text-rose-600" />;
      case 'tech': return <ShieldCheck className="w-4 h-4 text-slate-700" />;
      default: return null;
    }
  };

  const handleInstallClick = () => {
    if (isInstallable) {
      install();
    } else {
      onOpenPWAModal();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Zona 1: Logotipo Institucional + Toggle Sidebar */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-hidden"
                aria-label="Abrir menú"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <button 
              onClick={() => switchRole(null)} 
              className="flex items-center gap-2.5 text-left focus:outline-hidden group"
              title="Ir a selección de roles"
            >
              {/* Logotipo para clínica médica */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-600 flex items-center justify-center shadow-xs shrink-0 group-hover:opacity-95 transition-opacity">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M2 12h20" />
                  <circle cx="12" cy="12" r="3" fill="white" fillOpacity="0.2" />
                </svg>
              </div>
              <div className="hidden xs:block">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-sky-700 transition-colors">
                  Clinica Médica
                </span>
                <span className="hidden sm:inline text-xs text-slate-500 font-medium ml-2">
                  Hospital Central
                </span>
              </div>
            </button>
          </div>

          {/* Zona 2: Identificación del Rol Activo */}
          {activeRoleConfig && (
            <div className="flex items-center">
              <button
                onClick={() => switchRole(null)}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-800 rounded-lg text-xs sm:text-sm font-semibold transition-colors border border-slate-200/60 max-w-[170px] sm:max-w-xs truncate"
                title="Cambiar rol activo"
              >
                <span className="shrink-0">{getRoleIcon()}</span>
                <span className="truncate">{activeRoleConfig.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0 hidden sm:inline" />
              </button>
            </div>
          )}

          {/* Zona 3: Botón de instalación, Gestión de Datos y Cierre de Sesión */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Botón Gestión de Datos & Supabase */}
            <button
              onClick={onOpenDataModal}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                isDemoDataPurged 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100' 
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Borrar datos de muestra o conectar Supabase"
            >
              <Database className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden md:inline">
                {isDemoDataPurged ? 'Datos Limpios' : 'Datos Muestra'}
              </span>
            </button>

            {/* Botón Instalación Rápida PWA */}
            {!isInstalled && (
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 text-white hover:bg-sky-700 transition shadow-2xs"
                title="Instalar aplicación en tu dispositivo"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Instalar</span>
              </button>
            )}

            {/* Botón Cierre de Sesión */}
            <button
              onClick={() => switchRole(null)}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-200"
              title="Cerrar sesión y volver al selector de roles"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden lg:inline">Cerrar Sesión</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
