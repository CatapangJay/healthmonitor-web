import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  invalidCredentials: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    public router: Router) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit() {
    // Check if the form is valid
    if (this.loginForm.valid) {
      // Submit the form
      this.authService.signIn(this.email.value, this.password.value).then((result) => {
        // this.authService.sendVerificationMail();
        this.authService.setUserData(result.user);
        this.authService.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['patients']);
          }
        });
      })
        .catch((error) => {
          if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            this.invalidCredentials = true;
          }
          // TODO: get only for specific errors
        });;
    }
  }
}
