import { Component, EventEmitter, inject, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ObservableState } from '@ameliorated-chat/frontend/util-state'
import { map, Observable } from 'rxjs'
import { FacadeService } from '../../../facade.service'

type PageViewModel = {
  sidebarOpen: boolean
}

type State = {
  sidebarOpen: boolean
}

@Component({
  selector: 'ac-chatbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbox.ui-component.html',
  styleUrls: ['./chatbox.ui-component.scss']
})
export class ChatboxUiComponent extends ObservableState<State> {
  private readonly facade = inject(FacadeService)
  private readonly chatObservableState = this.facade.chatObservableState
  public message = ''

  public readonly vm$: Observable<PageViewModel> = this.onlySelectWhen([
    'sidebarOpen'
  ]).pipe(
    map(({ sidebarOpen }) => ({
      sidebarOpen
    }))
  )

  @Output()
  public readonly newMessage = new EventEmitter<string>()

  constructor() {
    super()
    this.initialize({
      sidebarOpen: false
    })

    this.connect({
      ...this.chatObservableState.pick(['sidebarOpen'])
    })
  }

  public onTextAreaInput(): void {
    const textarea = document.getElementById('chatbox')
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    }
  }

  public onSend(): void {
    this.newMessage.emit(this.message)
  }
}
