export interface BeatlyGenre {
    readonly id: BeatlyGenreId;
    readonly label: string;
    readonly bpm: number;
    readonly tags: readonly string[];
    readonly description: string;
}
export type BeatlyGenreId = "ambient" | "calming" | "deepFocus" | "lofi" | "jazzNoir" | "techno" | "dnb" | "dub" | "uplift" | "neoSoul" | "dreamPop" | "soulHop" | "cityPop" | "bossaNova" | "chillHouse" | "rainyPiano" | "sunsetGroove";
export declare const BEATLY_GENRES: readonly BeatlyGenre[];
export declare const DEFAULT_GENRE: BeatlyGenreId;
export declare function getGenre(id: BeatlyGenreId): BeatlyGenre;
//# sourceMappingURL=genres.d.ts.map