import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { PatientInfo } from 'src/app/models/patient-info';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.scss']
})
export class EditPatientComponent implements OnInit {
  private patientId: string;
  
  patientForm = this.fb.group({
    firstName: ['', Validators.required],
    middleName: ['', Validators.required],
    lastName: ['', Validators.required],
    birthdate: ['', Validators.required],
    patientImg: [''],
    address: ['', Validators.required],
    email: ['', Validators.required],
    contactno: ['', Validators.required],
  });

  constructor(private route: ActivatedRoute, private datePipe: DatePipe,
    private fb: FormBuilder,
    private patientService: PatientService) { }

  ngOnInit(): void {
    this.route.params.subscribe(p => {
      this.patientId = p['id'];
      this.getPatientInfo(p['id']);
      // this.getPatientNotif(p['id']);
    })
  }

  getPatientInfo(patientId: string) {
    this.patientService.getPatientById(patientId)
      .snapshotChanges().pipe(
        map(c => ({ ...c.payload.data(), Id: c.payload.id })))
      .subscribe({
        next: (data) => {
          let formVal = {
            firstName: data.Firstname,
            middleName: data.Middlename,
            lastName: data.Lastname,
            birthdate: this.datePipe.transform(data?.BirthDate.toDate(),"yyyy-MM-dd"),
            // birthdate: data.BirthDate.toDate().toDateString("yyyy-MM-dd"),
            patientImg: data?.ImageUrl ?? '',
            address: data?.address ?? '',
            email: data?.email ?? '',
            contactno: data?.phoneNumber ?? '',
          }
          this.patientForm.setValue(formVal);
        }
      })
  }

  get firstName() {
    return this.patientForm.get("firstName");
  }

  get middleName() {
    return this.patientForm.get("middleName");
  }

  get lastName() {
    return this.patientForm.get("lastName");
  }

  get birthdate() {
    return this.patientForm.get("birthdate");
  }

  get patientImg() {
    return this.patientForm.get("patientImg");
  }

  get address() {
    return this.patientForm.get("address");
  }

  get email() {
    return this.patientForm.get("email");
  }

  get contactno() {
    return this.patientForm.get("contactno");
  }

  submit() {
    if (this.patientForm.valid) {
      let birthdateDate = Timestamp.fromDate(new Date(this.birthdate.value))

      const patient = new PatientInfo(
        this.patientId,
        this.firstName.value,
        this.middleName.value,
        this.lastName.value,
        this.patientImg.value,
        birthdateDate,
        this.email.value,
        this.contactno.value,
        this.address.value
      )

      this.patientService.upsertPatient(patient).then(
        () => alert('Patient updated')
      ).catch(err => console.log(err));
    }
  }
}
