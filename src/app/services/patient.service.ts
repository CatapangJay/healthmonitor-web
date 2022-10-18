import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { PatientInfo } from '../models/patient-info';

@Injectable()
export class PatientService {
  private dbPath = '/Patients';
  private patientsRef: AngularFirestoreCollection<PatientInfo>;

  constructor(private db: AngularFirestore) {
    this.patientsRef = db.collection(this.dbPath);
   }

  public getAll(): AngularFirestoreCollection<PatientInfo> {
    return this.patientsRef;
  }

  public getPatientById(id:number) {

  }
}
