import {
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
  SystemUser
} from '../types/clinical';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-001',
    clinicalRecordNumber: 'EXP-2026-0842',
    fullName: 'María Elena Morales Ruiz',
    curp: 'MORU820514MDFRLA03',
    rfc: 'MORU820514AB2',
    dateOfBirth: '1982-05-14',
    age: 44,
    gender: 'F',
    bloodType: 'O+',
    phone: '55 4321 8765',
    emergencyContact: {
      name: 'Carlos Morales Ruiz (Hermano)',
      relationship: 'Hermano',
      phone: '55 9876 5432'
    },
    insurance: {
      company: 'GNP Seguros',
      policyNumber: 'GNP-MED-99281-A',
      hasPreauthorization: true,
      copayPercentage: 10,
      deductible: 12500,
      status: 'Vigente'
    },
    admissionStatus: 'Hospitalizado',
    assignedBed: 'Cama 204',
    assignedService: 'Pabellón B (Cirugía)',
    treatingDoctor: 'Dra. Sofía Mendoza Alarcón (Cirujana General)',
    allergies: ['Penicilina', 'Sulfas']
  },
  {
    id: 'pat-002',
    clinicalRecordNumber: 'EXP-2026-0791',
    fullName: 'Jorge Armando Trejo Vega',
    curp: 'TRVJ751103HDFRGN09',
    rfc: 'TRVJ751103K71',
    dateOfBirth: '1975-11-03',
    age: 50,
    gender: 'M',
    bloodType: 'A+',
    phone: '55 1234 5678',
    emergencyContact: {
      name: 'Patricia Vega Lara (Esposa)',
      relationship: 'Esposa',
      phone: '55 8765 4321'
    },
    insurance: {
      company: 'AXA Seguros Salud',
      policyNumber: 'AXA-9482103',
      hasPreauthorization: true,
      copayPercentage: 15,
      deductible: 15000,
      status: 'Vigente'
    },
    admissionStatus: 'Hospitalizado',
    assignedBed: 'Cama 102',
    assignedService: 'Pabellón A (Medicina Interna)',
    treatingDoctor: 'Dr. Alejandro Rivas Fuentes (Medicina Interna)',
    allergies: ['Ketorolaco']
  },
  {
    id: 'pat-003',
    clinicalRecordNumber: 'EXP-2026-0914',
    fullName: 'Ana Luisa Beltrán Santos',
    curp: 'BESA930219MDFLNN01',
    rfc: 'BESA9302199J4',
    dateOfBirth: '1993-02-19',
    age: 33,
    gender: 'F',
    bloodType: 'B+',
    phone: '55 6789 0123',
    emergencyContact: {
      name: 'Roberto Beltrán (Padre)',
      relationship: 'Padre',
      phone: '55 3456 7890'
    },
    insurance: {
      company: 'MetLife México',
      policyNumber: 'MET-883019-B',
      hasPreauthorization: false,
      copayPercentage: 10,
      deductible: 10000,
      status: 'En revisión'
    },
    admissionStatus: 'En Urgencias',
    assignedBed: 'Urgencias 03',
    assignedService: 'Urgencias',
    treatingDoctor: 'Dr. Marco Antonio Cárdenas (Urgenciólogo)',
    allergies: ['Ciprofloxacino']
  },
  {
    id: 'pat-004',
    clinicalRecordNumber: 'EXP-2026-0655',
    fullName: 'Guillermo Garza Benítez',
    curp: 'GABG600822HDFRZZ05',
    rfc: 'GABG6008228T9',
    dateOfBirth: '1960-08-22',
    age: 66,
    gender: 'M',
    bloodType: 'AB+',
    phone: '55 9012 3456',
    emergencyContact: {
      name: 'Lucía Garza (Hija)',
      relationship: 'Hija',
      phone: '55 6543 2109'
    },
    insurance: {
      company: 'Seguros Monterrey New York Life',
      policyNumber: 'SMNYL-VIP-4402',
      hasPreauthorization: true,
      copayPercentage: 5,
      deductible: 8000,
      status: 'Vigente'
    },
    admissionStatus: 'Hospitalizado',
    assignedBed: 'UCI 01',
    assignedService: 'UCI (Terapia Intensiva)',
    treatingDoctor: 'Dr. Fernando Quiroz (Intensivista)',
    allergies: ['Ninguna conocida']
  },
  {
    id: 'pat-005',
    clinicalRecordNumber: 'EXP-2026-0988',
    fullName: 'Valeria Castro Domínguez',
    curp: 'CADV980410MDFSMN08',
    dateOfBirth: '1998-04-10',
    age: 28,
    gender: 'F',
    bloodType: 'O-',
    phone: '55 8899 7711',
    emergencyContact: {
      name: 'Carmen Domínguez (Madre)',
      relationship: 'Madre',
      phone: '55 1122 3344'
    },
    insurance: {
      company: 'Mapfre México',
      policyNumber: 'MAP-55219-X',
      hasPreauthorization: true,
      copayPercentage: 10,
      deductible: 11000,
      status: 'Vigente'
    },
    admissionStatus: 'Ambulatorio',
    assignedService: 'Consulta Externa',
    treatingDoctor: 'Dra. Claudia Navarrete (Ginecología)',
    allergies: ['Ibuprofeno']
  }
];

