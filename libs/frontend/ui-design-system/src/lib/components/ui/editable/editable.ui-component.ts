import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ObservableState } from '@ameliorated-chat/frontend/util-state';
import { debounceTime, map, Observable } from 'rxjs';

type PageViewModel = {
  deleteButtonLabel: string;
  isEditing: boolean;
};

type State = {
  deleteClickCount: number;
  isEditing: boolean;
};

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[acEditable]',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editable.ui-component.html',
  styleUrls: ['./editable.ui-component.scss']
})
export class EditableUiComponent extends ObservableState<State> {
  @Output() public readonly edited = new EventEmitter<string>();
  @Output() public readonly deleted = new EventEmitter();
  public value = '';

  public readonly vm$: Observable<PageViewModel> = this.state$.pipe(
    map(({ isEditing, deleteClickCount }) => ({
      deleteButtonLabel: deleteClickCount === 0 ? '🗑️' : 'Sure?',
      isEditing
    }))
  );

  constructor() {
    super();

    this.initialize({
      deleteClickCount: 0,
      isEditing: false
    });

    // Reset deleteClickCount to 0 after 2 seconds which will reset the delete button label
    const deleteClickCount$ = this.onlySelectWhen(['deleteClickCount']).pipe(
      debounceTime(2000),
      map(() => 0)
    );

    this.connect({
      deleteClickCount: deleteClickCount$
    });
  }

  @ViewChild('contentWrapper') public contentWrapper!: ElementRef;

  public cancelEdit(): void {
    this.patch({ isEditing: false });
  }

  public saveEdit(): void {
    if (this.value.length > 0) {
      this.edited.emit(this.value);
    }
    this.patch({ isEditing: false });
  }

  public startEdit() {
    this.patch({ isEditing: true });
    this.value = this.contentWrapper.nativeElement.innerText;
  }

  @HostListener('document:keydown.enter')
  public onEnterPressed(): void {
    this.saveEdit();
  }

  @HostListener('document:keydown.escape')
  public onEscapePressed(): void {
    this.cancelEdit();
  }

  public deleteClicked(): void {
    this.patch({ deleteClickCount: this.snapshot.deleteClickCount + 1 });

    if (this.snapshot.deleteClickCount === 2) {
      this.deleted.emit();
    }
  }
}
