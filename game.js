/* The Gunpowder Paradox — lightweight offline-first GitHub Pages game.
   Historical people/events are real; the Meridian Order and its agents are fictional.
   Rewards are encrypted in data.js and unlocked by student answers. Do NOT deploy the teacher guide.
*/
(() => {
'use strict';
const app = document.getElementById('app');
const toastEl = document.getElementById('toast');
const STORAGE = 'gunpowder-paradox-1605-v1';
const total = CHAPTERS.reduce((n,c)=>n+c.tasks.length,0);
const taskMap = new Map(CHAPTERS.flatMap(c => c.tasks.map(t => [t.id,t])));
const ESC = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm = s => String(s ?? '').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'');
const empty = () => ({started:false,chapter:0,solved:{},entries:[],hints:{},interactions:{},notes:'',tab:'clues',elapsedMs:0,won:false});
let state;
try { state = {...empty(),...JSON.parse(localStorage.getItem(STORAGE) || '{}')}; } catch {state=empty();}
if (!state.solved || !state.interactions || !Array.isArray(state.entries)) state=empty();
let sessionStart=Date.now();
let openNotebook=false;
let busy=false;
const feedback={};
let toastTimer;
function save(){ try{localStorage.setItem(STORAGE,JSON.stringify(state));}catch{} }
function getInter(t){return state.interactions[t.id] ||= {};}
function solvedN(){return Object.keys(state.solved).length;}
function elapsed(){return state.elapsedMs + (state.started ? Date.now()-sessionStart : 0);}
function clock(){const s=Math.floor(elapsed()/1000);return `${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor(s/60)%60).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}
function announce(message){toastEl.textContent=message;toastEl.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toastEl.classList.remove('show'),3200);}
function escapeQuote(s){return ESC(s);}
function badge(txt){return `<span class="location">${ESC(txt)}</span>`;}
async function unlock(id, answer){
  const e=VAULT[id]; if (!e || !crypto?.subtle) return null;
  const b64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
  try {
    const raw=await crypto.subtle.importKey('raw',new TextEncoder().encode(norm(answer)),'PBKDF2',false,['deriveKey']);
    const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:b64(e.s),iterations:24000,hash:'SHA-256'},raw,{name:'AES-GCM',length:256},false,['decrypt']);
    const decrypted=await crypto.subtle.decrypt({name:'AES-GCM',iv:b64(e.n),additionalData:new TextEncoder().encode(id)},key,b64(e.v));
    return JSON.parse(new TextDecoder().decode(decrypted));
  } catch{return null;}
}
function complete(t, data){
  if (state.solved[t.id]) return;
  const info=data?.reward || {title:'Clue collected',body:'This task is finished.',kind:'clue'};
  state.solved[t.id]=info;
  state.entries.push({id:t.id,chapter:state.chapter,...info});
  delete feedback[t.id];
  save(); announce('Evidence collected — '+info.title);
  render(true);
}
function renderTop(){
  return `<header class="topbar"><div class="brand"><div class="brandmark" aria-hidden="true">◷</div><div><div class="brandtitle">THE GUNPOWDER PARADOX</div><div class="brandtag">A Chrono Agency investigation · A2</div></div></div><div class="topright">${state.started?`<div class="top-pill" title="Time spent playing">◴ <span id="time">${clock()}</span></div><div class="top-pill"><strong>${solvedN()}</strong> / ${total} clues</div><button class="btn ghost small mobile-evidence" data-action="notebook">☷ Case notes</button>`:''}<button class="btn quiet small" data-action="restart">↻ Restart</button></div></header>`;
}
function renderIntro(){
 return `<div class="shell">${renderTop()}<div class="brief-wrap"><section class="brief-hero"><img src="assets/portal.webp" alt="Glowing blue time portal inside a clockwork laboratory" width="508" height="508"><div class="brief-content"><div class="eyebrow"><i class="blink"></i> TOP SECRET · CASE 1605</div><h1>THE GUNPOWDER<br><em>PARADOX</em></h1><p>Someone has changed history. The Gunpowder Plot of 1605 now succeeds. The Meridian Order is hiding in the past. Travel back, question the suspects, find the missing warning and save the real timeline.</p><div class="alert-line">MISSION: Identify three time travellers. Restore the warning. Save history.</div><button class="btn primary" data-action="begin">ENTER THE TIME MACHINE &nbsp; →</button></div></section><div class="brief-features"><div class="brief-feature"><b>1605</b><p>London, England. Meet real historical people.</p></div><div class="brief-feature"><b>27 tasks</b><p>Interviews, object searches, codes and puzzles.</p></div><div class="brief-feature"><b>60–65 min</b><p>Play alone. Your case file saves on this device.</p></div></div><p class="footnote">In this story, real history meets science fiction. Read in English, take notes and use the hints if you need them. No account or internet connection is required after the page has loaded.</p></div></div>`;
}
function renderProgress(){
 const pc=Math.round(solvedN()/total*100);
 return `<div class="progress"><div class="progress-top"><span>CASE PROGRESS · ${solvedN()} OF ${total} TASKS</span><span>${pc}%</span></div><div class="meter"><span style="width:${pc}%"></span></div><div class="chapters">${CHAPTERS.map((c,i)=>`<span class="chapter-dot ${i<state.chapter?'done':i===state.chapter?'now':''}" title="Chapter ${i+1}: ${ESC(c.title)}">${String(i+1).padStart(2,'0')}</span>`).join('')}</div></div>`;
}
function renderScene(){
 const sec=CHAPTERS[state.chapter];const done=sec.tasks.filter(t=>state.solved[t.id]).length;
 return `<div class="shell">${renderTop()}<div class="main-layout"><div class="mission"><section class="scenehero"><img class="scene-img" src="assets/${sec.image}.webp" alt="Illustrated scene: ${ESC(sec.location)}" width="508" height="508"><div class="hero-copy"><div class="hero-meta">${badge('CHAPTER '+String(state.chapter+1).padStart(2,'0')+' / '+String(CHAPTERS.length).padStart(2,'0'))}${badge(sec.date)}</div><h1>${ESC(sec.title)}</h1><div class="hero-quote">${ESC(sec.epigraph)}</div><p>${ESC(sec.narrative)}</p><div class="task-actions"><button class="btn ghost small" data-action="listen" data-speak="scene">▶ Listen to the story</button>${badge(sec.location)}</div></div></section><div class="task-head"><div><div class="eyebrow">YOUR MISSION</div><h2>Investigate the clues</h2><p>${ESC(sec.objective)}</p></div><span class="top-pill">${done}/${sec.tasks.length} complete</span></div><div class="tasks">${sec.tasks.map((t,i)=>renderTask(t,i+1)).join('')}</div>${done===sec.tasks.length?renderCheckpoint(sec):''}${renderProgress()}<p class="footnote">Your progress and case notes are saved only on this device. The historical plot is real; the Meridian Order and time travellers are fictional. <a style="color:var(--gold)" href="https://www.parliament.uk/about/faqs/house-of-commons-faqs/gunpowder-plot/" target="_blank" rel="noopener noreferrer">Historic source: UK Parliament ↗</a></p></div>${renderNotebook()}</div></div>`;
}
function renderCheckpoint(sec){return `<section class="checkpoint"><div><div class="eyebrow">✓ CHAPTER COMPLETE</div><h3>New evidence secured</h3><p>${ESC(sec.interlude)}</p></div><button class="btn primary" data-action="next">${state.chapter===CHAPTERS.length-1?'CLOSE THE CASE':'CONTINUE THE MISSION'} &nbsp; →</button></section>`;}
function renderTask(t,n){
 const done=state.solved[t.id], hintN=state.hints[t.id]||0;
 return `<article class="task-card ${done?'solved':''} ${['hotspots','final'].includes(t.type)?'wide':''}" id="task-${ESC(t.id)}"><div class="card-top"><div class="card-index">EVIDENCE ${String(n).padStart(2,'0')} · ${ESC(t.type==='dialogue'?'INTERVIEW':t.type==='hotspots'?'SEARCH':t.type==='final'?'CASE REPORT':'PUZZLE')}</div><div class="task-status ${done?'complete':''}">${done?'✓ COLLECTED':'○ OPEN'}</div></div><h3>${ESC(t.title)}</h3><p class="lead">${ESC(t.lead)}</p>${done?`<div class="success-tag"><span aria-hidden="true">✓</span><div><b>${ESC(done.title)}</b><span>${ESC(done.body)}</span></div></div>`:renderTaskForm(t)}${!done&&feedback[t.id]?`<div class="error-box" role="alert">${ESC(feedback[t.id])}</div>`:''}${!done?`<div class="task-actions"><button class="hint-btn" data-action="hint" data-task="${ESC(t.id)}" ${hintN>=t.hints.length?'disabled':''}>✧ ${hintN===0?'Need a hint?':hintN<t.hints.length?'One more hint':'No more hints'}</button></div>${t.hints.slice(0,hintN).map((h,i)=>`<div class="hint-box">HINT ${i+1}: ${ESC(h)}</div>`).join('')}`:''}</article>`;
}
function renderTaskForm(t){
 const u=getInter(t);
 if (t.type==='dialogue'){
   const stepNo=u.step||0;const st=t.steps[stepNo];
   return `<div class="dialogue"><b>QUESTION ${stepNo+1} OF ${t.steps.length}</b>${(u.replies||[]).map((r)=>`<p class="spoken">${ESC(r)}</p>`).join('')}<p>“${ESC(st.prompt)}”</p><button class="btn quiet small" data-action="speak-dialogue" data-task="${ESC(t.id)}">▶ Listen</button></div><div class="choice-list">${st.options.map((option,i)=>`<button class="choice" data-action="dialogue" data-task="${ESC(t.id)}" data-choice="${i}" style="width:100%;text-align:left">${i+1}. ${ESC(option)}</button>`).join('')}</div>`;
 }
 if (t.type==='hotspots'){
   const found=u.found||[];
   return `<div class="scan"><img src="assets/${ESC(t.image)}.webp" width="508" height="508" alt="Search illustration with glowing evidence markers">${t.spots.map((s,i)=>`<button class="spot ${found.includes(i)?'found':''}" style="left:${s.x}%;top:${s.y}%" data-action="spot" data-task="${ESC(t.id)}" data-spot="${i}" aria-label="Inspect ${ESC(s.label)}">${found.includes(i)?'✓':'+'}</button>`).join('')}</div><div class="found-list">${t.spots.map((s,i)=>`<button class="${found.includes(i)?'found':''}" data-action="spot" data-task="${ESC(t.id)}" data-spot="${i}">${found.includes(i)?'✓':'○'} ${ESC(s.label)}</button>`).join('')}</div>${u.spotText?`<div class="inspect-result">${ESC(u.spotText)}</div>`:''}<p>${found.length} of ${t.spots.length} objects examined</p>`;
 }
 if (t.type==='classify'){
   const choices=u.categories||[];
   return `<div>${t.items.map((q,i)=>`<div class="class-row"><p><b>${i+1}.</b> ${ESC(q)}</p><div class="class-buttons">${t.categories.map((name,j)=>`<button class="${choices[i]===j?'picked':''}" data-action="classify" data-task="${ESC(t.id)}" data-row="${i}" data-choice="${j}" aria-pressed="${choices[i]===j}">${ESC(name)}</button>`).join('')}</div></div>`).join('')}</div><button class="btn primary" data-action="check" data-task="${ESC(t.id)}">CHECK THE EVIDENCE ↗</button>`;
 }
 if (t.type==='order'){
   const ord=u.order||t.items.map((_,i)=>i);return `<div class="order-stack">${ord.map((idx,pos)=>`<div class="order-item" draggable="true" data-drag-task="${ESC(t.id)}" data-pos="${pos}"><span class="num">${pos+1}</span><span>${ESC(t.items[idx])}</span><button class="move" data-action="move" data-task="${ESC(t.id)}" data-pos="${pos}" data-dir="-1" ${pos===0?'disabled':''} aria-label="Move up">↑</button><button class="move" data-action="move" data-task="${ESC(t.id)}" data-pos="${pos}" data-dir="1" ${pos===ord.length-1?'disabled':''} aria-label="Move down">↓</button></div>`).join('')}</div><p style="font-size:11px">Move the cards with the arrows (or drag them).</p><button class="btn primary" data-action="check" data-task="${ESC(t.id)}">CHECK THE ORDER ↗</button>`;
 }
 if (t.type==='match'){
   return `<form data-taskform="${ESC(t.id)}"><div>${t.rows.map((row,i)=>`<div class="match-row"><b>${i+1}. ${ESC(row)}</b><select class="field" data-match="${i}" required><option value="">Choose a match...</option>${t.options.map((x,j)=>`<option value="${j}">${ESC(x)}</option>`).join('')}</select></div>`).join('')}</div><button class="btn primary" type="submit">CHECK MY MATCHES ↗</button></form>`;
 }
 if (t.type==='final')return renderFinalForm(t);
 if (t.type==='choice'||t.type==='multi'){
   const multi=t.type==='multi';
   return `<form data-taskform="${ESC(t.id)}"><div class="choice-list">${t.options.map((x,i)=>`<label class="choice"><input type="${multi?'checkbox':'radio'}" name="answer-${ESC(t.id)}" value="${i}"><span>${ESC(x)}</span></label>`).join('')}</div><button class="btn primary" type="submit">CHECK MY ANSWER ↗</button></form>`;
 }
 if (t.type==='code'){
   return `<form data-taskform="${ESC(t.id)}"><div class="form-row"><label for="input-${ESC(t.id)}">YOUR ANSWER</label><input class="field" id="input-${ESC(t.id)}" name="code" placeholder="${ESC(t.placeholder||'Type your answer')}" maxlength="${t.maxLength||70}" autocomplete="off" spellcheck="false" required></div><button class="btn primary" type="submit">UNLOCK CLUE ↗</button></form>`;
 }
 return '';
}
function renderFinalForm(t){
 const u=getInter(t);const fields=u.fields||[];const valid=u.valid||[];
 return `<form data-taskform="${ESC(t.id)}"><div class="final-grid">${t.fields.map((f,i)=>`<div class="form-row final-field"><label for="final-${i}">${i+1}. ${ESC(f.label)}</label><input class="field" id="final-${i}" data-finalfield="${i}" value="${ESC(fields[i]||'')}" placeholder="${ESC(f.placeholder)}" autocomplete="off" spellcheck="false" required><span class="field-mark" aria-label="${valid[i]?'Correct':''}">${valid[i]?'✓':''}</span></div>`).join('')}</div><div class="form-row"><label for="final-action">7. What must you do to repair the timeline?</label><select class="field" id="final-action" required><option value="">Choose the final action...</option>${t.actionOptions.map((x,i)=>`<option value="${i}" ${String(u.action)===String(i)?'selected':''}>${ESC(x)}</option>`).join('')}</select></div><button class="btn primary" type="submit">RESTORE THE TIMELINE →</button><p>Incorrect fields will be marked. Check your evidence notebook for the missing facts.</p></form>`;
}
function renderNotebook(){
 const entries=state.entries;
 const people=[['Commander','Evelyn Cross'],['Courier','Silas Grey'],['Engineer','Nora Vale']];
 const hasRole=name=>entries.some(e=>e.title.toLowerCase().includes('identified')&&e.title.toLowerCase().includes(name.toLowerCase()));
 let content='';
 if (state.tab==='clues') content=entries.length?entries.slice().reverse().map(e=>`<div class="evidence"><small>${ESC(e.kind.toUpperCase())} · CHAPTER ${e.chapter+1}</small><strong>${ESC(e.title)}</strong><p>${ESC(e.body)}</p></div>`).join(''):'<p>No evidence yet. Solve puzzles to collect clues.</p>';
 if (state.tab==='people') content=people.map(([role,name])=>`<div class="person"><div><b>${role}</b><br><span>${hasRole(name)?ESC(name):'Identity unknown'}</span></div><span>${hasRole(name)?'✓ FOUND':'○ SEARCHING'}</span></div>`).join('')+'<p>Write down names and roles as you investigate. Some information is revealed later.</p>';
 if (state.tab==='words') content=[['plot','complot / geheim plan'],['warning','waarschuwing'],['cellar','kelder'],['suspect','verdachte'],['clue','aanwijzing'],['evidence','bewijs'],['guard','bewaken'],['courier','boodschapper'],['engineer','technicus'],['intercept','onderscheppen'],['restore','herstellen'],['century','eeuw'],['royal','koninklijk'],['parliament','parlement'],['quill','ganzenveer'],['surname','achternaam']].map(([a,b])=>`<div class="gloss"><span>${ESC(a)}</span><span>${ESC(b)}</span></div>`).join('');
 return `<aside class="notebook ${openNotebook?'is-open':''}" id="notebook"><div class="notebook-inner"><div class="notebook-kicker">◈ CHRONO AGENCY / PRIVATE FILE</div><h2>Case notebook</h2><p>Your evidence is saved automatically. Use these notes for the final mystery.</p><div class="notebook-tabs">${[['clues','Clues'],['people','People'],['words','Words']].map(([k,label])=>`<button data-action="tab" data-tab="${k}" class="${state.tab===k?'active':''}" aria-pressed="${state.tab===k}">${label}</button>`).join('')}</div><div class="ledger">${content}</div><div class="eyebrow" style="margin:15px 0 7px">YOUR OWN NOTES</div><textarea class="notepad" id="notepad" placeholder="Write names, dates and suspicious clues here..." spellcheck="false">${ESC(state.notes)}</textarea></div><div class="notebook-footer"><button class="btn small ghost" data-action="copy">⧉ Copy notes</button><button class="btn small ghost" data-action="notebook">${openNotebook?'✕ Close':'☷ Notes'}</button></div></aside>`;
}
function renderVictory(){
 const used=Object.values(state.hints).reduce((n,v)=>n+v,0);
 const grade=used<=3?'MASTER DETECTIVE':used<=10?'TIME DETECTIVE':'HISTORY SAVER';
 return `<div class="shell">${renderTop()}<div class="victory"><div class="eyebrow">◈ CHRONO AGENCY · OFFICIAL RESULT ◈</div><h1>HISTORY<br><span style="color:var(--gold)">RESTORED.</span></h1><p>The Meridian Order has failed. The warning reaches Lord Monteagle. The royal search finds Guy Fawkes, and the Gunpowder Plot does not succeed.</p><div class="victory-meta"><span>✓ ${total} / ${total} tasks</span><span>◴ ${clock()}</span><span>✧ ${used} hints</span></div><div class="eyebrow">RANK · ${grade}</div><div style="border-top:1px solid #64706b;max-width:600px;margin:22px auto;padding-top:18px"><h2 style="font:27px Georgia,serif">What really happened?</h2><p>In real history, the Gunpowder Plot was discovered in 1605, before the planned attack. Robert Catesby was an important leader; Guy Fawkes guarded the gunpowder; and an anonymous letter to Lord Monteagle helped alert the authorities.</p><p><b>The Meridian Order, Evelyn Cross, Silas Grey, Nora Vale and the time machine are fictional.</b></p></div><div class="task-actions" style="justify-content:center"><button class="btn primary" data-action="copy">COPY MY CASE NOTES</button><button class="btn ghost" data-action="restart">PLAY AGAIN ↻</button></div><p class="footnote">Historical facts checked with UK Parliament. The identity of the real warning-letter writer remains uncertain.</p></div></div>`;
}
function render(preserve=false){
 const y=window.scrollY;
 app.innerHTML = !state.started?renderIntro():state.won?renderVictory():renderScene();
 if(preserve)requestAnimationFrame(()=>window.scrollTo({top:y,behavior:'instant'}));
}
async function doCheck(t,candidate){
 if(busy)return;
 busy=true;
 try{
   const response=await unlock(t.id,candidate);
   if(response){complete(t,response);}else{feedback[t.id]='That does not match the evidence yet. Check the text, try another order or open a hint.'; render(true);}
 }finally{busy=false;}
}
async function doDialogue(t,chosen){
 if(busy)return;busy=true;
 try{
  const u=getInter(t); const step=u.step||0;
  const response=await unlock(t.id+':'+step,chosen);
  if(!response){feedback[t.id]=t.steps[step].wrong;render(true);return;}
  delete feedback[t.id];
  u.replies=[...(u.replies||[]),response.reply];u.step=step+1;
  if(response.reward){complete(t,response);}else{save();render(true);announce('The witness trusts you. Ask another question.');}
 }finally{busy=false;}
}
async function doHotspot(t,pos){
 const u=getInter(t); const s=t.spots[pos];
 u.found ||= [];
 u.spotText=s.text;
 if(!u.found.includes(pos))u.found.push(pos);
 save();
 if(u.found.length===t.spots.length){const response=await unlock(t.id,u.found.sort((a,b)=>a-b).join(','));if(response){complete(t,response);return;}}
 render(true);
}
async function submitFinal(t,form){
 if(busy)return;busy=true;
 try{
  const u=getInter(t);
  const fields=[...form.querySelectorAll('[data-finalfield]')].map(x=>x.value.trim());
  const action=form.querySelector('#final-action').value;
  u.fields=fields;u.action=action;
  u.valid=await Promise.all(fields.map(async(x,i)=>!!(x&&await unlock(t.id+':f'+i,x))));
  if(u.valid.every(Boolean)){
    const response=await unlock(t.id+':action',action);
    if(response){complete(t,response);state.won=true;save();window.scrollTo(0,0);render();announce('You did it. History is restored!');return;}
    feedback[t.id]='All six facts are correct! Check your final action.';
  } else {
    const failed=u.valid.map((isOk,i)=>!isOk?i+1:0).filter(Boolean);
    feedback[t.id]='Check field'+(failed.length>1?'s ':' ')+failed.join(', ')+'. Correct fields have a ✓.';
  }
  save();render(true);
 }finally{busy=false;}
}
async function submitTask(t,form){
 if(t.type==='final'){await submitFinal(t,form);return;}
 let candidate;
 if(t.type==='choice'||t.type==='multi'){
  const selected=[...form.querySelectorAll('input:checked')].map(x=>Number(x.value));
  if(!selected.length){feedback[t.id]='Choose an answer first.';render(true);return;}
  candidate=t.type==='multi'?selected.sort((a,b)=>a-b).join(','):String(selected[0]);
 }else if(t.type==='match'){
  const vals=[...form.querySelectorAll('[data-match]')].map(x=>x.value);
  if(vals.includes('')){feedback[t.id]='Choose an answer for every row.';render(true);return;}
  candidate=vals.join(',');
 }else if(t.type==='code'){
  candidate=form.querySelector('[name=code]').value.trim();
  if(!candidate){feedback[t.id]='Type your answer first.';render(true);return;}
 } else return;
 await doCheck(t,candidate);
}
async function doClick(event){
 const btn=event.target.closest('button[data-action]');if(!btn)return;
 const action=btn.dataset.action;
 if(action==='begin'){state.started=true;sessionStart=Date.now();save();render();window.scrollTo(0,0);return;}
 if(action==='restart'){
  if(!confirm('Start a NEW mission? Your current evidence and notes will be erased on this device.'))return;
  state=empty();sessionStart=Date.now();openNotebook=false;save();render();window.scrollTo(0,0);return;
 }
 if(action==='notebook'){openNotebook=!openNotebook;render(true);return;}
 if(action==='tab'){state.tab=btn.dataset.tab;save();render(true);return;}
 if(action==='copy'){
  const text='THE GUNPOWDER PARADOX / CASE FILE\n\n'+state.entries.map(e=>e.title+': '+e.body).join('\n')+'\n\nMY NOTES\n'+state.notes;
  try{await navigator.clipboard.writeText(text);announce('Case notes copied!');}catch{announce('Copy was blocked. You can select and copy your notes manually.');}return;
 }
 if(action==='listen'||action==='speak-dialogue'){
  const t=taskMap.get(btn.dataset.task);
  const content=action==='listen'?CHAPTERS[state.chapter].narrative:t.steps[getInter(t).step||0].prompt;
  if(!('speechSynthesis' in window)){announce('Speech is not available on this device.');return;}
  speechSynthesis.cancel();const voice=new SpeechSynthesisUtterance(content);voice.lang='en-GB';voice.rate=.88;speechSynthesis.speak(voice);return;
 }
 if(action==='next'){
  const sec=CHAPTERS[state.chapter];if(!sec.tasks.every(t=>state.solved[t.id]))return;
  if(state.chapter<CHAPTERS.length-1){state.chapter++;save();render();window.scrollTo({top:0,behavior:'instant'});}else{state.won=true;save();render();}
  return;
 }
 const t=taskMap.get(btn.dataset.task);if(!t||state.solved[t.id])return;
 if(action==='hint'){
  state.hints[t.id]=Math.min(t.hints.length,(state.hints[t.id]||0)+1);save();render(true);return;
 }
 if(action==='check'){
  const u=getInter(t);
  const candidate=t.type==='classify'?(u.categories||[]).join(','):(u.order||t.items.map((_,i)=>i)).join(',');
  if(t.type==='classify'&&(u.categories||[]).length!==t.items.length){feedback[t.id]='Select a category for every statement.';render(true);return;}
  await doCheck(t,candidate);return;
 }
 if(action==='dialogue'){await doDialogue(t,btn.dataset.choice);return;}
 if(action==='spot'){await doHotspot(t,Number(btn.dataset.spot));return;}
 if(action==='classify'){
  const u=getInter(t);u.categories||=[];u.categories[Number(btn.dataset.row)]=Number(btn.dataset.choice);delete feedback[t.id];save();render(true);return;
 }
 if(action==='move'){
  const u=getInter(t);u.order ||=t.items.map((_,i)=>i);
  const src=Number(btn.dataset.pos),dst=src+Number(btn.dataset.dir);
  if(dst<0||dst>=u.order.length)return;
  [u.order[src],u.order[dst]]=[u.order[dst],u.order[src]];delete feedback[t.id];save();render(true);return;
 }
}
app.addEventListener('click',e=>{doClick(e).catch(err=>{console.error(err);announce('Something went wrong. Reload to continue from your saved place.');});});
app.addEventListener('submit',e=>{const form=e.target.closest('form[data-taskform]');if(!form)return;e.preventDefault();const t=taskMap.get(form.dataset.taskform);if(t)submitTask(t,form).catch(err=>{console.error(err);announce('Could not check this answer. Please reload.');});});
app.addEventListener('input',e=>{if(e.target.id==='notepad'){state.notes=e.target.value;save();}});
let dragging=null;
app.addEventListener('dragstart',e=>{const el=e.target.closest('[data-drag-task]');if(!el)return;dragging={id:el.dataset.dragTask,pos:Number(el.dataset.pos)};e.dataTransfer.effectAllowed='move';});
app.addEventListener('dragover',e=>{const el=e.target.closest('[data-drag-task]');if(el&&dragging&&el.dataset.dragTask===dragging.id)e.preventDefault();});
app.addEventListener('drop',e=>{const el=e.target.closest('[data-drag-task]');if(!dragging||!el||el.dataset.dragTask!==dragging.id)return;e.preventDefault();const t=taskMap.get(dragging.id),u=getInter(t);u.order||=t.items.map((_,i)=>i);let [element]=u.order.splice(dragging.pos,1);u.order.splice(Number(el.dataset.pos),0,element);dragging=null;save();render(true);});
window.addEventListener('beforeunload',()=>{state.elapsedMs=elapsed();sessionStart=Date.now();save();});
setInterval(()=>{if(!state.started)return;const el=document.getElementById('time');if(el)el.textContent=clock();},1000);
if(!window.crypto?.subtle){console.warn('Crypto unavailable. GitHub Pages uses HTTPS and provides it.');}
render();
})();