export const INITIAL_BEDS: HospitalBed[] = [
  { id: 'b-101', bedNumber: 'Cama 101', ward: 'Pabellón A (Medicina Interna)', status: 'Disponible' },
  { id: 'b-102', bedNumber: 'Cama 102', ward: 'Pabellón A (Medicina Interna)', status: 'Ocupada', patientId: 'pat-002', patientName: 'Jorge Armando Trejo Vega', assignedAt: '2026-10-11 08:30' },
  { id: 'b-103', bedNumber: 'Cama 103', ward: 'Pabellón A (Medicina Interna)', status: 'En desinfección', notes: 'Desinfección terminal por protocolo' },
  { id: 'b-104', bedNumber: 'Cama 104', ward: 'Pabellón A (Medicina Interna)', status: 'Disponible' },
  { id: 'b-201', bedNumber: 'Cama 201', ward: 'Pabellón B (Cirugía)', status: 'Disponible' },
  { id: 'b-202', bedNumber: 'Cama 202', ward: 'Pabellón B (Cirugía)', status: 'Disponible' },
  { id: 'b-203', bedNumber: 'Cama 203', ward: 'Pabellón B (Cirugía)', status: 'Mantenimiento', notes: 'Revisión técnica de monitor multiparámetro' },
  { id: 'b-204', bedNumber: 'Cama 204', ward: 'Pabellón B (Cirugía)', status: 'Ocupada', patientId: 'pat-001', patientName: 'María Elena Morales Ruiz', assignedAt: '2026-10-12 14:15' },
  { id: 'b-urg-01', bedNumber: 'Urgencias 01', ward: 'Urgencias', status: 'Disponible' },
  { id: 'b-urg-02', bedNumber: 'Urgencias 02', ward: 'Urgencias', status: 'Disponible' },
  { id: 'b-urg-03', bedNumber: 'Urgencias 03', ward: 'Urgencias', status: 'Ocupada', patientId: 'pat-003', patientName: 'Ana Luisa Beltrán Santos', assignedAt: '2026-10-13 09:40' },
  { id: 'b-uci-01', bedNumber: 'UCI 01', ward: 'UCI (Terapia Intensiva)', status: 'Ocupada', patientId: 'pat-004', patientName: 'Guillermo Garza Benítez', assignedAt: '2026-10-10 22:00' },
  { id: 'b-uci-02', bedNumber: 'UCI 02', ward: 'UCI (Terapia Intensiva)', status: 'Disponible' }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-001',
    patientId: 'pat-001',
    patientName: 'María Elena Morales Ruiz',
    doctorName: 'Dra. Sofía Mendoza Alarcón',
    specialty: 'Cirugía General',
    date: '2026-10-13',
    time: '12:30',
    area: 'Quirófano',
    status: 'Confirmada',
    reason: 'Colecistectomía laparoscópica electiva'
  },
  {
    id: 'apt-002',
    patientId: 'pat-005',
    patientName: 'Valeria Castro Domínguez',
    doctorName: 'Dra. Claudia Navarrete',
    specialty: 'Ginecología y Obstetricia',
    date: '2026-10-13',
    time: '15:00',
    area: 'Consultorio 1',
    status: 'Confirmada',
    reason: 'Control prenatal y valoración ecográfica trimestral'
  },
  {
    id: 'apt-003',
    patientId: 'pat-002',
    patientName: 'Jorge Armando Trejo Vega',
    doctorName: 'Dr. Alejandro Rivas Fuentes',
    specialty: 'Medicina Interna',
    date: '2026-10-14',
    time: '10:00',
    area: 'Consultorio 2',
    status: 'Confirmada',
    reason: 'Revisión de glucemia y ajuste de terapia insulínica'
  }
];

export const INITIAL_MEDICAL_HISTORIES: Record<string, MedicalHistory> = {
  'pat-001': {
    patientId: 'pat-001',
    heredofamiliares: 'Madre con Diabetes Mellitus Tipo 2 finada por IAM a los 68 años. Padre con Hipertensión Arterial Sistémica vivo de 74 años.',
    personalesNoPatologicos: 'Habitación urbana con todos los servicios intra e intradomiciliarios. Dieta balanceada 3 veces al día. Tabaquismo y alcoholismo negados. Esquema de vacunación completo.',
    personalesPatologicos: 'Quirúrgicos: Apendicectomía abierta en 2012 sin complicaciones. Alérgicos: Penicilina y Sulfas (reacción urticariforme severa). Transfusionales: Negados.',
    alergiasSeveras: 'PENICILINA, SULFAMIDAS'
  },
  'pat-002': {
    patientId: 'pat-002',
    heredofamiliares: 'Abuelos maternos con Hipertensión y EVC. Hermano con Dislipidemia mixta.',
    personalesNoPatologicos: 'Profesionista administrativo, sedentarismo leve, niega tabaquismo activo.',
    personalesPatologicos: 'Diabetes Mellitus tipo 2 diagnosticada hace 8 años en tratamiento con Metformina e Insulina Glargina. Alergia a Ketorolaco.',
    alergiasSeveras: 'KETOROLACO'
  }
};

