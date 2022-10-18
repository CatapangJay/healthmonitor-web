import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PatientInfo } from 'src/app/models/patient-info';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'main [app-main-content]',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {
  patientsInfo: PatientInfo[];

  constructor(private patientService: PatientService) { }

  ngOnInit(): void {
    this.patientService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ Id: c.payload.doc.id, ...c.payload.doc.data() })))
    ).subscribe(data => {
      this.patientsInfo = data;
    });
  }

}
