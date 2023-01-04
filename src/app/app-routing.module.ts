import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PatientInfoComponent } from './components/patient-info/patient-info.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { MainContentComponent } from './shared/main-content/main-content.component';

const routes: Routes = [
  { path: '', redirectTo: 'patients', pathMatch: 'full' },
  { path: 'patients', component: MainContentComponent, canActivate: [AuthGuard] },
  { path: 'patients/:id', component: PatientInfoComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
