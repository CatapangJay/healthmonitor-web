import { Timestamp } from "@angular/fire/firestore";

export class PatientNotif {
    patientId: string;
    pulseId: string;
    header: string;
    message: string;
    dateUpdated: Timestamp;
    alreadyViewed: boolean;
}