'use client';

import { useSocket } from '../lib/socket';
import React from 'react';

// Super Compatibility Version for Yolobox Pro - V3
// This version uses a classic HTML table for layout and inline CSS styles for everything.
// Changes: Reduced overall size, removed shot clock, redesigned Fouls/Timeouts, and expanded to 5 sets.

export default function OverlayCompat() {
  const { gameState } = useSocket();

  if (!gameState.isOverlayVisible) {
    return null;
  }

  // Calculate set wins
  let homeSetWins = 0;
  let awaySetWins = 0;
  if (gameState.homeQuarterScores && gameState.awayQuarterScores) {
    for (let i = 0; i < Math.max(gameState.homeQuarterScores.length, gameState.awayQuarterScores.length); i++) {
      const homeScore = gameState.homeQuarterScores[i] || 0;
      const awayScore = gameState.awayQuarterScores[i] || 0;
      if (homeScore > awayScore) {
        homeSetWins++;
      } else if (awayScore > homeScore) {
        awaySetWins++;
      }
    }
  }

  // --- Style Definitions ---
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      position: 'fixed',
      bottom: '48px',
      left: '0',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'sans-serif',
      color: '#FFFFFF',
      textTransform: 'uppercase',
    },
    mainTable: {
      borderCollapse: 'collapse',
      backgroundColor: '#111827',
      border: '2px solid #000000',
      borderRadius: '6px 6px 0 0', // Rounded top corners
      boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
      overflow: 'hidden'
    },
    teamCell: {
      padding: '4px 16px',
      minWidth: '280px',
      position: 'relative'
    },
    homeTeamCell: {
      backgroundColor: '#1D4ED8',
      borderRight: '1px solid rgba(0,0,0,0.5)',
    },
    awayTeamCell: {
      backgroundColor: '#BE123C',
      borderLeft: '1px solid rgba(0,0,0,0.5)',
      textAlign: 'right'
    },
    teamName: {
      fontSize: '36px',
      fontWeight: '900',
      letterSpacing: '0.05em',
      lineHeight: '1',
    },
    teamInfoContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    foulsTimeouts: {
        textAlign: 'right' as const,
        marginLeft: '12px',
    },
    awayFoulsTimeouts: {
        textAlign: 'left' as const,
        marginRight: '12px',
    },
    infoText: {
      fontSize: '11px',
      fontWeight: 'bold',
      color: 'rgba(255,255,255,0.9)',
      lineHeight: '1.2'
    },
    scoreCell: {
      backgroundColor: '#000000',
      width: '90px',
      textAlign: 'center' as const,
      fontSize: '52px',
      fontWeight: '900',
      borderLeft: '2px solid rgba(255,255,255,0.1)',
    },
    awayScoreCell: {
        backgroundColor: '#000000',
        width: '90px',
        textAlign: 'center' as const,
        fontSize: '52px',
        fontWeight: '900',
        borderRight: '2px solid rgba(255,255,255,0.1)',
    },
    centerCell: {
      backgroundColor: '#0a0a0a',
      width: '160px',
      textAlign: 'center' as const,
      verticalAlign: 'middle',
      borderLeft: '1px solid #4B5563',
      borderRight: '1px solid #4B5563',
      padding: '4px 0',
    },
    vsText: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#FBBF24',
      lineHeight: '1',
    },
    setWinsContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    setScoreText: {
        fontSize: '11px',
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.9)',
    },
    setScoreNumber: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#FBBF24',
        margin: '0 8px'
    },
    setScoresContainer: {
        display: 'flex',
        backgroundColor: '#000000',
        border: '1px solid rgba(255,255,255,0.2)',
        borderTop: '0',
        borderRadius: '0 0 12px 12px',
        padding: '6px 20px',
        boxShadow: '0 10px 20px rgba(0,0,0,0.4)',
        justifyContent: 'center',
        gap: '24px',
    },
    setScorePill: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    setScoreLabel: {
        color: '#A0A0A0',
        fontWeight: 'bold',
        fontSize: '11px',
        letterSpacing: '0.05em'
    },
    setScoreValues: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        fontWeight: '900',
        fontSize: '14px',
        color: '#FFFFFF'
    }
  };

  return (
    <div style={styles.container}>
      <table style={styles.mainTable}>
        <tbody>
          <tr>
            {/* ======================= HOME TEAM ======================= */}
            <td style={{...styles.teamCell, ...styles.homeTeamCell}}>
               <div style={styles.teamInfoContainer}>
                    <div>
                        <div style={styles.teamName}>{gameState.homeName}</div>
                    </div>
                    <div style={styles.foulsTimeouts}>
                        <div style={styles.infoText}>FOULS: <span style={{color: '#F87171'}}>{gameState.homeFouls}</span></div>
                        <div style={styles.infoText}>T.O: {gameState.homeTimeouts}</div>
                    </div>
               </div>
            </td>
            <td style={styles.scoreCell}>
              {gameState.homeScore}
            </td>

            {/* ======================= CENTER SECTION ======================= */}
            <td style={styles.centerCell}>
              <div style={styles.vsText}>VS</div>
              <div style={styles.setWinsContainer}>
                 <span style={styles.setScoreNumber}>{homeSetWins}</span>
                 <span style={styles.setScoreText}>SETS</span>
                 <span style={styles.setScoreNumber}>{awaySetWins}</span>
              </div>
              <div style={styles.setScoreText}>SET {gameState.period}</div>
            </td>

            {/* ======================= AWAY TEAM ======================= */}
            <td style={styles.awayScoreCell}>
               {gameState.awayScore}
            </td>
            <td style={{...styles.teamCell, ...styles.awayTeamCell}}>
                <div style={styles.teamInfoContainer}>
                    <div style={styles.awayFoulsTimeouts}>
                        <div style={styles.infoText}>FOULS: <span style={{color: '#F87171'}}>{gameState.awayFouls}</span></div>
                        <div style={styles.infoText}>T.O: {gameState.awayTimeouts}</div>
                    </div>
                    <div>
                        <div style={styles.teamName}>{gameState.awayName}</div>
                    </div>
               </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      {/* ======================= SET SCORES ======================= */}
      <div style={styles.setScoresContainer}>
         {[0, 1, 2, 3, 4].map(q => {
           const homeScore = gameState.homeQuarterScores?.[q];
           const awayScore = gameState.awayQuarterScores?.[q];

           // Don't render the set if scores are not yet available
           if (homeScore === undefined || awayScore === undefined) return null;

           const isHomeWin = homeScore > awayScore;
           const isAwayWin = awayScore > homeScore;
           
           return (
             <div key={q} style={styles.setScorePill}>
               <span style={styles.setScoreLabel}>SET{q+1}</span>
               <div style={styles.setScoreValues}>
                  <span style={{color: isHomeWin ? '#FBBF24' : '#FFFFFF'}}>{homeScore}</span>
                  <span style={{color: '#4B5563', fontSize: '11px'}}>-</span>
                  <span style={{color: isAwayWin ? '#FBBF24' : '#FFFFFF'}}>{awayScore}</span>
               </div>
             </div>
           );
         })}
      </div>
    </div>
  );
}
