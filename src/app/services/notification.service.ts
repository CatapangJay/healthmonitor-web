import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/compat/firestore';
import { Timestamp } from '@angular/fire/firestore';

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

  public getById(id: string): AngularFirestoreDocument<PatientNotif> {
    return this.patientNotifsRef.doc(id);
  }

  public createPatientNotif(notif: PatientNotif): Promise<DocumentReference<PatientNotif>> {
    notif.dateUpdated = Timestamp.fromDate(new Date());
    return this.patientNotifsRef.add({ ...notif });
  }

  public upsertPatientNotif(notif: PatientNotif): Promise<void> {
    notif.dateUpdated = Timestamp.fromDate(new Date());
    return this.patientNotifsRef.doc(notif.patientId).set({ ...notif });
  }
}
