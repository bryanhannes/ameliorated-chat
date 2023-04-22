import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GithubIconUiComponent,
  TwitterIconUiComponent
} from '@ameliorated-chat/frontend/ui-icons';
import { FacadeService } from '../../../facade.service';
import { map, Observable } from 'rxjs';

type PageViewModel = {
  buttonApiKeyLabel: string;
};

@Component({
  selector: 'ac-sidebar-footer-content',
  standalone: true,
  imports: [CommonModule, GithubIconUiComponent, TwitterIconUiComponent],
  templateUrl: './sidebar-footer-content.ui-component.html',
  styleUrls: ['./sidebar-footer-content.ui-component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarFooterContentUiComponent {
  private readonly facade = inject(FacadeService);
  private readonly chatObservableState = this.facade.chatObservableState;

  public vm$: Observable<PageViewModel> = this.chatObservableState
    .onlySelectWhen(['openAIApiKey'])
    .pipe(
      map(({ openAIApiKey }) => ({
        buttonApiKeyLabel:
          openAIApiKey.length === 0 ? '⚠️ Enter API Key' : '✅ Valid API Key'
      }))
    );

  public openInputApiKeyDialog(): void {
    this.chatObservableState.openInputApiKeyDialog();
  }
}
