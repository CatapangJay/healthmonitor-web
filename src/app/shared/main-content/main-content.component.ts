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
  filteredPatients: PatientInfo[] = [];
  pulseSubs: Subscription[] = [];
  selectedSexFilter: String = '';
  selectedAgeFilter: String = '';
  exactAgeFilter: number;
  startAgeFilter: number;
  endAgeFilter: number;
  hasFilter: boolean = false;

  conditions = [
    { name: 'Hypertension', checked: false },
    { name: 'Ischemic Heart Disease', checked: false },
    { name: 'Congestive Heart Failure', checked: false },
    { name: 'Stroke', checked: false },
    { name: 'Diabetes', checked: false },
    { name: 'Thyroid Disease', checked: false },
    { name: 'Coronary Artery Disease', checked: false },
    { name: 'Chronic Kidney Disease', checked: false },
    { name: 'Others', checked: false },
  ];
  selectedConditions: string[] = [];
  otherConditions: string = '';

  constructor(private patientService: PatientService) { }

  ngOnInit(): void {
    this.patientService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ ...c.payload.doc.data(), Id: c.payload.doc.id })))
    ).subscribe(data => {
      this.patientsInfo = data;
      this.filteredPatients = data;

      if (this.hasFilter) {
        this.submitFilter();
      }
    });
  }

  openPatientInfoModal(pinfo: PatientInfo) {
    // this.patientModal.patientInfo = this.patientInfo;
    this.patientModal.initializePatient(pinfo);
    // this.patientModal.getPatientHeartrates();
  }

  submitFilter() {
    this.filteredPatients = this.patientsInfo;

    if (this.selectedSexFilter !== '') {
      if (this.selectedSexFilter !== 'Both') {
        this.filteredPatients = this.filteredPatients.filter(p => p.Sex.toLowerCase() === this.selectedSexFilter.toLowerCase())
      }
    }

    if (this.selectedAgeFilter === 'Exact') {
      this.filteredPatients = this.filteredPatients.filter(p => this.getAge(p.BirthDate.toDate()) === this.exactAgeFilter)
    }
    else if (this.selectedAgeFilter === 'Range') {
      this.filteredPatients = this.filteredPatients.filter(p => this.getAge(p.BirthDate.toDate()) >= this.startAgeFilter && this.getAge(p.BirthDate.toDate()) <= this.endAgeFilter)
    }

    if (this.selectedConditions?.length > 0) {
      this.filteredPatients = this.filteredPatients.filter(p => p.conditions !== undefined && p.conditions.some(c => this.selectedConditions.includes(c)));
    }

    if (this.otherConditions !== '') {
      this.filteredPatients = this.filteredPatients.filter(p => p.otherConditions !== undefined && p.otherConditions.some(c => this.otherConditions.split(',').map(o => o.trim().toLowerCase()).includes(c.toLowerCase())));
    }
  }

  clearFilters() {
    this.filteredPatients = this.patientsInfo;
  }

  onChange(condition) {
    if (condition.checked) {
      this.selectedConditions.push(condition.name);
    } else {
      this.selectedConditions = this.selectedConditions.filter(f => f !== condition.name);
    }
  }

  checkOtherCondition() {
    return this.selectedConditions.includes("Others");
  }


  getAge(birthDate: Date): number {
    let timeDiff = Math.abs(Date.now() - birthDate.getTime());
    return Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
  }
}
