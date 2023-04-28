import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogUiComponent } from '@ameliorated-chat/frontend/ui-design-system';
import {
  getDefaultInputState,
  InputState,
  ObservableState
} from '@ameliorated-chat/frontend/util-state';
import { map, Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { OpenAiIconUiComponent } from '@ameliorated-chat/frontend/ui-icons';
import { Chat } from '@ameliorated-chat/chat/type-chat';

type ModelSettingsInputState = {
  chat: Chat;
};

type State = ModelSettingsInputState & {
  model: string;
  initialSystemInstruction: string;
  temperature: number;
  newSystemInstruction: string;
};

type ViewModel = {
  model: string;
  initialSystemInstruction: string;
  temperature: number;
  disableSystemMessageToBeUpdated: boolean;
  systemInstructionChanged: boolean;
};

@Component({
  selector: 'ac-model-settings-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogUiComponent,
    FormsModule,
    OpenAiIconUiComponent
  ],
  templateUrl: './model-settings-dialog.ui-component.html',
  styleUrls: ['./model-settings-dialog.ui-component.scss']
})
export class ModelSettingsDialogUiComponent extends ObservableState<State> {
  @InputState()
  public readonly inputState$!: Observable<ModelSettingsInputState>;
  @Input() public chat: Chat | null = null;
  @Output() public readonly modelChanged = new EventEmitter<string>();
  @Output() public readonly initialSystemInstructionChanged =
    new EventEmitter<string>();
  @Output() public readonly temperatureChanged = new EventEmitter<number>();
  @Output() public readonly closeDialog = new EventEmitter<void>();

  public readonly vm$: Observable<ViewModel> = this.state$.pipe(
    map(
      ({
        model,
        initialSystemInstruction,
        temperature,
        chat,
        newSystemInstruction
      }) => ({
        model,
        initialSystemInstruction,
        temperature,
        disableSystemMessageToBeUpdated: chat.messages.length > 1,
        systemInstructionChanged:
          initialSystemInstruction !== newSystemInstruction
      })
    )
  );

  constructor() {
    super();

    this.initialize(
      {
        ...getDefaultInputState(this),
        model: '',
        initialSystemInstruction: '',
        temperature: 0.5
      },
      this.inputState$
    );

    this.connect({
      model: this.onlySelectWhen(['chat']).pipe(
        map(({ chat }) => chat?.model ?? '')
      ),
      temperature: this.onlySelectWhen(['chat']).pipe(
        map(({ chat }) => chat?.temperature ?? 0)
      ),
      initialSystemInstruction: this.onlySelectWhen(['chat']).pipe(
        map(({ chat }) => chat?.systemMessage ?? '')
      ),
      newSystemInstruction: this.onlySelectWhen(['chat']).pipe(
        map(({ chat }) => chat?.systemMessage ?? '')
      )
    });
  }

  public onModelChanged(model: string): void {
    this.modelChanged.emit(model);
  }

  public onTemperatureChanged(value: number): void {
    this.temperatureChanged.emit(value);
  }

  public onSystemInstructionChanged(value: string): void {
    this.patch({ newSystemInstruction: value });
  }

  public saveSystemInstruction(): void {
    this.initialSystemInstructionChanged.emit(
      this.snapshot.newSystemInstruction
    );
  }

  public resetSystemInstructionToDefault(): void {
    this.initialSystemInstructionChanged.emit(
      'You are ChatGPT, a large language model trained by OpenAI.'
    );
  }

  public resetTemperatureToDefault(): void {
    this.temperatureChanged.emit(0.5);
  }
}
