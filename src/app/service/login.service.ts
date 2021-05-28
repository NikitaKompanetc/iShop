import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
//import 'rxjs/add/operator/switchMap';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from './../model/user.model';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  userData: any;
  incomingUser: AngularFirestoreDocument;

  private dbPath = '/Users';

  modelUser: AngularFirestoreCollection<User>

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFirestore) {
      this.modelUser = this.db.collection(this.dbPath);
      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.userData = user;
          localStorage.setItem('user', JSON.stringify(this.userData));
          JSON.parse(localStorage.getItem('user'));
        } else {
          localStorage.clear();
          JSON.parse(localStorage.getItem('user'));
        }
      })
    }



    async login(email, password) {
      this.getUserByEmail(email).subscribe(async el=>{
        if (el.data()) {
          await this.afAuth.signInWithEmailAndPassword(email, password)
            .then(value => {
              console.log('Nice, it worked!');
              this.router.navigateByUrl('/items');
            })
            .catch(err => {
              console.log('Something went wrong: ', err.message);
            });
        } else {
          await this.afAuth.createUserWithEmailAndPassword(email, password)
            .then(value => {
              console.log('Success', value);
              this.router.navigateByUrl('/items');
              this.SetUserData(value.user);
            })
            .catch(error => {
              console.log('Something went wrong: ', error);
            });
        }
      })
  
    }

    

    googleLogin() {
      const provider = new firebase.default.auth.GoogleAuthProvider();
      return this.oAuthLogin(provider)
        .then(value => {
       console.log('Success', value),
       this.getUserByEmail(value.user.email).subscribe(async el=>{
        if (el.data()) {
          this
        }});
       this.router.navigateByUrl('/items');
       this.SetUserData(value.user)
      })
      .catch(error => {
        console.log('Something went wrong: ', error);
      });
    }


    SetUserData(user: firebase.default.User): any {
      const userData: User = {
        email: user.email,
        firstName: '',
        lastName: '',
        fullName: ''
      };
      return this.modelUser.doc(user.email).set(userData);
    }

    updateUserData(email, firstName, lastName): any {
      const userData: User = {
        email,
        firstName,
        lastName,
        fullName: firstName + ' ' + lastName,  
      };
      return this.modelUser.doc(email).set(userData);
    }

    get isLoggedIn(): boolean {
      const user = JSON.parse(localStorage.getItem('user'));
      return (user !== null) ? true : false;
    }


    private oAuthLogin(provider) {
      return this.afAuth.signInWithPopup(provider);
    }

    getUserByEmail(email: string) {
      return this.modelUser.doc(email).get()
    }
    //    ()
    //     .pipe(
    //       map((value) => {
    //         console.log(3333, value);
            
    //         value.map((el) => {
    //           console.log(4444, el);
              
    //           return (el.email === email) ? el : null;
    //         })
    //       })
    //     ).subscribe((el) => {
    //       return el;
    //     })
        
    // }

    logout() {
      this.afAuth.signOut().then(() => {
        localStorage.removeItem('user');
        this.router.navigate(['/']);
      });
    }

    // create(email: string): any {
    //   const user: User = {
    //     firstName: '',
    //     lastName: '',
    //     fullName: '',
    //     email
    //   }
    //   return this.modelUser.add(user);
    // }
}
