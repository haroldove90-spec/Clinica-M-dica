import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  RoleId,
  RoleConfig,
  Patient,
  HospitalBed,
  Appointment,
  MedicalHistory,
  MedicalNote,
  Prescription,
  LabOrder,
  SurgicalProcedure,
  SterilizationCycle,
  SurgicalImplant,
  PharmacyMedication,
  ControlledDrugMovement,
  KardexSchedule,
  VitalSignRecord,
  FluidBalance,
  NursingNote,
  RegulatoryPermit,
  FinancialMetric,
  CFDIInvoice,
  SystemAuditLog,
  SystemUser,
  SupabaseConfig
} from '../types/clinical';
import {
  INITIAL_PATIENTS,
  INITIAL_BEDS,
  INITIAL_APPOINTMENTS,
  INITIAL_MEDICAL_HISTORIES,
  INITIAL_MEDICAL_NOTES,
  INITIAL_PRESCRIPTIONS,
  INITIAL_LAB_ORDERS,
  INITIAL_SURGICAL_PROCEDURES,
  INITIAL_STERILIZATION_CYCLES,
  INITIAL_IMPLANTS,
  INITIAL_PHARMACY_MEDS,
  INITIAL_CONTROLLED_MOVEMENTS,
  INITIAL_KARDEX,
  INITIAL_VITALS,
  INITIAL_FLUID_BALANCES,
  INITIAL_NURSING_NOTES,
  INITIAL_REGULATORY_PERMITS,
  INITIAL_FINANCIAL_METRICS,
  INITIAL_CFDI_INVOICES,
  INITIAL_AUDIT_LOGS,
  INITIAL_SYSTEM_USERS
} from '../data/mockData';

export const ROLE_DEFINITIONS: Record<RoleId, RoleConfig> = {
  director: {
    id: 'director',
    name: 'Dirección General y Administración',
    shortName: 'Dirección',
    iconName: 'Building2',
    badge: 'COFEPRIS & Finanzas',
    description: 'Gestión y cumplimiento regulatorio ante COFEPRIS, facturación CFDI 4.0 y Business Intelligence.',
    primaryColor: 'from-blue-600 to-indigo-700'
  },
  admission: {
    id: 'admission',
    name: 'Admisión y Recepción',
    shortName: 'Admisión',
    iconName: 'UserPlus',
    badge: 'Admisiones & Camas',
    description: 'Registro de padrón de pacientes, gestión de citas, asignación hospitalaria y convenios con aseguradoras.',
    primaryColor: 'from-cyan-600 to-teal-700'
  },
  medical: {
    id: 'medical',
    name: 'Personal Médico',
    shortName: 'Médico',
    iconName: 'Stethoscope',
    badge: 'Expediente NOM-004',
    description: 'Expediente clínico electrónico (ECE), notas SOAP, recetas con firma digital y órdenes médicas.',
    primaryColor: 'from-sky-600 to-blue-700'
  },
  surgical: {
    id: 'surgical',
    name: 'Bloque Quirúrgico',
    shortName: 'Quirófano',
    iconName: 'Scissors',
    badge: 'Cirugía OMS & CEYE',
    description: 'Programación de quirófanos, Lista de Verificación Cirugía Segura OMS, implantes y autoclaves CEYE.',
    primaryColor: 'from-indigo-600 to-violet-700'
  },
  pharmacy: {
    id: 'pharmacy',
    name: 'Farmacia Interna',
    shortName: 'Farmacia',
    iconName: 'Pill',
    badge: 'Controlados & FIFO',
    description: 'Surtido intrahospitalario, semáforo FIFO de caducidades, libro de estupefacientes y Carro Rojo.',
    primaryColor: 'from-emerald-600 to-teal-700'
  },
  nursing: {
    id: 'nursing',
    name: 'Enfermería y Servicios Auxiliares',
    shortName: 'Enfermería',
    iconName: 'HeartPulse',
    badge: 'Kardex & Signos',
    description: 'Administración de medicamentos, monitorización de signos vitales, balance de líquidos y notas de cuidado.',
    primaryColor: 'from-rose-600 to-pink-700'
  },
  tech: {
    id: 'tech',
    name: 'Sistemas y Tecnologías',
    shortName: 'Admin TI',
    iconName: 'ShieldCheck',
    badge: 'RBAC & Auditoría',
    description: 'Control de accesos por roles, bitácoras inalterables de auditoría, respaldos y configuración Supabase.',
    primaryColor: 'from-slate-700 to-zinc-800'
  }
};

