import React, { useState, useEffect } from 'react';
import { ClinicalProvider, useClinical } from './context/ClinicalContext';
import { RoleSelector } from './components/common/RoleSelector';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { DataManagementModal } from './components/common/DataManagementModal';
import { PWAInstallModal } from './components/common/PWAInstallModal';
import { DirectorModule } from './components/modules/DirectorModule';
import { AdmissionModule } from './components/modules/AdmissionModule';
import { MedicalModule } from './components/modules/MedicalModule';
import { SurgicalModule } from './components/modules/SurgicalModule';
import { PharmacyModule } from './components/modules/PharmacyModule';
import { NursingModule } from './components/modules/NursingModule';
import { TechModule } from './components/modules/TechModule';
import { CheckCircle2, AlertCircle, WifiOff } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentRole, activeRoleConfig, toast } = useClinical();
  const [activeTab, setActiveTab] = useState<string>('cofepris');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isPWAModalOpen, setIsPWAModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Connectivity monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update default tab whenever the role changes
  useEffect(() => {
    if (currentRole) {
      switch (currentRole) {
        case 'director':
          setActiveTab('cofepris');
          break;
        case 'admission':
          setActiveTab('census');
          break;
        case 'medical':
          setActiveTab('records');
          break;
        case 'surgical':
          setActiveTab('scheduling');
          break;
        case 'pharmacy':
          setActiveTab('dispensing');
          break;
        case 'nursing':
          setActiveTab('kardex');
          break;
        case 'tech':
          setActiveTab('rbac');
          break;
      }
    }
  }, [currentRole]);

  // If no role is selected, render the clean role selection grid:
  // "Selector limpio con tarjetas independientes para cada rol. Sin header, sin descripciones, solo nombre del rol y el logo"
  if (!currentRole) {
    return (
      <>
        <RoleSelector 
          onOpenDataModal={() => setIsDataModalOpen(true)}
          onOpenPWAModal={() => setIsPWAModalOpen(true)}
        />
        <DataManagementModal 
          isOpen={isDataModalOpen} 
          onClose={() => setIsDataModalOpen(false)} 
        />
        <PWAInstallModal 
          isOpen={isPWAModalOpen} 
          onClose={() => setIsPWAModalOpen(false)} 
        />
      </>
    );
  }

  // Render the active module based on current role
  const renderRoleModule = () => {
    switch (currentRole) {
      case 'director':
        return <DirectorModule activeTab={activeTab} />;
      case 'admission':
        return <AdmissionModule activeTab={activeTab} />;
      case 'medical':
        return <MedicalModule activeTab={activeTab} />;
      case 'surgical':
        return <SurgicalModule activeTab={activeTab} />;
      case 'pharmacy':
        return <PharmacyModule activeTab={activeTab} />;
      case 'nursing':
        return <NursingModule activeTab={activeTab} />;
      case 'tech':
        return <TechModule activeTab={activeTab} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Offline Alert Banner */}
      {!isOnline && (
        <div className="bg-amber-500 text-white text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-center gap-1.5 sticky top-0 z-50">
          <WifiOff className="w-4 h-4" />
          <span>Modo sin conexión — Operando con almacenamiento local en caché.</span>
        </div>
      )}

      {/* Cabecera Institucional Unificada */}
      <Header
        onOpenDataModal={() => setIsDataModalOpen(true)}
        onOpenPWAModal={() => setIsPWAModalOpen(true)}
        isSidebarOpen={isMobileSidebarOpen}
        onToggleSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
      />

      {/* Main Workspace: Desktop Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Menú Lateral Desplegable en Escritorio */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tabId) => {
            setActiveTab(tabId);
            setIsMobileSidebarOpen(false);
          }}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
          onOpenDataModal={() => setIsDataModalOpen(true)}
        />

        {/* Mobile slide-over drawer when hamburger is toggled */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            <div 
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" 
              onClick={() => setIsMobileSidebarOpen(false)} 
            />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl z-50">
              <Sidebar
                activeTab={activeTab}
                onSelectTab={(tabId) => {
                  setActiveTab(tabId);
                  setIsMobileSidebarOpen(false);
                }}
                isCollapsed={false}
                onToggleCollapse={() => setIsMobileSidebarOpen(false)}
                onOpenDataModal={() => {
                  setIsDataModalOpen(true);
                  setIsMobileSidebarOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Dynamic Content Viewport */}
        <main className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6 lg:px-8 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto">
            {renderRoleModule()}
          </div>
        </main>
      </div>

      {/* Navegación Móvil y Tablet (Bottom Bar) */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-16 md:bottom-6 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg border text-xs sm:text-sm font-semibold transition-all duration-200 animate-in fade-in slide-in-from-bottom-3 bg-slate-900 text-white border-slate-800">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Data Management & Supabase Modal */}
      <DataManagementModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
      />

      {/* PWA Install Modal */}
      <PWAInstallModal
        isOpen={isPWAModalOpen}
        onClose={() => setIsPWAModalOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <ClinicalProvider>
      <MainLayout />
    </ClinicalProvider>
  );
}
