'use client';

import { useSocket } from '../../lib/socket';
import React from 'react';

export default function WinnerPage() {
  const { gameState } = useSocket();

  if (!gameState.winner) {
    return null;
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
      // เปลี่ยนตรงนี้เป็น transparent เพื่อให้โปร่งใส 100% และใช้แค่ความเบลอ
      backgroundColor: 'transparent', 
      backdropFilter: 'blur(25px)', // เพิ่มความเบลอขึ้นอีกนิด เพื่อให้ตัวหนังสือยังคงอ่านง่ายเมื่อไม่มีสีพื้นหลัง
      WebkitBackdropFilter: 'blur(25px)',
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
          0% { transform: translate(-50%, -50%) rotate(0deg) translateZ(0); }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateZ(0); }
        }
        @keyframes winnerBgFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes winnerZoomIn {
          0% { opacity: 0; transform: scale(0.5) translateY(100px) translateZ(0); }
          60% { opacity: 1; transform: scale(1.1) translateY(-20px) translateZ(0); }
          100% { opacity: 1; transform: scale(1) translateY(0) translateZ(0); }
        }
        @keyframes winnerTrophyFloat {
          0% { transform: translateY(0) rotate(0deg) translateZ(0); filter: drop-shadow(0 0 20px rgba(255,215,0,0.5)); }
          50% { transform: translateY(-20px) rotate(5deg) translateZ(0); filter: drop-shadow(0 0 60px rgba(255,215,0,0.9)); }
          100% { transform: translateY(0) rotate(0deg) translateZ(0); filter: drop-shadow(0 0 20px rgba(255,215,0,0.5)); }
        }
        @keyframes winnerShine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes nameGlowPulse {
          /* เพิ่มความเข้มของเงาสีดำด้านหลังตัวอักษรขึ้นนิดนึง ชดเชยการเอาพื้นดำออก */
          0% { text-shadow: 0 4px 25px rgba(0,0,0,0.8), 0 0 30px ${winnerColor}; }
          50% { text-shadow: 0 4px 25px rgba(0,0,0,0.8), 0 0 60px ${winnerColor}, 0 0 90px #FFFFFF; }
          100% { text-shadow: 0 4px 25px rgba(0,0,0,0.8), 0 0 30px ${winnerColor}; }
        }
      `}</style>

      {/* ฉากหลังแสงหมุน */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '300vmax',
        height: '300vmax',
        borderRadius: '50%',
        background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(255,215,0,0.15) 30deg, transparent 60deg, rgba(255,215,0,0.15) 90deg, transparent 120deg, rgba(255,215,0,0.15) 150deg, transparent 180deg, rgba(255,215,0,0.15) 210deg, transparent 240deg, rgba(255,215,0,0.15) 270deg, transparent 300deg, rgba(255,215,0,0.15) 330deg, transparent 360deg)',
        animation: 'rotateLightFullscreen 25s linear infinite', 
        zIndex: 1,
        opacity: 0.8,
        filter: 'blur(15px)',
        willChange: 'transform', 
      }} />

      {/* เนื้อหากลางจอ */}
      <div style={{
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: 'winnerZoomIn 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        willChange: 'transform, opacity',
      }}>
        <div style={{
          fontSize: '200px',
          animation: 'winnerTrophyFloat 4s ease-in-out infinite',
          marginBottom: '20px',
          willChange: 'transform, filter',
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
          animation: 'nameGlowPulse 2.5s ease-in-out infinite',
          willChange: 'text-shadow',
        }}>
          {winnerName}
        </div>

        <div style={{
          fontSize: '60px',
          fontWeight: '900',
          color: '#FBBF24',
          letterSpacing: '0.4em',
          marginTop: '20px',
          textShadow: '0 4px 10px rgba(0,0,0,0.6)',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)',
          backgroundSize: '200% 100%',
          WebkitBackgroundClip: 'text',
          animation: 'winnerShine 3s linear infinite',
          willChange: 'background-position',
        }}>
          WIN
        </div>
      </div>
    </div>
  );
}
