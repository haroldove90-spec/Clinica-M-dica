import React, { useState } from 'react';
import { useClinical } from '../../context/ClinicalContext';
import { 
  BookOpen, 
  Activity, 
  Droplets, 
  FileText, 
  Check, 
  Plus, 
  AlertCircle, 
  Clock, 
  Heart, 
  Thermometer, 
  X
} from 'lucide-react';

interface NursingModuleProps {
  activeTab: string;
}

export const NursingModule: React.FC<NursingModuleProps> = ({ activeTab }) => {
  const { 
    kardex, 
    updateKardexStatus, 
    vitals, 
    addVitalSign, 
    fluidBalances, 
    nursingNotes, 
    addNursingNote,
    patients 
  } = useClinical();

  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);

  const [newVitals, setNewVitals] = useState({
    patientId: patients[0]?.id || '',
    bp: '120/80',
    hr: 75,
    rr: 18,
    temp: 36.6,
    spo2: 98,
    glucose: 110,
    eva: 2,
    nurse: 'Enf. Patricia Soto'
  });

  const [newNote, setNewNote] = useState({
    patientId: patients[0]?.id || '',
    shift: 'Matutino' as const,
    nurseName: 'Enf. Patricia Soto',
    careDetails: '',
    curations: '',
    braden: 19,
    morse: 15
  });

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === newVitals.patientId) || patients[0];
    if (!pat) return;

    addVitalSign({
      patientId: pat.id,
      patientName: pat.fullName,
      bedNumber: pat.assignedBed || 'Cama Piso',
      recordedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      bloodPressure: newVitals.bp,
      heartRate: Number(newVitals.hr),
      respiratoryRate: Number(newVitals.rr),
      temperature: Number(newVitals.temp),
      oxygenSaturation: Number(newVitals.spo2),
      glucoseLevel: Number(newVitals.glucose),
      painScaleEva: Number(newVitals.eva),
      nurseName: newVitals.nurse
    });

    setShowVitalsModal(false);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === newNote.patientId) || patients[0];
    if (!pat) return;

    addNursingNote({
      patientId: pat.id,
      patientName: pat.fullName,
      bedNumber: pat.assignedBed || 'Cama Piso',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      shift: newNote.shift,
      nurseName: newNote.nurseName,
      careDetails: newNote.careDetails,
      curationsPerformed: newNote.curations,
      bradenScore: Number(newNote.braden),
      morseScore: Number(newNote.morse)
    });

    setShowNoteModal(false);
  };

  return (
    <div className="space-y-6">

      {/* 1. Kardex de Medicamentos */}
      {activeTab === 'kardex' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-rose-600" />
                Kardex Hospitalario: Administración Programada de Fármacos
              </h2>
              <p className="text-xs text-slate-500">
                Control de horarios (08:00, 14:00, 20:00, 02:00) y registro de aplicación por enfermería.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
                  <th className="py-2.5 px-3">Cama / Paciente</th>
                  <th className="py-2.5 px-3">Medicamento</th>
                  <th className="py-2.5 px-3">Dosis / Vía</th>
                  <th className="py-2.5 px-3">Horario</th>
                  <th className="py-2.5 px-3">Estado</th>
                  <th className="py-2.5 px-3">Enfermero(a)</th>
                  <th className="py-2.5 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {kardex.map((item) => {
                  const isDone = item.status === 'Administrado';
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3">
                        <span className="font-mono font-bold text-slate-900 block">{item.bedNumber}</span>
                        <span className="text-slate-600 text-[11px]">{item.patientName}</span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{item.medicationName}</td>
                      <td className="py-2.5 px-3 text-slate-700">{item.dose} ({item.route})</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{item.scheduledTime} hrs</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {item.administeredBy || 'Pendiente'}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {!isDone ? (
                          <button
                            onClick={() => updateKardexStatus(item.id, 'Administrado', 'Enf. Patricia Soto')}
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition"
                          >
                            Registrar Aplicación
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-bold text-xs inline-flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Aplicado
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Signos Vitales y Escala EVA */}
      {activeTab === 'vitals' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-rose-600" />
                Monitorización de Signos Vitales y Escala de Dolor (EVA)
              </h2>
              <p className="text-xs text-slate-500">
                Presión arterial, oximetría, glucemia capilar y cuantificación analgésica.
              </p>
            </div>

            <button
              onClick={() => setShowVitalsModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition"
            >
              <Plus className="w-4 h-4" />
              Tomar Signos Vitales
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vitals.map((v) => (
              <div key={v.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">{v.patientName}</span>
                    <span className="text-[11px] font-mono text-slate-500">{v.bedNumber} · {v.recordedAt}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    v.painScaleEva > 5 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    Dolor EVA: {v.painScaleEva}/10
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs bg-white p-2.5 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Tensión</span>
                    <span className="font-bold text-slate-800">{v.bloodPressure}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Pulso (FC)</span>
                    <span className="font-bold text-slate-800">{v.heartRate} lpm</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">SpO2</span>
                    <span className="font-bold text-slate-800">{v.oxygenSaturation}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Temp</span>
                    <span className="font-bold text-slate-800">{v.temperature}°C</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Resp (FR)</span>
                    <span className="font-bold text-slate-800">{v.respiratoryRate} rpm</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Glucemia</span>
                    <span className="font-bold text-slate-800">{v.glucoseLevel || 'N/E'} mg/dL</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 text-right">
                  Registrado por: {v.nurseName}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Balance de Líquidos */}
      {activeTab === 'fluids' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-rose-600" />
                Balance Hidroelectrolítico (Ingresos vs Egresos en 24h)
              </h2>
              <p className="text-xs text-slate-500">
                Monitoreo estricto de soluciones parenterales, diuresis y gasto por drenajes quirúrgicos.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fluidBalances.map((fb) => {
              const totalIntake = fb.intakeIVSolutions + fb.intakeOral + fb.intakeMedications;
              const totalOutput = fb.outputUrine + fb.outputDrains + fb.outputVomit;
              const pat = patients.find(p => p.id === fb.patientId);

              return (
                <div key={fb.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{pat?.fullName || 'Paciente'}</h4>
                      <span className="text-[11px] text-slate-500">Fecha: {fb.date}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                      fb.netBalance >= 0 ? 'bg-blue-100 text-blue-900' : 'bg-amber-100 text-amber-900'
                    }`}>
                      Balance Neto: {fb.netBalance > 0 ? `+${fb.netBalance}` : fb.netBalance} ml
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-100 space-y-1">
                      <span className="font-bold text-emerald-900 block border-b border-emerald-200 pb-1">
                        Ingresos: {totalIntake} ml
                      </span>
                      <div className="text-[11px] text-emerald-800 space-y-0.5">
                        <div className="flex justify-between"><span>Soluciones IV:</span><span>{fb.intakeIVSolutions} ml</span></div>
                        <div className="flex justify-between"><span>Vía Oral:</span><span>{fb.intakeOral} ml</span></div>
                        <div className="flex justify-between"><span>Medicación:</span><span>{fb.intakeMedications} ml</span></div>
                      </div>
                    </div>

                    <div className="p-2.5 bg-rose-50/60 rounded-lg border border-rose-100 space-y-1">
                      <span className="font-bold text-rose-900 block border-b border-rose-200 pb-1">
                        Egresos: {totalOutput} ml
                      </span>
                      <div className="text-[11px] text-rose-800 space-y-0.5">
                        <div className="flex justify-between"><span>Uresis:</span><span>{fb.outputUrine} ml</span></div>
                        <div className="flex justify-between"><span>Drenajes:</span><span>{fb.outputDrains} ml</span></div>
                        <div className="flex justify-between"><span>Vómitos:</span><span>{fb.outputVomit} ml</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 text-right">
                    Calculado por: {fb.calculatedBy}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Notas de Enfermería */}
      {activeTab === 'notes' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-600" />
                Notas de Evolución y Cuidados de Enfermería
              </h2>
              <p className="text-xs text-slate-500">
                Registro de curaciones, escalas de riesgo Braden (úlceras) y Morse (caídas).
              </p>
            </div>

            <button
              onClick={() => setShowNoteModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition"
            >
              <Plus className="w-4 h-4" />
              Nueva Nota de Enfermería
            </button>
          </div>

          <div className="space-y-4">
            {nursingNotes.map((note) => (
              <div key={note.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <div>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm mr-2">{note.patientName}</span>
                    <span className="text-[11px] font-mono text-slate-500">Turno {note.shift} · {note.date}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800">
                      Braden: {note.bradenScore} (Bajo)
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800">
                      Morse: {note.morseScore} (Bajo)
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {note.careDetails}
                </p>

                {note.curationsPerformed && (
                  <p className="text-[11px] text-slate-600 italic">
                    <strong>Curaciones:</strong> {note.curationsPerformed}
                  </p>
                )}

                <div className="text-[10px] text-slate-500 text-right pt-1">
                  Enfermero(a): {note.nurseName}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Tomar Signos Vitales */}
      {showVitalsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3">Registrar Signos Vitales</h3>
            <form onSubmit={handleSaveVitals} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Paciente</label>
                <select
                  value={newVitals.patientId}
                  onChange={(e) => setNewVitals({ ...newVitals, patientId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.fullName} ({p.assignedBed || 'Piso'})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tensión Arterial</label>
                  <input
                    type="text"
                    required
                    value={newVitals.bp}
                    onChange={(e) => setNewVitals({ ...newVitals, bp: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Frecuencia Cardíaca (lpm)</label>
                  <input
                    type="number"
                    required
                    value={newVitals.hr}
                    onChange={(e) => setNewVitals({ ...newVitals, hr: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Temperatura (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newVitals.temp}
                    onChange={(e) => setNewVitals({ ...newVitals, temp: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Saturación SpO2 (%)</label>
                  <input
                    type="number"
                    required
                    value={newVitals.spo2}
                    onChange={(e) => setNewVitals({ ...newVitals, spo2: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Glucemia Capilar (mg/dL)</label>
                  <input
                    type="number"
                    value={newVitals.glucose}
                    onChange={(e) => setNewVitals({ ...newVitals, glucose: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Escala Dolor EVA (0-10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={newVitals.eva}
                    onChange={(e) => setNewVitals({ ...newVitals, eva: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowVitalsModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold"
                >
                  Guardar Signos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nueva Nota Enfermería */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3">Redactar Nota de Enfermería</h3>
            <form onSubmit={handleSaveNote} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Paciente</label>
                <select
                  value={newNote.patientId}
                  onChange={(e) => setNewNote({ ...newNote, patientId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.fullName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cuidados y Evolución</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Se recibe paciente tranquilo..."
                  value={newNote.careDetails}
                  onChange={(e) => setNewNote({ ...newNote, careDetails: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Curaciones Realizadas</label>
                <input
                  type="text"
                  placeholder="Cambio de vendaje..."
                  value={newNote.curations}
                  onChange={(e) => setNewNote({ ...newNote, curations: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold"
                >
                  Guardar Nota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