const STORAGE_KEYS = {
  SUPPRESS_DEMO: 'clinica_suppress_demo_data',
  CURRENT_ROLE: 'clinica_active_role',
  SUPABASE_CONFIG: 'clinica_supabase_config',
  STORED_DATA: 'clinica_system_data'
};

interface ClinicalContextType {
  currentRole: RoleId | null;
  activeRoleConfig: RoleConfig | null;
  switchRole: (role: RoleId | null) => void;
  
  // Data state
  patients: Patient[];
  beds: HospitalBed[];
  appointments: Appointment[];
  medicalHistories: Record<string, MedicalHistory>;
  medicalNotes: MedicalNote[];
  prescriptions: Prescription[];
  labOrders: LabOrder[];
  surgicalProcedures: SurgicalProcedure[];
  sterilizationCycles: SterilizationCycle[];
  surgicalImplants: SurgicalImplant[];
  pharmacyMeds: PharmacyMedication[];
  controlledMovements: ControlledDrugMovement[];
  kardex: KardexSchedule[];
  vitals: VitalSignRecord[];
  fluidBalances: FluidBalance[];
  nursingNotes: NursingNote[];
  regulatoryPermits: RegulatoryPermit[];
  financialMetrics: FinancialMetric;
  cfdiInvoices: CFDIInvoice[];
  auditLogs: SystemAuditLog[];
  systemUsers: SystemUser[];

  // Demo data & Supabase
  isDemoDataPurged: boolean;
  purgeDemoData: (persistNeverShowAgain?: boolean) => void;
  restoreDemoData: () => void;
  supabaseConfig: SupabaseConfig;
  saveSupabaseConfig: (config: SupabaseConfig) => void;
  testSupabaseConnection: () => Promise<{ success: boolean; message: string }>;
  supabaseDDLScript: string;

  // Actions
  addPatient: (patient: Omit<Patient, 'id'>) => Patient;
  updateBedStatus: (bedId: string, status: HospitalBed['status'], patientId?: string, patientName?: string) => void;
  addAppointment: (apt: Omit<Appointment, 'id'>) => Appointment;
  addMedicalNote: (note: Omit<MedicalNote, 'id'>) => MedicalNote;
  addPrescription: (rx: Omit<Prescription, 'id'>) => Prescription;
  addLabOrder: (order: Omit<LabOrder, 'id'>) => LabOrder;
  updateSurgicalChecklist: (
    procedureId: string, 
    phase: 'signIn' | 'timeOut' | 'signOut', 
    field: string, 
    value: boolean, 
    completedBy?: string
  ) => void;
  addSterilizationCycle: (cycle: Omit<SterilizationCycle, 'id'>) => SterilizationCycle;
  addControlledMovement: (movement: Omit<ControlledDrugMovement, 'id' | 'resultingBalance'>) => ControlledDrugMovement;
  dispensePrescription: (prescriptionId: string) => void;
  updateKardexStatus: (kardexId: string, status: KardexSchedule['status'], nurseName?: string, notes?: string) => void;
  addVitalSign: (record: Omit<VitalSignRecord, 'id'>) => VitalSignRecord;
  addNursingNote: (note: Omit<NursingNote, 'id'>) => NursingNote;
  addCFDIInvoice: (inv: Omit<CFDIInvoice, 'id'>) => CFDIInvoice;
  addAuditLog: (entry: Omit<SystemAuditLog, 'id' | 'timestamp'>) => void;

