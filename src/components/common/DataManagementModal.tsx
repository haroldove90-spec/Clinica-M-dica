import React, { useState } from 'react';
import { useClinical } from '../../context/ClinicalContext';
import { 
  X, 
  Trash2, 
  RotateCcw, 
  Database, 
  Check, 
  Copy, 
  Server, 
  Download, 
  AlertCircle,
  ShieldAlert,
  ExternalLink
} from 'lucide-react';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({ isOpen, onClose }) => {
  const {
    isDemoDataPurged,
    purgeDemoData,
    restoreDemoData,
    supabaseConfig,
    saveSupabaseConfig,
    testSupabaseConnection,
    supabaseDDLScript,
    patients,
    appointments,
    medicalNotes,
    prescriptions,
    pharmacyMeds,
    surgicalProcedures,
    showToast
  } = useClinical();

  const [neverShowDemoAgain, setNeverShowDemoAgain] = useState(true);
  const [projectUrl, setProjectUrl] = useState(supabaseConfig.projectUrl);
  const [anonKey, setAnonKey] = useState(supabaseConfig.anonKey);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);
  const [activeTab, setActiveTab] = useState<'purge' | 'supabase' | 'backup'>('purge');

  if (!isOpen) return null;

  const handlePurge = () => {
    purgeDemoData(neverShowDemoAgain);
    onClose();
  };

  const handleRestore = () => {
    restoreDemoData();
    onClose();
  };

  const handleSaveSupabase = () => {
    saveSupabaseConfig({
      projectUrl,
      anonKey,
      isConnected: supabaseConfig.isConnected
    });
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await testSupabaseConnection();
    setIsTesting(false);
    setTestResult(res);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(supabaseDDLScript);
    setCopiedScript(true);
    showToast('Esquema SQL de Supabase copiado al portapapeles.');
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleDownloadBackup = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      system: 'Clinica Médica Dashboard',
      data: {
        patients,
        appointments,
        medicalNotes,
        prescriptions,
        pharmacyMeds,
        surgicalProcedures
      }
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clinica_backup_${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Respaldo descargado exitosamente.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Control de Datos & Base de Datos</h3>
              <p className="text-xs text-slate-500">Gestión de datos de muestra y conexión con Supabase</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-5 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('purge')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'purge'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Datos de Muestra
          </button>
          <button
            onClick={() => setActiveTab('supabase')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'supabase'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Configuración Supabase
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'backup'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Respaldos
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-sm text-slate-700">
          
          {activeTab === 'purge' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border ${isDemoDataPurged ? 'bg-emerald-50/70 border-emerald-200' : 'bg-amber-50/70 border-amber-200'}`}>
                <div className="flex items-start gap-3">
                  {isDemoDataPurged ? (
                    <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-bold text-slate-900">
                      {isDemoDataPurged 
                        ? 'Estado: Base de datos limpia (Modo Real)'
                        : 'Estado: Datos de muestra activos para demostración'}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {isDemoDataPurged
                        ? 'El sistema no tiene datos de muestra cargados. Los registros agregados serán tratados como datos nuevos. Este estado persiste entre recargas del navegador.'
                        : 'Actualmente el sistema muestra pacientes, recetas, inventarios y notas de ejemplo. Puedes purgarlos todos con un solo clic para usar la aplicación en limpio.'}
                    </p>
                  </div>
                </div>
              </div>

              {!isDemoDataPurged ? (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <input
                      type="checkbox"
                      id="neverShowAgain"
                      checked={neverShowDemoAgain}
                      onChange={(e) => setNeverShowDemoAgain(e.target.checked)}
                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                    />
                    <label htmlFor="neverShowAgain" className="text-xs text-slate-700 font-medium cursor-pointer">
                      Activar función para que el navegador NO vuelva a mostrar datos de muestra al refrescar
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <button
                      onClick={handlePurge}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold shadow-xs transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Borrar Datos de Muestra del Sistema
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <p className="text-xs text-slate-500">
                    Si deseas evaluar nuevamente el sistema con el conjunto de datos de prueba predeterminado:
                  </p>
                  <button
                    onClick={handleRestore}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold shadow-xs transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restaurar Datos de Muestra
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'supabase' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2.5">
                <Server className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-900 leading-relaxed">
                  Configura tus credenciales de Supabase para almacenar pacientes, notas NOM-004 y recetas directamente en tu base de datos PostgreSQL en la nube.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://xyzcompany.supabase.co"
                    value={projectUrl}
                    onChange={(e) => setProjectUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Supabase Anon Public Key (API Key)
                  </label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden font-mono"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={handleSaveSupabase}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg transition"
                  >
                    Guardar Credenciales
                  </button>
                  <button
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition border border-slate-300"
                  >
                    {isTesting ? 'Probando...' : 'Probar Conexión'}
                  </button>
                </div>

                {testResult && (
                  <div className={`p-2.5 rounded-lg text-xs font-medium ${testResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                    {testResult.message}
                  </div>
                )}
              </div>

              {/* DDL Schema Preview */}
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">
                    Esquema SQL DDL para Supabase (NOM-004 & COFEPRIS)
                  </span>
                  <button
                    onClick={handleCopyScript}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? 'Copiado' : 'Copiar SQL'}</span>
                  </button>
                </div>
                <div className="max-h-36 overflow-y-auto bg-slate-900 text-slate-200 p-2.5 rounded-lg text-[11px] font-mono leading-relaxed">
                  <pre>{supabaseDDLScript}</pre>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Pega este script en el SQL Editor de tu proyecto en Supabase para crear las tablas requeridas.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Genera un volcado completo de la información clínica, expedientes, camas y movimientos para resguardo normativo y contingencias.
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Descargar Respaldo JSON</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Incluye pacientes, notas médicas, recetas y quirófanos</p>
                </div>
                <button
                  onClick={handleDownloadBackup}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition"
                >
                  <Download className="w-4 h-4" />
                  Descargar
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs sm:text-sm font-semibold rounded-lg transition"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
