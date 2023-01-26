import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { PatientNotif } from 'src/app/models/patient-notif';
import { HeartrateService } from 'src/app/services/heartrate.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Timestamp } from '@firebase/firestore-types';
import { ViewPatientComponent } from '../view-patient/view-patient.component';
import { PatientInfo } from 'src/app/models/patient-info';
import { STATUS } from 'src/app/enums/patient.enum';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-patient-card',
  templateUrl: './patient-card.component.html',
  styleUrls: ['./patient-card.component.scss']
})
export class PatientCardComponent implements OnInit {
  @Input() patientId: string;
  @Input() patientName: string;
  @Input() patientInitials: string;
  @Input() imageUrl: string;
  @Input() birthDate: Timestamp;
  @Input() patientInfo: PatientInfo;
  public age: number;
  public pulse: string;
  public receivedPulse: boolean;
  public status: STATUS;
  @ViewChild(ViewPatientComponent) patientModal!: ViewPatientComponent;
  private downloadUrl;
  
  constructor(private heartRateService: HeartrateService,
    private patientService: PatientService,
    private notifService: NotificationService) { }

  ngOnInit(): void {
    this.heartRateService.getAllByPatientId(this.patientId).snapshotChanges().pipe(
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

          this.status = this.getStatus(data[0].pulse);

          // notify patient if status is not fine
          if (this.getStatus(data[0].pulse) !== STATUS.FINE) {
            // check last 3 pulses if high or low
            if (data.length >= 3) {
              const allAreHighOrLowValue = data.slice(0, 3).every(p => p.pulse < 60 || p.pulse > 100);

              if (allAreHighOrLowValue) {
                this.checkIfPulseHasNotif(this.patientId, data[0].id).then(val => {
                  if (!val) {
                    this.notifyPatient(data[0].id, "YOU ARE IN NEED OF MEDICAL ATTENTION!", "Please consult the nearest doctor.");
                  }
                }).catch(err => console.log('Error checking latest notif sync with latest pulse: ' + err))
              }
              else {
                this.checkIfNotifIsCriticalAndNotViewed(this.patientId, data[0].id).then(val => {
                  if (!val) {
                    this.notifyPatient(data[0].id, "Abnormal heart rate detected", "Please take a rest.");
                  }
                }).catch(err => console.log('Error checking latest notif sync with latest pulse: ' + err))
              }
            }
            else {
              // check if theres already a notif in the time
              this.checkIfPulseHasNotif(this.patientId, data[0].id).then(val => {
                if (!val) {
                  this.notifyPatient(data[0].id, "Abnormal heart rate detected", "Please take a rest.");
                }
              }).catch(err => console.log('Error checking latest notif sync with latest pulse: ' + err))
            }
          }
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

  openPatientInfoModal() {
    // this.patientModal.patientInfo = this.patientInfo;
    this.patientModal.initializePatient(this.patientInfo);
    // this.patientModal.getPatientHeartrates();
  }

  notifyPatient(pulseId: string, header: string, message: string) {
    let patientNotif = new PatientNotif();
    patientNotif.patientId = this.patientInfo?.Id;
    patientNotif.pulseId = pulseId;
    patientNotif.header = header;
    patientNotif.message = message;
    // patientNotif.message = "You are in need of medical attention. Go to ER ASAP!";
    patientNotif.alreadyViewed = false;

    this.notifService.upsertPatientNotif(patientNotif)
      .then(res => {
        // alert("alerted patient!");
        // make toast
      })
      .catch(err => {
        // do toast and console log
      });
  }

  async checkIfPulseHasNotif(patientId: string, latestPulseId: string): Promise<boolean> {
    const source$ = this.notifService.getById(patientId).get();

    const notif = await firstValueFrom(source$);

    if (notif === undefined || notif.data() === undefined) return false; // force to create notif

    if (notif.data().pulseId === latestPulseId) {
      return true;
    }

    return false;
  }

  async checkIfNotifIsCriticalAndNotViewed(patientId: string, latestPulseId: string): Promise<boolean> {
    const source$ = this.notifService.getById(patientId).get();

    const notif = await firstValueFrom(source$);

    if (notif === undefined || notif.data() === undefined) return false; // force to create notif

    if (notif.data().pulseId === latestPulseId || (notif.data().header === "YOU ARE IN NEED OF MEDICAL ATTENTION!" && notif.data().alreadyViewed === false)) {
      return true;
    }

    return false;
  }

  isWithinSeconds(date1: Date, date2: Date): boolean {
    // Get the number of milliseconds since the Unix epoch for each date
    const time1 = date1.getTime();
    const time2 = date2.getTime();

    // Calculate the absolute difference between the two times
    const diff = Math.abs(time1 - time2);

    // Return true if the difference is less than 5000 (5 seconds in milliseconds)
    return diff < 10_000;
  }

  private getStatus(pulse: number): STATUS {
    let status = STATUS.FINE;

    if (pulse < 60) status = STATUS.CRITICALLY_LOW;
    else if (pulse > 100) status = STATUS.CRITICALLY_HIGH;

    // if (this.getAge() <= 20) {
    //   if (pulse < 100) status = STATUS.CRITICALLY_LOW;
    //   else if (pulse > 170) status = STATUS.CRITICALLY_HIGH;
    // }
    // else if (this.getAge() > 20 && this.getAge() <= 30) {
    //   if (pulse < 95) status = STATUS.CRITICALLY_LOW;
    //   else if (pulse > 162) status = STATUS.CRITICALLY_HIGH;
    // }
    // else if (this.getAge() > 30 && this.getAge() <= 35) {
    //   if (pulse < 93) status = STATUS.CRITICALLY_LOW;
    //   else if (pulse > 157) status = STATUS.CRITICALLY_HIGH;
    // }
    // else if (this.getAge() > 35 && this.getAge() <= 40) {
    //   if (pulse < 90) status = STATUS.CRITICALLY_LOW;
    //   else if (pulse > 153) status = STATUS.CRITICALLY_HIGH;
    // }
    // else if (this.getAge() > 40 && this.getAge() <= 45) {
    //   if (pulse < 88) status = STATUS.CRITICALLY_LOW;
    //   else if (pulse > 149) status = STATUS.CRITICALLY_HIGH;
    // }
    // else if (this.getAge() > 45 && this.getAge() <= 50) {
    //   if (pulse < 85) status = STATUS.CRITICALLY_LOW;
    //   else if (pulse > 145) status = STATUS.CRITICALLY_HIGH;
    // }
    // else if (this.getAge() > 50 && this.getAge() <= 55) {
    //   if (pulse < 83) status = STATUS.CRITICALLY_LOW;
    //   else if (pulse > 140) status = STATUS.CRITICALLY_HIGH;
    // }
    // else if (this.getAge() > 55 && this.getAge() <= 60) {
    //   if (pulse < 80) status = STATUS.CRITICALLY_LOW;
    //   else if (pulse > 136) status = STATUS.CRITICALLY_HIGH;
    // }
    // else if (this.getAge() > 60 && this.getAge() <= 65) {
    //   if (pulse < 60) status = STATUS.CRITICALLY_LOW;
    //   else if (pulse > 100) status = STATUS.CRITICALLY_HIGH;
    // }
    // else if (this.getAge() > 65 && this.getAge() <= 70) {
    //   if (pulse < 60) status = STATUS.CRITICALLY_LOW;
    //   else if (pulse > 100) status = STATUS.CRITICALLY_HIGH
    // }

    return status;
  }

  isEmptyOrUndefined(str: string): boolean {
    return str === undefined || str.length === 0;
  }

  delete() {
    this.patientService.deletePatient(this.patientId).then(val => {
      console.log('Patient with id ' + this.patientId + ' deleted.')
    });
  }
}