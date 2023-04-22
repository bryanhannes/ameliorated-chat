import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogUiComponent } from '@ameliorated-chat/frontend/ui-design-system';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ac-profile-pic-input-dialog',
  standalone: true,
  imports: [CommonModule, DialogUiComponent, FormsModule],
  templateUrl: './profile-pic-input-dialog.ui-component.html',
  styleUrls: ['./profile-pic-input-dialog.ui-component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePicInputDialogUiComponent {
  @Input() public userProfilePicUrl = '';
  @Output() public readonly profilePicUrlEntered = new EventEmitter<string>();
  @Output() public readonly clearProfilePic = new EventEmitter();
  @Output() public readonly closeDialog = new EventEmitter<void>();

  public submitForm(): void {
    this.profilePicUrlEntered.emit(this.userProfilePicUrl);
  }
}
