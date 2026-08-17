
const firebaseConfig={apiKey:"AIzaSyAG2NIp2bDAWvyIQPI3to0kSoltdzKv92w",authDomain:"project-5867548053819796777.firebaseapp.com",projectId:"project-5867548053819796777",storageBucket:"project-5867548053819796777.firebasestorage.app",messagingSenderId:"715121742276",appId:"1:715121742276:web:ff1fa8f2ba5d973e015491"};
firebase.initializeApp(firebaseConfig);const auth=firebase.auth(),db=firebase.firestore();
try{db.enablePersistence({synchronizeTabs:true}).catch(()=>{});}catch(e){}
const CACHE_PREFIX='539_v5_cache_';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],fmt=n=>String(n).padStart(2,'0'),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const MAP={1:[10,21,39],2:[4,20,22],3:[5,27,30],4:[2,7,24],5:[6,9,25],6:[5,11,26],7:[11,14,27],8:[6,12,28],9:[5,14,29],10:[1,9,30],11:[6,7,31],12:[8,21,32],13:[15,31,33],14:[9,18,34],15:[13,35,36],16:[14,21,36],17:[12,22,37],18:[21,19,38],19:[18,39,38],20:[2,10,19],21:[1,12,18],22:[2,17,23],23:[9,32,37],24:[4,22,28],25:[5,23,29],26:[6,28,31],27:[7,22,32],28:[8,26,32],29:[9,32,33],30:[9,10,35],31:[11,17,26],32:[12,23,28],33:[13,29,35],34:[14,33,34],35:[15,33,36],36:[16,35,38],37:[6,17,23],38:[18,35,39],39:[1,19,38]};
const DEFAULT_RULES=[
{id:'r12',title:'12開｜三期內蠻牌',triggers:[12],picks:[15,25,35],period:3,targetMin:1,detail:'🚗牌專用・三中一'},
{id:'r36',title:'36開｜顧37、38、39',triggers:[36],picks:[37,38,39],period:5,targetMin:1,detail:'坐車專用版・三中一～三中二'},
{id:'r23',title:'23開｜養🚗牌',triggers:[23],picks:[12,16,28],period:5,targetMin:1,detail:'三中一'},
{id:'r08',title:'08開｜11、22、33',triggers:[8],picks:[11,22,33],period:5,targetMin:1,detail:'三中一～三中二・重點11、22'},
{id:'r33',title:'33開｜鐵8尾',triggers:[33],picks:[8,18,28,38],period:5,targetMin:1,detail:'坐🚗專用版'},
{id:'r10',title:'10開｜養🚗牌',triggers:[10],picks:[11,12,13],period:5,targetMin:1,detail:'三中一'},
{id:'r17',title:'17開｜保開2尾',triggers:[17],picks:[2,12,22,32],period:5,targetMin:1,detail:'鐵🚗牌'},
{id:'r0208',title:'02、08開｜順一順二',triggers:[2,8],picks:[12,16,22],period:5,targetMin:1,detail:'三中一～三中二・重點12、22'},
{id:'r22',title:'22開｜顧24、25、36',triggers:[22],picks:[24,25,36],period:5,targetMin:1,detail:'三中一～三中二'},
{id:'r09',title:'09開｜四期內鐵1尾',triggers:[9],picks:[1,11,21,31],period:4,targetMin:1,detail:'蠻牌01、07另行觀察'}];
let state={history:[],rules:DEFAULT_RULES.map(x=>({...x})),updatedAt:null},current=null,user=null,unsubscribe=null,saving=false,authMode='login';
function cacheKey(uid){return CACHE_PREFIX+(uid||localStorage.getItem('539_last_uid')||'last')}
function saveLocalCache(uid=user?.uid){try{localStorage.setItem(cacheKey(uid),JSON.stringify({history:state.history,rules:state.rules,updatedAt:state.updatedAt||Date.now()}));if(uid)localStorage.setItem('539_last_uid',uid)}catch(e){}}
function loadLocalCache(uid){try{const raw=localStorage.getItem(cacheKey(uid))||localStorage.getItem(cacheKey());if(!raw)return false;const d=JSON.parse(raw);if(!Array.isArray(d.history)||!Array.isArray(d.rules))return false;state={...state,history:d.history,rules:d.rules.map(normalizeRule),updatedAt:d.updatedAt||null};return true}catch(e){return false}}
function updateOnlineUI(){const off=!navigator.onLine;$('#offlineNotice')?.classList.toggle('show',off);if(off){$('#cloudDot')?.classList.remove('online');if($('#cloudText'))$('#cloudText').textContent='離線・本機版路';if($('#syncState'))$('#syncState').textContent='目前離線，使用最後同步資料';}else if(user){$('#cloudDot')?.classList.add('online');if($('#cloudText'))$('#cloudText').textContent='雲端已連線';}}
window.addEventListener('online',()=>{updateOnlineUI();if(user)saveCloud()});window.addEventListener('offline',updateOnlineUI);
const inputs=$$('#inputs .num');
function parseNums(s){return [...new Set(String(s).split(/[^0-9]+/).filter(Boolean).map(Number).filter(n=>n>=1&&n<=39))]}
function sortedHistory(){return [...state.history].sort((a,b)=>String(a.date).localeCompare(String(b.date))||Number(a.createdAt||0)-Number(b.createdAt||0))}
function setMsg(el,text,ok=true){el.textContent=text;el.className='msg '+(ok?'ok':'err')}
function showTab(id){$$('.panel').forEach(x=>x.classList.toggle('active',x.id===id));$$('[data-tab]').forEach(x=>x.classList.toggle('active',x.dataset.tab===id));if(id==='paperPanel')renderPaper();if(id==='recommend')renderRecommendations();if(id==='tracking')renderTracks();if(id==='statsPanel')renderStats();if(id==='history')renderHistory();if(id==='rules')renderRules()}
$$('[data-tab]').forEach(b=>b.onclick=()=>showTab(b.dataset.tab));
function candidateGroups(nums){return nums.map(source=>({source,picks:MAP[source]||[]}))}
const CN_POS={一:1,二:2,三:3,四:4,五:5};
function inferRulePosition(r){const out={};const title=String(r.title||'');const ts=(r.triggers||[]).map(Number);if(ts.length===1){const m=title.match(/(?:順|第)\s*([一二三四五1-5])/);if(m){const pos=CN_POS[m[1]]||Number(m[1]);if(pos>=1&&pos<=5)out[ts[0]]=[pos]}}else if(ts.length>1&&/順一.*順二|順一順二/.test(title)){ts.forEach(n=>out[n]=[1,2])}return out}
function normalizeRule(r){const x={...r};x.triggers=(x.triggers||[]).map(Number);x.picks=(x.picks||[]).map(Number);x.triggerMode=x.triggerMode||((x.triggers.length>1&&/順一.*順二|順一順二/.test(String(x.title||'')))?'all':'any');x.positions=x.positions&&Object.keys(x.positions).length?x.positions:inferRulePosition(x);return x}
function parsePositions(text,triggers){const t=String(text||'').trim(),out={};if(!t)return out;if(triggers.length===1&&/^[1-5]$/.test(t)){out[triggers[0]]=[Number(t)];return out}const re=/(\d{1,2})\s*[:=]\s*([1-5](?:\s*[\/|,，]\s*[1-5])*)/g;let m;while((m=re.exec(t))){const n=Number(m[1]);if(!triggers.includes(n))continue;out[n]=[...new Set(m[2].split(/[\/|,，]/).map(Number).filter(p=>p>=1&&p<=5))]}return out}
function positionText(r){r=normalizeRule(r);const entries=Object.entries(r.positions||{}).filter(([,p])=>Array.isArray(p)&&p.length);if(!entries.length)return '位置不限';return entries.map(([n,p])=>`${fmt(+n)}：第${p.join('/')}顆`).join('、')}
function ruleMatches(r,nums){r=normalizeRule(r);const ok=n=>{const idx=nums.indexOf(Number(n));if(idx<0)return false;const allowed=(r.positions||{})[n]||(r.positions||{})[String(n)];return !Array.isArray(allowed)||!allowed.length||allowed.includes(idx+1)};return r.triggerMode==='all'?r.triggers.every(ok):r.triggers.some(ok)}
function matchedRules(nums){return state.rules.map(normalizeRule).filter(r=>ruleMatches(r,nums))}
function analyze(){const nums=inputs.map(x=>Number(x.value));if(nums.some(n=>!Number.isInteger(n)||n<1||n>39)||new Set(nums).size!==5){setMsg($('#analyzeMsg'),'請輸入 5 個不重複的 01～39 號碼。',false);return}const groups=candidateGroups(nums),freq={};groups.flatMap(g=>g.picks).forEach(n=>freq[n]=(freq[n]||0)+1);current={nums,groups,repeats:Object.entries(freq).filter(([,v])=>v>1).sort((a,b)=>b[1]-a[1]||a[0]-b[0]),matched:matchedRules(nums)};renderAnalysis();setMsg($('#analyzeMsg'),'分析完成，可儲存到雲端。')}
function renderAnalysis(){if(!current)return;$('#resultCard').hidden=false;$('#focusCard').hidden=false;$('#saveCard').hidden=false;$('#candidateGroups').innerHTML=current.groups.map(g=>`<div class="candidateGroup"><span class="source">${fmt(g.source)} 對照</span><span>→</span><span>${g.picks.map(n=>`<span class="candidate">${fmt(n)}</span>`).join('')}</span></div>`).join('');$('#repeatNote').innerHTML=current.repeats.length?`<div class="repeat">重複備註：${current.repeats.map(([n,v])=>`${fmt(+n)}（${v} 次）`).join('、')}</div>`:'';$('#focusList').innerHTML=current.repeats.length?current.repeats.map(([n,v],i)=>`<div class="rank"><span class="rankNo">${i+1}</span><div class="rankMain"><b>${fmt(+n)}</b><div class="mini">被 ${v} 個開獎號帶出</div></div><b>${'★'.repeat(Math.min(5,v+2))}</b></div>`).join(''):'<div class="empty">本期沒有重複候選。</div>';$('#ruleResults').innerHTML=current.matched.length?current.matched.map(ruleHTML).join(''):'<div class="empty">本期沒有觸發收藏規則。</div>'}
function ruleHTML(r){r=normalizeRule(r);return `<div class="rule"><span class="tag">${r.period}期</span><h3>${esc(r.title)}</h3><div class="picks">${r.picks.map(fmt).join('・')}</div><div class="mini">觸發：${r.triggerMode==='all'?'全部號碼':'任一號碼'}｜${esc(positionText(r))}</div><div class="mini">${esc(r.detail||'')}｜單期至少命中 ${r.targetMin}</div></div>`}
async function saveCloud(){state.updatedAt=Date.now();saveLocalCache();if(!user||!navigator.onLine){if($('#syncState'))$('#syncState').textContent='已存本機，連線後再同步';return}saving=true;$('#syncState').textContent='正在同步…';try{await db.doc(`users/${user.uid}/app/main`).set(state);saveLocalCache(user.uid);$('#syncState').textContent='已同步到雲端';}catch(e){saveLocalCache(user.uid);$('#syncState').textContent='雲端暫時失敗，已保存在本機';}finally{saving=false}}
async function saveCurrent(){if(!current)return;const date=$('#recordDate').value;if(!date){setMsg($('#analyzeMsg'),'請選擇日期。',false);return}const rec={id:date,date,issue:$('#issue').value.trim(),nums:current.nums,groups:current.groups,note:$('#note').value.trim(),createdAt:Date.now()};state.history=state.history.filter(x=>x.date!==date).concat(rec);await saveCloud();renderAll();setMsg($('#analyzeMsg'),'已儲存並同步。')}
function deriveTracks(){const h=sortedHistory(),out=[];h.forEach((draw,idx)=>matchedRules(draw.nums).forEach(r=>{const future=h.slice(idx+1,idx+1+r.period);const checks=future.map(d=>({date:d.date,hits:d.nums.filter(n=>r.picks.includes(n))}));const best=Math.max(0,...checks.map(x=>x.hits.length));const achieved=best>=r.targetMin;const expired=future.length>=r.period&&!achieved;out.push({id:`${draw.date}_${r.id}`,rule:r,start:draw.date,checks,remaining:Math.max(0,r.period-future.length),status:achieved?'done':expired?'expired':'active',best})}));return out}
function trackHTML(t){const pct=Math.min(100,(t.checks.length/t.rule.period)*100);return `<div class="track"><div class="trackTop"><div><b>${esc(t.rule.title)}</b><div class="mini">啟動 ${t.start}｜${t.rule.picks.map(fmt).join('、')}</div></div><span class="status ${t.status}">${t.status==='active'?`剩 ${t.remaining} 期`:t.status==='done'?'已達標':'已到期'}</span></div><div class="progress"><i style="width:${pct}%"></i></div><div class="mini">${t.checks.length?t.checks.map(c=>`${c.date}：${c.hits.length?c.hits.map(fmt).join('、'):'—'}`).join('　'):'尚無後續期數'}</div></div>`}
function recommendationModel(){
 const h=sortedHistory();if(!h.length)return{latest:null,items:[],ranked:[]};
 const latest=h[h.length-1],latestGroups=candidateGroups(latest.nums),tracks=deriveTracks().filter(t=>t.status==='active');
 const scores={};for(let n=1;n<=39;n++)scores[n]={n,score:0,reasons:[],sources:new Set(),parts:{map:0,rule:0,history:0,recent:0,diversity:0}};
 // 1. 本期對照：保留來源，但重複只是一個因素，並設上限
 latestGroups.forEach(g=>g.picks.forEach(n=>{let x=scores[n];x.parts.map+=6;x.sources.add(g.source)}));
 Object.values(scores).forEach(x=>{x.parts.map=Math.min(12,x.parts.map);if(x.parts.map)x.reasons.push(`本期對照 ${x.sources.size} 個來源`)});
 // 2. 收藏版：目前追蹤中的牌支 + 最新一期新觸發規則
 tracks.forEach(t=>t.rule.picks.forEach(n=>{scores[n].parts.rule+=5}));
 matchedRules(latest.nums).forEach(r=>r.picks.forEach(n=>{scores[n].parts.rule+=5}));
 Object.values(scores).forEach(x=>{x.parts.rule=Math.min(15,x.parts.rule);if(x.parts.rule)x.reasons.push('收藏版追蹤加權')});
 // 3. 歷史轉移驗證：最新五顆各自的對照號，在過去相同來源後的下一期命中表現
 const trans={};for(let i=0;i<h.length-1;i++){const next=new Set(h[i+1].nums);h[i].nums.forEach(src=>(MAP[src]||[]).forEach(p=>{const k=src+'>'+p;trans[k]=trans[k]||{t:0,h:0};trans[k].t++;if(next.has(p))trans[k].h++}))}
 latestGroups.forEach(g=>g.picks.forEach(n=>{const st=trans[g.source+'>'+n];if(st&&st.t>=2){const rate=st.h/st.t;const add=Math.min(10,rate*8+Math.min(2,st.t/10));scores[n].parts.history+=add}}));
 Object.values(scores).forEach(x=>{x.parts.history=Math.min(14,x.parts.history);if(x.parts.history>=2)x.reasons.push('歷史下期驗證加權')});
 // 4. 最近牌路節奏：不是追熱也不是追冷，偏好近 2~8 期有脈絡但非最新一期剛開
 const recent=[...h].reverse().slice(0,10);const rc={};recent.forEach((d,idx)=>d.nums.forEach(n=>{rc[n]=(rc[n]||0)+1;if(scores[n]._gap==null)scores[n]._gap=idx}));
 Object.values(scores).forEach(x=>{const gap=x._gap==null?99:x._gap,c=rc[x.n]||0;let add=0;if(gap>=1&&gap<=3)add+=3;else if(gap>=4&&gap<=8)add+=2;else if(gap===0)add-=1;if(c>=2&&c<=4)add+=2;x.parts.recent=add;if(add>0)x.reasons.push('近期牌路節奏')});
 // 5. 分散度：有不同類型訊號（對照+收藏+歷史）才加分，避免只靠重複
 Object.values(scores).forEach(x=>{const types=[x.parts.map>0,x.parts.rule>0,x.parts.history>0,x.parts.recent>0].filter(Boolean).length;x.parts.diversity=types>=3?5:types===2?2:0;if(x.parts.diversity)x.reasons.push('多訊號交叉') ;x.score=x.parts.map+x.parts.rule+x.parts.history+x.parts.recent+x.parts.diversity});
 // 最新一期開出的號碼不直接排除，但降權，避免只追前期重複
 latest.nums.forEach(n=>scores[n].score-=4);
 const ranked=Object.values(scores).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||b.parts.rule-a.parts.rule||b.parts.history-a.parts.history||a.n-b.n);
 // 選 5 碼：先取高分，再確保來源與規則不被單一重複候選壟斷
 const selected=[];const usedSources={};for(const x of ranked){let penalty=[...x.sources].reduce((m,s)=>m+(usedSources[s]||0),0)*1.2;const effective=x.score-penalty;if(selected.length<5){selected.push({...x,effective});[...x.sources].forEach(s=>usedSources[s]=(usedSources[s]||0)+1)}}
 return{latest,items:selected,ranked};
}
function similarHistoryModel(){
 const h=sortedHistory();if(h.length<2)return{latest:h[h.length-1]||null,items:[],cases:[],cold:new Set()};
 const latest=h[h.length-1],latestSet=new Set(latest.nums),prior=h.slice(0,-1),recent12=h.slice(Math.max(0,h.length-13),h.length-1),recentSet=new Set(recent12.flatMap(d=>d.nums));
 const freq={},cases=[];
 prior.forEach(d=>{const overlap=d.nums.filter(n=>latestSet.has(n));if(overlap.length>=2){const companions=d.nums.filter(n=>!latestSet.has(n));cases.push({date:d.date,overlap,companions});companions.forEach(n=>{if(!recentSet.has(n)){freq[n]=freq[n]||{n,count:0,dates:[],overlaps:0};freq[n].count++;freq[n].dates.push(d.date);freq[n].overlaps+=overlap.length}})}});
 const items=Object.values(freq).sort((a,b)=>b.count-a.count||b.overlaps-a.overlaps||a.n-b.n).slice(0,5);
 return{latest,items,cases:cassesSort(cases),cold:new Set(Object.keys(freq).map(Number)),recent12};
}
function cassesSort(a){return a.sort((x,y)=>y.overlap.length-x.overlap.length||String(y.date).localeCompare(String(x.date)))}
function renderSimilarModel(){
 const m=similarHistoryModel(),meta=$('#similarMeta'),balls=$('#similarBalls'),cases=$('#similarCases'),over=$('#modelOverlap');
 if(!meta)return;
 if(!m.latest){meta.innerHTML='資料不足。';balls.innerHTML='';cases.innerHTML='';over.innerHTML='';return}
 const byOverlap={2:0,3:0,4:0,5:0};m.cases.forEach(c=>byOverlap[c.overlap.length]=(byOverlap[c.overlap.length]||0)+1);
 const start=m.cases.length?m.cases.map(c=>c.date).sort()[0]:'—';
 meta.innerHTML=`依 <b>${m.latest.date}</b> ${m.latest.nums.map(fmt).join('・')} 全量回溯；從 <b>${start}</b> 起逐期交叉比對，共找到 <b>${m.cases.length}</b> 個至少重複 2 碼的歷史期。<br><span class="mini">重複2碼：${byOverlap[2]||0} 組｜重複3碼：${byOverlap[3]||0} 組｜重複4碼：${byOverlap[4]||0} 組｜重複5碼：${byOverlap[5]||0} 組。以下明細 <b>全部列出，不截斷</b>；模型 B 建議仍只取「近12期未開」後的前 5 碼。</span>`;
 balls.innerHTML=m.items.length?m.items.map(x=>`<div class="recBall"><b>${fmt(x.n)}</b><strong>伴隨 ${x.count} 次</strong><div class="why">全量相似期：${x.dates.length} 組｜例：${x.dates.slice(-3).join('、')}</div></div>`).join(''):'<div class="empty">目前沒有符合「全量相似期伴隨＋近12期未開」的號碼。</div>';
 cases.innerHTML=m.cases.length?`<div class="mini" style="margin:4px 0 10px">完整交叉明細 ${m.cases.length}/${m.cases.length} 組（先依重複碼數多到少，再依日期新到舊）</div>`+m.cases.map((c,i)=>`<div class="candidateGroup"><span class="source">${String(i+1).padStart(2,'0')}｜${c.date.slice(5)}</span><span>重複 <b>${c.overlap.map(fmt).join('、')}</b>（${c.overlap.length}碼）</span><span>→ 伴隨 <b>${c.companions.map(fmt).join('、')||'—'}</b></span></div>`).join(''):'<div class="empty">尚無相似歷史期。</div>';
 const a=new Set(recommendationModel().items.map(x=>x.n)),both=m.items.filter(x=>a.has(x.n));
 over.innerHTML=both.length?`<div class="recGrid">${both.map(x=>`<div class="recBall"><b>${fmt(x.n)}</b><strong>雙模型同時支持</strong><div class="why">模型 A ＋ 全量模型 B</div></div>`).join('')}</div>`:'<div class="empty">這一期兩個模型沒有交集，保持兩組分開看。</div>'
}
function renderRecommendations(){const m=recommendationModel(),meta=$('#recommendMeta'),balls=$('#recommendBalls'),ranking=$('#recommendRanking'),factors=$('#recommendFactors');if(!m.latest){meta.innerHTML='尚無歷史資料，先輸入至少一期開獎。';balls.innerHTML='';ranking.innerHTML='';factors.innerHTML='';return}meta.innerHTML=`依 <b>${m.latest.date}</b> 開出順序 ${m.latest.nums.map(fmt).join('・')} 計算。建議牌支會隨新增的歷史、收藏追蹤及下期驗證自動改變。`;const max=Math.max(1,...m.items.map(x=>x.score));balls.innerHTML=m.items.map((x,i)=>`<div class="recBall"><b>${fmt(x.n)}</b><strong>研究分數 ${x.score.toFixed(1)}</strong><div class="scorebar"><i style="width:${Math.max(8,x.score/max*100)}%"></i></div><div class="why">${x.reasons.slice(0,3).join('・')||'綜合排序'}</div></div>`).join('')||'<div class="empty">資料不足。</div>';ranking.innerHTML=m.ranked.slice(0,12).map((x,i)=>`<div class="rank"><span class="rankNo">${i+1}</span><div class="rankMain"><b>${fmt(x.n)}</b><div class="mini">${x.reasons.slice(0,2).join('・')}</div></div><b>${x.score.toFixed(1)}</b></div>`).join('');factors.innerHTML=`<div class="factorGrid"><div class="factor"><b>本期三碼對照</b><div>每個最新開獎號的三碼來源，重複有加分但設上限。</div></div><div class="factor"><b>收藏版</b><div>目前追蹤中與本期新觸發的收藏牌支。</div></div><div class="factor"><b>歷史下期驗證</b><div>過去相同來源號開出後，對照號在下一期實際出現的紀錄。</div></div><div class="factor"><b>近期牌路</b><div>結合最近 10 期節奏，不單純追熱號或冷號。</div></div><div class="factor"><b>多訊號交叉</b><div>對照、收藏、歷史、近期節奏同時支持時才額外加分。</div></div><div class="factor"><b>隨機性提醒</b><div>分數只反映你這套資料規則的研究排序，不代表真實開獎機率。</div></div></div>`;renderSimilarModel();}
function recommendationText(){const a=recommendationModel(),b=similarHistoryModel();if(!a.items.length)return'';return `539 雙模型研究｜依 ${a.latest.date}
模型A：${a.items.map(x=>fmt(x.n)).join('、')}
模型B：${b.items.map(x=>fmt(x.n)).join('、')||'目前無符合'}
（研究排序，非中獎機率）`}
function renderDashboard(){const h=[...sortedHistory()].reverse(),tracks=deriveTracks(),done=tracks.filter(x=>x.status==='done').length,expired=tracks.filter(x=>x.status==='expired').length;$('#kpiDraws').textContent=h.length;$('#kpiActive').textContent=tracks.filter(x=>x.status==='active').length;$('#kpiDone').textContent=done;$('#kpiRate').textContent=(done+expired?Math.round(done/(done+expired)*100):0)+'%';$('#recentDraws').innerHTML=h.slice(0,5).map(x=>`<div class="history"><b>${x.date}</b><div class="drawnums">${x.nums.map(fmt).join('・')}</div><div class="mini">大小排序：${[...x.nums].sort((a,b)=>a-b).map(fmt).join('・')}</div></div>`).join('')||'<div class="empty">尚無紀錄。</div>';const rank=ruleRanking(tracks);$('#dashboardRanks').innerHTML=rank.slice(0,5).map((x,i)=>`<div class="rank"><span class="rankNo">${i+1}</span><div class="rankMain"><b>${esc(x.title)}</b><div class="mini">${x.done}/${x.closed} 達標</div></div><b>${x.rate}%</b></div>`).join('')||'<div class="empty">尚無可計算資料。</div>';$('#dashboardTracks').innerHTML=tracks.filter(x=>x.status==='active').slice(-5).reverse().map(trackHTML).join('')||'<div class="empty">目前沒有進行中的追蹤。</div>';const rm=recommendationModel();$('#dashboardRecommend').innerHTML=rm.items.length?`<div class="recGrid">${rm.items.map(x=>`<div class="recBall"><b>${fmt(x.n)}</b><strong>${x.score.toFixed(1)} 分</strong><div class="why">${x.reasons.slice(0,2).join('・')}</div></div>`).join('')}</div><div class="mini" style="margin-top:9px">研究排序，非實際中獎機率。完整原因請看「雙模型建議」。</div>`:'<div class="empty">輸入歷史資料後會自動產生。</div>'}
function ruleRanking(tracks){return state.rules.map(r=>{const a=tracks.filter(t=>t.rule.id===r.id),closed=a.filter(t=>t.status!=='active'),done=closed.filter(t=>t.status==='done').length;return{title:r.title,closed:closed.length,done,rate:closed.length?Math.round(done/closed.length*100):0}}).sort((a,b)=>b.rate-a.rate||b.closed-a.closed)}
function renderPaper(){const h=sortedHistory();$('#paperBody').innerHTML=h.map((d,i)=>{const next=h[i+1],nextSet=new Set(next?.nums||[]),rules=matchedRules(d.nums),validDates=h.slice(i+1,i+1+Math.max(0,...rules.map(r=>r.period))).map(x=>x.date.slice(5).replace('-','/'));return d.nums.map((n,row)=>`<tr>${row===0?`<td rowspan="5" class="dateCell">${d.date.slice(5).replace('-','/')}</td>`:''}<td class="drawCell">${fmt(n)}</td>${(MAP[n]||[]).map(x=>`<td>${nextSet.has(x)?`<span class="circle">${fmt(x)}</span>`:`<span class="plainNum">${fmt(x)}</span>`}</td>`).join('')}${row===0?`<td rowspan="5" class="ruleCell">${rules.length?rules.map(r=>`<b>${esc(r.title)}</b><br>${r.picks.map(fmt).join('、')}（${r.period}期）`).join('<hr>'):'—'}</td><td rowspan="5">${validDates.length?validDates.join('、'):'待後續資料'}</td>`:''}</tr>`).join('')}).join('')||'<tr><td colspan="7">尚無資料</td></tr>'}
function renderTracks(){const t=deriveTracks();$('#trackList').innerHTML=[...t].reverse().map(trackHTML).join('')||'<div class="empty">尚無追蹤。</div>'}
function renderStats(){const t=deriveTracks();$('#ruleRanks').innerHTML=ruleRanking(t).map((x,i)=>`<div class="rank"><span class="rankNo">${i+1}</span><div class="rankMain"><b>${esc(x.title)}</b><div class="mini">${x.done}/${x.closed} 達標</div></div><b>${x.rate}%</b></div>`).join('');const h=sortedHistory(),counts={};for(let i=0;i<h.length-1;i++){const next=new Set(h[i+1].nums);h[i].nums.forEach(src=>(MAP[src]||[]).forEach(p=>{const k=`${fmt(src)}→${fmt(p)}`;counts[k]=counts[k]||{total:0,hit:0};counts[k].total++;if(next.has(p))counts[k].hit++}))}$('#mapStats').innerHTML=Object.entries(counts).sort((a,b)=>b[1].hit/b[1].total-a[1].hit/a[1].total).slice(0,20).map(([k,v],i)=>`<div class="rank"><span class="rankNo">${i+1}</span><div class="rankMain"><b>${k}</b><div class="mini">命中 ${v.hit}/${v.total}</div></div><b>${Math.round(v.hit/v.total*100)}%</b></div>`).join('')||'<div class="empty">至少需要兩期資料。</div>'}
function renderHistory(){const h=sortedHistory();$('#historyList').innerHTML=[...h].reverse().map((x,ri)=>{const idx=h.findIndex(y=>y.date===x.date),next=h[idx+1],nextSet=new Set(next?.nums||[]),groups=x.groups?.length?x.groups:candidateGroups(x.nums),freq={};groups.flatMap(g=>g.picks).forEach(n=>freq[n]=(freq[n]||0)+1);return `<div class="history"><div class="historyHead"><div><b>${x.date}${x.issue?'｜'+esc(x.issue):''}</b><div class="drawnums">${x.nums.map(fmt).join('・')}</div><div class="mini">大小排序：${[...x.nums].sort((a,b)=>a-b).map(fmt).join('・')}</div></div><button class="btn danger" onclick="deleteHistory('${x.date}')">刪除</button></div><div class="candidateGroups" style="margin-top:10px">${groups.map(g=>`<div class="candidateGroup"><span class="source">${fmt(g.source)} 對照</span><span>→</span><span>${g.picks.map(n=>`<span class="candidate ${nextSet.has(n)?'hit':''}">${fmt(n)}</span>`).join('')}</span></div>`).join('')}</div><div class="repeat">${next?`下一期 ${next.date}：${next.nums.map(fmt).join('、')}`:'尚無下一期資料'}${Object.values(freq).some(v=>v>1)?'<br>重複：'+Object.entries(freq).filter(([,v])=>v>1).map(([n,v])=>`${fmt(+n)}（${v}次）`).join('、'):''}</div>${x.note?`<div class="mini" style="margin-top:8px">${esc(x.note)}</div>`:''}</div>`}).join('')||'<div class="empty">尚無紀錄。</div>'}
window.deleteHistory=async date=>{if(confirm('確定刪除這筆資料？')){state.history=state.history.filter(x=>x.date!==date);await saveCloud();renderAll()}}
function ruleSortKey(r){const ts=[...(r.triggers||[])].map(Number).filter(Number.isFinite).sort((a,b)=>a-b);return{first:ts.length?ts[0]:999,all:ts.map(n=>String(n).padStart(2,'0')).join(','),title:r.title||''}}
function renderRules(){const sorted=[...state.rules].sort((a,b)=>{const A=ruleSortKey(a),B=ruleSortKey(b);return A.first-B.first||A.all.localeCompare(B.all,'zh-Hant',{numeric:true})||A.title.localeCompare(B.title,'zh-Hant',{numeric:true})});$('#manageRules').innerHTML=sorted.map(r=>`${ruleHTML(r)}<div class="actions" style="margin-top:-5px;margin-bottom:10px"><button class="btn soft" onclick="editRule('${r.id}')">修改</button><button class="btn danger" onclick="deleteRule('${r.id}')">刪除</button></div>`).join('') }
function clearRuleForm(){['ruleEditId','ruleTitle','ruleTriggers','rulePicks','ruleDetail','rulePositions'].forEach(id=>$('#'+id).value='');$('#rulePeriod').value=5;$('#ruleTargetMin').value=1;$('#ruleTriggerMode').value='any';$('#saveRuleBtn').textContent='儲存規則'}
async function saveRule(){const title=$('#ruleTitle').value.trim(),triggers=parseNums($('#ruleTriggers').value),picks=parseNums($('#rulePicks').value),period=+$('#rulePeriod').value,targetMin=+$('#ruleTargetMin').value,detail=$('#ruleDetail').value.trim(),triggerMode=$('#ruleTriggerMode').value,positions=parsePositions($('#rulePositions').value,triggers);if(!title||!triggers.length||!picks.length||period<1||targetMin<1){setMsg($('#ruleMsg'),'請完整填寫。',false);return}if($('#rulePositions').value.trim()&&!Object.keys(positions).length){setMsg($('#ruleMsg'),'位置條件格式不正確。單一號碼可填 5；多號碼請填 02=1/2、08=1/2。',false);return}const id=$('#ruleEditId').value||'custom_'+Date.now(),r={id,title,triggers,picks,period,targetMin,detail,triggerMode,positions};state.rules=state.rules.filter(x=>x.id!==id).concat(r);await saveCloud();clearRuleForm();renderRules();setMsg($('#ruleMsg'),'規則已儲存。')}
window.editRule=id=>{let r=state.rules.find(x=>x.id===id);if(!r)return;r=normalizeRule(r);$('#ruleEditId').value=r.id;$('#ruleTitle').value=r.title;$('#ruleTriggers').value=r.triggers.map(fmt).join('、');$('#rulePicks').value=r.picks.map(fmt).join('、');$('#rulePeriod').value=r.period;$('#ruleTargetMin').value=r.targetMin;$('#ruleTriggerMode').value=r.triggerMode||'any';$('#rulePositions').value=Object.entries(r.positions||{}).map(([n,p])=>`${fmt(+n)}=${p.join('/')}`).join('、');$('#ruleDetail').value=r.detail||'';$('#saveRuleBtn').textContent='更新規則';showTab('rules')}
window.deleteRule=async id=>{if(confirm('確定刪除規則？')){state.rules=state.rules.filter(x=>x.id!==id);await saveCloud();renderRules()}}
async function syncArchive(){
 const btn=$('#syncArchiveBtn'),msg=$('#archiveMsg');
 btn.disabled=true;setMsg(msg,'正在向台灣彩券讀取落球資料…');
 try{
  const API='https://api.taiwanlottery.com/TLCAPIWeB/Lottery/Daily539Result';
  const startDate='2025-11-25';
  const now=new Date();
  const months=[];
  let y=2025,m=11;
  const endY=now.getFullYear(),endM=now.getMonth()+1;
  while(y<endY||(y===endY&&m<=endM)){
   months.push(`${y}-${String(m).padStart(2,'0')}`);
   m++;if(m===13){m=1;y++}
  }
  let imported=[];
  for(const month of months){
   setMsg(msg,`正在讀取 ${month}… 已取得 ${imported.length} 期`);
   const controller=new AbortController();
   const timer=setTimeout(()=>controller.abort(),15000);
   let r;
   try{r=await fetch(`${API}?month=${month}&pageSize=100`,{cache:'no-store',signal:controller.signal})}
   finally{clearTimeout(timer)}
   if(!r.ok)throw new Error(`台彩 ${month} 讀取失敗 HTTP ${r.status}`);
   const json=await r.json();
   const rows=json?.content?.daily539Res||[];
   for(const item of rows){
    const date=String(item.lotteryDate||'').slice(0,10);
    if(!date||date<startDate)continue;
    const nums=(item.drawNumberAppear||[]).map(Number).filter(n=>n>=1&&n<=39).slice(0,5);
    if(nums.length!==5)continue;
    imported.push({id:date,date,issue:String(item.period||''),nums,createdAt:new Date(date+'T12:00:00+08:00').getTime(),source:'台灣彩券 API・落球順序'});
   }
  }
  imported=[...new Map(imported.map(x=>[x.date,x])).values()];
  if(!imported.length)throw new Error('沒有取得任何開獎資料');
  const by=new Map(state.history.map(x=>[x.date,x]));
  let added=0;
  imported.forEach(x=>{if(!by.has(x.date)){by.set(x.date,{...x,groups:candidateGroups(x.nums)});added++}});
  state.history=[...by.values()];
  await saveCloud();renderAll();
  const first=imported.slice().sort((a,b)=>a.date.localeCompare(b.date))[0]?.date;
  const last=imported.slice().sort((a,b)=>b.date.localeCompare(a.date))[0]?.date;
  setMsg(msg,`完成：台彩取得 ${imported.length} 期（${first}～${last}），新增 ${added} 期；目前雲端共 ${state.history.length} 期。`);
 }catch(e){
  setMsg(msg,'補齊失敗：'+(e.name==='AbortError'?'連線逾時':e.message)+'。請確認網路後再按一次。',false)
 }finally{btn.disabled=false}
}
function renderAll(){renderDashboard();if($('#paperPanel').classList.contains('active'))renderPaper();if($('#recommend').classList.contains('active'))renderRecommendations();if($('#tracking').classList.contains('active'))renderTracks();if($('#history').classList.contains('active'))renderHistory();if($('#statsPanel').classList.contains('active'))renderStats();if($('#rules').classList.contains('active'))renderRules()}
function resetAnalysis(){inputs.forEach(x=>x.value='');current=null;['resultCard','focusCard','saveCard'].forEach(id=>$('#'+id).hidden=true);$('#ruleResults').innerHTML='<div class="empty">分析後顯示。</div>';setMsg($('#analyzeMsg'),'')}
function download(name,text,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function exportJSON(){download(`539Ultimate_${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(state,null,2),'application/json')}
function exportCSV(){const rows=[['日期','期別','號碼1','號碼2','號碼3','號碼4','號碼5','備註'],...sortedHistory().map(x=>[x.date,x.issue||'',...x.nums,x.note||''])];download('539紀錄.csv','\ufeff'+rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n'),'text/csv')}
function importJSON(file){const fr=new FileReader();fr.onload=async()=>{try{const d=JSON.parse(fr.result);if(!Array.isArray(d.history)||!Array.isArray(d.rules))throw 0;if(confirm('匯入會覆蓋目前雲端資料，確定？')){state={...state,...d};await saveCloud();renderAll();alert('匯入完成')}}catch{alert('格式不正確')}};fr.readAsText(file)}
async function migrateOld(){const oldH=JSON.parse(localStorage.getItem('full539_history')||'[]'),oldR=JSON.parse(localStorage.getItem('full539_rules')||'[]');if(!oldH.length&&!oldR.length){alert('這台裝置沒有找到 V3 舊資料。');return}if(!confirm(`找到舊紀錄 ${oldH.length} 筆，搬到雲端並合併嗎？`))return;const byDate=new Map(state.history.map(x=>[x.date,x]));oldH.forEach(x=>byDate.set(x.date,{...x,id:x.date,groups:x.candidateGroups||candidateGroups(x.nums)}));state.history=[...byDate.values()];if(oldR.length)state.rules=oldR;await saveCloud();renderAll();alert('搬移完成。')}
let registerMode=false;function setAuthMode(mode){registerMode=mode==='register';$('#authSubmit').textContent=registerMode?'建立帳號':'登入';$('#showLogin').className='btn '+(!registerMode?'dark':'soft');$('#showRegister').className='btn '+(registerMode?'dark':'soft')}
$('#showLogin').onclick=()=>setAuthMode('login');$('#showRegister').onclick=()=>setAuthMode('register');$('#authSubmit').onclick=async()=>{const email=$('#authEmail').value.trim(),pw=$('#authPassword').value;setMsg($('#authMsg'),'處理中…');try{if(registerMode)await auth.createUserWithEmailAndPassword(email,pw);else await auth.signInWithEmailAndPassword(email,pw)}catch(e){setMsg($('#authMsg'),e.message,false)}};
auth.onAuthStateChanged(async u=>{user=u;if(unsubscribe){unsubscribe();unsubscribe=null}if(!u){$('#authGate').hidden=false;$('#mainApp').hidden=true;$('#bottomnav').style.display='none';$('#cloudDot').classList.remove('online');$('#cloudText').textContent='尚未登入';return}localStorage.setItem('539_last_uid',u.uid);loadLocalCache(u.uid);$('#authGate').hidden=true;$('#mainApp').hidden=false;$('#bottomnav').style.display='';$('#userLabel').textContent=u.email;updateOnlineUI();renderAll();const ref=db.doc(`users/${u.uid}/app/main`);unsubscribe=ref.onSnapshot({includeMetadataChanges:true},async snap=>{if(saving)return;if(snap.exists){const d=snap.data();state={history:Array.isArray(d.history)?d.history:[],rules:Array.isArray(d.rules)&&d.rules.length?d.rules.map(normalizeRule):DEFAULT_RULES.map(x=>normalizeRule({...x})),updatedAt:d.updatedAt||null};saveLocalCache(u.uid);$('#syncState').textContent=snap.metadata.fromCache?'本機快取資料':'雲端資料已更新';renderAll();updateOnlineUI()}else if(navigator.onLine){await ref.set(state);saveLocalCache(u.uid);$('#syncState').textContent='已建立你的雲端資料庫';renderAll()}},e=>{if(loadLocalCache(u.uid)){renderAll();$('#syncState').textContent='雲端暫時不可用，顯示本機版路';}else $('#syncState').textContent='讀取失敗：'+e.message;updateOnlineUI()})});
$('#logoutBtn').onclick=()=>auth.signOut();if($('#syncArchiveBtn'))$('#syncArchiveBtn').onclick=syncArchive;$('#refreshRecommendBtn').onclick=renderRecommendations;$('#copyRecommendBtn').onclick=async()=>{const t=recommendationText();if(!t)return alert('目前沒有可複製的建議');try{await navigator.clipboard.writeText(t);alert('已複製 5 碼研究建議')}catch{alert(t)}};$('#migrateBtn').onclick=migrateOld;$('#analyzeBtn').onclick=analyze;$('#exampleBtn').onclick=()=>{[32,39,37,35,9].forEach((n,i)=>inputs[i].value=fmt(n));analyze()};$('#resetBtn').onclick=resetAnalysis;$('#saveBtn').onclick=saveCurrent;$('#saveRuleBtn').onclick=saveRule;$('#cancelRuleBtn').onclick=clearRuleForm;$('#clearHistoryBtn').onclick=async()=>{if(confirm('清空全部雲端歷史紀錄？')){state.history=[];await saveCloud();renderAll()}};$('#exportBtn').onclick=exportJSON;$('#csvBtn').onclick=exportCSV;$('#importInput').onchange=e=>{if(e.target.files[0])importJSON(e.target.files[0]);e.target.value=''};$('#recordDate').value=new Date().toISOString().slice(0,10);inputs.forEach((x,i)=>x.addEventListener('input',()=>{x.value=x.value.replace(/\D/g,'').slice(0,2);if(x.value.length===2&&inputs[i+1])inputs[i+1].focus()}));updateOnlineUI();if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
