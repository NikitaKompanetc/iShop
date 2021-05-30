import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/firestore';
import { CronJob } from 'cron';

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

  async deleteAll(): Promise<void> {
    return (await this.getAll().get().toPromise()).forEach(doc => {
        this.modelItems.doc(doc.id).delete()
          .catch(err => {
            console.log(err);
          })
      })
  }

  cronJob = new CronJob('0 1 * * *', () => {
    try {
      this.deleteAll();
      console.log('Items were deleted');
    } catch (e) {
      console.error(e);
    }
  });
}
