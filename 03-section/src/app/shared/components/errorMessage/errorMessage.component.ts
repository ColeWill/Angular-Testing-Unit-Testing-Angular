import { Component, Input } from '@angular/core';

@Component({
  selector: 'mc-error-message',
  template: '<div data-testid="message-container">{{message}}</div>',
  standalone: true,
})
export class ErrorMessageComponent {
  // don't write business logic inside components ever
  // it makes them harder to test
  @Input() message: string = 'Something went wrong';
}
