import React, { useState } from 'react';
import { useClinical } from '../../context/ClinicalContext';
import { 
  CalendarDays, 
  CheckSquare, 
  Sparkles, 
  Layers, 
  Check, 
  AlertCircle, 
  Clock, 
  User, 
  Flame, 
  ShieldCheck,
  Plus,
  Thermometer,
  Gauge
} from 'lucide-react';

interface SurgicalModuleProps {
  activeTab: string;
}

export const SurgicalModule: React.FC<SurgicalModuleProps> = ({ activeTab }) => {
  const { 
    surgicalProcedures, 
    updateSurgicalChecklist, 
    sterilizationCycles, 
    addSterilizationCycle,
    surgicalImplants 
  } = useClinical();

  const [selectedProcedureId, setSelectedProcedureId] = useState<string>(surgicalProcedures[0]?.id || '');
  const selectedProcedure = surgicalProcedures.find(p => p.id === selectedProcedureId) || surgicalProcedures[0];

  const handleToggleChecklist = (phase: 'signIn' | 'timeOut' | 'signOut', field: string, currentValue: boolean) => {
    if (!selectedProcedure) return;
    updateSurgicalChecklist(selectedProcedure.id, phase, field, !currentValue, 'Equipo Quirúrgico');
  };

  return (
    <div className="space-y-6">

      {/* 1. Programación de Quirófanos */}
      {activeTab === 'scheduling' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-indigo-600" />
                Programación de Salas de Operaciones
              </h2>
              <p className="text-xs text-slate-500">
                Asignación de salas (Q1, Q2, Q3), tiempos estimados y equipo quirúrgico multidisciplinario.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {surgicalProcedures.map((proc) => {
              const isOperating = proc.status === 'En quirófano';
              const isCompleted = proc.status === 'Finalizada';

              return (
                <div 
                  key={proc.id} 
                  className={`p-4 rounded-xl border space-y-3 transition-all ${
                    isOperating 
                      ? 'bg-indigo-50/50 border-indigo-200 ring-1 ring-indigo-500/20' 
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-950 bg-white px-2 py-0.5 rounded shadow-2xs border border-indigo-100">
                      {proc.operatingRoom}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      isOperating 
                        ? 'bg-indigo-600 text-white animate-pulse' 
                        : isCompleted 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {proc.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      {proc.procedureName}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Paciente: <strong>{proc.patientName}</strong>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Fecha y Hora</span>
                      <span className="font-semibold text-slate-800">{proc.scheduledDate} {proc.scheduledTime}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Duración Estimada</span>
                      <span className="font-semibold text-slate-800">{proc.durationEstimatedMinutes} minutos</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Cirujano Titular</span>
                      <span className="font-medium text-slate-800 truncate block">{proc.leadSurgeon}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Anestesiólogo</span>
                      <span className="font-medium text-slate-800 truncate block">{proc.anesthesiologist}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Enfermera Circulante</span>
                      <span className="font-medium text-slate-800 truncate block">{proc.circulatingNurse}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Enfermero Instrumentista</span>
                      <span className="font-medium text-slate-800 truncate block">{proc.scrubNurse}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Hoja de Cirugía Segura OMS (3 Fases) */}
      {activeTab === 'who_checklist' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-indigo-600" />
                  Lista de Verificación de la Seguridad de la Cirugía (OMS)
                </h2>
                <p className="text-xs text-slate-500">
                  Protocolo digital de 3 fases obligatorio para prevenir eventos centinela y complicaciones postquirúrgicas.
                </p>
              </div>

              {/* Selector de Procedimiento */}
              {surgicalProcedures.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Cirugía:</span>
                  <select
                    value={selectedProcedureId}
                    onChange={(e) => setSelectedProcedureId(e.target.value)}
                    className="text-xs font-bold text-slate-800 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500"
                  >
                    {surgicalProcedures.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.procedureName} - {p.patientName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {selectedProcedure ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
                
                {/* Fase 1: Entrada (Sign-in) */}
                <div className="p-4 bg-sky-50/50 rounded-xl border border-sky-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-sky-200 pb-2">
                    <div>
                      <h3 className="font-bold text-sky-950 text-xs sm:text-sm">
                        1. ENTRADA (Sign-In)
                      </h3>
                      <p className="text-[10px] text-sky-700">Antes de la inducción anestésica</p>
                    </div>
                    <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {[
                      { key: 'patientIdentityConfirmed', label: 'Identidad, sitio y procedimiento confirmados por paciente' },
                      { key: 'siteMarked', label: 'Sitio quirúrgico marcado / No aplicable' },
                      { key: 'anesthesiaSafetyCheckCompleted', label: 'Comprobación de seguridad anestésica completa' },
                      { key: 'pulseOximeterFunctioning', label: 'Pulsioxímetro colocado y en funcionamiento' },
                      { key: 'knownAllergiesReviewed', label: 'Alergias conocidas revisadas y verificadas' },
                      { key: 'difficultAirwayEvaluated', label: 'Vía aérea difícil / riesgo de aspiración evaluado' },
                      { key: 'bloodLossRiskReviewed', label: 'Riesgo de hemorragia >500ml y accesos IV previstos' }
                    ].map((item) => {
                      const isChecked = (selectedProcedure.safetyChecklist.signIn as any)[item.key];
                      return (
                        <label 
                          key={item.key} 
                          onClick={() => handleToggleChecklist('signIn', item.key, isChecked)}
                          className="flex items-start gap-2 p-1.5 hover:bg-sky-100/60 rounded cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-sky-600 mt-0.5 pointer-events-none"
                          />
                          <span className={`text-[11px] leading-tight ${isChecked ? 'text-slate-900 font-semibold' : 'text-slate-600'}`}>
                            {item.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  <div className="pt-2 border-t border-sky-200 text-[10px] text-sky-800">
                    Responsable: {selectedProcedure.safetyChecklist.signIn.completedBy}
                  </div>
                </div>

                {/* Fase 2: Pausa Quirúrgica (Time-out) */}
                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-indigo-200 pb-2">
                    <div>
                      <h3 className="font-bold text-indigo-950 text-xs sm:text-sm">
                        2. PAUSA QUIRÚRGICA (Time-Out)
                      </h3>
                      <p className="text-[10px] text-indigo-700">Antes de la incisión de la piel</p>
                    </div>
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {[
                      { key: 'teamIntroductionsConfirmed', label: 'Presentación verbal de todos los miembros del equipo' },
                      { key: 'patientNameAndProcedureVerballyConfirmed', label: 'Confirmación verbal del paciente, incisión y posición' },
                      { key: 'criticalEventsAnticipated', label: 'Cirujano y anestesiólogo anticipan pasos críticos y pérdidas' },
                      { key: 'antibioticProphylaxisGivenLast60Min', label: 'Profilaxis antibiótica administrada en los últimos 60 min' },
                      { key: 'essentialImagingDisplayed', label: 'Estudios de imagen esenciales proyectados en pantalla' }
                    ].map((item) => {
                      const isChecked = (selectedProcedure.safetyChecklist.timeOut as any)[item.key];
                      return (
                        <label 
                          key={item.key} 
                          onClick={() => handleToggleChecklist('timeOut', item.key, isChecked)}
                          className="flex items-start gap-2 p-1.5 hover:bg-indigo-100/60 rounded cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-indigo-600 mt-0.5 pointer-events-none"
                          />
                          <span className={`text-[11px] leading-tight ${isChecked ? 'text-slate-900 font-semibold' : 'text-slate-600'}`}>
                            {item.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  <div className="pt-2 border-t border-indigo-200 text-[10px] text-indigo-800">
                    Responsable: {selectedProcedure.safetyChecklist.timeOut.completedBy || 'Cirujano en sala'}
                  </div>
                </div>

                {/* Fase 3: Salida (Sign-out) */}
                <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-teal-200 pb-2">
                    <div>
                      <h3 className="font-bold text-teal-950 text-xs sm:text-sm">
                        3. SALIDA (Sign-Out)
                      </h3>
                      <p className="text-[10px] text-teal-700">Antes de que el paciente salga del quirófano</p>
                    </div>
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">3</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {[
                      { key: 'nurseConfirmsProcedureRecorded', label: 'El enfermero confirma verbalmente el procedimiento registrado' },
                      { key: 'instrumentSpongeNeedleCountCorrect', label: 'Recuento de gasas, compresas e instrumental completo' },
                      { key: 'specimenLabeledCorrectly', label: 'Muestras biológicas etiquetadas con nombre y expediente' },
                      { key: 'equipmentIssuesAddressed', label: 'Problemas de instrumental o equipos identificados' },
                      { key: 'postOpRecoveryConcernsReviewed', label: 'Revisión de aspectos clave de recuperación y dolor' }
                    ].map((item) => {
                      const isChecked = (selectedProcedure.safetyChecklist.signOut as any)[item.key];
                      return (
                        <label 
                          key={item.key} 
                          onClick={() => handleToggleChecklist('signOut', item.key, isChecked)}
                          className="flex items-start gap-2 p-1.5 hover:bg-teal-100/60 rounded cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-teal-600 mt-0.5 pointer-events-none"
                          />
                          <span className={`text-[11px] leading-tight ${isChecked ? 'text-slate-900 font-semibold' : 'text-slate-600'}`}>
                            {item.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  <div className="pt-2 border-t border-teal-200 text-[10px] text-teal-800">
                    Responsable: {selectedProcedure.safetyChecklist.signOut.completedBy}
                  </div>
                </div>

              </div>
            ) : (
              <p className="text-center py-6 text-slate-400 text-xs">No hay procedimientos programados.</p>
            )}
          </div>
        </div>
      )}

      {/* 3. Insumos e Implantes */}
      {activeTab === 'implants' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                Trazabilidad de Implantes y Material de Osteosíntesis
              </h2>
              <p className="text-xs text-slate-500">
                Registro de números de serie, lotes, fabricantes y vigencia de esterilidad garantizada.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
                  <th className="py-2.5 px-3">Dispositivo / Implante</th>
                  <th className="py-2.5 px-3">Tipo</th>
                  <th className="py-2.5 px-3">Fabricante</th>
                  <th className="py-2.5 px-3">Lote y Serie</th>
                  <th className="py-2.5 px-3">Caducidad Esterilidad</th>
                  <th className="py-2.5 px-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {surgicalImplants.map((imp) => (
                  <tr key={imp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{imp.name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{imp.type}</td>
                    <td className="py-2.5 px-3 text-slate-800">{imp.manufacturer}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">
                      <div>Lote: {imp.lotNumber}</div>
                      <div className="text-[10px] text-slate-400">{imp.serialNumber}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums text-slate-800">{imp.expirationDate}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        {imp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. CEYE (Central de Esterilización y Equipos) */}
      {activeTab === 'ceye' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                CEYE: Bitácora de Autoclaves y Ciclos de Esterilización
              </h2>
              <p className="text-xs text-slate-500">
                Controles biológicos (Geobacillus stearothermophilus), indicadores químicos clase 5, presión y temperatura.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sterilizationCycles.map((cycle) => (
              <div key={cycle.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{cycle.autoclaveUnit}</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                    Ciclo #{cycle.cycleNumber} · {cycle.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                    <span>Temp: <strong>{cycle.temperatureCelsius}°C</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-blue-500" />
                    <span>Presión: <strong>{cycle.pressurePSI} PSI</strong></span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-100 flex justify-between">
                    <span>Horario: {cycle.startTime} - {cycle.endTime}</span>
                    <span className="text-emerald-700 font-bold">{cycle.biologicalIndicatorResult}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                    Cajas e Instrumental Procesado:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {cycle.packagesProcessed.map((pkg, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] rounded font-medium">
                        {pkg}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-200">
                  Operador responsable: {cycle.operatorName}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
