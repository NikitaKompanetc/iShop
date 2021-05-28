import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

import Categories from '../model/categories.model';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private dbPath = '/categories';

  modelCategories: AngularFirestoreCollection<Categories>;

  constructor(private db: AngularFirestore) {
    this.modelCategories = this.db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<Categories> {
    return this.modelCategories;
  }

}