export const INITIAL_MEDICAL_NOTES: MedicalNote[] = [
  {
    id: 'note-001',
    patientId: 'pat-001',
    patientName: 'María Elena Morales Ruiz',
    doctorName: 'Dra. Sofía Mendoza Alarcón',
    professionalLicense: 'CED-MED-8491024 / SSA-1192',
    date: '2026-10-12 16:30',
    type: 'Nota de Evolución (SOAP)',
    subjective: 'Paciente femenina de 44 años en su segundo día de internamiento preparatorio. Refiere dolor cólico leve en hipocondrio derecho (EVA 3/10) posterior a ingesta de papilla blanda. Sin náuseas ni emesis en las últimas 12 horas.',
    objective: {
      bloodPressure: '120/75',
      heartRate: 72,
      respiratoryRate: 18,
      temperature: 36.6,
      oxygenSaturation: 98,
      weight: 68.5,
      physicalExam: 'Paciente consciente, orientada en las 3 esferas, adecuada coloración tegumentaria. Tórax normolíneo con murmullo vesicular conservado. Abdomen blando, depresible, dolor leve a la palpación en punto de Murphy, ruidos peristálticos presentes 6x min. Extremidades sin edemas.'
    },
    assessment: 'K80.2 - Cálculo de la vesícula biliar sin colecistitis (Colelitiasis sintomática). Estable hemodinámicamente, programada para colecistectomía laparoscópica.',
    plan: '1. Ayuno a partir de las 22:00 hrs. 2. Solución Fisiológica 0.9% 1000ml a 84 ml/h. 3. Ceftriaxona 1g IV profiláctica prequirúrgica (verificar no alergia a betalactámicos; sustituido por Ciprofloxacino por protocolo). 4. Omeprazol 40mg IV c/24h. 5. Traslado a quirófano programado mañana 12:30 hrs.',
    digitalSignatureHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    id: 'note-002',
    patientId: 'pat-002',
    patientName: 'Jorge Armando Trejo Vega',
    doctorName: 'Dr. Alejandro Rivas Fuentes',
    professionalLicense: 'CED-MED-7391045 / SSA-9081',
    date: '2026-10-13 08:15',
    type: 'Nota de Evolución (SOAP)',
    subjective: 'Masculino de 50 años hospitalizado para control metabólico y descarte de pie diabético infectado. Niega dolor torácico o disnea. Refiere mejoría del edema en tobillo derecho.',
    objective: {
      bloodPressure: '135/85',
      heartRate: 80,
      respiratoryRate: 19,
      temperature: 36.8,
      oxygenSaturation: 96,
      weight: 84.0,
      physicalExam: 'Glucemia capilar matutina en 142 mg/dL. Pulsos periféricos pedios presentes y simétricos. Eritema periungueal en primer ortejo derecho en franca remisión.'
    },
    assessment: 'E11.7 - Diabetes mellitus no insulinodependiente con complicaciones circulatorias periféricas.',
    plan: 'Continuar esquema de Insulina Lispro según escala móvil. Cefalexina 500mg VO c/8h. Curación local diaria.',
    digitalSignatureHash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e'
  }
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-001',
    folio: 'REC-2026-0341',
    patientId: 'pat-001',
    patientName: 'María Elena Morales Ruiz',
    doctorName: 'Dra. Sofía Mendoza Alarcón',
    professionalLicense: 'CED-MED-8491024',
    date: '2026-10-12',
    items: [
      {
        medicationName: 'Omeprazol IV',
        presentation: 'Frasco ámpula 40 mg',
        dosage: '40 mg',
        frequency: 'Cada 24 horas',
        route: 'Intravenosa',
        durationDays: 3,
        dispensed: true
      },
      {
        medicationName: 'Paracetamol IV',
        presentation: 'Solución inyectable 1g / 100ml',
        dosage: '1 g',
        frequency: 'Cada 8 horas por razón necesaria para dolor',
        route: 'Infusión IV en 15 min',
        durationDays: 3,
        dispensed: true
      },
      {
        medicationName: 'Butilhioscina ampolleta',
        presentation: 'Ampolleta 20 mg / 1ml',
        dosage: '20 mg',
        frequency: 'Cada 8 horas en caso de cólico',
        route: 'Intravenosa lenta',
        durationDays: 2,
        dispensed: false
      }
    ],
    instructions: 'Administrar diluido lentamente. Suspender vía oral a partir de las 22:00 horas previas a procedimiento quirúrgico.',
    isControlled: false,
    status: 'Surtida Parcial',
    verificationHash: 'c7f938d21b339487c672b14187e59c02d78b9409'
  },
  {
    id: 'rx-002',
    folio: 'REC-ESP-2026-0089',
    patientId: 'pat-004',
    patientName: 'Guillermo Garza Benítez',
    doctorName: 'Dr. Fernando Quiroz',
    professionalLicense: 'CED-ESP-6601923',
    date: '2026-10-12',
    items: [
      {
        medicationName: 'Fentanilo Inyectable (Grupo I)',
        presentation: 'Ampolleta 0.5 mg / 10 ml',
        dosage: '100 mcg / hora en infusión continua',
        frequency: 'Infusión continua por bomba',
        route: 'Intravenosa central',
        durationDays: 1,
        dispensed: true
      }
    ],
    instructions: 'Monitorización hemodinámica invasiva continua en Terapia Intensiva. Vigilar depresión respiratoria.',
    isControlled: true,
    status: 'Surtida Total',
    verificationHash: '98fae83719bcae91207865239104a378'
  }
];

export const INITIAL_LAB_ORDERS: LabOrder[] = [
  {
    id: 'lab-001',
    folio: 'ORD-LAB-1092',
    patientId: 'pat-001',
    patientName: 'María Elena Morales Ruiz',
    doctorName: 'Dra. Sofía Mendoza Alarcón',
    date: '2026-10-12',
    category: 'Laboratorio Clínico',
    studies: ['Biometría Hemática Completa', 'Química Sanguínea 6 elementos', 'Tiempos de Coagulación (TP, TTP, INR)', 'Pruebas de Función Hepática'],
    priority: 'Urgente',
    status: 'Resultados listos'
  },
  {
    id: 'lab-002',
    folio: 'ORD-IMG-0481',
    patientId: 'pat-001',
    patientName: 'María Elena Morales Ruiz',
    doctorName: 'Dra. Sofía Mendoza Alarcón',
    date: '2026-10-12',
    category: 'Imagenología / Gabinete',
    studies: ['Ultrasonido Hepatobiliar y Vías Biliares con Doppler', 'Tele de Tórax PA'],
    priority: 'Ordinaria',
    status: 'Resultados listos'
  },
  {
    id: 'lab-003',
    folio: 'ORD-LAB-1095',
    patientId: 'pat-003',
    patientName: 'Ana Luisa Beltrán Santos',
    doctorName: 'Dr. Marco Antonio Cárdenas',
    date: '2026-10-13',
    category: 'Laboratorio Clínico',
    studies: ['Biometría Hemática', 'Examen General de Orina', 'Fracción Beta hCG cuantitativa'],
    priority: 'Urgente',
    status: 'En proceso'
  }
];

