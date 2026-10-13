import React, { useState } from 'react';
import { useClinical } from '../../context/ClinicalContext';
import { Patient, HospitalBed } from '../../types/clinical';
import { 
  Users, 
  Bed, 
  Calendar, 
  Shield, 
  Search, 
  UserPlus, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Plus, 
  X,
  FileBadge
} from 'lucide-react';

interface AdmissionModuleProps {
  activeTab: string;
}

export const AdmissionModule: React.FC<AdmissionModuleProps> = ({ activeTab }) => {
  const { 
    patients, 
    addPatient, 
    beds, 
    updateBedStatus, 
    appointments, 
    addAppointment 
  } = useClinical();

  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [showBedAssignModal, setShowBedAssignModal] = useState<HospitalBed | null>(null);
  const [selectedPatientForBed, setSelectedPatientForBed] = useState<string>('');

  // New patient state
  const [newPatient, setNewPatient] = useState({
    fullName: '',
    curp: '',
    rfc: '',
    dateOfBirth: '1990-01-01',
    age: 36,
    gender: 'F' as 'M' | 'F' | 'Otro',
    bloodType: 'O+',
    phone: '',
    emergencyContactName: '',
    emergencyRelationship: 'Familiar',
    emergencyPhone: '',
    insuranceCompany: 'GNP Seguros',
    policyNumber: '',
    copayPercentage: 10,
    deductible: 12000,
    allergies: 'Ninguna'
  });

  const filteredPatients = patients.filter(p => 
    p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.curp.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.clinicalRecordNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.fullName || !newPatient.curp) return;

    addPatient({
      clinicalRecordNumber: `EXP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: newPatient.fullName,
      curp: newPatient.curp.toUpperCase(),
      rfc: newPatient.rfc ? newPatient.rfc.toUpperCase() : undefined,
      dateOfBirth: newPatient.dateOfBirth,
      age: Number(newPatient.age),
      gender: newPatient.gender,
      bloodType: newPatient.bloodType,
      phone: newPatient.phone,
      emergencyContact: {
        name: newPatient.emergencyContactName,
        relationship: newPatient.emergencyRelationship,
        phone: newPatient.emergencyPhone
      },
      insurance: {
        company: newPatient.insuranceCompany,
        policyNumber: newPatient.policyNumber || 'PARTICULAR',
        hasPreauthorization: true,
        copayPercentage: Number(newPatient.copayPercentage),
        deductible: Number(newPatient.deductible),
        status: 'Vigente'
      },
      admissionStatus: 'Ambulatorio',
      allergies: newPatient.allergies.split(',').map(s => s.trim())
    });

    setShowNewPatientModal(false);
  };

  const handleAssignBed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showBedAssignModal || !selectedPatientForBed) return;

    const pat = patients.find(p => p.id === selectedPatientForBed);
    if (pat) {
      updateBedStatus(showBedAssignModal.id, 'Ocupada', pat.id, pat.fullName);
    }
    setShowBedAssignModal(null);
    setSelectedPatientForBed('');
  };

  return (
    <div className="space-y-6">

      {/* 1. Padrón de Pacientes */}
      {activeTab === 'census' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-600" />
                  Padrón de Pacientes y Registro Clínico
                </h2>
                <p className="text-xs text-slate-500">
                  Expediente demográfico oficial, identificación CURP/RFC, contactos de emergencia y antecedentes de pólizas.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowNewPatientModal(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition"
                >
                  <UserPlus className="w-4 h-4" />
                  Nuevo Paciente
                </button>
              </div>
            </div>

            {/* Buscador */}
            <div className="mt-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre, CURP o número de expediente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>

            {/* Listado de Pacientes */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
                    <th className="py-2.5 px-3">Expediente</th>
                    <th className="py-2.5 px-3">Nombre Completo</th>
                    <th className="py-2.5 px-3">CURP / Edad</th>
                    <th className="py-2.5 px-3">Aseguradora</th>
                    <th className="py-2.5 px-3">Ubicación / Cama</th>
                    <th className="py-2.5 px-3">Estado</th>
                    <th className="py-2.5 px-3">Alergias</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No se encontraron pacientes registrados con ese criterio.
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map((pat) => (
                      <tr key={pat.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-teal-800">{pat.clinicalRecordNumber}</td>
                        <td className="py-2.5 px-3">
                          <span className="font-semibold text-slate-900 block">{pat.fullName}</span>
                          <span className="text-[11px] text-slate-500">{pat.phone}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-mono text-slate-700 block">{pat.curp}</span>
                          <span className="text-slate-500 text-[11px]">{pat.age} años · {pat.gender} · {pat.bloodType}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-medium text-slate-800 block">{pat.insurance.company}</span>
                          <span className="font-mono text-[11px] text-slate-500">{pat.insurance.policyNumber}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-semibold text-slate-800 block">
                            {pat.assignedBed || 'Sin cama asignada'}
                          </span>
                          <span className="text-[11px] text-slate-500">{pat.assignedService || 'Ambulatorio'}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            pat.admissionStatus === 'Hospitalizado'
                              ? 'bg-blue-100 text-blue-800'
                              : pat.admissionStatus === 'En Urgencias'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {pat.admissionStatus}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          {pat.allergies.length > 0 && pat.allergies[0] !== 'Ninguna conocida' ? (
                            <span className="text-rose-700 font-semibold text-[11px]">
                              {pat.allergies.join(', ')}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Negadas</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. Camas y Admisión Hospitalaria */}
      {activeTab === 'beds' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Bed className="w-5 h-5 text-teal-600" />
                  Asignación y Gestión de Camas Hospitalarias
                </h2>
                <p className="text-xs text-slate-500">
                  Monitoreo de camas en tiempo real por pabellón. Haga clic en una cama para asignar o liberar.
                </p>
              </div>

              {/* Leyenda de Estado */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Disponible
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Ocupada
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Desinfección
                </span>
              </div>
            </div>

            {/* Rejilla de Camas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 mt-5">
              {beds.map((bed) => {
                const isOccupied = bed.status === 'Ocupada';
                const isCleaning = bed.status === 'En desinfección';
                const isAvailable = bed.status === 'Disponible';

                return (
                  <div
                    key={bed.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                      isOccupied 
                        ? 'bg-blue-50/60 border-blue-200' 
                        : isCleaning
                        ? 'bg-amber-50/60 border-amber-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded shadow-2xs border border-slate-100">
                          {bed.bedNumber}
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          isOccupied 
                            ? 'bg-blue-600 text-white' 
                            : isCleaning 
                            ? 'bg-amber-500 text-white' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {bed.status}
                        </span>
                      </div>

                      <p className="text-[11px] font-medium text-slate-500 mt-2">
                        {bed.ward}
                      </p>

                      {isOccupied && bed.patientName ? (
                        <div className="mt-3 p-2 bg-white rounded-lg border border-blue-100 text-xs">
                          <span className="text-slate-400 text-[10px] block">Paciente Asignado:</span>
                          <span className="font-bold text-slate-900 block truncate">{bed.patientName}</span>
                          {bed.assignedAt && (
                            <span className="text-[10px] text-slate-500 block mt-0.5">Ingreso: {bed.assignedAt}</span>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 mt-3 italic">
                          {isCleaning ? 'Protocolo de sanitización terminal' : 'Lista para nuevo ingreso'}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                      {isAvailable && (
                        <button
                          onClick={() => setShowBedAssignModal(bed)}
                          className="w-full py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition"
                        >
                          Asignar Paciente
                        </button>
                      )}
                      {isOccupied && (
                        <button
                          onClick={() => updateBedStatus(bed.id, 'En desinfección')}
                          className="w-full py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                        >
                          Dar de Alta / Sanitizar
                        </button>
                      )}
                      {isCleaning && (
                        <button
                          onClick={() => updateBedStatus(bed.id, 'Disponible')}
                          className="w-full py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
                        >
                          Liberar a Disponible
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. Agenda de Citas */}
      {activeTab === 'appointments' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                Agenda Centralizada de Citas y Procedimientos
              </h2>
              <p className="text-xs text-slate-500">
                Coordinación de consultorios externos, gabinetes diagnósticos y quirófanos.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
                  <th className="py-2.5 px-3">Fecha y Hora</th>
                  <th className="py-2.5 px-3">Paciente</th>
                  <th className="py-2.5 px-3">Médico / Especialidad</th>
                  <th className="py-2.5 px-3">Área / Consultorio</th>
                  <th className="py-2.5 px-3">Motivo</th>
                  <th className="py-2.5 px-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">
                      No hay citas programadas en la agenda.
                    </td>
                  </tr>
                ) : (
                  appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                        {apt.date} · {apt.time}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{apt.patientName}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-medium text-slate-800 block">{apt.doctorName}</span>
                        <span className="text-[11px] text-slate-500">{apt.specialty}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">{apt.area}</td>
                      <td className="py-2.5 px-3 text-slate-600">{apt.reason}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-100 text-teal-800">
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Seguros y Convenios */}
      {activeTab === 'insurance' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-600" />
                Validación de Seguros de Gastos Médicos Mayores (GMM)
              </h2>
              <p className="text-xs text-slate-500">
                Control de preautorizaciones, cartas compromiso, deducibles y topes de coaseguro.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {patients.map((pat) => (
              <div key={pat.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-start justify-between">
                  <span className="font-bold text-slate-900 text-sm">{pat.fullName}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {pat.insurance.status}
                  </span>
                </div>
                <div className="text-xs space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Aseguradora:</span>
                    <span className="font-semibold text-slate-800">{pat.insurance.company}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Póliza:</span>
                    <span className="font-mono text-slate-800">{pat.insurance.policyNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Deducible:</span>
                    <span className="font-mono tabular-nums font-semibold text-slate-900">${pat.insurance.deductible.toLocaleString('es-MX')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Coaseguro:</span>
                    <span className="font-mono font-semibold text-slate-900">{pat.insurance.copayPercentage}%</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-500">Preautorización:</span>
                    <span className={`font-bold ${pat.insurance.hasPreauthorization ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {pat.insurance.hasPreauthorization ? 'Aprobada' : 'En proceso'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Nuevo Paciente */}
      {showNewPatientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-5 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900">Registrar Nuevo Paciente</h3>
              <button onClick={() => setShowNewPatientModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Roberto Sánchez Gómez"
                  value={newPatient.fullName}
                  onChange={(e) => setNewPatient({ ...newPatient, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CURP *</label>
                  <input
                    type="text"
                    required
                    maxLength={18}
                    placeholder="SAGR900101HDF..."
                    value={newPatient.curp}
                    onChange={(e) => setNewPatient({ ...newPatient, curp: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">RFC (Opcional)</label>
                  <input
                    type="text"
                    maxLength={13}
                    placeholder="SAGR900101..."
                    value={newPatient.rfc}
                    onChange={(e) => setNewPatient({ ...newPatient, rfc: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden uppercase font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Edad</label>
                  <input
                    type="number"
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({ ...newPatient, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sexo</label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  >
                    <option value="F">Femenino</option>
                    <option value="M">Masculino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Grupo Sanguíneo</label>
                  <select
                    value={newPatient.bloodType}
                    onChange={(e) => setNewPatient({ ...newPatient, bloodType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Teléfono Móvil</label>
                <input
                  type="tel"
                  placeholder="55 1234 5678"
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contacto Emergencia</label>
                  <input
                    type="text"
                    placeholder="Nombre familiar"
                    value={newPatient.emergencyContactName}
                    onChange={(e) => setNewPatient({ ...newPatient, emergencyContactName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tel. Emergencia</label>
                  <input
                    type="tel"
                    placeholder="55 9876 5432"
                    value={newPatient.emergencyPhone}
                    onChange={(e) => setNewPatient({ ...newPatient, emergencyPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Aseguradora</label>
                  <select
                    value={newPatient.insuranceCompany}
                    onChange={(e) => setNewPatient({ ...newPatient, insuranceCompany: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  >
                    <option value="GNP Seguros">GNP Seguros</option>
                    <option value="AXA Seguros Salud">AXA Seguros Salud</option>
                    <option value="MetLife México">MetLife México</option>
                    <option value="Seguros Monterrey">Seguros Monterrey NYL</option>
                    <option value="Mapfre México">Mapfre México</option>
                    <option value="Particular">Particular (Sin seguro)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Póliza / Folio</label>
                  <input
                    type="text"
                    placeholder="GNP-94018"
                    value={newPatient.policyNumber}
                    onChange={(e) => setNewPatient({ ...newPatient, policyNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alergias Conocidas</label>
                <input
                  type="text"
                  placeholder="Ej. Penicilina, Sulfas (o 'Ninguna')"
                  value={newPatient.allergies}
                  onChange={(e) => setNewPatient({ ...newPatient, allergies: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewPatientModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold"
                >
                  Guardar Paciente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Asignar Cama */}
      {showBedAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-5 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Asignar {showBedAssignModal.bedNumber}
            </h3>
            <p className="text-xs text-slate-500 mb-4">{showBedAssignModal.ward}</p>

            <form onSubmit={handleAssignBed} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Seleccionar Paciente</label>
                <select
                  required
                  value={selectedPatientForBed}
                  onChange={(e) => setSelectedPatientForBed(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                >
                  <option value="">-- Seleccionar de la lista --</option>
                  {patients.map((pat) => (
                    <option key={pat.id} value={pat.id}>
                      {pat.fullName} ({pat.clinicalRecordNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBedAssignModal(null)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold"
                >
                  Confirmar Asignación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
