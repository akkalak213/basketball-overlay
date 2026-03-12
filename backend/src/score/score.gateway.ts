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

const initialState: GameState = {
  homeName: 'HOME',
  awayName: 'AWAY',
  homeScore: 0,
  awayScore: 0,
  period: 1,
  gameClockSecs: 720,
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

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ScoreGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private state: GameState = { 
    ...initialState,
    homeQuarterScores: [...initialState.homeQuarterScores],
    awayQuarterScores: [...initialState.awayQuarterScores]
  };
  private timer: NodeJS.Timeout | null = null;

  afterInit(server: Server) {
    console.log('WebSocket Initialized');
  }

  handleConnection(client: Socket) {
    client.emit('syncState', this.state);
  }

  handleDisconnect(client: Socket) {}

  @SubscribeMessage('updateState')
  handleUpdateState(@MessageBody() updateData: Partial<GameState>): GameState {
    const wasRunning = this.state.isClockRunning;
    this.state = { ...this.state, ...updateData };

    if (this.state.isClockRunning && !wasRunning) {
      this.startTimer();
    } else if (!this.state.isClockRunning && wasRunning) {
      this.stopTimer();
    }

    this.server.emit('syncState', this.state);
    return this.state;
  }

  @SubscribeMessage('resetState')
  handleResetState(): GameState {
    this.stopTimer();
    this.state = { 
      ...initialState, 
      homeQuarterScores: [...initialState.homeQuarterScores], 
      awayQuarterScores: [...initialState.awayQuarterScores] 
    };
    this.server.emit('syncState', this.state);
    return this.state;
  }

  startTimer() {
    if (this.timer) clearInterval(this.timer);
    
    this.timer = setInterval(() => {
      let tick = false;
      
      if (this.state.gameClockSecs > 0) {
        this.state.gameClockSecs--;
        tick = true;
      }
      
      if (this.state.shotClock > 0) {
        this.state.shotClock--;
        tick = true;
      }

      // Automatically stop clock when game clock reaches 0
      if (this.state.gameClockSecs <= 0) {
        this.state.isClockRunning = false;
        this.stopTimer();
        tick = true; // emit one last time to sync the 0 and the false state
      }

      if (tick) {
        this.server.emit('syncState', this.state);
      } else {
        // Nothing changed, maybe just stop the interval
        this.stopTimer();
        this.state.isClockRunning = false;
        this.server.emit('syncState', this.state);
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
