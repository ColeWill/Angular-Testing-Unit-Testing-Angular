import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorMessageComponent } from './errorMessage.component';
import { By } from '@angular/platform-browser';

describe('ErrorMessageComponent', () => {
  // This is component reference
  let component: ErrorMessageComponent;
  // needed to work with DOM elements,
  let fixture: ComponentFixture<ErrorMessageComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ErrorMessageComponent], // added to imports because it is standalone
    }).compileComponents();

    // the 'fixture' is the html template and the TS class working together,
    // though you can just test the class
    fixture = TestBed.createComponent(ErrorMessageComponent);
    component = fixture.componentInstance;
    // this is needed to get the html to render for test to read
    fixture.detectChanges();
  });

  it('creates Component', () => {
    expect(component).toBeTruthy();
  });

  it('renders default error state', () => {
    // select a dom element we want to test
    // don't select elements by class, it is fragile
    // instead create data-testid's on elements we want to test
    const messageContainer = fixture.debugElement.query(
      By.css('[data-testid="message-container"]')
    );
    expect(messageContainer.nativeElement.textContent).toEqual(
      'Something went wrong'
    );
  });
  it('renders custom error message', () => {
    // we updated the input on the component above
    // but we need the below to detect the update changes
    component.message = 'Email is already taken';
    fixture.detectChanges();
    const messageContainer = fixture.debugElement.query(
      // make sure the syntax of the selector is exact
      By.css('[data-testid="message-container"]')
    );
    expect(messageContainer.nativeElement.textContent).toEqual(
      'Email is already taken'
    );
  });
});