export const INITIAL_SURGICAL_PROCEDURES: SurgicalProcedure[] = [
  {
    id: 'surg-001',
    operatingRoom: 'Quirófano 2 (Laparoscopía)',
    patientId: 'pat-001',
    patientName: 'María Elena Morales Ruiz',
    scheduledDate: '2026-10-13',
    scheduledTime: '12:30',
    durationEstimatedMinutes: 90,
    procedureName: 'Colecistectomía Laparoscópica de 4 puertos',
    leadSurgeon: 'Dra. Sofía Mendoza Alarcón',
    anesthesiologist: 'Dr. Héctor Galindo (Anestesiólogo)',
    circulatingNurse: 'Enf. Brenda Valenzuela',
    scrubNurse: 'Enf. Quirúrgico Manuel Ortiz',
    status: 'En quirófano',
    safetyChecklist: {
      signIn: {
        patientIdentityConfirmed: true,
        siteMarked: true,
        anesthesiaSafetyCheckCompleted: true,
        pulseOximeterFunctioning: true,
        knownAllergiesReviewed: true,
        difficultAirwayEvaluated: true,
        bloodLossRiskReviewed: true,
        completedBy: 'Enf. Brenda Valenzuela'
      },
      timeOut: {
        teamIntroductionsConfirmed: true,
        patientNameAndProcedureVerballyConfirmed: true,
        criticalEventsAnticipated: true,
        antibioticProphylaxisGivenLast60Min: true,
        essentialImagingDisplayed: true,
        completedBy: 'Dra. Sofía Mendoza Alarcón'
      },
      signOut: {
        nurseConfirmsProcedureRecorded: false,
        instrumentSpongeNeedleCountCorrect: false,
        specimenLabeledCorrectly: false,
        equipmentIssuesAddressed: false,
        postOpRecoveryConcernsReviewed: false,
        completedBy: 'Pendiente al cierre quirúrgico'
      }
    }
  },
  {
    id: 'surg-002',
    operatingRoom: 'Quirófano 1 (Cirugía Mayor)',
    patientId: 'pat-004',
    patientName: 'Guillermo Garza Benítez',
    scheduledDate: '2026-10-14',
    scheduledTime: '08:00',
    durationEstimatedMinutes: 180,
    procedureName: 'Artroplastia Total de Cadera Derecha no cementada',
    leadSurgeon: 'Dr. Rodrigo De la Peña (Traumatólogo)',
    anesthesiologist: 'Dr. Héctor Galindo',
    circulatingNurse: 'Enf. Laura Pineda',
    scrubNurse: 'Enf. Daniel Cruz',
    status: 'Programada',
    safetyChecklist: {
      signIn: {
        patientIdentityConfirmed: true,
        siteMarked: true,
        anesthesiaSafetyCheckCompleted: true,
        pulseOximeterFunctioning: true,
        knownAllergiesReviewed: true,
        difficultAirwayEvaluated: true,
        bloodLossRiskReviewed: true,
        completedBy: 'Pendiente de confirmación pre-operatoria'
      },
      timeOut: {
        teamIntroductionsConfirmed: false,
        patientNameAndProcedureVerballyConfirmed: false,
        criticalEventsAnticipated: false,
        antibioticProphylaxisGivenLast60Min: false,
        essentialImagingDisplayed: false,
        completedBy: ''
      },
      signOut: {
        nurseConfirmsProcedureRecorded: false,
        instrumentSpongeNeedleCountCorrect: false,
        specimenLabeledCorrectly: false,
        equipmentIssuesAddressed: false,
        postOpRecoveryConcernsReviewed: false,
        completedBy: ''
      }
    }
  }
];

export const INITIAL_STERILIZATION_CYCLES: SterilizationCycle[] = [
  {
    id: 'ceye-001',
    autoclaveUnit: 'Autoclave Vapor 01',
    cycleNumber: 1042,
    date: '2026-10-13',
    startTime: '07:30',
    endTime: '08:45',
    temperatureCelsius: 134.2,
    pressurePSI: 30.5,
    biologicalIndicatorResult: 'Negativo (Aprobado)',
    chemicalIndicatorClass5Passed: true,
    operatorName: 'Téc. CEYE Leticia Méndez',
    packagesProcessed: ['Caja Laparoscopía Torre A', 'Equipo Colecistectomía Mayor', 'Bulto de Ropa Quirúrgica Esteril 04'],
    status: 'Liberado'
  },
  {
    id: 'ceye-002',
    autoclaveUnit: 'Plasma Peróxido 01',
    cycleNumber: 521,
    date: '2026-10-13',
    startTime: '09:00',
    endTime: '09:55',
    temperatureCelsius: 55.0,
    pressurePSI: 14.7,
    biologicalIndicatorResult: 'Negativo (Aprobado)',
    chemicalIndicatorClass5Passed: true,
    operatorName: 'Téc. CEYE Leticia Méndez',
    packagesProcessed: ['Óptica Laparoscópica 30° Karl Storz', 'Cable de Luz Fría Fibra Óptica', 'Pinzas Bipolares Selladoras LigaSure'],
    status: 'Liberado'
  }
];

