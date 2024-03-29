import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { PatientCardComponent } from './components/patient-card/patient-card.component';
import { HeaderComponent } from './shared/header/header.component';
import { MainContentComponent } from './shared/main-content/main-content.component';
import { environment } from '../environments/environment';
import { PatientService } from './services/patient.service';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { HeartrateService } from './services/heartrate.service';
import { NotificationService } from './services/notification.service';
import { CreatePatientComponent } from './components/create-patient/create-patient.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewPatientComponent } from './components/view-patient/view-patient.component';
import { ViewPatientDetailsComponent } from './view-patient-details/view-patient-details.component';
import { PatientInfoComponent } from './components/patient-info/patient-info.component';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth.service';
import { EditPatientComponent } from './components/edit-patient/edit-patient.component';
import { DatePipe } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { HighchartsChartModule } from 'highcharts-angular';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    PatientCardComponent,
    HeaderComponent,
    MainContentComponent,
    CreatePatientComponent,
    ViewPatientComponent,
    ViewPatientDetailsComponent,
    PatientInfoComponent,
    LoginComponent,
    EditPatientComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    NgChartsModule,
    HighchartsChartModule,
    NgApexchartsModule
  ],
  providers: [PatientService, HeartrateService, NotificationService, AuthService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
