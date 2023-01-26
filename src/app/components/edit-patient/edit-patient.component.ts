import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  private fileToUpload: File;
  private currentImgUrl: string;
  shouldShowOthers: boolean = false;

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

  constructor(private route: ActivatedRoute, private datePipe: DatePipe,
    private fb: FormBuilder,
    private patientService: PatientService) { }

  ngOnInit(): void {
    this.conditionsList.forEach(c => {
      this.conditionsArrForm.push(this.fb.group({
        name: c.name,
        checked: c.checked
      }))
    })

    this.route.params.subscribe(p => {
      this.patientId = p['id'];
      this.getPatientInfo(p['id']);
    })
  }

  getPatientInfo(patientId: string) {
    this.patientService.getPatientById(patientId)
      .snapshotChanges().pipe(
        map(c => ({ ...c.payload.data(), Id: c.payload.id })))
      .subscribe({
        next: (data) => {
          if (data?.conditions !== undefined && data?.conditions.length > 0) {
            this.conditionsArrForm.controls.forEach(c => {
              if (data?.conditions.includes(c.get('name').value)) {
                c.setValue({ name: c.get('name').value, checked: true })
              }
            })
          }

          if (data?.otherConditions !== undefined && data?.otherConditions.length > 0) {
            let othersControl = this.conditionsArrForm.controls.find(c => c.get('name').value === 'Others');
            othersControl.setValue({ name: 'Others', checked: true })
          }

          // let formArray = new FormArray(this.conditionsList.map(fruit => new FormGroup({
          //   name: new FormControl(fruit.name, [Validators.required]),
          //   checked: new FormControl(fruit.checked)
          // })));

          let formVal = {
            firstName: data.Firstname,
            middleName: data.Middlename,
            lastName: data.Lastname,
            birthdate: this.datePipe.transform(data?.BirthDate.toDate(), "yyyy-MM-dd"),
            sex: data?.Sex === undefined ? "Male" : data?.Sex,
            patientImg: '',
            address: data?.address ?? '',
            email: data?.email ?? '',
            contactno: data?.phoneNumber ?? '',
            conditionsArrF: this.conditionsArrForm.value.map(c => new FormControl(c)),
            otherConditions: data?.otherConditions === undefined ? "" : data?.otherConditions.join(", ")
          }
          this.patientForm.patchValue(formVal);
          this.currentImgUrl = data.ImageUrl;
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

  submit() {
    if (this.patientForm.valid) {
      let birthdateDate = Timestamp.fromDate(new Date(this.birthdate.value))
      let conditionsArr = [];

      const checkedConditions = this.conditionsArrForm.value.filter(x => x.checked).map(x => x.name);

      let othersControl = this.conditionsArrForm.controls.find(c => c.get('name').value === 'Others');
      if (othersControl.value.checked === true && this.otherConditions.value != '') {
        conditionsArr.push(...this.otherConditions.value.split(',').map(s => s.trim()))
      }

      const patient = new PatientInfo(
        this.patientId,
        this.firstName.value,
        this.middleName.value,
        this.lastName.value,
        this.currentImgUrl,
        birthdateDate,
        this.sex.value,
        this.email.value,
        this.contactno.value,
        this.address.value,
        checkedConditions,
        conditionsArr
      )

      this.patientService.upsertPatient(patient, this.fileToUpload == undefined ? null : this.fileToUpload).then(
        () => alert('Patient updated')
      ).catch(err => console.log(err));
    }
  }


  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.fileToUpload = event.target.files[0];
    }
  }

  checkOtherCondition() {
    return this.conditionsArrForm.value.some(c => c.name.toLowerCase() === 'others' && c.checked);
  }
}
