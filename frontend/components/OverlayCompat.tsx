'use client';

import { useSocket } from '../lib/socket';
import { formatTime } from '../lib/formatTime';

// This is a compatibility version of the Overlay component for Yolobox Pro.
// It mimics the visual style of the original Overlay but uses simpler, more widely supported CSS.
// Gradients are replaced with solid colors, complex shadows with basic ones, and all animations are removed.

export default function OverlayCompat() {
  const { gameState } = useSocket();

  if (!gameState.isOverlayVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-12 left-0 w-full flex justify-center items-end select-none antialiased font-[family-name:var(--font-oswald)] overflow-hidden">
      <div className="flex flex-col items-center shadow-2xl">
        
        {/* Main Scorebug Wrapper */}
        <div className="flex h-[80px] rounded-t-sm overflow-hidden border-b-2 border-black bg-zinc-900">
          
          {/* ======================= HOME TEAM ======================= */}
          <div className="flex items-stretch relative min-w-[320px] bg-blue-800 border-r border-black/50">
            {/* Possession Indicator Line */}
            {gameState.possession === 'HOME' && (
              <div className="absolute bottom-0 left-0 w-full h-[4px] bg-yellow-400" />
            )}

            <div className="flex-1 px-5 py-2 flex flex-col justify-center">
              <div className="flex justify-between items-end w-full">
                {/* Team Name */}
                <span className="text-[42px] font-black text-white tracking-widest uppercase leading-none truncate max-w-[200px]">
                  {gameState.homeName}
                </span>
                
                {/* Fouls & Timeouts Info */}
                <div className="flex flex-col items-end pb-1 ml-3">
                  <div className="flex space-x-1.5 mb-1.5">
                    {[...Array(3)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-[18px] h-[5px] ${
                          i < gameState.homeTimeouts 
                            ? 'bg-yellow-400' 
                            : 'bg-black/50'
                        }`} 
                      />
                    ))}
                  </div>
                  <div className="text-[12px] font-bold tracking-[0.15em] text-white/90 leading-none">
                    FOULS <span className="text-red-400 ml-1 text-[15px] font-black">{gameState.homeFouls}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Box */}
            <div className="bg-black w-[110px] flex items-center justify-center border-l-2 border-white/10">
              <span className="text-[64px] font-black text-white tabular-nums tracking-tighter leading-none">
                {gameState.homeScore}
              </span>
            </div>
          </div>

          {/* ======================= CENTER CLOCK ======================= */}
          <div className="flex flex-col items-center justify-center bg-zinc-950 w-[180px] border-x border-zinc-700/50">
             {/* Game Clock */}
             <div className="text-yellow-400 text-[44px] font-[family-name:var(--font-roboto-mono)] font-bold tracking-tight tabular-nums leading-none mt-1">
               {formatTime(gameState.gameClockSecs || 0)}
             </div>
             
             {/* Period & Shot Clock */}
             <div className="flex items-center justify-between w-full px-4 mt-1">
               <span className="text-zinc-400 text-[14px] font-bold tracking-[0.15em] uppercase leading-none">
                 Q<span className="text-white text-[16px]">{gameState.period}</span>
               </span>
               <div className="w-[1px] h-4 bg-zinc-700/80 mx-2" />
               <span className={`text-[24px] font-[family-name:var(--font-roboto-mono)] font-bold tabular-nums leading-none ${
                 gameState.shotClock <= 5 ? 'text-red-500' : 'text-white'
               }`}>
                 {gameState.shotClock.toString().padStart(2, '0')}
               </span>
             </div>
          </div>

          {/* ======================= AWAY TEAM ======================= */}
          <div className="flex items-stretch relative min-w-[320px] bg-red-800 border-l border-black/50 flex-row-reverse">
            {/* Possession Indicator Line */}
            {gameState.possession === 'AWAY' && (
              <div className="absolute bottom-0 left-0 w-full h-[4px] bg-yellow-400" />
            )}

            <div className="flex-1 px-5 py-2 flex flex-col justify-center">
              <div className="flex justify-between items-end w-full flex-row-reverse">
                {/* Team Name */}
                <span className="text-[42px] font-black text-white tracking-widest uppercase leading-none truncate max-w-[200px] text-right">
                  {gameState.awayName}
                </span>
                
                {/* Fouls & Timeouts Info */}
                <div className="flex flex-col items-start pb-1 mr-3">
                  <div className="flex space-x-1.5 mb-1.5 flex-row-reverse space-x-reverse">
                    {[...Array(3)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-[18px] h-[5px] ${
                          i < gameState.awayTimeouts 
                            ? 'bg-yellow-400' 
                            : 'bg-black/50'
                        }`} 
                      />
                    ))}
                  </div>
                  <div className="text-[12px] font-bold tracking-[0.15em] text-white/90 leading-none flex flex-row-reverse">
                    FOULS <span className="text-red-400 mr-1 text-[15px] font-black">{gameState.awayFouls}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Box */}
            <div className="bg-black w-[110px] flex items-center justify-center border-r-2 border-white/10">
              <span className="text-[64px] font-black text-white tabular-nums tracking-tighter leading-none">
                {gameState.awayScore}
              </span>
            </div>
          </div>
        </div>

        {/* ======================= QUARTER SCORES ======================= */}
        <div className="flex bg-black border border-t-0 border-white/20 rounded-b-xl px-10 py-1.5 space-x-12 -mt-1 pt-2">
           {[0, 1, 2, 3].map(q => {
             const homeScore = gameState.homeQuarterScores?.[q] || 0;
             const awayScore = gameState.awayQuarterScores?.[q] || 0;
             const isHomeWin = homeScore > awayScore;
             const isAwayWin = awayScore > homeScore;
             
             return (
               <div key={q} className="flex items-center space-x-3">
                 <span className="text-zinc-500 font-bold text-[12px] uppercase tracking-widest">Q{q+1}</span>
                 <div className="flex items-center space-x-2 font-black text-[15px] tabular-nums">
                    <span className={isHomeWin ? "text-yellow-400" : "text-white"}>{homeScore}</span>
                    <span className="text-zinc-600 text-[12px]">-</span>
                    <span className={isAwayWin ? "text-yellow-400" : "text-white"}>{awayScore}</span>
                 </div>
               </div>
             );
           })}
        </div>
      </div>
    </div>
  );
}
