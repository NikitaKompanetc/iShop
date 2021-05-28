import { Component, OnInit } from '@angular/core';
import Item from './../../model/item.model';
import Categories from 'src/app/model/categories.model';
import { ItemsService } from 'src/app/service/items.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { FirebaseService } from 'src/app/service/categories.service';
@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
})
export class AddItemComponent implements OnInit {
  Item?: Item[];
  Categories;
  submitted = false;
  form!: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddItemComponent>,
    private itemsService: ItemsService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private catalogService: FirebaseService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      categories: ['', Validators.required],
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
        console.log(data);
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

  addItem(): void {
    console.log(this.form.getRawValue());

    this.itemsService.create({ ...this.form.getRawValue() }).then((el) => {
      console.log('Created new item successfully!', el);
      this.submitted = true;
      this.dialogRef.close();
    });
  }
}
