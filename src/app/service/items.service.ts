import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

import  Item  from 'src/app/model/item.model';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  private dbPath = '/items';

  modelItems: AngularFirestoreCollection<Item>;

  constructor(private db: AngularFirestore) {
    this.modelItems = db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<Item> {
    return this.modelItems;
  }

  create(items: any): any {
    return this.modelItems.add({ ...items });
  }

  update(id: string, data: any): Promise<void> {
    return this.modelItems.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.modelItems.doc(id).delete();
  }
}
