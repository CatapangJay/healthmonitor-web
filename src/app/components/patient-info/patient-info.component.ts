import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { PatientInfo } from 'src/app/models/patient-info';
import { PatientPulse } from 'src/app/models/patient-pulse';
import { HeartrateService } from 'src/app/services/heartrate.service';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.scss']
})
export class PatientInfoComponent implements OnInit {
  patientInfo?: PatientInfo;
  hrHistory: PatientPulse[];

  constructor(private route: ActivatedRoute,
    private patientService: PatientService,
    private hrService: HeartrateService) { }

  ngOnInit(): void {
    this.route.params.subscribe(p => {
      this.getPatientInfo(p['id']);
      this.getPatientHeartrates(p['id']);
    })
  }

  getPatientInfo(patientId: string) {
    this.patientService.getPatientById(patientId)
      .snapshotChanges().pipe(
        map(c => ({ ...c.payload.data(), Id: c.payload.id })))
      .subscribe({
        next: (data) => {
          this.patientInfo = data;
        }
      })
  }

  getPatientHeartrates(patientId: string) {
    this.hrService.getAllByPatientId(patientId).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ ...c.payload.doc.data() })))
    ).subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.hrHistory = data
        }
      }
    })
  }

  getAge() {
    let timeDiff = Math.abs(Date.now() - this.patientInfo.BirthDate.toDate().getTime());
    return Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
  }

  isEmptyOrUndefined(str: string): boolean {
    return str === undefined || str.length === 0;
  }
}
