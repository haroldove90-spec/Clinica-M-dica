export type RoleId = 
  | 'director'      // Dirección General y Administración
  | 'admission'     // Admisión y Recepción
  | 'medical'       // Personal Médico
  | 'surgical'      // Bloque Quirúrgico
  | 'pharmacy'      // Farmacia Interna
  | 'nursing'       // Enfermería y Servicios Auxiliares
  | 'tech';         // Sistemas y Tecnologías (TI)

export interface RoleConfig {
  id: RoleId;
  name: string;
  shortName: string;
  iconName: string;
  badge: string;
  description: string;
  primaryColor: string;
}

// 1. Pacientes & Padrón
export interface Patient {
  id: string;
  clinicalRecordNumber: string; // Folio de Expediente
  fullName: string;
  curp: string;
  rfc?: string;
  dateOfBirth: string;
  age: number;
  gender: 'M' | 'F' | 'Otro';
  bloodType: string;
  phone: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  insurance: {
    company: string;
    policyNumber: string;
    hasPreauthorization: boolean;
    copayPercentage: number;
    deductible: number;
    status: 'Vigente' | 'En revisión' | 'Vencida';
  };
  admissionStatus: 'Ambulatorio' | 'Hospitalizado' | 'En Urgencias' | 'Alta médica';
  assignedBed?: string;
  assignedService?: string;
  treatingDoctor?: string;
  allergies: string[];
}

// 2. Camas Hospitalarias
export interface HospitalBed {
  id: string;
  bedNumber: string;
  ward: 'Pabellón A (Medicina Interna)' | 'Pabellón B (Cirugía)' | 'Urgencias' | 'UCI (Terapia Intensiva)';
  status: 'Disponible' | 'Ocupada' | 'En desinfección' | 'Mantenimiento';
  patientId?: string;
  patientName?: string;
  assignedAt?: string;
  notes?: string;
}

// 3. Citas Médicas
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  area: 'Consultorio 1' | 'Consultorio 2' | 'Quirófano' | 'Diagnóstico e Imagen';
  status: 'Confirmada' | 'En espera' | 'Completada' | 'Cancelada';
  reason: string;
}

// 4. Expediente Clínico NOM-004-SSA3-2012
export interface MedicalHistory {
  patientId: string;
  heredofamiliares: string; // Diabetes, Hipertensión, Cardiopatías, Neoplasias
  personalesNoPatologicos: string; // Tabaquismo, Alcoholismo, Vivienda, Alimentación
  personalesPatologicos: string; // Quirúrgicos, Traumáticos, Alérgicos, Transfusionales
  alergiasSeveras: string;
}

export interface MedicalNote {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  professionalLicense: string; // Cédula profesional
  date: string;
  type: 'Nota de Evolución (SOAP)' | 'Nota de Urgencias' | 'Nota de Interconsulta' | 'Nota Post-operatoria';
  // Formato SOAP
  subjective: string; // Subjetivo (Síntomas y motivo de consulta)
  objective: { // Objetivo
    bloodPressure: string; // Tensión Arterial (e.g. 120/80)
    heartRate: number;     // Frecuencia Cardíaca (lpm)
    respiratoryRate: number; // FR (rpm)
    temperature: number;   // Temperatura (°C)
    oxygenSaturation: number; // SpO2 (%)
    weight: number;        // kg
    physicalExam: string;  // Exploración física
  };
  assessment: string; // Análisis y Diagnóstico CIE-10
  plan: string;       // Plan terapéutico
  digitalSignatureHash: string; // Hash SHA-256 de validación
}

// 5. Recetas y Órdenes Médicas
export interface PrescriptionItem {
  medicationName: string;
  presentation: string;
  dosage: string;
  frequency: string;
  route: string;
  durationDays: number;
  dispensed?: boolean;
}

export interface Prescription {
  id: string;
  folio: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  professionalLicense: string;
  date: string;
  items: PrescriptionItem[];
  instructions: string;
  isControlled: boolean;
  status: 'Emitida' | 'Surtida Parcial' | 'Surtida Total';
  verificationHash: string;
}

export interface LabOrder {
  id: string;
  folio: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  date: string;
  category: 'Laboratorio Clínico' | 'Imagenología / Gabinete' | 'Procedimiento Especial';
  studies: string[];
  priority: 'Ordinaria' | 'Urgente';
  status: 'Pendiente' | 'En proceso' | 'Resultados listos';
}

