import React, { useState } from 'react';
import { useClinical } from '../../context/ClinicalContext';
import { 
  FileCheck2, 
  Receipt, 
  BarChart3, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  TrendingUp, 
  Building2, 
  FileText, 
  Plus, 
  Calendar,
  Lock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface DirectorModuleProps {
  activeTab: string;
}

export const DirectorModule: React.FC<DirectorModuleProps> = ({ activeTab }) => {
  const { 
    regulatoryPermits, 
    financialMetrics, 
    cfdiInvoices, 
    addCFDIInvoice,
    controlledMovements,
    beds,
    surgicalProcedures,
    patients
  } = useClinical();

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [newInvoiceData, setNewInvoiceData] = useState({
    patientName: '',
    rfc: '',
    concept: 'Atención Médica Integral' as const,
    total: 25000
  });

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoiceData.patientName || !newInvoiceData.rfc) return;
    addCFDIInvoice({
      folio: `CFDI-HOSP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      uuid: crypto.randomUUID().toUpperCase(),
      patientName: newInvoiceData.patientName,
      rfc: newInvoiceData.rfc.toUpperCase(),
      issueDate: new Date().toISOString().substring(0, 10),
      total: Number(newInvoiceData.total),
      status: 'Timbrada (SAT)',
      concept: newInvoiceData.concept,
      hasHealthSupplement: true
    });
    setShowInvoiceModal(false);
    setNewInvoiceData({ patientName: '', rfc: '', concept: 'Atención Médica Integral', total: 25000 });
  };

  const occupiedBedsCount = beds.filter(b => b.status === 'Ocupada').length;
  const occupancyPercentage = beds.length > 0 ? Math.round((occupiedBedsCount / beds.length) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* 1. Cumplimiento Regulatorio COFEPRIS */}
      {activeTab === 'cofepris' && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-blue-600" />
                  Cumplimiento Regulatorio ante COFEPRIS
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Supervisión de avisos de funcionamiento, licencias sanitarias y acreditación de responsables sanitarios.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Vigilancia Sanitaria Activa
              </span>
            </div>

            {/* Licencias Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {regulatoryPermits.map((permit) => {
                const isExpiringSoon = permit.status === 'Próximo a renovar';
                return (
                  <div 
                    key={permit.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isExpiringSoon 
                        ? 'bg-amber-50/40 border-amber-200' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {permit.type}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        permit.status === 'Vigente'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {permit.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 mt-2 text-sm sm:text-base">
                      {permit.title}
                    </h3>

                    <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Folio Oficial:</span>
                        <span className="font-mono font-semibold text-slate-800">{permit.folioNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Responsable Sanitario:</span>
                        <span className="font-medium text-slate-800">{permit.responsiblePerson}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Cédula Profesional:</span>
                        <span className="font-mono text-slate-700">{permit.professionalLicense}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-slate-100">
                        <span className="text-slate-500">Vigencia Hasta:</span>
                        <span className="font-semibold text-slate-900 tabular-nums">{permit.expirationDate}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bitácora Oficial COFEPRIS - Libros de Control */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Lock className="w-4 h-4 text-slate-700" />
              Bitácora Electrónica Normativa: Libro de Estupefacientes y Psicotrópicos (Grupos I, II y III)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Registro inalterable con folios de recetas especiales autorizadas por COFEPRIS y trazabilidad de cédulas médicas.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
                    <th className="py-2.5 px-3">Fecha y Hora</th>
                    <th className="py-2.5 px-3">Medicamento Controlado</th>
                    <th className="py-2.5 px-3">Movimiento</th>
                    <th className="py-2.5 px-3">Cant.</th>
                    <th className="py-2.5 px-3">Saldo</th>
                    <th className="py-2.5 px-3">Médico Prescriptor</th>
                    <th className="py-2.5 px-3">Folio Receta COFEPRIS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {controlledMovements.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-slate-400">
                        No hay movimientos registrados en la bitácora electrónica.
                      </td>
                    </tr>
                  ) : (
                    controlledMovements.map((mov) => (
                      <tr key={mov.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-mono text-slate-600 tabular-nums">{mov.date}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{mov.medicationName}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            mov.movementType === 'Entrada' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {mov.movementType}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-800 tabular-nums">{mov.quantity}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900 tabular-nums">{mov.resultingBalance}</td>
                        <td className="py-2.5 px-3 text-slate-700">{mov.prescribingDoctor}</td>
                        <td className="py-2.5 px-3 font-mono text-blue-700 font-semibold">{mov.specialPrescriptionFolio}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. Gestión Financiera y Facturación CFDI 4.0 */}
      {activeTab === 'finance' && (
        <div className="space-y-5">
          {/* Tarjetas de Balance Financiero */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500 flex items-center justify-between">
                Ingresos Mes
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </span>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">
                ${financialMetrics.totalRevenueMonth.toLocaleString('es-MX')}
              </p>
              <span className="text-[11px] text-emerald-700 font-medium">+12.4% vs mes anterior</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500 flex items-center justify-between">
                Egresos Operativos
                <ArrowDownRight className="w-4 h-4 text-rose-500" />
              </span>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">
                ${financialMetrics.totalExpensesMonth.toLocaleString('es-MX')}
              </p>
              <span className="text-[11px] text-slate-500">Nómina, insumos y CEYE</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500 flex items-center justify-between">
                Cuentas por Cobrar
                <ArrowUpRight className="w-4 h-4 text-sky-600" />
              </span>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">
                ${financialMetrics.accountsReceivableInsurers.toLocaleString('es-MX')}
              </p>
              <span className="text-[11px] text-slate-500">Convenios GNP, AXA, MetLife</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500 flex items-center justify-between">
                Caja General
                <DollarSign className="w-4 h-4 text-teal-600" />
              </span>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">
                ${financialMetrics.cashOnHand.toLocaleString('es-MX')}
              </p>
              <span className="text-[11px] text-teal-700 font-medium">Liquidez inmediata</span>
            </div>
          </div>

          {/* Facturación Electrónica CFDI 4.0 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-sky-600" />
                  Facturación Electrónica CFDI 4.0 (Sector Salud)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complementos específicos de servicios hospitalarios, honorarios médicos y medicamentos.
                </p>
              </div>
              <button
                onClick={() => setShowInvoiceModal(true)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold transition"
              >
                <Plus className="w-4 h-4" />
                Timbrar Factura CFDI
              </button>
            </div>

            {/* Listado de Facturas */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
                    <th className="py-2.5 px-3">Folio</th>
                    <th className="py-2.5 px-3">Receptor / Paciente</th>
                    <th className="py-2.5 px-3">RFC</th>
                    <th className="py-2.5 px-3">Concepto Salud</th>
                    <th className="py-2.5 px-3">Total (MXN)</th>
                    <th className="py-2.5 px-3">Estado SAT</th>
                    <th className="py-2.5 px-3">UUID Fiscal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cfdiInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-slate-400">
                        No hay facturas emitidas en el periodo.
                      </td>
                    </tr>
                  ) : (
                    cfdiInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{inv.folio}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{inv.patientName}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">{inv.rfc}</td>
                        <td className="py-2.5 px-3 text-slate-700">{inv.concept}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900 tabular-nums">
                          ${inv.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400 max-w-[120px] truncate">
                          {inv.uuid}
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

      {/* 3. Business Intelligence & Reportes */}
      {activeTab === 'bi' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Ocupación Hospitalaria */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between mb-3">
                Ocupación Hospitalaria
                <Building2 className="w-4 h-4 text-blue-600" />
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {occupancyPercentage}%
                </span>
                <span className="text-xs text-slate-500">
                  ({occupiedBedsCount} de {beds.length} camas)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-3">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, occupancyPercentage)}%` }}
                />
              </div>
              <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Pabellón A (Med. Interna):</span>
                  <span className="font-semibold text-slate-800">
                    {beds.filter(b => b.ward.includes('Pabellón A') && b.status === 'Ocupada').length} ocupadas
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Pabellón B (Cirugía):</span>
                  <span className="font-semibold text-slate-800">
                    {beds.filter(b => b.ward.includes('Pabellón B') && b.status === 'Ocupada').length} ocupadas
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>UCI (Terapia Intensiva):</span>
                  <span className="font-semibold text-slate-800">
                    {beds.filter(b => b.ward.includes('UCI') && b.status === 'Ocupada').length} ocupadas
                  </span>
                </div>
              </div>
            </div>

            {/* Rendimiento de Quirófanos */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between mb-3">
                Rendimiento de Quirófanos
                <BarChart3 className="w-4 h-4 text-indigo-600" />
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                  78.5%
                </span>
                <span className="text-xs text-emerald-600 font-semibold">Tasa de Rotación Óptima</span>
              </div>
              <div className="mt-4 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>Cirugías Programadas:</span>
                  <span className="font-bold text-slate-800">{surgicalProcedures.length} en agenda</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>Tiempo promedio en sala:</span>
                  <span className="font-bold text-slate-800">115 minutos</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiempo de recambio (limpieza):</span>
                  <span className="font-bold text-slate-800">28 minutos</span>
                </div>
              </div>
            </div>

            {/* Estadísticas de Morbilidad CIE-10 */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between mb-3">
                Morbilidad (CIE-10)
                <FileText className="w-4 h-4 text-teal-600" />
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 truncate">K80.2 Colelitiasis sintomática</span>
                  <span className="font-mono font-bold text-sky-800">32%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 truncate">E11.7 Diabetes Tipo 2 descompensada</span>
                  <span className="font-mono font-bold text-sky-800">26%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 truncate">M16.1 Coxartrosis para artroplastia</span>
                  <span className="font-mono font-bold text-sky-800">18%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 truncate">O80.0 Parto único espontáneo</span>
                  <span className="font-mono font-bold text-sky-800">14%</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Modal Nueva Factura */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3">Timbrar Factura CFDI 4.0</h3>
            <form onSubmit={handleCreateInvoice} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre o Razón Social</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. María Elena Morales Ruiz o Seguros GNP"
                  value={newInvoiceData.patientName}
                  onChange={(e) => setNewInvoiceData({ ...newInvoiceData, patientName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">RFC</label>
                <input
                  type="text"
                  required
                  placeholder="MORU820514AB2"
                  value={newInvoiceData.rfc}
                  onChange={(e) => setNewInvoiceData({ ...newInvoiceData, rfc: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden uppercase font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Concepto de Salud</label>
                <select
                  value={newInvoiceData.concept}
                  onChange={(e) => setNewInvoiceData({ ...newInvoiceData, concept: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                >
                  <option value="Atención Médica Integral">Atención Médica Integral</option>
                  <option value="Honorarios Quirúrgicos">Honorarios Quirúrgicos</option>
                  <option value="Estancia Hospitalaria">Estancia Hospitalaria</option>
                  <option value="Medicamentos y Materiales">Medicamentos y Materiales</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Total MXN</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newInvoiceData.total}
                  onChange={(e) => setNewInvoiceData({ ...newInvoiceData, total: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold"
                >
                  Timbrar ante SAT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
