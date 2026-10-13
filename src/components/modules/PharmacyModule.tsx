import React, { useState } from 'react';
import { useClinical } from '../../context/ClinicalContext';
import { 
  Scroll, 
  Lock, 
  Clock, 
  AlertTriangle, 
  Check, 
  Plus, 
  Search, 
  ShieldAlert, 
  CheckCircle2, 
  FileText,
  X,
  Package
} from 'lucide-react';

interface PharmacyModuleProps {
  activeTab: string;
}

export const PharmacyModule: React.FC<PharmacyModuleProps> = ({ activeTab }) => {
  const { 
    pharmacyMeds, 
    prescriptions, 
    dispensePrescription, 
    controlledMovements, 
    addControlledMovement 
  } = useClinical();

  const [searchTerm, setSearchTerm] = useState('');
  const [showNewControlledModal, setShowNewControlledModal] = useState(false);
  const [newMovementData, setNewMovementData] = useState({
    medicationName: 'Morfina Sulfato',
    group: 'Grupo I' as const,
    movementType: 'Salida' as 'Entrada' | 'Salida',
    quantity: 1,
    batchNumber: 'LOTE-MOR-2026-09',
    prescribingDoctor: 'Dra. Sofía Mendoza Alarcón',
    medicalLicense: 'CED-MED-8491024',
    specialPrescriptionFolio: `COFEPRIS-ESP-${Math.floor(100000 + Math.random() * 900000)}`,
    responsiblePharmacist: 'Q.F.B. Mariana Echeverría',
    patientName: 'María Elena Morales Ruiz'
  });

  const filteredMeds = pharmacyMeds.filter(m => 
    m.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.commercialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getExpirationBadge = (expirationDate: string) => {
    const today = new Date();
    const exp = new Date(expirationDate);
    const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 30) {
      return {
        label: `Crítico (${diffDays}d)`,
        color: 'bg-rose-100 text-rose-800 border-rose-200'
      };
    } else if (diffDays <= 90) {
      return {
        label: `Próximo (${diffDays}d)`,
        color: 'bg-amber-100 text-amber-800 border-amber-200'
      };
    }
    return {
      label: 'Vigente (>90d)',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
  };

  const handleSaveMovement = (e: React.FormEvent) => {
    e.preventDefault();
    addControlledMovement({
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      medicationName: newMovementData.medicationName,
      group: newMovementData.group,
      movementType: newMovementData.movementType,
      quantity: Number(newMovementData.quantity),
      batchNumber: newMovementData.batchNumber,
      prescribingDoctor: newMovementData.prescribingDoctor,
      medicalLicense: newMovementData.medicalLicense,
      specialPrescriptionFolio: newMovementData.specialPrescriptionFolio,
      responsiblePharmacist: newMovementData.responsiblePharmacist,
      patientName: newMovementData.patientName
    });
    setShowNewControlledModal(false);
  };

  return (
    <div className="space-y-6">

      {/* 1. Surtido por Receta Médica Intrahospitalaria */}
      {activeTab === 'dispensing' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Scroll className="w-5 h-5 text-emerald-600" />
                Surtido por Receta Médica Intrahospitalaria (Unidosis)
              </h2>
              <p className="text-xs text-slate-500">
                Desglose y dispensación controlada para pacientes en piso hospitalario y quirófano.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {prescriptions.map((rx) => {
              const isDispensed = rx.status === 'Surtida Total';
              return (
                <div key={rx.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">{rx.folio}</span>
                      <span className="text-[11px] text-slate-500">{rx.date}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isDispensed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rx.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">
                      Paciente: {rx.patientName}
                    </h4>

                    <div className="flex flex-wrap gap-2 text-xs">
                      {rx.items.map((item, idx) => (
                        <span key={idx} className="px-2 py-1 bg-white border border-slate-200 rounded-md font-medium text-slate-700">
                          {item.medicationName} ({item.dosage})
                        </span>
                      ))}
                    </div>

                    <p className="text-[11px] text-slate-500">
                      Médico: {rx.doctorName} ({rx.professionalLicense})
                    </p>
                  </div>

                  <div>
                    {!isDispensed ? (
                      <button
                        onClick={() => dispensePrescription(rx.id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
                      >
                        <Check className="w-4 h-4" />
                        Dispensar Unidosis
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold px-3 py-1 bg-emerald-50 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4" />
                        Surtido Completo
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Control Estricto de Medicamentos Controlados (Grupos I, II y III) */}
      {activeTab === 'controlled' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-600" />
                Libro Oficial de Estupefacientes y Psicotrópicos (COFEPRIS)
              </h2>
              <p className="text-xs text-slate-500">
                Control inalterable de entradas, salidas y recetas especiales con código de barras.
              </p>
            </div>

            <button
              onClick={() => setShowNewControlledModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition"
            >
              <Plus className="w-4 h-4" />
              Nuevo Registro en Libro
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
                  <th className="py-2.5 px-3">Fecha</th>
                  <th className="py-2.5 px-3">Medicamento</th>
                  <th className="py-2.5 px-3">Grupo</th>
                  <th className="py-2.5 px-3">Movimiento</th>
                  <th className="py-2.5 px-3">Cant.</th>
                  <th className="py-2.5 px-3">Saldo</th>
                  <th className="py-2.5 px-3">Folio Receta COFEPRIS</th>
                  <th className="py-2.5 px-3">Médico / Cédula</th>
                  <th className="py-2.5 px-3">Farmacéutico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {controlledMovements.map((mov) => (
                  <tr key={mov.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-600 tabular-nums">{mov.date}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{mov.medicationName}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-600">{mov.group}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        mov.movementType === 'Entrada' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {mov.movementType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900 tabular-nums">{mov.quantity}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900 tabular-nums">{mov.resultingBalance}</td>
                    <td className="py-2.5 px-3 font-mono text-blue-700 font-bold">{mov.specialPrescriptionFolio}</td>
                    <td className="py-2.5 px-3 text-slate-700">{mov.prescribingDoctor} ({mov.medicalLicense})</td>
                    <td className="py-2.5 px-3 text-slate-600">{mov.responsiblePharmacist}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Control de Lotes y Caducidades (Sistema FIFO) */}
      {activeTab === 'fifo' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                Semáforo FIFO de Lotes y Caducidades (Normativa COFEPRIS)
              </h2>
              <p className="text-xs text-slate-500">
                Rotación de inventario 'Primero en Caducar, Primero en Salir' para evitar mermas sanitarias.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
                  <th className="py-2.5 px-3">Medicamento / Presentación</th>
                  <th className="py-2.5 px-3">Lote</th>
                  <th className="py-2.5 px-3">Caducidad</th>
                  <th className="py-2.5 px-3">Semáforo</th>
                  <th className="py-2.5 px-3">Stock Actual</th>
                  <th className="py-2.5 px-3">Ubicación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pharmacyMeds.map((med) => {
                  const badge = getExpirationBadge(med.expirationDate);
                  return (
                    <tr key={med.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-900 block">{med.genericName}</span>
                        <span className="text-[11px] text-slate-500">{med.commercialName} · {med.dosageForm}</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-700">{med.batchNumber}</td>
                      <td className="py-2.5 px-3 font-mono tabular-nums font-semibold text-slate-900">{med.expirationDate}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900 tabular-nums">
                        {med.currentStock} unid.
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{med.location}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Stock & Carro Rojo */}
      {activeTab === 'crash_cart' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                Cargos Fijos y Dotación de Carro Rojo de Paro Cardiorrespiratorio
              </h2>
              <p className="text-xs text-slate-500">
                Inventario estandarizado y precintado en Urgencias y Quirófano para reanimación cardiopulmonar.
              </p>
            </div>
            <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-bold">
              Precinto #CR-2026-94 Intacto
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pharmacyMeds.filter(m => m.isCrashCartStock).map((med) => (
              <div key={med.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{med.genericName}</h4>
                  <p className="text-xs text-slate-500">{med.dosageForm} · {med.location}</p>
                  <p className="text-[11px] font-mono text-slate-600 mt-1">Lote: {med.batchNumber} (Vence: {med.expirationDate})</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xl font-extrabold text-rose-700 block tabular-nums">
                    {med.currentStock}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Stock en Carro</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Movimiento Controlado */}
      {showNewControlledModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-3">Registrar en Libro Oficial de Controlados</h3>
            <form onSubmit={handleSaveMovement} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Medicamento Controlado</label>
                <select
                  value={newMovementData.medicationName}
                  onChange={(e) => setNewMovementData({ ...newMovementData, medicationName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="Morfina Sulfato">Morfina Sulfato 10mg/1ml (Grupo I)</option>
                  <option value="Fentanilo Citrato">Fentanilo Citrato 0.5mg/10ml (Grupo I)</option>
                  <option value="Diazepam">Diazepam 10mg/2ml (Grupo II)</option>
                  <option value="Midazolam">Midazolam 15mg/3ml (Grupo II)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipo de Movimiento</label>
                  <select
                    value={newMovementData.movementType}
                    onChange={(e) => setNewMovementData({ ...newMovementData, movementType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="Salida">Salida (Dispensación)</option>
                    <option value="Entrada">Entrada (Abastecimiento)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cantidad (Ampolletas)</label>
                  <input
                    type="number"
                    min="1"
                    value={newMovementData.quantity}
                    onChange={(e) => setNewMovementData({ ...newMovementData, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Folio Receta Especial COFEPRIS</label>
                <input
                  type="text"
                  required
                  value={newMovementData.specialPrescriptionFolio}
                  onChange={(e) => setNewMovementData({ ...newMovementData, specialPrescriptionFolio: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Médico Prescriptor</label>
                  <input
                    type="text"
                    required
                    value={newMovementData.prescribingDoctor}
                    onChange={(e) => setNewMovementData({ ...newMovementData, prescribingDoctor: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cédula Profesional</label>
                  <input
                    type="text"
                    required
                    value={newMovementData.medicalLicense}
                    onChange={(e) => setNewMovementData({ ...newMovementData, medicalLicense: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewControlledModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
                >
                  Asentar en Libro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
