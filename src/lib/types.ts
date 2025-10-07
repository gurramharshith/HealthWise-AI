
export type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  contactNumber?: string;
  email?: string;
  // Fields from mock data that were missing
  name?: string;
  avatarUrl?: string;
  condition?: string;
  riskLevel?: "Low" | "Medium" | "High" | "Critical";
  date?: string;
};

export type Diagnosis = {
  id: string;
  patientId: string;
  diagnosisDate: string;
  condition: string;
  confidenceLevel?: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  notes?: string;
};

export type ConditionDistribution = {
  name: string;
  count: number;
};

export type PatientVitals = {
  date: string;
  heartRate: number;
  bloodPressure: number;
};

export type Alert = {
  id: string;
  patientId: string;
  alertTime: string;
  message: string;
  severity: "High" | "Medium" | "Low";
}
