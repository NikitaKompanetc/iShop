import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/login.service';
export interface DialogData {
  id: string;
}

@Component({
  selector: 'app-add-names',
  templateUrl: './add-names.component.html',
  styleUrls: ['./add-names.component.scss']
})
export class AddNamesComponent implements OnInit {
  form!: FormGroup;
  email;
  

  constructor(
    public dialogRef: MatDialogRef<AddNamesComponent>,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.email = data;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addName(firstName: string, lastName: string): void {
    this.loginService.updateUserData(this.email, firstName, lastName)
      .then(() => {
        this.router.navigateByUrl('/items')
          .then(() => {
            this.dialogRef.close();
          });
      });
  }
}
