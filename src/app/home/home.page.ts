import { Component, OnInit } from '@angular/core';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { FirestoreService } from '../services/firestore.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  isSupported = false;
  barcodes: Barcode[] = [];
  userData: any;
  userId: string | null = null;
  amount: number | null = null;
  businessData: any;

  constructor(
    private alertController: AlertController,
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });

    this.authService.getUserId().subscribe((userId) => {
      if (userId) {
        this.userId = userId;
        this.fetchBusinessData(userId);
      } else {
        // Handle user not logged in
        console.log('User not logged in');
      }
    });
  }

  fetchBusinessData(userId: string): void {
    this.firestoreService.getBusinessData(userId).subscribe((data) => {
      this.businessData = data;
    });
  }

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();
    if (barcodes.length > 0) {
      const scannedData = barcodes[0].displayValue;
      this.handleScanResult(scannedData);
      this.barcodes.push(...barcodes);
      /* this.isScanned(); */
    }
  }

  handleScanResult(scannedData: string) {
    const userUid = scannedData;
    this.sendUidsToApi(userUid, this.amount);
  }

  sendUidsToApi(userUid: string, amount: number | null) {
    const businessUid = this.userId;
    if (businessUid && userUid && amount !== null) {
      // Fetch the business name
      this.firestoreService.getBusinessData(businessUid).subscribe(
        (businessData) => {
          const businessName = businessData?.name || 'Unknown Business';

          // Fetch the user name
          this.firestoreService.getUserData(userUid).subscribe(
            (userData) => {
              const userName = userData?.name || 'Unknown User';

              // Payload for the API request
              const apiUrl = 'http://localhost:5208/Temp/save';
              const payload = {
                userUid,
                businessUid,
                amount,
                userName,
                businessName,
              };

              // Send the data to the API
              this.http
                .post(apiUrl, payload, { responseType: 'text' })
                .subscribe({
                  next: (response) => {
                    console.log('UIDs saved to temp table.', response);
                    // Navigate to the scan-completed page with names and amount
                    this.router.navigate(['/scan-completed'], {
                      queryParams: {
                        businessName,
                        businessUid,
                        userName,
                        userUid,
                        amount,
                      },
                    });
                  },
                  error: (error) => {
                    console.error(
                      'Error saving UIDs to temp table:',
                      error.message
                    );
                  },
                });
            },
            (error) => {
              console.error('Error fetching user data:', error.message);
            }
          );
        },
        (error) => {
          console.error('Error fetching business data:', error.message);
        }
      );
    } else {
      console.error('Either business UID, user UID, or amount is missing.');
    }
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  /* isScanned() {
    this.router.navigate(['/scan-completed']);
  } */
}
