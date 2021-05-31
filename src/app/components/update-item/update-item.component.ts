import { Component, Inject, OnInit } from '@angular/core';
import Item from './../../model/item.model';
import Categories from 'src/app/model/categories.model';
import { ItemsService } from 'src/app/service/items.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { FirebaseService } from 'src/app/service/categories.service';
export interface DialogData {
  id: string;
}
@Component({
  selector: 'app-update-item',
  templateUrl: './update-item.component.html',
  styleUrls: ['./update-item.component.scss'],
})
export class UpdateItemComponent implements OnInit {
  Item?: Item[];
  Categories?: Categories[];
  submitted = false;
  form!: FormGroup;
  currentItemId;
  message;
  constructor(
    public dialogRef: MatDialogRef<UpdateItemComponent>,
    private itemsService: ItemsService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private catalogService: FirebaseService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.currentItemId = data;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.catalogService
      .getAll()
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({
            id: c.payload.doc.id,
            ...c.payload.doc.data(),
          }))
        )
      )
      .subscribe((data) => {
        this.Categories = data;
      });
  }

  retrieveItem(): void {
    this.itemsService
      .getAll()
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({
            id: c.payload.doc.id,
            ...c.payload.doc.data(),
          }))
        )
      )
      .subscribe((data) => {
        this.Item = data;
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  updateItem(): void {
    if (this.currentItemId) {
      this.itemsService
        .update(this.currentItemId, this.form.getRawValue())
        .then(() => (this.message = 'The Categories was updated successfully!'))
        .catch((err) => console.log(err));
    }
  }
}
