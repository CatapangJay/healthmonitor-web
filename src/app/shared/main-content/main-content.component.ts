import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { map, Subscription } from 'rxjs';
import { ViewPatientComponent } from 'src/app/components/view-patient/view-patient.component';
import { PatientInfo } from 'src/app/models/patient-info';
import { HeartrateService } from 'src/app/services/heartrate.service';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {
  @ViewChild(ViewPatientComponent) patientModal!: ViewPatientComponent;
  patientsInfo: PatientInfo[];
  pulseSubs: Subscription[] = [];

  constructor(private patientService: PatientService) { }

  ngOnInit(): void {
    this.patientService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ ...c.payload.doc.data(), Id: c.payload.doc.id })))
    ).subscribe(data => {
      this.patientsInfo = data;
    });
  }

  openPatientInfoModal(pinfo: PatientInfo) {
    // this.patientModal.patientInfo = this.patientInfo;
    this.patientModal.initializePatient(pinfo);
    // this.patientModal.getPatientHeartrates();
  }
}
