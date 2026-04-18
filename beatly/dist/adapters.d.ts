import type { BeatlyPlaybackDirective } from "./index.js";
import type { BeatlyGenreId } from "./genres.js";
export interface SuperColliderServerState {
    readonly profile: string;
    readonly genre?: string;
    readonly variant?: string;
    readonly seed: number;
    readonly bpm: number | null;
    readonly bar: number;
    readonly running: boolean;
    readonly profiles: readonly string[];
    readonly genres?: readonly {
        readonly id: string;
        readonly defaultVariant: string;
        readonly variants: readonly string[];
    }[];
    readonly lastAgentEvent?: string | null;
}
export interface SuperColliderAgentEventPayload {
    readonly event: string;
    readonly seed?: number;
}
export interface SuperColliderHelloAdapterOptions {
    readonly baseUrl?: string;
    readonly autostart?: boolean;
    readonly serverCwd?: string;
    readonly serverScript?: string;
    readonly spawnCommand?: string;
    readonly spawnArgs?: readonly string[];
    readonly startupTimeoutMs?: number;
    /**
     * Spawn the server detached from the parent process so short-lived one-shot
     * drivers (e.g. the Codex/Claude Code skill wrappers) can exit without
     * killing the Beatly daemon. Defaults to true.
     */
    readonly detached?: boolean;
}
export declare class SuperColliderHelloAdapter {
    readonly id = "beatly-supercollider";
    private readonly baseUrl;
    private readonly autostart;
    private readonly serverCwd;
    private readonly serverScript;
    private readonly spawnCommand;
    private readonly spawnArgs;
    private readonly startupTimeoutMs;
    private readonly detached;
    private child;
    constructor(options?: SuperColliderHelloAdapterOptions);
    ensureReady(): Promise<SuperColliderServerState>;
    startServer(): Promise<void>;
    getState(): Promise<SuperColliderServerState>;
    setProfile(profile: BeatlyGenreId, seed?: number): Promise<SuperColliderServerState>;
    setGenre(genre: BeatlyGenreId, variant?: string, seed?: number): Promise<SuperColliderServerState>;
    setVariant(variant: string): Promise<SuperColliderServerState>;
    setRunning(running: boolean): Promise<SuperColliderServerState>;
    randomize(): Promise<SuperColliderServerState>;
    applyDirective(directive: BeatlyPlaybackDirective): Promise<SuperColliderServerState>;
    sendAgentEvent(payload: SuperColliderAgentEventPayload): Promise<SuperColliderServerState>;
    panic(): Promise<void>;
    stopServer(): void;
    private waitForReady;
    private postControl;
    private postAgent;
}
export declare class ConsoleDirectiveAdapter {
    readonly id = "console";
    applyDirective(directive: BeatlyPlaybackDirective): Promise<void>;
}
//# sourceMappingURL=adapters.d.ts.map