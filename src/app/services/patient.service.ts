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

  public deletePatient(patientId: string){
    return this.patientsRef.doc(patientId).delete();
  }

  public upsertPatient(patient: PatientInfo): Promise<void> {
    return this.patientsRef.doc(patient.Id).set({ ...patient });
  }
}
