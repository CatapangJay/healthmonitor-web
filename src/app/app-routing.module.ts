import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientInfoComponent } from './components/patient-info/patient-info.component';
import { MainContentComponent } from './shared/main-content/main-content.component';

const routes: Routes = [
  { path: '', redirectTo: 'patients', pathMatch: 'full' },
  { path: 'patients', component: MainContentComponent },
  { path: 'patients/:id', component: PatientInfoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
