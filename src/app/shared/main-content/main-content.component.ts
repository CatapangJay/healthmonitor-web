import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { map, Subscription } from 'rxjs';
import { STATUS } from 'src/app/components/patient-card/patient-card.component';
import { ViewPatientComponent } from 'src/app/components/view-patient/view-patient.component';
import { PatientInfo } from 'src/app/models/patient-info';
import { HeartrateService } from 'src/app/services/heartrate.service';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'main [app-main-content]',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {
  @ViewChild(ViewPatientComponent) patientModal!: ViewPatientComponent;
  patientsInfo: PatientInfo[];
  pulseSubs: Subscription[] = [];

  constructor(private patientService: PatientService,
    private heartRateService: HeartrateService) { }

  ngOnInit(): void {
    this.patientService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ ...c.payload.doc.data(), Id: c.payload.doc.id })))
    ).subscribe(data => {
      this.patientsInfo = data;
    });
  }

  getAge(birthDate: Date): number {
    let timeDiff = Math.abs(Date.now() - birthDate.getTime());
    return Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
  }

  getPulse(patientId: string) {
    this.heartRateService.getByPatientId(patientId).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })))
    ).subscribe({
      next: (data) => {
        if (data.length > 0) {
          setTimeout(() => {}, 2000);
          return data[0].pulse.toString();
          // setTimeout(() => this.receivedPulse = false, 2000);
        }
        else {
          return 'N/A';
        }
      }
    });
    // this.pulseSubs.push(this.heartRateService.getByPatientId(patientId).snapshotChanges().pipe(
    //   map(changes =>
    //     changes.map(c =>
    //       ({ id: c.payload.doc.id, ...c.payload.doc.data() })))
    // ).subscribe({
    //   next: (data) => {
    //     if (data.length > 0) {
    //       setTimeout(() => {}, 2000);
    //       return data[0].pulse.toString();
    //       // setTimeout(() => this.receivedPulse = false, 2000);
    //     }
    //     else {
    //       return 'N/A';
    //     }
    //   }
    // }));
  }

  isEmptyOrUndefined(str: string): boolean {
    return str === undefined || str.length === 0;
  }

  openPatientInfoModal(pinfo: PatientInfo) {
    // this.patientModal.patientInfo = this.patientInfo;
    this.patientModal.initializePatient(pinfo);
    // this.patientModal.getPatientHeartrates();
  }

  private getStatus(age: number, pulse: number): STATUS {
    let status = STATUS.FINE;
    if (age <= 20) {
      if (pulse < 100) status = STATUS.CRITICALLY_LOW;
      else if (pulse > 170) status = STATUS.CRITICALLY_HIGH;
    }
    else if (age > 20 && age <= 30) {
      if (pulse < 95) status = STATUS.CRITICALLY_LOW;
      else if (pulse > 162) status = STATUS.CRITICALLY_HIGH;
    }
    else if (age > 30 && age <= 35) {
      if (pulse < 93) status = STATUS.CRITICALLY_LOW;
      else if (pulse > 157) status = STATUS.CRITICALLY_HIGH;
    }
    else if (age > 35 && age <= 40) {
      if (pulse < 90) status = STATUS.CRITICALLY_LOW;
      else if (pulse > 153) status = STATUS.CRITICALLY_HIGH;
    }
    else if (age > 40 && age <= 45) {
      if (pulse < 88) status = STATUS.CRITICALLY_LOW;
      else if (pulse > 149) status = STATUS.CRITICALLY_HIGH;
    }
    else if (age > 45 && age <= 50) {
      if (pulse < 85) status = STATUS.CRITICALLY_LOW;
      else if (pulse > 145) status = STATUS.CRITICALLY_HIGH;
    }
    else if (age > 50 && age <= 55) {
      if (pulse < 83) status = STATUS.CRITICALLY_LOW;
      else if (pulse > 140) status = STATUS.CRITICALLY_HIGH;
    }
    else if (age > 55 && age <= 60) {
      if (pulse < 80) status = STATUS.CRITICALLY_LOW;
      else if (pulse > 136) status = STATUS.CRITICALLY_HIGH;
    }
    else if (age > 60 && age <= 65) {
      if (pulse < 60) status = STATUS.CRITICALLY_LOW;
      else if (pulse > 100) status = STATUS.CRITICALLY_HIGH;
    }
    else if (age > 65 && age <= 70) {
      if (pulse < 60) status = STATUS.CRITICALLY_LOW;
      else if (pulse > 100) status = STATUS.CRITICALLY_HIGH
    }

    return status;
  }
}
