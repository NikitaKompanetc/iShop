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
  Item?: any;
  currentCategories: Categories = {
    title: '',
    description: '',
    published: false,
  };
  currentItem: Item = {
    title: '',
    description: '',
    published: false,
  };
  currentIndex = -1;
  title = '';
  message = '';
  currentItemId;
  categoryId = null;
  imOwner: boolean = false;
  constructor(
    private firebaseService: FirebaseService,
    public dialog: MatDialog,
    private itemsService: ItemsService
  ) {}

  ngOnInit(): void {
    this.retrieveItem(this.categoryId);
    this.message = '';
    console.log(this.Item);
  }
  ngOnChanges(): void {
    this.message = '';
    this.currentItem = this.Item;
    console.log(this.currentItem, 'on changes');
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddItemComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
  openDialogUpdateItem(ItemId: string): void {
    console.log(ItemId);

    const dialogRef = this.dialog.open(UpdateItemComponent, { data: ItemId });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  refreshList(): void {
    this.currentItem = undefined;
    this.currentIndex = -1;
    this.retrieveItem(this.categoryId);
    console.log(this.currentItem);
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
          console.log(data);
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
        console.log(data);
      });
  }

  setActiveItem(item: Categories, index: number): void {
    this.currentItem = item;
    this.currentIndex = index;
    console.log(this.currentItem);
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
