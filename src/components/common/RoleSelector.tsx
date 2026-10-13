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
  Download,
  Database
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface RoleSelectorProps {
  onOpenDataModal?: () => void;
  onOpenPWAModal?: () => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onOpenDataModal, onOpenPWAModal }) => {
  const { switchRole, isDemoDataPurged } = useClinical();
  const { isInstalled, isIOS, isInstallable, install } = usePWAInstall();

  const roleList: Array<{ id: RoleId; name: string; icon: React.ReactNode; colorClass: string; iconBg: string }> = [
    {
      id: 'director',
      name: 'Dirección General y Administración',
      icon: <Building2 className="w-10 h-10 md:w-12 md:h-12 text-blue-700 transition-transform group-hover:scale-110 duration-200" />,
      colorClass: 'border-blue-200 hover:border-blue-500 hover:shadow-blue-500/10',
      iconBg: 'bg-blue-50 text-blue-700'
    },
    {
      id: 'admission',
      name: 'Admisión y Recepción',
      icon: <UserPlus className="w-10 h-10 md:w-12 md:h-12 text-teal-700 transition-transform group-hover:scale-110 duration-200" />,
      colorClass: 'border-teal-200 hover:border-teal-500 hover:shadow-teal-500/10',
      iconBg: 'bg-teal-50 text-teal-700'
    },
    {
      id: 'medical',
      name: 'Personal Médico',
      icon: <Stethoscope className="w-10 h-10 md:w-12 md:h-12 text-sky-700 transition-transform group-hover:scale-110 duration-200" />,
      colorClass: 'border-sky-200 hover:border-sky-500 hover:shadow-sky-500/10',
      iconBg: 'bg-sky-50 text-sky-700'
    },
    {
      id: 'surgical',
      name: 'Bloque Quirúrgico',
      icon: <Scissors className="w-10 h-10 md:w-12 md:h-12 text-indigo-700 transition-transform group-hover:scale-110 duration-200" />,
      colorClass: 'border-indigo-200 hover:border-indigo-500 hover:shadow-indigo-500/10',
      iconBg: 'bg-indigo-50 text-indigo-700'
    },
    {
      id: 'pharmacy',
      name: 'Farmacia Interna',
      icon: <Pill className="w-10 h-10 md:w-12 md:h-12 text-emerald-700 transition-transform group-hover:scale-110 duration-200" />,
      colorClass: 'border-emerald-200 hover:border-emerald-500 hover:shadow-emerald-500/10',
      iconBg: 'bg-emerald-50 text-emerald-700'
    },
    {
      id: 'nursing',
      name: 'Enfermería y Servicios Auxiliares',
      icon: <HeartPulse className="w-10 h-10 md:w-12 md:h-12 text-rose-700 transition-transform group-hover:scale-110 duration-200" />,
      colorClass: 'border-rose-200 hover:border-rose-500 hover:shadow-rose-500/10',
      iconBg: 'bg-rose-50 text-rose-700'
    },
    {
      id: 'tech',
      name: 'Sistemas y Tecnologías (TI)',
      icon: <ShieldCheck className="w-10 h-10 md:w-12 md:h-12 text-slate-700 transition-transform group-hover:scale-110 duration-200" />,
      colorClass: 'border-slate-300 hover:border-slate-600 hover:shadow-slate-500/10',
      iconBg: 'bg-slate-100 text-slate-800'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* Cuadrícula 2 Columnas Móvil / 4 Columnas Escritorio: Sin header, sin descripciones, solo nombre del rol y el logo */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {roleList.map((role) => (
            <button
              key={role.id}
              onClick={() => switchRole(role.id)}
              className={`group flex flex-col items-center justify-center p-5 sm:p-7 md:p-8 bg-white rounded-2xl border-2 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${role.colorClass}`}
            >
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105 duration-200 ${role.iconBg}`}>
                {role.icon}
              </div>
              <span className="text-sm sm:text-base md:text-lg font-bold text-slate-800 group-hover:text-sky-900 leading-snug">
                {role.name}
              </span>
            </button>
          ))}

          {/* Quick Action Card to balance 8 grid slots in 4-column layout */}
          <div className="flex flex-col gap-2 p-3 bg-white/70 backdrop-blur rounded-2xl border border-slate-200 justify-center">
            <button
              onClick={onOpenDataModal}
              className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <Database className="w-4 h-4 text-slate-600 shrink-0" />
              <span className="truncate">
                {isDemoDataPurged ? 'Base de Datos Limpia' : 'Gestionar Datos'}
              </span>
            </button>

            {!isInstalled && (
              <button
                onClick={() => {
                  if (isInstallable) {
                    install();
                  } else if (onOpenPWAModal) {
                    onOpenPWAModal();
                  }
                }}
                className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs sm:text-sm font-semibold text-sky-800 hover:text-sky-950 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors border border-sky-200"
              >
                <Download className="w-4 h-4 text-sky-600 shrink-0" />
                <span className="truncate">Instalar App</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