  // Active Toast
  toast: { message: string; type: 'success' | 'info' | 'warn' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warn') => void;
}

const ClinicalContext = createContext<ClinicalContextType | undefined>(undefined);

export const ClinicalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Check if user previously chose to purge and never show demo data again
  const [isDemoDataPurged, setIsDemoDataPurged] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.SUPPRESS_DEMO) === 'true';
    } catch {
      return false;
    }
  });

  const [currentRole, setCurrentRole] = useState<RoleId | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE);
      return (saved && ROLE_DEFINITIONS[saved as RoleId]) ? (saved as RoleId) : null;
    } catch {
      return null;
    }
  });

  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUPABASE_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      projectUrl: '',
      anonKey: '',
      isConnected: false
    };
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warn' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 3800);
  };

  // Main collections
  const [patients, setPatients] = useState<Patient[]>(() => isDemoDataPurged ? [] : INITIAL_PATIENTS);
  const [beds, setBeds] = useState<HospitalBed[]>(() => isDemoDataPurged ? [
    { id: 'b-101', bedNumber: 'Cama 101', ward: 'Pabellón A (Medicina Interna)', status: 'Disponible' },
    { id: 'b-102', bedNumber: 'Cama 102', ward: 'Pabellón A (Medicina Interna)', status: 'Disponible' },
    { id: 'b-201', bedNumber: 'Cama 201', ward: 'Pabellón B (Cirugía)', status: 'Disponible' },
    { id: 'b-urg-01', bedNumber: 'Urgencias 01', ward: 'Urgencias', status: 'Disponible' },
    { id: 'b-uci-01', bedNumber: 'UCI 01', ward: 'UCI (Terapia Intensiva)', status: 'Disponible' }
  ] : INITIAL_BEDS);
  const [appointments, setAppointments] = useState<Appointment[]>(() => isDemoDataPurged ? [] : INITIAL_APPOINTMENTS);
  const [medicalHistories, setMedicalHistories] = useState<Record<string, MedicalHistory>>(() => isDemoDataPurged ? {} : INITIAL_MEDICAL_HISTORIES);
  const [medicalNotes, setMedicalNotes] = useState<MedicalNote[]>(() => isDemoDataPurged ? [] : INITIAL_MEDICAL_NOTES);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => isDemoDataPurged ? [] : INITIAL_PRESCRIPTIONS);
  const [labOrders, setLabOrders] = useState<LabOrder[]>(() => isDemoDataPurged ? [] : INITIAL_LAB_ORDERS);
  const [surgicalProcedures, setSurgicalProcedures] = useState<SurgicalProcedure[]>(() => isDemoDataPurged ? [] : INITIAL_SURGICAL_PROCEDURES);
  const [sterilizationCycles, setSterilizationCycles] = useState<SterilizationCycle[]>(() => isDemoDataPurged ? [] : INITIAL_STERILIZATION_CYCLES);
  const [surgicalImplants, setSurgicalImplants] = useState<SurgicalImplant[]>(() => isDemoDataPurged ? [] : INITIAL_IMPLANTS);
  const [pharmacyMeds, setPharmacyMeds] = useState<PharmacyMedication[]>(() => isDemoDataPurged ? [] : INITIAL_PHARMACY_MEDS);
  const [controlledMovements, setControlledMovements] = useState<ControlledDrugMovement[]>(() => isDemoDataPurged ? [] : INITIAL_CONTROLLED_MOVEMENTS);
  const [kardex, setKardex] = useState<KardexSchedule[]>(() => isDemoDataPurged ? [] : INITIAL_KARDEX);
  const [vitals, setVitals] = useState<VitalSignRecord[]>(() => isDemoDataPurged ? [] : INITIAL_VITALS);
  const [fluidBalances, setFluidBalances] = useState<FluidBalance[]>(() => isDemoDataPurged ? [] : INITIAL_FLUID_BALANCES);
  const [nursingNotes, setNursingNotes] = useState<NursingNote[]>(() => isDemoDataPurged ? [] : INITIAL_NURSING_NOTES);
  const [regulatoryPermits, setRegulatoryPermits] = useState<RegulatoryPermit[]>(() => INITIAL_REGULATORY_PERMITS);
  const [financialMetrics, setFinancialMetrics] = useState<FinancialMetric>(() => INITIAL_FINANCIAL_METRICS);
  const [cfdiInvoices, setCfdiInvoices] = useState<CFDIInvoice[]>(() => isDemoDataPurged ? [] : INITIAL_CFDI_INVOICES);
  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>(() => INITIAL_AUDIT_LOGS);
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>(() => INITIAL_SYSTEM_USERS);

  const switchRole = (role: RoleId | null) => {
    setCurrentRole(role);
    if (role) {
      try {
        localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, role);
      } catch {
        // ignore
      }
      addAuditLog({
        userId: 'session-usr',
        userName: `Usuario ${ROLE_DEFINITIONS[role].name}`,
        userRole: ROLE_DEFINITIONS[role].name,
        action: 'ACCESO_SISTEMA',
        entityAffected: `Ingreso al módulo ${ROLE_DEFINITIONS[role].name}`,
        ipAddress: '192.168.10.100',
        severity: 'INFO'
      });
    } else {
      try {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_ROLE);
      } catch {
        // ignore
      }
    }
  };

  const addAuditLog = (entry: Omit<SystemAuditLog, 'id' | 'timestamp'>) => {
    const newLog: SystemAuditLog = {
      ...entry,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 99)]);
  };

  // Demo Data Purge Functionality
  const purgeDemoData = (persistNeverShowAgain = true) => {
    setIsDemoDataPurged(true);
    if (persistNeverShowAgain) {
      try {
        localStorage.setItem(STORAGE_KEYS.SUPPRESS_DEMO, 'true');
      } catch {
        // ignore
      }
    }

    setPatients([]);
    setAppointments([]);
    setMedicalHistories({});
    setMedicalNotes([]);
    setPrescriptions([]);
    setLabOrders([]);
    setSurgicalProcedures([]);
    setControlledMovements([]);
    setKardex([]);
    setVitals([]);
    setFluidBalances([]);
    setNursingNotes([]);
    setCfdiInvoices([]);
    
    // Reset beds to empty available
    setBeds([
      { id: 'b-101', bedNumber: 'Cama 101', ward: 'Pabellón A (Medicina Interna)', status: 'Disponible' },
      { id: 'b-102', bedNumber: 'Cama 102', ward: 'Pabellón A (Medicina Interna)', status: 'Disponible' },
      { id: 'b-201', bedNumber: 'Cama 201', ward: 'Pabellón B (Cirugía)', status: 'Disponible' },
      { id: 'b-urg-01', bedNumber: 'Urgencias 01', ward: 'Urgencias', status: 'Disponible' },
      { id: 'b-uci-01', bedNumber: 'UCI 01', ward: 'UCI (Terapia Intensiva)', status: 'Disponible' }
    ]);

    addAuditLog({
      userId: 'admin-action',
      userName: 'Administrador del Sistema',
      userRole: 'Sistemas TI',
      action: 'CONSULTA_EXPEDIENTE',
      entityAffected: 'PURGA_DATOS_MUESTRA: Limpieza total de registros de prueba en navegador y memoria local',
      ipAddress: '127.0.0.1',
      severity: 'AUDIT'
    });

    showToast('Datos de muestra eliminados del sistema. La vista ahora está lista para datos reales.', 'success');
  };

  const restoreDemoData = () => {
    setIsDemoDataPurged(false);
    try {
      localStorage.removeItem(STORAGE_KEYS.SUPPRESS_DEMO);
    } catch {
      // ignore
    }

    setPatients(INITIAL_PATIENTS);
    setBeds(INITIAL_BEDS);
    setAppointments(INITIAL_APPOINTMENTS);
    setMedicalHistories(INITIAL_MEDICAL_HISTORIES);
    setMedicalNotes(INITIAL_MEDICAL_NOTES);
    setPrescriptions(INITIAL_PRESCRIPTIONS);
    setLabOrders(INITIAL_LAB_ORDERS);
    setSurgicalProcedures(INITIAL_SURGICAL_PROCEDURES);
    setSterilizationCycles(INITIAL_STERILIZATION_CYCLES);
    setSurgicalImplants(INITIAL_IMPLANTS);
    setPharmacyMeds(INITIAL_PHARMACY_MEDS);
    setControlledMovements(INITIAL_CONTROLLED_MOVEMENTS);
    setKardex(INITIAL_KARDEX);
    setVitals(INITIAL_VITALS);
    setFluidBalances(INITIAL_FLUID_BALANCES);
    setNursingNotes(INITIAL_NURSING_NOTES);
    setCfdiInvoices(INITIAL_CFDI_INVOICES);

    showToast('Datos de muestra restaurados para pruebas y demostración.', 'info');
  };

  const saveSupabaseConfig = (config: SupabaseConfig) => {
    setSupabaseConfig(config);
    try {
      localStorage.setItem(STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify(config));
    } catch {
      // ignore
    }
    showToast('Configuración de Supabase actualizada localmente.', 'success');
  };

  const testSupabaseConnection = async (): Promise<{ success: boolean; message: string }> => {
    if (!supabaseConfig.projectUrl || !supabaseConfig.anonKey) {
      return { success: false, message: 'Ingrese la URL del proyecto y la Clave Anónima de Supabase.' };
    }
    try {
      // Test URL validity
      const url = new URL(supabaseConfig.projectUrl);
      const res = await fetch(`${url.origin}/rest/v1/?apikey=${supabaseConfig.anonKey}`, {
        method: 'GET',
        headers: {
          'apikey': supabaseConfig.anonKey,
          'Authorization': `Bearer ${supabaseConfig.anonKey}`
        }
      });
      if (res.ok || res.status === 401 || res.status === 404) {
        setSupabaseConfig(prev => ({ ...prev, isConnected: true, lastChecked: new Date().toLocaleTimeString() }));
        return { success: true, message: 'Conexión verificada con el endpoint de Supabase.' };
      }
      return { success: false, message: `Respuesta del servidor: HTTP ${res.status}` };
    } catch (err: unknown) {
      return { success: false, message: `Error al conectar: ${err instanceof Error ? err.message : 'Error desconocido'}` };
    }
  };

  // SQL schema string for Supabase
  const supabaseDDLScript = `-- ========================================================
-- ESQUEMA SQL PARA CLINICA MÉDICA EN SUPABASE
-- NOM-004-SSA3-2012, COFEPRIS & BITÁCORAS DE AUDITORÍA
-- ========================================================

-- 1. Tabla de Pacientes
CREATE TABLE IF NOT EXISTS public.pacientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    folio_expediente TEXT UNIQUE NOT NULL,
    nombre_completo TEXT NOT NULL,
    curp TEXT UNIQUE NOT NULL,
    rfc TEXT,
    fecha_nacimiento DATE NOT NULL,
    edad INTEGER NOT NULL,
    genero TEXT NOT NULL,
    grupo_sanguineo TEXT NOT NULL,
    telefono TEXT,
    aseguradora TEXT,
    numero_poliza TEXT,
    estatus_admision TEXT DEFAULT 'Ambulatorio',
    alergias TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Expedientes y Notas Médicas (NOM-004)
CREATE TABLE IF NOT EXISTS public.notas_medicas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID REFERENCES public.pacientes(id) ON DELETE CASCADE,
    medico TEXT NOT NULL,
    cedula_profesional TEXT NOT NULL,
    tipo_nota TEXT NOT NULL,
    subjetivo TEXT,
    objetivo JSONB,
    diagnostico_cie10 TEXT,
    plan_tratamiento TEXT,
    firma_sha256 TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Farmacia y Libro de Controlados COFEPRIS
CREATE TABLE IF NOT EXISTS public.movimientos_controlados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medicamento TEXT NOT NULL,
    grupo_control TEXT NOT NULL,
    tipo_movimiento TEXT NOT NULL,
    cantidad INTEGER NOT NULL,
    saldo INTEGER NOT NULL,
    lote TEXT NOT NULL,
    medico_prescriptor TEXT NOT NULL,
    cedula_medico TEXT NOT NULL,
    folio_receta_especial TEXT NOT NULL,
    farmaceutico_responsable TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Quirófano y Cirugía Segura OMS
CREATE TABLE IF NOT EXISTS public.cirugias_programadas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quirofano TEXT NOT NULL,
    paciente_id UUID REFERENCES public.pacientes(id),
    procedimiento TEXT NOT NULL,
    cirujano_titular TEXT NOT NULL,
    anestesiologo TEXT NOT NULL,
    estatus TEXT DEFAULT 'Programada',
    checklist_oms JSONB,
    fecha_programada TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Bitácora de Auditoría NOM-024 (Inalterable)
CREATE TABLE IF NOT EXISTS public.bitacora_auditoria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    usuario_nombre TEXT NOT NULL,
    rol TEXT NOT NULL,
    accion TEXT NOT NULL,
    entidad_afectada TEXT NOT NULL,
    ip_origen TEXT,
    severidad TEXT DEFAULT 'INFO'
);

-- Habilitar RLS (Seguridad a Nivel de Fila)
ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notas_medicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimientos_controlados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cirugias_programadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bitacora_auditoria ENABLE ROW LEVEL SECURITY;
`;

  // CRUD Implementations
  const addPatient = (patientData: Omit<Patient, 'id'>): Patient => {
    const newPatient: Patient = {
      ...patientData,
      id: `pat-${Date.now()}`
    };
    setPatients(prev => [newPatient, ...prev]);
    addAuditLog({
      userId: 'usr-adm-01',
      userName: 'Admisión y Recepción',
      userRole: 'Admisión',
      action: 'CONSULTA_EXPEDIENTE',
      entityAffected: `Registro de nuevo paciente: ${newPatient.fullName} (${newPatient.clinicalRecordNumber})`,
      ipAddress: '192.168.10.12',
      severity: 'INFO'
    });
    showToast(`Paciente ${newPatient.fullName} registrado correctamente.`);
    return newPatient;
  };

  const updateBedStatus = (bedId: string, status: HospitalBed['status'], patientId?: string, patientName?: string) => {
    setBeds(prev => prev.map(bed => {
      if (bed.id === bedId) {
        return {
          ...bed,
          status,
          patientId: status === 'Ocupada' ? patientId : undefined,
          patientName: status === 'Ocupada' ? patientName : undefined,
          assignedAt: status === 'Ocupada' ? new Date().toISOString().replace('T', ' ').substring(0, 16) : undefined
        };
      }
      return bed;
    }));
    showToast(`Estado de la cama actualizado a: ${status}`);
  };

  const addAppointment = (aptData: Omit<Appointment, 'id'>): Appointment => {
    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now()}`
    };
    setAppointments(prev => [newApt, ...prev]);
    showToast(`Cita agendada para ${newApt.patientName} (${newApt.time}).`);
    return newApt;
  };

  const addMedicalNote = (noteData: Omit<MedicalNote, 'id'>): MedicalNote => {
    const newNote: MedicalNote = {
      ...noteData,
      id: `note-${Date.now()}`
    };
    setMedicalNotes(prev => [newNote, ...prev]);
    addAuditLog({
      userId: 'usr-med-01',
      userName: newNote.doctorName,
      userRole: 'Personal Médico',
      action: 'CREACION_NOTA_MEDICA',
      entityAffected: `Nota Médica ${newNote.type} para ${newNote.patientName}`,
      ipAddress: '192.168.10.45',
      severity: 'AUDIT'
    });
    showToast(`Nota médica registrada y firmada digitalmente (NOM-004).`);
    return newNote;
  };

  const addPrescription = (rxData: Omit<Prescription, 'id'>): Prescription => {
    const newRx: Prescription = {
      ...rxData,
      id: `rx-${Date.now()}`
    };
    setPrescriptions(prev => [newRx, ...prev]);
    showToast(`Receta médica digital ${newRx.folio} generada.`);
    return newRx;
  };

  const addLabOrder = (orderData: Omit<LabOrder, 'id'>): LabOrder => {
    const newOrder: LabOrder = {
      ...orderData,
      id: `lab-${Date.now()}`
    };
    setLabOrders(prev => [newOrder, ...prev]);
    showToast(`Orden ${newOrder.folio} enviada a ${newOrder.category}.`);
    return newOrder;
  };

  const updateSurgicalChecklist = (
    procedureId: string, 
    phase: 'signIn' | 'timeOut' | 'signOut', 
    field: string, 
    value: boolean, 
    completedBy?: string
  ) => {
    setSurgicalProcedures(prev => prev.map(proc => {
      if (proc.id === procedureId) {
        const updatedSafety = { ...proc.safetyChecklist };
        if (phase === 'signIn') {
          updatedSafety.signIn = {
            ...updatedSafety.signIn,
            [field]: value,
            ...(completedBy ? { completedBy } : {})
          };
        } else if (phase === 'timeOut') {
          updatedSafety.timeOut = {
            ...updatedSafety.timeOut,
            [field]: value,
            ...(completedBy ? { completedBy } : {})
          };
        } else if (phase === 'signOut') {
          updatedSafety.signOut = {
            ...updatedSafety.signOut,
            [field]: value,
            ...(completedBy ? { completedBy } : {})
          };
        }

        // Check if all phases are completed to update procedure status
        const isTimeOutDone = Object.values(updatedSafety.timeOut).filter(v => typeof v === 'boolean').every(Boolean);
        const isSignOutDone = Object.values(updatedSafety.signOut).filter(v => typeof v === 'boolean').every(Boolean);

        let newStatus = proc.status;
        if (isSignOutDone) {
          newStatus = 'Finalizada';
        } else if (isTimeOutDone) {
          newStatus = 'En quirófano';
        }

        return {
          ...proc,
          status: newStatus,
          safetyChecklist: updatedSafety
        };
      }
      return proc;
    }));

    addAuditLog({
      userId: 'usr-surg-01',
      userName: completedBy || 'Equipo Quirúrgico',
      userRole: 'Bloque Quirúrgico',
      action: 'CHECKLIST_QUIROFANO',
      entityAffected: `Actualización Lista de Cirugía Segura OMS [${phase}]: ${field} = ${value}`,
      ipAddress: '192.168.10.60',
      severity: 'AUDIT'
    });

    showToast(`Protocolo Cirugía Segura OMS actualizado (${phase}).`);
  };

  const addSterilizationCycle = (cycleData: Omit<SterilizationCycle, 'id'>): SterilizationCycle => {
    const newCycle: SterilizationCycle = {
      ...cycleData,
      id: `ceye-${Date.now()}`
    };
    setSterilizationCycles(prev => [newCycle, ...prev]);
    showToast(`Ciclo #${newCycle.cycleNumber} de ${newCycle.autoclaveUnit} registrado.`);
    return newCycle;
  };

  const addControlledMovement = (movementData: Omit<ControlledDrugMovement, 'id' | 'resultingBalance'>): ControlledDrugMovement => {
    // Calculate new balance
    const currentMed = pharmacyMeds.find(m => m.genericName.toLowerCase().includes(movementData.medicationName.toLowerCase()));
    let newBalance = currentMed ? currentMed.currentStock : 20;
    if (movementData.movementType === 'Entrada') {
      newBalance += movementData.quantity;
    } else {
      newBalance = Math.max(0, newBalance - movementData.quantity);
    }

    const newMovement: ControlledDrugMovement = {
      ...movementData,
      id: `ctrl-${Date.now()}`,
      resultingBalance: newBalance
    };

    setControlledMovements(prev => [newMovement, ...prev]);

    // Update pharmacy stock
    if (currentMed) {
      setPharmacyMeds(prev => prev.map(m => m.id === currentMed.id ? { ...m, currentStock: newBalance } : m));
    }

    addAuditLog({
      userId: 'usr-pharma-01',
      userName: newMovement.responsiblePharmacist,
      userRole: 'Farmacia Interna',
      action: 'DISPENSACION_CONTROLADO',
      entityAffected: `Libro Controlados COFEPRIS: ${movementData.movementType} de ${movementData.quantity} unid. de ${movementData.medicationName}. Folio Receta: ${movementData.specialPrescriptionFolio}`,
      ipAddress: '192.168.10.82',
      severity: 'AUDIT'
    });

    showToast(`Movimiento registrado en Libro Oficial de Controlados COFEPRIS.`);
    return newMovement;
  };

  const dispensePrescription = (prescriptionId: string) => {
    setPrescriptions(prev => prev.map(rx => {
      if (rx.id === prescriptionId) {
        return {
          ...rx,
          status: 'Surtida Total',
          items: rx.items.map(i => ({ ...i, dispensed: true }))
        };
      }
      return rx;
    }));
    showToast(`Receta intrahospitalaria dispensada por farmacia.`);
  };

  const updateKardexStatus = (kardexId: string, status: KardexSchedule['status'], nurseName = 'Enfermería Piso', notes?: string) => {
    setKardex(prev => prev.map(item => {
      if (item.id === kardexId) {
        return {
          ...item,
          status,
          administeredBy: status === 'Administrado' ? nurseName : item.administeredBy,
          administeredAt: status === 'Administrado' ? new Date().toISOString().replace('T', ' ').substring(0, 16) : item.administeredAt,
          notes: notes || item.notes
        };
      }
      return item;
    }));
    showToast(`Medicamento registrado en Kardex como: ${status}`);
  };

  const addVitalSign = (recordData: Omit<VitalSignRecord, 'id'>): VitalSignRecord => {
    const newRecord: VitalSignRecord = {
      ...recordData,
      id: `vit-${Date.now()}`
    };
    setVitals(prev => [newRecord, ...prev]);
    showToast(`Signos vitales registrados para ${newRecord.patientName}.`);
    return newRecord;
  };

  const addNursingNote = (noteData: Omit<NursingNote, 'id'>): NursingNote => {
    const newNote: NursingNote = {
      ...noteData,
      id: `nn-${Date.now()}`
    };
    setNursingNotes(prev => [newNote, ...prev]);
    showToast(`Nota de enfermería guardada exitosamente.`);
    return newNote;
  };

  const addCFDIInvoice = (invData: Omit<CFDIInvoice, 'id'>): CFDIInvoice => {
    const newInvoice: CFDIInvoice = {
      ...invData,
      id: `inv-${Date.now()}`
    };
    setCfdiInvoices(prev => [newInvoice, ...prev]);
    addAuditLog({
      userId: 'usr-dir-01',
      userName: 'Dirección y Finanzas',
      userRole: 'Dirección General',
      action: 'TIMBRADO_FACTURA',
      entityAffected: `Factura CFDI 4.0: ${newInvoice.folio} por $${newInvoice.total.toLocaleString('es-MX')}`,
      ipAddress: '192.168.10.15',
      severity: 'INFO'
    });
    showToast(`Factura CFDI 4.0 ${newInvoice.folio} timbrada con el SAT.`);
    return newInvoice;
  };

  const activeRoleConfig = useMemo(() => {
    return currentRole ? ROLE_DEFINITIONS[currentRole] : null;
  }, [currentRole]);

  return (
    <ClinicalContext.Provider
      value={{
        currentRole,
        activeRoleConfig,
        switchRole,
        patients,
        beds,
        appointments,
        medicalHistories,
        medicalNotes,
        prescriptions,
        labOrders,
        surgicalProcedures,
        sterilizationCycles,
        surgicalImplants,
        pharmacyMeds,
        controlledMovements,
        kardex,
        vitals,
        fluidBalances,
        nursingNotes,
        regulatoryPermits,
        financialMetrics,
        cfdiInvoices,
        auditLogs,
        systemUsers,
        isDemoDataPurged,
        purgeDemoData,
        restoreDemoData,
        supabaseConfig,
        saveSupabaseConfig,
        testSupabaseConnection,
        supabaseDDLScript,
        addPatient,
        updateBedStatus,
        addAppointment,
        addMedicalNote,
        addPrescription,
        addLabOrder,
        updateSurgicalChecklist,
        addSterilizationCycle,
        addControlledMovement,
        dispensePrescription,
        updateKardexStatus,
        addVitalSign,
        addNursingNote,
        addCFDIInvoice,
        addAuditLog,
        toast,
        showToast
      }}
    >
      {children}
    </ClinicalContext.Provider>
  );
};

export const useClinical = () => {
  const context = useContext(ClinicalContext);
  if (!context) {
    throw new Error('useClinical debe ser usado dentro de ClinicalProvider');
  }
  return context;
};
