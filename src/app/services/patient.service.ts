import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';

import { from, Observable, switchMap } from 'rxjs';
import { PatientInfo } from '../models/patient-info';

export interface FilesUploadMetadata {
  uploadProgress$: Observable<number>;
  downloadUrl$: Observable<string>;
}

@Injectable()
export class PatientService {
  private dbPath = '/Patients';
  private patientsRef: AngularFirestoreCollection<PatientInfo>;

  constructor(private db: AngularFirestore, private storage: AngularFireStorage) {
    this.patientsRef = db.collection(this.dbPath);
  }

  public getAll(): AngularFirestoreCollection<PatientInfo> {
    return this.patientsRef;
  }

  public getPatientById(id: string) {
    return this.patientsRef.doc(id);
  }

  public createPatient(patient: PatientInfo) {
    return this.patientsRef.add({ ...patient });
  }

  public deletePatient(patientId: string) {
    return this.patientsRef.doc(patientId).delete();
  }

  public async upsertPatient(patient: PatientInfo, uploadFile: File = null): Promise<void> {
    if (uploadFile != null) {
      const path = `images/${patient.Id}.jpg`;
      const ref = this.storage.ref(path);
      const task = ref.put(uploadFile);

      await task;
      ref.getDownloadURL().subscribe(url => {
        patient.ImageUrl = url;
        return this.patientsRef.doc(patient.Id).set({ ...patient });
      });
    }
    else {
      return this.patientsRef.doc(patient.Id).set({ ...patient });
    }
  }

  public getDownloadUrl(patientId) {
    return this.storage.ref(`/images/${patientId}.jpg`).getDownloadURL();
  }
}
