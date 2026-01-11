
(function(){
  class Timer { constructor(out){ this.out=out; this._t0=null; this._h=null; }
    start(){ this._t0=performance.now(); this._h && cancelAnimationFrame(this._h); const tick=()=>{ const ms=this.elapsedMs(); if(this.out) this.out.textContent = Timer.format(ms); this._h=requestAnimationFrame(tick); }; this._h=requestAnimationFrame(tick); }
    stop(){ this._h && cancelAnimationFrame(this._h); this._h=null; }
    reset(){ this._t0=performance.now(); if(this.out) this.out.textContent='00:00'; }
    elapsedMs(){ return this._t0 ? (performance.now()-this._t0) : 0; }
    static format(ms){ const s=Math.floor(ms/1000), m=Math.floor(s/60), ss=s%60; return `${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`; }
  }
  let muted = (localStorage.getItem('sfx') === 'off');
  function setMuted(v){ muted = v; localStorage.setItem('sfx', v ? 'off' : 'on'); }
  const ctx = new (window.AudioContext||window.webkitAudioContext)();
  function beep({freq=440,type='sine',duration=.15,volume=.25}){ if(muted) return; const o=ctx.createOscillator(), g=ctx.createGain(); o.type=type; o.frequency.value=freq; g.gain.value=volume; o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime+duration); }
  const SFX = { click(){beep({freq:500,type:'square',duration:.07,volume:.18});}, correct(){beep({freq:880});}, wrong(){beep({freq:220,type:'sawtooth'});}, success(){beep({freq:660,type:'triangle',duration:.25});}, match(){beep({freq:720});}, toggle(){ setMuted(!muted); }, isMuted(){ return muted; } };
  window.AppUtil = { Timer, SFX };
})();
