import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'nav [app-header]',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() companyName: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
