import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ac-app-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-info.ui-component.html',
  styleUrls: ['./app-info.ui-component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppInfoUiComponent {}
