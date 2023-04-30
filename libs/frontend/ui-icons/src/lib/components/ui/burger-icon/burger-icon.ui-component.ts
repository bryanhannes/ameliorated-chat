import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'svg[acBurgerIcon]',
  standalone: true,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      aria-hidden="true">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path>
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BurgerIconUiComponent {
  @HostBinding('attr.fill')
  public readonly fill = 'currentColor';

  @HostBinding('attr.viewBox')
  public readonly viewBox = '0 0 24 24';
}
