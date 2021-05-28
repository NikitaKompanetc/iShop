import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { environment } from '../environments/environment';
import { LoginComponent } from './components/login/login.component';
import { ItemsComponent } from './components/items/items.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { UpdateItemComponent } from './components/update-item/update-item.component'
import { LoginService } from './service/login.service';
import { AddNamesComponent } from './components/add-names/add-names.component';


@NgModule({
  declarations: [AppComponent, LoginComponent, ItemsComponent, AddItemComponent, UpdateItemComponent, AddNamesComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    MaterialModule,
  ],
  providers: [LoginService],
  bootstrap: [AppComponent],
  exports: [LoginComponent, ItemsComponent],
})
export class AppModule {}
