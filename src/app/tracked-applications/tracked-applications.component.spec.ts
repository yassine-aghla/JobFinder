import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackedApplicationsComponent } from './tracked-applications.component';

describe('TrackedApplicationsComponent', () => {
  let component: TrackedApplicationsComponent;
  let fixture: ComponentFixture<TrackedApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackedApplicationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackedApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