// 6. Bloque Quirúrgico & OMS
export interface SurgicalProcedure {
  id: string;
  operatingRoom: 'Quirófano 1 (Cirugía Mayor)' | 'Quirófano 2 (Laparoscopía)' | 'Quirófano 3 (Traumatología)';
  patientId: string;
  patientName: string;
  scheduledDate: string;
  scheduledTime: string;
  durationEstimatedMinutes: number;
  procedureName: string;
  leadSurgeon: string;
  anesthesiologist: string;
  circulatingNurse: string;
  scrubNurse: string;
  status: 'Programada' | 'En quirófano' | 'Finalizada' | 'Cancelada';
  // Checklist Cirugía Segura OMS (3 Fases)
  safetyChecklist: {
    // Fase 1: Entrada (Sign-in)
    signIn: {
      patientIdentityConfirmed: boolean;
      siteMarked: boolean;
      anesthesiaSafetyCheckCompleted: boolean;
      pulseOximeterFunctioning: boolean;
      knownAllergiesReviewed: boolean;
      difficultAirwayEvaluated: boolean;
      bloodLossRiskReviewed: boolean;
      completedBy: string;
    };
    // Fase 2: Pausa Quirúrgica (Time-out)
    timeOut: {
      teamIntroductionsConfirmed: boolean;
      patientNameAndProcedureVerballyConfirmed: boolean;
      criticalEventsAnticipated: boolean;
      antibioticProphylaxisGivenLast60Min: boolean;
      essentialImagingDisplayed: boolean;
      completedBy: string;
    };
    // Fase 3: Salida (Sign-out)
    signOut: {
      nurseConfirmsProcedureRecorded: boolean;
      instrumentSpongeNeedleCountCorrect: boolean;
      specimenLabeledCorrectly: boolean;
      equipmentIssuesAddressed: boolean;
      postOpRecoveryConcernsReviewed: boolean;
      completedBy: string;
    };
  };
}

// 7. CEYE (Central de Esterilización y Equipos) & Materiales
export interface SterilizationCycle {
  id: string;
  autoclaveUnit: 'Autoclave Vapor 01' | 'Autoclave Vapor 02' | 'Plasma Peróxido 01';
  cycleNumber: number;
  date: string;
  startTime: string;
  endTime: string;
  temperatureCelsius: number;
  pressurePSI: number;
  biologicalIndicatorResult: 'Negativo (Aprobado)' | 'Positivo (Rechazado)' | 'En incubación (24h)';
  chemicalIndicatorClass5Passed: boolean;
  operatorName: string;
  packagesProcessed: string[];
  status: 'Liberado' | 'En proceso' | 'Retenido';
}

export interface SurgicalImplant {
  id: string;
  name: string;
  type: 'Osteosíntesis' | 'Prótesis' | 'Malla quirúrgica' | 'Vascular';
  manufacturer: string;
  lotNumber: string;
  serialNumber: string;
  expirationDate: string;
  isSterile: boolean;
  usedInPatientId?: string;
  usedInProcedureId?: string;
  status: 'En stock estéril' | 'Implantado' | 'Desechado';
}

// 8. Farmacia Interna
export interface PharmacyMedication {
  id: string;
  genericName: string;
  commercialName: string;
  category: 'Analgésicos' | 'Antibióticos' | 'Anestésicos' | 'Cardiovasculares' | 'Soluciones IV' | 'Material de curación';
  groupControl: 'Grupo I (Estupefacientes)' | 'Grupo II (Psicotrópicos)' | 'Grupo III (Psicotrópicos)' | 'No Controlado';
  dosageForm: string; // Ampolleta, Frasco, Comprimido, Solución 1000ml
  batchNumber: string;
  expirationDate: string; // YYYY-MM-DD
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  location: string;
  isCrashCartStock: boolean; // Carro Rojo
}

export interface ControlledDrugMovement {
  id: string;
  date: string;
  medicationName: string;
  group: 'Grupo I' | 'Grupo II' | 'Grupo III';
  movementType: 'Entrada' | 'Salida';
  quantity: number;
  resultingBalance: number;
  batchNumber: string;
  prescribingDoctor: string;
  medicalLicense: string;
  specialPrescriptionFolio: string; // Folio receta especial COFEPRIS con código de barras
  responsiblePharmacist: string;
  patientName?: string;
}

