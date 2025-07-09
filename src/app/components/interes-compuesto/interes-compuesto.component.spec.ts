/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InteresCompuestoComponent } from './interes-compuesto.component';

describe('InteresCompuestoComponent', () => {
  let component: InteresCompuestoComponent;
  let fixture: ComponentFixture<InteresCompuestoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteresCompuestoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteresCompuestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