export const INITIAL_IMPLANTS: SurgicalImplant[] = [
  {
    id: 'imp-001',
    name: 'Copa Acetabular Pinnacle Porocoat 54mm',
    type: 'Prótesis',
    manufacturer: 'DePuy Synthes',
    lotNumber: 'DP-2026-9041',
    serialNumber: 'SN-849182049',
    expirationDate: '2029-06-30',
    isSterile: true,
    status: 'En stock estéril'
  },
  {
    id: 'imp-002',
    name: 'Vástago Femoral Corail Tamaño 12 Con Collar',
    type: 'Prótesis',
    manufacturer: 'DePuy Synthes',
    lotNumber: 'DP-2026-7712',
    serialNumber: 'SN-192847110',
    expirationDate: '2028-11-15',
    isSterile: true,
    status: 'En stock estéril'
  },
  {
    id: 'imp-003',
    name: 'Malla Quirúrgica Polipropileno Monofilamento 15x15cm',
    type: 'Malla quirúrgica',
    manufacturer: 'Ethicon',
    lotNumber: 'ET-5519-A',
    serialNumber: 'SN-0091823',
    expirationDate: '2027-08-31',
    isSterile: true,
    status: 'En stock estéril'
  }
];

export const INITIAL_PHARMACY_MEDS: PharmacyMedication[] = [
  {
    id: 'med-001',
    genericName: 'Morfina Sulfato',
    commercialName: 'Graten Solución Inyectable',
    category: 'Analgésicos',
    groupControl: 'Grupo I (Estupefacientes)',
    dosageForm: 'Ampolleta 10mg / 1ml',
    batchNumber: 'LOTE-MOR-2026-09',
    expirationDate: '2027-03-31',
    currentStock: 18,
    minStock: 10,
    maxStock: 50,
    unitPrice: 145.0,
    location: 'Caja Fuerte Farmacia Interna - Gaveta A1',
    isCrashCartStock: false
  },
  {
    id: 'med-002',
    genericName: 'Fentanilo Citrato',
    commercialName: 'Fentanest Ampolleta',
    category: 'Analgésicos',
    groupControl: 'Grupo I (Estupefacientes)',
    dosageForm: 'Ampolleta 0.5mg / 10ml',
    batchNumber: 'LOTE-FNT-9912',
    expirationDate: '2026-12-15', // Proximo a vencer (< 90 dias)
    currentStock: 24,
    minStock: 15,
    maxStock: 80,
    unitPrice: 198.5,
    location: 'Caja Fuerte Farmacia Interna - Gaveta A2',
    isCrashCartStock: true
  },
  {
    id: 'med-003',
    genericName: 'Diazepam',
    commercialName: 'Valium Inyectable',
    category: 'Anestésicos',
    groupControl: 'Grupo II (Psicotrópicos)',
    dosageForm: 'Ampolleta 10mg / 2ml',
    batchNumber: 'LOTE-DZP-4481',
    expirationDate: '2027-09-30',
    currentStock: 45,
    minStock: 20,
    maxStock: 100,
    unitPrice: 62.0,
    location: 'Armario Blindado - Nivel 2',
    isCrashCartStock: true
  },
  {
    id: 'med-004',
    genericName: 'Adrenalina (Epinefrina)',
    commercialName: 'Adrenalina Solución 1:1000',
    category: 'Cardiovasculares',
    groupControl: 'No Controlado',
    dosageForm: 'Ampolleta 1mg / 1ml',
    batchNumber: 'LOTE-EPI-8821',
    expirationDate: '2027-04-10',
    currentStock: 60,
    minStock: 30,
    maxStock: 150,
    unitPrice: 28.0,
    location: 'Carro Rojo Urgencias / Gaveta Medicamentos',
    isCrashCartStock: true
  },
  {
    id: 'med-005',
    genericName: 'Ceftriaxona Sódica',
    commercialName: 'Rocephin IV',
    category: 'Antibióticos',
    groupControl: 'No Controlado',
    dosageForm: 'Frasco ámpula 1g + Diluyente 10ml',
    batchNumber: 'LOTE-CTX-1099',
    expirationDate: '2027-11-20',
    currentStock: 120,
    minStock: 50,
    maxStock: 300,
    unitPrice: 185.0,
    location: 'Estantería B3 - Antibióticos',
    isCrashCartStock: false
  },
  {
    id: 'med-006',
    genericName: 'Solución Fisiológica 0.9%',
    commercialName: 'Solución Cloruro de Sodio 0.9%',
    category: 'Soluciones IV',
    groupControl: 'No Controlado',
    dosageForm: 'Bolsa Flexovalle 1000 ml',
    batchNumber: 'LOTE-CS-78120',
    expirationDate: '2028-02-15',
    currentStock: 240,
    minStock: 100,
    maxStock: 500,
    unitPrice: 42.0,
    location: 'Almacén de Soluciones - Tarima 1',
    isCrashCartStock: true
  },
  {
    id: 'med-007',
    genericName: 'Omeprazol IV',
    commercialName: 'Losec IV',
    category: 'Analgésicos',
    groupControl: 'No Controlado',
    dosageForm: 'Frasco ámpula 40 mg',
    batchNumber: 'LOTE-OMP-3341',
    expirationDate: '2026-11-05', // Crítico (< 30 días)
    currentStock: 35,
    minStock: 40,
    maxStock: 200,
    unitPrice: 94.0,
    location: 'Estantería A1',
    isCrashCartStock: false
  }
];

