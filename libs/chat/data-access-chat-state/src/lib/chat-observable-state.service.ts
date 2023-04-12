import { Injectable } from '@angular/core'
import { ObservableState } from '@ameliorated-chat/frontend/util-state'
import { map } from 'rxjs'

export type ChatState = {
  sidebarOpen: boolean
  openApiKey: string
}

@Injectable({
  providedIn: 'root'
})
export class ChatObservableState extends ObservableState<ChatState> {
  constructor() {
    super()
    this.initialize({
      sidebarOpen: false,
      openApiKey: ''
    })
  }

  public sidebarOpen$ = this.onlySelectWhen(['sidebarOpen']).pipe(
    map(({ sidebarOpen }) => sidebarOpen)
  )

  public toggleSidebar(): void {
    this.patch({ sidebarOpen: !this.snapshot.sidebarOpen })
  }

  public setOpenApiKey(apiKey: string): void {
    this.patch({ openApiKey: apiKey })
  }
}
