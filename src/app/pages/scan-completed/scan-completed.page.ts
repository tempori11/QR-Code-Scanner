import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-scan-completed',
  templateUrl: './scan-completed.page.html',
  styleUrls: ['./scan-completed.page.scss'],
})
export class ScanCompletedPage implements OnInit {
  businessName: string | null = null;
  userName: string | null = null;
  amount: number | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.businessName = params['businessName'];
      this.userName = params['userName'];
      this.amount = params['amount'];
    });
  }
}
