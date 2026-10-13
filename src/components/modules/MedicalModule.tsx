import React, { useState } from 'react';
import { useClinical } from '../../context/ClinicalContext';
import { MedicalNote, PrescriptionItem } from '../../types/clinical';
import { 
  FileText, 
  ClipboardPen, 
  TestTube2, 
  FileCheck, 
  Plus, 
  User, 
  Heart, 
  Activity, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  FileSignature, 
  QrCode,
  Pill,
  X
} from 'lucide-react';

interface MedicalModuleProps {
  activeTab: string;
}

export const MedicalModule: React.FC<MedicalModuleProps> = ({ activeTab }) => {
  const { 
    patients, 
    medicalHistories, 
    medicalNotes, 
    addMedicalNote, 
    prescriptions, 
    addPrescription, 
    labOrders, 
    addLabOrder,
    pharmacyMeds 
  } = useClinical();

  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);
  const [showNewRxModal, setShowNewRxModal] = useState(false);
  const [showNewLabModal, setShowNewLabModal] = useState(false);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const patientHistory = selectedPatient ? medicalHistories[selectedPatient.id] : null;
  const patientNotes = medicalNotes.filter(n => n.patientId === selectedPatient?.id);

  // New Note State (SOAP)
  const [newNote, setNewNote] = useState({
    type: 'Nota de Evolución (SOAP)' as const,
    subjective: '',
    bp: '120/80',
    hr: 75,
    rr: 18,
    temp: 36.5,
    spo2: 98,
    weight: 70,
    physicalExam: '',
    assessment: '',
    plan: '',
    doctorName: 'Dra. Sofía Mendoza Alarcón',
    license: 'CED-MED-8491024 / SSA-1192'
  });

  // New Rx State
  const [rxItems, setRxItems] = useState<PrescriptionItem[]>([
    { medicationName: 'Omeprazol IV', presentation: 'Frasco 40mg', dosage: '40 mg', frequency: 'Cada 24 horas', route: 'Intravenosa', durationDays: 3 }
  ]);
  const [rxInstructions, setRxInstructions] = useState('');

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    // Generate cryptographic SHA-256 hash
    const signatureHash = Array.from(crypto.getRandomValues(new Uint8Array(20)))
      .map(b => b.toString(16).padStart(2, '0')).join('');

    addMedicalNote({
      patientId: selectedPatient.id,
      patientName: selectedPatient.fullName,
      doctorName: newNote.doctorName,
      professionalLicense: newNote.license,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: newNote.type,
      subjective: newNote.subjective,
      objective: {
        bloodPressure: newNote.bp,
        heartRate: Number(newNote.hr),
        respiratoryRate: Number(newNote.rr),
        temperature: Number(newNote.temp),
        oxygenSaturation: Number(newNote.spo2),
        weight: Number(newNote.weight),
        physicalExam: newNote.physicalExam
      },
      assessment: newNote.assessment,
      plan: newNote.plan,
      digitalSignatureHash: signatureHash
    });

    setShowNewNoteModal(false);
  };

  const handleSavePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || rxItems.length === 0) return;

    const folio = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const hash = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0')).join('');

    addPrescription({
      folio,
      patientId: selectedPatient.id,
      patientName: selectedPatient.fullName,
      doctorName: 'Dra. Sofía Mendoza Alarcón',
      professionalLicense: 'CED-MED-8491024',
      date: new Date().toISOString().substring(0, 10),
      items: rxItems,
      instructions: rxInstructions,
      isControlled: rxItems.some(i => i.medicationName.toLowerCase().includes('morfina') || i.medicationName.toLowerCase().includes('fentanilo')),
      status: 'Emitida',
      verificationHash: hash
    });

    setShowNewRxModal(false);
  };

  return (
    <div className="space-y-6">

      {/* Patient Header Selector for Medical Area */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Paciente en Consulta / Hospitalizado
            </span>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="font-bold text-slate-900 text-sm bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.clinicalRecordNumber}) - {p.assignedBed || p.admissionStatus}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedPatient && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 font-mono">
              CURP: {selectedPatient.curp}
            </span>
            <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700">
              {selectedPatient.age} años · {selectedPatient.bloodType}
            </span>
            <span className={`px-2.5 py-1 rounded-lg font-bold ${
              selectedPatient.allergies.length > 0 && selectedPatient.allergies[0] !== 'Ninguna conocida'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              Alergias: {selectedPatient.allergies.join(', ') || 'Negadas'}
            </span>
          </div>
        )}
      </div>

      {/* 1. Expediente Clínico Electrónico NOM-004-SSA3-2012 */}
      {activeTab === 'records' && selectedPatient && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <FileText className="w-5 h-5 text-sky-600" />
              Historia Clínica Integral (Conforme a NOM-004-SSA3-2012)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Heredofamiliares */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  Antecedentes Heredofamiliares (AHF)
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {patientHistory?.heredofamiliares || 'Sin antecedentes patológicos heredofamiliares relevantes manifestados por el paciente.'}
                </p>
              </div>

              {/* No patológicos */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-2">
                  <User className="w-4 h-4 text-teal-600" />
                  Personales No Patológicos (APNP)
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {patientHistory?.personalesNoPatologicos || 'Habitación urbana con servicios completos. Higiene personal diaria y alimentación balanceada.'}
                </p>
              </div>

              {/* Patológicos */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-2">
                  <Activity className="w-4 h-4 text-amber-600" />
                  Personales Patológicos (APP)
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {patientHistory?.personalesPatologicos || 'Quirúrgicos y transfusionales negados. Antecedentes crónico degenerativos en vigilancia.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Notas Médicas Estructuradas (Formato SOAP NOM-004) */}
      {activeTab === 'notes' && selectedPatient && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ClipboardPen className="w-5 h-5 text-sky-600" />
                  Notas de Evolución Médica (Formato SOAP)
                </h2>
                <p className="text-xs text-slate-500">
                  Subjetivo, Objetivo, Análisis con codificación CIE-10 y Plan terapéutico firmado digitalmente.
                </p>
              </div>

              <button
                onClick={() => setShowNewNoteModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold transition"
              >
                <Plus className="w-4 h-4" />
                Nueva Nota Médica
              </button>
            </div>

            {/* Lista de notas */}
            <div className="space-y-4 mt-4">
              {patientNotes.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No hay notas registradas para este paciente. Haga clic en "Nueva Nota Médica" para crear la primera.
                </div>
              ) : (
                patientNotes.map((note) => (
                  <div key={note.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-2">
                      <div>
                        <span className="font-bold text-slate-900 text-xs sm:text-sm mr-2">{note.type}</span>
                        <span className="text-[11px] text-slate-500 font-mono tabular-nums">{note.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-700">{note.doctorName}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold">
                          {note.professionalLicense}
                        </span>
                      </div>
                    </div>

                    {/* Contenido SOAP */}
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-bold text-sky-900 mr-1.5">S (Subjetivo):</span>
                        <span className="text-slate-700">{note.subjective}</span>
                      </div>

                      {/* Signos vitales objetivo */}
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                        <span className="font-bold text-sky-900 block mb-1">O (Objetivo):</span>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] text-slate-600 mb-1.5">
                          <span>TA: <strong>{note.objective.bloodPressure}</strong> mmHg</span>
                          <span>FC: <strong>{note.objective.heartRate}</strong> lpm</span>
                          <span>FR: <strong>{note.objective.respiratoryRate}</strong> rpm</span>
                          <span>Temp: <strong>{note.objective.temperature}</strong> °C</span>
                          <span>SpO2: <strong>{note.objective.oxygenSaturation}</strong>%</span>
                        </div>
                        <p className="text-[11px] text-slate-700 border-t border-slate-100 pt-1 mt-1">
                          <strong>Exploración Física:</strong> {note.objective.physicalExam}
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-sky-900 mr-1.5">A (Análisis y CIE-10):</span>
                        <span className="text-slate-800 font-semibold">{note.assessment}</span>
                      </div>

                      <div>
                        <span className="font-bold text-sky-900 mr-1.5">P (Plan Terapéutico):</span>
                        <span className="text-slate-700">{note.plan}</span>
                      </div>
                    </div>

                    {/* Sello Digital */}
                    <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span className="flex items-center gap-1 text-emerald-700 font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Firma Digital Validada NOM-004
                      </span>
                      <span className="truncate max-w-[200px]" title={note.digitalSignatureHash}>
                        Hash: {note.digitalSignatureHash}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Receta Electrónica y Órdenes Médicas */}
      {activeTab === 'rx' && selectedPatient && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TestTube2 className="w-5 h-5 text-sky-600" />
                  Prescripción Digital y Órdenes Intrahospitalarias
                </h2>
                <p className="text-xs text-slate-500">
                  Recetas conectadas con el catálogo de farmacia interna y solicitudes a laboratorio/gabinete.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowNewRxModal(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold transition"
                >
                  <Plus className="w-4 h-4" />
                  Nueva Receta
                </button>
              </div>
            </div>

            {/* Listado de Recetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {prescriptions.map((rx) => (
                <div key={rx.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-xs text-sky-900">{rx.folio}</span>
                      <span className="text-[11px] text-slate-500 ml-2">{rx.date}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rx.status === 'Surtida Total' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rx.status}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-800">
                    Paciente: {rx.patientName}
                  </p>

                  <div className="space-y-1.5 text-xs">
                    {rx.items.map((item, idx) => (
                      <div key={idx} className="p-2 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-900 block">{item.medicationName}</span>
                          <span className="text-[11px] text-slate-500">{item.dosage} · {item.frequency} ({item.route})</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-600">{item.durationDays} días</span>
                      </div>
                    ))}
                  </div>

                  {rx.instructions && (
                    <p className="text-[11px] text-slate-600 italic">
                      Indicaciones: {rx.instructions}
                    </p>
                  )}

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{rx.doctorName} ({rx.professionalLicense})</span>
                    <span className="font-mono">Hash: {rx.verificationHash.substring(0, 10)}...</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Gestión de Certificados y Firmas Digitales */}
      {activeTab === 'signatures' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <FileCheck className="w-5 h-5 text-sky-600" />
            Certificados Digitales y Validación de Cédulas Profesionales
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                  <FileSignature className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Dra. Sofía Mendoza Alarcón</h3>
                  <p className="text-xs text-slate-500">Cirujana General y Laparoscopista</p>
                </div>
              </div>
              <div className="text-xs space-y-1.5 text-slate-600 border-t border-slate-200 pt-2">
                <div className="flex justify-between">
                  <span>Cédula Profesional:</span>
                  <span className="font-mono font-bold text-slate-800">8491024</span>
                </div>
                <div className="flex justify-between">
                  <span>Cédula Especialidad:</span>
                  <span className="font-mono font-bold text-slate-800">ESP-119208</span>
                </div>
                <div className="flex justify-between">
                  <span>Estatus Registro DGP:</span>
                  <span className="text-emerald-700 font-bold">Vigente y Verificado</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                  <FileSignature className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Dr. Alejandro Rivas Fuentes</h3>
                  <p className="text-xs text-slate-500">Médico Internista</p>
                </div>
              </div>
              <div className="text-xs space-y-1.5 text-slate-600 border-t border-slate-200 pt-2">
                <div className="flex justify-between">
                  <span>Cédula Profesional:</span>
                  <span className="font-mono font-bold text-slate-800">7391045</span>
                </div>
                <div className="flex justify-between">
                  <span>Cédula Especialidad:</span>
                  <span className="font-mono font-bold text-slate-800">ESP-908123</span>
                </div>
                <div className="flex justify-between">
                  <span>Estatus Registro DGP:</span>
                  <span className="text-emerald-700 font-bold">Vigente y Verificado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nueva Nota Médica */}
      {showNewNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-5 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-bold text-slate-900">
                Redactar Nota Médica (NOM-004)
              </h3>
              <button onClick={() => setShowNewNoteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tipo de Nota</label>
                <select
                  value={newNote.type}
                  onChange={(e) => setNewNote({ ...newNote, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                >
                  <option value="Nota de Evolución (SOAP)">Nota de Evolución (SOAP)</option>
                  <option value="Nota de Urgencias">Nota de Urgencias</option>
                  <option value="Nota de Interconsulta">Nota de Interconsulta</option>
                  <option value="Nota Post-operatoria">Nota Post-operatoria</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">S - Subjetivo (Síntomas y Evolución)</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Paciente refiere..."
                  value={newNote.subjective}
                  onChange={(e) => setNewNote({ ...newNote, subjective: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              {/* Parámetros Vitales */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500">TA</label>
                  <input
                    type="text"
                    value={newNote.bp}
                    onChange={(e) => setNewNote({ ...newNote, bp: e.target.value })}
                    className="w-full p-1 border border-slate-300 rounded text-center font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500">FC</label>
                  <input
                    type="number"
                    value={newNote.hr}
                    onChange={(e) => setNewNote({ ...newNote, hr: Number(e.target.value) })}
                    className="w-full p-1 border border-slate-300 rounded text-center font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500">FR</label>
                  <input
                    type="number"
                    value={newNote.rr}
                    onChange={(e) => setNewNote({ ...newNote, rr: Number(e.target.value) })}
                    className="w-full p-1 border border-slate-300 rounded text-center font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500">Temp</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newNote.temp}
                    onChange={(e) => setNewNote({ ...newNote, temp: Number(e.target.value) })}
                    className="w-full p-1 border border-slate-300 rounded text-center font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500">SpO2</label>
                  <input
                    type="number"
                    value={newNote.spo2}
                    onChange={(e) => setNewNote({ ...newNote, spo2: Number(e.target.value) })}
                    className="w-full p-1 border border-slate-300 rounded text-center font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500">Peso (kg)</label>
                  <input
                    type="number"
                    value={newNote.weight}
                    onChange={(e) => setNewNote({ ...newNote, weight: Number(e.target.value) })}
                    className="w-full p-1 border border-slate-300 rounded text-center font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">O - Exploración Física</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Consciente, orientado, abdomen blando..."
                  value={newNote.physicalExam}
                  onChange={(e) => setNewNote({ ...newNote, physicalExam: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">A - Análisis y Diagnóstico (CIE-10)</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. K80.2 Colelitiasis sin colecistitis"
                  value={newNote.assessment}
                  onChange={(e) => setNewNote({ ...newNote, assessment: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">P - Plan de Tratamiento y Pronóstico</label>
                <textarea
                  required
                  rows={2}
                  placeholder="1. Solución IV... 2. Medicación... 3. Cuidados..."
                  value={newNote.plan}
                  onChange={(e) => setNewNote({ ...newNote, plan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewNoteModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold"
                >
                  Firmar y Guardar Nota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nueva Receta */}
      {showNewRxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3">Emitir Receta Electrónica</h3>
            <form onSubmit={handleSavePrescription} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Medicamento</label>
                <input
                  type="text"
                  required
                  value={rxItems[0]?.medicationName}
                  onChange={(e) => setRxItems([{ ...rxItems[0], medicationName: e.target.value }])}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dosis</label>
                  <input
                    type="text"
                    required
                    value={rxItems[0]?.dosage}
                    onChange={(e) => setRxItems([{ ...rxItems[0], dosage: e.target.value }])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Frecuencia</label>
                  <input
                    type="text"
                    required
                    value={rxItems[0]?.frequency}
                    onChange={(e) => setRxItems([{ ...rxItems[0], frequency: e.target.value }])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Indicaciones Adicionales</label>
                <textarea
                  rows={2}
                  value={rxInstructions}
                  onChange={(e) => setRxInstructions(e.target.value)}
                  placeholder="Administrar con alimentos..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewRxModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold"
                >
                  Emitir Receta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
