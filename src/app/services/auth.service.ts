import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private http: HttpClient
  ) {}

  getUserId(): Observable<string | null> {
    return this.afAuth.authState.pipe(map((user) => (user ? user.uid : null)));
  }

  sendBusinessUidToApi(businessUid: string) {
    const apiUrl = 'http://localhost:5208/Business/business_uid'; // Replace with your API URL
    return this.http.post(apiUrl, { Uid: businessUid });
  }

  login(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const businessUid = userCredential.user?.uid;
        console.log('Logged in business UID:', businessUid); // Log the UID to confirm it's retrieved
        if (businessUid) {
          this.sendBusinessUidToApi(businessUid).subscribe(
            (response) => {
              console.log('Business UID sent to API:', response);
            },
            (error) => {
              console.error('Error sending Business UID to API:', error);
            }
          );
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
      });
  }
}
