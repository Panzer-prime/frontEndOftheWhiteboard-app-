export interface BotConfigurationType {
  readonly name: string;
  readonly description: string;
  readonly settings?: {
    readonly timezone: string;
    readonly language: string;
  };
  readonly triggers: ReadonlyArray<Trigger>;
  readonly action?: ExtendedAction;
  readonly connect?: Connection;
}


type Trigger =
  | ScheduleTrigger
  | OnMessageTrigger
  | CommandTrigger
  | EventTrigger;

type ActionProperties<T extends string> = {
  readonly type: T;
} & { [key in keyof (MessageAction & EmailAction)]: key extends T ? (MessageAction & EmailAction)[key] : never };

type Action<T extends string> = ActionProperties<T>;

type ExtendedAction = Action<'message'> | Action<'email'>;

interface MessageAction {
  readonly type: 'message';
  readonly text: string;
}

interface EmailAction {
  readonly type: 'email';
  readonly recipient: string;
  readonly subject: string;
  readonly body: string;
}

interface RepeatedInterval {
  readonly repeated: true;
  readonly frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  readonly time: string;
}

interface ScheduleTrigger {
  readonly type: 'schedule';
  readonly interval: RepeatedInterval;
}

interface OnMessageTrigger {
  readonly type: 'onMessage';
  readonly pattern: string;
}

interface CommandTrigger {
  readonly type: 'command';
  readonly command: string;
}

interface EventTrigger {
  readonly type: 'event';
  readonly event: string;
}

interface Connection {
  readonly platform?: string;
  readonly key: string;
}
