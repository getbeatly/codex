import { type BeatlyGenre, type BeatlyGenreId } from "./genres.js";
export { BEATLY_GENRES, DEFAULT_GENRE, getGenre, getVariant, resolveProfileId, type BeatlyGenre, type BeatlyGenreId, type BeatlyVariant } from "./genres.js";
export { ConsoleDirectiveAdapter, SuperColliderHelloAdapter, type SuperColliderHelloAdapterOptions, type SuperColliderServerState } from "./adapters.js";
export interface BeatlyAgentSignal {
    readonly focus: number;
    readonly cognitiveLoad: number;
    readonly energy: number;
    readonly timestamp?: Date;
}
export interface BeatlySession {
    readonly sessionId: string;
    readonly agentId: string;
    readonly startedAt: Date;
    readonly genre: BeatlyGenreId;
    readonly variant: string;
    readonly intensity: number;
    readonly seed: number;
    readonly running: boolean;
}
export interface BeatlyPlaybackDirective {
    readonly genre: BeatlyGenreId;
    readonly variant: string;
    readonly intensity: number;
    readonly seed: number;
    readonly running: boolean;
    readonly reason: string;
    readonly summary: string;
    readonly timestamp: Date;
}
export interface BeatlyPlaybackOverride {
    readonly genre?: BeatlyGenreId;
    readonly variant?: string;
    readonly intensity?: number;
    readonly seed?: number;
    readonly running?: boolean;
    readonly reason?: string;
    readonly summary?: string;
    readonly timestamp?: Date;
}
export interface BeatlyDirectiveAdapter {
    readonly id: string;
    applyDirective(directive: BeatlyPlaybackDirective): Promise<unknown> | unknown;
}
export interface BeatlyConductorOptions {
    readonly adapters?: readonly BeatlyDirectiveAdapter[];
    readonly seedFactory?: () => number;
}
export interface StartSessionOptions {
    readonly agentId: string;
    readonly sessionId?: string;
    readonly initialGenre?: BeatlyGenreId;
    readonly initialVariant?: string;
    readonly initialIntensity?: number;
    readonly running?: boolean;
}
export interface BeatlyRecommendation {
    readonly genre: BeatlyGenre;
    readonly intensity: number;
    readonly summary: string;
}
export declare class BeatlyConductor {
    private readonly adapters;
    private readonly seedFactory;
    private session;
    constructor(options?: BeatlyConductorOptions);
    registerAdapter(adapter: BeatlyDirectiveAdapter): void;
    getSession(): BeatlySession | null;
    startSession(options: StartSessionOptions): Promise<BeatlySession>;
    updateFromSignal(signal: BeatlyAgentSignal, reason?: string): Promise<BeatlyPlaybackDirective>;
    applyPlaybackOverride(override: BeatlyPlaybackOverride): Promise<BeatlyPlaybackDirective>;
    stopSession(reason?: string): Promise<void>;
    private dispatch;
}
export declare function recommendPlayback(signal: BeatlyAgentSignal): BeatlyRecommendation;
export declare const BEATLY_CORE_VERSION: "0.3.0";
//# sourceMappingURL=index.d.ts.map