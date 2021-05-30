import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

import User from 'src/app/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private dbPath = '/Users';

  modelCategories: AngularFirestoreCollection<User>;

  constructor(private db: AngularFirestore) {
    this.modelCategories = this.db.collection(this.dbPath);
  }

  getAllUsers(): AngularFirestoreCollection<User> {
    return this.modelCategories;
  }
}
