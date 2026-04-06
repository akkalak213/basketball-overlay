'use client';

import { useSocket } from '../lib/socket';
import React from 'react';

// Multi-Sport Compatible Overlay with Logo Support
export default function OverlayCompat() {
  const { gameState, logoState } = useSocket();

  if (!gameState.isOverlayVisible) {
    return null;
  }

  // Fallback colors if not set
  const homeColor = gameState.homeColor || '#1D4ED8';
  const awayColor = gameState.awayColor || '#BE123C';

  const isBasketball = gameState.sportType === 'basketball3x3';
  const numSets = gameState.sportType === 'takraw' ? 3 : 5;
  const showSets = gameState.sportType === 'volleyball' || gameState.sportType === 'takraw';

  // --- Style Definitions ---
  const isLogoLeft = logoState.logoAlign === 'left';
  const isLogoCenter = logoState.logoAlign === 'center' || !logoState.logoAlign;

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
    wrapper: {
      display: 'flex',
      flexDirection: isLogoCenter ? 'column' : (isLogoLeft ? 'row' : 'row-reverse'),
      alignItems: isLogoCenter ? 'center' : 'flex-end',
      justifyContent: 'center',
      gap: isLogoCenter ? '0' : '20px',
    },
    logoContainer: {
      position: 'relative',
      zIndex: 0,
      marginBottom: isLogoCenter ? `${logoState.logoOffset ?? -30}px` : `${logoState.logoOffset ?? 0}px`,
      left: `${logoState.logoOffsetX ?? 0}px`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))',
    },
    logoImage: {
      maxHeight: `${logoState.logoSize || 160}px`, // ขยายหรือลดขนาดตามใจชอบ
      maxWidth: '600px',
      objectFit: 'contain',
    },
    scoreboardWrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      zIndex: 10,
    },
    mainTable: {
      borderCollapse: 'collapse',
      backgroundColor: '#111827',
      border: '2px solid #000000',
      borderRadius: showSets ? '6px 6px 0 0' : '6px', // Rounded top corners or all corners
      boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
      overflow: 'hidden'
    },
    teamCell: {
      padding: '4px 24px',
      minWidth: '280px',
      position: 'relative',
    },
    homeTeamCell: {
      backgroundColor: homeColor,
      borderRight: '1px solid rgba(0,0,0,0.5)',
      textAlign: 'center'
    },
    awayTeamCell: {
      backgroundColor: awayColor,
      borderLeft: '1px solid rgba(0,0,0,0.5)',
      textAlign: 'center'
    },
    teamName: {
      fontSize: '40px',
      fontWeight: '900',
      letterSpacing: '0.05em',
      lineHeight: '1',
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
    },
    scoreCell: {
      backgroundColor: '#000000',
      width: '100px',
      textAlign: 'center' as const,
      fontSize: '56px',
      fontWeight: '900',
      borderLeft: '2px solid rgba(255,255,255,0.1)',
      borderRight: '2px solid rgba(255,255,255,0.1)',
    },
    centerCell: {
      backgroundColor: '#0a0a0a',
      width: '160px',
      textAlign: 'center' as const,
      verticalAlign: 'middle',
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
      <style>{`
        @keyframes subtleFloat {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
        @keyframes slideUpFade {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes subtleGlow {
          0% { box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
          50% { box-shadow: 0 10px 35px rgba(255,255,255,0.1); }
          100% { box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
        }
        .animated-logo-entrance {
          animation: slideUpFade 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animated-logo-float {
          animation: subtleFloat 4s ease-in-out infinite;
        }
        .animated-scoreboard {
          animation: slideUpFade 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards, subtleGlow 6s ease-in-out infinite;
          opacity: 0; /* Starts hidden until animation plays */
        }
        .animated-sets {
          animation: slideUpFade 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
          opacity: 0;
        }
      `}</style>

      <div style={styles.wrapper}>
        {/* ======================= LOGO SECTION ======================= */}
        {logoState.tournamentLogo && (
          <div className="animated-logo-entrance">
            <div style={styles.logoContainer} className="animated-logo-float">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoState.tournamentLogo} alt="Tournament Logo" style={styles.logoImage} />
            </div>
          </div>
        )}

        <div style={styles.scoreboardWrapper}>
          <table style={styles.mainTable} className="animated-scoreboard">
            <tbody>
              <tr>
                {/* ======================= HOME TEAM ======================= */}
                <td style={{...styles.teamCell, ...styles.homeTeamCell}}>
                   <div style={styles.teamName}>{gameState.homeName}</div>
                </td>
                <td style={styles.scoreCell}>
                  {gameState.homeScore}
                </td>

                {/* ======================= CENTER SECTION ======================= */}
                <td style={styles.centerCell}>
                  {isBasketball ? (
                    <>
                      <div style={styles.vsText}>VS</div>
                      <div style={{...styles.setScoreText, marginTop: '8px'}}>PERIOD {gameState.period}</div>
                    </>
                  ) : (
                    <>
                      <div style={styles.vsText}>VS</div>
                      <div style={styles.setWinsContainer}>
                         <span style={styles.setScoreNumber}>{gameState.homeSetsWon}</span>
                         <span style={styles.setScoreText}>SETS</span>
                         <span style={styles.setScoreNumber}>{gameState.awaySetsWon}</span>
                      </div>
                      <div style={styles.setScoreText}>SET {gameState.period}</div>
                    </>
                  )}
                </td>

                {/* ======================= AWAY TEAM ======================= */}
                <td style={styles.scoreCell}>
                   {gameState.awayScore}
                </td>
                <td style={{...styles.teamCell, ...styles.awayTeamCell}}>
                    <div style={styles.teamName}>{gameState.awayName}</div>
                </td>
              </tr>
            </tbody>
          </table>
          
          {/* ======================= SET SCORES ======================= */}
          {showSets && (
            <div style={styles.setScoresContainer} className="animated-sets">
               {Array.from({ length: numSets }).map((_, q) => {
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
          )}
        </div>
      </div>
    </div>
  );
}