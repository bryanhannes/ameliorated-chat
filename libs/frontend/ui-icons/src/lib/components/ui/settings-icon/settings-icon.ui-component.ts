import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'svg[acSettingsIcon]',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <circle cx="12" cy="6" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="18" r="2" />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsIconUiComponent {
  @HostBinding('attr.fill')
  public readonly fill = 'currentColor';

  @HostBinding('attr.viewBox')
  public readonly viewBox = '0 0 24 24';
}