// 9. Enfermería & Kardex
export interface KardexSchedule {
  id: string;
  patientId: string;
  patientName: string;
  bedNumber: string;
  medicationName: string;
  dose: string;
  route: 'IV' | 'VO' | 'IM' | 'SC' | 'Inhalada';
  scheduledTime: string; // e.g. "08:00"
  status: 'Pendiente' | 'Administrado' | 'Omitido';
  administeredBy?: string;
  administeredAt?: string;
  notes?: string;
}

export interface VitalSignRecord {
  id: string;
  patientId: string;
  patientName: string;
  bedNumber: string;
  recordedAt: string;
  bloodPressure: string;
  heartRate: number;
  respiratoryRate: number;
  temperature: number;
  oxygenSaturation: number;
  glucoseLevel?: number;
  painScaleEva: number; // 0 - 10
  nurseName: string;
}

export interface FluidBalance {
  id: string;
  patientId: string;
  date: string;
  intakeIVSolutions: number; // ml
  intakeOral: number;        // ml
  intakeMedications: number; // ml
  outputUrine: number;       // ml
  outputDrains: number;      // ml
  outputVomit: number;       // ml
  netBalance: number;        // ml
  calculatedBy: string;
}

export interface NursingNote {
  id: string;
  patientId: string;
  patientName: string;
  bedNumber: string;
  date: string;
  shift: 'Matutino' | 'Vespertino' | 'Nocturno';
  nurseName: string;
  careDetails: string;
  curationsPerformed: string;
  bradenScore: number; // Riesgo úlceras por presión
  morseScore: number;  // Riesgo de caídas
}

// 10. Dirección & Cumplimiento Regulatorio (COFEPRIS)
export interface RegulatoryPermit {
  id: string;
  title: string;
  type: 'Aviso de Funcionamiento' | 'Licencia Sanitaria' | 'Responsable Sanitario' | 'Comité de Bioética' | 'Control Radiológico';
  folioNumber: string;
  issuingAuthority: 'COFEPRIS' | 'Secretaría de Salud';
  issueDate: string;
  expirationDate: string;
  status: 'Vigente' | 'Próximo a renovar' | 'En trámite' | 'Vencido';
  responsiblePerson: string;
  professionalLicense: string;
}

export interface FinancialMetric {
  totalRevenueMonth: number;
  totalExpensesMonth: number;
  accountsReceivableInsurers: number;
  accountsPayableSuppliers: number;
  cashOnHand: number;
  hospitalOccupancyRate: number; // %
  operatingRoomUtilizationRate: number; // %
  averagePatientStayDays: number;
}

export interface CFDIInvoice {
  id: string;
  folio: string;
  uuid: string;
  patientName: string;
  rfc: string;
  issueDate: string;
  total: number;
  status: 'Timbrada (SAT)' | 'Cancelada' | 'Pendiente';
  concept: 'Atención Médica Integral' | 'Honorarios Quirúrgicos' | 'Estancia Hospitalaria' | 'Medicamentos y Materiales';
  hasHealthSupplement: boolean;
}

// 11. Sistemas, Seguridad & Auditoría (TI)
export interface SystemAuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: 'CONSULTA_EXPEDIENTE' | 'CREACION_NOTA_MEDICA' | 'DISPENSACION_CONTROLADO' | 'CHECKLIST_QUIROFANO' | 'MODIFICACION_KARDEX' | 'TIMBRADO_FACTURA' | 'ACCESO_SISTEMA';
  entityAffected: string;
  ipAddress: string;
  severity: 'INFO' | 'WARN' | 'AUDIT';
}

export interface SystemUser {
  id: string;
  fullName: string;
  username: string;
  role: RoleId;
  professionalLicense?: string;
  active: boolean;
  lastLogin: string;
  permissions: {
    canViewMedicalRecords: boolean;
    canEditMedicalRecords: boolean;
    canDispensePharmacy: boolean;
    canManageControlledDrugs: boolean;
    canSignSurgicalChecklist: boolean;
    canManageBilling: boolean;
    canManageSystemConfig: boolean;
  };
}

export interface SupabaseConfig {
  projectUrl: string;
  anonKey: string;
  isConnected: boolean;
  lastChecked?: string;
}
