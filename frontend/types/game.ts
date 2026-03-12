export interface GameState {
  homeName: string;
  awayName: string;
  homeScore: number;
  awayScore: number;
  period: number;
  gameClockSecs: number;
  shotClock: number;
  isClockRunning: boolean;
  homeFouls: number;
  awayFouls: number;
  homeTimeouts: number;
  awayTimeouts: number;
  possession: 'HOME' | 'AWAY' | null;
  homeQuarterScores: number[];
  awayQuarterScores: number[];
  isOverlayVisible: boolean;
}

export const initialState: GameState = {
  homeName: 'HOME',
  awayName: 'AWAY',
  homeScore: 0,
  awayScore: 0,
  period: 1,
  gameClockSecs: 720, // 12 minutes
  shotClock: 24,
  isClockRunning: false,
  homeFouls: 0,
  awayFouls: 0,
  homeTimeouts: 3,
  awayTimeouts: 3,
  possession: null,
  homeQuarterScores: [0, 0, 0, 0],
  awayQuarterScores: [0, 0, 0, 0],
  isOverlayVisible: true,
};
