import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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
  scrollingText: string;
  isScrollingTextVisible: boolean;
}

export interface LogoState {
  tournamentLogo: string | null;
  logoSize: number;
  logoOffset: number;
  logoOffsetX: number;
  logoAlign: 'center' | 'left' | 'right';
}

const initialState: GameState = {
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
  scrollingText: 'enter scrolling text here',
  isScrollingTextVisible: false,
};

const initialLogoState: LogoState = {
  tournamentLogo: null,
  logoSize: 160,
  logoOffset: -30,
  logoOffsetX: 0,
  logoAlign: 'center',
};

@WebSocketGateway({
  cors: { origin: '*' },
  maxHttpBufferSize: 1e8, // 100 MB
})
export class ScoreGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private state: GameState = {
    ...initialState,
    homeQuarterScores: [...initialState.homeQuarterScores],
    awayQuarterScores: [...initialState.awayQuarterScores],
  };
  private logoState: LogoState = { ...initialLogoState };

  afterInit() {
    console.log('WebSocket Initialized');
  }

  handleConnection(client: Socket) {
    client.emit('syncState', this.state);
    client.emit('syncLogo', this.logoState);
  }

  handleDisconnect() {}

  @SubscribeMessage('updateState')
  handleUpdateState(@MessageBody() updateData: Partial<GameState>): GameState {
    this.state = { ...this.state, ...updateData };
    this.server.emit('syncState', this.state);
    return this.state;
  }

  @SubscribeMessage('updateLogo')
  handleUpdateLogo(@MessageBody() updateData: Partial<LogoState>): LogoState {
    this.logoState = { ...this.logoState, ...updateData };
    this.server.emit('syncLogo', this.logoState);
    return this.logoState;
  }

  @SubscribeMessage('resetState')
  handleResetState(): GameState {
    this.state = {
      ...initialState,
      homeQuarterScores: [...initialState.homeQuarterScores],
      awayQuarterScores: [...initialState.awayQuarterScores],
    };
    this.server.emit('syncState', this.state);
    return this.state;
  }
}
