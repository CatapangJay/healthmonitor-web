import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, Subject, switchMap } from 'rxjs';
import { PatientPulse } from '../models/patient-pulse';

@Injectable()
export class HeartrateService {
  private dbPath = '/HeartRates';
  private heartRatesRef: AngularFirestoreCollection<PatientPulse>;
  private queryPulse$;
  private patientPulse$ = new Subject<number>();

  constructor(private db: AngularFirestore) {
    this.heartRatesRef = db.collection(this.dbPath);
    this.queryPulse$ = this.patientPulse$.pipe(
      switchMap(patientId => this.db.collection(this.dbPath, ref => ref.where('patientId', '==', patientId)).valueChanges())
    )
  }

  getAll(): AngularFirestoreCollection<PatientPulse>{
    return this.heartRatesRef;
  }

  getByPatientId(patientId: string): AngularFirestoreCollection<PatientPulse>{
     return this.db.collection<PatientPulse>(
      this.dbPath,
      ref => ref.where('patientId', '==', patientId).orderBy('dateAdded', 'desc').limit(1));
  }

  getAllByPatientId(patientId: string): AngularFirestoreCollection<PatientPulse>{
     return this.db.collection<PatientPulse>(
      this.dbPath,
      ref => ref.where('patientId', '==', patientId).orderBy('dateAdded', 'desc'));
  }
}
