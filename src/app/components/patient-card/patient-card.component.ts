import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { PatientNotif } from 'src/app/models/patient-notif';
import { HeartrateService } from 'src/app/services/heartrate.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-patient-card',
  templateUrl: './patient-card.component.html',
  styleUrls: ['./patient-card.component.scss']
})
export class PatientCardComponent implements OnInit {
  @Input() patientId: string;
  @Input() patientName: string;
  @Input() imageUrl: string;
  public pulse: string;
  public receivedPulse: boolean;

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
          setTimeout(() => this.receivedPulse = false, 2000);
        }
        else {
          this.pulse = 'N/A';
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
}
