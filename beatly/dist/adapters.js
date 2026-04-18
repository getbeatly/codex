import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { resolve } from "node:path";
export class SuperColliderHelloAdapter {
    id = "beatly-supercollider";
    baseUrl;
    autostart;
    serverCwd;
    serverScript;
    spawnCommand;
    spawnArgs;
    startupTimeoutMs;
    child = null;
    constructor(options = {}) {
        this.baseUrl = options.baseUrl ?? "http://127.0.0.1:8080";
        this.autostart = options.autostart ?? false;
        this.serverCwd = resolve(options.serverCwd ?? "./supercollider");
        this.serverScript = options.serverScript ?? "server.js";
        this.spawnCommand = options.spawnCommand ?? "node";
        this.spawnArgs = options.spawnArgs ?? [this.serverScript];
        this.startupTimeoutMs = options.startupTimeoutMs ?? 15_000;
    }
    async ensureReady() {
        try {
            return await this.getState();
        }
        catch (error) {
            if (!this.autostart) {
                throw error;
            }
        }
        await this.startServer();
        return this.waitForReady();
    }
    async startServer() {
        if (this.child !== null) {
            return;
        }
        await access(resolve(this.serverCwd, this.serverScript), fsConstants.R_OK);
        this.child = spawn(this.spawnCommand, [...this.spawnArgs], {
            cwd: this.serverCwd,
            stdio: "inherit",
            env: process.env,
        });
        this.child.once("exit", () => {
            this.child = null;
        });
    }
    async getState() {
        const response = await fetch(`${this.baseUrl}/api/state`);
        if (!response.ok) {
            throw new Error(`Failed to read SuperCollider state: ${response.status} ${response.statusText}`);
        }
        return (await response.json());
    }
    async setProfile(profile, seed) {
        return this.postControl({ profile, seed });
    }
    async setGenre(genre, variant, seed) {
        return this.postControl({ genre, variant, seed });
    }
    async setVariant(variant) {
        return this.postControl({ variant });
    }
    async setRunning(running) {
        return this.postControl({ running });
    }
    async randomize() {
        return this.postControl({ randomize: true });
    }
    async applyDirective(directive) {
        const profile = directive.variant ? `${directive.genre}.${directive.variant}` : directive.genre;
        return this.postControl({
            profile,
            seed: directive.seed,
            running: directive.running,
        });
    }
    async sendAgentEvent(payload) {
        return this.postAgent(payload);
    }
    async panic() {
        const response = await fetch(`${this.baseUrl}/api/panic`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({}),
        });
        if (!response.ok) {
            throw new Error(`Failed to panic SuperCollider server: ${response.status} ${response.statusText}`);
        }
    }
    stopServer() {
        if (this.child === null) {
            return;
        }
        this.child.kill("SIGTERM");
        this.child = null;
    }
    async waitForReady() {
        const startedAt = Date.now();
        while (Date.now() - startedAt < this.startupTimeoutMs) {
            try {
                return await this.getState();
            }
            catch {
                await sleep(250);
            }
        }
        throw new Error(`Timed out waiting for SuperCollider server at ${this.baseUrl}`);
    }
    async postControl(body) {
        const response = await fetch(`${this.baseUrl}/api/control`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`Failed to control SuperCollider server: ${response.status} ${response.statusText}`);
        }
        const payload = (await response.json());
        return payload.state ?? this.getState();
    }
    async postAgent(body) {
        const response = await fetch(`${this.baseUrl}/api/agent`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`Failed to send agent event: ${response.status} ${response.statusText}`);
        }
        const payload = (await response.json());
        return payload.state ?? this.getState();
    }
}
export class ConsoleDirectiveAdapter {
    id = "console";
    async applyDirective(directive) {
        console.info("[beatly] playback directive", directive);
    }
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
//# sourceMappingURL=adapters.js.map