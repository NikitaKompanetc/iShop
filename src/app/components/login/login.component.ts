import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(
    private loginService: LoginService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    window.localStorage.clear();
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  loginGoogle(): void {
    this.loginService.googleLogin();
  }

  login(email: string, password: string) {
    this.loginService.login(email, password)
      .catch(err => {
        if (err.code === 'auth/wrong-password') {
          this.form.controls['password'].setErrors({'incorrect': true})
        }
        if (err.code === 'auth/email-already-in-use')  {
          this.form.controls['email'].setErrors({'notUnique': true})
        }
      });
  }

  validatePassword() {
  }

  
}
