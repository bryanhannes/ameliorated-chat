import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  HeaderUiComponent,
  SidebarUiComponent
} from '@ameliorated-chat/frontend/ui-design-system'
import { RouterOutlet } from '@angular/router'
import { ObservableState } from '@ameliorated-chat/frontend/util-state'
import { FacadeService } from '../facade.service'
import { map, Observable } from 'rxjs'

type PageViewModel = {
  sidebarOpen: boolean
}

type State = {
  sidebarOpen: boolean
}

@Component({
  selector: 'ac-shell',
  standalone: true,
  imports: [CommonModule, HeaderUiComponent, RouterOutlet, SidebarUiComponent],
  templateUrl: './chat-feat-shell.component.html',
  styleUrls: ['./chat-feat-shell.component.scss']
})
export class ChatFeatShellComponent extends ObservableState<State> {
  private readonly facade = inject(FacadeService)
  private readonly chatObservableState = this.facade.chatObservableState

  public readonly vm$: Observable<PageViewModel> = this.onlySelectWhen([
    'sidebarOpen'
  ]).pipe(
    map(({ sidebarOpen }) => ({
      sidebarOpen
    }))
  )

  constructor() {
    super()
    this.initialize({
      sidebarOpen: false
    })

    this.connect({
      ...this.chatObservableState.pick(['sidebarOpen'])
    })
  }

  public openSettingsMenu(): void {
    console.log('open settings menu')
  }

  public openHamburgerMenu(): void {
    this.chatObservableState.toggleSidebar()
  }

  public closeHamburgerMenu(): void {
    this.chatObservableState.toggleSidebar()
  }
}
