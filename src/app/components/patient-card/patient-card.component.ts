import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { PatientNotif } from 'src/app/models/patient-notif';
import { HeartrateService } from 'src/app/services/heartrate.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Timestamp } from '@firebase/firestore-types';

@Component({
  selector: 'app-patient-card',
  templateUrl: './patient-card.component.html',
  styleUrls: ['./patient-card.component.scss']
})
export class PatientCardComponent implements OnInit {
  @Input() patientId: string;
  @Input() patientName: string;
  @Input() imageUrl: string;
  @Input() birthDate: Timestamp;
  public age: number;
  public pulse: string;
  public receivedPulse: boolean;
  public status: STATUS;

  constructor(private heartRateService: HeartrateService,
    private notifService: NotificationService) { }

  ngOnInit(): void {
    this.heartRateService.getByPatientId(this.patientId).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })))
    ).subscribe({
      next: (data) => {
        this.receivedPulse = false;
        if (data.length > 0) {
          this.pulse = data[0].pulse.toString();
          this.receivedPulse = true;

          let timeDiff = Math.abs(Date.now() - this.birthDate.toDate().getTime());
          this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);

          this.status = this.getStatus(data[0].pulse)
          setTimeout(() => this.receivedPulse = false, 2000);
        }
        else {
          this.pulse = 'N/A';
          let timeDiff = Math.abs(Date.now() - this.birthDate.toDate().getTime());
          this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
          this.status = STATUS.NO_DATA;
        }
      }
    })
  }

  notifyPatient() {
    let patientNotif = new PatientNotif();
    patientNotif.patientId = this.patientId;
    patientNotif.message = "You are in need of medical attention. Go to ER ASAP!";
    patientNotif.alreadyViewed = false;

    this.notifService.createPatientNotif(patientNotif)
      .then(res => {
        alert("success!");
        // make toast
      })
      .catch(err => {
        // do toast and console log
      });
  }

  private getStatus(pulse: number) : STATUS {
    let status = STATUS.FINE;
    if (this.age <= 20) {
      if (pulse < 100) status = STATUS.CRITICALLY_LOW;
      else if (pulse > 170) status = STATUS.CRITICALLY_HIGH;
    }
    else if (this.age > 20 && this.age <= 30) {
      if (pulse < 95) status = STATUS.CRITICALLY_LOW;
      else if (pulse > 162) status = STATUS.CRITICALLY_HIGH;
    }
    else if (this.age > 30 && this.age <= 35) {
      if (pulse < 93) status = STATUS.CRITICALLY_LOW;
      else if (pulse > 157) status = STATUS.CRITICALLY_HIGH;
    }
    else if (this.age > 35 && this.age <= 40) {
      if (pulse < 90) status = STATUS.CRITICALLY_LOW;
      else if (pulse > 153) status = STATUS.CRITICALLY_HIGH;
    }
    else if (this.age > 40 && this.age <= 45) {
      if (pulse < 88) status = STATUS.CRITICALLY_LOW;
      else if (pulse > 149) status = STATUS.CRITICALLY_HIGH;
    }
    else if (this.age > 45 && this.age <= 50) {
      if (pulse < 85) status = STATUS.CRITICALLY_LOW;
      else if (pulse > 145) status = STATUS.CRITICALLY_HIGH;
    }
    else if (this.age > 50 && this.age <= 55) {
      if (pulse < 83) status = STATUS.CRITICALLY_LOW;
      else if (pulse > 140) status = STATUS.CRITICALLY_HIGH;
    }
    else if (this.age > 55 && this.age <= 60) {
      if (pulse < 80) status = STATUS.CRITICALLY_LOW;
      else if (pulse > 136) status = STATUS.CRITICALLY_HIGH;
    }
    else if (this.age > 60 && this.age <= 65) {
      if (pulse < 78) status = STATUS.CRITICALLY_LOW;
      else if (pulse > 132) status = STATUS.CRITICALLY_HIGH;
    }
    else if (this.age > 65 && this.age <= 70) {
      if (pulse < 75) status = STATUS.CRITICALLY_LOW;
      else if (pulse > 128) status = STATUS.CRITICALLY_HIGH;
    }

    return status;
  }

}

export enum STATUS {
    NO_DATA = "N/A",
    FINE = "FINE",
    CRITICALLY_LOW = "CRITICALLY LOW",
    CRITICALLY_HIGH = "CRITICALLY HIGH"
}