'use client';

import { useSocket } from '../lib/socket';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTime } from '../lib/formatTime';

export default function Overlay() {
  const { gameState } = useSocket();

  return (
    <div className="fixed bottom-12 left-0 w-full flex justify-center items-end select-none antialiased font-[family-name:var(--font-oswald)] overflow-hidden">
      <AnimatePresence>
        {gameState.isOverlayVisible && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
            className="flex flex-col items-center drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
          >
        
        {/* Main Scorebug Wrapper */}
        <div className="flex h-[80px] rounded-sm overflow-hidden border-b-4 border-black bg-gradient-to-b from-zinc-800 to-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
          
          {/* ======================= HOME TEAM ======================= */}
          <div className="flex items-stretch relative min-w-[320px] bg-gradient-to-b from-blue-700 to-blue-900 border-r border-black/50">
            {/* TV Broadcast Gloss/Shine */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
            
            {/* Possession Indicator Line */}
            {gameState.possession === 'HOME' && (
              <div className="absolute bottom-0 left-0 w-full h-[4px] bg-yellow-400 shadow-[0_-2px_8px_rgba(250,204,21,0.8)]" />
            )}

            <div className="flex-1 px-5 py-2 flex flex-col justify-center relative z-10">
              <div className="flex justify-between items-end w-full">
                {/* Team Name */}
                <span className="text-[42px] font-black text-white tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-none truncate max-w-[200px]">
                  {gameState.homeName}
                </span>
                
                {/* Fouls & Timeouts Info */}
                <div className="flex flex-col items-end pb-1 ml-3">
                  <div className="flex space-x-1.5 mb-1.5">
                    {[...Array(3)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-[18px] h-[5px] skew-x-[-20deg] ${
                          i < gameState.homeTimeouts 
                            ? 'bg-yellow-400 shadow-[0_0_4px_rgba(250,204,21,0.8)]' 
                            : 'bg-black/60 shadow-inner'
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
            <div className="bg-gradient-to-b from-zinc-900 to-black w-[110px] flex items-center justify-center border-l-2 border-white/10 relative z-10 shadow-[-10px_0_15px_rgba(0,0,0,0.5)]">
               <AnimatePresence mode="popLayout">
                  <motion.span
                    key={gameState.homeScore}
                    initial={{ y: -15, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 15, opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="text-[64px] font-black text-white tabular-nums tracking-tighter leading-none"
                  >
                    {gameState.homeScore}
                  </motion.span>
               </AnimatePresence>
            </div>
          </div>

          {/* ======================= CENTER CLOCK ======================= */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-b from-black via-zinc-900 to-black w-[180px] relative z-20 shadow-[0_0_20px_rgba(0,0,0,0.8)] border-x border-zinc-700/50">
             {/* Gloss */}
             <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20" />
             
             {/* Game Clock */}
             <div className="text-yellow-400 text-[44px] font-[family-name:var(--font-roboto-mono)] font-bold tracking-tight tabular-nums drop-shadow-[0_0_10px_rgba(250,204,21,0.2)] leading-none mt-1">
               {formatTime(gameState.gameClockSecs || 0)}
             </div>
             
             {/* Period & Shot Clock */}
             <div className="flex items-center justify-between w-full px-4 mt-1">
               <span className="text-zinc-400 text-[14px] font-bold tracking-[0.15em] uppercase leading-none">
                 Q<span className="text-white text-[16px]">{gameState.period}</span>
               </span>
               <div className="w-[1px] h-4 bg-zinc-700/80 mx-2" />
               <span className={`text-[24px] font-[family-name:var(--font-roboto-mono)] font-bold tabular-nums leading-none ${
                 gameState.shotClock <= 5 
                  ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse' 
                  : 'text-red-400'
               }`}>
                 {gameState.shotClock.toString().padStart(2, '0')}
               </span>
             </div>
          </div>

          {/* ======================= AWAY TEAM ======================= */}
          <div className="flex items-stretch relative min-w-[320px] bg-gradient-to-b from-red-700 to-red-900 border-l border-black/50 flex-row-reverse">
            {/* TV Broadcast Gloss/Shine */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
            
            {/* Possession Indicator Line */}
            {gameState.possession === 'AWAY' && (
              <div className="absolute bottom-0 left-0 w-full h-[4px] bg-yellow-400 shadow-[0_-2px_8px_rgba(250,204,21,0.8)]" />
            )}

            <div className="flex-1 px-5 py-2 flex flex-col justify-center relative z-10">
              <div className="flex justify-between items-end w-full flex-row-reverse">
                {/* Team Name */}
                <span className="text-[42px] font-black text-white tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-none truncate max-w-[200px] text-right">
                  {gameState.awayName}
                </span>
                
                {/* Fouls & Timeouts Info */}
                <div className="flex flex-col items-start pb-1 mr-3">
                  <div className="flex space-x-1.5 mb-1.5 flex-row-reverse space-x-reverse">
                    {[...Array(3)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-[18px] h-[5px] skew-x-[-20deg] ${
                          i < gameState.awayTimeouts 
                            ? 'bg-yellow-400 shadow-[0_0_4px_rgba(250,204,21,0.8)]' 
                            : 'bg-black/60 shadow-inner'
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
            <div className="bg-gradient-to-b from-zinc-900 to-black w-[110px] flex items-center justify-center border-r-2 border-white/10 relative z-10 shadow-[10px_0_15px_rgba(0,0,0,0.5)]">
               <AnimatePresence mode="popLayout">
                  <motion.span
                    key={gameState.awayScore}
                    initial={{ y: -15, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 15, opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="text-[64px] font-black text-white tabular-nums tracking-tighter leading-none"
                  >
                    {gameState.awayScore}
                  </motion.span>
               </AnimatePresence>
            </div>
          </div>

        </div>

        {/* ======================= QUARTER SCORES ======================= */}
        <div className="flex bg-gradient-to-b from-black to-zinc-900 border border-t-0 border-white/20 rounded-b-xl px-10 py-1.5 space-x-12 shadow-2xl relative z-0 -mt-1 pt-2">
           {[0, 1, 2, 3].map(q => {
             const homeScore = gameState.homeQuarterScores?.[q] || 0;
             const awayScore = gameState.awayQuarterScores?.[q] || 0;
             const isHomeWin = homeScore > awayScore;
             const isAwayWin = awayScore > homeScore;
             
             return (
               <div key={q} className="flex items-center space-x-3">
                 <span className="text-zinc-500 font-bold text-[12px] uppercase tracking-widest">Q{q+1}</span>
                 <div className="flex items-center space-x-2 font-black text-[15px] tabular-nums">
                    <span className={isHomeWin ? "text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]" : "text-white"}>{homeScore}</span>
                    <span className="text-zinc-600 text-[12px]">-</span>
                    <span className={isAwayWin ? "text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]" : "text-white"}>{awayScore}</span>
                 </div>
               </div>
             );
           })}
        </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
