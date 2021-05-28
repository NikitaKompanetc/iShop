import { Component, OnInit } from '@angular/core';
import { LoginService } from './service/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private loginService: LoginService) {}
  ngOnInit(): void {}

  logout(): void {
    this.loginService.logout();
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null) ? true : false;
  }
}
