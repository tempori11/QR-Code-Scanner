import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScanCompletedPage } from './scan-completed.page';

describe('ScanCompletedPage', () => {
  let component: ScanCompletedPage;
  let fixture: ComponentFixture<ScanCompletedPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanCompletedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
