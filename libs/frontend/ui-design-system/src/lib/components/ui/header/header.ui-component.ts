import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputState } from '@ameliorated-chat/frontend/util-state';
import { map, Observable } from 'rxjs';

type HeaderInputState = {
  sidebarOpen: boolean;
};

@Component({
  selector: 'ac-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.ui-component.html',
  styleUrls: ['./header.ui-component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderUiComponent {
  @InputState() public readonly inputState!: Observable<HeaderInputState>;
  @Input() public sidebarOpen = true;
  @Output() public openHamburgerMenu = new EventEmitter<void>();
  @Output() public openSettingsMenu = new EventEmitter<void>();

  public readonly vm$ = this.inputState.pipe(
    map(({ sidebarOpen }) => ({
      sidebarOpen
    }))
  );

  public onOpenHamburgerMenu(): void {
    this.openHamburgerMenu.emit();
  }

  public onOpenSettingsMenu(): void {
    this.openSettingsMenu.emit();
  }
}
