import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';

import { PatientNotif } from '../models/patient-notif';

@Injectable()
export class NotificationService {
  private dbPath = '/Notifications';
  private patientNotifsRef: AngularFirestoreCollection<PatientNotif>;

  constructor(private db: AngularFirestore) {
    this.patientNotifsRef = db.collection(this.dbPath);
  }

  public getAll(): AngularFirestoreCollection<PatientNotif> {
    return this.patientNotifsRef;
  }

  public createPatientNotif(notif: PatientNotif): Promise<DocumentReference<PatientNotif>> {
    notif.dateAdded = new Date();
    return this.patientNotifsRef.add({ ...notif });
  }
}
