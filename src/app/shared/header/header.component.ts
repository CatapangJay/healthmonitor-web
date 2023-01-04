import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'nav [app-header]',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() companyName: string = '';

  constructor(private authService: AuthService, public router: Router) { }

  ngOnInit(): void {
  }

  logOut() {
    this.authService.signOut().then(res => {
      alert('Successfully logged out')
      this.router.navigate(['login']);
    }).catch(err => {});
  }
}
