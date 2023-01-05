import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PatientInfo } from 'src/app/models/patient-info';
import { Timestamp } from '@angular/fire/firestore';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrls: ['./create-patient.component.scss']
})
export class CreatePatientComponent implements OnInit {
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

  constructor(private fb: FormBuilder,
              private service: PatientService) { }

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

  ngOnInit(): void {
  }

  submit() {
    if (this.patientForm.valid){
      let birthdateDate = Timestamp.fromDate(new Date(this.birthdate.value))
      let randomNumber = Math.floor(Math.random() * 10_000) + 1;

      const patient = new PatientInfo(
        randomNumber.toString(),
        this.firstName.value,
        this.middleName.value,
        this.lastName.value,
        this.patientImg.value,
        birthdateDate,
        this.email.value,
        this.contactno.value,
        this.address.value
      )

      this.service.upsertPatient(patient).then(
        () => alert('Patient added')
      ).catch(err => console.log(err));
    }
  }
}
