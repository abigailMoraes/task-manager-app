import { Component, OnInit } from '@angular/core';

import { AuthService } from '@auth0/auth0-angular';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { User } from '@auth0/auth0-angular';

@Component({
  selector: 'app-authentication-button',
  templateUrl: './authentication-button.component.html',
  styleUrls: ['./authentication-button.component.css']
})
export class AuthenticationButtonComponent implements OnInit {

  constructor(public auth:AuthService) { }

  ngOnInit(): void {
  }

}
