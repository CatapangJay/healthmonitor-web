import { Timestamp } from "@angular/fire/firestore";

export interface PatientPulse {
    patientId: string;
    pulse: number;
    dateAdded: Timestamp;
}