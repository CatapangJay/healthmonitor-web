import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { PatientInfo } from 'src/app/models/patient-info';
import { PatientPulse } from 'src/app/models/patient-pulse';
import { HeartrateService } from 'src/app/services/heartrate.service';

@Component({
  selector: 'app-view-patient',
  templateUrl: './view-patient.component.html',
  styleUrls: ['./view-patient.component.scss']
})
export class ViewPatientComponent implements OnInit {
  @Input() patientInfo: PatientInfo;
  // hrHistory: PatientPulse[];

  constructor() { }
  // constructor(private hrService: HeartrateService) { }

  ngOnInit(): void {
  }

  initializePatient(pinfo: PatientInfo) {
    this.patientInfo = pinfo;
  }

  // getPatientHeartrates() {
  //   this.hrService.getAllByPatientId(this.patientInfo?.Id).snapshotChanges().pipe(
  //     map(changes =>
  //       changes.map(c =>
  //         ({ ...c.payload.doc.data() })))
  //   ).subscribe({
  //     next: (data) => {
  //       if (data.length > 0) {
  //         this.hrHistory = data
  //       }
  //     }
  //   })
  // }
}
