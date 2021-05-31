import { Component, OnInit } from '@angular/core';
import { ItemsService } from './service/items.service';
import { LoginService } from './service/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private loginService: LoginService,
    private itemsService: ItemsService
    ) {}
  ngOnInit(): void {}

  logout(): void {
    this.loginService.logout();
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null) ? true : false;
  }
}
