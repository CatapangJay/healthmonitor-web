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
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { HeartrateService } from './services/heartrate.service';
import { NotificationService } from './services/notification.service';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    PatientCardComponent,
    HeaderComponent,
    MainContentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // for firestore
  ],
  providers: [PatientService, HeartrateService, NotificationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
