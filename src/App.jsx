import React, { useState, useEffect } from 'react';

// Simplified SVG Icon Components to avoid missing imports
const ShieldAlert = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="text-amber-500"><path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l8-2a1 1 0 0 1 .48 0l8 2A1 1 0 0 1 20 6z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
);
const Zap = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="text-emerald-400"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const Activity = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="text-blue-400"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
);
const TrendingUp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="text-sky-400"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
);

export default function App() {
  // System Toggle: 'motion' or 'isolation'
  const [system, setSystem] = useState('motion');
  
  // Tracking State
  const [currentPossessionTime, setCurrentPossessionTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activePlayer, setActivePlayer] = useState(null);
  const [possessionHistory, setPossessionHistory] = useState([]);
  const [currentSequence, setCurrentSequence] = useState([]);

  // Mock aggregated history data for rich analytics on initial load
  const [gameStats, setGameStats] = useState({
    totalPossessions: 42,
    avgSecondsPerTouch: 1.9,
    flowZoneMakes: 12, flowZoneTotal: 20, // 0-6s
    execZoneMakes: 8, execZoneTotal: 15,   // 7-14s
    panicZoneMakes: 2, panicZoneTotal: 7,   // 15s+
    ghostAlerts: ['#5 (C) - 5 straight ghost possessions in Q3'],
    dribbleTaxDropoff: 'Spot-up efficiency drops from 44% to 19% when ball is held > 5 seconds.'
  });

  // Basic roster
  const players = [
    { id: 1, role: 'PG', name: '#1 Base', x: '50%', y: '75%' },
    { id: 2, role: 'SG', name: '#2 Star', x: '25%', y: '50%' },
    { id: 3, role: 'SF', name: '#3 Wing', x: '75%', y: '50%' },
    { id: 4, role: 'PF', name: '#4 Stretch', x: '35%', y: '25%' },
    { id: 5, role: 'C', name: '#5 Big', x: '50%', y: '15%' },
  ];

  // Possession clock loop
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setCurrentPossessionTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handlePlayerTouch = (player) => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }
    setActivePlayer(player.id);
    setCurrentSequence((prev) => [...prev, { player: player.role, timeStamp: currentPossessionTime }]);
  };

  const handleEndPossession = (outcome) => {
    setIsTimerRunning(false);
    if (currentSequence.length === 0) return;

    // Update statistics reactively based on the session tracking
    const finalTime = currentPossessionTime;
    
    setGameStats((prev) => {
      const updated = { ...prev, totalPossessions: prev.totalPossessions + 1 };
      if (finalTime <= 6) {
        updated.flowZoneTotal += 1;
        if (outcome === 'MAKE') updated.flowZoneMakes += 1;
      } else if (finalTime <= 14) {
        updated.execZoneTotal += 1;
        if (outcome === 'MAKE') updated.execZoneMakes += 1;
      } else {
        updated.panicZoneTotal += 1;
        if (outcome === 'MAKE') updated.panicZoneMakes += 1;
      }
      return updated;
    });

    // Reset current state
    setCurrentPossessionTime(0);
    setActivePlayer(null);
    setCurrentSequence([]);
  };

  // Safe percentage calculation helper
  const calcPct = (makes, total) => (total > 0 ? ((makes / total) * 100).toFixed(1) : 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8">
      {/* Top Header Navigation */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
            THE TOUCH ECONOMY
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Post-Game Film Translation Board • Designed for Tactical Advantage
          </p>
        </div>
        
        {/* System Toggle Control */}
        <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-xl flex gap-2">
          <button 
            onClick={() => setSystem('motion')}
            className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${system === 'motion' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Motion / Share System
          </button>
          <button 
            onClick={() => setSystem('isolation')}
            className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${system === 'isolation' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Star-Heavy / Isolation
          </button>
        </div>
      </header>

      {/* Main Framework View Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Live Film Interactive Court Module */}
        <section className="lg:col-span-5 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 flex flex-col backdrop-blur-sm">
          <div className="mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-200">
              <Activity /> Live Film Tracker Input Module
            </h2>
            <p className="text-xs text-slate-400">Click a position when they capture the ball past half-court.</p>
          </div>

          {/* Half-Court Visual Interactive Layout */}
          <div className="relative w-full aspect-[4/3] bg-slate-950 border-2 border-slate-800 rounded-xl overflow-hidden flex items-center justify-center shadow-inner">
            {/* Basketball Court Line Graphic Accents */}
            <div className="absolute top-0 w-full h-full border-b border-slate-800/40 pointer-events-none"></div>
            <div className="absolute top-0 w-32 h-24 border-2 border-slate-800/40 rounded-b-xl pointer-events-none"></div>
            <div className="absolute top-0 w-64 h-48 border-2 border-slate-800/30 rounded-b-full pointer-events-none"></div>
            <div className="absolute bottom-0 w-full h-1/2 border-t-2 border-dashed border-slate-800/20 pointer-events-none"></div>

            {/* Floating Interactive Player Nodes */}
            {players.map((player) => (
              <button
                key={player.id}
                onClick={() => handlePlayerTouch(player)}
                style={{ left: player.x, top: player.y }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-14 h-14 rounded-full font-black text-xs border-2 transition-all duration-150 active:scale-95 shadow-md ${
                  activePlayer === player.id 
                    ? 'bg-amber-500 border-white text-slate-950 animate-pulse ring-4 ring-amber-500/30' 
                    : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-orange-500 hover:text-orange-400'
                }`}
              >
                <span>{player.role}</span>
                <span className="text-[9px] font-medium opacity-60">{player.id}</span>
              </button>
            ))}

            {/* Active Live Running Possession Timer overlay */}
            <div className="absolute top-4 right-4 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg font-mono text-xs text-orange-400 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full bg-orange-500 ${isTimerRunning ? 'animate-ping' : ''}`}></span>
              Half-Court Clock: {currentPossessionTime}s
            </div>
          </div>

          {/* Live Rolling Sequence Log display */}
          <div className="mt-4 bg-slate-950 border border-slate-800 rounded-xl p-3 flex-1 min-h-[60px] flex flex-col justify-between">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold mb-1">Active Sequence Log:</div>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {currentSequence.length === 0 ? (
                <span className="text-slate-600 italic">No activity registered yet...</span>
              ) : (
                currentSequence.map((seq, i) => (
                  <span key={i} className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-300 font-mono">
                    {seq.player} ({seq.timeStamp}s) {i < currentSequence.length - 1 ? '➔' : ''}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Possession Outcome Terminal Controls */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <button onClick={() => handleEndPossession('MAKE')} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md">
              Make
            </button>
            <button onClick={() => handleEndPossession('MISS')} className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 px-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md">
              Miss
            </button>
            <button onClick={() => handleEndPossession('TURNOVER')} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 px-3 rounded-xl text-xs uppercase tracking-wider transition-all border border-slate-700">
              Turnover
            </button>
          </div>
        </section>

        {/* Right Side: Analytical Output Dashboard Data Panels */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Top Analytical Progress Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-bold tracking-tight block mb-1">BALL VELOCITY INDEX</span>
              <div className="text-2xl font-black text-emerald-400">{gameStats.avgSecondsPerTouch}s</div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Status: Optimal Ball Flow Velocity</span>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-bold tracking-tight block mb-1">TOTAL LOGGED RUNS</span>
              <div className="text-2xl font-black text-sky-400">{gameStats.totalPossessions}</div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-sky-400 h-1.5 rounded-full" style={{ width: '68%' }}></div>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Sufficient Sample Volume Achieved</span>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-bold tracking-tight block mb-1">GHOST-POSSESSION WARNING</span>
              <div className="text-xs font-black text-amber-500 truncate flex items-center gap-1">
                {gameStats.ghostAlerts[0] ? '⚠️ Active Alert' : 'No Flags Found'}
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block truncate">#5 Big Isolate Danger Zone Identified</span>
            </div>
          </div>

          {/* System Timeline Phase Metrics Matrix */}
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-5">
            <h3 className="text-sm font-black text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <TrendingUp /> Time-Based Shot Outcome Efficiency Matrix
            </h3>
            <div className="space-y-4">
              {/* Flow Zone Indicator */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-emerald-400 font-bold">Flow Zone (0-6s Half-Court)</span>
                  <span>{gameStats.flowZoneMakes}/{gameStats.flowZoneTotal} Looks ({calcPct(gameStats.flowZoneMakes, gameStats.flowZoneTotal)}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-md overflow-hidden p-0.5 border border-slate-800">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-sm transition-all duration-300" style={{ width: `${calcPct(gameStats.flowZoneMakes, gameStats.flowZoneTotal)}%` }}></div>
                </div>
              </div>

              {/* Execution Zone Indicator */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-sky-400 font-bold">Execution Zone (7-14s Half-Court)</span>
                  <span>{gameStats.execZoneMakes}/{gameStats.execZoneTotal} Looks ({calcPct(gameStats.execZoneMakes, gameStats.execZoneTotal)}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-md overflow-hidden p-0.5 border border-slate-800">
                  <div className="bg-gradient-to-r from-sky-500 to-blue-400 h-full rounded-sm transition-all duration-300" style={{ width: `${calcPct(gameStats.execZoneMakes, gameStats.execZoneTotal)}%` }}></div>
                </div>
              </div>

              {/* Panic Zone Indicator */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-rose-500 font-bold">Panic Zone (15s+ Half-Court Execution)</span>
                  <span>{gameStats.panicZoneMakes}/{gameStats.panicZoneTotal} Looks ({calcPct(gameStats.panicZoneMakes, gameStats.panicZoneTotal)}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-md overflow-hidden p-0.5 border border-slate-800">
                  <div className="bg-gradient-to-r from-rose-500 to-orange-600 h-full rounded-sm transition-all duration-300" style={{ width: `${calcPct(gameStats.panicZoneMakes, gameStats.panicZoneTotal)}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Automated Coach Post-Game Strategy Briefing */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-orange-500/10 text-orange-400 border-b border-l border-slate-800 px-3 py-1 font-mono text-[10px] uppercase font-black tracking-wider">
              System Generated Brief
            </div>
            
            <h3 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
              <ShieldAlert /> Coach's Post-Game Briefing Report
            </h3>

            <div className="space-y-4 text-xs md:text-sm text-slate-300 leading-relaxed">
              {/* Section 1 */}
              <div>
                <h4 className="font-bold text-slate-100 border-b border-slate-800 pb-1 mb-2 text-xs uppercase tracking-wider text-orange-400">
                  1. Structural Diagnostic Insights
                </h4>
                <ul className="list-disc pl-4 space-y-1.5">
                  <li>
                    <strong>The Touch Starvation Dropoff:</strong> {system === 'motion' 
                      ? "Roster inclusivity remains healthy overall, but center alignment records clear drop-offs when passing strings are restricted to single-side variations."
                      : "Star-dominated holding phases are driving extreme stagnation metrics. Role-player catch-and-shoot conversion capacity falls off by half when waiting intervals exceed 4 total plays."}
                  </li>
                  <li>
                    <strong>The Dribble Over-Holding Tax:</strong> {gameStats.dribbleTaxDropoff}
                  </li>
                </ul>
              </div>

              {/* Section 2 */}
              <div>
                <h4 className="font-bold text-slate-100 border-b border-slate-800 pb-1 mb-2 text-xs uppercase tracking-wider text-orange-400">
                  2. Practice Blueprint Adjustments
                </h4>
                <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 font-mono text-xs text-slate-400 space-y-2">
                  <div>
                    <span className="text-amber-400 font-bold">📢 Core Emphasis:</span> "Our offensive engine operates at an elite efficiency margin inside the Flow Zone ({calcPct(gameStats.flowZoneMakes, gameStats.flowZoneTotal)}%). Stagnant spacing sets trigger a massive system drop. The ball must shift immediately on the catch."
                  </div>
                  <div>
                    <span className="text-sky-400 font-bold">🏀 Tactical Practice Focus:</span> Run high-intensity 14-second situational scrimmages starting directly at half-court. Force secondary tracking options immediately if primary driving funnels fail within 4 seconds.
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}
