/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {Type} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BookDetailsComponent} from './book-details.component';
import {FormsModule} from '@angular/forms';
import {Book, BookService} from '../book.service';
import {RouterTestingModule} from '@angular/router/testing';
import {By} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {of} from 'rxjs';

////////  SPECS  /////////////

describe('BookDetailsComponent', function () {
  let fixture: ComponentFixture<BookDetailsComponent>;
  let instance: BookDetailsComponent;

  class ActivatedRouteMock {
    params = of({});
  }

  class RouterMock {
    navigate(): void {
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule, HttpClientModule],
      declarations: [BookDetailsComponent],
      providers: [
        BookService,
        {provide: ActivatedRoute, useClass: ActivatedRouteMock},
        {provide: Router, useClass: RouterMock}
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(BookDetailsComponent as Type<BookDetailsComponent>);
      instance = fixture.componentInstance;
    });
  }));

  it('is instantiated', () => {
    expect(instance instanceof BookDetailsComponent).toBe(true, 'should create BookDetailsComponent');
  });

  it('leaves the current book empty when no params passed', () => {
    const initialEmptyBook: Book = instance.currentBook;
    fixture.detectChanges(); // triggers BookDetailsComponent.ngOnInit()
    expect(instance.currentBook).toBe(initialEmptyBook);
  });

  it('navigates to overview after saving', inject([Router, BookService], (router: Router, bookService: BookService) => {
    const spy = spyOn(router, 'navigate');
    // musimy wygenerować observable z zamockowanej metody, inaczej wykona się call HTTP
    spyOn(bookService, 'save').and.returnValue(of({}));
    const btn = fixture.debugElement.query(By.css('button:nth-child(1)'));
    // tick();
    fixture.detectChanges(); // triggers BookDetailsComponent.ngOnInit()
    expect(instance.submitted).toBeFalsy();
    btn.triggerEventHandler('click', null);
    // tick();
    fixture.detectChanges();
    expect(instance.submitted).toBeTruthy();
    expect(spy).toHaveBeenCalled();
  }));

  it('navigates to overview after delete', inject([Router, BookService], (router: Router, bookService: BookService) => {
    const spy = spyOn(router, 'navigate');
    // musimy wygenerować observable z zamockowanej metody, inaczej wykona się call HTTP
    spyOn(bookService, 'delete').and.returnValue(of({}));
    const btn = fixture.debugElement.query(By.css('button:nth-child(2)'));
    // tick();
    fixture.detectChanges(); // triggers BookDetailsComponent.ngOnInit()
    btn.triggerEventHandler('click', null);
    // tick();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  }));

});

