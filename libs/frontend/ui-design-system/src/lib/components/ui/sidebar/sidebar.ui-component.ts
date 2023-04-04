import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { DialogModule } from '@angular/cdk/dialog'

@Component({
  selector: 'ac-sidebar',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './sidebar.ui-component.html',
  styleUrls: ['./sidebar.ui-component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarUiComponent {
  @Output() public readonly closeSidebar = new EventEmitter<void>()
}
