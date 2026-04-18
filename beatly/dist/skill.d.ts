import type { BeatlyAgentSignal, BeatlyConductor, BeatlyPlaybackDirective, BeatlyPlaybackOverride, BeatlySession, StartSessionOptions } from "./index.js";
export type AgentEvent = {
    readonly type: "task.started";
    readonly timestamp?: Date;
} | {
    readonly type: "task.blocked";
    readonly timestamp?: Date;
} | {
    readonly type: "task.completed";
    readonly timestamp?: Date;
} | {
    readonly type: "agent.idle";
    readonly timestamp?: Date;
} | {
    readonly type: "agent.error";
    readonly timestamp?: Date;
} | {
    readonly type: "agent.breakthrough";
    readonly timestamp?: Date;
};
export type AgentStatus = "thinking" | "coding" | "reviewing" | "waiting" | "celebrating";
export interface AgentStatusUpdate {
    readonly type: "agent.update";
    readonly status: AgentStatus;
    readonly summary?: string;
    readonly signal?: Partial<BeatlyAgentSignal>;
    readonly timestamp?: Date;
}
export interface PlaybackOverrideUpdate {
    readonly type: "playback.override";
    readonly playback: BeatlyPlaybackOverride;
}
export type BeatlyAgentUpdate = AgentEvent | AgentStatusUpdate | PlaybackOverrideUpdate;
export interface BeatlySkillOptions {
    readonly mapEventToSignal?: (event: AgentEvent) => BeatlyAgentSignal | null;
    readonly mapStatusToSignal?: (update: AgentStatusUpdate) => BeatlyAgentSignal;
}
export interface BeatlySkill {
    start(options: StartSessionOptions): Promise<BeatlySession>;
    handleEvent(event: AgentEvent): Promise<BeatlyPlaybackDirective | null>;
    handleUpdate(update: BeatlyAgentUpdate): Promise<BeatlyPlaybackDirective | null>;
    override(playback: BeatlyPlaybackOverride): Promise<BeatlyPlaybackDirective>;
    stop(reason?: string): Promise<void>;
}
export declare function createBeatlySkill(conductor: BeatlyConductor, options?: BeatlySkillOptions): BeatlySkill;
export declare const BEATLY_SKILL_VERSION: "0.3.0";
//# sourceMappingURL=skill.d.ts.map