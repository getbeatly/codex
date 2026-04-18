export interface BeatlyVariant {
    readonly id: string;
    readonly label: string;
    readonly description?: string;
}
export interface BeatlyGenre {
    readonly id: BeatlyGenreId;
    readonly label: string;
    readonly bpm: number;
    readonly tags: readonly string[];
    readonly description: string;
    readonly defaultVariant: string;
    readonly variants: readonly BeatlyVariant[];
}
export type BeatlyGenreId = "ambient" | "calming" | "deepFocus" | "lofi" | "jazzNoir" | "techno" | "dnb" | "dub" | "uplift" | "neoSoul" | "dreamPop" | "soulHop" | "cityPop" | "bossaNova" | "chillHouse" | "rainyPiano" | "sunsetGroove";
export declare const BEATLY_GENRES: readonly BeatlyGenre[];
export declare const DEFAULT_GENRE: BeatlyGenreId;
export declare function getGenre(id: BeatlyGenreId): BeatlyGenre;
export declare function getVariant(genreId: BeatlyGenreId, variantId: string): BeatlyVariant | null;
/**
 * Turn a `BeatlyGenreId` (+ optional variant) into the runtime profile id used
 * by the SuperCollider server, e.g. `"lofi" + "night" -> "lofi.night"`. Falls
 * back to the genre's `defaultVariant` when the variant is missing or unknown.
 */
export declare function resolveProfileId(genreId: BeatlyGenreId, variantId?: string | null): string;
//# sourceMappingURL=genres.d.ts.map