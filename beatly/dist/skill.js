export function createBeatlySkill(conductor, options = {}) {
    const mapEventToSignal = options.mapEventToSignal ?? defaultEventToSignal;
    const mapStatusToSignal = options.mapStatusToSignal ?? defaultStatusToSignal;
    return {
        start(options) {
            return conductor.startSession(options);
        },
        async handleEvent(event) {
            const signal = mapEventToSignal(event);
            if (signal === null) {
                return null;
            }
            return conductor.updateFromSignal(signal, event.type);
        },
        async handleUpdate(update) {
            if (update.type === "agent.update") {
                const baseSignal = mapStatusToSignal(update);
                const signal = mergeSignal(baseSignal, update.signal, update.timestamp);
                return conductor.updateFromSignal(signal, update.summary ?? `agent.update:${update.status}`);
            }
            if (update.type === "playback.override") {
                return conductor.applyPlaybackOverride(update.playback);
            }
            return this.handleEvent(update);
        },
        override(playback) {
            return conductor.applyPlaybackOverride(playback);
        },
        stop(reason) {
            return conductor.stopSession(reason);
        },
    };
}
function defaultEventToSignal(event) {
    const withTimestamp = (signal) => {
        if (event.timestamp === undefined) {
            return signal;
        }
        return { ...signal, timestamp: event.timestamp };
    };
    switch (event.type) {
        case "task.started":
            return withTimestamp({ focus: 0.68, cognitiveLoad: 0.4, energy: 0.58 });
        case "task.blocked":
            return withTimestamp({ focus: 0.45, cognitiveLoad: 0.92, energy: 0.32 });
        case "task.completed":
            return withTimestamp({ focus: 0.82, cognitiveLoad: 0.28, energy: 0.86 });
        case "agent.idle":
            return withTimestamp({ focus: 0.2, cognitiveLoad: 0.08, energy: 0.18 });
        case "agent.error":
            return withTimestamp({ focus: 0.52, cognitiveLoad: 0.95, energy: 0.42 });
        case "agent.breakthrough":
            return withTimestamp({ focus: 0.9, cognitiveLoad: 0.22, energy: 0.94 });
        default:
            return null;
    }
}
function defaultStatusToSignal(update) {
    const base = (() => {
        switch (update.status) {
            case "thinking":
                return { focus: 0.72, cognitiveLoad: 0.62, energy: 0.38 };
            case "coding":
                return { focus: 0.84, cognitiveLoad: 0.42, energy: 0.68 };
            case "reviewing":
                return { focus: 0.76, cognitiveLoad: 0.5, energy: 0.46 };
            case "waiting":
                return { focus: 0.24, cognitiveLoad: 0.18, energy: 0.16 };
            case "celebrating":
                return { focus: 0.88, cognitiveLoad: 0.2, energy: 0.94 };
        }
    })();
    return update.timestamp === undefined ? base : { ...base, timestamp: update.timestamp };
}
function mergeSignal(base, patch, timestamp) {
    const merged = {
        focus: clamp01(patch?.focus ?? base.focus),
        cognitiveLoad: clamp01(patch?.cognitiveLoad ?? base.cognitiveLoad),
        energy: clamp01(patch?.energy ?? base.energy),
    };
    const nextTimestamp = timestamp ?? patch?.timestamp ?? base.timestamp;
    return nextTimestamp === undefined ? merged : { ...merged, timestamp: nextTimestamp };
}
function clamp01(value) {
    if (Number.isNaN(value)) {
        return 0;
    }
    return Math.max(0, Math.min(1, value));
}
export const BEATLY_SKILL_VERSION = "0.3.0";
//# sourceMappingURL=skill.js.map