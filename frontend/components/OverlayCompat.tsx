'use client';

import { useSocket } from '../lib/socket';
import { formatTime } from '../lib/formatTime';
import React from 'react';

// Super Compatibility Version for Yolobox Pro
// This version uses a classic HTML table for layout and inline CSS styles for everything.
// This approach maximizes compatibility with very old or limited web browsers that may not
// fully support Flexbox, CSS variables, or modern Tailwind classes.

export default function OverlayCompat() {
  const { gameState } = useSocket();

  if (!gameState.isOverlayVisible) {
    return null;
  }

  // --- Style Definitions (as JavaScript objects for inline styling) ---

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      position: 'fixed',
      bottom: '48px',
      left: '0',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      color: '#FFFFFF',
      textTransform: 'uppercase',
    },
    mainTable: {
      borderCollapse: 'collapse',
      backgroundColor: '#111827', // zinc-900
      border: '2px solid #000000',
      borderRadius: '6px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
      overflow: 'hidden'
    },
    teamCell: {
      padding: '8px 20px',
      minWidth: '320px',
      position: 'relative'
    },
    homeTeamCell: {
      backgroundColor: '#1D4ED8', // blue-800
      borderRight: '1px solid rgba(0,0,0,0.5)',
    },
    awayTeamCell: {
      backgroundColor: '#BE123C', // red-800
      borderLeft: '1px solid rgba(0,0,0,0.5)',
      textAlign: 'right'
    },
    teamName: {
      fontSize: '42px',
      fontWeight: '900',
      letterSpacing: '0.05em',
      lineHeight: '1',
    },
    teamInfoContainer: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },
    foulsTimeouts: {
        textAlign: 'right' as const,
        paddingBottom: '4px',
        marginLeft: '12px',
    },
    awayFoulsTimeouts: {
        textAlign: 'left' as const,
        paddingBottom: '4px',
        marginRight: '12px',
    },
    infoText: {
      fontSize: '12px',
      fontWeight: 'bold',
      color: 'rgba(255,255,255,0.9)',
    },
    scoreCell: {
      backgroundColor: '#000000',
      width: '110px',
      textAlign: 'center' as const,
      fontSize: '64px',
      fontWeight: '900',
      borderLeft: '2px solid rgba(255,255,255,0.1)',
    },
    awayScoreCell: {
        backgroundColor: '#000000',
        width: '110px',
        textAlign: 'center' as const,
        fontSize: '64px',
        fontWeight: '900',
        borderRight: '2px solid rgba(255,255,255,0.1)',
    },
    centerClockCell: {
      backgroundColor: '#0a0a0a',
      width: '180px',
      textAlign: 'center' as const,
      verticalAlign: 'middle',
      borderLeft: '1px solid #4B5563',
      borderRight: '1px solid #4B5563',
    },
    gameClock: {
      fontSize: '44px',
      fontWeight: 'bold',
      color: '#FBBF24', // yellow-400
    },
    periodShotClockContainer: {
        marginTop: '4px'
    },
    possessionIndicator: {
      position: 'absolute',
      bottom: '0',
      left: '0',
      width: '100%',
      height: '4px',
      backgroundColor: '#FBBF24', // yellow-400
    }
  };

  return (
    <div style={styles.container}>
      <table style={styles.mainTable}>
        <tbody>
          <tr>
            {/* ======================= HOME TEAM ======================= */}
            <td style={{...styles.teamCell, ...styles.homeTeamCell}}>
               {gameState.possession === 'HOME' && <div style={styles.possessionIndicator}></div>}
               <div style={styles.teamInfoContainer}>
                    <div>
                        <div style={styles.teamName}>{gameState.homeName}</div>
                    </div>
                    <div style={styles.foulsTimeouts}>
                        <div style={styles.infoText}>
                            FOULS: <span style={{color: '#F87171'}}>{gameState.homeFouls}</span>
                        </div>
                         <div style={styles.infoText}>
                            T.O: {gameState.homeTimeouts}
                        </div>
                    </div>
               </div>
            </td>
            <td style={styles.scoreCell}>
              {gameState.homeScore}
            </td>

            {/* ======================= CENTER CLOCK ======================= */}
            <td style={styles.centerClockCell}>
              <div style={styles.gameClock}>{formatTime(gameState.gameClockSecs || 0)}</div>
              <div style={styles.periodShotClockContainer}>
                 <span style={styles.infoText}>Q{gameState.period}</span>
                 <span style={{...styles.infoText, marginLeft: '10px', fontSize: '24px', color: gameState.shotClock <= 5 ? '#EF4444' : '#F87171' }}>
                    {gameState.shotClock.toString().padStart(2, '0')}
                 </span>
              </div>
            </td>

            {/* ======================= AWAY TEAM ======================= */}
            <td style={styles.awayScoreCell}>
               {gameState.awayScore}
            </td>
            <td style={{...styles.teamCell, ...styles.awayTeamCell}}>
                {gameState.possession === 'AWAY' && <div style={styles.possessionIndicator}></div>}
                <div style={styles.teamInfoContainer}>
                    <div style={styles.awayFoulsTimeouts}>
                        <div style={styles.infoText}>
                            FOULS: <span style={{color: '#F87171'}}>{gameState.awayFouls}</span>
                        </div>
                         <div style={styles.infoText}>
                            T.O: {gameState.awayTimeouts}
                        </div>
                    </div>
                    <div>
                        <div style={styles.teamName}>{gameState.awayName}</div>
                    </div>
               </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
