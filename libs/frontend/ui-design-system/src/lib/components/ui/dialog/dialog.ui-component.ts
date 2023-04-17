import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkPortal } from '@angular/cdk/portal';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { Subject, takeUntil } from 'rxjs';
import { DialogModule } from '@angular/cdk/dialog';

@Component({
  selector: 'ac-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './dialog.ui-component.html',
  styleUrls: ['./dialog.ui-component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DialogUiComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly overlay = inject(Overlay);

  @ViewChild(CdkPortal) public readonly portal: CdkPortal | undefined;
  // the parent is in charge of destroying this component (usually through ngIf or route change)
  @Output() public readonly closeDialog = new EventEmitter<void>();

  private readonly destroy$$ = new Subject();

  private readonly overlayConfig = new OverlayConfig({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically(),
    scrollStrategy: this.overlay.scrollStrategies.noop(),
    disposeOnNavigation: true
  });
  private overlayRef = this.overlay.create(this.overlayConfig);

  public ngOnInit(): void {
    this.overlayRef
      .backdropClick()
      .pipe(takeUntil(this.destroy$$))
      .subscribe(() => {
        this.closeDialog.emit();
      });
  }

  public ngAfterViewInit(): void {
    this.overlayRef?.attach(this.portal);
  }

  public ngOnDestroy(): void {
    // parent destroys this component, this component destroys the overlayRef
    this.overlayRef?.detach();
    this.overlayRef?.dispose();
    this.destroy$$.next(null);
  }
}
