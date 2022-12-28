import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

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

  public getPatientById(id:string) {
    return this.patientsRef.doc(id);
  }

  public createPatient(patient: PatientInfo){
    return this.patientsRef.add({...patient});
  }
}
