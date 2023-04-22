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
  selector: 'ac-api-key-input-dialog',
  standalone: true,
  imports: [CommonModule, DialogUiComponent, FormsModule],
  templateUrl: './api-key-input-dialog.ui-component.html',
  styleUrls: ['./api-key-input-dialog.ui-component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiKeyInputDialogUiComponent {
  @Input() public apiKey = '';
  @Output() public readonly apiKeyEntered = new EventEmitter<string>();
  @Output() public readonly closeDialog = new EventEmitter<void>();

  public submitForm(): void {
    if (this.apiKey.length > 0) {
      this.apiKeyEntered.emit(this.apiKey);
    }
  }
}
