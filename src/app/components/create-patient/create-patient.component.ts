import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PatientInfo } from 'src/app/models/patient-info';
import { Timestamp } from '@angular/fire/firestore';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrls: ['./create-patient.component.scss']
})
export class CreatePatientComponent implements OnInit {
  conditionsArrForm = new FormArray([]);
  patientForm = this.fb.group({
    firstName: ['', Validators.required],
    middleName: ['', Validators.required],
    lastName: ['', Validators.required],
    birthdate: ['', Validators.required],
    sex: ['', Validators.required],
    patientImg: [''],
    address: ['', Validators.required],
    email: ['', Validators.required],
    contactno: ['', Validators.required],
    otherConditions: [''],
    conditionsArrF: this.conditionsArrForm
  });

  conditionsList = [
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

  fileToUpload: File;

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

  get sex() {
    return this.patientForm.get("sex");
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

  get otherConditions() {
    return this.patientForm.get("otherConditions");
  }

  ngOnInit(): void {
    this.conditionsList.forEach(c => {
      this.conditionsArrForm.push(new FormGroup({
        name: new FormControl(c.name),
        checked: new FormControl(c.checked)
      }))
    })
  }

  submit() {
    if (this.patientForm.valid) {
      const birthdateDate = Timestamp.fromDate(new Date(this.birthdate.value))
      const randomNumber = Math.floor(Math.random() * 10_000) + 1;
      let conditionsArr = [];

      if (this.otherConditions!.value !== '') {
        conditionsArr.push(...this.otherConditions!.value.split(',').map(s => s.trim()))
      }

      if (this.selectedConditions.length > 0) {
        this.selectedConditions = this.selectedConditions.filter(c => c.toLowerCase() !== 'others');
      }

      const patient = new PatientInfo(
        randomNumber.toString(),
        this.firstName.value,
        this.middleName.value,
        this.lastName.value,
        this.patientImg.value,
        birthdateDate,
        this.sex.value,
        this.email.value,
        this.contactno.value,
        this.address.value,
        this.selectedConditions,
        conditionsArr
      )

      this.service.upsertPatient(patient, this.fileToUpload).then(
        () => alert('Patient added')
      ).catch(err => console.log(err));
    }
  }

  handleFileChange(patientImg) {
    this.fileToUpload = patientImg;
    const reader = new FileReader();
    reader.readAsDataURL(patientImg);
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.fileToUpload = event.target.files[0];
    }
  }

  onCheckChange(condition) {
    if (condition.value.checked) {
      this.selectedConditions.push(condition.value.name);
    } else {
      this.selectedConditions = this.selectedConditions.filter(f => f !== condition.value.name);
    }
  }

  checkOtherCondition() {
    return this.selectedConditions.includes("Others");
  }
}
