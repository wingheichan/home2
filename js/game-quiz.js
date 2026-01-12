
(async function(){
  let totalMs = 0;  // sum of per-question timers
  const { Timer, SFX } = window.AppUtil; const DATA = await (await fetch('data/quiz.json')).json();
  const $ = s=>document.querySelector(s); const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
  const selCat=$('#quizCat'), selSub=$('#quizSub'), wrap=$('#quizWrap'); const tOut=$('#quizTime'); const cOut=$('#quizCorrect'); const sOut=$('#quizScore'); const hOut=$('#quizHigh'); const timer=new Timer(tOut);
  function fill(sel, items){ sel.innerHTML=''; items.forEach(v=> sel.append(new Option(v,v))); }
  function bestKey(){ return `highscore:quiz:${selCat.value}:${selSub.value}`; }
  function loadHigh(){ const v=JSON.parse(localStorage.getItem(bestKey())||'0'); hOut.textContent = v||0; }
  fill(selCat, Object.keys(DATA)); function updateSub(){ fill(selSub, Object.keys(DATA[selCat.value]||{})); loadHigh(); } selCat.addEventListener('change', updateSub); selSub.addEventListener('change', loadHigh); updateSub();
  let idx=0, correct=0, questions=[]; function start(){totalMs = 0; const list=((DATA[selCat.value]||{})[selSub.value]||[]); questions=[...list].sort(()=>Math.random()-0.5); if(!questions.length){ wrap.innerHTML='<p>No items.</p>'; return; } idx=0; correct=0; cOut.textContent='0'; sOut.textContent='0'; timer.reset(); timer.start(); render(); SFX.click(); }
  
  
  document.getElementById('quizPreview').addEventListener('click', () => {
    const list = ((DATA[selCat.value] || {})[selSub.value] || []);
    if (!list.length) { AppUtil.showPreview('Quiz Preview', '<p>No items.</p>'); return; }
    const html = list.map((it, i) =>
      `<div style="margin:8px 0"><strong>Q${i+1}.</strong> ${it.q}<br><em>Answer:</em> ${it.choices[it.a]}</div>`
    ).join('');
    AppUtil.showPreview(`Quiz Preview — ${selCat.value} / ${selSub.value}`, html);
  });


  function scoreNow(){ const secs = Math.floor(totalMs / 1000); return (50*correct) + Math.max(0, 51 - secs); }
  function finish(){ timer.stop(); const score=scoreNow(); sOut.textContent=String(score); const best=Math.max(score, +(localStorage.getItem(bestKey())||0)); localStorage.setItem(bestKey(), String(best)); hOut.textContent=String(best); const totalTime = AppUtil.Timer.format(totalMs); wrap.innerHTML = `<p><strong>Done!</strong> Correct: ${correct}/${questions.length} — Time: ${totalTime — Score: ${score}</p><button class="btn" id="quizAgain">Play again</button>`; $('#quizAgain').addEventListener('click', start); SFX.success(); }
  
function render(){
  if (!questions.length){ wrap.innerHTML = '<p>No items in this subcategory.</p>'; return; }
  if (idx >= questions.length){ end(); return; }

  const q = questions[idx];

  // Build question + choices
  wrap.innerHTML = `
    <div class="quiz">
      <div class="small">Q${idx+1} of ${questions.length}</div>
      <div class="question">${q.q}</div>
      <div class="choices">
        ${q.choices.map((c,i)=>`<button class="choice" data-i="${i}">${c}</button>`).join('')}
      </div>
    </div>
  `;

  // Per-question timer
  timer.reset();
  timer.start();

  // Click handler
  $$('.choice', wrap).forEach(btn => btn.addEventListener('click', (e) => {
    const i  = +e.currentTarget.dataset.i;
    const ok = (i === q.a);

    // stop timer and accumulate per-question time
    timer.stop();
    totalMs += timer.elapsedMs();

    // feedback colors
    e.currentTarget.classList.add(ok ? 'correct' : 'wrong');
    $$('.choice', wrap).forEach(b => b.disabled = true);

    if (ok) {
      correct++;
      cOut.textContent = String(correct);
      SFX.correct();
    } else {
      SFX.wrong();
    }

    // update score with totalMs
    sOut.textContent = String(scoreNow());

    // Show Next button to continue
    const nextRow = document.createElement('div');
    nextRow.className = 'next-row';
    nextRow.innerHTML = '<button id="quizNext" class="btn btn-primary">Next</button>';
    wrap.appendChild(nextRow);

    document.getElementById('quizNext').addEventListener('click', () => {
      idx++;
      render();   // render next question; timer will reset/start there
    });
  }));
}

  $('#quizStart').addEventListener('click', start);
})();
