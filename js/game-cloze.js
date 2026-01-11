
(async function(){
  const { Timer, SFX } = window.AppUtil; const DATA = await (await fetch('data/cloze.json')).json();
  const $ = s=>document.querySelector(s);
  const selCat=$('#clozeCat'), selSub=$('#clozeSub'), wrap=$('#clozeWrap'); const tOut=$('#clozeTime'), corrOut=$('#clozeCorrect'), sOut=$('#clozeScore'), hOut=$('#clozeHigh'); const timer=new Timer(tOut);
  function fill(sel, items){ sel.innerHTML=''; items.forEach(v=> sel.append(new Option(v,v))); }
  function bestKey(){ return `highscore:cloze:${selCat.value}:${selSub.value}`; }
  function loadHigh(){ const v=JSON.parse(localStorage.getItem(bestKey())||'0'); hOut.textContent = v||0; }
  fill(selCat, Object.keys(DATA)); function updateSub(){ fill(selSub, Object.keys(DATA[selCat.value]||{})); loadHigh(); } selCat.addEventListener('change', updateSub); selSub.addEventListener('change', loadHigh); updateSub();
  let items=[], idx=0, correct=0; function start(){ items = [ ...(((DATA[selCat.value]||{})[selSub.value])||[]) ].sort(()=>Math.random()-0.5); if(!items.length){ wrap.innerHTML='<p>No items.</p>'; return; } idx=0; correct=0; corrOut.textContent='0'; sOut.textContent='0'; timer.reset(); timer.start(); render(); SFX.click(); }
  
  document.getElementById('clozePreview').addEventListener('click', ()=>{
    const list = ((DATA[selCat.value]||{})[selSub.value]||[]);
    if(!list.length){ showPreviewOverlay('Cloze Preview','<p>No items.</p>'); return; }
    const html = list.map((it,idx)=>`<div style="margin:8px 0"><strong>${idx+1}.</strong> ${it.s}<br><em>Answer:</em> ${it.a}</div>`).join('');
    showPreviewOverlay(`Cloze Preview — ${selCat.value} / ${selSub.value}`, html);
  });
  
  function scoreNow(){ const secs=Math.floor(timer.elapsedMs()/1000); return (50*correct) + Math.max(0, 51 - secs); }
  function end(){ timer.stop(); const score=scoreNow(); sOut.textContent=String(score); const best=Math.max(score, +(localStorage.getItem(bestKey())||0)); localStorage.setItem(bestKey(), String(best)); hOut.textContent=String(best); wrap.innerHTML = `<p><strong>Finished!</strong> Correct: ${correct}/${items.length} — Time: ${tOut.textContent} — Score: ${score}</p><button class="btn" id="clozeAgain">Play again</button>`; document.getElementById('clozeAgain').addEventListener('click', start); SFX.success(); }
  function render(){ if(idx>=items.length){ end(); return; } const it=items[idx]; wrap.innerHTML = `<div class="cloze"><div class="small">Item ${idx+1} of ${items.length}</div><div class="prompt">${it.s}</div><div class="controls"><input id="clozeInput" type="text" placeholder="Your answer" /><button id="clozeCheck" class="btn btn-primary">Check</button></div><div id="clozeFeedback" class="small"></div></div>`; document.getElementById('clozeCheck').addEventListener('click', ()=>{ const guess=(document.getElementById('clozeInput').value||'').trim(); const ok=guess.localeCompare(it.a, undefined, {sensitivity:'accent'})===0; document.getElementById('clozeFeedback').textContent = ok? '✅ Correct!' : `❌ ${it.a}`; if(ok){ correct++; corrOut.textContent=String(correct); SFX.correct(); } else SFX.wrong(); sOut.textContent=String(scoreNow()); setTimeout(()=>{ idx++; render(); }, 550); }); }
  document.getElementById('clozeStart').addEventListener('click', start);
})();
