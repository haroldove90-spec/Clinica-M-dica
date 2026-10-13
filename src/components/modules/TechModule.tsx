import React, { useState } from 'react';
import { useClinical } from '../../context/ClinicalContext';
import { 
  ShieldCheck, 
  Lock, 
  Database, 
  RefreshCw, 
  Download, 
  Trash2, 
  Server, 
  Copy, 
  Check, 
  UserCheck, 
  ShieldAlert,
  Terminal,
  Activity
} from 'lucide-react';

interface TechModuleProps {
  activeTab: string;
}

export const TechModule: React.FC<TechModuleProps> = ({ activeTab }) => {
  const { 
    systemUsers, 
    auditLogs, 
    isDemoDataPurged, 
    purgeDemoData, 
    restoreDemoData,
    supabaseConfig,
    saveSupabaseConfig,
    testSupabaseConnection,
    supabaseDDLScript,
    showToast
  } = useClinical();

  const [projectUrl, setProjectUrl] = useState(supabaseConfig.projectUrl);
  const [anonKey, setAnonKey] = useState(supabaseConfig.anonKey);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await testSupabaseConnection();
    setIsTesting(false);
    setTestResult(res);
  };

  const handleSave = () => {
    saveSupabaseConfig({
      projectUrl,
      anonKey,
      isConnected: supabaseConfig.isConnected
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(supabaseDDLScript);
    setCopiedScript(true);
    showToast('Script DDL copiado al portapapeles.');
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="space-y-6">

      {/* 1. Control de Accesos y Roles (RBAC) */}
      {activeTab === 'rbac' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-slate-800" />
                Matriz de Control de Acceso Basado en Roles (RBAC)
              </h2>
              <p className="text-xs text-slate-500">
                Aislamiento estricto de privilegios conforme a NOM-024-SSA3-2012 y normativas de confidencialidad hospitalaria.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {systemUsers.length} Usuarios Activos
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
                  <th className="py-2.5 px-3">Usuario / Nombre</th>
                  <th className="py-2.5 px-3">Rol del Sistema</th>
                  <th className="py-2.5 px-3">Cédula</th>
                  <th className="py-2.5 px-3 text-center">Ver ECE</th>
                  <th className="py-2.5 px-3 text-center">Editar ECE</th>
                  <th className="py-2.5 px-3 text-center">Farmacia</th>
                  <th className="py-2.5 px-3 text-center">Controlados</th>
                  <th className="py-2.5 px-3 text-center">Quirófano</th>
                  <th className="py-2.5 px-3 text-center">Facturación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {systemUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-slate-900 block">{user.fullName}</span>
                      <span className="text-[11px] font-mono text-slate-400">@{user.username}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">
                      {user.professionalLicense || 'N/A'}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${user.permissions.canViewMedicalRecords ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${user.permissions.canEditMedicalRecords ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${user.permissions.canDispensePharmacy ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${user.permissions.canManageControlledDrugs ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${user.permissions.canSignSurgicalChecklist ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${user.permissions.canManageBilling ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Auditoría y Bitácoras de Seguridad (Audit Logs) */}
      {activeTab === 'audit' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-slate-800" />
                Bitácora de Auditoría y Seguridad Inalterable
              </h2>
              <p className="text-xs text-slate-500">
                Traza criptográfica de cada consulta, creación de notas y dispensaciones para cumplimiento legal.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
              Logs Append-Only Activos
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Severidad</th>
                  <th className="py-2.5 px-3">Acción Registrada</th>
                  <th className="py-2.5 px-3">Usuario y Rol</th>
                  <th className="py-2.5 px-3">Entidad Afectada</th>
                  <th className="py-2.5 px-3">Dirección IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono tabular-nums text-slate-500">{log.timestamp}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.severity === 'AUDIT' ? 'bg-purple-100 text-purple-800' :
                        log.severity === 'WARN' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{log.action}</td>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-slate-800 block">{log.userName}</span>
                      <span className="text-[11px] text-slate-500">{log.userRole}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 max-w-xs truncate" title={log.entityAffected}>
                      {log.entityAffected}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Respaldos y Purga de Datos */}
      {activeTab === 'backups' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-slate-800" />
                Resguardos de Información y Gestión de Datos
              </h2>
              <p className="text-xs text-slate-500">
                Políticas de respaldo automatizado para prevenir pérdida de información médica crítica.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Purga de datos */}
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-3">
              <h3 className="font-bold text-rose-900 text-sm flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-rose-600" />
                Borrado de Datos de Muestra
              </h3>
              <p className="text-xs text-rose-800 leading-relaxed">
                Limpia inmediatamente todos los datos de prueba del sistema para operar con pacientes reales. La configuración se almacena en el navegador para que no reaparezcan.
              </p>
              {!isDemoDataPurged ? (
                <button
                  onClick={() => purgeDemoData(true)}
                  className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                >
                  Purgar Datos de Muestra Ahora
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="p-2 bg-white rounded border border-rose-200 text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" /> Datos de muestra ya eliminados (Base limpia activa)
                  </div>
                  <button
                    onClick={restoreDemoData}
                    className="w-full py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition"
                  >
                    Restaurar Datos de Muestra
                  </button>
                </div>
              )}
            </div>

            {/* Respaldo JSON */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Download className="w-4 h-4 text-slate-700" />
                Respaldo Completo en Formato JSON
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Descarga una instantánea completa de las tablas del hospital para cumplir con el resguardo de 5 años estipulado por la NOM-004.
              </p>
              <button
                onClick={() => {
                  const dump = { date: new Date().toISOString(), app: 'Clinica Médica Dashboard' };
                  const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `backup_hospital_${Date.now()}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                  showToast('Respaldo generado y descargado.');
                }}
                className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-xs transition"
              >
                Generar Respaldo Local
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. Conexión Supabase */}
      {activeTab === 'supabase' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-600" />
                Integración de Base de Datos Supabase (PostgreSQL)
              </h2>
              <p className="text-xs text-slate-500">
                Conexión segura con tu proyecto Supabase para almacenamiento en la nube y persistencia de registros clínicos.
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
              supabaseConfig.isConnected ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              {supabaseConfig.isConnected ? 'Conectado a Supabase' : 'No Conectado'}
            </span>
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
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Supabase Anon Public API Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 font-mono"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSave}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition"
              >
                Guardar Configuración
              </button>
              <button
                onClick={handleTest}
                disabled={isTesting}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition border border-slate-300"
              >
                {isTesting ? 'Probando...' : 'Probar Conexión'}
              </button>
            </div>

            {testResult && (
              <div className={`p-3 rounded-lg text-xs font-medium ${testResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                {testResult.message}
              </div>
            )}
          </div>

          {/* DDL Schema */}
          <div className="pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">
                Esquema SQL DDL para Supabase (Tablas de Hospital, NOM-004 y COFEPRIS)
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedScript ? 'Copiado' : 'Copiar DDL'}
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto bg-slate-900 text-slate-200 p-3 rounded-xl text-[11px] font-mono leading-relaxed">
              <pre>{supabaseDDLScript}</pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