export const INITIAL_CONTROLLED_MOVEMENTS: ControlledDrugMovement[] = [
  {
    id: 'ctrl-001',
    date: '2026-10-12 11:30',
    medicationName: 'Fentanilo Citrato 0.5mg/10ml',
    group: 'Grupo I',
    movementType: 'Salida',
    quantity: 2,
    resultingBalance: 24,
    batchNumber: 'LOTE-FNT-9912',
    prescribingDoctor: 'Dr. Fernando Quiroz',
    medicalLicense: 'CED-ESP-6601923',
    specialPrescriptionFolio: 'COFEPRIS-ESP-099412',
    responsiblePharmacist: 'Q.F.B. Mariana Echeverría',
    patientName: 'Guillermo Garza Benítez (Cama UCI 01)'
  },
  {
    id: 'ctrl-002',
    date: '2026-10-11 15:45',
    medicationName: 'Morfina Sulfato 10mg/1ml',
    group: 'Grupo I',
    movementType: 'Salida',
    quantity: 1,
    resultingBalance: 18,
    batchNumber: 'LOTE-MOR-2026-09',
    prescribingDoctor: 'Dra. Sofía Mendoza Alarcón',
    medicalLicense: 'CED-MED-8491024',
    specialPrescriptionFolio: 'COFEPRIS-ESP-099388',
    responsiblePharmacist: 'Q.F.B. Mariana Echeverría',
    patientName: 'Paciente post-quirúrgico Sala 2'
  },
  {
    id: 'ctrl-003',
    date: '2026-10-09 10:00',
    medicationName: 'Morfina Sulfato 10mg/1ml',
    group: 'Grupo I',
    movementType: 'Entrada',
    quantity: 15,
    resultingBalance: 19,
    batchNumber: 'LOTE-MOR-2026-09',
    prescribingDoctor: 'Recepción Almacén Especializado',
    medicalLicense: 'LIC-SAN-09-2024-C2',
    specialPrescriptionFolio: 'FACT-PROV-DROGUERIA-4401',
    responsiblePharmacist: 'Q.F.B. Mariana Echeverría'
  }
];

export const INITIAL_KARDEX: KardexSchedule[] = [
  {
    id: 'kdx-001',
    patientId: 'pat-001',
    patientName: 'María Elena Morales Ruiz',
    bedNumber: 'Cama 204',
    medicationName: 'Omeprazol IV 40 mg',
    dose: '40 mg',
    route: 'IV',
    scheduledTime: '08:00',
    status: 'Administrado',
    administeredBy: 'Enf. Patricia Soto',
    administeredAt: '2026-10-13 08:05',
    notes: 'Sin incidentes ni reacciones adversas'
  },
  {
    id: 'kdx-002',
    patientId: 'pat-001',
    patientName: 'María Elena Morales Ruiz',
    bedNumber: 'Cama 204',
    medicationName: 'Solución Fisiológica 0.9%',
    dose: '1000 ml a 84 ml/h',
    route: 'IV',
    scheduledTime: '10:00',
    status: 'Administrado',
    administeredBy: 'Enf. Patricia Soto',
    administeredAt: '2026-10-13 10:00'
  },
  {
    id: 'kdx-003',
    patientId: 'pat-001',
    patientName: 'María Elena Morales Ruiz',
    bedNumber: 'Cama 204',
    medicationName: 'Paracetamol IV 1g',
    dose: '1 g infusión',
    route: 'IV',
    scheduledTime: '14:00',
    status: 'Pendiente'
  },
  {
    id: 'kdx-004',
    patientId: 'pat-002',
    patientName: 'Jorge Armando Trejo Vega',
    bedNumber: 'Cama 102',
    medicationName: 'Insulina Glargina 100 UI/ml',
    dose: '18 UI',
    route: 'SC',
    scheduledTime: '21:00',
    status: 'Pendiente'
  }
];

export const INITIAL_VITALS: VitalSignRecord[] = [
  {
    id: 'vit-001',
    patientId: 'pat-001',
    patientName: 'María Elena Morales Ruiz',
    bedNumber: 'Cama 204',
    recordedAt: '2026-10-13 08:00',
    bloodPressure: '120/75',
    heartRate: 72,
    respiratoryRate: 18,
    temperature: 36.6,
    oxygenSaturation: 98,
    painScaleEva: 2,
    nurseName: 'Enf. Patricia Soto'
  },
  {
    id: 'vit-002',
    patientId: 'pat-002',
    patientName: 'Jorge Armando Trejo Vega',
    bedNumber: 'Cama 102',
    recordedAt: '2026-10-13 07:45',
    bloodPressure: '135/85',
    heartRate: 80,
    respiratoryRate: 19,
    temperature: 36.8,
    oxygenSaturation: 96,
    glucoseLevel: 142,
    painScaleEva: 1,
    nurseName: 'Enf. Miguel Ángel Ramos'
  },
  {
    id: 'vit-003',
    patientId: 'pat-004',
    patientName: 'Guillermo Garza Benítez',
    bedNumber: 'UCI 01',
    recordedAt: '2026-10-13 11:00',
    bloodPressure: '110/68',
    heartRate: 68,
    respiratoryRate: 16,
    temperature: 36.9,
    oxygenSaturation: 99,
    glucoseLevel: 118,
    painScaleEva: 0,
    nurseName: 'Enf. Laura Pineda (UCI)'
  }
];

export const INITIAL_FLUID_BALANCES: FluidBalance[] = [
  {
    id: 'fb-001',
    patientId: 'pat-001',
    date: '2026-10-12',
    intakeIVSolutions: 1500,
    intakeOral: 600,
    intakeMedications: 150,
    outputUrine: 1400,
    outputDrains: 50,
    outputVomit: 0,
    netBalance: 800,
    calculatedBy: 'Enf. Patricia Soto'
  },
  {
    id: 'fb-002',
    patientId: 'pat-004',
    date: '2026-10-12',
    intakeIVSolutions: 2200,
    intakeOral: 0,
    intakeMedications: 300,
    outputUrine: 1950,
    outputDrains: 120,
    outputVomit: 0,
    netBalance: 430,
    calculatedBy: 'Enf. Laura Pineda'
  }
];

