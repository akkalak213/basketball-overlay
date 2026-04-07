'use client';

import { useSocket } from '../../lib/socket';
import React from 'react';

export default function WinnerPage() {
  const { gameState } = useSocket();

  if (!gameState.winner) {
    return null; // Do not render anything if there's no winner
  }

  const winnerName = gameState.winner === 'home' ? gameState.homeName : gameState.awayName;
  const winnerColor = gameState.winner === 'home' ? gameState.homeColor : gameState.awayColor;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.90)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      animation: 'winnerBgFadeIn 0.8s ease-out forwards',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes rotateLightFullscreen {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes winnerBgFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes winnerZoomIn {
          0% { opacity: 0; transform: scale(0.5) translateY(100px); }
          60% { opacity: 1; transform: scale(1.1) translateY(-20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes winnerTrophyFloat {
          0% { transform: translateY(0) rotate(0deg); filter: drop-shadow(0 0 20px rgba(255,215,0,0.5)); }
          50% { transform: translateY(-20px) rotate(5deg); filter: drop-shadow(0 0 60px rgba(255,215,0,0.9)); }
          100% { transform: translateY(0) rotate(0deg); filter: drop-shadow(0 0 20px rgba(255,215,0,0.5)); }
        }
        @keyframes winnerShine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes nameGlowPulse {
          0% { text-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 40px ${winnerColor}; }
          50% { text-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 80px ${winnerColor}, 0 0 120px #FFFFFF; }
          100% { text-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 40px ${winnerColor}; }
        }
      `}</style>

      {/* Massive Circular Shining Background to avoid square edges */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '300vmax', // Much larger than screen
        height: '300vmax',
        borderRadius: '50%', // Make it a circle
        background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(255,215,0,0.3) 30deg, transparent 60deg, rgba(255,215,0,0.3) 90deg, transparent 120deg, rgba(255,215,0,0.3) 150deg, transparent 180deg, rgba(255,215,0,0.3) 210deg, transparent 240deg, rgba(255,215,0,0.3) 270deg, transparent 300deg, rgba(255,215,0,0.3) 330deg, transparent 360deg)',
        animation: 'rotateLightFullscreen 20s linear infinite',
        zIndex: 1,
        opacity: 0.6,
        filter: 'blur(10px)', // Soften the rays
      }} />

      {/* Center Content */}
      <div style={{
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: 'winnerZoomIn 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      }}>
        <div style={{
          fontSize: '200px',
          animation: 'winnerTrophyFloat 4s ease-in-out infinite',
          marginBottom: '20px',
        }}>
          🏆
        </div>
        
        <div style={{
          fontSize: '140px',
          fontWeight: '900',
          fontStyle: 'italic',
          textTransform: 'uppercase',
          color: '#FFFFFF',
          letterSpacing: '0.05em',
          lineHeight: '1',
          textAlign: 'center',
          padding: '0 40px',
          animation: 'nameGlowPulse 2s ease-in-out infinite',
        }}>
          {winnerName}
        </div>

        <div style={{
          fontSize: '60px',
          fontWeight: '900',
          color: '#FBBF24',
          letterSpacing: '0.4em',
          marginTop: '20px',
          textShadow: '0 4px 10px rgba(0,0,0,0.8)',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent)',
          backgroundSize: '200% 100%',
          WebkitBackgroundClip: 'text',
          animation: 'winnerShine 3s linear infinite',
        }}>
          WIN
        </div>
      </div>
    </div>
  );
}
