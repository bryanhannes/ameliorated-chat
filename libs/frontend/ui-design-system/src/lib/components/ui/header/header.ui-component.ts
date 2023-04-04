import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output
} from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'ac-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.ui-component.html',
  styleUrls: ['./header.ui-component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderUiComponent {
  @Output() public openHamburgerMenu = new EventEmitter<void>()
  @Output() public openSettingsMenu = new EventEmitter<void>()

  public onOpenHamburgerMenu(): void {
    this.openHamburgerMenu.emit()
  }

  public onOpenSettingsMenu(): void {
    this.openSettingsMenu.emit()
  }
}
