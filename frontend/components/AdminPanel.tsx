'use client';

import { useSocket } from '../lib/socket';
import { Minus, Plus, RotateCcw, Eye, EyeOff, Trophy, Activity, Image as ImageIcon, X, ArrowRightLeft, Type } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function AdminPanel() {
  const { gameState, logoState, isConnected, updateState, updateLogo, resetState } = useSocket();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [homeNameInput, setHomeNameInput] = useState(gameState.homeName || '');
  const [awayNameInput, setAwayNameInput] = useState(gameState.awayName || '');
  const [scrollingTextInput, setScrollingTextInput] = useState(gameState.scrollingText || '');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHomeNameInput(gameState.homeName || '');
  }, [gameState.homeName]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAwayNameInput(gameState.awayName || '');
  }, [gameState.awayName]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setScrollingTextInput(gameState.scrollingText || '');
  }, [gameState.scrollingText]);

  // Auto-calculate sets won
  useEffect(() => {
    if (gameState.sportType === 'volleyball' || gameState.sportType === 'takraw') {
      const numSets = gameState.sportType === 'takraw' ? 3 : 5;
      let hw = 0;
      let aw = 0;
      for (let i = 0; i < numSets; i++) {
        const h = gameState.homeQuarterScores?.[i] || 0;
        const a = gameState.awayQuarterScores?.[i] || 0;
        if (h === 0 && a === 0) continue; // Skip unplayed sets
        if (h > a) hw++;
        else if (a > h) aw++;
      }
      if (hw !== gameState.homeSetsWon || aw !== gameState.awaySetsWon) {
        updateState({ homeSetsWon: hw, awaySetsWon: aw });
      }
    }
  }, [gameState.homeQuarterScores, gameState.awayQuarterScores, gameState.sportType, gameState.homeSetsWon, gameState.awaySetsWon, updateState]);

  const handleScoreChange = (team: 'home' | 'away', amount: number) => {
    const key = `${team}Score` as keyof typeof gameState;
    const currentScore = (gameState[key] as number) || 0;
    updateState({ [key]: Math.max(0, currentScore + amount) });
  };

  const handlePeriodChange = (amount: number) => {
      updateState({ period: Math.max(1, gameState.period + amount) });
  }

  const handleQuarterScoreInputChange = (team: 'home' | 'away', quarterIndex: number, value: string) => {
    const key = `${team}QuarterScores` as 'homeQuarterScores' | 'awayQuarterScores';
    const newScores = [...(gameState[key] || [0,0,0,0,0])];
    // Allow empty string to mean 0 so backspace works
    newScores[quarterIndex] = value === '' ? 0 : (parseInt(value) || 0);
    updateState({ [key]: newScores });
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Client-side compression to avoid slow websocket transfers
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_HEIGHT = 400; // Resize large images for overlay display safely
          let width = img.width;
          let height = img.height;

          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL('image/png', 0.8);
            updateLogo({ tournamentLogo: compressedBase64 });
          } else {
            updateLogo({ tournamentLogo: reader.result as string });
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const clearLogo = () => {
    updateLogo({ tournamentLogo: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSwapSides = () => {
    updateState({
      homeName: gameState.awayName,
      awayName: gameState.homeName,
      homeColor: gameState.awayColor,
      awayColor: gameState.homeColor,
      homeScore: gameState.awayScore,
      awayScore: gameState.homeScore,
      homeSetsWon: gameState.awaySetsWon,
      awaySetsWon: gameState.homeSetsWon,
      homeQuarterScores: gameState.awayQuarterScores,
      awayQuarterScores: gameState.homeQuarterScores,
    });
  };

  const numSets = gameState.sportType === 'takraw' ? 3 : 5;
  const showSets = gameState.sportType === 'volleyball' || gameState.sportType === 'takraw';

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-neutral-900 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header & Sport Selection */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <h1 className="text-2xl font-extrabold text-neutral-800 tracking-tight flex items-center">
               <Activity className="mr-3 text-blue-600" />
               Multi-Sport Control Panel
            </h1>
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
                onClick={handleSwapSides}
                className="flex items-center px-4 py-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg font-bold transition-colors border border-purple-100"
              >
                <ArrowRightLeft size={16} className="mr-2" />
                Swap Sides
              </button>
              <button
                onClick={() => updateState({ homeScore: 0, awayScore: 0 })}
                className="flex items-center px-4 py-2 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 rounded-lg font-bold transition-colors border border-yellow-100"
              >
                <RotateCcw size={16} className="mr-2" />
                Reset Score
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
          
          <div className="flex flex-wrap gap-4">
             <button 
                onClick={() => updateState({ sportType: 'basketball3x3' })}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${gameState.sportType === 'basketball3x3' ? 'bg-neutral-800 text-white shadow-md' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
             >
                🏀 Basketball 3x3
             </button>
             <button 
                onClick={() => updateState({ sportType: 'volleyball' })}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${gameState.sportType === 'volleyball' ? 'bg-blue-600 text-white shadow-md' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
             >
                🏐 Volleyball (5 Sets)
             </button>
             <button 
                onClick={() => updateState({ sportType: 'takraw' })}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${gameState.sportType === 'takraw' ? 'bg-green-600 text-white shadow-md' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
             >
                🦵 Sepak Takraw (3 Sets)
             </button>
          </div>
        </div>

        {/* Top Controls: Period & Logo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 flex flex-col items-center justify-center w-full">
             <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3 flex items-center">
               <ImageIcon size={14} className="mr-1.5" /> Tournament Logo
             </span>
             <div className="flex flex-col items-center space-y-4 w-full">
                {logoState.tournamentLogo ? (
                  <div className="flex flex-col w-full items-center space-y-3">
                    <div className="relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={logoState.tournamentLogo} alt="Tournament Logo" className="h-20 object-contain rounded-lg border border-neutral-200 p-1" />
                      <button onClick={clearLogo} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100">
                        <X size={14} />
                      </button>
                    </div>
                    
                    <div className="w-full max-w-62.5 space-y-2">
                      <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-neutral-500 flex justify-between">
                          <span>Size (Height)</span>
                          <span>{logoState.logoSize || 160}px</span>
                        </label>
                        <input 
                          type="range" min="50" max="400" 
                          value={logoState.logoSize || 160}
                          onChange={(e) => updateLogo({ logoSize: parseInt(e.target.value) })}
                          className="w-full accent-blue-600 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-neutral-500 flex justify-between">
                          <span>Vertical Offset (Y)</span>
                          <span>{logoState.logoOffset ?? -30}px</span>
                        </label>
                        <input 
                          type="range" min="-150" max="50" 
                          value={logoState.logoOffset ?? -30}
                          onChange={(e) => updateLogo({ logoOffset: parseInt(e.target.value) })}
                          className="w-full accent-blue-600 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-neutral-500 flex justify-between">
                          <span>Horizontal Offset (X)</span>
                          <span>{logoState.logoOffsetX ?? 0}px</span>
                        </label>
                        <input 
                          type="range" min="-300" max="300" 
                          value={logoState.logoOffsetX ?? 0}
                          onChange={(e) => updateLogo({ logoOffsetX: parseInt(e.target.value) })}
                          className="w-full accent-blue-600 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-neutral-500 flex justify-between mb-1">
                          <span>Alignment</span>
                        </label>
                        <div className="flex gap-2">
                          {['left', 'center', 'right'].map(align => (
                            <button
                              key={align}
                              onClick={() => updateLogo({ logoAlign: align as 'left' | 'center' | 'right' })}
                              className={`flex-1 py-1 text-xs font-bold rounded border ${
                                (logoState.logoAlign || 'center') === align 
                                  ? 'bg-blue-50 text-blue-600 border-blue-200' 
                                  : 'bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50'
                              }`}
                            >
                              {align.charAt(0).toUpperCase() + align.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-20 flex items-center justify-center border-2 border-dashed border-neutral-300 rounded-lg w-full max-w-50 text-neutral-400 text-sm">
                    No Logo Selected
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoUpload} 
                  ref={fileInputRef}
                  className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 max-w-62.5"
                />
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 flex flex-col items-center justify-center w-full">
             <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">
               {showSets ? 'Current Set' : 'Period'}
             </span>
             <div className="flex items-center space-x-6">
                <button onClick={() => handlePeriodChange(-1)} className="p-4 bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-600 transition-colors"><Minus size={24} /></button>
                <span className="text-6xl font-black w-16 text-center tabular-nums text-neutral-800">{gameState.period}</span>
                <button onClick={() => handlePeriodChange(1)} className="p-4 bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-600 transition-colors"><Plus size={24} /></button>
             </div>
          </div>
        </div>

        {/* Scrolling Text Control */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 mb-6">
          <div className="flex items-center justify-between mb-4">
             <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center">
               <Type size={14} className="mr-1.5" /> Scrolling Text
             </span>
             <button
                onClick={() => updateState({ isScrollingTextVisible: !gameState.isScrollingTextVisible })}
                className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-bold transition-colors border ${
                  gameState.isScrollingTextVisible 
                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100' 
                    : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200 border-neutral-200'
                }`}
              >
                {gameState.isScrollingTextVisible ? <Eye size={14} className="mr-2" /> : <EyeOff size={14} className="mr-2" />}
                {gameState.isScrollingTextVisible ? 'Hide Text' : 'Show Text'}
              </button>
          </div>
          <input
            type="text"
            value={scrollingTextInput}
            onChange={(e) => {
               setScrollingTextInput(e.target.value);
               updateState({ scrollingText: e.target.value });
            }}
            className="w-full text-lg font-medium p-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-neutral-50"
            placeholder="Enter scrolling text here..."
          />
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Home Team */}
          <div 
             className="bg-white rounded-2xl shadow-sm border-t-8 border border-neutral-200 overflow-hidden flex flex-col"
             style={{ borderTopColor: gameState.homeColor || '#1D4ED8' }}
          >
             <div className="p-6 md:p-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100">
                   <div className="flex items-center space-x-2 w-full">
                     <label className="relative flex items-center justify-center w-8 h-8 rounded-full overflow-hidden cursor-pointer shadow-sm border border-neutral-300 shrink-0" title="Choose Team Color">
                       <input 
                         type="color" 
                         value={gameState.homeColor || '#1D4ED8'} 
                         onChange={(e) => updateState({ homeColor: e.target.value })}
                         className="absolute -inset-2.5 w-12 h-12 cursor-pointer opacity-0"
                       />
                       <div className="w-full h-full" style={{ backgroundColor: gameState.homeColor || '#1D4ED8' }}></div>
                     </label>
                     <input
                        type="text"
                        value={homeNameInput}
                        onChange={(e) => {
                           const val = e.target.value.toUpperCase();
                           setHomeNameInput(val);
                           updateState({ homeName: val });
                        }}
                        className="text-3xl font-black uppercase bg-transparent focus:outline-none w-full text-neutral-800 placeholder-neutral-300"
                        placeholder="HOME TEAM"
                     />
                   </div>
                </div>

                <div className="flex flex-col items-center justify-center mb-6 flex-1">
                   <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">
                     {showSets ? 'Current Set Score' : 'Total Score'}
                   </span>
                   <span className="text-[100px] leading-none font-black tabular-nums tracking-tighter text-neutral-800 mb-6">{gameState.homeScore}</span>
                   
                   <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                      <button onClick={() => handleScoreChange('home', 1)} className="col-span-2 py-4 bg-neutral-50 text-neutral-700 hover:bg-neutral-100 rounded-xl font-black text-xl border border-neutral-200 transition-colors">+1 Point</button>
                      <button onClick={() => handleScoreChange('home', 2)} className="py-4 px-6 bg-neutral-800 text-white hover:bg-black rounded-xl font-black text-2xl shadow-sm transition-colors">+2</button>
                      <button onClick={() => handleScoreChange('home', 3)} className="py-4 px-6 bg-neutral-800 text-white hover:bg-black rounded-xl font-black text-2xl shadow-sm transition-colors">+3</button>
                      <button onClick={() => handleScoreChange('home', -1)} className="col-span-2 py-2 bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700 rounded-xl font-bold text-sm transition-colors">-1 (Undo)</button>
                   </div>
                </div>

                {/* Sets Won */}
                {showSets && (
                  <div className="mb-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex flex-col items-center justify-center">
                     <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3 flex items-center">
                        <Trophy size={14} className="mr-1.5" /> Sets Won (Auto)
                     </span>
                     <span className="text-5xl font-black text-blue-700 text-center">{gameState.homeSetsWon}</span>
                  </div>
                )}

                {/* Quarter/Set Scores */}
                {showSets && (
                  <div className="mt-auto p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3 block text-center">Set Scores History</span>
                    <div className="flex justify-center gap-3">
                      {Array.from({ length: numSets }).map((_, q) => (
                        <div key={q} className="flex flex-col items-center">
                          <span className="text-[10px] text-neutral-500 font-bold mb-2">S{q+1}</span>
                          <input 
                            type="text"
                            inputMode="numeric"
                            value={gameState.homeQuarterScores?.[q] === 0 ? '' : (gameState.homeQuarterScores?.[q] || '')}
                            onChange={(e) => handleQuarterScoreInputChange('home', q, e.target.value)}
                            className="w-12 h-14 text-center font-black text-xl rounded-xl border-2 border-neutral-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white shadow-sm transition-all"
                            placeholder="0"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
             </div>
          </div>

          {/* Away Team */}
          <div 
            className="bg-white rounded-2xl shadow-sm border-t-8 border border-neutral-200 overflow-hidden flex flex-col"
            style={{ borderTopColor: gameState.awayColor || '#BE123C' }}
          >
             <div className="p-6 md:p-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100 flex-row-reverse">
                   <div className="flex items-center space-x-2 w-full flex-row-reverse">
                     <label className="relative flex items-center justify-center w-8 h-8 rounded-full overflow-hidden cursor-pointer shadow-sm border border-neutral-300 shrink-0 ml-2" title="Choose Team Color">
                       <input 
                         type="color" 
                         value={gameState.awayColor || '#BE123C'} 
                         onChange={(e) => updateState({ awayColor: e.target.value })}
                         className="absolute -inset-2.5 w-12 h-12 cursor-pointer opacity-0"
                       />
                       <div className="w-full h-full" style={{ backgroundColor: gameState.awayColor || '#BE123C' }}></div>
                     </label>
                     <input
                        type="text"
                        value={awayNameInput}
                        onChange={(e) => {
                           const val = e.target.value.toUpperCase();
                           setAwayNameInput(val);
                           updateState({ awayName: val });
                        }}
                        className="text-3xl font-black uppercase bg-transparent focus:outline-none w-full text-neutral-800 placeholder-neutral-300 text-right"
                        placeholder="AWAY TEAM"
                        dir="rtl"
                     />
                   </div>
                </div>

                <div className="flex flex-col items-center justify-center mb-6 flex-1">
                   <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">
                     {showSets ? 'Current Set Score' : 'Total Score'}
                   </span>
                   <span className="text-[100px] leading-none font-black tabular-nums tracking-tighter text-neutral-800 mb-6">{gameState.awayScore}</span>
                   
                   <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                      <button onClick={() => handleScoreChange('away', 1)} className="col-span-2 py-4 bg-neutral-50 text-neutral-700 hover:bg-neutral-100 rounded-xl font-black text-xl border border-neutral-200 transition-colors">+1 Point</button>
                      <button onClick={() => handleScoreChange('away', 2)} className="py-4 px-6 bg-neutral-800 text-white hover:bg-black rounded-xl font-black text-2xl shadow-sm transition-colors">+2</button>
                      <button onClick={() => handleScoreChange('away', 3)} className="py-4 px-6 bg-neutral-800 text-white hover:bg-black rounded-xl font-black text-2xl shadow-sm transition-colors">+3</button>
                      <button onClick={() => handleScoreChange('away', -1)} className="col-span-2 py-2 bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700 rounded-xl font-bold text-sm transition-colors">-1 (Undo)</button>
                   </div>
                </div>

                {/* Sets Won */}
                {showSets && (
                  <div className="mb-6 p-4 bg-red-50/50 rounded-xl border border-red-100 flex flex-col items-center justify-center">
                     <span className="text-xs font-bold text-red-600 uppercase tracking-widest mb-3 flex items-center">
                        <Trophy size={14} className="mr-1.5" /> Sets Won (Auto)
                     </span>
                     <span className="text-5xl font-black text-red-700 text-center">{gameState.awaySetsWon}</span>
                  </div>
                )}

                {/* Quarter/Set Scores */}
                {showSets && (
                  <div className="mt-auto p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3 block text-center">Set Scores History</span>
                    <div className="flex justify-center gap-3 flex-row-reverse">
                      {Array.from({ length: numSets }).map((_, q) => (
                        <div key={q} className="flex flex-col items-center">
                          <span className="text-[10px] text-neutral-500 font-bold mb-2">S{q+1}</span>
                          <input 
                            type="text"
                            inputMode="numeric"
                            value={gameState.awayQuarterScores?.[q] === 0 ? '' : (gameState.awayQuarterScores?.[q] || '')}
                            onChange={(e) => handleQuarterScoreInputChange('away', q, e.target.value)}
                            className="w-12 h-14 text-center font-black text-xl rounded-xl border-2 border-neutral-200 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-white shadow-sm transition-all"
                            placeholder="0"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}