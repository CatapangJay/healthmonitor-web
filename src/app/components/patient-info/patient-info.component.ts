import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, map } from 'rxjs';
import { STATUS } from 'src/app/enums/patient.enum';
import { PatientInfo } from 'src/app/models/patient-info';
import { PatientNotif } from 'src/app/models/patient-notif';
import { PatientPulse } from 'src/app/models/patient-pulse';
import { HeartrateService } from 'src/app/services/heartrate.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PatientService } from 'src/app/services/patient.service';
import * as Highcharts from 'highcharts';
import { NgChartsModule } from 'ng2-charts';
import * as moment from 'moment';
import { ChartType } from 'chart.js';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip,
  ApexStroke
} from "ng-apexcharts";

@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.scss']
})
export class PatientInfoComponent implements OnInit {
  patientInfo?: PatientInfo;
  hrHistory: PatientPulse[];
  Highcharts = Highcharts;
  chartConstructor = "chart";
  chartCallback;

  public series: ApexAxisChartSeries;
  public chart: ApexChart;
  public dataLabels: ApexDataLabels;
  public markers: ApexMarkers;
  public title: ApexTitleSubtitle;
  public fill: ApexFill;
  public yaxis: ApexYAxis;
  public xaxis: ApexXAxis;
  public tooltip: ApexTooltip;
  public stroke: ApexStroke;

  constructor(private route: ActivatedRoute,
    private patientService: PatientService,
    private notifService: NotificationService,
    private hrService: HeartrateService) {
    this.initChartData();
  }

  ngOnInit(): void {
    this.route.params.subscribe(p => {
      this.getPatientInfo(p['id']);
      this.getPatientHeartrates(p['id']);
      // this.getPatientNotif(p['id']);
    })
  }

  public initChartData(): void {
    this.stroke = {
      colors: ['red'],
      width: 3
    }
    this.chart = {
      type: "area",
      stacked: false,
      height: 350,
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: "zoom"
      }
    };
    this.dataLabels = {
      enabled: false
    };
    this.markers = {
      size: 0
    };
    this.title = {
      text: "Heart rate Movement",
      align: "left"
    };
    this.fill = {
      colors: ['red'],
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      }
    };
    this.yaxis = {
      labels: {
        formatter: function (val) {
          return (val).toFixed(0);
        }
      },
      title: {
        text: "Heart Rate"
      }
    };
    this.xaxis = {
      type: "datetime"
    };
    this.tooltip = {
      shared: false,
      theme: 'dark',
      y: {
        formatter: function (val) {
          return (val).toFixed(0);
        }
      },
      x: {
        format: "MMM d h:mm TT"
      }
    };
  }

  getPatientInfo(patientId: string) {
    this.patientService.getPatientById(patientId)
      .snapshotChanges().pipe(
        map(c => ({ ...c.payload.data(), Id: c.payload.id })))
      .subscribe({
        next: (data) => {
          this.patientInfo = data;
          this.patientInfo.conditions = this.patientInfo.conditions.filter(c => c !== 'Others')
        }
      })
  }

  getPatientHeartrates(patientId: string) {
    this.hrService.getAllByPatientId(patientId).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ ...c.payload.doc.data(), id: c.payload.doc.id })))
    ).subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.hrHistory = data;

          let dates = [];
          for (let i = 0; i < this.hrHistory.length; i++) {
            dates.push([moment(this.hrHistory[i].dateAdded.toDate()).valueOf(), this.hrHistory[i].pulse]);
          }

          this.series = [
            {
              name: "HEART RATE",
              data: dates
            }
          ];

          if (this.getStatus(data[0].pulse) !== STATUS.FINE) {
            // check last 3 pulses if high or low
            if (data.length >= 3) {
              const allAreHighOrLowValue = data.slice(0, 3).every(p => p.pulse < 60 || p.pulse > 100);

              if (allAreHighOrLowValue) {
                this.checkIfPulseHasNotif(patientId, data[0].id).then(val => {
                  if (!val) {
                    this.notifyPatient(data[0].id, "YOU ARE IN NEED OF MEDICAL ATTENTION!", "Please consult the nearest doctor.");
                  }
                }).catch(err => console.log('Error checking latest notif sync with latest pulse: ' + err))
              }
              else {
                this.checkIfNotifIsCriticalAndNotViewed(patientId, data[0].id).then(val => {
                  if (!val) {
                    this.notifyPatient(data[0].id, "Abnormal heart rate detected", "Please take a rest.");
                  }
                }).catch(err => console.log('Error checking latest notif sync with latest pulse: ' + err))
              }
            }
            else {
              // check if theres already a notif in the time
              this.checkIfPulseHasNotif(patientId, data[0].id).then(val => {
                if (!val) {
                  this.notifyPatient(data[0].id, "Abnormal heart rate detected", "Please take a rest.");
                }
              }).catch(err => console.log('Error checking latest notif sync with latest pulse: ' + err))
            }
          }
          // notify patient if status is not fine
          // if (this.getStatus(data[0].pulse) !== STATUS.FINE) {
          //   // check if theres already a notif in the time
          //   this.checkLatestNotifSyncWithLatestPulse(patientId, data[0].dateAdded.toDate()).then(val => {
          //     if (val) {
          //       this.notifyPatient("Please take a rest.");
          //     }

          //   }).catch(err => console.log('Error checking latest notif sync with latest pulse: ' + err))
          // }
          // this.checkLatestNotifSyncWithLatestPulse(patientId, data[0].dateAdded.toDate()).then(val => {
          //   // notify patient if high or low
          //   if (val && this.getStatus(data[0].pulse) !== STATUS.FINE) {
          //     this.notifyPatient("Please take a rest.");
          //   }

          // }).catch(err => console.log('Error checking latest notif sync with latest pulse: ' + err))
        }
      }
    })
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

  getAge() {
    let timeDiff = Math.abs(Date.now() - this.patientInfo?.BirthDate.toDate().getTime());
    return Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
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

  isWithinFiveSeconds(date1: Date, date2: Date): boolean {
    // Get the number of milliseconds since the Unix epoch for each date
    const time1 = date1.getTime();
    const time2 = date2.getTime();

    // Calculate the absolute difference between the two times
    const diff = Math.abs(time1 - time2);

    // Return true if the difference is less than 5000 (5 seconds in milliseconds)
    return diff < 5000;
  }

  isEmptyOrUndefined(str: string): boolean {
    return str === undefined || str === null || str.length === 0;
  }
}