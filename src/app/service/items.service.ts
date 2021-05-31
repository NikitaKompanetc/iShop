import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/firestore';

import  Item  from 'src/app/model/item.model';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  private dbPath = '/items';

  modelItems: AngularFirestoreCollection<Item>;

  constructor(private db: AngularFirestore) {
    this.modelItems = this.db.collection(this.dbPath)
  }

  getAll(): AngularFirestoreCollection<Item> {
    return this.modelItems;
  }

  create(items: any): Promise<DocumentReference<Item>> {
    return this.modelItems.add({ ...items });
  }

  update(id: string, data: Partial<Item>): Promise<void> {
    return this.modelItems.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.modelItems.doc(id).delete();
  }

}
