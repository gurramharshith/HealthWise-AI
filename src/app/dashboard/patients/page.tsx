
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, collectionGroup } from 'firebase/firestore';
import type { Patient, Diagnosis } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Users } from 'lucide-react';
import { useMemo } from 'react';

const riskVariantMap = {
  Low: 'default',
  Medium: 'secondary',
  High: 'outline',
  Critical: 'destructive',
} as const;

export default function PatientsPage() {
  const firestore = useFirestore();

  const patientsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'patients'), orderBy('lastName')) : null),
    [firestore]
  );
  const { data: patients, isLoading: isLoadingPatients } = useCollection<Patient>(patientsQuery);
  
  const diagnosesQuery = useMemoFirebase(
    () => (firestore ? query(collectionGroup(firestore, 'diagnoses'), orderBy('diagnosisDate', 'desc')) : null),
    [firestore]
  );
  const { data: diagnoses, isLoading: isLoadingDiagnoses } = useCollection<Diagnosis>(diagnosesQuery);

  const latestDiagnosesMap = useMemo(() => {
    if (!diagnoses) return {};
    return diagnoses.reduce((acc, diagnosis) => {
        if (!acc[diagnosis.patientId] || new Date(diagnosis.diagnosisDate) > new Date(acc[diagnosis.patientId].diagnosisDate)) {
            acc[diagnosis.patientId] = diagnosis;
        }
        return acc;
    }, {} as Record<string, Diagnosis>);
  }, [diagnoses]);

  const isLoading = isLoadingPatients || isLoadingDiagnoses;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-lg">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Patients
          </h1>
          <p className="text-muted-foreground">
            A list of all patients in the system.
          </p>
        </div>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>All Patients</CardTitle>
          <CardDescription>
            Click on a patient to view their detailed record.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Latest Diagnosis</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead className="text-right">Last Assessed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-4 w-24 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              {!isLoading &&
                patients?.map((patient) => {
                  const latestDiagnosis = latestDiagnosesMap[patient.id];
                  const fullName = `${patient.firstName} ${patient.lastName}`;

                  return (
                    <TableRow key={patient.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={`https://picsum.photos/seed/${patient.id}/100/100`} data-ai-hint="portrait face" alt={fullName} />
                          <AvatarFallback>
                            {patient.firstName?.charAt(0)}
                            {patient.lastName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{fullName}</TableCell>
                      <TableCell>{latestDiagnosis?.condition || 'N/A'}</TableCell>
                      <TableCell>
                        {latestDiagnosis ? (
                          <Badge variant={riskVariantMap[latestDiagnosis.riskLevel]} className="capitalize w-20 justify-center">
                            {latestDiagnosis.riskLevel.toLowerCase()}
                          </Badge>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {latestDiagnosis ? new Date(latestDiagnosis.diagnosisDate).toLocaleDateString() : 'N/A'}
                      </TableCell>
                    </TableRow>
                  );
                })}
                 {!isLoading && patients?.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">No patients found. Add patient data to Firestore to get started.</TableCell>
                    </TableRow>
                 )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
