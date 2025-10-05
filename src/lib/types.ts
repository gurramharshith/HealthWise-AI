
export type Patient = {
    id: string;
    name: string;
    avatarUrl: string;
    condition: string;
    riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
    date: string;
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
