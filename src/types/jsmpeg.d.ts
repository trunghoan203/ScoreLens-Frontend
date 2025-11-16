declare module '@cycjimmy/jsmpeg-player' {
  export interface JSMpegOptions {
    canvas?: HTMLCanvasElement;
    audio?: boolean;
    autoplay?: boolean;
    loop?: boolean;
    onPlay?: () => void;
    onError?: (error: Error | unknown) => void;
    onClose?: () => void;
  }

  export class Player {
    constructor(source: string | null, options: JSMpegOptions);
    destroy(): void;
    write(data: ArrayBuffer | Uint8Array): void;
    play(): void;
    pause(): void;
    stop(): void;
  }
}