export const INITIAL_NURSING_NOTES: NursingNote[] = [
  {
    id: 'nn-001',
    patientId: 'pat-001',
    patientName: 'María Elena Morales Ruiz',
    bedNumber: 'Cama 204',
    date: '2026-10-13 08:30',
    shift: 'Matutino',
    nurseName: 'Enf. Patricia Soto',
    careDetails: 'Se recibe paciente tranquila, consciente y orientada. Vía periférica en miembro torácico izquierdo permeable, sin flebitis ni dolor a la palpación. Se administra medicación de las 08:00 hrs. Ayuno estricto preoperatorio verificado.',
    curationsPerformed: 'Aseo bucal y cambio de apósito en sitio de venopunción.',
    bradenScore: 19, // Riesgo bajo
    morseScore: 15   // Riesgo bajo de caídas
  }
];

export const INITIAL_REGULATORY_PERMITS: RegulatoryPermit[] = [
  {
    id: 'reg-001',
    title: 'Licencia Sanitaria de Hospital y Quirófano',
    type: 'Licencia Sanitaria',
    folioNumber: 'LIC-COFEPRIS-09-014-HOSP',
    issuingAuthority: 'COFEPRIS',
    issueDate: '2024-03-15',
    expirationDate: '2027-03-15',
    status: 'Vigente',
    responsiblePerson: 'Dr. Roberto Carrillo Montero (Director Médico)',
    professionalLicense: 'CED-CIR-5501923'
  },
  {
    id: 'reg-002',
    title: 'Aviso de Responsable Sanitario de Farmacia Interna',
    type: 'Responsable Sanitario',
    folioNumber: 'AV-RESP-SAN-2025-081',
    issuingAuthority: 'COFEPRIS',
    issueDate: '2025-01-10',
    expirationDate: '2027-01-10',
    status: 'Vigente',
    responsiblePerson: 'Q.F.B. Mariana Echeverría',
    professionalLicense: 'CED-QFB-902184'
  },
  {
    id: 'reg-003',
    title: 'Permiso y Licencia de Radiología e Imagen Diagnóstica',
    type: 'Control Radiológico',
    folioNumber: 'CNSNS-RAD-044-2023',
    issuingAuthority: 'Secretaría de Salud',
    issueDate: '2023-11-20',
    expirationDate: '2026-11-20', // Próximo a vencer (< 60 días)
    status: 'Próximo a renovar',
    responsiblePerson: 'Fís. Médico Javier Orozco',
    professionalLicense: 'CED-FIS-340192'
  },
  {
    id: 'reg-004',
    title: 'Registro de Comité Hospitalario de Bioética (CHB)',
    type: 'Comité de Bioética',
    folioNumber: 'CONBIOETICA-09-CEI-2024',
    issuingAuthority: 'Secretaría de Salud',
    issueDate: '2024-06-01',
    expirationDate: '2027-06-01',
    status: 'Vigente',
    responsiblePerson: 'Dra. Elena Vázquez Rosas',
    professionalLicense: 'CED-BIO-771920'
  }
];

export const INITIAL_FINANCIAL_METRICS: FinancialMetric = {
  totalRevenueMonth: 1485600,
  totalExpensesMonth: 942300,
  accountsReceivableInsurers: 620400,
  accountsPayableSuppliers: 315000,
  cashOnHand: 1850000,
  hospitalOccupancyRate: 69.2, // %
  operatingRoomUtilizationRate: 78.5, // %
  averagePatientStayDays: 3.4
};

export const INITIAL_CFDI_INVOICES: CFDIInvoice[] = [
  {
    id: 'inv-001',
    folio: 'CFDI-HOSP-2026-0812',
    uuid: '7A8B9C0D-1E2F-4A3B-8C9D-0E1F2A3B4C5D',
    patientName: 'María Elena Morales Ruiz',
    rfc: 'MORU820514AB2',
    issueDate: '2026-10-12',
    total: 34500.0,
    status: 'Timbrada (SAT)',
    concept: 'Atención Médica Integral',
    hasHealthSupplement: true
  },
  {
    id: 'inv-002',
    folio: 'CFDI-HOSP-2026-0811',
    uuid: '3F4E5D6C-7B8A-9F0E-1D2C-3B4A5F6E7D8C',
    patientName: 'AXA Seguros S.A. de C.V. (F/A Trejo Vega)',
    rfc: 'ASE931116231',
    issueDate: '2026-10-11',
    total: 58200.0,
    status: 'Timbrada (SAT)',
    concept: 'Estancia Hospitalaria',
    hasHealthSupplement: true
  },
  {
    id: 'inv-003',
    folio: 'CFDI-HOSP-2026-0810',
    uuid: '9A0B1C2D-3E4F-5A6B-7C8D-9E0F1A2B3C4D',
    patientName: 'Guillermo Garza Benítez',
    rfc: 'GABG6008228T9',
    issueDate: '2026-10-10',
    total: 92800.0,
    status: 'Timbrada (SAT)',
    concept: 'Honorarios Quirúrgicos',
    hasHealthSupplement: true
  }
];

