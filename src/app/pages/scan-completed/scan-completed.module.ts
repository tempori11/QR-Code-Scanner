import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScanCompletedPageRoutingModule } from './scan-completed-routing.module';

import { ScanCompletedPage } from './scan-completed.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScanCompletedPageRoutingModule
  ],
  declarations: [ScanCompletedPage]
})
export class ScanCompletedPageModule {}
