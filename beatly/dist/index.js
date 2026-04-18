import { BEATLY_GENRES, DEFAULT_GENRE } from "./genres.js";
export { BEATLY_GENRES, DEFAULT_GENRE, getGenre } from "./genres.js";
export { ConsoleDirectiveAdapter, SuperColliderHelloAdapter } from "./adapters.js";
export class BeatlyConductor {
    adapters = new Set();
    seedFactory;
    session = null;
    constructor(options = {}) {
        for (const adapter of options.adapters ?? []) {
            this.adapters.add(adapter);
        }
        this.seedFactory = options.seedFactory ?? (() => Math.floor(Math.random() * 1_000_000_000));
    }
    registerAdapter(adapter) {
        this.adapters.add(adapter);
    }
    getSession() {
        return this.session;
    }
    async startSession(options) {
        if (this.session !== null) {
            throw new Error("Beatly session already active.");
        }
        const session = {
            sessionId: options.sessionId ?? generateSessionId(),
            agentId: options.agentId,
            startedAt: new Date(),
            genre: options.initialGenre ?? DEFAULT_GENRE,
            intensity: clamp01(options.initialIntensity ?? 0.5),
            seed: this.seedFactory(),
            running: options.running ?? true,
        };
        this.session = session;
        await this.dispatch({
            genre: session.genre,
            intensity: session.intensity,
            seed: session.seed,
            running: session.running,
            reason: "session.started",
            summary: `Start ${session.genre} at intensity ${session.intensity.toFixed(2)}`,
            timestamp: new Date(),
        });
        return session;
    }
    async updateFromSignal(signal, reason = "signal.update") {
        if (this.session === null) {
            throw new Error("No active Beatly session.");
        }
        const recommendation = recommendPlayback(signal);
        const nextDirective = {
            genre: recommendation.genre.id,
            intensity: recommendation.intensity,
            seed: this.session.seed,
            running: true,
            reason,
            summary: recommendation.summary,
            timestamp: signal.timestamp ?? new Date(),
        };
        this.session = {
            ...this.session,
            genre: nextDirective.genre,
            intensity: nextDirective.intensity,
            running: nextDirective.running,
        };
        await this.dispatch(nextDirective);
        return nextDirective;
    }
    async applyPlaybackOverride(override) {
        if (this.session === null) {
            throw new Error("No active Beatly session.");
        }
        const directive = {
            genre: override.genre ?? this.session.genre,
            intensity: clamp01(override.intensity ?? this.session.intensity),
            seed: override.seed ?? this.session.seed,
            running: override.running ?? this.session.running,
            reason: override.reason ?? "playback.override",
            summary: override.summary ?? "Manual playback override",
            timestamp: override.timestamp ?? new Date(),
        };
        this.session = {
            ...this.session,
            genre: directive.genre,
            intensity: directive.intensity,
            seed: directive.seed,
            running: directive.running,
        };
        await this.dispatch(directive);
        return directive;
    }
    async stopSession(reason = "session.stopped") {
        if (this.session === null) {
            return;
        }
        const directive = {
            genre: this.session.genre,
            intensity: this.session.intensity,
            seed: this.session.seed,
            running: false,
            reason,
            summary: "Stop playback",
            timestamp: new Date(),
        };
        this.session = null;
        await this.dispatch(directive);
    }
    async dispatch(directive) {
        for (const adapter of this.adapters) {
            await adapter.applyDirective(directive);
        }
    }
}
export function recommendPlayback(signal) {
    const intensity = deriveIntensity(signal);
    const genre = deriveGenre(signal, intensity);
    return {
        genre,
        intensity,
        summary: describeRecommendation(genre.id, intensity, signal),
    };
}
function deriveGenre(signal, intensity) {
    if (signal.cognitiveLoad > 0.85) {
        return genreById("calming");
    }
    if (signal.energy < 0.18 && signal.focus < 0.45) {
        return genreById("ambient");
    }
    if (signal.energy < 0.3 && signal.focus > 0.55) {
        return genreById("rainyPiano");
    }
    if (signal.focus > 0.82 && intensity < 0.5) {
        return genreById("deepFocus");
    }
    if (signal.focus > 0.72 && signal.energy < 0.5 && signal.cognitiveLoad < 0.6) {
        return genreById("dreamPop");
    }
    if (signal.focus > 0.75 && intensity < 0.72) {
        return genreById("lofi");
    }
    if (signal.focus > 0.58 && signal.energy >= 0.45 && signal.energy < 0.72 && signal.cognitiveLoad < 0.55) {
        return genreById("soulHop");
    }
    if (signal.energy > 0.88 && signal.focus > 0.78) {
        return genreById("techno");
    }
    if (signal.energy > 0.8 && signal.focus > 0.62) {
        return genreById("chillHouse");
    }
    if (signal.energy > 0.76 && signal.cognitiveLoad < 0.45) {
        return genreById("cityPop");
    }
    if (signal.energy > 0.68 && signal.focus > 0.48) {
        return genreById("sunsetGroove");
    }
    if (signal.energy > 0.8) {
        return genreById("uplift");
    }
    if (signal.energy < 0.4) {
        return genreById("dub");
    }
    return genreById(DEFAULT_GENRE);
}
function deriveIntensity(signal) {
    return clamp01(signal.energy * 0.5 + signal.focus * 0.35 + (1 - signal.cognitiveLoad) * 0.15);
}
function describeRecommendation(genre, intensity, signal) {
    return `${genre} @ ${intensity.toFixed(2)} (focus=${signal.focus.toFixed(2)}, load=${signal.cognitiveLoad.toFixed(2)}, energy=${signal.energy.toFixed(2)})`;
}
function genreById(id) {
    const genre = BEATLY_GENRES.find((entry) => entry.id === id);
    if (genre === undefined) {
        throw new Error(`Unknown Beatly genre: ${id}`);
    }
    return genre;
}
function generateSessionId() {
    return `beatly_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
function clamp01(value) {
    if (Number.isNaN(value)) {
        return 0;
    }
    return Math.max(0, Math.min(1, value));
}
export const BEATLY_CORE_VERSION = "0.2.0";
//# sourceMappingURL=index.js.map