import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactFormsGridComponent } from './contact-forms-grid.component';

describe('ContactFormsGridComponent', () => {
  let component: ContactFormsGridComponent;
  let fixture: ComponentFixture<ContactFormsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactFormsGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactFormsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
