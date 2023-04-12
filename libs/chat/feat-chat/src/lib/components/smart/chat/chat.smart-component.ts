import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ChatboxUiComponent } from '../../ui/chatbox/chatbox.ui-component'
import { AppInfoUiComponent } from '../../ui/app-info/app-info.ui-component'

@Component({
  selector: 'ac-chat',
  standalone: true,
  imports: [CommonModule, ChatboxUiComponent, AppInfoUiComponent],
  templateUrl: './chat.smart-component.html',
  styleUrls: ['./chat.smart-component.scss']
})
export class ChatSmartComponent {
  public newChatMessage(message: string): void {
    console.log(message)
  }
}
