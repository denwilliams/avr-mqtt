export interface Device {
  id: string;
  name: string;
  type: "pioneer" | "yamaha";
  params: {
    host: string;
  };
}

export interface ServiceConfig {
  devices: Device[];
}

export interface Client {
  setVolume(value: number): void;
  adjustVolume(value: number): void;
  setPower(value: boolean): void;
  togglePower(): void;
  setMute(value: boolean): void;
  setInput(value: string): void;
  toggleMute(): void;
}

export interface State {
  get(key: string): any;
  set(key: string, value: any): void;
  addListener(
    event: "update",
    listener: ({ key: string, value: any }) => void
  ): void;
  on(event: "update", listener: ({ key: string, value: any }) => void): void;
  once(event: "update", listener: ({ key: string, value: any }) => void): void;
  removeListener(
    event: "update",
    listener: ({ key: string, value: any }) => void
  ): void;
}

export interface Instance {
  monitor: {
    close(): void;
  };
  state: State;
  client: Client;
}
