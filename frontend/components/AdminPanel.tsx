'use client';

import { useSocket } from '../lib/socket';
import { Minus, Plus, RotateCcw, Play, Pause, Square, Eye, EyeOff } from 'lucide-react';
import { formatTime, parseTime } from '../lib/formatTime';
import { useState, useEffect } from 'react';

export default function AdminPanel() {
  const { gameState, isConnected, updateState, resetState } = useSocket();

  // Local state for smooth typing
  const [homeNameInput, setHomeNameInput] = useState(gameState.homeName || '');
  const [awayNameInput, setAwayNameInput] = useState(gameState.awayName || '');

  // Sync local state when external game state changes (but not while typing)
  useEffect(() => {
    setHomeNameInput(gameState.homeName || '');
  }, [gameState.homeName]);

  useEffect(() => {
    setAwayNameInput(gameState.awayName || '');
  }, [gameState.awayName]);

  const handleScoreChange = (team: 'home' | 'away', amount: number) => {
    const key = `${team}Score` as keyof typeof gameState;
    const currentScore = gameState[key] as number;
    updateState({ [key]: Math.max(0, currentScore + amount) });
  };

  const handleFoulChange = (team: 'home' | 'away', amount: number) => {
    const key = `${team}Fouls` as keyof typeof gameState;
    const currentFouls = gameState[key] as number;
    updateState({ [key]: Math.max(0, currentFouls + amount) });
  };

  const handleTimeoutChange = (team: 'home' | 'away', amount: number) => {
     const key = `${team}Timeouts` as keyof typeof gameState;
     const currentTimeouts = gameState[key] as number;
     updateState({ [key]: Math.max(0, Math.min(3, currentTimeouts + amount)) });
  };

  const handlePeriodChange = (amount: number) => {
      updateState({ period: Math.max(1, gameState.period + amount) });
  }

  const handleQuarterScoreChange = (team: 'home' | 'away', quarterIndex: number, amount: number) => {
    const key = `${team}QuarterScores` as 'homeQuarterScores' | 'awayQuarterScores';
    const newScores = [...(gameState[key] || [0,0,0,0])];
    newScores[quarterIndex] = Math.max(0, newScores[quarterIndex] + amount);
    updateState({ [key]: newScores });
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-neutral-900 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-neutral-200">
          <h1 className="text-2xl font-extrabold text-neutral-800 tracking-tight">Basketball Control Panel</h1>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <div className="flex items-center bg-neutral-100 px-3 py-1.5 rounded-full">
              <div className={`w-2.5 h-2.5 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-bold text-neutral-600 uppercase tracking-wider">{isConnected ? 'Online' : 'Offline'}</span>
            </div>
            <button
              onClick={() => updateState({ isOverlayVisible: !gameState.isOverlayVisible })}
              className={`flex items-center px-4 py-2 rounded-lg font-bold transition-colors border ${
                gameState.isOverlayVisible 
                  ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100' 
                  : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200 border-neutral-200'
              }`}
            >
              {gameState.isOverlayVisible ? <Eye size={16} className="mr-2" /> : <EyeOff size={16} className="mr-2" />}
              {gameState.isOverlayVisible ? 'Hide Overlay' : 'Show Overlay'}
            </button>
            <button
              onClick={resetState}
              className="flex items-center px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-bold transition-colors border border-red-100"
            >
              <RotateCcw size={16} className="mr-2" />
              Reset Match
            </button>
          </div>
        </div>

        {/* Top Controls: Game Clock, Shot Clock, Period */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 flex flex-col items-center justify-center">
             <div className="flex justify-between w-full mb-3">
               <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Game Clock</span>
               <div className="flex space-x-2">
                 <button onClick={() => updateState({ isClockRunning: !gameState.isClockRunning })} className={`p-1.5 rounded-lg text-white ${gameState.isClockRunning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}`}>
                   {gameState.isClockRunning ? <Pause size={16} /> : <Play size={16} />}
                 </button>
                 <button onClick={() => updateState({ gameClockSecs: 720, isClockRunning: false })} className="p-1.5 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-700">
                   <Square size={16} />
                 </button>
               </div>
             </div>
             
             <input 
                type="text" 
                value={formatTime(gameState.gameClockSecs || 0)}
                onChange={(e) => updateState({ gameClockSecs: parseTime(e.target.value) })}
                className="text-6xl font-mono font-black text-center bg-neutral-100 border border-neutral-200 rounded-xl p-2 w-full max-w-[220px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-neutral-800"
             />
             <div className="flex space-x-2 mt-4">
                <button onClick={() => updateState({ gameClockSecs: (gameState.gameClockSecs || 0) + 1 })} className="px-4 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm font-bold text-neutral-700 transition-colors">+1s</button>
                <button onClick={() => updateState({ gameClockSecs: Math.max(0, (gameState.gameClockSecs || 0) - 1) })} className="px-4 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm font-bold text-neutral-700 transition-colors">-1s</button>
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 flex flex-col items-center justify-center">
             <div className="flex justify-between w-full mb-3">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Shot Clock</span>
             </div>
             
             <input 
                type="number" 
                value={gameState.shotClock || 0}
                onChange={(e) => updateState({ shotClock: parseInt(e.target.value) || 0 })}
                className="text-6xl font-mono font-black text-center text-red-600 bg-red-50 border border-red-100 rounded-xl p-2 w-full max-w-[160px] focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
             />
             <div className="flex space-x-2 mt-4">
                <button onClick={() => updateState({ shotClock: 24 })} className="px-5 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm font-bold text-neutral-700 transition-colors">Set 24</button>
                <button onClick={() => updateState({ shotClock: 14 })} className="px-5 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm font-bold text-neutral-700 transition-colors">Set 14</button>
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 flex flex-col items-center justify-center">
             <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Period / Quarter</span>
             <div className="flex items-center space-x-6">
                <button onClick={() => handlePeriodChange(-1)} className="p-4 bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-600 transition-colors"><Minus size={24} /></button>
                <span className="text-6xl font-black w-16 text-center tabular-nums text-neutral-800">{gameState.period}</span>
                <button onClick={() => handlePeriodChange(1)} className="p-4 bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-600 transition-colors"><Plus size={24} /></button>
             </div>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Home Team */}
          <div className="bg-white rounded-2xl shadow-sm border-t-8 border-t-blue-600 border border-neutral-200 overflow-hidden flex flex-col">
             <div className="p-6 md:p-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100">
                   <input
                      type="text"
                      value={homeNameInput}
                      onChange={(e) => {
                         const val = e.target.value.toUpperCase();
                         setHomeNameInput(val);
                         updateState({ homeName: val });
                      }}
                      className="text-3xl font-black uppercase bg-transparent focus:outline-none w-2/3 text-neutral-800 placeholder-neutral-300"
                      placeholder="HOME TEAM"
                   />
                   <button
                      onClick={() => updateState({ possession: gameState.possession === 'HOME' ? null : 'HOME' })}
                      className={`px-5 py-2.5 rounded-lg font-bold text-sm tracking-wider uppercase transition-all ${gameState.possession === 'HOME' ? 'bg-yellow-400 text-black shadow-md' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}
                    >
                      Possession
                    </button>
                </div>

                <div className="flex flex-col items-center justify-center mb-6 flex-1">
                   <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Total Score</span>
                   <span className="text-[100px] leading-none font-black tabular-nums tracking-tighter text-neutral-800 mb-6">{gameState.homeScore}</span>
                   
                   <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                      <button onClick={() => handleScoreChange('home', 1)} className="col-span-2 py-4 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-black text-xl border border-blue-200 transition-colors">+1 Point</button>
                      <button onClick={() => handleScoreChange('home', 2)} className="py-4 px-6 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-black text-2xl shadow-sm transition-colors">+2</button>
                      <button onClick={() => handleScoreChange('home', 3)} className="py-4 px-6 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-black text-2xl shadow-sm transition-colors">+3</button>
                      <button onClick={() => handleScoreChange('home', -1)} className="col-span-2 py-2 bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700 rounded-xl font-bold text-sm transition-colors">-1 (Undo)</button>
                   </div>
                </div>

                {/* Quarter Scores */}
                <div className="mb-6 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3 block text-center">Quarter Scores</span>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 1, 2, 3].map(q => (
                      <div key={q} className="flex flex-col items-center">
                        <span className="text-[10px] text-neutral-500 font-bold mb-1">Q{q+1}</span>
                        <div className="flex items-center space-x-1">
                           <button onClick={() => handleQuarterScoreChange('home', q, -1)} className="p-1 bg-white hover:bg-neutral-200 rounded text-neutral-500"><Minus size={12} /></button>
                           <span className="font-bold text-lg w-6 text-center">{gameState.homeQuarterScores?.[q] || 0}</span>
                           <button onClick={() => handleQuarterScoreChange('home', q, 1)} className="p-1 bg-white hover:bg-neutral-200 rounded text-neutral-500"><Plus size={12} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 bg-neutral-50 -mx-6 md:-mx-8 -mb-6 md:-mb-8 p-6 md:p-8 border-t border-neutral-100 mt-auto">
                   <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Fouls</span>
                      <div className="flex items-center space-x-4 bg-white px-4 py-2 rounded-xl border border-neutral-200 shadow-sm">
                        <button onClick={() => handleFoulChange('home', -1)} className="p-2 bg-neutral-50 hover:bg-neutral-100 rounded-lg text-neutral-500 transition-colors"><Minus size={18} /></button>
                        <span className="text-3xl font-black text-red-600 w-10 text-center">{gameState.homeFouls}</span>
                        <button onClick={() => handleFoulChange('home', 1)} className="p-2 bg-neutral-50 hover:bg-neutral-100 rounded-lg text-neutral-500 transition-colors"><Plus size={18} /></button>
                      </div>
                   </div>
                   <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Timeouts</span>
                      <div className="flex items-center space-x-4 bg-white px-4 py-2 rounded-xl border border-neutral-200 shadow-sm">
                        <button onClick={() => handleTimeoutChange('home', -1)} className="p-2 bg-neutral-50 hover:bg-neutral-100 rounded-lg text-neutral-500 transition-colors"><Minus size={18} /></button>
                        <span className="text-3xl font-black text-yellow-500 w-10 text-center">{gameState.homeTimeouts}</span>
                        <button onClick={() => handleTimeoutChange('home', 1)} className="p-2 bg-neutral-50 hover:bg-neutral-100 rounded-lg text-neutral-500 transition-colors"><Plus size={18} /></button>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Away Team */}
          <div className="bg-white rounded-2xl shadow-sm border-t-8 border-t-red-600 border border-neutral-200 overflow-hidden flex flex-col">
             <div className="p-6 md:p-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100 flex-row-reverse">
                   <input
                      type="text"
                      value={awayNameInput}
                      onChange={(e) => {
                         const val = e.target.value.toUpperCase();
                         setAwayNameInput(val);
                         updateState({ awayName: val });
                      }}
                      className="text-3xl font-black uppercase bg-transparent focus:outline-none w-2/3 text-neutral-800 placeholder-neutral-300 text-right"
                      placeholder="AWAY TEAM"
                      dir="rtl"
                   />
                   <button
                      onClick={() => updateState({ possession: gameState.possession === 'AWAY' ? null : 'AWAY' })}
                      className={`px-5 py-2.5 rounded-lg font-bold text-sm tracking-wider uppercase transition-all ${gameState.possession === 'AWAY' ? 'bg-yellow-400 text-black shadow-md' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}
                    >
                      Possession
                    </button>
                </div>

                <div className="flex flex-col items-center justify-center mb-6 flex-1">
                   <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Total Score</span>
                   <span className="text-[100px] leading-none font-black tabular-nums tracking-tighter text-neutral-800 mb-6">{gameState.awayScore}</span>
                   
                   <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                      <button onClick={() => handleScoreChange('away', 1)} className="col-span-2 py-4 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl font-black text-xl border border-red-200 transition-colors">+1 Point</button>
                      <button onClick={() => handleScoreChange('away', 2)} className="py-4 px-6 bg-red-600 text-white hover:bg-red-700 rounded-xl font-black text-2xl shadow-sm transition-colors">+2</button>
                      <button onClick={() => handleScoreChange('away', 3)} className="py-4 px-6 bg-red-600 text-white hover:bg-red-700 rounded-xl font-black text-2xl shadow-sm transition-colors">+3</button>
                      <button onClick={() => handleScoreChange('away', -1)} className="col-span-2 py-2 bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700 rounded-xl font-bold text-sm transition-colors">-1 (Undo)</button>
                   </div>
                </div>

                {/* Quarter Scores */}
                <div className="mb-6 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3 block text-center">Quarter Scores</span>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 1, 2, 3].map(q => (
                      <div key={q} className="flex flex-col items-center">
                        <span className="text-[10px] text-neutral-500 font-bold mb-1">Q{q+1}</span>
                        <div className="flex items-center space-x-1">
                           <button onClick={() => handleQuarterScoreChange('away', q, -1)} className="p-1 bg-white hover:bg-neutral-200 rounded text-neutral-500"><Minus size={12} /></button>
                           <span className="font-bold text-lg w-6 text-center">{gameState.awayQuarterScores?.[q] || 0}</span>
                           <button onClick={() => handleQuarterScoreChange('away', q, 1)} className="p-1 bg-white hover:bg-neutral-200 rounded text-neutral-500"><Plus size={12} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 bg-neutral-50 -mx-6 md:-mx-8 -mb-6 md:-mb-8 p-6 md:p-8 border-t border-neutral-100 mt-auto">
                   <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Fouls</span>
                      <div className="flex items-center space-x-4 bg-white px-4 py-2 rounded-xl border border-neutral-200 shadow-sm">
                        <button onClick={() => handleFoulChange('away', -1)} className="p-2 bg-neutral-50 hover:bg-neutral-100 rounded-lg text-neutral-500 transition-colors"><Minus size={18} /></button>
                        <span className="text-3xl font-black text-red-600 w-10 text-center">{gameState.awayFouls}</span>
                        <button onClick={() => handleFoulChange('away', 1)} className="p-2 bg-neutral-50 hover:bg-neutral-100 rounded-lg text-neutral-500 transition-colors"><Plus size={18} /></button>
                      </div>
                   </div>
                   <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Timeouts</span>
                      <div className="flex items-center space-x-4 bg-white px-4 py-2 rounded-xl border border-neutral-200 shadow-sm">
                        <button onClick={() => handleTimeoutChange('away', -1)} className="p-2 bg-neutral-50 hover:bg-neutral-100 rounded-lg text-neutral-500 transition-colors"><Minus size={18} /></button>
                        <span className="text-3xl font-black text-yellow-500 w-10 text-center">{gameState.awayTimeouts}</span>
                        <button onClick={() => handleTimeoutChange('away', 1)} className="p-2 bg-neutral-50 hover:bg-neutral-100 rounded-lg text-neutral-500 transition-colors"><Plus size={18} /></button>
                      </div>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
