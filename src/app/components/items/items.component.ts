import { FirebaseService } from '../../service/categories.service';
import { Component, OnInit, OnChanges, EventEmitter } from '@angular/core';
import { map } from 'rxjs/operators';
import Categories from './../../model/categories.model';
import { MatDialog } from '@angular/material/dialog';
import { AddItemComponent } from '../add-item/add-item.component';
import Item from 'src/app/model/item.model';
import { ItemsService } from 'src/app/service/items.service';
import { UpdateItemComponent } from '../update-item/update-item.component';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
})
export class ItemsComponent implements OnInit, OnChanges {
  Categories?: any;
  Item?: Item[] | any;
  currentCategories: Categories = {
    title: '',
    description: '',
    published: false,
  };
  currentItem: Item = {
    id: '',
    title: '',
    description: '',
    published: false,
    categories: '',
    owner: ''
  };
  currentIndex = -1;
  title = '';
  message = '';
  currentItemId;
  categoryId = null;
  userEmail: string;
  constructor(
    private firebaseService: FirebaseService,
    public dialog: MatDialog,
    private itemsService: ItemsService
  ) {
    let a = localStorage.getItem('user');
    this.userEmail = JSON.parse(a).email;
  }

  ngOnInit(): void {
    this.retrieveItem(this.categoryId);
    this.message = '';

    let a = localStorage.getItem('user');
    this.userEmail = JSON.parse(a).email;
  }
  ngOnChanges(): void {
    this.message = '';
    this.currentItem = this.Item;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddItemComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
  openDialogUpdateItem(ItemId: string): void {
    const dialogRef = this.dialog.open(UpdateItemComponent, { data: ItemId });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  refreshList(): void {
    this.currentItem = undefined;
    this.currentIndex = -1;
    this.retrieveItem(this.categoryId);
  }

  retrieveItem(catalogId): void {
    this.categoryId = catalogId;
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
        if (this.categoryId !== null) {
          this.Item = data.filter((el) => el.categories === this.categoryId);
        } else {
          this.Item = data;
        }
      });
    this.firebaseService
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

  setActiveItem(item: Categories, index: number): void {
    this.currentItem = item;
    this.currentIndex = index;
  }

  deleteItem(): void {
    if (this.currentItem.id) {
      this.itemsService
        .delete(this.currentItem.id)
        .then(() => {
          this.refreshList;
          this.message = 'The Categories was updated successfully!';
        })
        .catch((err) => console.log(err));
    }
  }
}
