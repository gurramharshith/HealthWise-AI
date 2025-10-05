
import { PlaceHolderImages } from "./placeholder-images";
import type { Patient, ConditionDistribution, PatientVitals } from "./types";

const patientAvatars = PlaceHolderImages.filter(img => img.id.startsWith("patient-avatar"));

export const mockPatients: Patient[] = [
  {
    id: 'PAT001',
    name: 'John Doe',
    avatarUrl: patientAvatars[0]?.imageUrl || '',
    condition: 'Potential Cardiac Anomaly',
    riskLevel: 'High',
    date: '2024-07-21',
  },
  {
    id: 'PAT002',
    name: 'Jane Smith',
    avatarUrl: patientAvatars[1]?.imageUrl || '',
    condition: 'Clear',
    riskLevel: 'Low',
    date: '2024-07-21',
  },
  {
    id: 'PAT003',
    name: 'Robert Johnson',
    avatarUrl: patientAvatars[2]?.imageUrl || '',
    condition: 'Diabetic Retinopathy',
    riskLevel: 'Medium',
    date: '2024-07-20',
  },
  {
    id: 'PAT004',
    name: 'Emily Williams',
    avatarUrl: patientAvatars[3]?.imageUrl || '',
    condition: 'Early-stage Pneumonia',
    riskLevel: 'Critical',
    date: '2024-07-20',
  },
];

export const mockConditionDistribution: ConditionDistribution[] = [
  { name: 'Cardiac', count: 45 },
  { name: 'Pulmonary', count: 30 },
  { name: 'Neurological', count: 15 },
  { name: 'Diabetic', count: 25 },
  { name: 'Oncological', count: 10 },
];

export const mockPatientVitals: PatientVitals[] = [
    { date: 'Jul 15', heartRate: 72, bloodPressure: 120 },
    { date: 'Jul 16', heartRate: 75, bloodPressure: 122 },
    { date: 'Jul 17', heartRate: 78, bloodPressure: 125 },
    { date: 'Jul 18', heartRate: 74, bloodPressure: 118 },
    { date: 'Jul 19', heartRate: 80, bloodPressure: 128 },
    { date: 'Jul 20', heartRate: 82, bloodPressure: 130 },
    { date: 'Jul 21', heartRate: 79, bloodPressure: 126 },
];

export const mockDashboardStats = {
    totalPatients: 1254,
    highRiskAlerts: 12,
    imagesAnalyzed: 342,
};
