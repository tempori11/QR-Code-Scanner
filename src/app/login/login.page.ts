import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private alertCtrl: AlertController,
    private http: HttpClient
  ) {}

  /*  async login() {
    try {
      await this.afAuth.signInWithEmailAndPassword(this.email, this.password);
      this.router.navigateByUrl('/home');
    } catch (error) {
      if (error instanceof Error) {
        this.showAlert('Login Failed', error.message);
      } else {
        this.showAlert('Login Failed', 'An unknown error occured.');
      }
    }
  } */

  async login() {
    try {
      const businessCredential = await this.afAuth.signInWithEmailAndPassword(
        this.email,
        this.password
      );
      const businessUid = businessCredential.user?.uid;
      console.log('Logged in Business UID:', businessUid);

      if (businessUid) {
        this.sendBusinessUidToApi(businessUid).subscribe({
          next: (response) => {
            console.log('Business UID sent to API:', response);
          },
          error: (error) => {
            console.error(
              'Error sending Business UID to API:',
              JSON.stringify(error)
            );
          },
          complete: () => {
            console.log('API call completed.');
          },
        });
      }

      // Navigate to the desired page after successful login and UID sending
      this.router.navigateByUrl('/home');
    } catch (error) {
      if (error instanceof Error) {
        this.showAlert('Login Failed', error.message);
      } else {
        this.showAlert('Login Failed', 'An unknown error occurred.');
      }
    }
  }

  sendBusinessUidToApi(businessUid: string) {
    const apiUrl = 'http://localhost:5208/Business/business_uid';
    return this.http.post(apiUrl, { Uid: businessUid }).pipe(
      catchError((error) => {
        console.error(
          'Error sending Business UID to API:',
          error.message || error
        );
        return throwError(() => error);
      })
    );
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
