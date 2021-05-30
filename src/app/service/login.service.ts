import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import  User from './../model/user.model';
import { MatDialog } from '@angular/material/dialog';
import { AddNamesComponent } from '../components/add-names/add-names.component';
import { Observable } from 'rxjs';
import { ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  userData: any;
  loggingEmail: string;
  private dbPath = '/Users';

  modelUser: AngularFirestoreCollection<User>;
  errorMessage: string;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFirestore,
    private dialog: MatDialog) {
      this.modelUser = this.db.collection(this.dbPath);
      this.afAuth.authState.subscribe(async user => {
        if (user) {
          this.userData = user;
          localStorage.setItem('user', JSON.stringify(this.userData));
          JSON.parse(localStorage.getItem('user'));
          
            if (await this.getUserByEmail(user.email)) {
              this.router.navigateByUrl('/items');
            }
        
        } else {
          localStorage.clear();
          JSON.parse(localStorage.getItem('user'));
        }
      })
    }



    async login(email: string, password: string): Promise<void> {
        if (await this.getUserByEmail(email)) {
          return this.afAuth.signInWithEmailAndPassword(email, password)
            .then(value => {
              this.userData = value
              console.log('Nice, it worked!');
              this.router.navigateByUrl('/items');
            })
            .catch(err => {
              console.log('Something went wrong: ', err.message);
              throw err
            });
        } else {
          return this.afAuth.createUserWithEmailAndPassword(email, password)
            .then(value => {
              console.log('Success', value);
              this.openDialog(email);
            })
            .catch(error => {
              console.log('Something went wrong: ', error);
              throw error
            });
        }

    }


    async googleLogin(): Promise<void> {
      const provider = new firebase.default.auth.GoogleAuthProvider();
      return this.oAuthLogin(provider)
        .then(async value => {
          console.log('Success', value);
          if (!await this.getUserByEmail(value.user.email)) {
            this.updateUserData(value.user.email, value.user.displayName.split(' ')[0], value.user.displayName.split(' ')[1]);
          };
        })
        .catch(error => {
          console.log('Something went wrong: ', error);
        })
    }


    async updateUserData(email: string, firstName: string, lastName: string): Promise<void> {
      const userData: User = {
        email,
        firstName,
        lastName,
        fullName: firstName + ' ' + lastName,  
      };
      return await this.modelUser.doc(email).set(userData);
    }

    get isLoggedIn(): boolean {
      const user = JSON.parse(localStorage.getItem('user'));
      return (user !== null) ? true : false;
    }


    private async oAuthLogin(provider: firebase.default.auth.GoogleAuthProvider): Promise<firebase.default.auth.UserCredential> {
      return await this.afAuth.signInWithPopup(provider);
    }

    async getUserByEmail(email: string): Promise<User> {
      return (await this.modelUser.doc(email).get().toPromise()).data();
    }

    openDialog(email: string): void {
      this.dialog.open(AddNamesComponent, {data: email});
    }

    logout() {
      this.afAuth.signOut().then(() => {
        localStorage.removeItem('user');
        this.router.navigate(['/']);
      });
    }
}
