// The browser build's pure game modules — the rules (src/rules.js: group
// moves, legality and the refusal reasons, terminal states, scoring, the
// BFS solver, the hint, hashing), the versioned content (src/content.js:
// themes, palettes, glyphs, the 48 Journey stages, lessons, Daily, Practice,
// Challenges, Score Chase) and the session with its command log, undo stack,
// replay envelope, snapshot, local boards, cloud document merge and
// achievements (src/session.js) — imported unchanged (allowJs) and typed
// here with the shapes this client reads.
import * as RulesJs from "../src/rules.js";
import * as ContentJs from "../src/content.js";
import * as SessionJs from "../src/session.js";

export interface State {
  pegs: number[][]; cap: number; colors: number; seed: number; moves: number; invalid: number; undos: number;
  tick: number; status: "active" | "won" | "lost"; terminal: string | null; moveLimit: number | null;
}
export interface Score {
  completion: number; efficiency: number; mastery: number; invalidPenalty: number; total: number;
  solved: boolean; moves: number; par: number; elapsedMs: number; sessionId?: string; mode?: string;
}
export interface Step { expect: { from: number; to: number } | null; prompt: string }
export interface RecordT {
  id: string; version: number; seed: number; colors: number; cap: number; pegCount: number; pegs: number[][]; par: number;
  moveLimit: number | null; timeTargetMs: number | null; theme: string; title?: string; difficulty?: number; day?: number;
  tutorial: { title: string; text: string; steps: Step[] } | null;
  challenge?: { kind: string; text: string }; noUndo?: boolean;
}
export interface Theme { id: string; name: string; bg: number; floor: number; brass: number; ambient: number; key: number; accent: string }
export interface Move { from: number; to: number }
export interface CmdResult { ok: boolean; reason?: string; duplicate?: boolean }
export interface Session {
  record: RecordT; mode: string; state: State; commands: { id: string; type: string; from?: number; to?: number }[];
  snapshots: State[]; result: Score | null; tutorial: { step: number } | null; readonly status: string;
  applyCommand(cmd: { id: string; type: string; from?: number; to?: number }): CmdResult;
  elapsedMs(): number; finish(): void; hint(): Move | null;
}
export interface Progress {
  version: number; journeyUnlocked: number; journeyDone: Record<string, boolean>; lessonsDone: Record<string, boolean>;
  dailyDays: number[]; achievements: Record<string, number>; roundsCompleted: number; bestScores: Record<string, number>;
}
export interface ScoreEntry { score: number; moves: number; invalid: number; elapsedMs: number; mode: string; contentId: string; day: number | null; at: number }
export interface Achievement { id: string; name: string; text: string }
export interface Doc { v: number; savedAt: number; progress: unknown; settings: unknown; scores: unknown }

interface RulesApi {
  mulberry32(seed: number): () => number;
  fnv1a(s: string): number;
  topGroup(s: State, peg: number): { color: number; size: number } | null;
  legalActions(s: State): Move[];
  scoreComponents(s: State, par: number, elapsedMs: number): Score;
}
interface ContentApi {
  THEMES: Theme[]; PALETTES: Record<string, string[]>; COLOR_GLYPHS: string[]; COLOR_NAMES: string[];
  journeyCount: number; LESSONS: { id: string; title: string; text: string; steps: Step[] }[];
  CHALLENGES: { id: string; kind: string; title: string; text: string; difficulty: number }[];
  getTheme(id: string): Theme;
  getJourneyStage(i: number): RecordT; getLesson(i: number): RecordT; getDaily(day: number): RecordT;
  getPractice(difficulty: number, salt: number): RecordT; getChallenge(i: number, salt: number): RecordT; getScoreChase(salt: number): RecordT;
}
interface SessionApi {
  Session: (new (record: RecordT, opts?: { mode?: string }) => Session) & { restore(snap: unknown): Session | null };
  ACHIEVEMENTS: Achievement[];
  loadProgress(): Progress; saveProgress(p: Progress): void;
  saveSnapshot(s: Session | null): void; loadSnapshot(): Session | null; clearSnapshot(): void;
  recordScore(entry: Record<string, unknown>): ScoreEntry; getScores(board: string, day?: number | null): ScoreEntry[];
  exportDoc(): Doc; importDoc(doc: unknown): boolean; mergeDocs(remote: unknown, local: unknown): Doc;
  checkAchievements(p: Progress, s: Session): string[];
  track(name: string): void; setClock(fn: (() => number) | null): void;
}

export const Rules = RulesJs as unknown as RulesApi;
export const Content = ContentJs as unknown as ContentApi;
export const Sess = SessionJs as unknown as SessionApi;
