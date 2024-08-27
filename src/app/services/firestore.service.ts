import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

  /* getUserData(uid: string): Observable<any> {
    return this.firestore.collection('business').doc(uid).valueChanges();
  } */

  getUserData(uid: string): Observable<any> {
    return this.firestore.collection('users').doc(uid).valueChanges();
  }

  getBusinessData(uid: string): Observable<any> {
    return this.firestore.collection('business').doc(uid).valueChanges();
  }
}
