export interface GameState {
  sportType: 'basketball3x3' | 'volleyball' | 'takraw';
  homeName: string;
  awayName: string;
  homeColor: string;
  awayColor: string;
  homeScore: number;
  awayScore: number;
  homeSetsWon: number;
  awaySetsWon: number;
  period: number;
  homeQuarterScores: number[];
  awayQuarterScores: number[];
  isOverlayVisible: boolean;
}

export const initialState: GameState = {
  sportType: 'volleyball',
  homeName: 'HOME',
  awayName: 'AWAY',
  homeColor: '#1D4ED8',
  awayColor: '#BE123C',
  homeScore: 0,
  awayScore: 0,
  homeSetsWon: 0,
  awaySetsWon: 0,
  period: 1,
  homeQuarterScores: [0, 0, 0, 0, 0],
  awayQuarterScores: [0, 0, 0, 0, 0],
  isOverlayVisible: true,
};

export interface LogoState {
  tournamentLogo: string | null;
  logoSize: number;
  logoOffset: number;
  logoOffsetX: number;
  logoAlign?: 'center' | 'left' | 'right';
}

export const initialLogoState: LogoState = {
  tournamentLogo: null,
  logoSize: 160,
  logoOffset: -30,
  logoOffsetX: 0,
  logoAlign: 'center',
};
