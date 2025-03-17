/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CompressorImgComponent } from './compressor-img.component';

describe('CompressorImgComponent', () => {
  let component: CompressorImgComponent;
  let fixture: ComponentFixture<CompressorImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompressorImgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompressorImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
