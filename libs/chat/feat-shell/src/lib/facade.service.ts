import { inject, Injectable } from '@angular/core'
import { ChatObservableState } from '@ameliorated-chat/chat/data-access-chat-state'

@Injectable({
  providedIn: 'root'
})
export class FacadeService {
  public readonly chatObservableState = inject(ChatObservableState)
}