export const INITIAL_AUDIT_LOGS: SystemAuditLog[] = [
  {
    id: 'log-001',
    timestamp: '2026-10-13 11:20:14',
    userId: 'usr-med-01',
    userName: 'Dra. Sofía Mendoza Alarcón',
    userRole: 'Personal Médico',
    action: 'CONSULTA_EXPEDIENTE',
    entityAffected: 'EXP-2026-0842 (María Elena Morales Ruiz)',
    ipAddress: '192.168.10.45',
    severity: 'INFO'
  },
  {
    id: 'log-002',
    timestamp: '2026-10-13 10:48:32',
    userId: 'usr-pharma-01',
    userName: 'Q.F.B. Mariana Echeverría',
    userRole: 'Farmacia Interna',
    action: 'DISPENSACION_CONTROLADO',
    entityAffected: 'Fentanilo 0.5mg/10ml - Folio COFEPRIS-ESP-099412',
    ipAddress: '192.168.10.82',
    severity: 'AUDIT'
  },
  {
    id: 'log-003',
    timestamp: '2026-10-13 09:15:02',
    userId: 'usr-surg-01',
    userName: 'Enf. Brenda Valenzuela',
    userRole: 'Bloque Quirúrgico',
    action: 'CHECKLIST_QUIROFANO',
    entityAffected: 'Hoja Cirugía Segura OMS - Quirófano 2 Fase Entrada',
    ipAddress: '192.168.10.60',
    severity: 'AUDIT'
  },
  {
    id: 'log-004',
    timestamp: '2026-10-13 08:32:11',
    userId: 'usr-nurse-01',
    userName: 'Enf. Patricia Soto',
    userRole: 'Enfermería y Servicios Auxiliares',
    action: 'MODIFICACION_KARDEX',
    entityAffected: 'Kardex Cama 204 - Dosis Omeprazol 40mg administrada',
    ipAddress: '192.168.10.71',
    severity: 'INFO'
  },
  {
    id: 'log-005',
    timestamp: '2026-10-13 08:00:00',
    userId: 'usr-adm-01',
    userName: 'Lic. Mónica Arriaga',
    userRole: 'Admisión y Recepción',
    action: 'ACCESO_SISTEMA',
    entityAffected: 'Inicio de turno matutino recepción',
    ipAddress: '192.168.10.12',
    severity: 'INFO'
  }
];

export const INITIAL_SYSTEM_USERS: SystemUser[] = [
  {
    id: 'usr-dir-01',
    fullName: 'Dr. Roberto Carrillo Montero',
    username: 'rcarrillo',
    role: 'director',
    professionalLicense: 'CED-CIR-5501923',
    active: true,
    lastLogin: '2026-10-13 07:15',
    permissions: {
      canViewMedicalRecords: true,
      canEditMedicalRecords: false,
      canDispensePharmacy: false,
      canManageControlledDrugs: true,
      canSignSurgicalChecklist: false,
      canManageBilling: true,
      canManageSystemConfig: true
    }
  },
  {
    id: 'usr-adm-01',
    fullName: 'Lic. Mónica Arriaga',
    username: 'marriaga',
    role: 'admission',
    active: true,
    lastLogin: '2026-10-13 08:00',
    permissions: {
      canViewMedicalRecords: false,
      canEditMedicalRecords: false,
      canDispensePharmacy: false,
      canManageControlledDrugs: false,
      canSignSurgicalChecklist: false,
      canManageBilling: false,
      canManageSystemConfig: false
    }
  },
  {
    id: 'usr-med-01',
    fullName: 'Dra. Sofía Mendoza Alarcón',
    username: 'smendoza',
    role: 'medical',
    professionalLicense: 'CED-MED-8491024',
    active: true,
    lastLogin: '2026-10-13 11:20',
    permissions: {
      canViewMedicalRecords: true,
      canEditMedicalRecords: true,
      canDispensePharmacy: false,
      canManageControlledDrugs: true,
      canSignSurgicalChecklist: true,
      canManageBilling: false,
      canManageSystemConfig: false
    }
  },
  {
    id: 'usr-surg-01',
    fullName: 'Enf. Brenda Valenzuela',
    username: 'bvalenzuela',
    role: 'surgical',
    professionalLicense: 'CED-ENF-774102',
    active: true,
    lastLogin: '2026-10-13 09:10',
    permissions: {
      canViewMedicalRecords: true,
      canEditMedicalRecords: false,
      canDispensePharmacy: false,
      canManageControlledDrugs: false,
      canSignSurgicalChecklist: true,
      canManageBilling: false,
      canManageSystemConfig: false
    }
  },
  {
    id: 'usr-pharma-01',
    fullName: 'Q.F.B. Mariana Echeverría',
    username: 'mecheverria',
    role: 'pharmacy',
    professionalLicense: 'CED-QFB-902184',
    active: true,
    lastLogin: '2026-10-13 10:45',
    permissions: {
      canViewMedicalRecords: false,
      canEditMedicalRecords: false,
      canDispensePharmacy: true,
      canManageControlledDrugs: true,
      canSignSurgicalChecklist: false,
      canManageBilling: false,
      canManageSystemConfig: false
    }
  },
  {
    id: 'usr-nurse-01',
    fullName: 'Enf. Patricia Soto',
    username: 'psoto',
    role: 'nursing',
    professionalLicense: 'CED-ENF-881290',
    active: true,
    lastLogin: '2026-10-13 08:30',
    permissions: {
      canViewMedicalRecords: true,
      canEditMedicalRecords: false,
      canDispensePharmacy: false,
      canManageControlledDrugs: false,
      canSignSurgicalChecklist: true,
      canManageBilling: false,
      canManageSystemConfig: false
    }
  },
  {
    id: 'usr-tech-01',
    fullName: 'Ing. David Villaseñor (Admin TI)',
    username: 'dvillasenor',
    role: 'tech',
    active: true,
    lastLogin: '2026-10-13 11:25',
    permissions: {
      canViewMedicalRecords: true,
      canEditMedicalRecords: true,
      canDispensePharmacy: true,
      canManageControlledDrugs: true,
      canSignSurgicalChecklist: true,
      canManageBilling: true,
      canManageSystemConfig: true
    }
  }
];
