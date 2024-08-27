import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScanCompletedPage } from './scan-completed.page';

const routes: Routes = [
  {
    path: '',
    component: ScanCompletedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScanCompletedPageRoutingModule {}
