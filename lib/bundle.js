var gg=Object.defineProperty;var vg=(n,e)=>{for(var t in e)gg(n,t,{get:e[t],enumerable:!0})};var Rr={};vg(Rr,{CAP_DEFAULT:()=>ji,RULES_VERSION:()=>_s,applyInvalid:()=>Bo,applyMove:()=>wr,canMove:()=>br,cloneState:()=>ti,compareResults:()=>Er,createState:()=>Ss,default:()=>_g,deserialize:()=>Cr,fnv1a:()=>ni,generateBoard:()=>zo,hashState:()=>Mi,hint:()=>ko,isTerminal:()=>Od,legalActions:()=>si,moveCount:()=>Tr,moveReason:()=>Ms,mulberry32:()=>Wn,scoreComponents:()=>bs,serialize:()=>Ar,solve:()=>Yi,terminalReason:()=>zl,topGroup:()=>ii});var _s=1,ji=4;function Wn(n){let e=n>>>0;return function(){e|=0,e=e+1831565813|0;let i=Math.imul(e^e>>>15,1|e);return i=i+Math.imul(i^i>>>7,61|i)^i,((i^i>>>14)>>>0)/4294967296}}function ni(n){let e=2166136261,t=String(n);for(let i=0;i<t.length;i++)e^=t.charCodeAt(i),e=Math.imul(e,16777619);return e>>>0}function Ss(n){return{pegs:n.pegs.map(e=>e.slice()),cap:n.cap|0,colors:n.colors|0,seed:n.seed>>>0,moves:0,invalid:0,undos:0,tick:0,status:"active",terminal:null,moveLimit:n.moveLimit==null?null:n.moveLimit|0}}function ti(n){return{pegs:n.pegs.map(e=>e.slice()),cap:n.cap,colors:n.colors,seed:n.seed,moves:n.moves,invalid:n.invalid,undos:n.undos,tick:n.tick,status:n.status,terminal:n.terminal,moveLimit:n.moveLimit}}function ii(n,e){let t=n.pegs[e];if(!t||t.length===0)return null;let i=t[t.length-1],s=1;for(let r=t.length-2;r>=0&&t[r]===i;r--)s++;return{color:i,size:s}}function Ms(n,e,t){if(n.status!=="active")return"round-over";if(!Number.isInteger(e)||!Number.isInteger(t)||e<0||t<0||e>=n.pegs.length||t>=n.pegs.length)return"bad-peg";if(e===t)return"same-peg";if(n.pegs[e].length===0)return"empty-source";let s=n.pegs[t];if(s.length>=n.cap)return"no-space";let r=ii(n,e);return s.length>0&&s[s.length-1]!==r.color?"color-mismatch":null}function br(n,e,t){return Ms(n,e,t)===null}function Tr(n,e,t){let i=ii(n,e);if(!i)return 0;let s=n.cap-n.pegs[t].length;return Math.min(i.size,Math.max(0,s))}function si(n){let e=[];if(n.status!=="active")return e;for(let t=0;t<n.pegs.length;t++)if(n.pegs[t].length!==0)for(let i=0;i<n.pegs.length;i++)br(n,t,i)&&e.push({from:t,to:i});return e}function Ud(n,e,t){let i=n.pegs[e];if(n.pegs[t].length!==0||i.length!==Tr(n,e,t))return!1;for(let s=1;s<i.length;s++)if(i[s]!==i[0])return!1;return!0}function wr(n,e,t){let i=Ms(n,e,t);if(i){let l=ti(n);return l.invalid++,l.tick++,{state:l,ok:!1,reason:i}}let s=ti(n),r=Tr(n,e,t),o=s.pegs[e].splice(s.pegs[e].length-r,r);for(let l of o)s.pegs[t].push(l);s.moves++,s.tick++;let a=zl(s);return a&&(s.status=a==="solved"?"won":"lost",s.terminal=a),{state:s,ok:!0,moved:r}}function Bo(n){let e=ti(n);return e.invalid++,e.tick++,e}function zl(n){for(let e of n.pegs)if(e.length!==0){for(let t=1;t<e.length;t++)if(e[t]!==e[0])return xg(n)}return"solved"}function xg(n){return n.moveLimit!=null&&n.moves>=n.moveLimit?"move-limit":null}function Od(n){return n.status!=="active"}function bs(n,e,t){let i=n.status==="won",s=n.pegs.filter(h=>h.length>1&&h.every(d=>d===h[0])).length,r=i?1e3:s*100,o=e>0?e:1,a=i?Math.max(0,Math.ceil(o*1.5)-n.moves)*25:0,l=i&&n.undos===0?250:0,c=-15*n.invalid,u=Math.max(0,r+a+l+c);return{completion:r,efficiency:a,mastery:l,invalidPenalty:c,total:u,solved:i,moves:n.moves,par:e,elapsedMs:t|0}}function Er(n,e){return e.total!==n.total?e.total-n.total:!!e.solved!=!!n.solved?(e.solved?1:0)-(n.solved?1:0):n.invalid!==e.invalid?n.invalid-e.invalid:n.elapsedMs!==e.elapsedMs?n.elapsedMs-e.elapsedMs:String(n.sessionId||"").localeCompare(String(e.sessionId||""))}function Mi(n){let e=2166136261,t=i=>{e^=i&255,e=Math.imul(e,16777619)};t(n.cap),t(n.colors),t(n.moves),t(n.invalid);for(let i of n.pegs){t(59);for(let s of i)t(s+1)}return e>>>0}function Ar(n){return JSON.parse(JSON.stringify(n))}function Cr(n){if(!n||!Array.isArray(n.pegs))throw new Error("bad snapshot");return ti(n)}function yg(n){return n.join(",")}function Nd(n){return n.map(yg).sort().join("|")}function Bl(n){for(let e of n)for(let t=1;t<e.length;t++)if(e[t]!==e[0])return!1;return!0}function Yi(n,e,t){let i=t||3e5,s=n.map(c=>c.slice());if(Bl(s))return 0;let r=new Set([Nd(s)]),o=[s],a=0,l=1;for(;o.length>0;){a++;let c=[];for(let u of o)for(let h=0;h<u.length;h++){if(u[h].length===0)continue;let d={pegs:u,cap:e,status:"active"};for(let p=0;p<u.length;p++){if(h===p||u[p].length>=e)continue;let g=ii(d,h);if(u[p].length>0&&u[p][u[p].length-1]!==g.color||Ud(d,h,p))continue;let x=Math.min(g.size,e-u[p].length),f=u.map(y=>y.slice()),m=f[h].splice(f[h].length-x,x);for(let y of m)f[p].push(y);let b=Nd(f);if(!r.has(b)){if(Bl(f))return a;if(r.add(b),c.push(f),++l>i)return null}}}o=c}return null}function zo(n,e,t,i){let s=e+i;for(let a=0;a<64;a++){let l=Wn((n^Math.imul(a+1,2654435769))>>>0),c=[];for(let g=0;g<e;g++)for(let x=0;x<t;x++)c.push(g);for(let g=c.length-1;g>0;g--){let x=Math.floor(l()*(g+1)),f=c[g];c[g]=c[x],c[x]=f}let u=Array.from({length:s},()=>[]),h=s-i,d=0;for(let g=0;g<h;g++)for(;u[g].length<t&&d<c.length;)u[g].push(c[d++]);if(Bl(u))continue;let p=Yi(u,t);if(p!=null&&!(p<Math.max(2,e)))return{pegs:u,par:p}}let r=Array.from({length:s},()=>[]);for(let a=0;a<e;a++)for(let l=0;l<t;l++)r[a%(s-i)].push(a);let o=r[0].pop();return r[1].push(o),{pegs:r,par:Yi(r,t)||4}}function ko(n){let e=si(n).filter(s=>!Ud(n,s.from,s.to));if(e.length===0)return null;let t=null,i=-1/0;for(let s of e){let{state:r}=wr(n,s.from,s.to),o=0;for(let l of r.pegs)l.length>1&&l.every(c=>c===l[0])&&(o+=10),l.length===0&&(o+=2);let a=n.pegs[s.to];a.length>0&&(o+=4),a.length>0&&a.every(l=>l===a[0])&&a.length+Tr(n,s.from,s.to)===n.cap&&(o+=12),o>i&&(i=o,t=s)}return t}var _g={RULES_VERSION:1,CAP_DEFAULT:4,mulberry32:Wn,fnv1a:ni,createState:Ss,cloneState:ti,topGroup:ii,moveReason:Ms,canMove:br,moveCount:Tr,legalActions:si,applyMove:wr,applyInvalid:Bo,terminalReason:zl,isTerminal:Od,scoreComponents:bs,compareResults:Er,hashState:Mi,serialize:Ar,deserialize:Cr,solve:Yi,generateBoard:zo,hint:ko};var Lr=1,bi=[{id:"atelier",name:"Atelier",bg:2367260,floor:4865073,brass:13214247,ambient:16770756,key:16773597,accent:"#e8c07a"},{id:"dawn",name:"Dawn",bg:2827312,floor:5720658,brass:13936974,ambient:16767440,key:16771552,accent:"#f0a8b8"},{id:"dusk",name:"Dusk",bg:1909555,floor:3620956,brass:13214247,ambient:12899583,key:15265535,accent:"#8fa8e8"},{id:"night",name:"Night",bg:1316381,floor:2566966,brass:11570478,ambient:10466520,key:14214399,accent:"#7a94c8"},{id:"ember",name:"Ember",bg:2497044,floor:5125160,brass:14262587,ambient:16763296,key:16768192,accent:"#e88a5a"}];function kl(n){return bi.find(e=>e.id===n)||bi[0]}var ws={default:["#d64541","#3f7fd6","#4caf6d","#f2c94c","#9b59b6","#e67e22"],deuteranopia:["#d64541","#3f7fd6","#f2c94c","#8c8c8c","#9b59b6","#4dd0e1"],protanopia:["#c8b62e","#3f7fd6","#4caf6d","#f2e14c","#7e57c2","#e67e22"],tritanopia:["#d64541","#2ec4b6","#e0719e","#f2c94c","#8d6e63","#4dd0e1"],contrast:["#ff4d4d","#4da6ff","#66ff66","#ffe14d","#ff66ff","#ffa64d"]},Fd=["\u25CF","\u25B2","\u25A0","\u25C6","\u2605","\u2B1F"],Bd=["crimson","indigo","fern","marigold","violet","ember"];function Sg(n){let e=n/47,t=Math.min(6,3+Math.floor(n/10)),i=(n>=30,2),s=4,r=(n+1)%8===0;return{colors:t,cap:s,emptyPegs:i,mastery:r,t:e}}function Ir(n,e,t,i){let s=zo(e,t.colors,t.cap,t.emptyPegs),r={id:n,version:Lr,rulesVersion:1,seed:e,colors:t.colors,cap:t.cap,pegCount:t.colors+t.emptyPegs,pegs:s.pegs,par:s.par,moveLimit:null,timeTargetMs:null,tutorial:null,theme:bi[Math.floor(ni(n)/7)%bi.length].id,goals:{solve:!0}};return Object.assign(r,i||{})}var Pr=[];for(let n=0;n<48;n++){let e=Sg(n),t=ni("journey:"+n+":v"+Lr),i=Ir("journey-"+(n+1),t,e,{title:"Stage "+(n+1),theme:bi[n%bi.length].id});e.mastery&&(i.moveLimit=i.par+2+Math.floor(i.par/4)),i.difficulty=1+Math.round(e.t*9),Pr.push(i)}var Es=Pr.length;function As(n){return Pr[Math.max(0,Math.min(Pr.length-1,n))]}var Ti=[{id:"learn-1",title:"Lift & drop",text:"Loops lift from the TOP of a peg. Select the highlighted peg, then drop the loop onto the empty peg.",pegs:[[0,1],[0],[1],[]],cap:4,colors:2,seed:101,steps:[{expect:{from:0,to:3},prompt:"Lift the indigo loop off peg one onto the empty peg."},{expect:{from:1,to:0},prompt:"Now stack crimson onto crimson to finish."}],theme:"atelier"},{id:"learn-2",title:"Match colors",text:"A loop may only land on a matching color or an empty peg. Mismatched pegs reject the drop.",pegs:[[0,1],[1,0],[],[]],cap:4,colors:2,seed:102,steps:[{expect:{from:0,to:2},prompt:"Lift the indigo loop off peg one onto an empty peg."},{expect:{from:0,to:1},prompt:"Now stack crimson onto the crimson-topped peg."}],theme:"dawn"},{id:"learn-3",title:"Group lift",text:"Same-colored loops touching at the top lift together as one group, keeping their order.",pegs:[[0,1,1],[0],[1],[]],cap:4,colors:2,seed:103,steps:[{expect:{from:0,to:3},prompt:"Lift BOTH indigo loops at once onto the empty peg."}],theme:"dusk"},{id:"learn-4",title:"Uniform pegs",text:"You win when every peg is uniform. Solve this small loom on your own.",pegs:[[0,1],[1,0],[],[]],cap:4,colors:2,seed:104,steps:[],theme:"night"}];function Dr(n){let e=Ti[Math.max(0,Math.min(Ti.length-1,n))],t=e.pegs.map(i=>i.slice());return{id:e.id,version:Lr,rulesVersion:1,seed:e.seed,colors:e.colors,cap:e.cap,pegCount:e.pegs.length,pegs:t,par:Yi(t,e.cap)||2,moveLimit:null,tutorial:{title:e.title,text:e.text,steps:e.steps.map(i=>({...i}))},theme:e.theme,goals:{solve:!0}}}function Mg(n){return ni("daily:"+(n|0)+":v"+Lr)}function Hl(n){let e=Mg(n),t=Ir("daily-"+(n|0),e,{colors:4,cap:4,emptyPegs:2},{title:"Daily Loom",theme:bi[(n|0)%bi.length].id});return t.day=n|0,t}function Vl(n,e){let t=Math.max(1,Math.min(10,n|0)),i=t<=2?3:t<=5?4:t<=8?5:6,s=ni("practice:"+t+":"+(e|0)),r=Ir("practice-"+t+"-"+(e|0),s,{colors:i,cap:4,emptyPegs:2},{title:"Practice \xB7 difficulty "+t});return r.difficulty=t,r}var Ts=[{id:"challenge-taut",kind:"move-limit",title:"Taut Thread",text:"Solve within a tight move limit.",difficulty:5},{id:"challenge-swapmeet",kind:"move-limit",title:"Swap Meet",text:"A harder loom with barely any slack.",difficulty:8},{id:"challenge-swift",kind:"speed",title:"Swift Shuttle",text:"Solve before the timer runs out.",difficulty:4,timeMs:9e4},{id:"challenge-noundo",kind:"no-undo",title:"No Takebacks",text:"Undo is disabled. Every drop is final.",difficulty:5}];function Ho(n,e){let t=Ts[Math.max(0,Math.min(Ts.length-1,n))],s=t.difficulty<=5?4:5,r=ni(t.id+":"+(e|0)),o=Ir(t.id+"-"+(e|0),r,{colors:s,cap:4,emptyPegs:2},{title:t.title,theme:"ember"});return o.challenge={kind:t.kind,text:t.text},t.kind==="move-limit"&&(o.moveLimit=o.par+2),t.kind==="speed"&&(o.timeTargetMs=t.timeMs),t.kind==="no-undo"&&(o.noUndo=!0),o}function Gl(n){let e=ni("chase:"+(n|0)+":v"+Lr);return Ir("chase-"+(n|0),e,{colors:5,cap:4,emptyPegs:2},{title:"Score Chase",theme:"dusk"})}function bg(n){let e=[];if((!n||typeof n.id!="string")&&e.push("missing id"),Number.isInteger(n.seed)||e.push("missing seed"),(!Array.isArray(n.pegs)||n.pegs.length<3)&&e.push("bad pegs"),e.length)return{ok:!1,errors:e};let t=new Map,i=0;for(let o of n.pegs){o.length>n.cap&&e.push("peg over capacity");for(let a of o)t.set(a,(t.get(a)||0)+1),i++}for(let[o]of t)(o<0||o>=n.colors)&&e.push("color out of range");if(i===n.colors*n.cap)for(let[,o]of t)o!==n.cap&&e.push("unbalanced color count");let s=Yi(n.pegs,n.cap);s==null?e.push("no reachable goal (unsolvable or unbounded)"):n.par!==s&&e.push("par mismatch");let r=Ss({pegs:n.pegs,cap:n.cap,colors:n.colors,seed:n.seed});return si(r).length===0&&s!==0&&e.push("soft lock: no legal actions"),n.moveLimit!=null&&s!=null&&n.moveLimit<s&&e.push("move limit below par"),{ok:e.length===0,errors:e,par:s}}function zd(){let n=[],e=t=>{let i=bg(t);n.push({id:t.id,ok:i.ok,errors:i.errors})};Pr.forEach(e);for(let t=0;t<Ti.length;t++)e(Dr(t));for(let t=0;t<Ts.length;t++)e(Ho(t,0));return e(Hl(Math.floor(Date.UTC(2026,0,1)/864e5))),e(Gl(0)),n}var xt={settings:"looploom.settings.v1",progress:"looploom.progress.v1",snapshot:"looploom.snapshot.v1",scores:"looploom.scores.v1",sessionId:"looploom.sessionid.v1",analytics:"looploom.analytics.v1"};function Xn(n,e){try{let t=localStorage.getItem(n);return t?JSON.parse(t):e}catch{return e}}function ri(n,e){try{localStorage.setItem(n,JSON.stringify(e))}catch{}}function wg(){let n=Xn(xt.sessionId,null);return n||(n="s"+Date.now().toString(36)+Math.floor(Math.random()*1e9).toString(36),ri(xt.sessionId,n)),n}var Wl={version:1,music:.6,effects:.8,ambience:.4,voice:.7,muted:!1,palette:"default",reducedMotion:!1,highContrast:!1,largerText:!1,leftHanded:!1,holdToLift:!1,timingAssist:!1,haptics:!0,quality:"auto",cameraShake:!0,tutorialSeen:{},telemetryConsent:!1,difficulty:3,bindings:{up:"ArrowUp",down:"ArrowDown",left:"ArrowLeft",right:"ArrowRight",confirm:"Enter",cancel:"Escape",undo:"KeyU",hint:"KeyH",pause:"KeyP",camera:"KeyR"},gamepad:{confirm:0,cancel:1,undo:2,hint:3,pause:9}};function Go(){let n=Xn(xt.settings,{});return Object.assign({},Wl,n,{bindings:Object.assign({},Wl.bindings,n.bindings||{}),gamepad:Object.assign({},Wl.gamepad,n.gamepad||{}),tutorialSeen:Object.assign({},n.tutorialSeen||{})})}function Xl(n){ri(xt.settings,n)}var Wo=[{id:"first_completion",name:"First Weave",text:"Complete your first loom."},{id:"mechanic_mastery",name:"Apprentice of the Loom",text:"Finish every Learn lesson."},{id:"streak_7",name:"Seven Suns",text:"Finish the Daily Loom on 7 different days."},{id:"milestone_hard",name:"Master Weaver",text:"Complete a difficulty 8+ journey stage."},{id:"long_term_loom",name:"Hundred Hands",text:"Complete 100 rounds in total."}];function Vo(n){let e=JSON.stringify(n),t=2166136261;for(let i=0;i<e.length;i++)t^=e.charCodeAt(i),t=Math.imul(t,16777619);return t>>>0}function Xo(){let n={version:1,journeyUnlocked:0,journeyDone:{},lessonsDone:{},dailyDays:[],achievements:{},roundsCompleted:0,bestScores:{}},e=Xn(xt.progress,null);return!e||e.version!==1||e.sum!==Vo(e.data)?n:Object.assign(n,e.data)}function kd(n){let e=Object.assign({version:1},n,{version:1});ri(xt.progress,{version:1,data:e,sum:Vo(e)})}var Nr=class n{constructor(e,t){this.record=e,this.mode=t&&t.mode||"practice",this.assists=t&&t.assists||{},this.state=Ss({pegs:e.pegs,cap:e.cap,colors:e.colors,seed:e.seed,moveLimit:e.moveLimit}),this.commands=[],this.seenCmdIds=new Set,this.snapshots=[],this.hashTrail=[Mi(this.state)],this.startedAt=Date.now(),this.endedAt=null,this.result=null,this.tutorial=e.tutorial?{step:0}:null}get status(){return this.state.status}legalActions(){return si(this.state)}canMove(e,t){return br(this.state,e,t)}reason(e,t){return Ms(this.state,e,t)}hint(){return ko(this.state)}applyCommand(e){if(!e||typeof e.id!="string")return{ok:!1,reason:"bad-command"};if(this.seenCmdIds.has(e.id))return{ok:!0,duplicate:!0,state:this.state};if(this.state.status!=="active")return{ok:!1,reason:"round-over"};if(e.type==="invalid")return this.seenCmdIds.add(e.id),this.state=Bo(this.state),this.commands.push({id:e.id,type:"invalid"}),this.hashTrail.push(Mi(this.state)),{ok:!0,state:this.state};if(e.type==="move"){let t=e.from|0,i=e.to|0,s=this.state,r=wr(s,t,i);return r.ok?(this.seenCmdIds.add(e.id),this.snapshots.push(ti(s)),this.state=r.state,this.commands.push({id:e.id,type:"move",from:t,to:i}),this.hashTrail.push(Mi(this.state)),this.state.status!=="active"&&this.finish(),{ok:!0,moved:r.moved,state:this.state}):(this.applyCommand({id:e.id,type:"invalid"}),{ok:!1,reason:r.reason,state:this.state})}return e.type==="undo"?this.record.noUndo?{ok:!1,reason:"undo-disabled"}:this.snapshots.length===0?{ok:!1,reason:"nothing-to-undo"}:(this.seenCmdIds.add(e.id),this.state=this.snapshots.pop(),this.state=ti(this.state),this.state.undos++,this.state.tick++,this.commands.push({id:e.id,type:"undo"}),this.hashTrail.push(Mi(this.state)),{ok:!0,state:this.state}):{ok:!1,reason:"unknown-command"}}elapsedMs(){return(this.endedAt||Date.now())-this.startedAt}finish(){this.endedAt||(this.endedAt=Date.now(),this.result=bs(this.state,this.record.par,this.elapsedMs()),this.result.sessionId=wg(),this.result.mode=this.mode)}replayEnvelope(){return{schema:1,rulesVersion:1,contentVersion:this.record.version,contentId:this.record.id,seed:this.record.seed,initialHash:this.hashTrail[0],startedAt:this.startedAt,commands:this.commands.slice(),hashes:this.hashTrail.filter((e,t)=>t%5===0||t===this.hashTrail.length-1),result:this.result}}snapshot(){return{record:this.record,mode:this.mode,assists:this.assists,state:Ar(this.state),commands:this.commands,snapshots:this.snapshots.map(e=>Ar(e)),hashTrail:this.hashTrail,startedAt:this.startedAt,tutorial:this.tutorial}}static restore(e){if(!e||!e.record||!e.state)return null;let t=new n(e.record,{mode:e.mode,assists:e.assists});return t.state=Cr(e.state),t.commands=e.commands||[],t.seenCmdIds=new Set(t.commands.map(i=>i.id)),t.snapshots=(e.snapshots||[]).map(i=>Cr(i)),t.hashTrail=e.hashTrail||[Mi(t.state)],t.startedAt=e.startedAt||Date.now(),t.tutorial=e.tutorial||null,t.state.status!=="active"&&t.finish(),t}};function oi(n){if(!n||n.status!=="active"){ql();return}ri(xt.snapshot,n.snapshot())}function qo(){let n=Xn(xt.snapshot,null);if(!n)return null;try{return Nr.restore(n)}catch{return null}}function ql(){try{localStorage.removeItem(xt.snapshot)}catch{}}function Hd(n){let e=Xn(xt.scores,{global:[],daily:{}}),t={score:n.total|0,moves:n.moves|0,invalid:n.invalid|0,elapsedMs:n.elapsedMs|0,mode:n.mode,contentId:n.contentId,seed:n.seed|0,version:n.version|0,sessionId:n.sessionId,day:n.day==null?null:n.day|0,at:Date.now()};if(e.global.push(t),e.global.sort((i,s)=>Er({total:i.score,solved:!0,invalid:i.invalid,elapsedMs:i.elapsedMs,sessionId:i.sessionId},{total:s.score,solved:!0,invalid:s.invalid,elapsedMs:s.elapsedMs,sessionId:s.sessionId})),e.global=e.global.slice(0,50),t.day!=null){let i=String(t.day);e.daily[i]=e.daily[i]||[],e.daily[i].push(t),e.daily[i].sort((s,r)=>r.score-s.score),e.daily[i]=e.daily[i].slice(0,20)}return ri(xt.scores,e),t}function Yl(n,e){let t=Xn(xt.scores,{global:[],daily:{}});return n==="daily"&&e!=null?(t.daily[String(e)]||[]).slice():(t.global||[]).slice()}function Zi(){return{v:1,savedAt:Date.now(),progress:Xn(xt.progress,null),settings:Xn(xt.settings,null),scores:Xn(xt.scores,null)}}function Vd(n,e){let t=g=>g&&typeof g=="object"&&!Array.isArray(g)?g:{},i=g=>{let x=t(g).progress;return x&&x.version===1&&x.data&&x.sum===Vo(x.data)?x.data:{}},s=i(n),r=i(e),o=(g,x)=>{let f={...t(g)};for(let[m,b]of Object.entries(t(x)))f[m]=Math.max(Number(f[m])||0,Number(b)||0);return f},a=(g,x)=>{let f={...t(g)};for(let[m,b]of Object.entries(t(x)))f[m]=f[m]&&f[m]<b?f[m]:b;return f},l={...s,...r,version:1,journeyUnlocked:Math.max(Number(s.journeyUnlocked)||0,Number(r.journeyUnlocked)||0),journeyDone:{...t(s.journeyDone),...t(r.journeyDone)},lessonsDone:{...t(s.lessonsDone),...t(r.lessonsDone)},dailyDays:[...new Set([...Array.isArray(s.dailyDays)?s.dailyDays:[],...Array.isArray(r.dailyDays)?r.dailyDays:[]])],achievements:a(s.achievements,r.achievements),roundsCompleted:Math.max(Number(s.roundsCompleted)||0,Number(r.roundsCompleted)||0),bestScores:o(s.bestScores,r.bestScores)},c=t(t(n).scores),u=t(t(e).scores),h=g=>{let x=new Set;return g.filter(f=>{let m=f&&f.sessionId+":"+f.at;return!f||x.has(m)?!1:(x.add(m),!0)})},d=h([...Array.isArray(c.global)?c.global:[],...Array.isArray(u.global)?u.global:[]]).sort((g,x)=>Er({total:g.score,solved:!0,invalid:g.invalid,elapsedMs:g.elapsedMs,sessionId:g.sessionId},{total:x.score,solved:!0,invalid:x.invalid,elapsedMs:x.elapsedMs,sessionId:x.sessionId})).slice(0,50),p={};for(let g of new Set([...Object.keys(t(c.daily)),...Object.keys(t(u.daily))]))p[g]=h([...t(c.daily)[g]||[],...t(u.daily)[g]||[]]).sort((x,f)=>f.score-x.score).slice(0,20);return{v:1,savedAt:Date.now(),progress:{version:1,data:l,sum:Vo(l)},settings:t(e).settings||t(n).settings||null,scores:{global:d,daily:p}}}function jl(n){if(!n||n.v!==1)return!1;let e=!1;return n.progress&&n.progress.version===1&&n.progress.data&&typeof n.progress.sum=="number"&&(ri(xt.progress,n.progress),e=!0),n.settings&&typeof n.settings=="object"&&(ri(xt.settings,n.settings),e=!0),n.scores&&Array.isArray(n.scores.global)&&(ri(xt.scores,n.scores),e=!0),e}function Gd(n,e){let t=[],i=s=>{n.achievements[s]||(n.achievements[s]=Date.now(),t.push(s))};if(e.result&&e.result.solved){if(n.roundsCompleted++,i("first_completion"),n.roundsCompleted>=100&&i("long_term_loom"),e.mode==="journey"){let s=parseInt(e.record.id.split("-")[1],10)-1;n.journeyDone[e.record.id]=!0,n.journeyUnlocked=Math.max(n.journeyUnlocked,Math.min(s+1,47)),(e.record.difficulty||0)>=8&&i("milestone_hard")}e.mode==="learn"&&(n.lessonsDone[e.record.id]=!0,Object.keys(n.lessonsDone).length>=4&&i("mechanic_mastery")),e.mode==="daily"&&e.record.day!=null&&(n.dailyDays.includes(e.record.day)||n.dailyDays.push(e.record.day),n.dailyDays.length>=7&&i("streak_7"))}return t}function ai(n){if(!["start","tutorial-step","round-end","retry","settings-change","error"].includes(n))return;let t=Xn(xt.analytics,{});t[n]=(t[n]||0)+1,ri(xt.analytics,t)}var Ag=0,Wd=1,Cg=2;var Jf=1,th=2,fi=3,Di=0,Gt=1,bn=2,Mt=0,Gs=1,as=2,Xd=3,qd=4,nh=5,Tn=100,Rg=101,Pg=102,Lg=103,Ig=104,rr=200,Dg=201,Ng=202,Ug=203,Lc=204,Ic=205,Ka=206,Og=207,Qa=208,Fg=209,Bg=210,zg=211,kg=212,Hg=213,Vg=214,Dc=0,Nc=1,Uc=2,Ys=3,Oc=4,Fc=5,Bc=6,zc=7,Kf=0,Gg=1,Wg=2,Ii=0,ih=1,sh=2,rh=3,ao=4,Xg=5,oh=6,ah=7;var Qf=300,js=301,Zs=302,kc=303,Hc=304,$a=306,En=1e3,rs=1001,Vc=1002,_t=1003,qg=1004;var Yo=1005;var fn=1006,Zl=1007;var os=1008;var On=1009,$f=1010,ep=1011,qr=1012,lh=1013,ls=1014,mi=1015,Et=1016,ch=1017,uh=1018,Ni=1020,tp=35902,np=1021,ip=1022,pn=1023,sp=1024,rp=1025,Ws=1026,Ui=1027,op=1028,hh=1029,ap=1030,dh=1031;var fh=1033,xa=33776,ya=33777,_a=33778,Sa=33779,Gc=35840,Wc=35841,Xc=35842,qc=35843,Yc=36196,jc=37492,Zc=37496,Jc=37808,Kc=37809,Qc=37810,$c=37811,eu=37812,tu=37813,nu=37814,iu=37815,su=37816,ru=37817,ou=37818,au=37819,lu=37820,cu=37821,Ma=36492,uu=36494,hu=36495,lp=36283,du=36284,fu=36285,pu=36286;var Ta=2300,mu=2301,Jl=2302,Yd=2400,jd=2401,Zd=2402;var Yg=3200,jg=3201;var ph=0,Zg=1,Li="",sn="srgb",zi="srgb-linear",mh="display-p3",el="display-p3-linear",wa="linear",at="srgb",Ea="rec709",Aa="p3";var Cs=7680;var Jd=519,Jg=512,Kg=513,Qg=514,cp=515,$g=516,ev=517,tv=518,nv=519,Kd=35044;var Qd="300 es",gi=2e3,Ca=2001,Oi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let s=this._listeners[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let i=this._listeners[e.type];if(i!==void 0){e.target=this;let s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},kt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Kl=Math.PI/180,gu=180/Math.PI;function lo(){let n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(kt[n&255]+kt[n>>8&255]+kt[n>>16&255]+kt[n>>24&255]+"-"+kt[e&255]+kt[e>>8&255]+"-"+kt[e>>16&15|64]+kt[e>>24&255]+"-"+kt[t&63|128]+kt[t>>8&255]+"-"+kt[t>>16&255]+kt[t>>24&255]+kt[i&255]+kt[i>>8&255]+kt[i>>16&255]+kt[i>>24&255]).toLowerCase()}function Nt(n,e,t){return Math.max(e,Math.min(t,n))}function iv(n,e){return(n%e+e)%e}function Ql(n,e,t){return(1-t)*n+t*e}function Ur(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function nn(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}var se=class n{constructor(e=0,t=0){n.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(Nt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*i-o*s+e.x,this.y=r*s+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Be=class n{constructor(e,t,i,s,r,o,a,l,c){n.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,l,c)}set(e,t,i,s,r,o,a,l,c){let u=this.elements;return u[0]=e,u[1]=s,u[2]=a,u[3]=t,u[4]=r,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],h=i[7],d=i[2],p=i[5],g=i[8],x=s[0],f=s[3],m=s[6],b=s[1],y=s[4],T=s[7],L=s[2],A=s[5],E=s[8];return r[0]=o*x+a*b+l*L,r[3]=o*f+a*y+l*A,r[6]=o*m+a*T+l*E,r[1]=c*x+u*b+h*L,r[4]=c*f+u*y+h*A,r[7]=c*m+u*T+h*E,r[2]=d*x+p*b+g*L,r[5]=d*f+p*y+g*A,r[8]=d*m+p*T+g*E,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-i*r*u+i*a*l+s*r*c-s*o*l}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=u*o-a*c,d=a*l-u*r,p=c*r-o*l,g=t*h+i*d+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/g;return e[0]=h*x,e[1]=(s*c-u*i)*x,e[2]=(a*i-s*o)*x,e[3]=d*x,e[4]=(u*t-s*l)*x,e[5]=(s*r-a*t)*x,e[6]=p*x,e[7]=(i*l-c*t)*x,e[8]=(o*t-i*r)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply($l.makeScale(e,t)),this}rotate(e){return this.premultiply($l.makeRotation(-e)),this}translate(e,t){return this.premultiply($l.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}},$l=new Be;function up(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Yr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function sv(){let n=Yr("canvas");return n.style.display="block",n}var $d={};function ba(n){n in $d||($d[n]=!0,console.warn(n))}function rv(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}function ov(n){let e=n.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function av(n){let e=n.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}var ef=new Be().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),tf=new Be().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Or={[zi]:{transfer:wa,primaries:Ea,luminanceCoefficients:[.2126,.7152,.0722],toReference:n=>n,fromReference:n=>n},[sn]:{transfer:at,primaries:Ea,luminanceCoefficients:[.2126,.7152,.0722],toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[el]:{transfer:wa,primaries:Aa,luminanceCoefficients:[.2289,.6917,.0793],toReference:n=>n.applyMatrix3(tf),fromReference:n=>n.applyMatrix3(ef)},[mh]:{transfer:at,primaries:Aa,luminanceCoefficients:[.2289,.6917,.0793],toReference:n=>n.convertSRGBToLinear().applyMatrix3(tf),fromReference:n=>n.applyMatrix3(ef).convertLinearToSRGB()}},lv=new Set([zi,el]),Je={enabled:!0,_workingColorSpace:zi,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!lv.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,e,t){if(this.enabled===!1||e===t||!e||!t)return n;let i=Or[e].toReference,s=Or[t].fromReference;return s(i(n))},fromWorkingColorSpace:function(n,e){return this.convert(n,this._workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this._workingColorSpace)},getPrimaries:function(n){return Or[n].primaries},getTransfer:function(n){return n===Li?wa:Or[n].transfer},getLuminanceCoefficients:function(n,e=this._workingColorSpace){return n.fromArray(Or[e].luminanceCoefficients)}};function Xs(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function ec(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var Rs,vu=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Rs===void 0&&(Rs=Yr("canvas")),Rs.width=e.width,Rs.height=e.height;let i=Rs.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=Rs}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Yr("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Xs(r[o]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Xs(t[i]/255)*255):t[i]=Xs(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},cv=0,Ra=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:cv++}),this.uuid=lo(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(tc(s[o].image)):r.push(tc(s[o]))}else r=tc(s);i.url=r}return t||(e.images[this.uuid]=i),i}};function tc(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?vu.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var uv=0,Ct=class n extends Oi{constructor(e=n.DEFAULT_IMAGE,t=n.DEFAULT_MAPPING,i=rs,s=rs,r=fn,o=os,a=pn,l=On,c=n.DEFAULT_ANISOTROPY,u=Li){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:uv++}),this.uuid=lo(),this.name="",this.source=new Ra(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new se(0,0),this.repeat=new se(1,1),this.center=new se(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Be,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Qf)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case En:e.x=e.x-Math.floor(e.x);break;case rs:e.x=e.x<0?0:1;break;case Vc:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case En:e.y=e.y-Math.floor(e.y);break;case rs:e.y=e.y<0?0:1;break;case Vc:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Ct.DEFAULT_IMAGE=null;Ct.DEFAULT_MAPPING=Qf;Ct.DEFAULT_ANISOTROPY=1;var ot=class n{constructor(e=0,t=0,i=0,s=1){n.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*i+o[11]*s+o[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r,l=e.elements,c=l[0],u=l[4],h=l[8],d=l[1],p=l[5],g=l[9],x=l[2],f=l[6],m=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-x)<.01&&Math.abs(g-f)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+x)<.1&&Math.abs(g+f)<.1&&Math.abs(c+p+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let y=(c+1)/2,T=(p+1)/2,L=(m+1)/2,A=(u+d)/4,E=(h+x)/4,P=(g+f)/4;return y>T&&y>L?y<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(y),s=A/i,r=E/i):T>L?T<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(T),i=A/s,r=P/s):L<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(L),i=E/r,s=P/r),this.set(i,s,r,t),this}let b=Math.sqrt((f-g)*(f-g)+(h-x)*(h-x)+(d-u)*(d-u));return Math.abs(b)<.001&&(b=1),this.x=(f-g)/b,this.y=(h-x)/b,this.z=(d-u)/b,this.w=Math.acos((c+p+m-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},xu=class extends Oi{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ot(0,0,e,t),this.scissorTest=!1,this.viewport=new ot(0,0,e,t);let s={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:fn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);let r=new Ct(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);r.flipY=!1,r.generateMipmaps=i.generateMipmaps,r.internalFormat=i.internalFormat,this.textures=[];let o=i.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,s=e.textures.length;i<s;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new Ra(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},ht=class extends xu{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},Pa=class extends Ct{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=_t,this.minFilter=_t,this.wrapR=rs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var yu=class extends Ct{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=_t,this.minFilter=_t,this.wrapR=rs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Fi=class{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,o,a){let l=i[s+0],c=i[s+1],u=i[s+2],h=i[s+3],d=r[o+0],p=r[o+1],g=r[o+2],x=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h;return}if(a===1){e[t+0]=d,e[t+1]=p,e[t+2]=g,e[t+3]=x;return}if(h!==x||l!==d||c!==p||u!==g){let f=1-a,m=l*d+c*p+u*g+h*x,b=m>=0?1:-1,y=1-m*m;if(y>Number.EPSILON){let L=Math.sqrt(y),A=Math.atan2(L,m*b);f=Math.sin(f*A)/L,a=Math.sin(a*A)/L}let T=a*b;if(l=l*f+d*T,c=c*f+p*T,u=u*f+g*T,h=h*f+x*T,f===1-a){let L=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=L,c*=L,u*=L,h*=L}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,s,r,o){let a=i[s],l=i[s+1],c=i[s+2],u=i[s+3],h=r[o],d=r[o+1],p=r[o+2],g=r[o+3];return e[t]=a*g+u*h+l*p-c*d,e[t+1]=l*g+u*d+c*h-a*p,e[t+2]=c*g+u*p+a*d-l*h,e[t+3]=u*g-a*h-l*d-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(s/2),h=a(r/2),d=l(i/2),p=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=d*u*h+c*p*g,this._y=c*p*h-d*u*g,this._z=c*u*g+d*p*h,this._w=c*u*h-d*p*g;break;case"YXZ":this._x=d*u*h+c*p*g,this._y=c*p*h-d*u*g,this._z=c*u*g-d*p*h,this._w=c*u*h+d*p*g;break;case"ZXY":this._x=d*u*h-c*p*g,this._y=c*p*h+d*u*g,this._z=c*u*g+d*p*h,this._w=c*u*h-d*p*g;break;case"ZYX":this._x=d*u*h-c*p*g,this._y=c*p*h+d*u*g,this._z=c*u*g-d*p*h,this._w=c*u*h+d*p*g;break;case"YZX":this._x=d*u*h+c*p*g,this._y=c*p*h+d*u*g,this._z=c*u*g-d*p*h,this._w=c*u*h-d*p*g;break;case"XZY":this._x=d*u*h-c*p*g,this._y=c*p*h-d*u*g,this._z=c*u*g+d*p*h,this._w=c*u*h+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],h=t[10],d=i+a+h;if(d>0){let p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(u-l)*p,this._y=(r-c)*p,this._z=(o-s)*p}else if(i>a&&i>h){let p=2*Math.sqrt(1+i-a-h);this._w=(u-l)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+c)/p}else if(a>h){let p=2*Math.sqrt(1+a-i-h);this._w=(r-c)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(l+u)/p}else{let p=2*Math.sqrt(1+h-i-a);this._w=(o-s)/p,this._x=(r+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Nt(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+o*a+s*c-r*l,this._y=s*u+o*l+r*a-i*c,this._z=r*u+o*c+i*l-s*a,this._w=o*u-i*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let i=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+i*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let p=1-t;return this._w=p*o+t*this._w,this._x=p*i+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}let c=Math.sqrt(l),u=Math.atan2(c,a),h=Math.sin((1-t)*u)/c,d=Math.sin(t*u)/c;return this._w=o*h+this._w*d,this._x=i*h+this._x*d,this._y=s*h+this._y*d,this._z=r*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},C=class n{constructor(e=0,t=0,i=0){n.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(nf.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(nf.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,i=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*i),u=2*(a*t-r*s),h=2*(r*i-o*t);return this.x=t+l*c+o*h-a*u,this.y=i+l*u+a*c-r*h,this.z=s+l*h+r*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-i*l,this.z=i*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return nc.copy(this).projectOnVector(e),this.sub(nc)}reflect(e){return this.sub(nc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(Nt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},nc=new C,nf=new Fi,cs=class{constructor(e=new C(1/0,1/0,1/0),t=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Dn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Dn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=Dn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Dn):Dn.fromBufferAttribute(r,o),Dn.applyMatrix4(e.matrixWorld),this.expandByPoint(Dn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),jo.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),jo.copy(i.boundingBox)),jo.applyMatrix4(e.matrixWorld),this.union(jo)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Dn),Dn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Fr),Zo.subVectors(this.max,Fr),Ps.subVectors(e.a,Fr),Ls.subVectors(e.b,Fr),Is.subVectors(e.c,Fr),wi.subVectors(Ls,Ps),Ei.subVectors(Is,Ls),Ji.subVectors(Ps,Is);let t=[0,-wi.z,wi.y,0,-Ei.z,Ei.y,0,-Ji.z,Ji.y,wi.z,0,-wi.x,Ei.z,0,-Ei.x,Ji.z,0,-Ji.x,-wi.y,wi.x,0,-Ei.y,Ei.x,0,-Ji.y,Ji.x,0];return!ic(t,Ps,Ls,Is,Zo)||(t=[1,0,0,0,1,0,0,0,1],!ic(t,Ps,Ls,Is,Zo))?!1:(Jo.crossVectors(wi,Ei),t=[Jo.x,Jo.y,Jo.z],ic(t,Ps,Ls,Is,Zo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Dn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Dn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(li[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),li[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),li[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),li[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),li[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),li[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),li[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),li[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(li),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},li=[new C,new C,new C,new C,new C,new C,new C,new C],Dn=new C,jo=new cs,Ps=new C,Ls=new C,Is=new C,wi=new C,Ei=new C,Ji=new C,Fr=new C,Zo=new C,Jo=new C,Ki=new C;function ic(n,e,t,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){Ki.fromArray(n,r);let a=s.x*Math.abs(Ki.x)+s.y*Math.abs(Ki.y)+s.z*Math.abs(Ki.z),l=e.dot(Ki),c=t.dot(Ki),u=i.dot(Ki);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}var hv=new cs,Br=new C,sc=new C,Js=class{constructor(e=new C,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):hv.setFromPoints(e).getCenter(i);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Br.subVectors(e,this.center);let t=Br.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Br,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(sc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Br.copy(e.center).add(sc)),this.expandByPoint(Br.copy(e.center).sub(sc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},ci=new C,rc=new C,Ko=new C,Ai=new C,oc=new C,Qo=new C,ac=new C,jr=class{constructor(e=new C,t=new C(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ci)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ci.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ci.copy(this.origin).addScaledVector(this.direction,t),ci.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){rc.copy(e).add(t).multiplyScalar(.5),Ko.copy(t).sub(e).normalize(),Ai.copy(this.origin).sub(rc);let r=e.distanceTo(t)*.5,o=-this.direction.dot(Ko),a=Ai.dot(this.direction),l=-Ai.dot(Ko),c=Ai.lengthSq(),u=Math.abs(1-o*o),h,d,p,g;if(u>0)if(h=o*l-a,d=o*a-l,g=r*u,h>=0)if(d>=-g)if(d<=g){let x=1/u;h*=x,d*=x,p=h*(h+o*d+2*a)+d*(o*h+d+2*l)+c}else d=r,h=Math.max(0,-(o*d+a)),p=-h*h+d*(d+2*l)+c;else d=-r,h=Math.max(0,-(o*d+a)),p=-h*h+d*(d+2*l)+c;else d<=-g?(h=Math.max(0,-(-o*r+a)),d=h>0?-r:Math.min(Math.max(-r,-l),r),p=-h*h+d*(d+2*l)+c):d<=g?(h=0,d=Math.min(Math.max(-r,-l),r),p=d*(d+2*l)+c):(h=Math.max(0,-(o*r+a)),d=h>0?r:Math.min(Math.max(-r,-l),r),p=-h*h+d*(d+2*l)+c);else d=o>0?-r:r,h=Math.max(0,-(o*d+a)),p=-h*h+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(rc).addScaledVector(Ko,d),p}intersectSphere(e,t){ci.subVectors(e.center,this.origin);let i=ci.dot(this.direction),s=ci.dot(ci)-i*i,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,o,a,l,c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),u>=0?(r=(e.min.y-d.y)*u,o=(e.max.y-d.y)*u):(r=(e.max.y-d.y)*u,o=(e.min.y-d.y)*u),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),h>=0?(a=(e.min.z-d.z)*h,l=(e.max.z-d.z)*h):(a=(e.max.z-d.z)*h,l=(e.min.z-d.z)*h),i>l||a>s)||((a>i||i!==i)&&(i=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,ci)!==null}intersectTriangle(e,t,i,s,r){oc.subVectors(t,e),Qo.subVectors(i,e),ac.crossVectors(oc,Qo);let o=this.direction.dot(ac),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Ai.subVectors(this.origin,e);let l=a*this.direction.dot(Qo.crossVectors(Ai,Qo));if(l<0)return null;let c=a*this.direction.dot(oc.cross(Ai));if(c<0||l+c>o)return null;let u=-a*Ai.dot(ac);return u<0?null:this.at(u/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},$e=class n{constructor(e,t,i,s,r,o,a,l,c,u,h,d,p,g,x,f){n.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,l,c,u,h,d,p,g,x,f)}set(e,t,i,s,r,o,a,l,c,u,h,d,p,g,x,f){let m=this.elements;return m[0]=e,m[4]=t,m[8]=i,m[12]=s,m[1]=r,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=u,m[10]=h,m[14]=d,m[3]=p,m[7]=g,m[11]=x,m[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,i=e.elements,s=1/Ds.setFromMatrixColumn(e,0).length(),r=1/Ds.setFromMatrixColumn(e,1).length(),o=1/Ds.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,s=e.y,r=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){let d=o*u,p=o*h,g=a*u,x=a*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=p+g*c,t[5]=d-x*c,t[9]=-a*l,t[2]=x-d*c,t[6]=g+p*c,t[10]=o*l}else if(e.order==="YXZ"){let d=l*u,p=l*h,g=c*u,x=c*h;t[0]=d+x*a,t[4]=g*a-p,t[8]=o*c,t[1]=o*h,t[5]=o*u,t[9]=-a,t[2]=p*a-g,t[6]=x+d*a,t[10]=o*l}else if(e.order==="ZXY"){let d=l*u,p=l*h,g=c*u,x=c*h;t[0]=d-x*a,t[4]=-o*h,t[8]=g+p*a,t[1]=p+g*a,t[5]=o*u,t[9]=x-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let d=o*u,p=o*h,g=a*u,x=a*h;t[0]=l*u,t[4]=g*c-p,t[8]=d*c+x,t[1]=l*h,t[5]=x*c+d,t[9]=p*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let d=o*l,p=o*c,g=a*l,x=a*c;t[0]=l*u,t[4]=x-d*h,t[8]=g*h+p,t[1]=h,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=p*h+g,t[10]=d-x*h}else if(e.order==="XZY"){let d=o*l,p=o*c,g=a*l,x=a*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=d*h+x,t[5]=o*u,t[9]=p*h-g,t[2]=g*h-p,t[6]=a*u,t[10]=x*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(dv,e,fv)}lookAt(e,t,i){let s=this.elements;return hn.subVectors(e,t),hn.lengthSq()===0&&(hn.z=1),hn.normalize(),Ci.crossVectors(i,hn),Ci.lengthSq()===0&&(Math.abs(i.z)===1?hn.x+=1e-4:hn.z+=1e-4,hn.normalize(),Ci.crossVectors(i,hn)),Ci.normalize(),$o.crossVectors(hn,Ci),s[0]=Ci.x,s[4]=$o.x,s[8]=hn.x,s[1]=Ci.y,s[5]=$o.y,s[9]=hn.y,s[2]=Ci.z,s[6]=$o.z,s[10]=hn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],h=i[5],d=i[9],p=i[13],g=i[2],x=i[6],f=i[10],m=i[14],b=i[3],y=i[7],T=i[11],L=i[15],A=s[0],E=s[4],P=s[8],k=s[12],v=s[1],S=s[5],U=s[9],F=s[13],V=s[2],J=s[6],H=s[10],ee=s[14],W=s[3],ie=s[7],ue=s[11],ge=s[15];return r[0]=o*A+a*v+l*V+c*W,r[4]=o*E+a*S+l*J+c*ie,r[8]=o*P+a*U+l*H+c*ue,r[12]=o*k+a*F+l*ee+c*ge,r[1]=u*A+h*v+d*V+p*W,r[5]=u*E+h*S+d*J+p*ie,r[9]=u*P+h*U+d*H+p*ue,r[13]=u*k+h*F+d*ee+p*ge,r[2]=g*A+x*v+f*V+m*W,r[6]=g*E+x*S+f*J+m*ie,r[10]=g*P+x*U+f*H+m*ue,r[14]=g*k+x*F+f*ee+m*ge,r[3]=b*A+y*v+T*V+L*W,r[7]=b*E+y*S+T*J+L*ie,r[11]=b*P+y*U+T*H+L*ue,r[15]=b*k+y*F+T*ee+L*ge,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],h=e[6],d=e[10],p=e[14],g=e[3],x=e[7],f=e[11],m=e[15];return g*(+r*l*h-s*c*h-r*a*d+i*c*d+s*a*p-i*l*p)+x*(+t*l*p-t*c*d+r*o*d-s*o*p+s*c*u-r*l*u)+f*(+t*c*h-t*a*p-r*o*h+i*o*p+r*a*u-i*c*u)+m*(-s*a*u-t*l*h+t*a*d+s*o*h-i*o*d+i*l*u)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=e[9],d=e[10],p=e[11],g=e[12],x=e[13],f=e[14],m=e[15],b=h*f*c-x*d*c+x*l*p-a*f*p-h*l*m+a*d*m,y=g*d*c-u*f*c-g*l*p+o*f*p+u*l*m-o*d*m,T=u*x*c-g*h*c+g*a*p-o*x*p-u*a*m+o*h*m,L=g*h*l-u*x*l-g*a*d+o*x*d+u*a*f-o*h*f,A=t*b+i*y+s*T+r*L;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let E=1/A;return e[0]=b*E,e[1]=(x*d*r-h*f*r-x*s*p+i*f*p+h*s*m-i*d*m)*E,e[2]=(a*f*r-x*l*r+x*s*c-i*f*c-a*s*m+i*l*m)*E,e[3]=(h*l*r-a*d*r-h*s*c+i*d*c+a*s*p-i*l*p)*E,e[4]=y*E,e[5]=(u*f*r-g*d*r+g*s*p-t*f*p-u*s*m+t*d*m)*E,e[6]=(g*l*r-o*f*r-g*s*c+t*f*c+o*s*m-t*l*m)*E,e[7]=(o*d*r-u*l*r+u*s*c-t*d*c-o*s*p+t*l*p)*E,e[8]=T*E,e[9]=(g*h*r-u*x*r-g*i*p+t*x*p+u*i*m-t*h*m)*E,e[10]=(o*x*r-g*a*r+g*i*c-t*x*c-o*i*m+t*a*m)*E,e[11]=(u*a*r-o*h*r-u*i*c+t*h*c+o*i*p-t*a*p)*E,e[12]=L*E,e[13]=(u*x*s-g*h*s+g*i*d-t*x*d-u*i*f+t*h*f)*E,e[14]=(g*a*s-o*x*s-g*i*l+t*x*l+o*i*f-t*a*f)*E,e[15]=(o*h*s-u*a*s+u*i*l-t*h*l-o*i*d+t*a*d)*E,this}scale(e){let t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),s=Math.sin(t),r=1-i,o=e.x,a=e.y,l=e.z,c=r*o,u=r*a;return this.set(c*o+i,c*a-s*l,c*l+s*a,0,c*a+s*l,u*a+i,u*l-s*o,0,c*l-s*a,u*l+s*o,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,o){return this.set(1,i,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){let s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,u=o+o,h=a+a,d=r*c,p=r*u,g=r*h,x=o*u,f=o*h,m=a*h,b=l*c,y=l*u,T=l*h,L=i.x,A=i.y,E=i.z;return s[0]=(1-(x+m))*L,s[1]=(p+T)*L,s[2]=(g-y)*L,s[3]=0,s[4]=(p-T)*A,s[5]=(1-(d+m))*A,s[6]=(f+b)*A,s[7]=0,s[8]=(g+y)*E,s[9]=(f-b)*E,s[10]=(1-(d+x))*E,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){let s=this.elements,r=Ds.set(s[0],s[1],s[2]).length(),o=Ds.set(s[4],s[5],s[6]).length(),a=Ds.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Nn.copy(this);let c=1/r,u=1/o,h=1/a;return Nn.elements[0]*=c,Nn.elements[1]*=c,Nn.elements[2]*=c,Nn.elements[4]*=u,Nn.elements[5]*=u,Nn.elements[6]*=u,Nn.elements[8]*=h,Nn.elements[9]*=h,Nn.elements[10]*=h,t.setFromRotationMatrix(Nn),i.x=r,i.y=o,i.z=a,this}makePerspective(e,t,i,s,r,o,a=gi){let l=this.elements,c=2*r/(t-e),u=2*r/(i-s),h=(t+e)/(t-e),d=(i+s)/(i-s),p,g;if(a===gi)p=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===Ca)p=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,s,r,o,a=gi){let l=this.elements,c=1/(t-e),u=1/(i-s),h=1/(o-r),d=(t+e)*c,p=(i+s)*u,g,x;if(a===gi)g=(o+r)*h,x=-2*h;else if(a===Ca)g=r*h,x=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=x,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}},Ds=new C,Nn=new $e,dv=new C(0,0,0),fv=new C(1,1,1),Ci=new C,$o=new C,hn=new C,sf=new $e,rf=new Fi,Yn=class n{constructor(e=0,t=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],u=s[9],h=s[2],d=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(Nt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Nt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(Nt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Nt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Nt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Nt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return sf.makeRotationFromQuaternion(e),this.setFromRotationMatrix(sf,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return rf.setFromEuler(this),this.setFromQuaternion(rf,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Yn.DEFAULT_ORDER="XYZ";var Zr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},pv=0,of=new C,Ns=new Fi,ui=new $e,ea=new C,zr=new C,mv=new C,gv=new Fi,af=new C(1,0,0),lf=new C(0,1,0),cf=new C(0,0,1),uf={type:"added"},vv={type:"removed"},Us={type:"childadded",child:null},lc={type:"childremoved",child:null},Xt=class n extends Oi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:pv++}),this.uuid=lo(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let e=new C,t=new Yn,i=new Fi,s=new C(1,1,1);function r(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new $e},normalMatrix:{value:new Be}}),this.matrix=new $e,this.matrixWorld=new $e,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Zr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ns.setFromAxisAngle(e,t),this.quaternion.multiply(Ns),this}rotateOnWorldAxis(e,t){return Ns.setFromAxisAngle(e,t),this.quaternion.premultiply(Ns),this}rotateX(e){return this.rotateOnAxis(af,e)}rotateY(e){return this.rotateOnAxis(lf,e)}rotateZ(e){return this.rotateOnAxis(cf,e)}translateOnAxis(e,t){return of.copy(e).applyQuaternion(this.quaternion),this.position.add(of.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(af,e)}translateY(e){return this.translateOnAxis(lf,e)}translateZ(e){return this.translateOnAxis(cf,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ui.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?ea.copy(e):ea.set(e,t,i);let s=this.parent;this.updateWorldMatrix(!0,!1),zr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ui.lookAt(zr,ea,this.up):ui.lookAt(ea,zr,this.up),this.quaternion.setFromRotationMatrix(ui),s&&(ui.extractRotation(s.matrixWorld),Ns.setFromRotationMatrix(ui),this.quaternion.premultiply(Ns.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(uf),Us.child=e,this.dispatchEvent(Us),Us.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(vv),lc.child=e,this.dispatchEvent(lc),lc.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ui.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ui.multiply(e.parent.matrixWorld)),e.applyMatrix4(ui),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(uf),Us.child=e,this.dispatchEvent(Us),Us.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){let o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zr,e,mv),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zr,gv,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let h=l[c];r(e.shapes,h)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),h=o(e.shapes),d=o(e.skeletons),p=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),d.length>0&&(i.skeletons=d),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=s,i;function o(a){let l=[];for(let c in a){let u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let s=e.children[i];this.add(s.clone())}return this}};Xt.DEFAULT_UP=new C(0,1,0);Xt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Un=new C,hi=new C,cc=new C,di=new C,Os=new C,Fs=new C,hf=new C,uc=new C,hc=new C,dc=new C,fc=new ot,pc=new ot,mc=new ot,is=class n{constructor(e=new C,t=new C,i=new C){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),Un.subVectors(e,t),s.cross(Un);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){Un.subVectors(s,t),hi.subVectors(i,t),cc.subVectors(e,t);let o=Un.dot(Un),a=Un.dot(hi),l=Un.dot(cc),c=hi.dot(hi),u=hi.dot(cc),h=o*c-a*a;if(h===0)return r.set(0,0,0),null;let d=1/h,p=(c*l-a*u)*d,g=(o*u-a*l)*d;return r.set(1-p-g,g,p)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,di)===null?!1:di.x>=0&&di.y>=0&&di.x+di.y<=1}static getInterpolation(e,t,i,s,r,o,a,l){return this.getBarycoord(e,t,i,s,di)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,di.x),l.addScaledVector(o,di.y),l.addScaledVector(a,di.z),l)}static getInterpolatedAttribute(e,t,i,s,r,o){return fc.setScalar(0),pc.setScalar(0),mc.setScalar(0),fc.fromBufferAttribute(e,t),pc.fromBufferAttribute(e,i),mc.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(fc,r.x),o.addScaledVector(pc,r.y),o.addScaledVector(mc,r.z),o}static isFrontFacing(e,t,i,s){return Un.subVectors(i,t),hi.subVectors(e,t),Un.cross(hi).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Un.subVectors(this.c,this.b),hi.subVectors(this.a,this.b),Un.cross(hi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return n.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return n.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,s=this.b,r=this.c,o,a;Os.subVectors(s,i),Fs.subVectors(r,i),uc.subVectors(e,i);let l=Os.dot(uc),c=Fs.dot(uc);if(l<=0&&c<=0)return t.copy(i);hc.subVectors(e,s);let u=Os.dot(hc),h=Fs.dot(hc);if(u>=0&&h<=u)return t.copy(s);let d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(i).addScaledVector(Os,o);dc.subVectors(e,r);let p=Os.dot(dc),g=Fs.dot(dc);if(g>=0&&p<=g)return t.copy(r);let x=p*c-l*g;if(x<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(i).addScaledVector(Fs,a);let f=u*g-p*h;if(f<=0&&h-u>=0&&p-g>=0)return hf.subVectors(r,s),a=(h-u)/(h-u+(p-g)),t.copy(s).addScaledVector(hf,a);let m=1/(f+x+d);return o=x*m,a=d*m,t.copy(i).addScaledVector(Os,o).addScaledVector(Fs,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},hp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ri={h:0,s:0,l:0},ta={h:0,s:0,l:0};function gc(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}var Me=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=sn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Je.toWorkingColorSpace(this,t),this}setRGB(e,t,i,s=Je.workingColorSpace){return this.r=e,this.g=t,this.b=i,Je.toWorkingColorSpace(this,s),this}setHSL(e,t,i,s=Je.workingColorSpace){if(e=iv(e,1),t=Nt(t,0,1),i=Nt(i,0,1),t===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+t):i+t-i*t,o=2*i-r;this.r=gc(o,r,e+1/3),this.g=gc(o,r,e),this.b=gc(o,r,e-1/3)}return Je.toWorkingColorSpace(this,s),this}setStyle(e,t=sn){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=sn){let i=hp[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Xs(e.r),this.g=Xs(e.g),this.b=Xs(e.b),this}copyLinearToSRGB(e){return this.r=ec(e.r),this.g=ec(e.g),this.b=ec(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=sn){return Je.fromWorkingColorSpace(Ht.copy(this),e),Math.round(Nt(Ht.r*255,0,255))*65536+Math.round(Nt(Ht.g*255,0,255))*256+Math.round(Nt(Ht.b*255,0,255))}getHexString(e=sn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Je.workingColorSpace){Je.fromWorkingColorSpace(Ht.copy(this),t);let i=Ht.r,s=Ht.g,r=Ht.b,o=Math.max(i,s,r),a=Math.min(i,s,r),l,c,u=(a+o)/2;if(a===o)l=0,c=0;else{let h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case i:l=(s-r)/h+(s<r?6:0);break;case s:l=(r-i)/h+2;break;case r:l=(i-s)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=Je.workingColorSpace){return Je.fromWorkingColorSpace(Ht.copy(this),t),e.r=Ht.r,e.g=Ht.g,e.b=Ht.b,e}getStyle(e=sn){Je.fromWorkingColorSpace(Ht.copy(this),e);let t=Ht.r,i=Ht.g,s=Ht.b;return e!==sn?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(Ri),this.setHSL(Ri.h+e,Ri.s+t,Ri.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Ri),e.getHSL(ta);let i=Ql(Ri.h,ta.h,t),s=Ql(Ri.s,ta.s,t),r=Ql(Ri.l,ta.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ht=new Me;Me.NAMES=hp;var xv=0,vi=class extends Oi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:xv++}),this.uuid=lo(),this.name="",this.type="Material",this.blending=Gs,this.side=Di,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Lc,this.blendDst=Ic,this.blendEquation=Tn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Me(0,0,0),this.blendAlpha=0,this.depthFunc=Ys,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Jd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Cs,this.stencilZFail=Cs,this.stencilZPass=Cs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Gs&&(i.blending=this.blending),this.side!==Di&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Lc&&(i.blendSrc=this.blendSrc),this.blendDst!==Ic&&(i.blendDst=this.blendDst),this.blendEquation!==Tn&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ys&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Jd&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Cs&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Cs&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Cs&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},An=class extends vi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Me(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yn,this.combine=Kf,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var yt=new C,na=new se,Wt=class{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Kd,this.updateRanges=[],this.gpuType=mi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)na.fromBufferAttribute(this,t),na.applyMatrix3(e),this.setXY(t,na.x,na.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)yt.fromBufferAttribute(this,t),yt.applyMatrix3(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)yt.fromBufferAttribute(this,t),yt.applyMatrix4(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)yt.fromBufferAttribute(this,t),yt.applyNormalMatrix(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)yt.fromBufferAttribute(this,t),yt.transformDirection(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Ur(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=nn(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ur(t,this.array)),t}setX(e,t){return this.normalized&&(t=nn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ur(t,this.array)),t}setY(e,t){return this.normalized&&(t=nn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ur(t,this.array)),t}setZ(e,t){return this.normalized&&(t=nn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ur(t,this.array)),t}setW(e,t){return this.normalized&&(t=nn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=nn(t,this.array),i=nn(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=nn(t,this.array),i=nn(i,this.array),s=nn(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=nn(t,this.array),i=nn(i,this.array),s=nn(s,this.array),r=nn(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Kd&&(e.usage=this.usage),e}};var La=class extends Wt{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var Ia=class extends Wt{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var nt=class extends Wt{constructor(e,t,i){super(new Float32Array(e),t,i)}},yv=0,Mn=new $e,vc=new Xt,Bs=new C,dn=new cs,kr=new cs,At=new C,bt=class n extends Oi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:yv++}),this.uuid=lo(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(up(e)?Ia:La)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new Be().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Mn.makeRotationFromQuaternion(e),this.applyMatrix4(Mn),this}rotateX(e){return Mn.makeRotationX(e),this.applyMatrix4(Mn),this}rotateY(e){return Mn.makeRotationY(e),this.applyMatrix4(Mn),this}rotateZ(e){return Mn.makeRotationZ(e),this.applyMatrix4(Mn),this}translate(e,t,i){return Mn.makeTranslation(e,t,i),this.applyMatrix4(Mn),this}scale(e,t,i){return Mn.makeScale(e,t,i),this.applyMatrix4(Mn),this}lookAt(e){return vc.lookAt(e),vc.updateMatrix(),this.applyMatrix4(vc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Bs).negate(),this.translate(Bs.x,Bs.y,Bs.z),this}setFromPoints(e){let t=[];for(let i=0,s=e.length;i<s;i++){let r=e[i];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new nt(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new cs);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){let r=t[i];dn.setFromBufferAttribute(r),this.morphTargetsRelative?(At.addVectors(this.boundingBox.min,dn.min),this.boundingBox.expandByPoint(At),At.addVectors(this.boundingBox.max,dn.max),this.boundingBox.expandByPoint(At)):(this.boundingBox.expandByPoint(dn.min),this.boundingBox.expandByPoint(dn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Js);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(e){let i=this.boundingSphere.center;if(dn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];kr.setFromBufferAttribute(a),this.morphTargetsRelative?(At.addVectors(dn.min,kr.min),dn.expandByPoint(At),At.addVectors(dn.max,kr.max),dn.expandByPoint(At)):(dn.expandByPoint(kr.min),dn.expandByPoint(kr.max))}dn.getCenter(i);let s=0;for(let r=0,o=e.count;r<o;r++)At.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(At));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)At.fromBufferAttribute(a,c),l&&(Bs.fromBufferAttribute(e,c),At.add(Bs)),s=Math.max(s,i.distanceToSquared(At))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Wt(new Float32Array(4*i.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let P=0;P<i.count;P++)a[P]=new C,l[P]=new C;let c=new C,u=new C,h=new C,d=new se,p=new se,g=new se,x=new C,f=new C;function m(P,k,v){c.fromBufferAttribute(i,P),u.fromBufferAttribute(i,k),h.fromBufferAttribute(i,v),d.fromBufferAttribute(r,P),p.fromBufferAttribute(r,k),g.fromBufferAttribute(r,v),u.sub(c),h.sub(c),p.sub(d),g.sub(d);let S=1/(p.x*g.y-g.x*p.y);isFinite(S)&&(x.copy(u).multiplyScalar(g.y).addScaledVector(h,-p.y).multiplyScalar(S),f.copy(h).multiplyScalar(p.x).addScaledVector(u,-g.x).multiplyScalar(S),a[P].add(x),a[k].add(x),a[v].add(x),l[P].add(f),l[k].add(f),l[v].add(f))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let P=0,k=b.length;P<k;++P){let v=b[P],S=v.start,U=v.count;for(let F=S,V=S+U;F<V;F+=3)m(e.getX(F+0),e.getX(F+1),e.getX(F+2))}let y=new C,T=new C,L=new C,A=new C;function E(P){L.fromBufferAttribute(s,P),A.copy(L);let k=a[P];y.copy(k),y.sub(L.multiplyScalar(L.dot(k))).normalize(),T.crossVectors(A,k);let S=T.dot(l[P])<0?-1:1;o.setXYZW(P,y.x,y.y,y.z,S)}for(let P=0,k=b.length;P<k;++P){let v=b[P],S=v.start,U=v.count;for(let F=S,V=S+U;F<V;F+=3)E(e.getX(F+0)),E(e.getX(F+1)),E(e.getX(F+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Wt(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,p=i.count;d<p;d++)i.setXYZ(d,0,0,0);let s=new C,r=new C,o=new C,a=new C,l=new C,c=new C,u=new C,h=new C;if(e)for(let d=0,p=e.count;d<p;d+=3){let g=e.getX(d+0),x=e.getX(d+1),f=e.getX(d+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,x),o.fromBufferAttribute(t,f),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),a.fromBufferAttribute(i,g),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,f),a.add(u),l.add(u),c.add(u),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(f,c.x,c.y,c.z)}else for(let d=0,p=t.count;d<p;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)At.fromBufferAttribute(e,t),At.normalize(),e.setXYZ(t,At.x,At.y,At.z)}toNonIndexed(){function e(a,l){let c=a.array,u=a.itemSize,h=a.normalized,d=new c.constructor(l.length*u),p=0,g=0;for(let x=0,f=l.length;x<f;x++){a.isInterleavedBufferAttribute?p=l[x]*a.data.stride+a.offset:p=l[x]*u;for(let m=0;m<u;m++)d[g++]=c[p++]}return new Wt(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new n,i=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=e(l,i);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let u=0,h=c.length;u<h;u++){let d=c[u],p=e(d,i);l.push(p)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let l in i){let c=i[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){let p=c[h];u.push(p.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone(t));let s=e.attributes;for(let c in s){let u=s[c];this.setAttribute(c,u.clone(t))}let r=e.morphAttributes;for(let c in r){let u=[],h=r[c];for(let d=0,p=h.length;d<p;d++)u.push(h[d].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,u=o.length;c<u;c++){let h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},df=new $e,Qi=new jr,ia=new Js,ff=new C,sa=new C,ra=new C,oa=new C,xc=new C,aa=new C,pf=new C,la=new C,Oe=class extends Xt{constructor(e=new bt,t=new An){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){aa.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let u=a[l],h=r[l];u!==0&&(xc.fromBufferAttribute(h,e),o?aa.addScaledVector(xc,u):aa.addScaledVector(xc.sub(t),u))}t.add(aa)}return t}raycast(e,t){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),ia.copy(i.boundingSphere),ia.applyMatrix4(r),Qi.copy(e.ray).recast(e.near),!(ia.containsPoint(Qi.origin)===!1&&(Qi.intersectSphere(ia,ff)===null||Qi.origin.distanceToSquared(ff)>(e.far-e.near)**2))&&(df.copy(r).invert(),Qi.copy(e.ray).applyMatrix4(df),!(i.boundingBox!==null&&Qi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Qi)))}_computeIntersections(e,t,i){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,d=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,x=d.length;g<x;g++){let f=d[g],m=o[f.materialIndex],b=Math.max(f.start,p.start),y=Math.min(a.count,Math.min(f.start+f.count,p.start+p.count));for(let T=b,L=y;T<L;T+=3){let A=a.getX(T),E=a.getX(T+1),P=a.getX(T+2);s=ca(this,m,e,i,c,u,h,A,E,P),s&&(s.faceIndex=Math.floor(T/3),s.face.materialIndex=f.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),x=Math.min(a.count,p.start+p.count);for(let f=g,m=x;f<m;f+=3){let b=a.getX(f),y=a.getX(f+1),T=a.getX(f+2);s=ca(this,o,e,i,c,u,h,b,y,T),s&&(s.faceIndex=Math.floor(f/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,x=d.length;g<x;g++){let f=d[g],m=o[f.materialIndex],b=Math.max(f.start,p.start),y=Math.min(l.count,Math.min(f.start+f.count,p.start+p.count));for(let T=b,L=y;T<L;T+=3){let A=T,E=T+1,P=T+2;s=ca(this,m,e,i,c,u,h,A,E,P),s&&(s.faceIndex=Math.floor(T/3),s.face.materialIndex=f.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),x=Math.min(l.count,p.start+p.count);for(let f=g,m=x;f<m;f+=3){let b=f,y=f+1,T=f+2;s=ca(this,o,e,i,c,u,h,b,y,T),s&&(s.faceIndex=Math.floor(f/3),t.push(s))}}}};function _v(n,e,t,i,s,r,o,a){let l;if(e.side===Gt?l=i.intersectTriangle(o,r,s,!0,a):l=i.intersectTriangle(s,r,o,e.side===Di,a),l===null)return null;la.copy(a),la.applyMatrix4(n.matrixWorld);let c=t.ray.origin.distanceTo(la);return c<t.near||c>t.far?null:{distance:c,point:la.clone(),object:n}}function ca(n,e,t,i,s,r,o,a,l,c){n.getVertexPosition(a,sa),n.getVertexPosition(l,ra),n.getVertexPosition(c,oa);let u=_v(n,e,t,i,sa,ra,oa,pf);if(u){let h=new C;is.getBarycoord(pf,sa,ra,oa,h),s&&(u.uv=is.getInterpolatedAttribute(s,a,l,c,h,new se)),r&&(u.uv1=is.getInterpolatedAttribute(r,a,l,c,h,new se)),o&&(u.normal=is.getInterpolatedAttribute(o,a,l,c,h,new C),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new C,materialIndex:0};is.getNormal(sa,ra,oa,d.normal),u.face=d,u.barycoord=h}return u}var jn=class n extends bt{constructor(e=1,t=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],u=[],h=[],d=0,p=0;g("z","y","x",-1,-1,i,t,e,o,r,0),g("z","y","x",1,-1,i,t,-e,o,r,1),g("x","z","y",1,1,e,i,t,s,o,2),g("x","z","y",1,-1,e,i,-t,s,o,3),g("x","y","z",1,-1,e,t,i,s,r,4),g("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new nt(c,3)),this.setAttribute("normal",new nt(u,3)),this.setAttribute("uv",new nt(h,2));function g(x,f,m,b,y,T,L,A,E,P,k){let v=T/E,S=L/P,U=T/2,F=L/2,V=A/2,J=E+1,H=P+1,ee=0,W=0,ie=new C;for(let ue=0;ue<H;ue++){let ge=ue*S-F;for(let ke=0;ke<J;ke++){let Ye=ke*v-U;ie[x]=Ye*b,ie[f]=ge*y,ie[m]=V,c.push(ie.x,ie.y,ie.z),ie[x]=0,ie[f]=0,ie[m]=A>0?1:-1,u.push(ie.x,ie.y,ie.z),h.push(ke/E),h.push(1-ue/P),ee+=1}}for(let ue=0;ue<P;ue++)for(let ge=0;ge<E;ge++){let ke=d+ge+J*ue,Ye=d+ge+J*(ue+1),q=d+(ge+1)+J*(ue+1),Q=d+(ge+1)+J*ue;l.push(ke,Ye,Q),l.push(Ye,q,Q),W+=6}a.addGroup(p,W,k),p+=W,d+=ee}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Ks(n){let e={};for(let t in n){e[t]={};for(let i in n[t]){let s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function Jt(n){let e={};for(let t=0;t<n.length;t++){let i=Ks(n[t]);for(let s in i)e[s]=i[s]}return e}function Sv(n){let e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function dp(n){let e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Je.workingColorSpace}var Rt={clone:Ks,merge:Jt},Mv=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,bv=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,rt=class extends vi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Mv,this.fragmentShader=bv,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ks(e.uniforms),this.uniformsGroups=Sv(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}},Da=class extends Xt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new $e,this.projectionMatrix=new $e,this.projectionMatrixInverse=new $e,this.coordinateSystem=gi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Pi=new C,mf=new se,gf=new se,Vt=class extends Da{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=gu*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Kl*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return gu*2*Math.atan(Math.tan(Kl*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Pi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Pi.x,Pi.y).multiplyScalar(-e/Pi.z),Pi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Pi.x,Pi.y).multiplyScalar(-e/Pi.z)}getViewSize(e,t){return this.getViewBounds(e,mf,gf),t.subVectors(gf,mf)}setViewOffset(e,t,i,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Kl*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*i/c,s*=o.width/l,i*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},zs=-90,ks=1,_u=class extends Xt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Vt(zs,ks,e,t);s.layers=this.layers,this.add(s);let r=new Vt(zs,ks,e,t);r.layers=this.layers,this.add(r);let o=new Vt(zs,ks,e,t);o.layers=this.layers,this.add(o);let a=new Vt(zs,ks,e,t);a.layers=this.layers,this.add(a);let l=new Vt(zs,ks,e,t);l.layers=this.layers,this.add(l);let c=new Vt(zs,ks,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,s,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===gi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ca)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,r),e.setRenderTarget(i,1,s),e.render(t,o),e.setRenderTarget(i,2,s),e.render(t,a),e.setRenderTarget(i,3,s),e.render(t,l),e.setRenderTarget(i,4,s),e.render(t,c),i.texture.generateMipmaps=x,e.setRenderTarget(i,5,s),e.render(t,u),e.setRenderTarget(h,d,p),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},Na=class extends Ct{constructor(e,t,i,s,r,o,a,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:js,super(e,t,i,s,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Su=class extends ht{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Na(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:fn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new jn(5,5,5),r=new rt({name:"CubemapFromEquirect",uniforms:Ks(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Gt,blending:Mt});r.uniforms.tEquirect.value=t;let o=new Oe(s,r),a=t.minFilter;return t.minFilter===os&&(t.minFilter=fn),new _u(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,i,s){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,s);e.setRenderTarget(r)}},yc=new C,Tv=new C,wv=new Be,pi=class{constructor(e=new C(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let s=yc.subVectors(i,t).cross(Tv.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let i=e.delta(yc),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||wv.getNormalMatrix(e),s=this.coplanarPoint(yc).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},$i=new Js,ua=new C,Jr=class{constructor(e=new pi,t=new pi,i=new pi,s=new pi,r=new pi,o=new pi){this.planes=[e,t,i,s,r,o]}set(e,t,i,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=gi){let i=this.planes,s=e.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],u=s[5],h=s[6],d=s[7],p=s[8],g=s[9],x=s[10],f=s[11],m=s[12],b=s[13],y=s[14],T=s[15];if(i[0].setComponents(l-r,d-c,f-p,T-m).normalize(),i[1].setComponents(l+r,d+c,f+p,T+m).normalize(),i[2].setComponents(l+o,d+u,f+g,T+b).normalize(),i[3].setComponents(l-o,d-u,f-g,T-b).normalize(),i[4].setComponents(l-a,d-h,f-x,T-y).normalize(),t===gi)i[5].setComponents(l+a,d+h,f+x,T+y).normalize();else if(t===Ca)i[5].setComponents(a,h,x,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),$i.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),$i.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere($i)}intersectsSprite(e){return $i.center.set(0,0,0),$i.radius=.7071067811865476,$i.applyMatrix4(e.matrixWorld),this.intersectsSphere($i)}intersectsSphere(e){let t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let s=t[i];if(ua.x=s.normal.x>0?e.max.x:e.min.x,ua.y=s.normal.y>0?e.max.y:e.min.y,ua.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ua)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function fp(){let n=null,e=!1,t=null,i=null;function s(r,o){t(r,o),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function Ev(n){let e=new WeakMap;function t(a,l){let c=a.array,u=a.usage,h=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,u),a.onUploadCallback();let p;if(c instanceof Float32Array)p=n.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=n.SHORT;else if(c instanceof Uint32Array)p=n.UNSIGNED_INT;else if(c instanceof Int32Array)p=n.INT;else if(c instanceof Int8Array)p=n.BYTE;else if(c instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function i(a,l,c){let u=l.array,h=l.updateRanges;if(n.bindBuffer(c,a),h.length===0)n.bufferSubData(c,0,u);else{h.sort((p,g)=>p.start-g.start);let d=0;for(let p=1;p<h.length;p++){let g=h[d],x=h[p];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++d,h[d]=x)}h.length=d+1;for(let p=0,g=h.length;p<g;p++){let x=h[p];n.bufferSubData(c,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(n.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var Ua=class n extends bt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(i),l=Math.floor(s),c=a+1,u=l+1,h=e/a,d=t/l,p=[],g=[],x=[],f=[];for(let m=0;m<u;m++){let b=m*d-o;for(let y=0;y<c;y++){let T=y*h-r;g.push(T,-b,0),x.push(0,0,1),f.push(y/a),f.push(1-m/l)}}for(let m=0;m<l;m++)for(let b=0;b<a;b++){let y=b+c*m,T=b+c*(m+1),L=b+1+c*(m+1),A=b+1+c*m;p.push(y,T,A),p.push(T,L,A)}this.setIndex(p),this.setAttribute("position",new nt(g,3)),this.setAttribute("normal",new nt(x,3)),this.setAttribute("uv",new nt(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.widthSegments,e.heightSegments)}},Av=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Cv=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Rv=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Pv=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Lv=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Iv=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Dv=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Nv=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Uv=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Ov=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Fv=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Bv=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,zv=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,kv=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Hv=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Vv=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Gv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Wv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Xv=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,qv=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Yv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,jv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Zv=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Jv=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Kv=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Qv=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,$v=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,e0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,t0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,n0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,i0="gl_FragColor = linearToOutputTexel( gl_FragColor );",s0=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,r0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,o0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,a0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,l0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,c0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,u0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,h0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,d0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,f0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,p0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,m0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,g0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,v0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,x0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,y0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,_0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,S0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,M0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,b0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,T0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,w0=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,E0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,A0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,C0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,R0=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,P0=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,L0=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,I0=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,D0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,N0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,U0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,O0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,F0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,B0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,z0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,k0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,H0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,V0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,G0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,W0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,X0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,q0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Y0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,j0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Z0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,J0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,K0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Q0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,$0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,ex=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,tx=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,nx=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ix=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,sx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,rx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ox=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ax=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,lx=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,cx=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,ux=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,hx=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,dx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,fx=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,px=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,mx=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,gx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,vx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,xx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,yx=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,_x=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Sx=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Mx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,bx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Tx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,wx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Ex=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ax=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Rx=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Px=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Lx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ix=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Dx=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Nx=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Ux=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Ox=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Fx=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Bx=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,zx=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,kx=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Hx=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Vx=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Gx=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Wx=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Xx=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qx=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Yx=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,jx=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Zx=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Jx=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Kx=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Qx=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,$x=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ey=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,ty=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ny=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,iy=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,sy=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ry=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Fe={alphahash_fragment:Av,alphahash_pars_fragment:Cv,alphamap_fragment:Rv,alphamap_pars_fragment:Pv,alphatest_fragment:Lv,alphatest_pars_fragment:Iv,aomap_fragment:Dv,aomap_pars_fragment:Nv,batching_pars_vertex:Uv,batching_vertex:Ov,begin_vertex:Fv,beginnormal_vertex:Bv,bsdfs:zv,iridescence_fragment:kv,bumpmap_pars_fragment:Hv,clipping_planes_fragment:Vv,clipping_planes_pars_fragment:Gv,clipping_planes_pars_vertex:Wv,clipping_planes_vertex:Xv,color_fragment:qv,color_pars_fragment:Yv,color_pars_vertex:jv,color_vertex:Zv,common:Jv,cube_uv_reflection_fragment:Kv,defaultnormal_vertex:Qv,displacementmap_pars_vertex:$v,displacementmap_vertex:e0,emissivemap_fragment:t0,emissivemap_pars_fragment:n0,colorspace_fragment:i0,colorspace_pars_fragment:s0,envmap_fragment:r0,envmap_common_pars_fragment:o0,envmap_pars_fragment:a0,envmap_pars_vertex:l0,envmap_physical_pars_fragment:y0,envmap_vertex:c0,fog_vertex:u0,fog_pars_vertex:h0,fog_fragment:d0,fog_pars_fragment:f0,gradientmap_pars_fragment:p0,lightmap_pars_fragment:m0,lights_lambert_fragment:g0,lights_lambert_pars_fragment:v0,lights_pars_begin:x0,lights_toon_fragment:_0,lights_toon_pars_fragment:S0,lights_phong_fragment:M0,lights_phong_pars_fragment:b0,lights_physical_fragment:T0,lights_physical_pars_fragment:w0,lights_fragment_begin:E0,lights_fragment_maps:A0,lights_fragment_end:C0,logdepthbuf_fragment:R0,logdepthbuf_pars_fragment:P0,logdepthbuf_pars_vertex:L0,logdepthbuf_vertex:I0,map_fragment:D0,map_pars_fragment:N0,map_particle_fragment:U0,map_particle_pars_fragment:O0,metalnessmap_fragment:F0,metalnessmap_pars_fragment:B0,morphinstance_vertex:z0,morphcolor_vertex:k0,morphnormal_vertex:H0,morphtarget_pars_vertex:V0,morphtarget_vertex:G0,normal_fragment_begin:W0,normal_fragment_maps:X0,normal_pars_fragment:q0,normal_pars_vertex:Y0,normal_vertex:j0,normalmap_pars_fragment:Z0,clearcoat_normal_fragment_begin:J0,clearcoat_normal_fragment_maps:K0,clearcoat_pars_fragment:Q0,iridescence_pars_fragment:$0,opaque_fragment:ex,packing:tx,premultiplied_alpha_fragment:nx,project_vertex:ix,dithering_fragment:sx,dithering_pars_fragment:rx,roughnessmap_fragment:ox,roughnessmap_pars_fragment:ax,shadowmap_pars_fragment:lx,shadowmap_pars_vertex:cx,shadowmap_vertex:ux,shadowmask_pars_fragment:hx,skinbase_vertex:dx,skinning_pars_vertex:fx,skinning_vertex:px,skinnormal_vertex:mx,specularmap_fragment:gx,specularmap_pars_fragment:vx,tonemapping_fragment:xx,tonemapping_pars_fragment:yx,transmission_fragment:_x,transmission_pars_fragment:Sx,uv_pars_fragment:Mx,uv_pars_vertex:bx,uv_vertex:Tx,worldpos_vertex:wx,background_vert:Ex,background_frag:Ax,backgroundCube_vert:Cx,backgroundCube_frag:Rx,cube_vert:Px,cube_frag:Lx,depth_vert:Ix,depth_frag:Dx,distanceRGBA_vert:Nx,distanceRGBA_frag:Ux,equirect_vert:Ox,equirect_frag:Fx,linedashed_vert:Bx,linedashed_frag:zx,meshbasic_vert:kx,meshbasic_frag:Hx,meshlambert_vert:Vx,meshlambert_frag:Gx,meshmatcap_vert:Wx,meshmatcap_frag:Xx,meshnormal_vert:qx,meshnormal_frag:Yx,meshphong_vert:jx,meshphong_frag:Zx,meshphysical_vert:Jx,meshphysical_frag:Kx,meshtoon_vert:Qx,meshtoon_frag:$x,points_vert:ey,points_frag:ty,shadow_vert:ny,shadow_frag:iy,sprite_vert:sy,sprite_frag:ry},oe={common:{diffuse:{value:new Me(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Be},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Be}},envmap:{envMap:{value:null},envMapRotation:{value:new Be},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Be}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Be}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Be},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Be},normalScale:{value:new se(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Be},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Be}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Be}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Be}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Me(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Me(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0},uvTransform:{value:new Be}},sprite:{diffuse:{value:new Me(16777215)},opacity:{value:1},center:{value:new se(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Be},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0}}},qn={basic:{uniforms:Jt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.fog]),vertexShader:Fe.meshbasic_vert,fragmentShader:Fe.meshbasic_frag},lambert:{uniforms:Jt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new Me(0)}}]),vertexShader:Fe.meshlambert_vert,fragmentShader:Fe.meshlambert_frag},phong:{uniforms:Jt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new Me(0)},specular:{value:new Me(1118481)},shininess:{value:30}}]),vertexShader:Fe.meshphong_vert,fragmentShader:Fe.meshphong_frag},standard:{uniforms:Jt([oe.common,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.roughnessmap,oe.metalnessmap,oe.fog,oe.lights,{emissive:{value:new Me(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Fe.meshphysical_vert,fragmentShader:Fe.meshphysical_frag},toon:{uniforms:Jt([oe.common,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.gradientmap,oe.fog,oe.lights,{emissive:{value:new Me(0)}}]),vertexShader:Fe.meshtoon_vert,fragmentShader:Fe.meshtoon_frag},matcap:{uniforms:Jt([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,{matcap:{value:null}}]),vertexShader:Fe.meshmatcap_vert,fragmentShader:Fe.meshmatcap_frag},points:{uniforms:Jt([oe.points,oe.fog]),vertexShader:Fe.points_vert,fragmentShader:Fe.points_frag},dashed:{uniforms:Jt([oe.common,oe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Fe.linedashed_vert,fragmentShader:Fe.linedashed_frag},depth:{uniforms:Jt([oe.common,oe.displacementmap]),vertexShader:Fe.depth_vert,fragmentShader:Fe.depth_frag},normal:{uniforms:Jt([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,{opacity:{value:1}}]),vertexShader:Fe.meshnormal_vert,fragmentShader:Fe.meshnormal_frag},sprite:{uniforms:Jt([oe.sprite,oe.fog]),vertexShader:Fe.sprite_vert,fragmentShader:Fe.sprite_frag},background:{uniforms:{uvTransform:{value:new Be},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Fe.background_vert,fragmentShader:Fe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Be}},vertexShader:Fe.backgroundCube_vert,fragmentShader:Fe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Fe.cube_vert,fragmentShader:Fe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Fe.equirect_vert,fragmentShader:Fe.equirect_frag},distanceRGBA:{uniforms:Jt([oe.common,oe.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Fe.distanceRGBA_vert,fragmentShader:Fe.distanceRGBA_frag},shadow:{uniforms:Jt([oe.lights,oe.fog,{color:{value:new Me(0)},opacity:{value:1}}]),vertexShader:Fe.shadow_vert,fragmentShader:Fe.shadow_frag}};qn.physical={uniforms:Jt([qn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Be},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Be},clearcoatNormalScale:{value:new se(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Be},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Be},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Be},sheen:{value:0},sheenColor:{value:new Me(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Be},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Be},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Be},transmissionSamplerSize:{value:new se},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Be},attenuationDistance:{value:0},attenuationColor:{value:new Me(0)},specularColor:{value:new Me(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Be},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Be},anisotropyVector:{value:new se},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Be}}]),vertexShader:Fe.meshphysical_vert,fragmentShader:Fe.meshphysical_frag};var ha={r:0,b:0,g:0},es=new Yn,oy=new $e;function ay(n,e,t,i,s,r,o){let a=new Me(0),l=r===!0?0:1,c,u,h=null,d=0,p=null;function g(b){let y=b.isScene===!0?b.background:null;return y&&y.isTexture&&(y=(b.backgroundBlurriness>0?t:e).get(y)),y}function x(b){let y=!1,T=g(b);T===null?m(a,l):T&&T.isColor&&(m(T,1),y=!0);let L=n.xr.getEnvironmentBlendMode();L==="additive"?i.buffers.color.setClear(0,0,0,1,o):L==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||y)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function f(b,y){let T=g(y);T&&(T.isCubeTexture||T.mapping===$a)?(u===void 0&&(u=new Oe(new jn(1,1,1),new rt({name:"BackgroundCubeMaterial",uniforms:Ks(qn.backgroundCube.uniforms),vertexShader:qn.backgroundCube.vertexShader,fragmentShader:qn.backgroundCube.fragmentShader,side:Gt,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(L,A,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),es.copy(y.backgroundRotation),es.x*=-1,es.y*=-1,es.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(es.y*=-1,es.z*=-1),u.material.uniforms.envMap.value=T,u.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(oy.makeRotationFromEuler(es)),u.material.toneMapped=Je.getTransfer(T.colorSpace)!==at,(h!==T||d!==T.version||p!==n.toneMapping)&&(u.material.needsUpdate=!0,h=T,d=T.version,p=n.toneMapping),u.layers.enableAll(),b.unshift(u,u.geometry,u.material,0,0,null)):T&&T.isTexture&&(c===void 0&&(c=new Oe(new Ua(2,2),new rt({name:"BackgroundMaterial",uniforms:Ks(qn.background.uniforms),vertexShader:qn.background.vertexShader,fragmentShader:qn.background.fragmentShader,side:Di,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=T,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=Je.getTransfer(T.colorSpace)!==at,T.matrixAutoUpdate===!0&&T.updateMatrix(),c.material.uniforms.uvTransform.value.copy(T.matrix),(h!==T||d!==T.version||p!==n.toneMapping)&&(c.material.needsUpdate=!0,h=T,d=T.version,p=n.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null))}function m(b,y){b.getRGB(ha,dp(n)),i.buffers.color.setClear(ha.r,ha.g,ha.b,y,o)}return{getClearColor:function(){return a},setClearColor:function(b,y=1){a.set(b),l=y,m(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(b){l=b,m(a,l)},render:x,addToRenderList:f}}function ly(n,e){let t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null),r=s,o=!1;function a(v,S,U,F,V){let J=!1,H=h(F,U,S);r!==H&&(r=H,c(r.object)),J=p(v,F,U,V),J&&g(v,F,U,V),V!==null&&e.update(V,n.ELEMENT_ARRAY_BUFFER),(J||o)&&(o=!1,T(v,S,U,F),V!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function l(){return n.createVertexArray()}function c(v){return n.bindVertexArray(v)}function u(v){return n.deleteVertexArray(v)}function h(v,S,U){let F=U.wireframe===!0,V=i[v.id];V===void 0&&(V={},i[v.id]=V);let J=V[S.id];J===void 0&&(J={},V[S.id]=J);let H=J[F];return H===void 0&&(H=d(l()),J[F]=H),H}function d(v){let S=[],U=[],F=[];for(let V=0;V<t;V++)S[V]=0,U[V]=0,F[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:S,enabledAttributes:U,attributeDivisors:F,object:v,attributes:{},index:null}}function p(v,S,U,F){let V=r.attributes,J=S.attributes,H=0,ee=U.getAttributes();for(let W in ee)if(ee[W].location>=0){let ue=V[W],ge=J[W];if(ge===void 0&&(W==="instanceMatrix"&&v.instanceMatrix&&(ge=v.instanceMatrix),W==="instanceColor"&&v.instanceColor&&(ge=v.instanceColor)),ue===void 0||ue.attribute!==ge||ge&&ue.data!==ge.data)return!0;H++}return r.attributesNum!==H||r.index!==F}function g(v,S,U,F){let V={},J=S.attributes,H=0,ee=U.getAttributes();for(let W in ee)if(ee[W].location>=0){let ue=J[W];ue===void 0&&(W==="instanceMatrix"&&v.instanceMatrix&&(ue=v.instanceMatrix),W==="instanceColor"&&v.instanceColor&&(ue=v.instanceColor));let ge={};ge.attribute=ue,ue&&ue.data&&(ge.data=ue.data),V[W]=ge,H++}r.attributes=V,r.attributesNum=H,r.index=F}function x(){let v=r.newAttributes;for(let S=0,U=v.length;S<U;S++)v[S]=0}function f(v){m(v,0)}function m(v,S){let U=r.newAttributes,F=r.enabledAttributes,V=r.attributeDivisors;U[v]=1,F[v]===0&&(n.enableVertexAttribArray(v),F[v]=1),V[v]!==S&&(n.vertexAttribDivisor(v,S),V[v]=S)}function b(){let v=r.newAttributes,S=r.enabledAttributes;for(let U=0,F=S.length;U<F;U++)S[U]!==v[U]&&(n.disableVertexAttribArray(U),S[U]=0)}function y(v,S,U,F,V,J,H){H===!0?n.vertexAttribIPointer(v,S,U,V,J):n.vertexAttribPointer(v,S,U,F,V,J)}function T(v,S,U,F){x();let V=F.attributes,J=U.getAttributes(),H=S.defaultAttributeValues;for(let ee in J){let W=J[ee];if(W.location>=0){let ie=V[ee];if(ie===void 0&&(ee==="instanceMatrix"&&v.instanceMatrix&&(ie=v.instanceMatrix),ee==="instanceColor"&&v.instanceColor&&(ie=v.instanceColor)),ie!==void 0){let ue=ie.normalized,ge=ie.itemSize,ke=e.get(ie);if(ke===void 0)continue;let Ye=ke.buffer,q=ke.type,Q=ke.bytesPerElement,ve=q===n.INT||q===n.UNSIGNED_INT||ie.gpuType===lh;if(ie.isInterleavedBufferAttribute){let le=ie.data,Ee=le.stride,Te=ie.offset;if(le.isInstancedInterleavedBuffer){for(let Ue=0;Ue<W.locationSize;Ue++)m(W.location+Ue,le.meshPerAttribute);v.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=le.meshPerAttribute*le.count)}else for(let Ue=0;Ue<W.locationSize;Ue++)f(W.location+Ue);n.bindBuffer(n.ARRAY_BUFFER,Ye);for(let Ue=0;Ue<W.locationSize;Ue++)y(W.location+Ue,ge/W.locationSize,q,ue,Ee*Q,(Te+ge/W.locationSize*Ue)*Q,ve)}else{if(ie.isInstancedBufferAttribute){for(let le=0;le<W.locationSize;le++)m(W.location+le,ie.meshPerAttribute);v.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let le=0;le<W.locationSize;le++)f(W.location+le);n.bindBuffer(n.ARRAY_BUFFER,Ye);for(let le=0;le<W.locationSize;le++)y(W.location+le,ge/W.locationSize,q,ue,ge*Q,ge/W.locationSize*le*Q,ve)}}else if(H!==void 0){let ue=H[ee];if(ue!==void 0)switch(ue.length){case 2:n.vertexAttrib2fv(W.location,ue);break;case 3:n.vertexAttrib3fv(W.location,ue);break;case 4:n.vertexAttrib4fv(W.location,ue);break;default:n.vertexAttrib1fv(W.location,ue)}}}}b()}function L(){P();for(let v in i){let S=i[v];for(let U in S){let F=S[U];for(let V in F)u(F[V].object),delete F[V];delete S[U]}delete i[v]}}function A(v){if(i[v.id]===void 0)return;let S=i[v.id];for(let U in S){let F=S[U];for(let V in F)u(F[V].object),delete F[V];delete S[U]}delete i[v.id]}function E(v){for(let S in i){let U=i[S];if(U[v.id]===void 0)continue;let F=U[v.id];for(let V in F)u(F[V].object),delete F[V];delete U[v.id]}}function P(){k(),o=!0,r!==s&&(r=s,c(r.object))}function k(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:P,resetDefaultState:k,dispose:L,releaseStatesOfGeometry:A,releaseStatesOfProgram:E,initAttributes:x,enableAttribute:f,disableUnusedAttributes:b}}function cy(n,e,t){let i;function s(c){i=c}function r(c,u){n.drawArrays(i,c,u),t.update(u,i,1)}function o(c,u,h){h!==0&&(n.drawArraysInstanced(i,c,u,h),t.update(u,i,h))}function a(c,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,h);let p=0;for(let g=0;g<h;g++)p+=u[g];t.update(p,i,1)}function l(c,u,h,d){if(h===0)return;let p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)o(c[g],u[g],d[g]);else{p.multiDrawArraysInstancedWEBGL(i,c,0,u,0,d,0,h);let g=0;for(let x=0;x<h;x++)g+=u[x];for(let x=0;x<d.length;x++)t.update(g,i,d[x])}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function uy(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let E=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(E){return!(E!==pn&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(E){let P=E===Et&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(E!==On&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==mi&&!P)}function l(E){if(E==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let h=t.logarithmicDepthBuffer===!0,d=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control");if(d===!0){let E=e.get("EXT_clip_control");E.clipControlEXT(E.LOWER_LEFT_EXT,E.ZERO_TO_ONE_EXT)}let p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_TEXTURE_SIZE),f=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),m=n.getParameter(n.MAX_VERTEX_ATTRIBS),b=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),y=n.getParameter(n.MAX_VARYING_VECTORS),T=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),L=g>0,A=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reverseDepthBuffer:d,maxTextures:p,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:f,maxAttributes:m,maxVertexUniforms:b,maxVaryings:y,maxFragmentUniforms:T,vertexTextures:L,maxSamples:A}}function hy(n){let e=this,t=null,i=0,s=!1,r=!1,o=new pi,a=new Be,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){let p=h.length!==0||d||i!==0||s;return s=d,i=h.length,p},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,d){t=u(h,d,0)},this.setState=function(h,d,p){let g=h.clippingPlanes,x=h.clipIntersection,f=h.clipShadows,m=n.get(h);if(!s||g===null||g.length===0||r&&!f)r?u(null):c();else{let b=r?0:i,y=b*4,T=m.clippingState||null;l.value=T,T=u(g,d,y,p);for(let L=0;L!==y;++L)T[L]=t[L];m.clippingState=T,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,d,p,g){let x=h!==null?h.length:0,f=null;if(x!==0){if(f=l.value,g!==!0||f===null){let m=p+x*4,b=d.matrixWorldInverse;a.getNormalMatrix(b),(f===null||f.length<m)&&(f=new Float32Array(m));for(let y=0,T=p;y!==x;++y,T+=4)o.copy(h[y]).applyMatrix4(b,a),o.normal.toArray(f,T),f[T+3]=o.constant}l.value=f,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,f}}function dy(n){let e=new WeakMap;function t(o,a){return a===kc?o.mapping=js:a===Hc&&(o.mapping=Zs),o}function i(o){if(o&&o.isTexture){let a=o.mapping;if(a===kc||a===Hc)if(e.has(o)){let l=e.get(o).texture;return t(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new Su(l.height);return c.fromEquirectangularTexture(n,o),e.set(o,c),o.addEventListener("dispose",s),t(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}var Qs=class extends Da{constructor(e=-1,t=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-e,o=i+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Vs=4,vf=[.125,.215,.35,.446,.526,.582],ss=20,_c=new Qs,xf=new Me,Sc=null,Mc=0,bc=0,Tc=!1,ns=(1+Math.sqrt(5))/2,Hs=1/ns,yf=[new C(-ns,Hs,0),new C(ns,Hs,0),new C(-Hs,0,ns),new C(Hs,0,ns),new C(0,ns,-Hs),new C(0,ns,Hs),new C(-1,1,-1),new C(1,1,-1),new C(-1,1,1),new C(1,1,1)],$s=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,s=100){Sc=this._renderer.getRenderTarget(),Mc=this._renderer.getActiveCubeFace(),bc=this._renderer.getActiveMipmapLevel(),Tc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,i,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Mf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Sf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Sc,Mc,bc),this._renderer.xr.enabled=Tc,e.scissorTest=!1,da(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===js||e.mapping===Zs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Sc=this._renderer.getRenderTarget(),Mc=this._renderer.getActiveCubeFace(),bc=this._renderer.getActiveMipmapLevel(),Tc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:fn,minFilter:fn,generateMipmaps:!1,type:Et,format:pn,colorSpace:zi,depthBuffer:!1},s=_f(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=_f(e,t,i);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=fy(r)),this._blurMaterial=py(r,e,t)}return s}_compileMaterial(e){let t=new Oe(this._lodPlanes[0],e);this._renderer.compile(t,_c)}_sceneToCubeUV(e,t,i,s){let a=new Vt(90,1,t,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,d=u.toneMapping;u.getClearColor(xf),u.toneMapping=Ii,u.autoClear=!1;let p=new An({name:"PMREM.Background",side:Gt,depthWrite:!1,depthTest:!1}),g=new Oe(new jn,p),x=!1,f=e.background;f?f.isColor&&(p.color.copy(f),e.background=null,x=!0):(p.color.copy(xf),x=!0);for(let m=0;m<6;m++){let b=m%3;b===0?(a.up.set(0,l[m],0),a.lookAt(c[m],0,0)):b===1?(a.up.set(0,0,l[m]),a.lookAt(0,c[m],0)):(a.up.set(0,l[m],0),a.lookAt(0,0,c[m]));let y=this._cubeSize;da(s,b*y,m>2?y:0,y,y),u.setRenderTarget(s),x&&u.render(g,a),u.render(e,a)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=d,u.autoClear=h,e.background=f}_textureToCubeUV(e,t){let i=this._renderer,s=e.mapping===js||e.mapping===Zs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Mf()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Sf());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new Oe(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let l=this._cubeSize;da(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,_c)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=yf[(s-r-1)%yf.length];this._blur(e,r-1,r,o,a)}t.autoClear=i}_blur(e,t,i,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,s,"latitudinal",r),this._halfBlur(o,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let u=3,h=new Oe(this._lodPlanes[s],c),d=c.uniforms,p=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*ss-1),x=r/g,f=isFinite(r)?1+Math.floor(u*x):ss;f>ss&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${f} samples when the maximum is set to ${ss}`);let m=[],b=0;for(let E=0;E<ss;++E){let P=E/x,k=Math.exp(-P*P/2);m.push(k),E===0?b+=k:E<f&&(b+=2*k)}for(let E=0;E<m.length;E++)m[E]=m[E]/b;d.envMap.value=e.texture,d.samples.value=f,d.weights.value=m,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:y}=this;d.dTheta.value=g,d.mipInt.value=y-i;let T=this._sizeLods[s],L=3*T*(s>y-Vs?s-y+Vs:0),A=4*(this._cubeSize-T);da(t,L,A,3*T,2*T),l.setRenderTarget(t),l.render(h,_c)}};function fy(n){let e=[],t=[],i=[],s=n,r=n-Vs+1+vf.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let l=1/a;o>n-Vs?l=vf[o-n+Vs-1]:o===0&&(l=0),i.push(l);let c=1/(a-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],p=6,g=6,x=3,f=2,m=1,b=new Float32Array(x*g*p),y=new Float32Array(f*g*p),T=new Float32Array(m*g*p);for(let A=0;A<p;A++){let E=A%3*2/3-1,P=A>2?0:-1,k=[E,P,0,E+2/3,P,0,E+2/3,P+1,0,E,P,0,E+2/3,P+1,0,E,P+1,0];b.set(k,x*g*A),y.set(d,f*g*A);let v=[A,A,A,A,A,A];T.set(v,m*g*A)}let L=new bt;L.setAttribute("position",new Wt(b,x)),L.setAttribute("uv",new Wt(y,f)),L.setAttribute("faceIndex",new Wt(T,m)),e.push(L),s>Vs&&s--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function _f(n,e,t){let i=new ht(n,e,t);return i.texture.mapping=$a,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function da(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function py(n,e,t){let i=new Float32Array(ss),s=new C(0,1,0);return new rt({name:"SphericalGaussianBlur",defines:{n:ss,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:gh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Mt,depthTest:!1,depthWrite:!1})}function Sf(){return new rt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:gh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Mt,depthTest:!1,depthWrite:!1})}function Mf(){return new rt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:gh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Mt,depthTest:!1,depthWrite:!1})}function gh(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function my(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){let l=a.mapping,c=l===kc||l===Hc,u=l===js||l===Zs;if(c||u){let h=e.get(a),d=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new $s(n)),h=c?t.fromEquirectangular(a,h):t.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture;if(h!==void 0)return h.texture;{let p=a.image;return c&&p&&p.height>0||u&&p&&s(p)?(t===null&&(t=new $s(n)),h=c?t.fromEquirectangular(a):t.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",r),h.texture):null}}}return a}function s(a){let l=0,c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function gy(n){let e={};function t(i){if(e[i]!==void 0)return e[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let s=t(i);return s===null&&ba("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function vy(n,e,t,i){let s={},r=new WeakMap;function o(h){let d=h.target;d.index!==null&&e.remove(d.index);for(let g in d.attributes)e.remove(d.attributes[g]);for(let g in d.morphAttributes){let x=d.morphAttributes[g];for(let f=0,m=x.length;f<m;f++)e.remove(x[f])}d.removeEventListener("dispose",o),delete s[d.id];let p=r.get(d);p&&(e.remove(p),r.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(h,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,t.memory.geometries++),d}function l(h){let d=h.attributes;for(let g in d)e.update(d[g],n.ARRAY_BUFFER);let p=h.morphAttributes;for(let g in p){let x=p[g];for(let f=0,m=x.length;f<m;f++)e.update(x[f],n.ARRAY_BUFFER)}}function c(h){let d=[],p=h.index,g=h.attributes.position,x=0;if(p!==null){let b=p.array;x=p.version;for(let y=0,T=b.length;y<T;y+=3){let L=b[y+0],A=b[y+1],E=b[y+2];d.push(L,A,A,E,E,L)}}else if(g!==void 0){let b=g.array;x=g.version;for(let y=0,T=b.length/3-1;y<T;y+=3){let L=y+0,A=y+1,E=y+2;d.push(L,A,A,E,E,L)}}else return;let f=new(up(d)?Ia:La)(d,1);f.version=x;let m=r.get(h);m&&e.remove(m),r.set(h,f)}function u(h){let d=r.get(h);if(d){let p=h.index;p!==null&&d.version<p.version&&c(h)}else c(h);return r.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function xy(n,e,t){let i;function s(d){i=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,p){n.drawElements(i,p,r,d*o),t.update(p,i,1)}function c(d,p,g){g!==0&&(n.drawElementsInstanced(i,p,r,d*o,g),t.update(p,i,g))}function u(d,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,r,d,0,g);let f=0;for(let m=0;m<g;m++)f+=p[m];t.update(f,i,1)}function h(d,p,g,x){if(g===0)return;let f=e.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<d.length;m++)c(d[m]/o,p[m],x[m]);else{f.multiDrawElementsInstancedWEBGL(i,p,0,r,d,0,x,0,g);let m=0;for(let b=0;b<g;b++)m+=p[b];for(let b=0;b<x.length;b++)t.update(m,i,x[b])}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function yy(n){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(r/3);break;case n.LINES:t.lines+=a*(r/2);break;case n.LINE_STRIP:t.lines+=a*(r-1);break;case n.LINE_LOOP:t.lines+=a*r;break;case n.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function _y(n,e,t){let i=new WeakMap,s=new ot;function r(o,a,l){let c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0,d=i.get(a);if(d===void 0||d.count!==h){let k=function(){E.dispose(),i.delete(a),a.removeEventListener("dispose",k)};d!==void 0&&d.texture.dispose();let p=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,f=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],b=a.morphAttributes.color||[],y=0;p===!0&&(y=1),g===!0&&(y=2),x===!0&&(y=3);let T=a.attributes.position.count*y,L=1;T>e.maxTextureSize&&(L=Math.ceil(T/e.maxTextureSize),T=e.maxTextureSize);let A=new Float32Array(T*L*4*h),E=new Pa(A,T,L,h);E.type=mi,E.needsUpdate=!0;let P=y*4;for(let v=0;v<h;v++){let S=f[v],U=m[v],F=b[v],V=T*L*4*v;for(let J=0;J<S.count;J++){let H=J*P;p===!0&&(s.fromBufferAttribute(S,J),A[V+H+0]=s.x,A[V+H+1]=s.y,A[V+H+2]=s.z,A[V+H+3]=0),g===!0&&(s.fromBufferAttribute(U,J),A[V+H+4]=s.x,A[V+H+5]=s.y,A[V+H+6]=s.z,A[V+H+7]=0),x===!0&&(s.fromBufferAttribute(F,J),A[V+H+8]=s.x,A[V+H+9]=s.y,A[V+H+10]=s.z,A[V+H+11]=F.itemSize===4?s.w:1)}}d={count:h,texture:E,size:new se(T,L)},i.set(a,d),a.addEventListener("dispose",k)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let p=0;for(let x=0;x<c.length;x++)p+=c[x];let g=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(n,"morphTargetBaseInfluence",g),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:r}}function Sy(n,e,t,i){let s=new WeakMap;function r(l){let c=i.render.frame,u=l.geometry,h=e.get(l,u);if(s.get(h)!==c&&(e.update(h),s.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return h}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}var er=class extends Ct{constructor(e,t,i,s,r,o,a,l,c,u=Ws){if(u!==Ws&&u!==Ui)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&u===Ws&&(i=ls),i===void 0&&u===Ui&&(i=Ni),super(null,s,r,o,a,l,u,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:_t,this.minFilter=l!==void 0?l:_t,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},pp=new Ct,bf=new er(1,1),mp=new Pa,gp=new yu,vp=new Na,Tf=[],wf=[],Ef=new Float32Array(16),Af=new Float32Array(9),Cf=new Float32Array(4);function or(n,e,t){let i=n[0];if(i<=0||i>0)return n;let s=e*t,r=Tf[s];if(r===void 0&&(r=new Float32Array(s),Tf[s]=r),e!==0){i.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(r,a)}return r}function Tt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function wt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function tl(n,e){let t=wf[e];t===void 0&&(t=new Int32Array(e),wf[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function My(n,e){let t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function by(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;n.uniform2fv(this.addr,e),wt(t,e)}}function Ty(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Tt(t,e))return;n.uniform3fv(this.addr,e),wt(t,e)}}function wy(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;n.uniform4fv(this.addr,e),wt(t,e)}}function Ey(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Tt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),wt(t,e)}else{if(Tt(t,i))return;Cf.set(i),n.uniformMatrix2fv(this.addr,!1,Cf),wt(t,i)}}function Ay(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Tt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),wt(t,e)}else{if(Tt(t,i))return;Af.set(i),n.uniformMatrix3fv(this.addr,!1,Af),wt(t,i)}}function Cy(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Tt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),wt(t,e)}else{if(Tt(t,i))return;Ef.set(i),n.uniformMatrix4fv(this.addr,!1,Ef),wt(t,i)}}function Ry(n,e){let t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Py(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;n.uniform2iv(this.addr,e),wt(t,e)}}function Ly(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;n.uniform3iv(this.addr,e),wt(t,e)}}function Iy(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;n.uniform4iv(this.addr,e),wt(t,e)}}function Dy(n,e){let t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Ny(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;n.uniform2uiv(this.addr,e),wt(t,e)}}function Uy(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;n.uniform3uiv(this.addr,e),wt(t,e)}}function Oy(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;n.uniform4uiv(this.addr,e),wt(t,e)}}function Fy(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(bf.compareFunction=cp,r=bf):r=pp,t.setTexture2D(e||r,s)}function By(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||gp,s)}function zy(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||vp,s)}function ky(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||mp,s)}function Hy(n){switch(n){case 5126:return My;case 35664:return by;case 35665:return Ty;case 35666:return wy;case 35674:return Ey;case 35675:return Ay;case 35676:return Cy;case 5124:case 35670:return Ry;case 35667:case 35671:return Py;case 35668:case 35672:return Ly;case 35669:case 35673:return Iy;case 5125:return Dy;case 36294:return Ny;case 36295:return Uy;case 36296:return Oy;case 35678:case 36198:case 36298:case 36306:case 35682:return Fy;case 35679:case 36299:case 36307:return By;case 35680:case 36300:case 36308:case 36293:return zy;case 36289:case 36303:case 36311:case 36292:return ky}}function Vy(n,e){n.uniform1fv(this.addr,e)}function Gy(n,e){let t=or(e,this.size,2);n.uniform2fv(this.addr,t)}function Wy(n,e){let t=or(e,this.size,3);n.uniform3fv(this.addr,t)}function Xy(n,e){let t=or(e,this.size,4);n.uniform4fv(this.addr,t)}function qy(n,e){let t=or(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Yy(n,e){let t=or(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function jy(n,e){let t=or(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Zy(n,e){n.uniform1iv(this.addr,e)}function Jy(n,e){n.uniform2iv(this.addr,e)}function Ky(n,e){n.uniform3iv(this.addr,e)}function Qy(n,e){n.uniform4iv(this.addr,e)}function $y(n,e){n.uniform1uiv(this.addr,e)}function e_(n,e){n.uniform2uiv(this.addr,e)}function t_(n,e){n.uniform3uiv(this.addr,e)}function n_(n,e){n.uniform4uiv(this.addr,e)}function i_(n,e,t){let i=this.cache,s=e.length,r=tl(t,s);Tt(i,r)||(n.uniform1iv(this.addr,r),wt(i,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||pp,r[o])}function s_(n,e,t){let i=this.cache,s=e.length,r=tl(t,s);Tt(i,r)||(n.uniform1iv(this.addr,r),wt(i,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||gp,r[o])}function r_(n,e,t){let i=this.cache,s=e.length,r=tl(t,s);Tt(i,r)||(n.uniform1iv(this.addr,r),wt(i,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||vp,r[o])}function o_(n,e,t){let i=this.cache,s=e.length,r=tl(t,s);Tt(i,r)||(n.uniform1iv(this.addr,r),wt(i,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||mp,r[o])}function a_(n){switch(n){case 5126:return Vy;case 35664:return Gy;case 35665:return Wy;case 35666:return Xy;case 35674:return qy;case 35675:return Yy;case 35676:return jy;case 5124:case 35670:return Zy;case 35667:case 35671:return Jy;case 35668:case 35672:return Ky;case 35669:case 35673:return Qy;case 5125:return $y;case 36294:return e_;case 36295:return t_;case 36296:return n_;case 35678:case 36198:case 36298:case 36306:case 35682:return i_;case 35679:case 36299:case 36307:return s_;case 35680:case 36300:case 36308:case 36293:return r_;case 36289:case 36303:case 36311:case 36292:return o_}}var Mu=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Hy(t.type)}},bu=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=a_(t.type)}},Tu=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],i)}}},wc=/(\w+)(\])?(\[|\.)?/g;function Rf(n,e){n.seq.push(e),n.map[e.id]=e}function l_(n,e,t){let i=n.name,s=i.length;for(wc.lastIndex=0;;){let r=wc.exec(i),o=wc.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Rf(t,c===void 0?new Mu(a,n,e):new bu(a,n,e));break}else{let h=t.map[a];h===void 0&&(h=new Tu(a),Rf(t,h)),t=h}}}var qs=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);l_(r,o,this)}}setValue(e,t,i,s){let r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){let s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){let i=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&i.push(o)}return i}};function Pf(n,e,t){let i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}var c_=37297,u_=0;function h_(n,e){let t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}function d_(n){let e=Je.getPrimaries(Je.workingColorSpace),t=Je.getPrimaries(n),i;switch(e===t?i="":e===Aa&&t===Ea?i="LinearDisplayP3ToLinearSRGB":e===Ea&&t===Aa&&(i="LinearSRGBToLinearDisplayP3"),n){case zi:case el:return[i,"LinearTransferOETF"];case sn:case mh:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[i,"LinearTransferOETF"]}}function Lf(n,e,t){let i=n.getShaderParameter(e,n.COMPILE_STATUS),s=n.getShaderInfoLog(e).trim();if(i&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+h_(n.getShaderSource(e),o)}else return s}function f_(n,e){let t=d_(e);return`vec4 ${n}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function p_(n,e){let t;switch(e){case ih:t="Linear";break;case sh:t="Reinhard";break;case rh:t="Cineon";break;case ao:t="ACESFilmic";break;case oh:t="AgX";break;case ah:t="Neutral";break;case Xg:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var fa=new C;function m_(){Je.getLuminanceCoefficients(fa);let n=fa.x.toFixed(4),e=fa.y.toFixed(4),t=fa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function g_(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Vr).join(`
`)}function v_(n){let e=[];for(let t in n){let i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function x_(n,e){let t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(e,s),o=r.name,a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function Vr(n){return n!==""}function If(n,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Df(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var y_=/^[ \t]*#include +<([\w\d./]+)>/gm;function wu(n){return n.replace(y_,S_)}var __=new Map;function S_(n,e){let t=Fe[e];if(t===void 0){let i=__.get(e);if(i!==void 0)t=Fe[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return wu(t)}var M_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Nf(n){return n.replace(M_,b_)}function b_(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Uf(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function T_(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Jf?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===th?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===fi&&(e="SHADOWMAP_TYPE_VSM"),e}function w_(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case js:case Zs:e="ENVMAP_TYPE_CUBE";break;case $a:e="ENVMAP_TYPE_CUBE_UV";break}return e}function E_(n){let e="ENVMAP_MODE_REFLECTION";return n.envMap&&n.envMapMode===Zs&&(e="ENVMAP_MODE_REFRACTION"),e}function A_(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Kf:e="ENVMAP_BLENDING_MULTIPLY";break;case Gg:e="ENVMAP_BLENDING_MIX";break;case Wg:e="ENVMAP_BLENDING_ADD";break}return e}function C_(n){let e=n.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function R_(n,e,t,i){let s=n.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=T_(t),c=w_(t),u=E_(t),h=A_(t),d=C_(t),p=g_(t),g=v_(r),x=s.createProgram(),f,m,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Vr).join(`
`),f.length>0&&(f+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Vr).join(`
`),m.length>0&&(m+=`
`)):(f=[Uf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Vr).join(`
`),m=[Uf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ii?"#define TONE_MAPPING":"",t.toneMapping!==Ii?Fe.tonemapping_pars_fragment:"",t.toneMapping!==Ii?p_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Fe.colorspace_pars_fragment,f_("linearToOutputTexel",t.outputColorSpace),m_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Vr).join(`
`)),o=wu(o),o=If(o,t),o=Df(o,t),a=wu(a),a=If(a,t),a=Df(a,t),o=Nf(o),a=Nf(a),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,f=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,m=["#define varying in",t.glslVersion===Qd?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Qd?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);let y=b+f+o,T=b+m+a,L=Pf(s,s.VERTEX_SHADER,y),A=Pf(s,s.FRAGMENT_SHADER,T);s.attachShader(x,L),s.attachShader(x,A),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function E(S){if(n.debug.checkShaderErrors){let U=s.getProgramInfoLog(x).trim(),F=s.getShaderInfoLog(L).trim(),V=s.getShaderInfoLog(A).trim(),J=!0,H=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(J=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,x,L,A);else{let ee=Lf(s,L,"vertex"),W=Lf(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+S.name+`
Material Type: `+S.type+`

Program Info Log: `+U+`
`+ee+`
`+W)}else U!==""?console.warn("THREE.WebGLProgram: Program Info Log:",U):(F===""||V==="")&&(H=!1);H&&(S.diagnostics={runnable:J,programLog:U,vertexShader:{log:F,prefix:f},fragmentShader:{log:V,prefix:m}})}s.deleteShader(L),s.deleteShader(A),P=new qs(s,x),k=x_(s,x)}let P;this.getUniforms=function(){return P===void 0&&E(this),P};let k;this.getAttributes=function(){return k===void 0&&E(this),k};let v=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=s.getProgramParameter(x,c_)),v},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=u_++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=L,this.fragmentShader=A,this}var P_=0,Eu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new Au(e),t.set(e,i)),i}},Au=class{constructor(e){this.id=P_++,this.code=e,this.usedTimes=0}};function L_(n,e,t,i,s,r,o){let a=new Zr,l=new Eu,c=new Set,u=[],h=s.logarithmicDepthBuffer,d=s.reverseDepthBuffer,p=s.vertexTextures,g=s.precision,x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function f(v){return c.add(v),v===0?"uv":`uv${v}`}function m(v,S,U,F,V){let J=F.fog,H=V.geometry,ee=v.isMeshStandardMaterial?F.environment:null,W=(v.isMeshStandardMaterial?t:e).get(v.envMap||ee),ie=W&&W.mapping===$a?W.image.height:null,ue=x[v.type];v.precision!==null&&(g=s.getMaxPrecision(v.precision),g!==v.precision&&console.warn("THREE.WebGLProgram.getParameters:",v.precision,"not supported, using",g,"instead."));let ge=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,ke=ge!==void 0?ge.length:0,Ye=0;H.morphAttributes.position!==void 0&&(Ye=1),H.morphAttributes.normal!==void 0&&(Ye=2),H.morphAttributes.color!==void 0&&(Ye=3);let q,Q,ve,le;if(ue){let tn=qn[ue];q=tn.vertexShader,Q=tn.fragmentShader}else q=v.vertexShader,Q=v.fragmentShader,l.update(v),ve=l.getVertexShaderID(v),le=l.getFragmentShaderID(v);let Ee=n.getRenderTarget(),Te=V.isInstancedMesh===!0,Ue=V.isBatchedMesh===!0,Ke=!!v.map,We=!!v.matcap,R=!!W,It=!!v.aoMap,He=!!v.lightMap,Xe=!!v.bumpMap,Ce=!!v.normalMap,it=!!v.displacementMap,Re=!!v.emissiveMap,w=!!v.metalnessMap,_=!!v.roughnessMap,O=v.anisotropy>0,j=v.clearcoat>0,K=v.dispersion>0,Y=v.iridescence>0,_e=v.sheen>0,re=v.transmission>0,he=O&&!!v.anisotropyMap,Ve=j&&!!v.clearcoatMap,$=j&&!!v.clearcoatNormalMap,de=j&&!!v.clearcoatRoughnessMap,Pe=Y&&!!v.iridescenceMap,Le=Y&&!!v.iridescenceThicknessMap,xe=_e&&!!v.sheenColorMap,qe=_e&&!!v.sheenRoughnessMap,Ne=!!v.specularMap,Ze=!!v.specularColorMap,I=!!v.specularIntensityMap,ce=re&&!!v.transmissionMap,G=re&&!!v.thicknessMap,Z=!!v.gradientMap,fe=!!v.alphaMap,me=v.alphaTest>0,je=!!v.alphaHash,vt=!!v.extensions,en=Ii;v.toneMapped&&(Ee===null||Ee.isXRRenderTarget===!0)&&(en=n.toneMapping);let Qe={shaderID:ue,shaderType:v.type,shaderName:v.name,vertexShader:q,fragmentShader:Q,defines:v.defines,customVertexShaderID:ve,customFragmentShaderID:le,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:g,batching:Ue,batchingColor:Ue&&V._colorsTexture!==null,instancing:Te,instancingColor:Te&&V.instanceColor!==null,instancingMorph:Te&&V.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:Ee===null?n.outputColorSpace:Ee.isXRRenderTarget===!0?Ee.texture.colorSpace:zi,alphaToCoverage:!!v.alphaToCoverage,map:Ke,matcap:We,envMap:R,envMapMode:R&&W.mapping,envMapCubeUVHeight:ie,aoMap:It,lightMap:He,bumpMap:Xe,normalMap:Ce,displacementMap:p&&it,emissiveMap:Re,normalMapObjectSpace:Ce&&v.normalMapType===Zg,normalMapTangentSpace:Ce&&v.normalMapType===ph,metalnessMap:w,roughnessMap:_,anisotropy:O,anisotropyMap:he,clearcoat:j,clearcoatMap:Ve,clearcoatNormalMap:$,clearcoatRoughnessMap:de,dispersion:K,iridescence:Y,iridescenceMap:Pe,iridescenceThicknessMap:Le,sheen:_e,sheenColorMap:xe,sheenRoughnessMap:qe,specularMap:Ne,specularColorMap:Ze,specularIntensityMap:I,transmission:re,transmissionMap:ce,thicknessMap:G,gradientMap:Z,opaque:v.transparent===!1&&v.blending===Gs&&v.alphaToCoverage===!1,alphaMap:fe,alphaTest:me,alphaHash:je,combine:v.combine,mapUv:Ke&&f(v.map.channel),aoMapUv:It&&f(v.aoMap.channel),lightMapUv:He&&f(v.lightMap.channel),bumpMapUv:Xe&&f(v.bumpMap.channel),normalMapUv:Ce&&f(v.normalMap.channel),displacementMapUv:it&&f(v.displacementMap.channel),emissiveMapUv:Re&&f(v.emissiveMap.channel),metalnessMapUv:w&&f(v.metalnessMap.channel),roughnessMapUv:_&&f(v.roughnessMap.channel),anisotropyMapUv:he&&f(v.anisotropyMap.channel),clearcoatMapUv:Ve&&f(v.clearcoatMap.channel),clearcoatNormalMapUv:$&&f(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:de&&f(v.clearcoatRoughnessMap.channel),iridescenceMapUv:Pe&&f(v.iridescenceMap.channel),iridescenceThicknessMapUv:Le&&f(v.iridescenceThicknessMap.channel),sheenColorMapUv:xe&&f(v.sheenColorMap.channel),sheenRoughnessMapUv:qe&&f(v.sheenRoughnessMap.channel),specularMapUv:Ne&&f(v.specularMap.channel),specularColorMapUv:Ze&&f(v.specularColorMap.channel),specularIntensityMapUv:I&&f(v.specularIntensityMap.channel),transmissionMapUv:ce&&f(v.transmissionMap.channel),thicknessMapUv:G&&f(v.thicknessMap.channel),alphaMapUv:fe&&f(v.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(Ce||O),vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:V.isPoints===!0&&!!H.attributes.uv&&(Ke||fe),fog:!!J,useFog:v.fog===!0,fogExp2:!!J&&J.isFogExp2,flatShading:v.flatShading===!0,sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:d,skinning:V.isSkinnedMesh===!0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:ke,morphTextureStride:Ye,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:v.dithering,shadowMapEnabled:n.shadowMap.enabled&&U.length>0,shadowMapType:n.shadowMap.type,toneMapping:en,decodeVideoTexture:Ke&&v.map.isVideoTexture===!0&&Je.getTransfer(v.map.colorSpace)===at,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===bn,flipSided:v.side===Gt,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:vt&&v.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(vt&&v.extensions.multiDraw===!0||Ue)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return Qe.vertexUv1s=c.has(1),Qe.vertexUv2s=c.has(2),Qe.vertexUv3s=c.has(3),c.clear(),Qe}function b(v){let S=[];if(v.shaderID?S.push(v.shaderID):(S.push(v.customVertexShaderID),S.push(v.customFragmentShaderID)),v.defines!==void 0)for(let U in v.defines)S.push(U),S.push(v.defines[U]);return v.isRawShaderMaterial===!1&&(y(S,v),T(S,v),S.push(n.outputColorSpace)),S.push(v.customProgramCacheKey),S.join()}function y(v,S){v.push(S.precision),v.push(S.outputColorSpace),v.push(S.envMapMode),v.push(S.envMapCubeUVHeight),v.push(S.mapUv),v.push(S.alphaMapUv),v.push(S.lightMapUv),v.push(S.aoMapUv),v.push(S.bumpMapUv),v.push(S.normalMapUv),v.push(S.displacementMapUv),v.push(S.emissiveMapUv),v.push(S.metalnessMapUv),v.push(S.roughnessMapUv),v.push(S.anisotropyMapUv),v.push(S.clearcoatMapUv),v.push(S.clearcoatNormalMapUv),v.push(S.clearcoatRoughnessMapUv),v.push(S.iridescenceMapUv),v.push(S.iridescenceThicknessMapUv),v.push(S.sheenColorMapUv),v.push(S.sheenRoughnessMapUv),v.push(S.specularMapUv),v.push(S.specularColorMapUv),v.push(S.specularIntensityMapUv),v.push(S.transmissionMapUv),v.push(S.thicknessMapUv),v.push(S.combine),v.push(S.fogExp2),v.push(S.sizeAttenuation),v.push(S.morphTargetsCount),v.push(S.morphAttributeCount),v.push(S.numDirLights),v.push(S.numPointLights),v.push(S.numSpotLights),v.push(S.numSpotLightMaps),v.push(S.numHemiLights),v.push(S.numRectAreaLights),v.push(S.numDirLightShadows),v.push(S.numPointLightShadows),v.push(S.numSpotLightShadows),v.push(S.numSpotLightShadowsWithMaps),v.push(S.numLightProbes),v.push(S.shadowMapType),v.push(S.toneMapping),v.push(S.numClippingPlanes),v.push(S.numClipIntersection),v.push(S.depthPacking)}function T(v,S){a.disableAll(),S.supportsVertexTextures&&a.enable(0),S.instancing&&a.enable(1),S.instancingColor&&a.enable(2),S.instancingMorph&&a.enable(3),S.matcap&&a.enable(4),S.envMap&&a.enable(5),S.normalMapObjectSpace&&a.enable(6),S.normalMapTangentSpace&&a.enable(7),S.clearcoat&&a.enable(8),S.iridescence&&a.enable(9),S.alphaTest&&a.enable(10),S.vertexColors&&a.enable(11),S.vertexAlphas&&a.enable(12),S.vertexUv1s&&a.enable(13),S.vertexUv2s&&a.enable(14),S.vertexUv3s&&a.enable(15),S.vertexTangents&&a.enable(16),S.anisotropy&&a.enable(17),S.alphaHash&&a.enable(18),S.batching&&a.enable(19),S.dispersion&&a.enable(20),S.batchingColor&&a.enable(21),v.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reverseDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.alphaToCoverage&&a.enable(20),v.push(a.mask)}function L(v){let S=x[v.type],U;if(S){let F=qn[S];U=Rt.clone(F.uniforms)}else U=v.uniforms;return U}function A(v,S){let U;for(let F=0,V=u.length;F<V;F++){let J=u[F];if(J.cacheKey===S){U=J,++U.usedTimes;break}}return U===void 0&&(U=new R_(n,S,v,r),u.push(U)),U}function E(v){if(--v.usedTimes===0){let S=u.indexOf(v);u[S]=u[u.length-1],u.pop(),v.destroy()}}function P(v){l.remove(v)}function k(){l.dispose()}return{getParameters:m,getProgramCacheKey:b,getUniforms:L,acquireProgram:A,releaseProgram:E,releaseShaderCache:P,programs:u,dispose:k}}function I_(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function s(o,a,l){n.get(o)[a]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function D_(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Of(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Ff(){let n=[],e=0,t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function o(h,d,p,g,x,f){let m=n[e];return m===void 0?(m={id:h.id,object:h,geometry:d,material:p,groupOrder:g,renderOrder:h.renderOrder,z:x,group:f},n[e]=m):(m.id=h.id,m.object=h,m.geometry=d,m.material=p,m.groupOrder=g,m.renderOrder=h.renderOrder,m.z=x,m.group=f),e++,m}function a(h,d,p,g,x,f){let m=o(h,d,p,g,x,f);p.transmission>0?i.push(m):p.transparent===!0?s.push(m):t.push(m)}function l(h,d,p,g,x,f){let m=o(h,d,p,g,x,f);p.transmission>0?i.unshift(m):p.transparent===!0?s.unshift(m):t.unshift(m)}function c(h,d){t.length>1&&t.sort(h||D_),i.length>1&&i.sort(d||Of),s.length>1&&s.sort(d||Of)}function u(){for(let h=e,d=n.length;h<d;h++){let p=n[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:a,unshift:l,finish:u,sort:c}}function N_(){let n=new WeakMap;function e(i,s){let r=n.get(i),o;return r===void 0?(o=new Ff,n.set(i,[o])):s>=r.length?(o=new Ff,r.push(o)):o=r[s],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function U_(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new C,color:new Me};break;case"SpotLight":t={position:new C,direction:new C,color:new Me,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new C,color:new Me,distance:0,decay:0};break;case"HemisphereLight":t={direction:new C,skyColor:new Me,groundColor:new Me};break;case"RectAreaLight":t={color:new Me,position:new C,halfWidth:new C,halfHeight:new C};break}return n[e.id]=t,t}}}function O_(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new se};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new se};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new se,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}var F_=0;function B_(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function z_(n){let e=new U_,t=O_(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new C);let s=new C,r=new $e,o=new $e;function a(c){let u=0,h=0,d=0;for(let k=0;k<9;k++)i.probe[k].set(0,0,0);let p=0,g=0,x=0,f=0,m=0,b=0,y=0,T=0,L=0,A=0,E=0;c.sort(B_);for(let k=0,v=c.length;k<v;k++){let S=c[k],U=S.color,F=S.intensity,V=S.distance,J=S.shadow&&S.shadow.map?S.shadow.map.texture:null;if(S.isAmbientLight)u+=U.r*F,h+=U.g*F,d+=U.b*F;else if(S.isLightProbe){for(let H=0;H<9;H++)i.probe[H].addScaledVector(S.sh.coefficients[H],F);E++}else if(S.isDirectionalLight){let H=e.get(S);if(H.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let ee=S.shadow,W=t.get(S);W.shadowIntensity=ee.intensity,W.shadowBias=ee.bias,W.shadowNormalBias=ee.normalBias,W.shadowRadius=ee.radius,W.shadowMapSize=ee.mapSize,i.directionalShadow[p]=W,i.directionalShadowMap[p]=J,i.directionalShadowMatrix[p]=S.shadow.matrix,b++}i.directional[p]=H,p++}else if(S.isSpotLight){let H=e.get(S);H.position.setFromMatrixPosition(S.matrixWorld),H.color.copy(U).multiplyScalar(F),H.distance=V,H.coneCos=Math.cos(S.angle),H.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),H.decay=S.decay,i.spot[x]=H;let ee=S.shadow;if(S.map&&(i.spotLightMap[L]=S.map,L++,ee.updateMatrices(S),S.castShadow&&A++),i.spotLightMatrix[x]=ee.matrix,S.castShadow){let W=t.get(S);W.shadowIntensity=ee.intensity,W.shadowBias=ee.bias,W.shadowNormalBias=ee.normalBias,W.shadowRadius=ee.radius,W.shadowMapSize=ee.mapSize,i.spotShadow[x]=W,i.spotShadowMap[x]=J,T++}x++}else if(S.isRectAreaLight){let H=e.get(S);H.color.copy(U).multiplyScalar(F),H.halfWidth.set(S.width*.5,0,0),H.halfHeight.set(0,S.height*.5,0),i.rectArea[f]=H,f++}else if(S.isPointLight){let H=e.get(S);if(H.color.copy(S.color).multiplyScalar(S.intensity),H.distance=S.distance,H.decay=S.decay,S.castShadow){let ee=S.shadow,W=t.get(S);W.shadowIntensity=ee.intensity,W.shadowBias=ee.bias,W.shadowNormalBias=ee.normalBias,W.shadowRadius=ee.radius,W.shadowMapSize=ee.mapSize,W.shadowCameraNear=ee.camera.near,W.shadowCameraFar=ee.camera.far,i.pointShadow[g]=W,i.pointShadowMap[g]=J,i.pointShadowMatrix[g]=S.shadow.matrix,y++}i.point[g]=H,g++}else if(S.isHemisphereLight){let H=e.get(S);H.skyColor.copy(S.color).multiplyScalar(F),H.groundColor.copy(S.groundColor).multiplyScalar(F),i.hemi[m]=H,m++}}f>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=oe.LTC_FLOAT_1,i.rectAreaLTC2=oe.LTC_FLOAT_2):(i.rectAreaLTC1=oe.LTC_HALF_1,i.rectAreaLTC2=oe.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=d;let P=i.hash;(P.directionalLength!==p||P.pointLength!==g||P.spotLength!==x||P.rectAreaLength!==f||P.hemiLength!==m||P.numDirectionalShadows!==b||P.numPointShadows!==y||P.numSpotShadows!==T||P.numSpotMaps!==L||P.numLightProbes!==E)&&(i.directional.length=p,i.spot.length=x,i.rectArea.length=f,i.point.length=g,i.hemi.length=m,i.directionalShadow.length=b,i.directionalShadowMap.length=b,i.pointShadow.length=y,i.pointShadowMap.length=y,i.spotShadow.length=T,i.spotShadowMap.length=T,i.directionalShadowMatrix.length=b,i.pointShadowMatrix.length=y,i.spotLightMatrix.length=T+L-A,i.spotLightMap.length=L,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=E,P.directionalLength=p,P.pointLength=g,P.spotLength=x,P.rectAreaLength=f,P.hemiLength=m,P.numDirectionalShadows=b,P.numPointShadows=y,P.numSpotShadows=T,P.numSpotMaps=L,P.numLightProbes=E,i.version=F_++)}function l(c,u){let h=0,d=0,p=0,g=0,x=0,f=u.matrixWorldInverse;for(let m=0,b=c.length;m<b;m++){let y=c[m];if(y.isDirectionalLight){let T=i.directional[h];T.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(f),h++}else if(y.isSpotLight){let T=i.spot[p];T.position.setFromMatrixPosition(y.matrixWorld),T.position.applyMatrix4(f),T.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(f),p++}else if(y.isRectAreaLight){let T=i.rectArea[g];T.position.setFromMatrixPosition(y.matrixWorld),T.position.applyMatrix4(f),o.identity(),r.copy(y.matrixWorld),r.premultiply(f),o.extractRotation(r),T.halfWidth.set(y.width*.5,0,0),T.halfHeight.set(0,y.height*.5,0),T.halfWidth.applyMatrix4(o),T.halfHeight.applyMatrix4(o),g++}else if(y.isPointLight){let T=i.point[d];T.position.setFromMatrixPosition(y.matrixWorld),T.position.applyMatrix4(f),d++}else if(y.isHemisphereLight){let T=i.hemi[x];T.direction.setFromMatrixPosition(y.matrixWorld),T.direction.transformDirection(f),x++}}}return{setup:a,setupView:l,state:i}}function Bf(n){let e=new z_(n),t=[],i=[];function s(u){c.camera=u,t.length=0,i.length=0}function r(u){t.push(u)}function o(u){i.push(u)}function a(){e.setup(t)}function l(u){e.setupView(t,u)}let c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function k_(n){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new Bf(n),e.set(s,[a])):r>=o.length?(a=new Bf(n),o.push(a)):a=o[r],a}function i(){e=new WeakMap}return{get:t,dispose:i}}var Cu=class extends vi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Yg,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Ru=class extends vi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},H_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,V_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function G_(n,e,t){let i=new Jr,s=new se,r=new se,o=new ot,a=new Cu({depthPacking:jg}),l=new Ru,c={},u=t.maxTextureSize,h={[Di]:Gt,[Gt]:Di,[bn]:bn},d=new rt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new se},radius:{value:4}},vertexShader:H_,fragmentShader:V_}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let g=new bt;g.setAttribute("position",new Wt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new Oe(g,d),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Jf;let m=this.type;this.render=function(A,E,P){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||A.length===0)return;let k=n.getRenderTarget(),v=n.getActiveCubeFace(),S=n.getActiveMipmapLevel(),U=n.state;U.setBlending(Mt),U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);let F=m!==fi&&this.type===fi,V=m===fi&&this.type!==fi;for(let J=0,H=A.length;J<H;J++){let ee=A[J],W=ee.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",ee,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;s.copy(W.mapSize);let ie=W.getFrameExtents();if(s.multiply(ie),r.copy(W.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/ie.x),s.x=r.x*ie.x,W.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/ie.y),s.y=r.y*ie.y,W.mapSize.y=r.y)),W.map===null||F===!0||V===!0){let ge=this.type!==fi?{minFilter:_t,magFilter:_t}:{};W.map!==null&&W.map.dispose(),W.map=new ht(s.x,s.y,ge),W.map.texture.name=ee.name+".shadowMap",W.camera.updateProjectionMatrix()}n.setRenderTarget(W.map),n.clear();let ue=W.getViewportCount();for(let ge=0;ge<ue;ge++){let ke=W.getViewport(ge);o.set(r.x*ke.x,r.y*ke.y,r.x*ke.z,r.y*ke.w),U.viewport(o),W.updateMatrices(ee,ge),i=W.getFrustum(),T(E,P,W.camera,ee,this.type)}W.isPointLightShadow!==!0&&this.type===fi&&b(W,P),W.needsUpdate=!1}m=this.type,f.needsUpdate=!1,n.setRenderTarget(k,v,S)};function b(A,E){let P=e.update(x);d.defines.VSM_SAMPLES!==A.blurSamples&&(d.defines.VSM_SAMPLES=A.blurSamples,p.defines.VSM_SAMPLES=A.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new ht(s.x,s.y)),d.uniforms.shadow_pass.value=A.map.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,n.setRenderTarget(A.mapPass),n.clear(),n.renderBufferDirect(E,null,P,d,x,null),p.uniforms.shadow_pass.value=A.mapPass.texture,p.uniforms.resolution.value=A.mapSize,p.uniforms.radius.value=A.radius,n.setRenderTarget(A.map),n.clear(),n.renderBufferDirect(E,null,P,p,x,null)}function y(A,E,P,k){let v=null,S=P.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(S!==void 0)v=S;else if(v=P.isPointLight===!0?l:a,n.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){let U=v.uuid,F=E.uuid,V=c[U];V===void 0&&(V={},c[U]=V);let J=V[F];J===void 0&&(J=v.clone(),V[F]=J,E.addEventListener("dispose",L)),v=J}if(v.visible=E.visible,v.wireframe=E.wireframe,k===fi?v.side=E.shadowSide!==null?E.shadowSide:E.side:v.side=E.shadowSide!==null?E.shadowSide:h[E.side],v.alphaMap=E.alphaMap,v.alphaTest=E.alphaTest,v.map=E.map,v.clipShadows=E.clipShadows,v.clippingPlanes=E.clippingPlanes,v.clipIntersection=E.clipIntersection,v.displacementMap=E.displacementMap,v.displacementScale=E.displacementScale,v.displacementBias=E.displacementBias,v.wireframeLinewidth=E.wireframeLinewidth,v.linewidth=E.linewidth,P.isPointLight===!0&&v.isMeshDistanceMaterial===!0){let U=n.properties.get(v);U.light=P}return v}function T(A,E,P,k,v){if(A.visible===!1)return;if(A.layers.test(E.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&v===fi)&&(!A.frustumCulled||i.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,A.matrixWorld);let F=e.update(A),V=A.material;if(Array.isArray(V)){let J=F.groups;for(let H=0,ee=J.length;H<ee;H++){let W=J[H],ie=V[W.materialIndex];if(ie&&ie.visible){let ue=y(A,ie,k,v);A.onBeforeShadow(n,A,E,P,F,ue,W),n.renderBufferDirect(P,null,F,ue,A,W),A.onAfterShadow(n,A,E,P,F,ue,W)}}}else if(V.visible){let J=y(A,V,k,v);A.onBeforeShadow(n,A,E,P,F,J,null),n.renderBufferDirect(P,null,F,J,A,null),A.onAfterShadow(n,A,E,P,F,J,null)}}let U=A.children;for(let F=0,V=U.length;F<V;F++)T(U[F],E,P,k,v)}function L(A){A.target.removeEventListener("dispose",L);for(let P in c){let k=c[P],v=A.target.uuid;v in k&&(k[v].dispose(),delete k[v])}}}var W_={[Dc]:Nc,[Uc]:Bc,[Oc]:zc,[Ys]:Fc,[Nc]:Dc,[Bc]:Uc,[zc]:Oc,[Fc]:Ys};function X_(n){function e(){let I=!1,ce=new ot,G=null,Z=new ot(0,0,0,0);return{setMask:function(fe){G!==fe&&!I&&(n.colorMask(fe,fe,fe,fe),G=fe)},setLocked:function(fe){I=fe},setClear:function(fe,me,je,vt,en){en===!0&&(fe*=vt,me*=vt,je*=vt),ce.set(fe,me,je,vt),Z.equals(ce)===!1&&(n.clearColor(fe,me,je,vt),Z.copy(ce))},reset:function(){I=!1,G=null,Z.set(-1,0,0,0)}}}function t(){let I=!1,ce=!1,G=null,Z=null,fe=null;return{setReversed:function(me){ce=me},setTest:function(me){me?ve(n.DEPTH_TEST):le(n.DEPTH_TEST)},setMask:function(me){G!==me&&!I&&(n.depthMask(me),G=me)},setFunc:function(me){if(ce&&(me=W_[me]),Z!==me){switch(me){case Dc:n.depthFunc(n.NEVER);break;case Nc:n.depthFunc(n.ALWAYS);break;case Uc:n.depthFunc(n.LESS);break;case Ys:n.depthFunc(n.LEQUAL);break;case Oc:n.depthFunc(n.EQUAL);break;case Fc:n.depthFunc(n.GEQUAL);break;case Bc:n.depthFunc(n.GREATER);break;case zc:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Z=me}},setLocked:function(me){I=me},setClear:function(me){fe!==me&&(n.clearDepth(me),fe=me)},reset:function(){I=!1,G=null,Z=null,fe=null}}}function i(){let I=!1,ce=null,G=null,Z=null,fe=null,me=null,je=null,vt=null,en=null;return{setTest:function(Qe){I||(Qe?ve(n.STENCIL_TEST):le(n.STENCIL_TEST))},setMask:function(Qe){ce!==Qe&&!I&&(n.stencilMask(Qe),ce=Qe)},setFunc:function(Qe,tn,ei){(G!==Qe||Z!==tn||fe!==ei)&&(n.stencilFunc(Qe,tn,ei),G=Qe,Z=tn,fe=ei)},setOp:function(Qe,tn,ei){(me!==Qe||je!==tn||vt!==ei)&&(n.stencilOp(Qe,tn,ei),me=Qe,je=tn,vt=ei)},setLocked:function(Qe){I=Qe},setClear:function(Qe){en!==Qe&&(n.clearStencil(Qe),en=Qe)},reset:function(){I=!1,ce=null,G=null,Z=null,fe=null,me=null,je=null,vt=null,en=null}}}let s=new e,r=new t,o=new i,a=new WeakMap,l=new WeakMap,c={},u={},h=new WeakMap,d=[],p=null,g=!1,x=null,f=null,m=null,b=null,y=null,T=null,L=null,A=new Me(0,0,0),E=0,P=!1,k=null,v=null,S=null,U=null,F=null,V=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),J=!1,H=0,ee=n.getParameter(n.VERSION);ee.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(ee)[1]),J=H>=1):ee.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(ee)[1]),J=H>=2);let W=null,ie={},ue=n.getParameter(n.SCISSOR_BOX),ge=n.getParameter(n.VIEWPORT),ke=new ot().fromArray(ue),Ye=new ot().fromArray(ge);function q(I,ce,G,Z){let fe=new Uint8Array(4),me=n.createTexture();n.bindTexture(I,me),n.texParameteri(I,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(I,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let je=0;je<G;je++)I===n.TEXTURE_3D||I===n.TEXTURE_2D_ARRAY?n.texImage3D(ce,0,n.RGBA,1,1,Z,0,n.RGBA,n.UNSIGNED_BYTE,fe):n.texImage2D(ce+je,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,fe);return me}let Q={};Q[n.TEXTURE_2D]=q(n.TEXTURE_2D,n.TEXTURE_2D,1),Q[n.TEXTURE_CUBE_MAP]=q(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Q[n.TEXTURE_2D_ARRAY]=q(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Q[n.TEXTURE_3D]=q(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),r.setClear(1),o.setClear(0),ve(n.DEPTH_TEST),r.setFunc(Ys),He(!1),Xe(Wd),ve(n.CULL_FACE),R(Mt);function ve(I){c[I]!==!0&&(n.enable(I),c[I]=!0)}function le(I){c[I]!==!1&&(n.disable(I),c[I]=!1)}function Ee(I,ce){return u[I]!==ce?(n.bindFramebuffer(I,ce),u[I]=ce,I===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=ce),I===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=ce),!0):!1}function Te(I,ce){let G=d,Z=!1;if(I){G=h.get(ce),G===void 0&&(G=[],h.set(ce,G));let fe=I.textures;if(G.length!==fe.length||G[0]!==n.COLOR_ATTACHMENT0){for(let me=0,je=fe.length;me<je;me++)G[me]=n.COLOR_ATTACHMENT0+me;G.length=fe.length,Z=!0}}else G[0]!==n.BACK&&(G[0]=n.BACK,Z=!0);Z&&n.drawBuffers(G)}function Ue(I){return p!==I?(n.useProgram(I),p=I,!0):!1}let Ke={[Tn]:n.FUNC_ADD,[Rg]:n.FUNC_SUBTRACT,[Pg]:n.FUNC_REVERSE_SUBTRACT};Ke[Lg]=n.MIN,Ke[Ig]=n.MAX;let We={[rr]:n.ZERO,[Dg]:n.ONE,[Ng]:n.SRC_COLOR,[Lc]:n.SRC_ALPHA,[Bg]:n.SRC_ALPHA_SATURATE,[Qa]:n.DST_COLOR,[Ka]:n.DST_ALPHA,[Ug]:n.ONE_MINUS_SRC_COLOR,[Ic]:n.ONE_MINUS_SRC_ALPHA,[Fg]:n.ONE_MINUS_DST_COLOR,[Og]:n.ONE_MINUS_DST_ALPHA,[zg]:n.CONSTANT_COLOR,[kg]:n.ONE_MINUS_CONSTANT_COLOR,[Hg]:n.CONSTANT_ALPHA,[Vg]:n.ONE_MINUS_CONSTANT_ALPHA};function R(I,ce,G,Z,fe,me,je,vt,en,Qe){if(I===Mt){g===!0&&(le(n.BLEND),g=!1);return}if(g===!1&&(ve(n.BLEND),g=!0),I!==nh){if(I!==x||Qe!==P){if((f!==Tn||y!==Tn)&&(n.blendEquation(n.FUNC_ADD),f=Tn,y=Tn),Qe)switch(I){case Gs:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case as:n.blendFunc(n.ONE,n.ONE);break;case Xd:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case qd:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case Gs:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case as:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Xd:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case qd:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}m=null,b=null,T=null,L=null,A.set(0,0,0),E=0,x=I,P=Qe}return}fe=fe||ce,me=me||G,je=je||Z,(ce!==f||fe!==y)&&(n.blendEquationSeparate(Ke[ce],Ke[fe]),f=ce,y=fe),(G!==m||Z!==b||me!==T||je!==L)&&(n.blendFuncSeparate(We[G],We[Z],We[me],We[je]),m=G,b=Z,T=me,L=je),(vt.equals(A)===!1||en!==E)&&(n.blendColor(vt.r,vt.g,vt.b,en),A.copy(vt),E=en),x=I,P=!1}function It(I,ce){I.side===bn?le(n.CULL_FACE):ve(n.CULL_FACE);let G=I.side===Gt;ce&&(G=!G),He(G),I.blending===Gs&&I.transparent===!1?R(Mt):R(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),r.setFunc(I.depthFunc),r.setTest(I.depthTest),r.setMask(I.depthWrite),s.setMask(I.colorWrite);let Z=I.stencilWrite;o.setTest(Z),Z&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),it(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?ve(n.SAMPLE_ALPHA_TO_COVERAGE):le(n.SAMPLE_ALPHA_TO_COVERAGE)}function He(I){k!==I&&(I?n.frontFace(n.CW):n.frontFace(n.CCW),k=I)}function Xe(I){I!==Ag?(ve(n.CULL_FACE),I!==v&&(I===Wd?n.cullFace(n.BACK):I===Cg?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):le(n.CULL_FACE),v=I}function Ce(I){I!==S&&(J&&n.lineWidth(I),S=I)}function it(I,ce,G){I?(ve(n.POLYGON_OFFSET_FILL),(U!==ce||F!==G)&&(n.polygonOffset(ce,G),U=ce,F=G)):le(n.POLYGON_OFFSET_FILL)}function Re(I){I?ve(n.SCISSOR_TEST):le(n.SCISSOR_TEST)}function w(I){I===void 0&&(I=n.TEXTURE0+V-1),W!==I&&(n.activeTexture(I),W=I)}function _(I,ce,G){G===void 0&&(W===null?G=n.TEXTURE0+V-1:G=W);let Z=ie[G];Z===void 0&&(Z={type:void 0,texture:void 0},ie[G]=Z),(Z.type!==I||Z.texture!==ce)&&(W!==G&&(n.activeTexture(G),W=G),n.bindTexture(I,ce||Q[I]),Z.type=I,Z.texture=ce)}function O(){let I=ie[W];I!==void 0&&I.type!==void 0&&(n.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function j(){try{n.compressedTexImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function K(){try{n.compressedTexImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Y(){try{n.texSubImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function _e(){try{n.texSubImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function re(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function he(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ve(){try{n.texStorage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function $(){try{n.texStorage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function de(){try{n.texImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Pe(){try{n.texImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Le(I){ke.equals(I)===!1&&(n.scissor(I.x,I.y,I.z,I.w),ke.copy(I))}function xe(I){Ye.equals(I)===!1&&(n.viewport(I.x,I.y,I.z,I.w),Ye.copy(I))}function qe(I,ce){let G=l.get(ce);G===void 0&&(G=new WeakMap,l.set(ce,G));let Z=G.get(I);Z===void 0&&(Z=n.getUniformBlockIndex(ce,I.name),G.set(I,Z))}function Ne(I,ce){let Z=l.get(ce).get(I);a.get(ce)!==Z&&(n.uniformBlockBinding(ce,Z,I.__bindingPointIndex),a.set(ce,Z))}function Ze(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),c={},W=null,ie={},u={},h=new WeakMap,d=[],p=null,g=!1,x=null,f=null,m=null,b=null,y=null,T=null,L=null,A=new Me(0,0,0),E=0,P=!1,k=null,v=null,S=null,U=null,F=null,ke.set(0,0,n.canvas.width,n.canvas.height),Ye.set(0,0,n.canvas.width,n.canvas.height),s.reset(),r.reset(),o.reset()}return{buffers:{color:s,depth:r,stencil:o},enable:ve,disable:le,bindFramebuffer:Ee,drawBuffers:Te,useProgram:Ue,setBlending:R,setMaterial:It,setFlipSided:He,setCullFace:Xe,setLineWidth:Ce,setPolygonOffset:it,setScissorTest:Re,activeTexture:w,bindTexture:_,unbindTexture:O,compressedTexImage2D:j,compressedTexImage3D:K,texImage2D:de,texImage3D:Pe,updateUBOMapping:qe,uniformBlockBinding:Ne,texStorage2D:Ve,texStorage3D:$,texSubImage2D:Y,texSubImage3D:_e,compressedTexSubImage2D:re,compressedTexSubImage3D:he,scissor:Le,viewport:xe,reset:Ze}}function zf(n,e,t,i){let s=q_(i);switch(t){case np:return n*e;case sp:return n*e;case rp:return n*e*2;case op:return n*e/s.components*s.byteLength;case hh:return n*e/s.components*s.byteLength;case ap:return n*e*2/s.components*s.byteLength;case dh:return n*e*2/s.components*s.byteLength;case ip:return n*e*3/s.components*s.byteLength;case pn:return n*e*4/s.components*s.byteLength;case fh:return n*e*4/s.components*s.byteLength;case xa:case ya:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case _a:case Sa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Wc:case qc:return Math.max(n,16)*Math.max(e,8)/4;case Gc:case Xc:return Math.max(n,8)*Math.max(e,8)/2;case Yc:case jc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Zc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Jc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Kc:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Qc:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case $c:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case eu:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case tu:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case nu:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case iu:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case su:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case ru:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case ou:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case au:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case lu:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case cu:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Ma:case uu:case hu:return Math.ceil(n/4)*Math.ceil(e/4)*16;case lp:case du:return Math.ceil(n/4)*Math.ceil(e/4)*8;case fu:case pu:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function q_(n){switch(n){case On:case $f:return{byteLength:1,components:1};case qr:case ep:case Et:return{byteLength:2,components:1};case ch:case uh:return{byteLength:2,components:4};case ls:case lh:case mi:return{byteLength:4,components:1};case tp:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function Y_(n,e,t,i,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new se,u=new WeakMap,h,d=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(w,_){return p?new OffscreenCanvas(w,_):Yr("canvas")}function x(w,_,O){let j=1,K=Re(w);if((K.width>O||K.height>O)&&(j=O/Math.max(K.width,K.height)),j<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){let Y=Math.floor(j*K.width),_e=Math.floor(j*K.height);h===void 0&&(h=g(Y,_e));let re=_?g(Y,_e):h;return re.width=Y,re.height=_e,re.getContext("2d").drawImage(w,0,0,Y,_e),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+Y+"x"+_e+")."),re}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),w;return w}function f(w){return w.generateMipmaps&&w.minFilter!==_t&&w.minFilter!==fn}function m(w){n.generateMipmap(w)}function b(w,_,O,j,K=!1){if(w!==null){if(n[w]!==void 0)return n[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let Y=_;if(_===n.RED&&(O===n.FLOAT&&(Y=n.R32F),O===n.HALF_FLOAT&&(Y=n.R16F),O===n.UNSIGNED_BYTE&&(Y=n.R8)),_===n.RED_INTEGER&&(O===n.UNSIGNED_BYTE&&(Y=n.R8UI),O===n.UNSIGNED_SHORT&&(Y=n.R16UI),O===n.UNSIGNED_INT&&(Y=n.R32UI),O===n.BYTE&&(Y=n.R8I),O===n.SHORT&&(Y=n.R16I),O===n.INT&&(Y=n.R32I)),_===n.RG&&(O===n.FLOAT&&(Y=n.RG32F),O===n.HALF_FLOAT&&(Y=n.RG16F),O===n.UNSIGNED_BYTE&&(Y=n.RG8)),_===n.RG_INTEGER&&(O===n.UNSIGNED_BYTE&&(Y=n.RG8UI),O===n.UNSIGNED_SHORT&&(Y=n.RG16UI),O===n.UNSIGNED_INT&&(Y=n.RG32UI),O===n.BYTE&&(Y=n.RG8I),O===n.SHORT&&(Y=n.RG16I),O===n.INT&&(Y=n.RG32I)),_===n.RGB_INTEGER&&(O===n.UNSIGNED_BYTE&&(Y=n.RGB8UI),O===n.UNSIGNED_SHORT&&(Y=n.RGB16UI),O===n.UNSIGNED_INT&&(Y=n.RGB32UI),O===n.BYTE&&(Y=n.RGB8I),O===n.SHORT&&(Y=n.RGB16I),O===n.INT&&(Y=n.RGB32I)),_===n.RGBA_INTEGER&&(O===n.UNSIGNED_BYTE&&(Y=n.RGBA8UI),O===n.UNSIGNED_SHORT&&(Y=n.RGBA16UI),O===n.UNSIGNED_INT&&(Y=n.RGBA32UI),O===n.BYTE&&(Y=n.RGBA8I),O===n.SHORT&&(Y=n.RGBA16I),O===n.INT&&(Y=n.RGBA32I)),_===n.RGB&&O===n.UNSIGNED_INT_5_9_9_9_REV&&(Y=n.RGB9_E5),_===n.RGBA){let _e=K?wa:Je.getTransfer(j);O===n.FLOAT&&(Y=n.RGBA32F),O===n.HALF_FLOAT&&(Y=n.RGBA16F),O===n.UNSIGNED_BYTE&&(Y=_e===at?n.SRGB8_ALPHA8:n.RGBA8),O===n.UNSIGNED_SHORT_4_4_4_4&&(Y=n.RGBA4),O===n.UNSIGNED_SHORT_5_5_5_1&&(Y=n.RGB5_A1)}return(Y===n.R16F||Y===n.R32F||Y===n.RG16F||Y===n.RG32F||Y===n.RGBA16F||Y===n.RGBA32F)&&e.get("EXT_color_buffer_float"),Y}function y(w,_){let O;return w?_===null||_===ls||_===Ni?O=n.DEPTH24_STENCIL8:_===mi?O=n.DEPTH32F_STENCIL8:_===qr&&(O=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===ls||_===Ni?O=n.DEPTH_COMPONENT24:_===mi?O=n.DEPTH_COMPONENT32F:_===qr&&(O=n.DEPTH_COMPONENT16),O}function T(w,_){return f(w)===!0||w.isFramebufferTexture&&w.minFilter!==_t&&w.minFilter!==fn?Math.log2(Math.max(_.width,_.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?_.mipmaps.length:1}function L(w){let _=w.target;_.removeEventListener("dispose",L),E(_),_.isVideoTexture&&u.delete(_)}function A(w){let _=w.target;_.removeEventListener("dispose",A),k(_)}function E(w){let _=i.get(w);if(_.__webglInit===void 0)return;let O=w.source,j=d.get(O);if(j){let K=j[_.__cacheKey];K.usedTimes--,K.usedTimes===0&&P(w),Object.keys(j).length===0&&d.delete(O)}i.remove(w)}function P(w){let _=i.get(w);n.deleteTexture(_.__webglTexture);let O=w.source,j=d.get(O);delete j[_.__cacheKey],o.memory.textures--}function k(w){let _=i.get(w);if(w.depthTexture&&w.depthTexture.dispose(),w.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(_.__webglFramebuffer[j]))for(let K=0;K<_.__webglFramebuffer[j].length;K++)n.deleteFramebuffer(_.__webglFramebuffer[j][K]);else n.deleteFramebuffer(_.__webglFramebuffer[j]);_.__webglDepthbuffer&&n.deleteRenderbuffer(_.__webglDepthbuffer[j])}else{if(Array.isArray(_.__webglFramebuffer))for(let j=0;j<_.__webglFramebuffer.length;j++)n.deleteFramebuffer(_.__webglFramebuffer[j]);else n.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&n.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&n.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let j=0;j<_.__webglColorRenderbuffer.length;j++)_.__webglColorRenderbuffer[j]&&n.deleteRenderbuffer(_.__webglColorRenderbuffer[j]);_.__webglDepthRenderbuffer&&n.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let O=w.textures;for(let j=0,K=O.length;j<K;j++){let Y=i.get(O[j]);Y.__webglTexture&&(n.deleteTexture(Y.__webglTexture),o.memory.textures--),i.remove(O[j])}i.remove(w)}let v=0;function S(){v=0}function U(){let w=v;return w>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+s.maxTextures),v+=1,w}function F(w){let _=[];return _.push(w.wrapS),_.push(w.wrapT),_.push(w.wrapR||0),_.push(w.magFilter),_.push(w.minFilter),_.push(w.anisotropy),_.push(w.internalFormat),_.push(w.format),_.push(w.type),_.push(w.generateMipmaps),_.push(w.premultiplyAlpha),_.push(w.flipY),_.push(w.unpackAlignment),_.push(w.colorSpace),_.join()}function V(w,_){let O=i.get(w);if(w.isVideoTexture&&Ce(w),w.isRenderTargetTexture===!1&&w.version>0&&O.__version!==w.version){let j=w.image;if(j===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Ye(O,w,_);return}}t.bindTexture(n.TEXTURE_2D,O.__webglTexture,n.TEXTURE0+_)}function J(w,_){let O=i.get(w);if(w.version>0&&O.__version!==w.version){Ye(O,w,_);return}t.bindTexture(n.TEXTURE_2D_ARRAY,O.__webglTexture,n.TEXTURE0+_)}function H(w,_){let O=i.get(w);if(w.version>0&&O.__version!==w.version){Ye(O,w,_);return}t.bindTexture(n.TEXTURE_3D,O.__webglTexture,n.TEXTURE0+_)}function ee(w,_){let O=i.get(w);if(w.version>0&&O.__version!==w.version){q(O,w,_);return}t.bindTexture(n.TEXTURE_CUBE_MAP,O.__webglTexture,n.TEXTURE0+_)}let W={[En]:n.REPEAT,[rs]:n.CLAMP_TO_EDGE,[Vc]:n.MIRRORED_REPEAT},ie={[_t]:n.NEAREST,[qg]:n.NEAREST_MIPMAP_NEAREST,[Yo]:n.NEAREST_MIPMAP_LINEAR,[fn]:n.LINEAR,[Zl]:n.LINEAR_MIPMAP_NEAREST,[os]:n.LINEAR_MIPMAP_LINEAR},ue={[Jg]:n.NEVER,[nv]:n.ALWAYS,[Kg]:n.LESS,[cp]:n.LEQUAL,[Qg]:n.EQUAL,[tv]:n.GEQUAL,[$g]:n.GREATER,[ev]:n.NOTEQUAL};function ge(w,_){if(_.type===mi&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===fn||_.magFilter===Zl||_.magFilter===Yo||_.magFilter===os||_.minFilter===fn||_.minFilter===Zl||_.minFilter===Yo||_.minFilter===os)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(w,n.TEXTURE_WRAP_S,W[_.wrapS]),n.texParameteri(w,n.TEXTURE_WRAP_T,W[_.wrapT]),(w===n.TEXTURE_3D||w===n.TEXTURE_2D_ARRAY)&&n.texParameteri(w,n.TEXTURE_WRAP_R,W[_.wrapR]),n.texParameteri(w,n.TEXTURE_MAG_FILTER,ie[_.magFilter]),n.texParameteri(w,n.TEXTURE_MIN_FILTER,ie[_.minFilter]),_.compareFunction&&(n.texParameteri(w,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(w,n.TEXTURE_COMPARE_FUNC,ue[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===_t||_.minFilter!==Yo&&_.minFilter!==os||_.type===mi&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||i.get(_).__currentAnisotropy){let O=e.get("EXT_texture_filter_anisotropic");n.texParameterf(w,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),i.get(_).__currentAnisotropy=_.anisotropy}}}function ke(w,_){let O=!1;w.__webglInit===void 0&&(w.__webglInit=!0,_.addEventListener("dispose",L));let j=_.source,K=d.get(j);K===void 0&&(K={},d.set(j,K));let Y=F(_);if(Y!==w.__cacheKey){K[Y]===void 0&&(K[Y]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,O=!0),K[Y].usedTimes++;let _e=K[w.__cacheKey];_e!==void 0&&(K[w.__cacheKey].usedTimes--,_e.usedTimes===0&&P(_)),w.__cacheKey=Y,w.__webglTexture=K[Y].texture}return O}function Ye(w,_,O){let j=n.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(j=n.TEXTURE_2D_ARRAY),_.isData3DTexture&&(j=n.TEXTURE_3D);let K=ke(w,_),Y=_.source;t.bindTexture(j,w.__webglTexture,n.TEXTURE0+O);let _e=i.get(Y);if(Y.version!==_e.__version||K===!0){t.activeTexture(n.TEXTURE0+O);let re=Je.getPrimaries(Je.workingColorSpace),he=_.colorSpace===Li?null:Je.getPrimaries(_.colorSpace),Ve=_.colorSpace===Li||re===he?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,_.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,_.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ve);let $=x(_.image,!1,s.maxTextureSize);$=it(_,$);let de=r.convert(_.format,_.colorSpace),Pe=r.convert(_.type),Le=b(_.internalFormat,de,Pe,_.colorSpace,_.isVideoTexture);ge(j,_);let xe,qe=_.mipmaps,Ne=_.isVideoTexture!==!0,Ze=_e.__version===void 0||K===!0,I=Y.dataReady,ce=T(_,$);if(_.isDepthTexture)Le=y(_.format===Ui,_.type),Ze&&(Ne?t.texStorage2D(n.TEXTURE_2D,1,Le,$.width,$.height):t.texImage2D(n.TEXTURE_2D,0,Le,$.width,$.height,0,de,Pe,null));else if(_.isDataTexture)if(qe.length>0){Ne&&Ze&&t.texStorage2D(n.TEXTURE_2D,ce,Le,qe[0].width,qe[0].height);for(let G=0,Z=qe.length;G<Z;G++)xe=qe[G],Ne?I&&t.texSubImage2D(n.TEXTURE_2D,G,0,0,xe.width,xe.height,de,Pe,xe.data):t.texImage2D(n.TEXTURE_2D,G,Le,xe.width,xe.height,0,de,Pe,xe.data);_.generateMipmaps=!1}else Ne?(Ze&&t.texStorage2D(n.TEXTURE_2D,ce,Le,$.width,$.height),I&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,$.width,$.height,de,Pe,$.data)):t.texImage2D(n.TEXTURE_2D,0,Le,$.width,$.height,0,de,Pe,$.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){Ne&&Ze&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ce,Le,qe[0].width,qe[0].height,$.depth);for(let G=0,Z=qe.length;G<Z;G++)if(xe=qe[G],_.format!==pn)if(de!==null)if(Ne){if(I)if(_.layerUpdates.size>0){let fe=zf(xe.width,xe.height,_.format,_.type);for(let me of _.layerUpdates){let je=xe.data.subarray(me*fe/xe.data.BYTES_PER_ELEMENT,(me+1)*fe/xe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,G,0,0,me,xe.width,xe.height,1,de,je,0,0)}_.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,G,0,0,0,xe.width,xe.height,$.depth,de,xe.data,0,0)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,G,Le,xe.width,xe.height,$.depth,0,xe.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ne?I&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,G,0,0,0,xe.width,xe.height,$.depth,de,Pe,xe.data):t.texImage3D(n.TEXTURE_2D_ARRAY,G,Le,xe.width,xe.height,$.depth,0,de,Pe,xe.data)}else{Ne&&Ze&&t.texStorage2D(n.TEXTURE_2D,ce,Le,qe[0].width,qe[0].height);for(let G=0,Z=qe.length;G<Z;G++)xe=qe[G],_.format!==pn?de!==null?Ne?I&&t.compressedTexSubImage2D(n.TEXTURE_2D,G,0,0,xe.width,xe.height,de,xe.data):t.compressedTexImage2D(n.TEXTURE_2D,G,Le,xe.width,xe.height,0,xe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ne?I&&t.texSubImage2D(n.TEXTURE_2D,G,0,0,xe.width,xe.height,de,Pe,xe.data):t.texImage2D(n.TEXTURE_2D,G,Le,xe.width,xe.height,0,de,Pe,xe.data)}else if(_.isDataArrayTexture)if(Ne){if(Ze&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ce,Le,$.width,$.height,$.depth),I)if(_.layerUpdates.size>0){let G=zf($.width,$.height,_.format,_.type);for(let Z of _.layerUpdates){let fe=$.data.subarray(Z*G/$.data.BYTES_PER_ELEMENT,(Z+1)*G/$.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Z,$.width,$.height,1,de,Pe,fe)}_.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,$.width,$.height,$.depth,de,Pe,$.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Le,$.width,$.height,$.depth,0,de,Pe,$.data);else if(_.isData3DTexture)Ne?(Ze&&t.texStorage3D(n.TEXTURE_3D,ce,Le,$.width,$.height,$.depth),I&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,$.width,$.height,$.depth,de,Pe,$.data)):t.texImage3D(n.TEXTURE_3D,0,Le,$.width,$.height,$.depth,0,de,Pe,$.data);else if(_.isFramebufferTexture){if(Ze)if(Ne)t.texStorage2D(n.TEXTURE_2D,ce,Le,$.width,$.height);else{let G=$.width,Z=$.height;for(let fe=0;fe<ce;fe++)t.texImage2D(n.TEXTURE_2D,fe,Le,G,Z,0,de,Pe,null),G>>=1,Z>>=1}}else if(qe.length>0){if(Ne&&Ze){let G=Re(qe[0]);t.texStorage2D(n.TEXTURE_2D,ce,Le,G.width,G.height)}for(let G=0,Z=qe.length;G<Z;G++)xe=qe[G],Ne?I&&t.texSubImage2D(n.TEXTURE_2D,G,0,0,de,Pe,xe):t.texImage2D(n.TEXTURE_2D,G,Le,de,Pe,xe);_.generateMipmaps=!1}else if(Ne){if(Ze){let G=Re($);t.texStorage2D(n.TEXTURE_2D,ce,Le,G.width,G.height)}I&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,de,Pe,$)}else t.texImage2D(n.TEXTURE_2D,0,Le,de,Pe,$);f(_)&&m(j),_e.__version=Y.version,_.onUpdate&&_.onUpdate(_)}w.__version=_.version}function q(w,_,O){if(_.image.length!==6)return;let j=ke(w,_),K=_.source;t.bindTexture(n.TEXTURE_CUBE_MAP,w.__webglTexture,n.TEXTURE0+O);let Y=i.get(K);if(K.version!==Y.__version||j===!0){t.activeTexture(n.TEXTURE0+O);let _e=Je.getPrimaries(Je.workingColorSpace),re=_.colorSpace===Li?null:Je.getPrimaries(_.colorSpace),he=_.colorSpace===Li||_e===re?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,_.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,_.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,he);let Ve=_.isCompressedTexture||_.image[0].isCompressedTexture,$=_.image[0]&&_.image[0].isDataTexture,de=[];for(let Z=0;Z<6;Z++)!Ve&&!$?de[Z]=x(_.image[Z],!0,s.maxCubemapSize):de[Z]=$?_.image[Z].image:_.image[Z],de[Z]=it(_,de[Z]);let Pe=de[0],Le=r.convert(_.format,_.colorSpace),xe=r.convert(_.type),qe=b(_.internalFormat,Le,xe,_.colorSpace),Ne=_.isVideoTexture!==!0,Ze=Y.__version===void 0||j===!0,I=K.dataReady,ce=T(_,Pe);ge(n.TEXTURE_CUBE_MAP,_);let G;if(Ve){Ne&&Ze&&t.texStorage2D(n.TEXTURE_CUBE_MAP,ce,qe,Pe.width,Pe.height);for(let Z=0;Z<6;Z++){G=de[Z].mipmaps;for(let fe=0;fe<G.length;fe++){let me=G[fe];_.format!==pn?Le!==null?Ne?I&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,fe,0,0,me.width,me.height,Le,me.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,fe,qe,me.width,me.height,0,me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ne?I&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,fe,0,0,me.width,me.height,Le,xe,me.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,fe,qe,me.width,me.height,0,Le,xe,me.data)}}}else{if(G=_.mipmaps,Ne&&Ze){G.length>0&&ce++;let Z=Re(de[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,ce,qe,Z.width,Z.height)}for(let Z=0;Z<6;Z++)if($){Ne?I&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,de[Z].width,de[Z].height,Le,xe,de[Z].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,qe,de[Z].width,de[Z].height,0,Le,xe,de[Z].data);for(let fe=0;fe<G.length;fe++){let je=G[fe].image[Z].image;Ne?I&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,fe+1,0,0,je.width,je.height,Le,xe,je.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,fe+1,qe,je.width,je.height,0,Le,xe,je.data)}}else{Ne?I&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,Le,xe,de[Z]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,qe,Le,xe,de[Z]);for(let fe=0;fe<G.length;fe++){let me=G[fe];Ne?I&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,fe+1,0,0,Le,xe,me.image[Z]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,fe+1,qe,Le,xe,me.image[Z])}}}f(_)&&m(n.TEXTURE_CUBE_MAP),Y.__version=K.version,_.onUpdate&&_.onUpdate(_)}w.__version=_.version}function Q(w,_,O,j,K,Y){let _e=r.convert(O.format,O.colorSpace),re=r.convert(O.type),he=b(O.internalFormat,_e,re,O.colorSpace);if(!i.get(_).__hasExternalTextures){let $=Math.max(1,_.width>>Y),de=Math.max(1,_.height>>Y);K===n.TEXTURE_3D||K===n.TEXTURE_2D_ARRAY?t.texImage3D(K,Y,he,$,de,_.depth,0,_e,re,null):t.texImage2D(K,Y,he,$,de,0,_e,re,null)}t.bindFramebuffer(n.FRAMEBUFFER,w),Xe(_)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,j,K,i.get(O).__webglTexture,0,He(_)):(K===n.TEXTURE_2D||K>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,j,K,i.get(O).__webglTexture,Y),t.bindFramebuffer(n.FRAMEBUFFER,null)}function ve(w,_,O){if(n.bindRenderbuffer(n.RENDERBUFFER,w),_.depthBuffer){let j=_.depthTexture,K=j&&j.isDepthTexture?j.type:null,Y=y(_.stencilBuffer,K),_e=_.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,re=He(_);Xe(_)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,re,Y,_.width,_.height):O?n.renderbufferStorageMultisample(n.RENDERBUFFER,re,Y,_.width,_.height):n.renderbufferStorage(n.RENDERBUFFER,Y,_.width,_.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,_e,n.RENDERBUFFER,w)}else{let j=_.textures;for(let K=0;K<j.length;K++){let Y=j[K],_e=r.convert(Y.format,Y.colorSpace),re=r.convert(Y.type),he=b(Y.internalFormat,_e,re,Y.colorSpace),Ve=He(_);O&&Xe(_)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ve,he,_.width,_.height):Xe(_)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ve,he,_.width,_.height):n.renderbufferStorage(n.RENDERBUFFER,he,_.width,_.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function le(w,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,w),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(_.depthTexture).__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),V(_.depthTexture,0);let j=i.get(_.depthTexture).__webglTexture,K=He(_);if(_.depthTexture.format===Ws)Xe(_)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,j,0,K):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,j,0);else if(_.depthTexture.format===Ui)Xe(_)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,j,0,K):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,j,0);else throw new Error("Unknown depthTexture format")}function Ee(w){let _=i.get(w),O=w.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==w.depthTexture){let j=w.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),j){let K=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,j.removeEventListener("dispose",K)};j.addEventListener("dispose",K),_.__depthDisposeCallback=K}_.__boundDepthTexture=j}if(w.depthTexture&&!_.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");le(_.__webglFramebuffer,w)}else if(O){_.__webglDepthbuffer=[];for(let j=0;j<6;j++)if(t.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer[j]),_.__webglDepthbuffer[j]===void 0)_.__webglDepthbuffer[j]=n.createRenderbuffer(),ve(_.__webglDepthbuffer[j],w,!1);else{let K=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Y=_.__webglDepthbuffer[j];n.bindRenderbuffer(n.RENDERBUFFER,Y),n.framebufferRenderbuffer(n.FRAMEBUFFER,K,n.RENDERBUFFER,Y)}}else if(t.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=n.createRenderbuffer(),ve(_.__webglDepthbuffer,w,!1);else{let j=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,K=_.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,K),n.framebufferRenderbuffer(n.FRAMEBUFFER,j,n.RENDERBUFFER,K)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Te(w,_,O){let j=i.get(w);_!==void 0&&Q(j.__webglFramebuffer,w,w.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),O!==void 0&&Ee(w)}function Ue(w){let _=w.texture,O=i.get(w),j=i.get(_);w.addEventListener("dispose",A);let K=w.textures,Y=w.isWebGLCubeRenderTarget===!0,_e=K.length>1;if(_e||(j.__webglTexture===void 0&&(j.__webglTexture=n.createTexture()),j.__version=_.version,o.memory.textures++),Y){O.__webglFramebuffer=[];for(let re=0;re<6;re++)if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer[re]=[];for(let he=0;he<_.mipmaps.length;he++)O.__webglFramebuffer[re][he]=n.createFramebuffer()}else O.__webglFramebuffer[re]=n.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer=[];for(let re=0;re<_.mipmaps.length;re++)O.__webglFramebuffer[re]=n.createFramebuffer()}else O.__webglFramebuffer=n.createFramebuffer();if(_e)for(let re=0,he=K.length;re<he;re++){let Ve=i.get(K[re]);Ve.__webglTexture===void 0&&(Ve.__webglTexture=n.createTexture(),o.memory.textures++)}if(w.samples>0&&Xe(w)===!1){O.__webglMultisampledFramebuffer=n.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let re=0;re<K.length;re++){let he=K[re];O.__webglColorRenderbuffer[re]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,O.__webglColorRenderbuffer[re]);let Ve=r.convert(he.format,he.colorSpace),$=r.convert(he.type),de=b(he.internalFormat,Ve,$,he.colorSpace,w.isXRRenderTarget===!0),Pe=He(w);n.renderbufferStorageMultisample(n.RENDERBUFFER,Pe,de,w.width,w.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+re,n.RENDERBUFFER,O.__webglColorRenderbuffer[re])}n.bindRenderbuffer(n.RENDERBUFFER,null),w.depthBuffer&&(O.__webglDepthRenderbuffer=n.createRenderbuffer(),ve(O.__webglDepthRenderbuffer,w,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(Y){t.bindTexture(n.TEXTURE_CUBE_MAP,j.__webglTexture),ge(n.TEXTURE_CUBE_MAP,_);for(let re=0;re<6;re++)if(_.mipmaps&&_.mipmaps.length>0)for(let he=0;he<_.mipmaps.length;he++)Q(O.__webglFramebuffer[re][he],w,_,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+re,he);else Q(O.__webglFramebuffer[re],w,_,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0);f(_)&&m(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(_e){for(let re=0,he=K.length;re<he;re++){let Ve=K[re],$=i.get(Ve);t.bindTexture(n.TEXTURE_2D,$.__webglTexture),ge(n.TEXTURE_2D,Ve),Q(O.__webglFramebuffer,w,Ve,n.COLOR_ATTACHMENT0+re,n.TEXTURE_2D,0),f(Ve)&&m(n.TEXTURE_2D)}t.unbindTexture()}else{let re=n.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(re=w.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(re,j.__webglTexture),ge(re,_),_.mipmaps&&_.mipmaps.length>0)for(let he=0;he<_.mipmaps.length;he++)Q(O.__webglFramebuffer[he],w,_,n.COLOR_ATTACHMENT0,re,he);else Q(O.__webglFramebuffer,w,_,n.COLOR_ATTACHMENT0,re,0);f(_)&&m(re),t.unbindTexture()}w.depthBuffer&&Ee(w)}function Ke(w){let _=w.textures;for(let O=0,j=_.length;O<j;O++){let K=_[O];if(f(K)){let Y=w.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,_e=i.get(K).__webglTexture;t.bindTexture(Y,_e),m(Y),t.unbindTexture()}}}let We=[],R=[];function It(w){if(w.samples>0){if(Xe(w)===!1){let _=w.textures,O=w.width,j=w.height,K=n.COLOR_BUFFER_BIT,Y=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,_e=i.get(w),re=_.length>1;if(re)for(let he=0;he<_.length;he++)t.bindFramebuffer(n.FRAMEBUFFER,_e.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+he,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,_e.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+he,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,_e.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,_e.__webglFramebuffer);for(let he=0;he<_.length;he++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(K|=n.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(K|=n.STENCIL_BUFFER_BIT)),re){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,_e.__webglColorRenderbuffer[he]);let Ve=i.get(_[he]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Ve,0)}n.blitFramebuffer(0,0,O,j,0,0,O,j,K,n.NEAREST),l===!0&&(We.length=0,R.length=0,We.push(n.COLOR_ATTACHMENT0+he),w.depthBuffer&&w.resolveDepthBuffer===!1&&(We.push(Y),R.push(Y),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,R)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,We))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),re)for(let he=0;he<_.length;he++){t.bindFramebuffer(n.FRAMEBUFFER,_e.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+he,n.RENDERBUFFER,_e.__webglColorRenderbuffer[he]);let Ve=i.get(_[he]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,_e.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+he,n.TEXTURE_2D,Ve,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,_e.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&l){let _=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[_])}}}function He(w){return Math.min(s.maxSamples,w.samples)}function Xe(w){let _=i.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function Ce(w){let _=o.render.frame;u.get(w)!==_&&(u.set(w,_),w.update())}function it(w,_){let O=w.colorSpace,j=w.format,K=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||O!==zi&&O!==Li&&(Je.getTransfer(O)===at?(j!==pn||K!==On)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),_}function Re(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=U,this.resetTextureUnits=S,this.setTexture2D=V,this.setTexture2DArray=J,this.setTexture3D=H,this.setTextureCube=ee,this.rebindTextures=Te,this.setupRenderTarget=Ue,this.updateRenderTargetMipmap=Ke,this.updateMultisampleRenderTarget=It,this.setupDepthRenderbuffer=Ee,this.setupFrameBufferTexture=Q,this.useMultisampledRTT=Xe}function j_(n,e){function t(i,s=Li){let r,o=Je.getTransfer(s);if(i===On)return n.UNSIGNED_BYTE;if(i===ch)return n.UNSIGNED_SHORT_4_4_4_4;if(i===uh)return n.UNSIGNED_SHORT_5_5_5_1;if(i===tp)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===$f)return n.BYTE;if(i===ep)return n.SHORT;if(i===qr)return n.UNSIGNED_SHORT;if(i===lh)return n.INT;if(i===ls)return n.UNSIGNED_INT;if(i===mi)return n.FLOAT;if(i===Et)return n.HALF_FLOAT;if(i===np)return n.ALPHA;if(i===ip)return n.RGB;if(i===pn)return n.RGBA;if(i===sp)return n.LUMINANCE;if(i===rp)return n.LUMINANCE_ALPHA;if(i===Ws)return n.DEPTH_COMPONENT;if(i===Ui)return n.DEPTH_STENCIL;if(i===op)return n.RED;if(i===hh)return n.RED_INTEGER;if(i===ap)return n.RG;if(i===dh)return n.RG_INTEGER;if(i===fh)return n.RGBA_INTEGER;if(i===xa||i===ya||i===_a||i===Sa)if(o===at)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===xa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ya)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===_a)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Sa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===xa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ya)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===_a)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Sa)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Gc||i===Wc||i===Xc||i===qc)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Gc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Wc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Xc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===qc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Yc||i===jc||i===Zc)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Yc||i===jc)return o===at?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Zc)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Jc||i===Kc||i===Qc||i===$c||i===eu||i===tu||i===nu||i===iu||i===su||i===ru||i===ou||i===au||i===lu||i===cu)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Jc)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Kc)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Qc)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===$c)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===eu)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===tu)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===nu)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===iu)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===su)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===ru)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===ou)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===au)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===lu)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===cu)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Ma||i===uu||i===hu)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Ma)return o===at?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===uu)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===hu)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===lp||i===du||i===fu||i===pu)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Ma)return r.COMPRESSED_RED_RGTC1_EXT;if(i===du)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===fu)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===pu)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ni?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}var Pu=class extends Vt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},wn=class extends Xt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Z_={type:"move"},Gr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new wn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new wn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new wn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let x of e.hand.values()){let f=t.getJointPose(x,i),m=this._getHandJoint(c,x);f!==null&&(m.matrix.fromArray(f.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=f.radius),m.visible=f!==null}let u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),p=.02,g=.005;c.inputState.pinching&&d>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Z_)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new wn;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},J_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,K_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Lu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){let s=new Ct,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new rt({vertexShader:J_,fragmentShader:K_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Oe(new Ua(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Iu=class extends Oi{constructor(e,t){super();let i=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,d=null,p=null,g=null,x=new Lu,f=t.getContextAttributes(),m=null,b=null,y=[],T=[],L=new se,A=null,E=new Vt;E.layers.enable(1),E.viewport=new ot;let P=new Vt;P.layers.enable(2),P.viewport=new ot;let k=[E,P],v=new Pu;v.layers.enable(1),v.layers.enable(2);let S=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let Q=y[q];return Q===void 0&&(Q=new Gr,y[q]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(q){let Q=y[q];return Q===void 0&&(Q=new Gr,y[q]=Q),Q.getGripSpace()},this.getHand=function(q){let Q=y[q];return Q===void 0&&(Q=new Gr,y[q]=Q),Q.getHandSpace()};function F(q){let Q=T.indexOf(q.inputSource);if(Q===-1)return;let ve=y[Q];ve!==void 0&&(ve.update(q.inputSource,q.frame,c||o),ve.dispatchEvent({type:q.type,data:q.inputSource}))}function V(){s.removeEventListener("select",F),s.removeEventListener("selectstart",F),s.removeEventListener("selectend",F),s.removeEventListener("squeeze",F),s.removeEventListener("squeezestart",F),s.removeEventListener("squeezeend",F),s.removeEventListener("end",V),s.removeEventListener("inputsourceschange",J);for(let q=0;q<y.length;q++){let Q=T[q];Q!==null&&(T[q]=null,y[q].disconnect(Q))}S=null,U=null,x.reset(),e.setRenderTarget(m),p=null,d=null,h=null,s=null,b=null,Ye.stop(),i.isPresenting=!1,e.setPixelRatio(A),e.setSize(L.width,L.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){r=q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){a=q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return h},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(q){if(s=q,s!==null){if(m=e.getRenderTarget(),s.addEventListener("select",F),s.addEventListener("selectstart",F),s.addEventListener("selectend",F),s.addEventListener("squeeze",F),s.addEventListener("squeezestart",F),s.addEventListener("squeezeend",F),s.addEventListener("end",V),s.addEventListener("inputsourceschange",J),f.xrCompatible!==!0&&await t.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(L),s.renderState.layers===void 0){let Q={antialias:f.antialias,alpha:!0,depth:f.depth,stencil:f.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,Q),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),b=new ht(p.framebufferWidth,p.framebufferHeight,{format:pn,type:On,colorSpace:e.outputColorSpace,stencilBuffer:f.stencil})}else{let Q=null,ve=null,le=null;f.depth&&(le=f.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Q=f.stencil?Ui:Ws,ve=f.stencil?Ni:ls);let Ee={colorFormat:t.RGBA8,depthFormat:le,scaleFactor:r};h=new XRWebGLBinding(s,t),d=h.createProjectionLayer(Ee),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),b=new ht(d.textureWidth,d.textureHeight,{format:pn,type:On,depthTexture:new er(d.textureWidth,d.textureHeight,ve,void 0,void 0,void 0,void 0,void 0,void 0,Q),stencilBuffer:f.stencil,colorSpace:e.outputColorSpace,samples:f.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Ye.setContext(s),Ye.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function J(q){for(let Q=0;Q<q.removed.length;Q++){let ve=q.removed[Q],le=T.indexOf(ve);le>=0&&(T[le]=null,y[le].disconnect(ve))}for(let Q=0;Q<q.added.length;Q++){let ve=q.added[Q],le=T.indexOf(ve);if(le===-1){for(let Te=0;Te<y.length;Te++)if(Te>=T.length){T.push(ve),le=Te;break}else if(T[Te]===null){T[Te]=ve,le=Te;break}if(le===-1)break}let Ee=y[le];Ee&&Ee.connect(ve)}}let H=new C,ee=new C;function W(q,Q,ve){H.setFromMatrixPosition(Q.matrixWorld),ee.setFromMatrixPosition(ve.matrixWorld);let le=H.distanceTo(ee),Ee=Q.projectionMatrix.elements,Te=ve.projectionMatrix.elements,Ue=Ee[14]/(Ee[10]-1),Ke=Ee[14]/(Ee[10]+1),We=(Ee[9]+1)/Ee[5],R=(Ee[9]-1)/Ee[5],It=(Ee[8]-1)/Ee[0],He=(Te[8]+1)/Te[0],Xe=Ue*It,Ce=Ue*He,it=le/(-It+He),Re=it*-It;if(Q.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(Re),q.translateZ(it),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),Ee[10]===-1)q.projectionMatrix.copy(Q.projectionMatrix),q.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{let w=Ue+it,_=Ke+it,O=Xe-Re,j=Ce+(le-Re),K=We*Ke/_*w,Y=R*Ke/_*w;q.projectionMatrix.makePerspective(O,j,K,Y,w,_),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function ie(q,Q){Q===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(Q.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(s===null)return;let Q=q.near,ve=q.far;x.texture!==null&&(x.depthNear>0&&(Q=x.depthNear),x.depthFar>0&&(ve=x.depthFar)),v.near=P.near=E.near=Q,v.far=P.far=E.far=ve,(S!==v.near||U!==v.far)&&(s.updateRenderState({depthNear:v.near,depthFar:v.far}),S=v.near,U=v.far);let le=q.parent,Ee=v.cameras;ie(v,le);for(let Te=0;Te<Ee.length;Te++)ie(Ee[Te],le);Ee.length===2?W(v,E,P):v.projectionMatrix.copy(E.projectionMatrix),ue(q,v,le)};function ue(q,Q,ve){ve===null?q.matrix.copy(Q.matrixWorld):(q.matrix.copy(ve.matrixWorld),q.matrix.invert(),q.matrix.multiply(Q.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(Q.projectionMatrix),q.projectionMatrixInverse.copy(Q.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=gu*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return v},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(q){l=q,d!==null&&(d.fixedFoveation=q),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=q)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(v)};let ge=null;function ke(q,Q){if(u=Q.getViewerPose(c||o),g=Q,u!==null){let ve=u.views;p!==null&&(e.setRenderTargetFramebuffer(b,p.framebuffer),e.setRenderTarget(b));let le=!1;ve.length!==v.cameras.length&&(v.cameras.length=0,le=!0);for(let Te=0;Te<ve.length;Te++){let Ue=ve[Te],Ke=null;if(p!==null)Ke=p.getViewport(Ue);else{let R=h.getViewSubImage(d,Ue);Ke=R.viewport,Te===0&&(e.setRenderTargetTextures(b,R.colorTexture,d.ignoreDepthValues?void 0:R.depthStencilTexture),e.setRenderTarget(b))}let We=k[Te];We===void 0&&(We=new Vt,We.layers.enable(Te),We.viewport=new ot,k[Te]=We),We.matrix.fromArray(Ue.transform.matrix),We.matrix.decompose(We.position,We.quaternion,We.scale),We.projectionMatrix.fromArray(Ue.projectionMatrix),We.projectionMatrixInverse.copy(We.projectionMatrix).invert(),We.viewport.set(Ke.x,Ke.y,Ke.width,Ke.height),Te===0&&(v.matrix.copy(We.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale)),le===!0&&v.cameras.push(We)}let Ee=s.enabledFeatures;if(Ee&&Ee.includes("depth-sensing")){let Te=h.getDepthInformation(ve[0]);Te&&Te.isValid&&Te.texture&&x.init(e,Te,s.renderState)}}for(let ve=0;ve<y.length;ve++){let le=T[ve],Ee=y[ve];le!==null&&Ee!==void 0&&Ee.update(le,Q,c||o)}ge&&ge(q,Q),Q.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Q}),g=null}let Ye=new fp;Ye.setAnimationLoop(ke),this.setAnimationLoop=function(q){ge=q},this.dispose=function(){}}},ts=new Yn,Q_=new $e;function $_(n,e){function t(f,m){f.matrixAutoUpdate===!0&&f.updateMatrix(),m.value.copy(f.matrix)}function i(f,m){m.color.getRGB(f.fogColor.value,dp(n)),m.isFog?(f.fogNear.value=m.near,f.fogFar.value=m.far):m.isFogExp2&&(f.fogDensity.value=m.density)}function s(f,m,b,y,T){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(f,m):m.isMeshToonMaterial?(r(f,m),h(f,m)):m.isMeshPhongMaterial?(r(f,m),u(f,m)):m.isMeshStandardMaterial?(r(f,m),d(f,m),m.isMeshPhysicalMaterial&&p(f,m,T)):m.isMeshMatcapMaterial?(r(f,m),g(f,m)):m.isMeshDepthMaterial?r(f,m):m.isMeshDistanceMaterial?(r(f,m),x(f,m)):m.isMeshNormalMaterial?r(f,m):m.isLineBasicMaterial?(o(f,m),m.isLineDashedMaterial&&a(f,m)):m.isPointsMaterial?l(f,m,b,y):m.isSpriteMaterial?c(f,m):m.isShadowMaterial?(f.color.value.copy(m.color),f.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(f,m){f.opacity.value=m.opacity,m.color&&f.diffuse.value.copy(m.color),m.emissive&&f.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(f.map.value=m.map,t(m.map,f.mapTransform)),m.alphaMap&&(f.alphaMap.value=m.alphaMap,t(m.alphaMap,f.alphaMapTransform)),m.bumpMap&&(f.bumpMap.value=m.bumpMap,t(m.bumpMap,f.bumpMapTransform),f.bumpScale.value=m.bumpScale,m.side===Gt&&(f.bumpScale.value*=-1)),m.normalMap&&(f.normalMap.value=m.normalMap,t(m.normalMap,f.normalMapTransform),f.normalScale.value.copy(m.normalScale),m.side===Gt&&f.normalScale.value.negate()),m.displacementMap&&(f.displacementMap.value=m.displacementMap,t(m.displacementMap,f.displacementMapTransform),f.displacementScale.value=m.displacementScale,f.displacementBias.value=m.displacementBias),m.emissiveMap&&(f.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,f.emissiveMapTransform)),m.specularMap&&(f.specularMap.value=m.specularMap,t(m.specularMap,f.specularMapTransform)),m.alphaTest>0&&(f.alphaTest.value=m.alphaTest);let b=e.get(m),y=b.envMap,T=b.envMapRotation;y&&(f.envMap.value=y,ts.copy(T),ts.x*=-1,ts.y*=-1,ts.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(ts.y*=-1,ts.z*=-1),f.envMapRotation.value.setFromMatrix4(Q_.makeRotationFromEuler(ts)),f.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,f.reflectivity.value=m.reflectivity,f.ior.value=m.ior,f.refractionRatio.value=m.refractionRatio),m.lightMap&&(f.lightMap.value=m.lightMap,f.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,f.lightMapTransform)),m.aoMap&&(f.aoMap.value=m.aoMap,f.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,f.aoMapTransform))}function o(f,m){f.diffuse.value.copy(m.color),f.opacity.value=m.opacity,m.map&&(f.map.value=m.map,t(m.map,f.mapTransform))}function a(f,m){f.dashSize.value=m.dashSize,f.totalSize.value=m.dashSize+m.gapSize,f.scale.value=m.scale}function l(f,m,b,y){f.diffuse.value.copy(m.color),f.opacity.value=m.opacity,f.size.value=m.size*b,f.scale.value=y*.5,m.map&&(f.map.value=m.map,t(m.map,f.uvTransform)),m.alphaMap&&(f.alphaMap.value=m.alphaMap,t(m.alphaMap,f.alphaMapTransform)),m.alphaTest>0&&(f.alphaTest.value=m.alphaTest)}function c(f,m){f.diffuse.value.copy(m.color),f.opacity.value=m.opacity,f.rotation.value=m.rotation,m.map&&(f.map.value=m.map,t(m.map,f.mapTransform)),m.alphaMap&&(f.alphaMap.value=m.alphaMap,t(m.alphaMap,f.alphaMapTransform)),m.alphaTest>0&&(f.alphaTest.value=m.alphaTest)}function u(f,m){f.specular.value.copy(m.specular),f.shininess.value=Math.max(m.shininess,1e-4)}function h(f,m){m.gradientMap&&(f.gradientMap.value=m.gradientMap)}function d(f,m){f.metalness.value=m.metalness,m.metalnessMap&&(f.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,f.metalnessMapTransform)),f.roughness.value=m.roughness,m.roughnessMap&&(f.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,f.roughnessMapTransform)),m.envMap&&(f.envMapIntensity.value=m.envMapIntensity)}function p(f,m,b){f.ior.value=m.ior,m.sheen>0&&(f.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),f.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(f.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,f.sheenColorMapTransform)),m.sheenRoughnessMap&&(f.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,f.sheenRoughnessMapTransform))),m.clearcoat>0&&(f.clearcoat.value=m.clearcoat,f.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(f.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,f.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(f.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Gt&&f.clearcoatNormalScale.value.negate())),m.dispersion>0&&(f.dispersion.value=m.dispersion),m.iridescence>0&&(f.iridescence.value=m.iridescence,f.iridescenceIOR.value=m.iridescenceIOR,f.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],f.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(f.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,f.iridescenceMapTransform)),m.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),m.transmission>0&&(f.transmission.value=m.transmission,f.transmissionSamplerMap.value=b.texture,f.transmissionSamplerSize.value.set(b.width,b.height),m.transmissionMap&&(f.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,f.transmissionMapTransform)),f.thickness.value=m.thickness,m.thicknessMap&&(f.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=m.attenuationDistance,f.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(f.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(f.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=m.specularIntensity,f.specularColor.value.copy(m.specularColor),m.specularColorMap&&(f.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,f.specularColorMapTransform)),m.specularIntensityMap&&(f.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,f.specularIntensityMapTransform))}function g(f,m){m.matcap&&(f.matcap.value=m.matcap)}function x(f,m){let b=e.get(m).light;f.referencePosition.value.setFromMatrixPosition(b.matrixWorld),f.nearDistance.value=b.shadow.camera.near,f.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function eS(n,e,t,i){let s={},r={},o=[],a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(b,y){let T=y.program;i.uniformBlockBinding(b,T)}function c(b,y){let T=s[b.id];T===void 0&&(g(b),T=u(b),s[b.id]=T,b.addEventListener("dispose",f));let L=y.program;i.updateUBOMapping(b,L);let A=e.render.frame;r[b.id]!==A&&(d(b),r[b.id]=A)}function u(b){let y=h();b.__bindingPointIndex=y;let T=n.createBuffer(),L=b.__size,A=b.usage;return n.bindBuffer(n.UNIFORM_BUFFER,T),n.bufferData(n.UNIFORM_BUFFER,L,A),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,y,T),T}function h(){for(let b=0;b<a;b++)if(o.indexOf(b)===-1)return o.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(b){let y=s[b.id],T=b.uniforms,L=b.__cache;n.bindBuffer(n.UNIFORM_BUFFER,y);for(let A=0,E=T.length;A<E;A++){let P=Array.isArray(T[A])?T[A]:[T[A]];for(let k=0,v=P.length;k<v;k++){let S=P[k];if(p(S,A,k,L)===!0){let U=S.__offset,F=Array.isArray(S.value)?S.value:[S.value],V=0;for(let J=0;J<F.length;J++){let H=F[J],ee=x(H);typeof H=="number"||typeof H=="boolean"?(S.__data[0]=H,n.bufferSubData(n.UNIFORM_BUFFER,U+V,S.__data)):H.isMatrix3?(S.__data[0]=H.elements[0],S.__data[1]=H.elements[1],S.__data[2]=H.elements[2],S.__data[3]=0,S.__data[4]=H.elements[3],S.__data[5]=H.elements[4],S.__data[6]=H.elements[5],S.__data[7]=0,S.__data[8]=H.elements[6],S.__data[9]=H.elements[7],S.__data[10]=H.elements[8],S.__data[11]=0):(H.toArray(S.__data,V),V+=ee.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,U,S.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(b,y,T,L){let A=b.value,E=y+"_"+T;if(L[E]===void 0)return typeof A=="number"||typeof A=="boolean"?L[E]=A:L[E]=A.clone(),!0;{let P=L[E];if(typeof A=="number"||typeof A=="boolean"){if(P!==A)return L[E]=A,!0}else if(P.equals(A)===!1)return P.copy(A),!0}return!1}function g(b){let y=b.uniforms,T=0,L=16;for(let E=0,P=y.length;E<P;E++){let k=Array.isArray(y[E])?y[E]:[y[E]];for(let v=0,S=k.length;v<S;v++){let U=k[v],F=Array.isArray(U.value)?U.value:[U.value];for(let V=0,J=F.length;V<J;V++){let H=F[V],ee=x(H),W=T%L,ie=W%ee.boundary,ue=W+ie;T+=ie,ue!==0&&L-ue<ee.storage&&(T+=L-ue),U.__data=new Float32Array(ee.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=T,T+=ee.storage}}}let A=T%L;return A>0&&(T+=L-A),b.__size=T,b.__cache={},this}function x(b){let y={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(y.boundary=4,y.storage=4):b.isVector2?(y.boundary=8,y.storage=8):b.isVector3||b.isColor?(y.boundary=16,y.storage=12):b.isVector4?(y.boundary=16,y.storage=16):b.isMatrix3?(y.boundary=48,y.storage=48):b.isMatrix4?(y.boundary=64,y.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),y}function f(b){let y=b.target;y.removeEventListener("dispose",f);let T=o.indexOf(y.__bindingPointIndex);o.splice(T,1),n.deleteBuffer(s[y.id]),delete s[y.id],delete r[y.id]}function m(){for(let b in s)n.deleteBuffer(s[b]);o=[],s={},r={}}return{bind:l,update:c,dispose:m}}var Oa=class{constructor(e={}){let{canvas:t=sv(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1}=e;this.isWebGLRenderer=!0;let d;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=i.getContextAttributes().alpha}else d=o;let p=new Uint32Array(4),g=new Int32Array(4),x=null,f=null,m=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=sn,this.toneMapping=Ii,this.toneMappingExposure=1;let y=this,T=!1,L=0,A=0,E=null,P=-1,k=null,v=new ot,S=new ot,U=null,F=new Me(0),V=0,J=t.width,H=t.height,ee=1,W=null,ie=null,ue=new ot(0,0,J,H),ge=new ot(0,0,J,H),ke=!1,Ye=new Jr,q=!1,Q=!1,ve=new $e,le=new $e,Ee=new C,Te=new ot,Ue={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ke=!1;function We(){return E===null?ee:1}let R=i;function It(M,D){return t.getContext(M,D)}try{let M={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine","three.js r169"),t.addEventListener("webglcontextlost",Z,!1),t.addEventListener("webglcontextrestored",fe,!1),t.addEventListener("webglcontextcreationerror",me,!1),R===null){let D="webgl2";if(R=It(D,M),R===null)throw It(D)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(M){throw console.error("THREE.WebGLRenderer: "+M.message),M}let He,Xe,Ce,it,Re,w,_,O,j,K,Y,_e,re,he,Ve,$,de,Pe,Le,xe,qe,Ne,Ze,I;function ce(){He=new gy(R),He.init(),Ne=new j_(R,He),Xe=new uy(R,He,e,Ne),Ce=new X_(R),Xe.reverseDepthBuffer&&Ce.buffers.depth.setReversed(!0),it=new yy(R),Re=new I_,w=new Y_(R,He,Ce,Re,Xe,Ne,it),_=new dy(y),O=new my(y),j=new Ev(R),Ze=new ly(R,j),K=new vy(R,j,it,Ze),Y=new Sy(R,K,j,it),Le=new _y(R,Xe,w),$=new hy(Re),_e=new L_(y,_,O,He,Xe,Ze,$),re=new $_(y,Re),he=new N_,Ve=new k_(He),Pe=new ay(y,_,O,Ce,Y,d,l),de=new G_(y,Y,Xe),I=new eS(R,it,Xe,Ce),xe=new cy(R,He,it),qe=new xy(R,He,it),it.programs=_e.programs,y.capabilities=Xe,y.extensions=He,y.properties=Re,y.renderLists=he,y.shadowMap=de,y.state=Ce,y.info=it}ce();let G=new Iu(y,R);this.xr=G,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){let M=He.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){let M=He.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return ee},this.setPixelRatio=function(M){M!==void 0&&(ee=M,this.setSize(J,H,!1))},this.getSize=function(M){return M.set(J,H)},this.setSize=function(M,D,B=!0){if(G.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}J=M,H=D,t.width=Math.floor(M*ee),t.height=Math.floor(D*ee),B===!0&&(t.style.width=M+"px",t.style.height=D+"px"),this.setViewport(0,0,M,D)},this.getDrawingBufferSize=function(M){return M.set(J*ee,H*ee).floor()},this.setDrawingBufferSize=function(M,D,B){J=M,H=D,ee=B,t.width=Math.floor(M*B),t.height=Math.floor(D*B),this.setViewport(0,0,M,D)},this.getCurrentViewport=function(M){return M.copy(v)},this.getViewport=function(M){return M.copy(ue)},this.setViewport=function(M,D,B,z){M.isVector4?ue.set(M.x,M.y,M.z,M.w):ue.set(M,D,B,z),Ce.viewport(v.copy(ue).multiplyScalar(ee).round())},this.getScissor=function(M){return M.copy(ge)},this.setScissor=function(M,D,B,z){M.isVector4?ge.set(M.x,M.y,M.z,M.w):ge.set(M,D,B,z),Ce.scissor(S.copy(ge).multiplyScalar(ee).round())},this.getScissorTest=function(){return ke},this.setScissorTest=function(M){Ce.setScissorTest(ke=M)},this.setOpaqueSort=function(M){W=M},this.setTransparentSort=function(M){ie=M},this.getClearColor=function(M){return M.copy(Pe.getClearColor())},this.setClearColor=function(){Pe.setClearColor.apply(Pe,arguments)},this.getClearAlpha=function(){return Pe.getClearAlpha()},this.setClearAlpha=function(){Pe.setClearAlpha.apply(Pe,arguments)},this.clear=function(M=!0,D=!0,B=!0){let z=0;if(M){let N=!1;if(E!==null){let ne=E.texture.format;N=ne===fh||ne===dh||ne===hh}if(N){let ne=E.texture.type,pe=ne===On||ne===ls||ne===qr||ne===Ni||ne===ch||ne===uh,ye=Pe.getClearColor(),Se=Pe.getClearAlpha(),Ie=ye.r,De=ye.g,be=ye.b;pe?(p[0]=Ie,p[1]=De,p[2]=be,p[3]=Se,R.clearBufferuiv(R.COLOR,0,p)):(g[0]=Ie,g[1]=De,g[2]=be,g[3]=Se,R.clearBufferiv(R.COLOR,0,g))}else z|=R.COLOR_BUFFER_BIT}D&&(z|=R.DEPTH_BUFFER_BIT,R.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),B&&(z|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),R.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Z,!1),t.removeEventListener("webglcontextrestored",fe,!1),t.removeEventListener("webglcontextcreationerror",me,!1),he.dispose(),Ve.dispose(),Re.dispose(),_.dispose(),O.dispose(),Y.dispose(),Ze.dispose(),I.dispose(),_e.dispose(),G.dispose(),G.removeEventListener("sessionstart",Ed),G.removeEventListener("sessionend",Ad),qi.stop()};function Z(M){M.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function fe(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;let M=it.autoReset,D=de.enabled,B=de.autoUpdate,z=de.needsUpdate,N=de.type;ce(),it.autoReset=M,de.enabled=D,de.autoUpdate=B,de.needsUpdate=z,de.type=N}function me(M){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function je(M){let D=M.target;D.removeEventListener("dispose",je),vt(D)}function vt(M){en(M),Re.remove(M)}function en(M){let D=Re.get(M).programs;D!==void 0&&(D.forEach(function(B){_e.releaseProgram(B)}),M.isShaderMaterial&&_e.releaseShaderCache(M))}this.renderBufferDirect=function(M,D,B,z,N,ne){D===null&&(D=Ue);let pe=N.isMesh&&N.matrixWorld.determinant()<0,ye=dg(M,D,B,z,N);Ce.setMaterial(z,pe);let Se=B.index,Ie=1;if(z.wireframe===!0){if(Se=K.getWireframeAttribute(B),Se===void 0)return;Ie=2}let De=B.drawRange,be=B.attributes.position,st=De.start*Ie,ct=(De.start+De.count)*Ie;ne!==null&&(st=Math.max(st,ne.start*Ie),ct=Math.min(ct,(ne.start+ne.count)*Ie)),Se!==null?(st=Math.max(st,0),ct=Math.min(ct,Se.count)):be!=null&&(st=Math.max(st,0),ct=Math.min(ct,be.count));let ft=ct-st;if(ft<0||ft===1/0)return;Ze.setup(N,z,ye,B,Se);let cn,et=xe;if(Se!==null&&(cn=j.get(Se),et=qe,et.setIndex(cn)),N.isMesh)z.wireframe===!0?(Ce.setLineWidth(z.wireframeLinewidth*We()),et.setMode(R.LINES)):et.setMode(R.TRIANGLES);else if(N.isLine){let we=z.linewidth;we===void 0&&(we=1),Ce.setLineWidth(we*We()),N.isLineSegments?et.setMode(R.LINES):N.isLineLoop?et.setMode(R.LINE_LOOP):et.setMode(R.LINE_STRIP)}else N.isPoints?et.setMode(R.POINTS):N.isSprite&&et.setMode(R.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)et.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(He.get("WEBGL_multi_draw"))et.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{let we=N._multiDrawStarts,Dt=N._multiDrawCounts,tt=N._multiDrawCount,In=Se?j.get(Se).bytesPerElement:1,ys=Re.get(z).currentProgram.getUniforms();for(let un=0;un<tt;un++)ys.setValue(R,"_gl_DrawID",un),et.render(we[un]/In,Dt[un])}else if(N.isInstancedMesh)et.renderInstances(st,ft,N.count);else if(B.isInstancedBufferGeometry){let we=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,Dt=Math.min(B.instanceCount,we);et.renderInstances(st,ft,Dt)}else et.render(st,ft)};function Qe(M,D,B){M.transparent===!0&&M.side===bn&&M.forceSinglePass===!1?(M.side=Gt,M.needsUpdate=!0,Fo(M,D,B),M.side=Di,M.needsUpdate=!0,Fo(M,D,B),M.side=bn):Fo(M,D,B)}this.compile=function(M,D,B=null){B===null&&(B=M),f=Ve.get(B),f.init(D),b.push(f),B.traverseVisible(function(N){N.isLight&&N.layers.test(D.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),M!==B&&M.traverseVisible(function(N){N.isLight&&N.layers.test(D.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),f.setupLights();let z=new Set;return M.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;let ne=N.material;if(ne)if(Array.isArray(ne))for(let pe=0;pe<ne.length;pe++){let ye=ne[pe];Qe(ye,B,N),z.add(ye)}else Qe(ne,B,N),z.add(ne)}),b.pop(),f=null,z},this.compileAsync=function(M,D,B=null){let z=this.compile(M,D,B);return new Promise(N=>{function ne(){if(z.forEach(function(pe){Re.get(pe).currentProgram.isReady()&&z.delete(pe)}),z.size===0){N(M);return}setTimeout(ne,10)}He.get("KHR_parallel_shader_compile")!==null?ne():setTimeout(ne,10)})};let tn=null;function ei(M){tn&&tn(M)}function Ed(){qi.stop()}function Ad(){qi.start()}let qi=new fp;qi.setAnimationLoop(ei),typeof self<"u"&&qi.setContext(self),this.setAnimationLoop=function(M){tn=M,G.setAnimationLoop(M),M===null?qi.stop():qi.start()},G.addEventListener("sessionstart",Ed),G.addEventListener("sessionend",Ad),this.render=function(M,D){if(D!==void 0&&D.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),G.enabled===!0&&G.isPresenting===!0&&(G.cameraAutoUpdate===!0&&G.updateCamera(D),D=G.getCamera()),M.isScene===!0&&M.onBeforeRender(y,M,D,E),f=Ve.get(M,b.length),f.init(D),b.push(f),le.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),Ye.setFromProjectionMatrix(le),Q=this.localClippingEnabled,q=$.init(this.clippingPlanes,Q),x=he.get(M,m.length),x.init(),m.push(x),G.enabled===!0&&G.isPresenting===!0){let ne=y.xr.getDepthSensingMesh();ne!==null&&Nl(ne,D,-1/0,y.sortObjects)}Nl(M,D,0,y.sortObjects),x.finish(),y.sortObjects===!0&&x.sort(W,ie),Ke=G.enabled===!1||G.isPresenting===!1||G.hasDepthSensing()===!1,Ke&&Pe.addToRenderList(x,M),this.info.render.frame++,q===!0&&$.beginShadows();let B=f.state.shadowsArray;de.render(B,M,D),q===!0&&$.endShadows(),this.info.autoReset===!0&&this.info.reset();let z=x.opaque,N=x.transmissive;if(f.setupLights(),D.isArrayCamera){let ne=D.cameras;if(N.length>0)for(let pe=0,ye=ne.length;pe<ye;pe++){let Se=ne[pe];Rd(z,N,M,Se)}Ke&&Pe.render(M);for(let pe=0,ye=ne.length;pe<ye;pe++){let Se=ne[pe];Cd(x,M,Se,Se.viewport)}}else N.length>0&&Rd(z,N,M,D),Ke&&Pe.render(M),Cd(x,M,D);E!==null&&(w.updateMultisampleRenderTarget(E),w.updateRenderTargetMipmap(E)),M.isScene===!0&&M.onAfterRender(y,M,D),Ze.resetDefaultState(),P=-1,k=null,b.pop(),b.length>0?(f=b[b.length-1],q===!0&&$.setGlobalState(y.clippingPlanes,f.state.camera)):f=null,m.pop(),m.length>0?x=m[m.length-1]:x=null};function Nl(M,D,B,z){if(M.visible===!1)return;if(M.layers.test(D.layers)){if(M.isGroup)B=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(D);else if(M.isLight)f.pushLight(M),M.castShadow&&f.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||Ye.intersectsSprite(M)){z&&Te.setFromMatrixPosition(M.matrixWorld).applyMatrix4(le);let pe=Y.update(M),ye=M.material;ye.visible&&x.push(M,pe,ye,B,Te.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||Ye.intersectsObject(M))){let pe=Y.update(M),ye=M.material;if(z&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),Te.copy(M.boundingSphere.center)):(pe.boundingSphere===null&&pe.computeBoundingSphere(),Te.copy(pe.boundingSphere.center)),Te.applyMatrix4(M.matrixWorld).applyMatrix4(le)),Array.isArray(ye)){let Se=pe.groups;for(let Ie=0,De=Se.length;Ie<De;Ie++){let be=Se[Ie],st=ye[be.materialIndex];st&&st.visible&&x.push(M,pe,st,B,Te.z,be)}}else ye.visible&&x.push(M,pe,ye,B,Te.z,null)}}let ne=M.children;for(let pe=0,ye=ne.length;pe<ye;pe++)Nl(ne[pe],D,B,z)}function Cd(M,D,B,z){let N=M.opaque,ne=M.transmissive,pe=M.transparent;f.setupLightsView(B),q===!0&&$.setGlobalState(y.clippingPlanes,B),z&&Ce.viewport(v.copy(z)),N.length>0&&Oo(N,D,B),ne.length>0&&Oo(ne,D,B),pe.length>0&&Oo(pe,D,B),Ce.buffers.depth.setTest(!0),Ce.buffers.depth.setMask(!0),Ce.buffers.color.setMask(!0),Ce.setPolygonOffset(!1)}function Rd(M,D,B,z){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[z.id]===void 0&&(f.state.transmissionRenderTarget[z.id]=new ht(1,1,{generateMipmaps:!0,type:He.has("EXT_color_buffer_half_float")||He.has("EXT_color_buffer_float")?Et:On,minFilter:os,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Je.workingColorSpace}));let ne=f.state.transmissionRenderTarget[z.id],pe=z.viewport||v;ne.setSize(pe.z,pe.w);let ye=y.getRenderTarget();y.setRenderTarget(ne),y.getClearColor(F),V=y.getClearAlpha(),V<1&&y.setClearColor(16777215,.5),y.clear(),Ke&&Pe.render(B);let Se=y.toneMapping;y.toneMapping=Ii;let Ie=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),f.setupLightsView(z),q===!0&&$.setGlobalState(y.clippingPlanes,z),Oo(M,B,z),w.updateMultisampleRenderTarget(ne),w.updateRenderTargetMipmap(ne),He.has("WEBGL_multisampled_render_to_texture")===!1){let De=!1;for(let be=0,st=D.length;be<st;be++){let ct=D[be],ft=ct.object,cn=ct.geometry,et=ct.material,we=ct.group;if(et.side===bn&&ft.layers.test(z.layers)){let Dt=et.side;et.side=Gt,et.needsUpdate=!0,Pd(ft,B,z,cn,et,we),et.side=Dt,et.needsUpdate=!0,De=!0}}De===!0&&(w.updateMultisampleRenderTarget(ne),w.updateRenderTargetMipmap(ne))}y.setRenderTarget(ye),y.setClearColor(F,V),Ie!==void 0&&(z.viewport=Ie),y.toneMapping=Se}function Oo(M,D,B){let z=D.isScene===!0?D.overrideMaterial:null;for(let N=0,ne=M.length;N<ne;N++){let pe=M[N],ye=pe.object,Se=pe.geometry,Ie=z===null?pe.material:z,De=pe.group;ye.layers.test(B.layers)&&Pd(ye,D,B,Se,Ie,De)}}function Pd(M,D,B,z,N,ne){M.onBeforeRender(y,D,B,z,N,ne),M.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),N.onBeforeRender(y,D,B,z,M,ne),N.transparent===!0&&N.side===bn&&N.forceSinglePass===!1?(N.side=Gt,N.needsUpdate=!0,y.renderBufferDirect(B,D,z,N,M,ne),N.side=Di,N.needsUpdate=!0,y.renderBufferDirect(B,D,z,N,M,ne),N.side=bn):y.renderBufferDirect(B,D,z,N,M,ne),M.onAfterRender(y,D,B,z,N,ne)}function Fo(M,D,B){D.isScene!==!0&&(D=Ue);let z=Re.get(M),N=f.state.lights,ne=f.state.shadowsArray,pe=N.state.version,ye=_e.getParameters(M,N.state,ne,D,B),Se=_e.getProgramCacheKey(ye),Ie=z.programs;z.environment=M.isMeshStandardMaterial?D.environment:null,z.fog=D.fog,z.envMap=(M.isMeshStandardMaterial?O:_).get(M.envMap||z.environment),z.envMapRotation=z.environment!==null&&M.envMap===null?D.environmentRotation:M.envMapRotation,Ie===void 0&&(M.addEventListener("dispose",je),Ie=new Map,z.programs=Ie);let De=Ie.get(Se);if(De!==void 0){if(z.currentProgram===De&&z.lightsStateVersion===pe)return Id(M,ye),De}else ye.uniforms=_e.getUniforms(M),M.onBeforeCompile(ye,y),De=_e.acquireProgram(ye,Se),Ie.set(Se,De),z.uniforms=ye.uniforms;let be=z.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(be.clippingPlanes=$.uniform),Id(M,ye),z.needsLights=pg(M),z.lightsStateVersion=pe,z.needsLights&&(be.ambientLightColor.value=N.state.ambient,be.lightProbe.value=N.state.probe,be.directionalLights.value=N.state.directional,be.directionalLightShadows.value=N.state.directionalShadow,be.spotLights.value=N.state.spot,be.spotLightShadows.value=N.state.spotShadow,be.rectAreaLights.value=N.state.rectArea,be.ltc_1.value=N.state.rectAreaLTC1,be.ltc_2.value=N.state.rectAreaLTC2,be.pointLights.value=N.state.point,be.pointLightShadows.value=N.state.pointShadow,be.hemisphereLights.value=N.state.hemi,be.directionalShadowMap.value=N.state.directionalShadowMap,be.directionalShadowMatrix.value=N.state.directionalShadowMatrix,be.spotShadowMap.value=N.state.spotShadowMap,be.spotLightMatrix.value=N.state.spotLightMatrix,be.spotLightMap.value=N.state.spotLightMap,be.pointShadowMap.value=N.state.pointShadowMap,be.pointShadowMatrix.value=N.state.pointShadowMatrix),z.currentProgram=De,z.uniformsList=null,De}function Ld(M){if(M.uniformsList===null){let D=M.currentProgram.getUniforms();M.uniformsList=qs.seqWithValue(D.seq,M.uniforms)}return M.uniformsList}function Id(M,D){let B=Re.get(M);B.outputColorSpace=D.outputColorSpace,B.batching=D.batching,B.batchingColor=D.batchingColor,B.instancing=D.instancing,B.instancingColor=D.instancingColor,B.instancingMorph=D.instancingMorph,B.skinning=D.skinning,B.morphTargets=D.morphTargets,B.morphNormals=D.morphNormals,B.morphColors=D.morphColors,B.morphTargetsCount=D.morphTargetsCount,B.numClippingPlanes=D.numClippingPlanes,B.numIntersection=D.numClipIntersection,B.vertexAlphas=D.vertexAlphas,B.vertexTangents=D.vertexTangents,B.toneMapping=D.toneMapping}function dg(M,D,B,z,N){D.isScene!==!0&&(D=Ue),w.resetTextureUnits();let ne=D.fog,pe=z.isMeshStandardMaterial?D.environment:null,ye=E===null?y.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:zi,Se=(z.isMeshStandardMaterial?O:_).get(z.envMap||pe),Ie=z.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,De=!!B.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),be=!!B.morphAttributes.position,st=!!B.morphAttributes.normal,ct=!!B.morphAttributes.color,ft=Ii;z.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(ft=y.toneMapping);let cn=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,et=cn!==void 0?cn.length:0,we=Re.get(z),Dt=f.state.lights;if(q===!0&&(Q===!0||M!==k)){let Sn=M===k&&z.id===P;$.setState(z,M,Sn)}let tt=!1;z.version===we.__version?(we.needsLights&&we.lightsStateVersion!==Dt.state.version||we.outputColorSpace!==ye||N.isBatchedMesh&&we.batching===!1||!N.isBatchedMesh&&we.batching===!0||N.isBatchedMesh&&we.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&we.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&we.instancing===!1||!N.isInstancedMesh&&we.instancing===!0||N.isSkinnedMesh&&we.skinning===!1||!N.isSkinnedMesh&&we.skinning===!0||N.isInstancedMesh&&we.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&we.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&we.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&we.instancingMorph===!1&&N.morphTexture!==null||we.envMap!==Se||z.fog===!0&&we.fog!==ne||we.numClippingPlanes!==void 0&&(we.numClippingPlanes!==$.numPlanes||we.numIntersection!==$.numIntersection)||we.vertexAlphas!==Ie||we.vertexTangents!==De||we.morphTargets!==be||we.morphNormals!==st||we.morphColors!==ct||we.toneMapping!==ft||we.morphTargetsCount!==et)&&(tt=!0):(tt=!0,we.__version=z.version);let In=we.currentProgram;tt===!0&&(In=Fo(z,D,N));let ys=!1,un=!1,Ul=!1,mt=In.getUniforms(),Si=we.uniforms;if(Ce.useProgram(In.program)&&(ys=!0,un=!0,Ul=!0),z.id!==P&&(P=z.id,un=!0),ys||k!==M){Xe.reverseDepthBuffer?(ve.copy(M.projectionMatrix),ov(ve),av(ve),mt.setValue(R,"projectionMatrix",ve)):mt.setValue(R,"projectionMatrix",M.projectionMatrix),mt.setValue(R,"viewMatrix",M.matrixWorldInverse);let Sn=mt.map.cameraPosition;Sn!==void 0&&Sn.setValue(R,Ee.setFromMatrixPosition(M.matrixWorld)),Xe.logarithmicDepthBuffer&&mt.setValue(R,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&mt.setValue(R,"isOrthographic",M.isOrthographicCamera===!0),k!==M&&(k=M,un=!0,Ul=!0)}if(N.isSkinnedMesh){mt.setOptional(R,N,"bindMatrix"),mt.setOptional(R,N,"bindMatrixInverse");let Sn=N.skeleton;Sn&&(Sn.boneTexture===null&&Sn.computeBoneTexture(),mt.setValue(R,"boneTexture",Sn.boneTexture,w))}N.isBatchedMesh&&(mt.setOptional(R,N,"batchingTexture"),mt.setValue(R,"batchingTexture",N._matricesTexture,w),mt.setOptional(R,N,"batchingIdTexture"),mt.setValue(R,"batchingIdTexture",N._indirectTexture,w),mt.setOptional(R,N,"batchingColorTexture"),N._colorsTexture!==null&&mt.setValue(R,"batchingColorTexture",N._colorsTexture,w));let Ol=B.morphAttributes;if((Ol.position!==void 0||Ol.normal!==void 0||Ol.color!==void 0)&&Le.update(N,B,In),(un||we.receiveShadow!==N.receiveShadow)&&(we.receiveShadow=N.receiveShadow,mt.setValue(R,"receiveShadow",N.receiveShadow)),z.isMeshGouraudMaterial&&z.envMap!==null&&(Si.envMap.value=Se,Si.flipEnvMap.value=Se.isCubeTexture&&Se.isRenderTargetTexture===!1?-1:1),z.isMeshStandardMaterial&&z.envMap===null&&D.environment!==null&&(Si.envMapIntensity.value=D.environmentIntensity),un&&(mt.setValue(R,"toneMappingExposure",y.toneMappingExposure),we.needsLights&&fg(Si,Ul),ne&&z.fog===!0&&re.refreshFogUniforms(Si,ne),re.refreshMaterialUniforms(Si,z,ee,H,f.state.transmissionRenderTarget[M.id]),qs.upload(R,Ld(we),Si,w)),z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(qs.upload(R,Ld(we),Si,w),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&mt.setValue(R,"center",N.center),mt.setValue(R,"modelViewMatrix",N.modelViewMatrix),mt.setValue(R,"normalMatrix",N.normalMatrix),mt.setValue(R,"modelMatrix",N.matrixWorld),z.isShaderMaterial||z.isRawShaderMaterial){let Sn=z.uniformsGroups;for(let Fl=0,mg=Sn.length;Fl<mg;Fl++){let Dd=Sn[Fl];I.update(Dd,In),I.bind(Dd,In)}}return In}function fg(M,D){M.ambientLightColor.needsUpdate=D,M.lightProbe.needsUpdate=D,M.directionalLights.needsUpdate=D,M.directionalLightShadows.needsUpdate=D,M.pointLights.needsUpdate=D,M.pointLightShadows.needsUpdate=D,M.spotLights.needsUpdate=D,M.spotLightShadows.needsUpdate=D,M.rectAreaLights.needsUpdate=D,M.hemisphereLights.needsUpdate=D}function pg(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return L},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(M,D,B){Re.get(M.texture).__webglTexture=D,Re.get(M.depthTexture).__webglTexture=B;let z=Re.get(M);z.__hasExternalTextures=!0,z.__autoAllocateDepthBuffer=B===void 0,z.__autoAllocateDepthBuffer||He.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),z.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(M,D){let B=Re.get(M);B.__webglFramebuffer=D,B.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(M,D=0,B=0){E=M,L=D,A=B;let z=!0,N=null,ne=!1,pe=!1;if(M){let Se=Re.get(M);if(Se.__useDefaultFramebuffer!==void 0)Ce.bindFramebuffer(R.FRAMEBUFFER,null),z=!1;else if(Se.__webglFramebuffer===void 0)w.setupRenderTarget(M);else if(Se.__hasExternalTextures)w.rebindTextures(M,Re.get(M.texture).__webglTexture,Re.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){let be=M.depthTexture;if(Se.__boundDepthTexture!==be){if(be!==null&&Re.has(be)&&(M.width!==be.image.width||M.height!==be.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");w.setupDepthRenderbuffer(M)}}let Ie=M.texture;(Ie.isData3DTexture||Ie.isDataArrayTexture||Ie.isCompressedArrayTexture)&&(pe=!0);let De=Re.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(De[D])?N=De[D][B]:N=De[D],ne=!0):M.samples>0&&w.useMultisampledRTT(M)===!1?N=Re.get(M).__webglMultisampledFramebuffer:Array.isArray(De)?N=De[B]:N=De,v.copy(M.viewport),S.copy(M.scissor),U=M.scissorTest}else v.copy(ue).multiplyScalar(ee).floor(),S.copy(ge).multiplyScalar(ee).floor(),U=ke;if(Ce.bindFramebuffer(R.FRAMEBUFFER,N)&&z&&Ce.drawBuffers(M,N),Ce.viewport(v),Ce.scissor(S),Ce.setScissorTest(U),ne){let Se=Re.get(M.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+D,Se.__webglTexture,B)}else if(pe){let Se=Re.get(M.texture),Ie=D||0;R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,Se.__webglTexture,B||0,Ie)}P=-1},this.readRenderTargetPixels=function(M,D,B,z,N,ne,pe){if(!(M&&M.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ye=Re.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&pe!==void 0&&(ye=ye[pe]),ye){Ce.bindFramebuffer(R.FRAMEBUFFER,ye);try{let Se=M.texture,Ie=Se.format,De=Se.type;if(!Xe.textureFormatReadable(Ie)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Xe.textureTypeReadable(De)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=M.width-z&&B>=0&&B<=M.height-N&&R.readPixels(D,B,z,N,Ne.convert(Ie),Ne.convert(De),ne)}finally{let Se=E!==null?Re.get(E).__webglFramebuffer:null;Ce.bindFramebuffer(R.FRAMEBUFFER,Se)}}},this.readRenderTargetPixelsAsync=async function(M,D,B,z,N,ne,pe){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ye=Re.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&pe!==void 0&&(ye=ye[pe]),ye){let Se=M.texture,Ie=Se.format,De=Se.type;if(!Xe.textureFormatReadable(Ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Xe.textureTypeReadable(De))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(D>=0&&D<=M.width-z&&B>=0&&B<=M.height-N){Ce.bindFramebuffer(R.FRAMEBUFFER,ye);let be=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,be),R.bufferData(R.PIXEL_PACK_BUFFER,ne.byteLength,R.STREAM_READ),R.readPixels(D,B,z,N,Ne.convert(Ie),Ne.convert(De),0);let st=E!==null?Re.get(E).__webglFramebuffer:null;Ce.bindFramebuffer(R.FRAMEBUFFER,st);let ct=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await rv(R,ct,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,be),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,ne),R.deleteBuffer(be),R.deleteSync(ct),ne}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(M,D=null,B=0){M.isTexture!==!0&&(ba("WebGLRenderer: copyFramebufferToTexture function signature has changed."),D=arguments[0]||null,M=arguments[1]);let z=Math.pow(2,-B),N=Math.floor(M.image.width*z),ne=Math.floor(M.image.height*z),pe=D!==null?D.x:0,ye=D!==null?D.y:0;w.setTexture2D(M,0),R.copyTexSubImage2D(R.TEXTURE_2D,B,0,0,pe,ye,N,ne),Ce.unbindTexture()},this.copyTextureToTexture=function(M,D,B=null,z=null,N=0){M.isTexture!==!0&&(ba("WebGLRenderer: copyTextureToTexture function signature has changed."),z=arguments[0]||null,M=arguments[1],D=arguments[2],N=arguments[3]||0,B=null);let ne,pe,ye,Se,Ie,De;B!==null?(ne=B.max.x-B.min.x,pe=B.max.y-B.min.y,ye=B.min.x,Se=B.min.y):(ne=M.image.width,pe=M.image.height,ye=0,Se=0),z!==null?(Ie=z.x,De=z.y):(Ie=0,De=0);let be=Ne.convert(D.format),st=Ne.convert(D.type);w.setTexture2D(D,0),R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,D.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,D.unpackAlignment);let ct=R.getParameter(R.UNPACK_ROW_LENGTH),ft=R.getParameter(R.UNPACK_IMAGE_HEIGHT),cn=R.getParameter(R.UNPACK_SKIP_PIXELS),et=R.getParameter(R.UNPACK_SKIP_ROWS),we=R.getParameter(R.UNPACK_SKIP_IMAGES),Dt=M.isCompressedTexture?M.mipmaps[N]:M.image;R.pixelStorei(R.UNPACK_ROW_LENGTH,Dt.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,Dt.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,ye),R.pixelStorei(R.UNPACK_SKIP_ROWS,Se),M.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,N,Ie,De,ne,pe,be,st,Dt.data):M.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,N,Ie,De,Dt.width,Dt.height,be,Dt.data):R.texSubImage2D(R.TEXTURE_2D,N,Ie,De,ne,pe,be,st,Dt),R.pixelStorei(R.UNPACK_ROW_LENGTH,ct),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,ft),R.pixelStorei(R.UNPACK_SKIP_PIXELS,cn),R.pixelStorei(R.UNPACK_SKIP_ROWS,et),R.pixelStorei(R.UNPACK_SKIP_IMAGES,we),N===0&&D.generateMipmaps&&R.generateMipmap(R.TEXTURE_2D),Ce.unbindTexture()},this.copyTextureToTexture3D=function(M,D,B=null,z=null,N=0){M.isTexture!==!0&&(ba("WebGLRenderer: copyTextureToTexture3D function signature has changed."),B=arguments[0]||null,z=arguments[1]||null,M=arguments[2],D=arguments[3],N=arguments[4]||0);let ne,pe,ye,Se,Ie,De,be,st,ct,ft=M.isCompressedTexture?M.mipmaps[N]:M.image;B!==null?(ne=B.max.x-B.min.x,pe=B.max.y-B.min.y,ye=B.max.z-B.min.z,Se=B.min.x,Ie=B.min.y,De=B.min.z):(ne=ft.width,pe=ft.height,ye=ft.depth,Se=0,Ie=0,De=0),z!==null?(be=z.x,st=z.y,ct=z.z):(be=0,st=0,ct=0);let cn=Ne.convert(D.format),et=Ne.convert(D.type),we;if(D.isData3DTexture)w.setTexture3D(D,0),we=R.TEXTURE_3D;else if(D.isDataArrayTexture||D.isCompressedArrayTexture)w.setTexture2DArray(D,0),we=R.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,D.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,D.unpackAlignment);let Dt=R.getParameter(R.UNPACK_ROW_LENGTH),tt=R.getParameter(R.UNPACK_IMAGE_HEIGHT),In=R.getParameter(R.UNPACK_SKIP_PIXELS),ys=R.getParameter(R.UNPACK_SKIP_ROWS),un=R.getParameter(R.UNPACK_SKIP_IMAGES);R.pixelStorei(R.UNPACK_ROW_LENGTH,ft.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,ft.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Se),R.pixelStorei(R.UNPACK_SKIP_ROWS,Ie),R.pixelStorei(R.UNPACK_SKIP_IMAGES,De),M.isDataTexture||M.isData3DTexture?R.texSubImage3D(we,N,be,st,ct,ne,pe,ye,cn,et,ft.data):D.isCompressedArrayTexture?R.compressedTexSubImage3D(we,N,be,st,ct,ne,pe,ye,cn,ft.data):R.texSubImage3D(we,N,be,st,ct,ne,pe,ye,cn,et,ft),R.pixelStorei(R.UNPACK_ROW_LENGTH,Dt),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,tt),R.pixelStorei(R.UNPACK_SKIP_PIXELS,In),R.pixelStorei(R.UNPACK_SKIP_ROWS,ys),R.pixelStorei(R.UNPACK_SKIP_IMAGES,un),N===0&&D.generateMipmaps&&R.generateMipmap(we),Ce.unbindTexture()},this.initRenderTarget=function(M){Re.get(M).__webglFramebuffer===void 0&&w.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?w.setTextureCube(M,0):M.isData3DTexture?w.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?w.setTexture2DArray(M,0):w.setTexture2D(M,0),Ce.unbindTexture()},this.resetState=function(){L=0,A=0,E=null,Ce.reset(),Ze.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return gi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=e===mh?"display-p3":"srgb",t.unpackColorSpace=Je.workingColorSpace===el?"display-p3":"srgb"}};var Fa=class n{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new Me(e),this.near=t,this.far=i}clone(){return new n(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},tr=class extends Xt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Yn,this.environmentIntensity=1,this.environmentRotation=new Yn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var nr=class extends Ct{constructor(e=null,t=1,i=1,s,r,o,a,l,c=_t,u=_t,h,d){super(null,o,a,l,c,u,s,r,h,d),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Bi=class extends vi{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Me(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},kf=new $e,Du=new jr,pa=new Js,ma=new C,Kr=class extends Xt{constructor(e=new bt,t=new Bi){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let i=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),pa.copy(i.boundingSphere),pa.applyMatrix4(s),pa.radius+=r,e.ray.intersectsSphere(pa)===!1)return;kf.copy(s).invert(),Du.copy(e.ray).applyMatrix4(kf);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=i.index,h=i.attributes.position;if(c!==null){let d=Math.max(0,o.start),p=Math.min(c.count,o.start+o.count);for(let g=d,x=p;g<x;g++){let f=c.getX(g);ma.fromBufferAttribute(h,f),Hf(ma,f,l,s,e,t,this)}}else{let d=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let g=d,x=p;g<x;g++)ma.fromBufferAttribute(h,g),Hf(ma,g,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Hf(n,e,t,i,s,r,o){let a=Du.distanceSqToPoint(n);if(a<t){let l=new C;Du.closestPointToPoint(n,l),l.applyMatrix4(i);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var Qr=class extends Ct{constructor(e,t,i,s,r,o,a,l,c){super(e,t,i,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Fn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],i,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)i=this.getPoint(o/e),r+=i.distanceTo(s),t.push(r),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let i=this.getLengths(),s=0,r=i.length,o;t?o=t:o=e*i[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=i[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,i[s]===o)return s/(r-1);let u=i[s],d=i[s+1]-u,p=(o-u)/d;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=t||(o.isVector2?new se:new C);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){let i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t){let i=new C,s=[],r=[],o=[],a=new C,l=new $e;for(let p=0;p<=e;p++){let g=p/e;s[p]=this.getTangentAt(g,new C)}r[0]=new C,o[0]=new C;let c=Number.MAX_VALUE,u=Math.abs(s[0].x),h=Math.abs(s[0].y),d=Math.abs(s[0].z);u<=c&&(c=u,i.set(1,0,0)),h<=c&&(c=h,i.set(0,1,0)),d<=c&&i.set(0,0,1),a.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),o[p]=o[p-1].clone(),a.crossVectors(s[p-1],s[p]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(Nt(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(a,g))}o[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos(Nt(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(p=-p);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],p*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Ba=class extends Fn{constructor(e=0,t=0,i=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new se){let i=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),d=l-this.aX,p=c-this.aY;l=d*u-p*h+this.aX,c=d*h+p*u+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Nu=class extends Ba{constructor(e,t,i,s,r,o){super(e,t,i,i,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function vh(){let n=0,e=0,t=0,i=0;function s(r,o,a,l){n=r,e=a,t=-3*r+3*o-2*a-l,i=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,u,h){let d=(o-r)/c-(a-r)/(c+u)+(a-o)/u,p=(a-o)/u-(l-o)/(u+h)+(l-a)/h;d*=u,p*=u,s(o,a,d,p)},calc:function(r){let o=r*r,a=o*r;return n+e*r+t*o+i*a}}}var ga=new C,Ec=new vh,Ac=new vh,Cc=new vh,$r=class extends Fn{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new C){let i=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,u;this.closed||a>0?c=s[(a-1)%r]:(ga.subVectors(s[0],s[1]).add(s[0]),c=ga);let h=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?u=s[(a+2)%r]:(ga.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=ga),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(h),p),x=Math.pow(h.distanceToSquared(d),p),f=Math.pow(d.distanceToSquared(u),p);x<1e-4&&(x=1),g<1e-4&&(g=x),f<1e-4&&(f=x),Ec.initNonuniformCatmullRom(c.x,h.x,d.x,u.x,g,x,f),Ac.initNonuniformCatmullRom(c.y,h.y,d.y,u.y,g,x,f),Cc.initNonuniformCatmullRom(c.z,h.z,d.z,u.z,g,x,f)}else this.curveType==="catmullrom"&&(Ec.initCatmullRom(c.x,h.x,d.x,u.x,this.tension),Ac.initCatmullRom(c.y,h.y,d.y,u.y,this.tension),Cc.initCatmullRom(c.z,h.z,d.z,u.z,this.tension));return i.set(Ec.calc(l),Ac.calc(l),Cc.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(new C().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Vf(n,e,t,i,s){let r=(i-e)*.5,o=(s-t)*.5,a=n*n,l=n*a;return(2*t-2*i+r+o)*l+(-3*t+3*i-2*r-o)*a+r*n+t}function tS(n,e){let t=1-n;return t*t*e}function nS(n,e){return 2*(1-n)*n*e}function iS(n,e){return n*n*e}function Wr(n,e,t,i){return tS(n,e)+nS(n,t)+iS(n,i)}function sS(n,e){let t=1-n;return t*t*t*e}function rS(n,e){let t=1-n;return 3*t*t*n*e}function oS(n,e){return 3*(1-n)*n*n*e}function aS(n,e){return n*n*n*e}function Xr(n,e,t,i,s){return sS(n,e)+rS(n,t)+oS(n,i)+aS(n,s)}var Uu=class extends Fn{constructor(e=new se,t=new se,i=new se,s=new se){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new se){let i=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return i.set(Xr(e,s.x,r.x,o.x,a.x),Xr(e,s.y,r.y,o.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Ou=class extends Fn{constructor(e=new C,t=new C,i=new C,s=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new C){let i=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return i.set(Xr(e,s.x,r.x,o.x,a.x),Xr(e,s.y,r.y,o.y,a.y),Xr(e,s.z,r.z,o.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Fu=class extends Fn{constructor(e=new se,t=new se){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new se){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new se){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Bu=class extends Fn{constructor(e=new C,t=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new C){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new C){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},zu=class extends Fn{constructor(e=new se,t=new se,i=new se){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new se){let i=t,s=this.v0,r=this.v1,o=this.v2;return i.set(Wr(e,s.x,r.x,o.x),Wr(e,s.y,r.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},za=class extends Fn{constructor(e=new C,t=new C,i=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new C){let i=t,s=this.v0,r=this.v1,o=this.v2;return i.set(Wr(e,s.x,r.x,o.x),Wr(e,s.y,r.y,o.y),Wr(e,s.z,r.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ku=class extends Fn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new se){let i=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],u=s[o>s.length-2?s.length-1:o+1],h=s[o>s.length-3?s.length-1:o+2];return i.set(Vf(a,l.x,c.x,u.x,h.x),Vf(a,l.y,c.y,u.y,h.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(new se().fromArray(s))}return this}},lS=Object.freeze({__proto__:null,ArcCurve:Nu,CatmullRomCurve3:$r,CubicBezierCurve:Uu,CubicBezierCurve3:Ou,EllipseCurve:Ba,LineCurve:Fu,LineCurve3:Bu,QuadraticBezierCurve:zu,QuadraticBezierCurve3:za,SplineCurve:ku});var Bn=class n extends bt{constructor(e=1,t=1,i=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let u=[],h=[],d=[],p=[],g=0,x=[],f=i/2,m=0;b(),o===!1&&(e>0&&y(!0),t>0&&y(!1)),this.setIndex(u),this.setAttribute("position",new nt(h,3)),this.setAttribute("normal",new nt(d,3)),this.setAttribute("uv",new nt(p,2));function b(){let T=new C,L=new C,A=0,E=(t-e)/i;for(let P=0;P<=r;P++){let k=[],v=P/r,S=v*(t-e)+e;for(let U=0;U<=s;U++){let F=U/s,V=F*l+a,J=Math.sin(V),H=Math.cos(V);L.x=S*J,L.y=-v*i+f,L.z=S*H,h.push(L.x,L.y,L.z),T.set(J,E,H).normalize(),d.push(T.x,T.y,T.z),p.push(F,1-v),k.push(g++)}x.push(k)}for(let P=0;P<s;P++)for(let k=0;k<r;k++){let v=x[k][P],S=x[k+1][P],U=x[k+1][P+1],F=x[k][P+1];e>0&&(u.push(v,S,F),A+=3),t>0&&(u.push(S,U,F),A+=3)}c.addGroup(m,A,0),m+=A}function y(T){let L=g,A=new se,E=new C,P=0,k=T===!0?e:t,v=T===!0?1:-1;for(let U=1;U<=s;U++)h.push(0,f*v,0),d.push(0,v,0),p.push(.5,.5),g++;let S=g;for(let U=0;U<=s;U++){let V=U/s*l+a,J=Math.cos(V),H=Math.sin(V);E.x=k*H,E.y=f*v,E.z=k*J,h.push(E.x,E.y,E.z),d.push(0,v,0),A.x=J*.5+.5,A.y=H*.5*v+.5,p.push(A.x,A.y),g++}for(let U=0;U<s;U++){let F=L+U,V=S+U;T===!0?u.push(V,V+1,F):u.push(V+1,V,F),P+=3}c.addGroup(m,P,T===!0?1:2),m+=P}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},eo=class n extends Bn{constructor(e=1,t=1,i=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,i,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new n(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Hu=class n extends bt{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};let r=[],o=[];a(s),c(i),u(),this.setAttribute("position",new nt(r,3)),this.setAttribute("normal",new nt(r.slice(),3)),this.setAttribute("uv",new nt(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(b){let y=new C,T=new C,L=new C;for(let A=0;A<t.length;A+=3)p(t[A+0],y),p(t[A+1],T),p(t[A+2],L),l(y,T,L,b)}function l(b,y,T,L){let A=L+1,E=[];for(let P=0;P<=A;P++){E[P]=[];let k=b.clone().lerp(T,P/A),v=y.clone().lerp(T,P/A),S=A-P;for(let U=0;U<=S;U++)U===0&&P===A?E[P][U]=k:E[P][U]=k.clone().lerp(v,U/S)}for(let P=0;P<A;P++)for(let k=0;k<2*(A-P)-1;k++){let v=Math.floor(k/2);k%2===0?(d(E[P][v+1]),d(E[P+1][v]),d(E[P][v])):(d(E[P][v+1]),d(E[P+1][v+1]),d(E[P+1][v]))}}function c(b){let y=new C;for(let T=0;T<r.length;T+=3)y.x=r[T+0],y.y=r[T+1],y.z=r[T+2],y.normalize().multiplyScalar(b),r[T+0]=y.x,r[T+1]=y.y,r[T+2]=y.z}function u(){let b=new C;for(let y=0;y<r.length;y+=3){b.x=r[y+0],b.y=r[y+1],b.z=r[y+2];let T=f(b)/2/Math.PI+.5,L=m(b)/Math.PI+.5;o.push(T,1-L)}g(),h()}function h(){for(let b=0;b<o.length;b+=6){let y=o[b+0],T=o[b+2],L=o[b+4],A=Math.max(y,T,L),E=Math.min(y,T,L);A>.9&&E<.1&&(y<.2&&(o[b+0]+=1),T<.2&&(o[b+2]+=1),L<.2&&(o[b+4]+=1))}}function d(b){r.push(b.x,b.y,b.z)}function p(b,y){let T=b*3;y.x=e[T+0],y.y=e[T+1],y.z=e[T+2]}function g(){let b=new C,y=new C,T=new C,L=new C,A=new se,E=new se,P=new se;for(let k=0,v=0;k<r.length;k+=9,v+=6){b.set(r[k+0],r[k+1],r[k+2]),y.set(r[k+3],r[k+4],r[k+5]),T.set(r[k+6],r[k+7],r[k+8]),A.set(o[v+0],o[v+1]),E.set(o[v+2],o[v+3]),P.set(o[v+4],o[v+5]),L.copy(b).add(y).add(T).divideScalar(3);let S=f(L);x(A,v+0,b,S),x(E,v+2,y,S),x(P,v+4,T,S)}}function x(b,y,T,L){L<0&&b.x===1&&(o[y]=b.x-1),T.x===0&&T.z===0&&(o[y]=L/2/Math.PI+.5)}function f(b){return Math.atan2(b.z,-b.x)}function m(b){return Math.atan2(-b.y,Math.sqrt(b.x*b.x+b.z*b.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.vertices,e.indices,e.radius,e.details)}};var ka=class n extends Hu{constructor(e=1,t=0){let i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,s,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new n(e.radius,e.detail)}},to=class n extends bt{constructor(e=.5,t=1,i=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:o},i=Math.max(3,i),s=Math.max(1,s);let a=[],l=[],c=[],u=[],h=e,d=(t-e)/s,p=new C,g=new se;for(let x=0;x<=s;x++){for(let f=0;f<=i;f++){let m=r+f/i*o;p.x=h*Math.cos(m),p.y=h*Math.sin(m),l.push(p.x,p.y,p.z),c.push(0,0,1),g.x=(p.x/t+1)/2,g.y=(p.y/t+1)/2,u.push(g.x,g.y)}h+=d}for(let x=0;x<s;x++){let f=x*(i+1);for(let m=0;m<i;m++){let b=m+f,y=b,T=b+i+1,L=b+i+2,A=b+1;a.push(y,T,A),a.push(T,L,A)}}this.setIndex(a),this.setAttribute("position",new nt(l,3)),this.setAttribute("normal",new nt(c,3)),this.setAttribute("uv",new nt(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}};var no=class n extends bt{constructor(e=1,t=32,i=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));let l=Math.min(o+a,Math.PI),c=0,u=[],h=new C,d=new C,p=[],g=[],x=[],f=[];for(let m=0;m<=i;m++){let b=[],y=m/i,T=0;m===0&&o===0?T=.5/t:m===i&&l===Math.PI&&(T=-.5/t);for(let L=0;L<=t;L++){let A=L/t;h.x=-e*Math.cos(s+A*r)*Math.sin(o+y*a),h.y=e*Math.cos(o+y*a),h.z=e*Math.sin(s+A*r)*Math.sin(o+y*a),g.push(h.x,h.y,h.z),d.copy(h).normalize(),x.push(d.x,d.y,d.z),f.push(A+T,1-y),b.push(c++)}u.push(b)}for(let m=0;m<i;m++)for(let b=0;b<t;b++){let y=u[m][b+1],T=u[m][b],L=u[m+1][b],A=u[m+1][b+1];(m!==0||o>0)&&p.push(y,T,A),(m!==i-1||l<Math.PI)&&p.push(T,L,A)}this.setIndex(p),this.setAttribute("position",new nt(g,3)),this.setAttribute("normal",new nt(x,3)),this.setAttribute("uv",new nt(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var ir=class n extends bt{constructor(e=1,t=.4,i=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:r},i=Math.floor(i),s=Math.floor(s);let o=[],a=[],l=[],c=[],u=new C,h=new C,d=new C;for(let p=0;p<=i;p++)for(let g=0;g<=s;g++){let x=g/s*r,f=p/i*Math.PI*2;h.x=(e+t*Math.cos(f))*Math.cos(x),h.y=(e+t*Math.cos(f))*Math.sin(x),h.z=t*Math.sin(f),a.push(h.x,h.y,h.z),u.x=e*Math.cos(x),u.y=e*Math.sin(x),d.subVectors(h,u).normalize(),l.push(d.x,d.y,d.z),c.push(g/s),c.push(p/i)}for(let p=1;p<=i;p++)for(let g=1;g<=s;g++){let x=(s+1)*p+g-1,f=(s+1)*(p-1)+g-1,m=(s+1)*(p-1)+g,b=(s+1)*p+g;o.push(x,f,b),o.push(f,m,b)}this.setIndex(o),this.setAttribute("position",new nt(a,3)),this.setAttribute("normal",new nt(l,3)),this.setAttribute("uv",new nt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var Ha=class n extends bt{constructor(e=new za(new C(-1,-1,0),new C(-1,1,0),new C(1,1,0)),t=64,i=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:i,radialSegments:s,closed:r};let o=e.computeFrenetFrames(t,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new C,l=new C,c=new se,u=new C,h=[],d=[],p=[],g=[];x(),this.setIndex(g),this.setAttribute("position",new nt(h,3)),this.setAttribute("normal",new nt(d,3)),this.setAttribute("uv",new nt(p,2));function x(){for(let y=0;y<t;y++)f(y);f(r===!1?t:0),b(),m()}function f(y){u=e.getPointAt(y/t,u);let T=o.normals[y],L=o.binormals[y];for(let A=0;A<=s;A++){let E=A/s*Math.PI*2,P=Math.sin(E),k=-Math.cos(E);l.x=k*T.x+P*L.x,l.y=k*T.y+P*L.y,l.z=k*T.z+P*L.z,l.normalize(),d.push(l.x,l.y,l.z),a.x=u.x+i*l.x,a.y=u.y+i*l.y,a.z=u.z+i*l.z,h.push(a.x,a.y,a.z)}}function m(){for(let y=1;y<=t;y++)for(let T=1;T<=s;T++){let L=(s+1)*(y-1)+(T-1),A=(s+1)*y+(T-1),E=(s+1)*y+T,P=(s+1)*(y-1)+T;g.push(L,A,P),g.push(A,E,P)}}function b(){for(let y=0;y<=t;y++)for(let T=0;T<=s;T++)c.x=y/t,c.y=T/s,p.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new n(new lS[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}};var Va=class extends rt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Kt=class extends vi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Me(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Me(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ph,this.normalScale=new se(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},io=class extends Kt{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new se(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Nt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Me(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Me(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Me(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var Ga=class extends vi{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ph,this.normalScale=new se(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}};function va(n,e,t){return!n||!t&&n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function cS(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}var sr=class{constructor(e,t,i,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,s=t[i],r=t[i-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=i+2;;){if(s===void 0){if(e<r)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(r=s,s=t[++i],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(i=2,r=a);for(let l=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(s=r,r=t[--i-1],e>=r)break e}o=i,i=0;break t}break n}for(;i<o;){let a=i+o>>>1;e<t[a]?o=a:i=a+1}if(s=t[i],r=t[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=i[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Vu=class extends sr{constructor(e,t,i,s){super(e,t,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Yd,endingEnd:Yd}}intervalChanged_(e,t,i){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case jd:r=e,a=2*t-i;break;case Zd:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=i}if(l===void 0)switch(this.getSettings_().endingEnd){case jd:o=e,l=2*i-t;break;case Zd:o=1,l=i+s[1]-s[0];break;default:o=e-1,l=t}let c=(i-t)*.5,u=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-i),this._offsetPrev=r*u,this._offsetNext=o*u}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this._offsetPrev,h=this._offsetNext,d=this._weightPrev,p=this._weightNext,g=(i-t)/(s-t),x=g*g,f=x*g,m=-d*f+2*d*x-d*g,b=(1+d)*f+(-1.5-2*d)*x+(-.5+d)*g+1,y=(-1-p)*f+(1.5+p)*x+.5*g,T=p*f-p*x;for(let L=0;L!==a;++L)r[L]=m*o[u+L]+b*o[c+L]+y*o[l+L]+T*o[h+L];return r}},Gu=class extends sr{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=(i-t)/(s-t),h=1-u;for(let d=0;d!==a;++d)r[d]=o[c+d]*h+o[l+d]*u;return r}},Wu=class extends sr{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e){return this.copySampleValue_(e-1)}},zn=class{constructor(e,t,i,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=va(t,this.TimeBufferType),this.values=va(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:va(e.times,Array),values:va(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(i.interpolation=s)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new Wu(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Gu(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Vu(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Ta:t=this.InterpolantFactoryMethodDiscrete;break;case mu:t=this.InterpolantFactoryMethodLinear;break;case Jl:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ta;case this.InterpolantFactoryMethodLinear:return mu;case this.InterpolantFactoryMethodSmooth:return Jl}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]*=e}return this}trim(e,t){let i=this.times,s=i.length,r=0,o=s-1;for(;r!==s&&i[r]<e;)++r;for(;o!==-1&&i[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=i.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,s=this.values,r=i.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=i[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&cS(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===Jl,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],u=e[a+1];if(c!==u&&(a!==1||c!==e[0]))if(s)l=!0;else{let h=a*i,d=h-i,p=h+i;for(let g=0;g!==i;++g){let x=t[h+g];if(x!==t[d+g]||x!==t[p+g]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let h=a*i,d=o*i;for(let p=0;p!==i;++p)t[d+p]=t[h+p]}++o}}if(r>0){e[o]=e[r];for(let a=r*i,l=o*i,c=0;c!==i;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,s=new i(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};zn.prototype.TimeBufferType=Float32Array;zn.prototype.ValueBufferType=Float32Array;zn.prototype.DefaultInterpolation=mu;var us=class extends zn{constructor(e,t,i){super(e,t,i)}};us.prototype.ValueTypeName="bool";us.prototype.ValueBufferType=Array;us.prototype.DefaultInterpolation=Ta;us.prototype.InterpolantFactoryMethodLinear=void 0;us.prototype.InterpolantFactoryMethodSmooth=void 0;var Xu=class extends zn{};Xu.prototype.ValueTypeName="color";var qu=class extends zn{};qu.prototype.ValueTypeName="number";var Yu=class extends sr{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(i-t)/(s-t),c=e*a;for(let u=c+a;c!==u;c+=4)Fi.slerpFlat(r,0,o,c-a,o,c,l);return r}},Wa=class extends zn{InterpolantFactoryMethodLinear(e){return new Yu(this.times,this.values,this.getValueSize(),e)}};Wa.prototype.ValueTypeName="quaternion";Wa.prototype.InterpolantFactoryMethodSmooth=void 0;var hs=class extends zn{constructor(e,t,i){super(e,t,i)}};hs.prototype.ValueTypeName="string";hs.prototype.ValueBufferType=Array;hs.prototype.DefaultInterpolation=Ta;hs.prototype.InterpolantFactoryMethodLinear=void 0;hs.prototype.InterpolantFactoryMethodSmooth=void 0;var ju=class extends zn{};ju.prototype.ValueTypeName="vector";var Gf={enabled:!1,files:{},add:function(n,e){this.enabled!==!1&&(this.files[n]=e)},get:function(n){if(this.enabled!==!1)return this.files[n]},remove:function(n){delete this.files[n]},clear:function(){this.files={}}},Zu=class{constructor(e,t,i){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.itemStart=function(u){a++,r===!1&&s.onStart!==void 0&&s.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,s.onProgress!==void 0&&s.onProgress(u,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){let h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,d=c.length;h<d;h+=2){let p=c[h],g=c[h+1];if(p.global&&(p.lastIndex=0),p.test(u))return g}return null}}},uS=new Zu,so=class{constructor(e){this.manager=e!==void 0?e:uS,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let i=this;return new Promise(function(s,r){i.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};so.DEFAULT_MATERIAL_NAME="__DEFAULT";var Ju=class extends so{constructor(e){super(e)}load(e,t,i,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=Gf.get(e);if(o!==void 0)return r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0),o;let a=Yr("img");function l(){u(),Gf.add(e,this),t&&t(this),r.manager.itemEnd(e)}function c(h){u(),s&&s(h),r.manager.itemError(e),r.manager.itemEnd(e)}function u(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),r.manager.itemStart(e),a.src=e,a}};var Xa=class extends so{constructor(e){super(e)}load(e,t,i,s){let r=new Ct,o=new Ju(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},i,s),r}},ro=class extends Xt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Me(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},qa=class extends ro{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Xt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Me(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Rc=new $e,Wf=new C,Xf=new C,Ya=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new se(512,512),this.map=null,this.mapPass=null,this.matrix=new $e,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Jr,this._frameExtents=new se(1,1),this._viewportCount=1,this._viewports=[new ot(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,i=this.matrix;Wf.setFromMatrixPosition(e.matrixWorld),t.position.copy(Wf),Xf.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Xf),t.updateMatrixWorld(),Rc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Rc),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Rc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var qf=new $e,Hr=new C,Pc=new C,Ku=class extends Ya{constructor(){super(new Vt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new se(4,2),this._viewportCount=6,this._viewports=[new ot(2,1,1,1),new ot(0,1,1,1),new ot(3,1,1,1),new ot(1,1,1,1),new ot(3,0,1,1),new ot(1,0,1,1)],this._cubeDirections=[new C(1,0,0),new C(-1,0,0),new C(0,0,1),new C(0,0,-1),new C(0,1,0),new C(0,-1,0)],this._cubeUps=[new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,0,1),new C(0,0,-1)]}updateMatrices(e,t=0){let i=this.camera,s=this.matrix,r=e.distance||i.far;r!==i.far&&(i.far=r,i.updateProjectionMatrix()),Hr.setFromMatrixPosition(e.matrixWorld),i.position.copy(Hr),Pc.copy(i.position),Pc.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(Pc),i.updateMatrixWorld(),s.makeTranslation(-Hr.x,-Hr.y,-Hr.z),qf.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(qf)}},ja=class extends ro{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new Ku}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},Qu=class extends Ya{constructor(){super(new Qs(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},oo=class extends ro{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Xt.DEFAULT_UP),this.updateMatrix(),this.target=new Xt,this.shadow=new Qu}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var Za=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Yf(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=Yf();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}};function Yf(){return performance.now()}var xh="\\[\\]\\.:\\/",hS=new RegExp("["+xh+"]","g"),yh="[^"+xh+"]",dS="[^"+xh.replace("\\.","")+"]",fS=/((?:WC+[\/:])*)/.source.replace("WC",yh),pS=/(WCOD+)?/.source.replace("WCOD",dS),mS=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",yh),gS=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",yh),vS=new RegExp("^"+fS+pS+mS+gS+"$"),xS=["material","materials","bones","map"],$u=class{constructor(e,t,i){let s=i||ut.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},ut=class n{constructor(e,t,i){this.path=t,this.parsedPath=i||n.parseTrackName(t),this.node=n.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new n.Composite(e,t,i):new n(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(hS,"")}static parseTrackName(e){let t=vS.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);xS.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=i(a.children);if(l)return l}return null},s=i(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)e[t++]=i[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=n.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[s];if(o===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ut.Composite=$u;ut.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ut.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ut.prototype.GetterByBindingType=[ut.prototype._getValue_direct,ut.prototype._getValue_array,ut.prototype._getValue_arrayElement,ut.prototype._getValue_toArray];ut.prototype.SetterByBindingTypeAndVersioning=[[ut.prototype._setValue_direct,ut.prototype._setValue_direct_setNeedsUpdate,ut.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ut.prototype._setValue_array,ut.prototype._setValue_array_setNeedsUpdate,ut.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ut.prototype._setValue_arrayElement,ut.prototype._setValue_arrayElement_setNeedsUpdate,ut.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ut.prototype._setValue_fromArray,ut.prototype._setValue_fromArray_setNeedsUpdate,ut.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var DM=new Float32Array(1);var jf=new $e,Ja=class{constructor(e,t,i=0,s=1/0){this.ray=new jr(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new Zr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return jf.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(jf),this}intersectObject(e,t=!0,i=[]){return eh(e,this,i,t),i.sort(Zf),i}intersectObjects(e,t=!0,i=[]){for(let s=0,r=e.length;s<r;s++)eh(e[s],this,i,t);return i.sort(Zf),i}};function Zf(n,e){return n.distance-e.distance}function eh(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){let r=n.children;for(let o=0,a=r.length;o<a;o++)eh(r[o],e,t,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"169"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="169");var ki={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var Ut=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},_S=new Qs(-1,1,1,-1,0,1),_h=class extends bt{constructor(){super(),this.setAttribute("position",new nt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new nt([0,2,0,0,2,0],2))}},SS=new _h,Cn=class{constructor(e){this._mesh=new Oe(SS,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,_S)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var ds=class extends Ut{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof rt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Rt.clone(e.uniforms),this.material=new rt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new Cn(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}};var co=class extends Ut{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){let s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},nl=class extends Ut{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var il=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let i=e.getSize(new se);this._width=i.width,this._height=i.height,t=new ht(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Et}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new ds(ki),this.copyPass.material.blending=Mt,this.clock=new Za}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());let t=this.renderer.getRenderTarget(),i=!1;for(let s=0,r=this.passes.length;s<r;s++){let o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),o.needsSwap){if(i){let a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}co!==void 0&&(o instanceof co?i=!0:o instanceof nl&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new se);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(i,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var sl=class extends Ut{constructor(e,t,i=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Me}render(e,t,i){let s=e.autoClear;e.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=s}};var xp={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var rl=class extends Ut{constructor(){super();let e=xp;this.uniforms=Rt.clone(e.uniforms),this.material=new Va({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new Cn(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Je.getTransfer(this._outputColorSpace)===at&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===ih?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===sh?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===rh?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===ao?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===oh?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===ah&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}};var uo={name:"GTAOShader",defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:"x",SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new se},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new $e},cameraProjectionMatrixInverse:{value:new $e},cameraWorldMatrix:{value:new $e},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new C(-1,-1,-1)},sceneBoxMax:{value:new C(1,1,1)}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		varying vec2 vUv;
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraProjectionMatrixInverse;		
		uniform mat4 cameraWorldMatrix;
		uniform float radius;
		uniform float distanceExponent;
		uniform float thickness;
		uniform float distanceFallOff;
		uniform float scale;
		#if SCENE_CLIP_BOX == 1
			uniform vec3 sceneBoxMin;
			uniform vec3 sceneBoxMax;
		#endif
		
		#include <common>
		#include <packing>

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(vec3(ao), 1.)
		#endif

		vec3 getViewPosition(const in vec2 screenPosition, const in float depth) {
			vec4 clipSpacePosition = vec4(vec3(screenPosition, depth) * 2.0 - 1.0, 1.0);
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {  
			return textureLod(tDepth, uv.xy, 0.0).DEPTH_SWIZZLING;
		}

		float fetchDepth(const ivec2 uv) {   
			return texelFetch(tDepth, uv.xy, 0).DEPTH_SWIZZLING;
		}

		float getViewZ(const in float depth) {
			#if PERSPECTIVE_CAMERA == 1
				return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
			#else
				return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ? ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ? ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
			#if NORMAL_VECTOR_TYPE == 2
				return normalize(textureLod(tNormal, uv, 0.).rgb);
			#elif NORMAL_VECTOR_TYPE == 1
				return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
			#else
				return computeNormalFromDepth(uv);
			#endif
		}

		vec3 getSceneUvAndDepth(vec3 sampleViewPos) {
			vec4 sampleClipPos = cameraProjectionMatrix * vec4(sampleViewPos, 1.);
			vec2 sampleUv = sampleClipPos.xy / sampleClipPos.w * 0.5 + 0.5;
			float sampleSceneDepth = getDepth(sampleUv);
			return vec3(sampleUv, sampleSceneDepth);
		}
		
		void main() {
			float depth = getDepth(vUv.xy);
			if (depth >= 1.0) {
				discard;
				return;
			}
			vec3 viewPos = getViewPosition(vUv, depth);
			vec3 viewNormal = getViewNormal(vUv);

			float radiusToUse = radius;
			float distanceFalloffToUse = thickness;
			#if SCREEN_SPACE_RADIUS == 1
				float radiusScale = getViewPosition(vec2(0.5 + float(SCREEN_SPACE_RADIUS_SCALE) / resolution.x, 0.0), depth).x;
				radiusToUse *= radiusScale;
				distanceFalloffToUse *= radiusScale;
			#endif

			#if SCENE_CLIP_BOX == 1
				vec3 worldPos = (cameraWorldMatrix * vec4(viewPos, 1.0)).xyz;
				float boxDistance = length(max(vec3(0.0), max(sceneBoxMin - worldPos, worldPos - sceneBoxMax)));
				if (boxDistance > radiusToUse) {
					discard;
					return;
				}
			#endif
			
			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
			vec3 randomVec = noiseTexel.xyz * 2.0 - 1.0;
			vec3 tangent = normalize(vec3(randomVec.xy, 0.));
			vec3 bitangent = vec3(-tangent.y, tangent.x, 0.);
			mat3 kernelMatrix = mat3(tangent, bitangent, vec3(0., 0., 1.));

			const int DIRECTIONS = SAMPLES < 30 ? 3 : 5;
			const int STEPS = (SAMPLES + DIRECTIONS - 1) / DIRECTIONS;
			float ao = 0.0;
			for (int i = 0; i < DIRECTIONS; ++i) {
				
				float angle = float(i) / float(DIRECTIONS) * PI;
				vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w); 
				sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);

				vec3 viewDir = normalize(-viewPos.xyz);
				vec3 sliceBitangent = normalize(cross(sampleDir.xyz, viewDir));
				vec3 sliceTangent = cross(sliceBitangent, viewDir);
				vec3 normalInSlice = normalize(viewNormal - sliceBitangent * dot(viewNormal, sliceBitangent));
				
				vec3 tangentToNormalInSlice = cross(normalInSlice, sliceBitangent);
				vec2 cosHorizons = vec2(dot(viewDir, tangentToNormalInSlice), dot(viewDir, -tangentToNormalInSlice));
				
				for (int j = 0; j < STEPS; ++j) {
					vec3 sampleViewOffset = sampleDir.xyz * radiusToUse * sampleDir.w * pow(float(j + 1) / float(STEPS), distanceExponent);	

					vec3 sampleSceneUvDepth = getSceneUvAndDepth(viewPos + sampleViewOffset);
					vec3 sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					vec3 viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.x += max(0., (sampleCosHorizon - cosHorizons.x) * mix(1., 2. / float(j + 2), distanceFallOff));
					}		

					sampleSceneUvDepth = getSceneUvAndDepth(viewPos - sampleViewOffset);
					sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.y += max(0., (sampleCosHorizon - cosHorizons.y) * mix(1., 2. / float(j + 2), distanceFallOff));
					}
				}

				vec2 sinHorizons = sqrt(1. - cosHorizons * cosHorizons);
				float nx = dot(normalInSlice, sliceTangent);
				float ny = dot(normalInSlice, viewDir);
				float nxb = 1. / 2. * (acos(cosHorizons.y) - acos(cosHorizons.x) + sinHorizons.x * cosHorizons.x - sinHorizons.y * cosHorizons.y);
				float nyb = 1. / 2. * (2. - cosHorizons.x * cosHorizons.x - cosHorizons.y * cosHorizons.y);
				float occlusion = nx * nxb + ny * nyb;
				ao += occlusion;
			}

			ao = clamp(ao / float(DIRECTIONS), 0., 1.);		
		#if SCENE_CLIP_BOX == 1
			ao = mix(ao, 1., smoothstep(0., radiusToUse, boxDistance));
		#endif
			ao = pow(ao, scale);

			gl_FragColor = FRAGMENT_OUTPUT;
		}`},ho={name:"GTAODepthShader",defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform sampler2D tDepth;
		uniform float cameraNear;
		uniform float cameraFar;
		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {
			#if PERSPECTIVE_CAMERA == 1
				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			#else
				return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		void main() {
			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},ol={name:"GTAOBlendShader",uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform float intensity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		void main() {
			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = vec4(mix(vec3(1.), texel.rgb, intensity), texel.a);
		}`};function yp(n=5){let e=Math.floor(n)%2===0?Math.floor(n)+1:Math.floor(n),t=MS(e),i=t.length,s=new Uint8Array(i*4);for(let o=0;o<i;++o){let a=t[o],l=2*Math.PI*a/i,c=new C(Math.cos(l),Math.sin(l),0).normalize();s[o*4]=(c.x*.5+.5)*255,s[o*4+1]=(c.y*.5+.5)*255,s[o*4+2]=127,s[o*4+3]=255}let r=new nr(s,e,e);return r.wrapS=En,r.wrapT=En,r.needsUpdate=!0,r}function MS(n){let e=Math.floor(n)%2===0?Math.floor(n)+1:Math.floor(n),t=e*e,i=Array(t).fill(0),s=Math.floor(e/2),r=e-1;for(let o=1;o<=t;){if(s===-1&&r===e?(r=e-2,s=0):(r===e&&(r=0),s<0&&(s=e-1)),i[s*e+r]!==0){r-=2,s++;continue}else i[s*e+r]=o++;r++,s--}return i}var fo={name:"PoissonDenoiseShader",defines:{SAMPLES:16,SAMPLE_VECTORS:Sh(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new se},cameraProjectionMatrixInverse:{value:new $e},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`

		varying vec2 vUv;

		uniform sampler2D tDiffuse;
		uniform sampler2D tNormal;
		uniform sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform float lumaPhi;
		uniform float depthPhi;
		uniform float normalPhi;
		uniform float radius;
		uniform int index;
		
		#include <common>
		#include <packing>

		#ifndef SAMPLE_LUMINANCE
		#define SAMPLE_LUMINANCE dot(vec3(0.2125, 0.7154, 0.0721), a)
		#endif

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(denoised, 1.)
		#endif

		float getLuminance(const in vec3 a) {
			return SAMPLE_LUMINANCE;
		}

		const vec3 poissonDisk[SAMPLES] = SAMPLE_VECTORS;

		vec3 getViewPosition(const in vec2 screenPosition, const in float depth) {
			vec4 clipSpacePosition = vec4(vec3(screenPosition, depth) * 2.0 - 1.0, 1.0);
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}
		
		float getDepth(const vec2 uv) {
		#if DEPTH_VALUE_SOURCE == 1    
			return textureLod(tDepth, uv.xy, 0.0).a;
		#else
			return textureLod(tDepth, uv.xy, 0.0).r;
		#endif
		}

		float fetchDepth(const ivec2 uv) {
			#if DEPTH_VALUE_SOURCE == 1    
				return texelFetch(tDepth, uv.xy, 0).a;
			#else
				return texelFetch(tDepth, uv.xy, 0).r;
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ?  ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz
									: -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ?  ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz
									: -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
		#if NORMAL_VECTOR_TYPE == 2
			return normalize(textureLod(tNormal, uv, 0.).rgb);
		#elif NORMAL_VECTOR_TYPE == 1
			return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
		#else
			return computeNormalFromDepth(uv);
		#endif
		}

		void denoiseSample(in vec3 center, in vec3 viewNormal, in vec3 viewPos, in vec2 sampleUv, inout vec3 denoised, inout float totalWeight) {
			vec4 sampleTexel = textureLod(tDiffuse, sampleUv, 0.0);
			float sampleDepth = getDepth(sampleUv);
			vec3 sampleNormal = getViewNormal(sampleUv);
			vec3 neighborColor = sampleTexel.rgb;
			vec3 viewPosSample = getViewPosition(sampleUv, sampleDepth);
			
			float normalDiff = dot(viewNormal, sampleNormal);
			float normalSimilarity = pow(max(normalDiff, 0.), normalPhi);
			float lumaDiff = abs(getLuminance(neighborColor) - getLuminance(center));
			float lumaSimilarity = max(1.0 - lumaDiff / lumaPhi, 0.0);
			float depthDiff = abs(dot(viewPos - viewPosSample, viewNormal));
			float depthSimilarity = max(1. - depthDiff / depthPhi, 0.);
			float w = lumaSimilarity * depthSimilarity * normalSimilarity;
		
			denoised += w * neighborColor;
			totalWeight += w;
		}
		
		void main() {
			float depth = getDepth(vUv.xy);	
			vec3 viewNormal = getViewNormal(vUv);	
			if (depth == 1. || dot(viewNormal, viewNormal) == 0.) {
				discard;
				return;
			}
			vec4 texel = textureLod(tDiffuse, vUv, 0.0);
			vec3 center = texel.rgb;
			vec3 viewPos = getViewPosition(vUv, depth);

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
      		vec2 noiseVec = vec2(sin(noiseTexel[index % 4] * 2. * PI), cos(noiseTexel[index % 4] * 2. * PI));
    		mat2 rotationMatrix = mat2(noiseVec.x, -noiseVec.y, noiseVec.x, noiseVec.y);
		
			float totalWeight = 1.0;
			vec3 denoised = texel.rgb;
			for (int i = 0; i < SAMPLES; i++) {
				vec3 sampleDir = poissonDisk[i];
				vec2 offset = rotationMatrix * (sampleDir.xy * (1. + sampleDir.z * (radius - 1.)) / resolution);
				vec2 sampleUv = vUv + offset;
				denoiseSample(center, viewNormal, viewPos, sampleUv, denoised, totalWeight);
			}
		
			if (totalWeight > 0.) { 
				denoised /= totalWeight;
			}
			gl_FragColor = FRAGMENT_OUTPUT;
		}`};function Sh(n,e,t){let i=bS(n,e,t),s="vec3[SAMPLES](";for(let r=0;r<n;r++){let o=i[r];s+=`vec3(${o.x}, ${o.y}, ${o.z})${r<n-1?",":")"}`}return s}function bS(n,e,t){let i=[];for(let s=0;s<n;s++){let r=2*Math.PI*e*s/n,o=Math.pow(s/(n-1),t);i.push(new C(Math.cos(r),Math.sin(r),o))}return i}var al=class{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let t=0;t<512;t++)this.perm[t]=this.p[t&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}dot(e,t,i){return e[0]*t+e[1]*i}dot3(e,t,i,s){return e[0]*t+e[1]*i+e[2]*s}dot4(e,t,i,s,r){return e[0]*t+e[1]*i+e[2]*s+e[3]*r}noise(e,t){let i,s,r,o=.5*(Math.sqrt(3)-1),a=(e+t)*o,l=Math.floor(e+a),c=Math.floor(t+a),u=(3-Math.sqrt(3))/6,h=(l+c)*u,d=l-h,p=c-h,g=e-d,x=t-p,f,m;g>x?(f=1,m=0):(f=0,m=1);let b=g-f+u,y=x-m+u,T=g-1+2*u,L=x-1+2*u,A=l&255,E=c&255,P=this.perm[A+this.perm[E]]%12,k=this.perm[A+f+this.perm[E+m]]%12,v=this.perm[A+1+this.perm[E+1]]%12,S=.5-g*g-x*x;S<0?i=0:(S*=S,i=S*S*this.dot(this.grad3[P],g,x));let U=.5-b*b-y*y;U<0?s=0:(U*=U,s=U*U*this.dot(this.grad3[k],b,y));let F=.5-T*T-L*L;return F<0?r=0:(F*=F,r=F*F*this.dot(this.grad3[v],T,L)),70*(i+s+r)}noise3d(e,t,i){let s,r,o,a,c=(e+t+i)*.3333333333333333,u=Math.floor(e+c),h=Math.floor(t+c),d=Math.floor(i+c),p=1/6,g=(u+h+d)*p,x=u-g,f=h-g,m=d-g,b=e-x,y=t-f,T=i-m,L,A,E,P,k,v;b>=y?y>=T?(L=1,A=0,E=0,P=1,k=1,v=0):b>=T?(L=1,A=0,E=0,P=1,k=0,v=1):(L=0,A=0,E=1,P=1,k=0,v=1):y<T?(L=0,A=0,E=1,P=0,k=1,v=1):b<T?(L=0,A=1,E=0,P=0,k=1,v=1):(L=0,A=1,E=0,P=1,k=1,v=0);let S=b-L+p,U=y-A+p,F=T-E+p,V=b-P+2*p,J=y-k+2*p,H=T-v+2*p,ee=b-1+3*p,W=y-1+3*p,ie=T-1+3*p,ue=u&255,ge=h&255,ke=d&255,Ye=this.perm[ue+this.perm[ge+this.perm[ke]]]%12,q=this.perm[ue+L+this.perm[ge+A+this.perm[ke+E]]]%12,Q=this.perm[ue+P+this.perm[ge+k+this.perm[ke+v]]]%12,ve=this.perm[ue+1+this.perm[ge+1+this.perm[ke+1]]]%12,le=.6-b*b-y*y-T*T;le<0?s=0:(le*=le,s=le*le*this.dot3(this.grad3[Ye],b,y,T));let Ee=.6-S*S-U*U-F*F;Ee<0?r=0:(Ee*=Ee,r=Ee*Ee*this.dot3(this.grad3[q],S,U,F));let Te=.6-V*V-J*J-H*H;Te<0?o=0:(Te*=Te,o=Te*Te*this.dot3(this.grad3[Q],V,J,H));let Ue=.6-ee*ee-W*W-ie*ie;return Ue<0?a=0:(Ue*=Ue,a=Ue*Ue*this.dot3(this.grad3[ve],ee,W,ie)),32*(s+r+o+a)}noise4d(e,t,i,s){let r=this.grad4,o=this.simplex,a=this.perm,l=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20,u,h,d,p,g,x=(e+t+i+s)*l,f=Math.floor(e+x),m=Math.floor(t+x),b=Math.floor(i+x),y=Math.floor(s+x),T=(f+m+b+y)*c,L=f-T,A=m-T,E=b-T,P=y-T,k=e-L,v=t-A,S=i-E,U=s-P,F=k>v?32:0,V=k>S?16:0,J=v>S?8:0,H=k>U?4:0,ee=v>U?2:0,W=S>U?1:0,ie=F+V+J+H+ee+W,ue=o[ie][0]>=3?1:0,ge=o[ie][1]>=3?1:0,ke=o[ie][2]>=3?1:0,Ye=o[ie][3]>=3?1:0,q=o[ie][0]>=2?1:0,Q=o[ie][1]>=2?1:0,ve=o[ie][2]>=2?1:0,le=o[ie][3]>=2?1:0,Ee=o[ie][0]>=1?1:0,Te=o[ie][1]>=1?1:0,Ue=o[ie][2]>=1?1:0,Ke=o[ie][3]>=1?1:0,We=k-ue+c,R=v-ge+c,It=S-ke+c,He=U-Ye+c,Xe=k-q+2*c,Ce=v-Q+2*c,it=S-ve+2*c,Re=U-le+2*c,w=k-Ee+3*c,_=v-Te+3*c,O=S-Ue+3*c,j=U-Ke+3*c,K=k-1+4*c,Y=v-1+4*c,_e=S-1+4*c,re=U-1+4*c,he=f&255,Ve=m&255,$=b&255,de=y&255,Pe=a[he+a[Ve+a[$+a[de]]]]%32,Le=a[he+ue+a[Ve+ge+a[$+ke+a[de+Ye]]]]%32,xe=a[he+q+a[Ve+Q+a[$+ve+a[de+le]]]]%32,qe=a[he+Ee+a[Ve+Te+a[$+Ue+a[de+Ke]]]]%32,Ne=a[he+1+a[Ve+1+a[$+1+a[de+1]]]]%32,Ze=.6-k*k-v*v-S*S-U*U;Ze<0?u=0:(Ze*=Ze,u=Ze*Ze*this.dot4(r[Pe],k,v,S,U));let I=.6-We*We-R*R-It*It-He*He;I<0?h=0:(I*=I,h=I*I*this.dot4(r[Le],We,R,It,He));let ce=.6-Xe*Xe-Ce*Ce-it*it-Re*Re;ce<0?d=0:(ce*=ce,d=ce*ce*this.dot4(r[xe],Xe,Ce,it,Re));let G=.6-w*w-_*_-O*O-j*j;G<0?p=0:(G*=G,p=G*G*this.dot4(r[qe],w,_,O,j));let Z=.6-K*K-Y*Y-_e*_e-re*re;return Z<0?g=0:(Z*=Z,g=Z*Z*this.dot4(r[Ne],K,Y,_e,re)),27*(u+h+d+p+g)}};var ar=class n extends Ut{constructor(e,t,i,s,r,o,a){super(),this.width=i!==void 0?i:512,this.height=s!==void 0?s:512,this.clear=!0,this.camera=t,this.scene=e,this.output=0,this._renderGBuffer=!0,this._visibilityCache=new Map,this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=yp(),this.pdNoiseTexture=this.generateNoise(),this.gtaoRenderTarget=new ht(this.width,this.height,{type:Et}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new rt({defines:Object.assign({},uo.defines),uniforms:Rt.clone(uo.uniforms),vertexShader:uo.vertexShader,fragmentShader:uo.fragmentShader,blending:Mt,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=this.camera.isPerspectiveCamera?1:0,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new Ga,this.normalMaterial.blending=Mt,this.pdMaterial=new rt({defines:Object.assign({},fo.defines),uniforms:Rt.clone(fo.uniforms),vertexShader:fo.vertexShader,fragmentShader:fo.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new rt({defines:Object.assign({},ho.defines),uniforms:Rt.clone(ho.uniforms),vertexShader:ho.vertexShader,fragmentShader:ho.fragmentShader,blending:Mt}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new rt({uniforms:Rt.clone(ki.uniforms),vertexShader:ki.vertexShader,fragmentShader:ki.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:Qa,blendDst:rr,blendEquation:Tn,blendSrcAlpha:Ka,blendDstAlpha:rr,blendEquationAlpha:Tn}),this.blendMaterial=new rt({uniforms:Rt.clone(ol.uniforms),vertexShader:ol.vertexShader,fragmentShader:ol.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:nh,blendSrc:Qa,blendDst:rr,blendEquation:Tn,blendSrcAlpha:Ka,blendDstAlpha:rr,blendEquationAlpha:Tn}),this.fsQuad=new Cn(null),this.originalClearColor=new Me,this.setGBuffer(r?r.depthTexture:void 0,r?r.normalTexture:void 0),o!==void 0&&this.updateGtaoMaterial(o),a!==void 0&&this.updatePdMaterial(a)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this.fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(e,t){e!==void 0?(this.depthTexture=e,this.normalTexture=t,this._renderGBuffer=!1):(this.depthTexture=new er,this.depthTexture.format=Ui,this.depthTexture.type=Ni,this.normalRenderTarget=new ht(this.width,this.height,{minFilter:_t,magFilter:_t,type:Et,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0);let i=this.normalTexture?1:0,s=this.depthTexture===this.normalTexture?"w":"x";this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=i,this.gtaoMaterial.defines.DEPTH_SWIZZLING=s,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=i,this.pdMaterial.defines.DEPTH_SWIZZLING=s,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}setSceneClipBox(e){e?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(e.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(e.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(e){e.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=e.radius),e.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=e.distanceExponent),e.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=e.thickness),e.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=e.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),e.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=e.scale),e.samples!==void 0&&e.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=e.samples,this.gtaoMaterial.needsUpdate=!0),e.screenSpaceRadius!==void 0&&(e.screenSpaceRadius?1:0)!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=e.screenSpaceRadius?1:0,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(e){let t=!1;e.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=e.lumaPhi),e.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=e.depthPhi),e.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=e.normalPhi),e.radius!==void 0&&e.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=e.radius),e.radiusExponent!==void 0&&e.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=e.radiusExponent,t=!0),e.rings!==void 0&&e.rings!==this.pdRings&&(this.pdRings=e.rings,t=!0),e.samples!==void 0&&e.samples!==this.pdSamples&&(this.pdSamples=e.samples,t=!0),t&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=Sh(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(e,t,i){switch(this._renderGBuffer&&(this.overrideVisibility(),this.renderOverride(e,this.normalMaterial,this.normalRenderTarget,7829503,1),this.restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this.renderPass(e,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.renderPass(e,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case n.OUTPUT.Off:break;case n.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=i.texture,this.copyMaterial.blending=Mt,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case n.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=Mt,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case n.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=Mt,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case n.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.renderPass(e,this.depthRenderMaterial,this.renderToScreen?null:t);break;case n.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=Mt,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case n.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=i.texture,this.copyMaterial.blending=Mt,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.renderPass(e,this.blendMaterial,this.renderToScreen?null:t);break;default:console.warn("THREE.GTAOPass: Unknown output type.")}}renderPass(e,t,i,s,r){e.getClearColor(this.originalClearColor);let o=e.getClearAlpha(),a=e.autoClear;e.setRenderTarget(i),e.autoClear=!1,s!=null&&(e.setClearColor(s),e.setClearAlpha(r||0),e.clear()),this.fsQuad.material=t,this.fsQuad.render(e),e.autoClear=a,e.setClearColor(this.originalClearColor),e.setClearAlpha(o)}renderOverride(e,t,i,s,r){e.getClearColor(this.originalClearColor);let o=e.getClearAlpha(),a=e.autoClear;e.setRenderTarget(i),e.autoClear=!1,s=t.clearColor||s,r=t.clearAlpha||r,s!=null&&(e.setClearColor(s),e.setClearAlpha(r||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=a,e.setClearColor(this.originalClearColor),e.setClearAlpha(o)}setSize(e,t){this.width=e,this.height=t,this.gtaoRenderTarget.setSize(e,t),this.normalRenderTarget.setSize(e,t),this.pdRenderTarget.setSize(e,t),this.gtaoMaterial.uniforms.resolution.value.set(e,t),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(e,t),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}overrideVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(i){t.set(i,i.visible),(i.isPoints||i.isLine)&&(i.visible=!1)})}restoreVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(i){let s=t.get(i);i.visible=s}),t.clear()}generateNoise(e=64){let t=new al,i=e*e*4,s=new Uint8Array(i);for(let o=0;o<e;o++)for(let a=0;a<e;a++){let l=o,c=a;s[(o*e+a)*4]=(t.noise(l,c)*.5+.5)*255,s[(o*e+a)*4+1]=(t.noise(l+e,c)*.5+.5)*255,s[(o*e+a)*4+2]=(t.noise(l,c+e)*.5+.5)*255,s[(o*e+a)*4+3]=(t.noise(l+e,c+e)*.5+.5)*255}let r=new nr(s,e,e,pn,On);return r.wrapS=En,r.wrapT=En,r.needsUpdate=!0,r}};ar.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};var _p={name:"LuminosityHighPassShader",shaderID:"luminosityHighPass",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Me(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};var lr=class n extends Ut{constructor(e,t,i,s){super(),this.strength=t!==void 0?t:1,this.radius=i,this.threshold=s,this.resolution=e!==void 0?new se(e.x,e.y):new se(256,256),this.clearColor=new Me(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new ht(r,o,{type:Et}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){let d=new ht(r,o,{type:Et});d.texture.name="UnrealBloomPass.h"+h,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);let p=new ht(r,o,{type:Et});p.texture.name="UnrealBloomPass.v"+h,p.texture.generateMipmaps=!1,this.renderTargetsVertical.push(p),r=Math.round(r/2),o=Math.round(o/2)}let a=_p;this.highPassUniforms=Rt.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new rt({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];let l=[3,5,7,9,11];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new se(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new C(1,1,1),new C(1,1,1),new C(1,1,1),new C(1,1,1),new C(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;let u=ki;this.copyUniforms=Rt.clone(u.uniforms),this.blendMaterial=new rt({uniforms:this.copyUniforms,vertexShader:u.vertexShader,fragmentShader:u.fragmentShader,blending:as,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new Me,this.oldClearAlpha=1,this.basic=new An,this.fsQuad=new Cn(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(i,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(i,s),this.renderTargetsVertical[r].setSize(i,s),this.separableBlurMaterials[r].uniforms.invSize.value=new se(1/i,1/s),i=Math.round(i/2),s=Math.round(s/2)}render(e,t,i,s,r){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();let o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=i.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=n.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=n.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this.fsQuad.render(e),a=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(i),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=o}getSeperableBlurMaterial(e){let t=[];for(let i=0;i<e;i++)t.push(.39894*Math.exp(-.5*i*i/(e*e))/e);return new rt({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new se(.5,.5)},direction:{value:new se(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(e){return new rt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}};lr.BlurDirectionX=new se(1,0);lr.BlurDirectionY=new se(0,1);var po={name:"SMAAEdgesShader",defines:{SMAA_THRESHOLD:"0.1"},uniforms:{tDiffuse:{value:null},resolution:{value:new se(1/1024,1/512)}},vertexShader:`

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];

		void SMAAEdgeDetectionVS( vec2 texcoord ) {
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0,  1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4(  1.0, 0.0, 0.0, -1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 2 ] = texcoord.xyxy + resolution.xyxy * vec4( -2.0, 0.0, 0.0,  2.0 ); // WebGL port note: Changed sign in W component
		}

		void main() {

			vUv = uv;

			SMAAEdgeDetectionVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];

		vec4 SMAAColorEdgeDetectionPS( vec2 texcoord, vec4 offset[3], sampler2D colorTex ) {
			vec2 threshold = vec2( SMAA_THRESHOLD, SMAA_THRESHOLD );

			// Calculate color deltas:
			vec4 delta;
			vec3 C = texture2D( colorTex, texcoord ).rgb;

			vec3 Cleft = texture2D( colorTex, offset[0].xy ).rgb;
			vec3 t = abs( C - Cleft );
			delta.x = max( max( t.r, t.g ), t.b );

			vec3 Ctop = texture2D( colorTex, offset[0].zw ).rgb;
			t = abs( C - Ctop );
			delta.y = max( max( t.r, t.g ), t.b );

			// We do the usual threshold:
			vec2 edges = step( threshold, delta.xy );

			// Then discard if there is no edge:
			if ( dot( edges, vec2( 1.0, 1.0 ) ) == 0.0 )
				discard;

			// Calculate right and bottom deltas:
			vec3 Cright = texture2D( colorTex, offset[1].xy ).rgb;
			t = abs( C - Cright );
			delta.z = max( max( t.r, t.g ), t.b );

			vec3 Cbottom  = texture2D( colorTex, offset[1].zw ).rgb;
			t = abs( C - Cbottom );
			delta.w = max( max( t.r, t.g ), t.b );

			// Calculate the maximum delta in the direct neighborhood:
			float maxDelta = max( max( max( delta.x, delta.y ), delta.z ), delta.w );

			// Calculate left-left and top-top deltas:
			vec3 Cleftleft  = texture2D( colorTex, offset[2].xy ).rgb;
			t = abs( C - Cleftleft );
			delta.z = max( max( t.r, t.g ), t.b );

			vec3 Ctoptop = texture2D( colorTex, offset[2].zw ).rgb;
			t = abs( C - Ctoptop );
			delta.w = max( max( t.r, t.g ), t.b );

			// Calculate the final maximum delta:
			maxDelta = max( max( maxDelta, delta.z ), delta.w );

			// Local contrast adaptation in action:
			edges.xy *= step( 0.5 * maxDelta, delta.xy );

			return vec4( edges, 0.0, 0.0 );
		}

		void main() {

			gl_FragColor = SMAAColorEdgeDetectionPS( vUv, vOffset, tDiffuse );

		}`},mo={name:"SMAAWeightsShader",defines:{SMAA_MAX_SEARCH_STEPS:"8",SMAA_AREATEX_MAX_DISTANCE:"16",SMAA_AREATEX_PIXEL_SIZE:"( 1.0 / vec2( 160.0, 560.0 ) )",SMAA_AREATEX_SUBTEX_SIZE:"( 1.0 / 7.0 )"},uniforms:{tDiffuse:{value:null},tArea:{value:null},tSearch:{value:null},resolution:{value:new se(1/1024,1/512)}},vertexShader:`

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];
		varying vec2 vPixcoord;

		void SMAABlendingWeightCalculationVS( vec2 texcoord ) {
			vPixcoord = texcoord / resolution;

			// We will use these offsets for the searches later on (see @PSEUDO_GATHER4):
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.25, 0.125, 1.25, 0.125 ); // WebGL port note: Changed sign in Y and W components
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.125, 0.25, -0.125, -1.25 ); // WebGL port note: Changed sign in Y and W components

			// And these for the searches, they indicate the ends of the loops:
			vOffset[ 2 ] = vec4( vOffset[ 0 ].xz, vOffset[ 1 ].yw ) + vec4( -2.0, 2.0, -2.0, 2.0 ) * resolution.xxyy * float( SMAA_MAX_SEARCH_STEPS );

		}

		void main() {

			vUv = uv;

			SMAABlendingWeightCalculationVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		#define SMAASampleLevelZeroOffset( tex, coord, offset ) texture2D( tex, coord + float( offset ) * resolution, 0.0 )

		uniform sampler2D tDiffuse;
		uniform sampler2D tArea;
		uniform sampler2D tSearch;
		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[3];
		varying vec2 vPixcoord;

		#if __VERSION__ == 100
		vec2 round( vec2 x ) {
			return sign( x ) * floor( abs( x ) + 0.5 );
		}
		#endif

		float SMAASearchLength( sampler2D searchTex, vec2 e, float bias, float scale ) {
			// Not required if searchTex accesses are set to point:
			// float2 SEARCH_TEX_PIXEL_SIZE = 1.0 / float2(66.0, 33.0);
			// e = float2(bias, 0.0) + 0.5 * SEARCH_TEX_PIXEL_SIZE +
			//     e * float2(scale, 1.0) * float2(64.0, 32.0) * SEARCH_TEX_PIXEL_SIZE;
			e.r = bias + e.r * scale;
			return 255.0 * texture2D( searchTex, e, 0.0 ).r;
		}

		float SMAASearchXLeft( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			/**
				* @PSEUDO_GATHER4
				* This texcoord has been offset by (-0.25, -0.125) in the vertex shader to
				* sample between edge, thus fetching four edges in a row.
				* Sampling with different offsets in each direction allows to disambiguate
				* which edges are active from the four fetched ones.
				*/
			vec2 e = vec2( 0.0, 1.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord -= vec2( 2.0, 0.0 ) * resolution;
				if ( ! ( texcoord.x > end && e.g > 0.8281 && e.r == 0.0 ) ) break;
			}

			// We correct the previous (-0.25, -0.125) offset we applied:
			texcoord.x += 0.25 * resolution.x;

			// The searches are bias by 1, so adjust the coords accordingly:
			texcoord.x += resolution.x;

			// Disambiguate the length added by the last step:
			texcoord.x += 2.0 * resolution.x; // Undo last step
			texcoord.x -= resolution.x * SMAASearchLength(searchTex, e, 0.0, 0.5);

			return texcoord.x;
		}

		float SMAASearchXRight( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 0.0, 1.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord += vec2( 2.0, 0.0 ) * resolution;
				if ( ! ( texcoord.x < end && e.g > 0.8281 && e.r == 0.0 ) ) break;
			}

			texcoord.x -= 0.25 * resolution.x;
			texcoord.x -= resolution.x;
			texcoord.x -= 2.0 * resolution.x;
			texcoord.x += resolution.x * SMAASearchLength( searchTex, e, 0.5, 0.5 );

			return texcoord.x;
		}

		float SMAASearchYUp( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 1.0, 0.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord += vec2( 0.0, 2.0 ) * resolution; // WebGL port note: Changed sign
				if ( ! ( texcoord.y > end && e.r > 0.8281 && e.g == 0.0 ) ) break;
			}

			texcoord.y -= 0.25 * resolution.y; // WebGL port note: Changed sign
			texcoord.y -= resolution.y; // WebGL port note: Changed sign
			texcoord.y -= 2.0 * resolution.y; // WebGL port note: Changed sign
			texcoord.y += resolution.y * SMAASearchLength( searchTex, e.gr, 0.0, 0.5 ); // WebGL port note: Changed sign

			return texcoord.y;
		}

		float SMAASearchYDown( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 1.0, 0.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord -= vec2( 0.0, 2.0 ) * resolution; // WebGL port note: Changed sign
				if ( ! ( texcoord.y < end && e.r > 0.8281 && e.g == 0.0 ) ) break;
			}

			texcoord.y += 0.25 * resolution.y; // WebGL port note: Changed sign
			texcoord.y += resolution.y; // WebGL port note: Changed sign
			texcoord.y += 2.0 * resolution.y; // WebGL port note: Changed sign
			texcoord.y -= resolution.y * SMAASearchLength( searchTex, e.gr, 0.5, 0.5 ); // WebGL port note: Changed sign

			return texcoord.y;
		}

		vec2 SMAAArea( sampler2D areaTex, vec2 dist, float e1, float e2, float offset ) {
			// Rounding prevents precision errors of bilinear filtering:
			vec2 texcoord = float( SMAA_AREATEX_MAX_DISTANCE ) * round( 4.0 * vec2( e1, e2 ) ) + dist;

			// We do a scale and bias for mapping to texel space:
			texcoord = SMAA_AREATEX_PIXEL_SIZE * texcoord + ( 0.5 * SMAA_AREATEX_PIXEL_SIZE );

			// Move to proper place, according to the subpixel offset:
			texcoord.y += SMAA_AREATEX_SUBTEX_SIZE * offset;

			return texture2D( areaTex, texcoord, 0.0 ).rg;
		}

		vec4 SMAABlendingWeightCalculationPS( vec2 texcoord, vec2 pixcoord, vec4 offset[ 3 ], sampler2D edgesTex, sampler2D areaTex, sampler2D searchTex, ivec4 subsampleIndices ) {
			vec4 weights = vec4( 0.0, 0.0, 0.0, 0.0 );

			vec2 e = texture2D( edgesTex, texcoord ).rg;

			if ( e.g > 0.0 ) { // Edge at north
				vec2 d;

				// Find the distance to the left:
				vec2 coords;
				coords.x = SMAASearchXLeft( edgesTex, searchTex, offset[ 0 ].xy, offset[ 2 ].x );
				coords.y = offset[ 1 ].y; // offset[1].y = texcoord.y - 0.25 * resolution.y (@CROSSING_OFFSET)
				d.x = coords.x;

				// Now fetch the left crossing edges, two at a time using bilinear
				// filtering. Sampling at -0.25 (see @CROSSING_OFFSET) enables to
				// discern what value each edge has:
				float e1 = texture2D( edgesTex, coords, 0.0 ).r;

				// Find the distance to the right:
				coords.x = SMAASearchXRight( edgesTex, searchTex, offset[ 0 ].zw, offset[ 2 ].y );
				d.y = coords.x;

				// We want the distances to be in pixel units (doing this here allow to
				// better interleave arithmetic and memory accesses):
				d = d / resolution.x - pixcoord.x;

				// SMAAArea below needs a sqrt, as the areas texture is compressed
				// quadratically:
				vec2 sqrt_d = sqrt( abs( d ) );

				// Fetch the right crossing edges:
				coords.y -= 1.0 * resolution.y; // WebGL port note: Added
				float e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 1, 0 ) ).r;

				// Ok, we know how this pattern looks like, now it is time for getting
				// the actual area:
				weights.rg = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.y ) );
			}

			if ( e.r > 0.0 ) { // Edge at west
				vec2 d;

				// Find the distance to the top:
				vec2 coords;

				coords.y = SMAASearchYUp( edgesTex, searchTex, offset[ 1 ].xy, offset[ 2 ].z );
				coords.x = offset[ 0 ].x; // offset[1].x = texcoord.x - 0.25 * resolution.x;
				d.x = coords.y;

				// Fetch the top crossing edges:
				float e1 = texture2D( edgesTex, coords, 0.0 ).g;

				// Find the distance to the bottom:
				coords.y = SMAASearchYDown( edgesTex, searchTex, offset[ 1 ].zw, offset[ 2 ].w );
				d.y = coords.y;

				// We want the distances to be in pixel units:
				d = d / resolution.y - pixcoord.y;

				// SMAAArea below needs a sqrt, as the areas texture is compressed
				// quadratically:
				vec2 sqrt_d = sqrt( abs( d ) );

				// Fetch the bottom crossing edges:
				coords.y -= 1.0 * resolution.y; // WebGL port note: Added
				float e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 0, 1 ) ).g;

				// Get the area for this direction:
				weights.ba = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.x ) );
			}

			return weights;
		}

		void main() {

			gl_FragColor = SMAABlendingWeightCalculationPS( vUv, vPixcoord, vOffset, tDiffuse, tArea, tSearch, ivec4( 0.0 ) );

		}`},ll={name:"SMAABlendShader",uniforms:{tDiffuse:{value:null},tColor:{value:null},resolution:{value:new se(1/1024,1/512)}},vertexShader:`

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 2 ];

		void SMAANeighborhoodBlendingVS( vec2 texcoord ) {
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0, 1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( 1.0, 0.0, 0.0, -1.0 ); // WebGL port note: Changed sign in W component
		}

		void main() {

			vUv = uv;

			SMAANeighborhoodBlendingVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform sampler2D tColor;
		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 2 ];

		vec4 SMAANeighborhoodBlendingPS( vec2 texcoord, vec4 offset[ 2 ], sampler2D colorTex, sampler2D blendTex ) {
			// Fetch the blending weights for current pixel:
			vec4 a;
			a.xz = texture2D( blendTex, texcoord ).xz;
			a.y = texture2D( blendTex, offset[ 1 ].zw ).g;
			a.w = texture2D( blendTex, offset[ 1 ].xy ).a;

			// Is there any blending weight with a value greater than 0.0?
			if ( dot(a, vec4( 1.0, 1.0, 1.0, 1.0 )) < 1e-5 ) {
				return texture2D( colorTex, texcoord, 0.0 );
			} else {
				// Up to 4 lines can be crossing a pixel (one through each edge). We
				// favor blending by choosing the line with the maximum weight for each
				// direction:
				vec2 offset;
				offset.x = a.a > a.b ? a.a : -a.b; // left vs. right
				offset.y = a.g > a.r ? -a.g : a.r; // top vs. bottom // WebGL port note: Changed signs

				// Then we go in the direction that has the maximum weight:
				if ( abs( offset.x ) > abs( offset.y )) { // horizontal vs. vertical
					offset.y = 0.0;
				} else {
					offset.x = 0.0;
				}

				// Fetch the opposite color and lerp by hand:
				vec4 C = texture2D( colorTex, texcoord, 0.0 );
				texcoord += sign( offset ) * resolution;
				vec4 Cop = texture2D( colorTex, texcoord, 0.0 );
				float s = abs( offset.x ) > abs( offset.y ) ? abs( offset.x ) : abs( offset.y );

				// WebGL port note: Added gamma correction
				C.xyz = pow(C.xyz, vec3(2.2));
				Cop.xyz = pow(Cop.xyz, vec3(2.2));
				vec4 mixed = mix(C, Cop, s);
				mixed.xyz = pow(mixed.xyz, vec3(1.0 / 2.2));

				return mixed;
			}
		}

		void main() {

			gl_FragColor = SMAANeighborhoodBlendingPS( vUv, vOffset, tColor, tDiffuse );

		}`};var cl=class extends Ut{constructor(e,t){super(),this.edgesRT=new ht(e,t,{depthBuffer:!1,type:Et}),this.edgesRT.texture.name="SMAAPass.edges",this.weightsRT=new ht(e,t,{depthBuffer:!1,type:Et}),this.weightsRT.texture.name="SMAAPass.weights";let i=this,s=new Image;s.src=this.getAreaTexture(),s.onload=function(){i.areaTexture.needsUpdate=!0},this.areaTexture=new Ct,this.areaTexture.name="SMAAPass.area",this.areaTexture.image=s,this.areaTexture.minFilter=fn,this.areaTexture.generateMipmaps=!1,this.areaTexture.flipY=!1;let r=new Image;r.src=this.getSearchTexture(),r.onload=function(){i.searchTexture.needsUpdate=!0},this.searchTexture=new Ct,this.searchTexture.name="SMAAPass.search",this.searchTexture.image=r,this.searchTexture.magFilter=_t,this.searchTexture.minFilter=_t,this.searchTexture.generateMipmaps=!1,this.searchTexture.flipY=!1,this.uniformsEdges=Rt.clone(po.uniforms),this.uniformsEdges.resolution.value.set(1/e,1/t),this.materialEdges=new rt({defines:Object.assign({},po.defines),uniforms:this.uniformsEdges,vertexShader:po.vertexShader,fragmentShader:po.fragmentShader}),this.uniformsWeights=Rt.clone(mo.uniforms),this.uniformsWeights.resolution.value.set(1/e,1/t),this.uniformsWeights.tDiffuse.value=this.edgesRT.texture,this.uniformsWeights.tArea.value=this.areaTexture,this.uniformsWeights.tSearch.value=this.searchTexture,this.materialWeights=new rt({defines:Object.assign({},mo.defines),uniforms:this.uniformsWeights,vertexShader:mo.vertexShader,fragmentShader:mo.fragmentShader}),this.uniformsBlend=Rt.clone(ll.uniforms),this.uniformsBlend.resolution.value.set(1/e,1/t),this.uniformsBlend.tDiffuse.value=this.weightsRT.texture,this.materialBlend=new rt({uniforms:this.uniformsBlend,vertexShader:ll.vertexShader,fragmentShader:ll.fragmentShader}),this.fsQuad=new Cn(null)}render(e,t,i){this.uniformsEdges.tDiffuse.value=i.texture,this.fsQuad.material=this.materialEdges,e.setRenderTarget(this.edgesRT),this.clear&&e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.materialWeights,e.setRenderTarget(this.weightsRT),this.clear&&e.clear(),this.fsQuad.render(e),this.uniformsBlend.tColor.value=i.texture,this.fsQuad.material=this.materialBlend,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(),this.fsQuad.render(e))}setSize(e,t){this.edgesRT.setSize(e,t),this.weightsRT.setSize(e,t),this.materialEdges.uniforms.resolution.value.set(1/e,1/t),this.materialWeights.uniforms.resolution.value.set(1/e,1/t),this.materialBlend.uniforms.resolution.value.set(1/e,1/t)}getAreaTexture(){return"data:image/png;base64,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"}getSearchTexture(){return"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAAhCAAAAABIXyLAAAAAOElEQVRIx2NgGAWjYBSMglEwEICREYRgFBZBqDCSLA2MGPUIVQETE9iNUAqLR5gIeoQKRgwXjwAAGn4AtaFeYLEAAAAASUVORK5CYII="}dispose(){this.edgesRT.dispose(),this.weightsRT.dispose(),this.areaTexture.dispose(),this.searchTexture.dispose(),this.materialEdges.dispose(),this.materialWeights.dispose(),this.materialBlend.dispose(),this.fsQuad.dispose()}};var Sp={name:"FXAAShader",uniforms:{tDiffuse:{value:null},resolution:{value:new se(1/1024,1/512)}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
		precision highp float;

		uniform sampler2D tDiffuse;

		uniform vec2 resolution;

		varying vec2 vUv;

		// FXAA 3.11 implementation by NVIDIA, ported to WebGL by Agost Biro (biro@archilogic.com)

		//----------------------------------------------------------------------------------
		// File:        es3-keplerFXAAassetsshaders/FXAA_DefaultES.frag
		// SDK Version: v3.00
		// Email:       gameworks@nvidia.com
		// Site:        http://developer.nvidia.com/
		//
		// Copyright (c) 2014-2015, NVIDIA CORPORATION. All rights reserved.
		//
		// Redistribution and use in source and binary forms, with or without
		// modification, are permitted provided that the following conditions
		// are met:
		//  * Redistributions of source code must retain the above copyright
		//    notice, this list of conditions and the following disclaimer.
		//  * Redistributions in binary form must reproduce the above copyright
		//    notice, this list of conditions and the following disclaimer in the
		//    documentation and/or other materials provided with the distribution.
		//  * Neither the name of NVIDIA CORPORATION nor the names of its
		//    contributors may be used to endorse or promote products derived
		//    from this software without specific prior written permission.
		//
		// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS ''AS IS'' AND ANY
		// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
		// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
		// PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
		// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
		// EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
		// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
		// PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
		// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
		// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
		// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
		//
		//----------------------------------------------------------------------------------

		#ifndef FXAA_DISCARD
			//
			// Only valid for PC OpenGL currently.
			// Probably will not work when FXAA_GREEN_AS_LUMA = 1.
			//
			// 1 = Use discard on pixels which don't need AA.
			//     For APIs which enable concurrent TEX+ROP from same surface.
			// 0 = Return unchanged color on pixels which don't need AA.
			//
			#define FXAA_DISCARD 0
		#endif

		/*--------------------------------------------------------------------------*/
		#define FxaaTexTop(t, p) texture2D(t, p, -100.0)
		#define FxaaTexOff(t, p, o, r) texture2D(t, p + (o * r), -100.0)
		/*--------------------------------------------------------------------------*/

		#define NUM_SAMPLES 5

		// assumes colors have premultipliedAlpha, so that the calculated color contrast is scaled by alpha
		float contrast( vec4 a, vec4 b ) {
			vec4 diff = abs( a - b );
			return max( max( max( diff.r, diff.g ), diff.b ), diff.a );
		}

		/*============================================================================

									FXAA3 QUALITY - PC

		============================================================================*/

		/*--------------------------------------------------------------------------*/
		vec4 FxaaPixelShader(
			vec2 posM,
			sampler2D tex,
			vec2 fxaaQualityRcpFrame,
			float fxaaQualityEdgeThreshold,
			float fxaaQualityinvEdgeThreshold
		) {
			vec4 rgbaM = FxaaTexTop(tex, posM);
			vec4 rgbaS = FxaaTexOff(tex, posM, vec2( 0.0, 1.0), fxaaQualityRcpFrame.xy);
			vec4 rgbaE = FxaaTexOff(tex, posM, vec2( 1.0, 0.0), fxaaQualityRcpFrame.xy);
			vec4 rgbaN = FxaaTexOff(tex, posM, vec2( 0.0,-1.0), fxaaQualityRcpFrame.xy);
			vec4 rgbaW = FxaaTexOff(tex, posM, vec2(-1.0, 0.0), fxaaQualityRcpFrame.xy);
			// . S .
			// W M E
			// . N .

			bool earlyExit = max( max( max(
					contrast( rgbaM, rgbaN ),
					contrast( rgbaM, rgbaS ) ),
					contrast( rgbaM, rgbaE ) ),
					contrast( rgbaM, rgbaW ) )
					< fxaaQualityEdgeThreshold;
			// . 0 .
			// 0 0 0
			// . 0 .

			#if (FXAA_DISCARD == 1)
				if(earlyExit) FxaaDiscard;
			#else
				if(earlyExit) return rgbaM;
			#endif

			float contrastN = contrast( rgbaM, rgbaN );
			float contrastS = contrast( rgbaM, rgbaS );
			float contrastE = contrast( rgbaM, rgbaE );
			float contrastW = contrast( rgbaM, rgbaW );

			float relativeVContrast = ( contrastN + contrastS ) - ( contrastE + contrastW );
			relativeVContrast *= fxaaQualityinvEdgeThreshold;

			bool horzSpan = relativeVContrast > 0.;
			// . 1 .
			// 0 0 0
			// . 1 .

			// 45 deg edge detection and corners of objects, aka V/H contrast is too similar
			if( abs( relativeVContrast ) < .3 ) {
				// locate the edge
				vec2 dirToEdge;
				dirToEdge.x = contrastE > contrastW ? 1. : -1.;
				dirToEdge.y = contrastS > contrastN ? 1. : -1.;
				// . 2 .      . 1 .
				// 1 0 2  ~=  0 0 1
				// . 1 .      . 0 .

				// tap 2 pixels and see which ones are "outside" the edge, to
				// determine if the edge is vertical or horizontal

				vec4 rgbaAlongH = FxaaTexOff(tex, posM, vec2( dirToEdge.x, -dirToEdge.y ), fxaaQualityRcpFrame.xy);
				float matchAlongH = contrast( rgbaM, rgbaAlongH );
				// . 1 .
				// 0 0 1
				// . 0 H

				vec4 rgbaAlongV = FxaaTexOff(tex, posM, vec2( -dirToEdge.x, dirToEdge.y ), fxaaQualityRcpFrame.xy);
				float matchAlongV = contrast( rgbaM, rgbaAlongV );
				// V 1 .
				// 0 0 1
				// . 0 .

				relativeVContrast = matchAlongV - matchAlongH;
				relativeVContrast *= fxaaQualityinvEdgeThreshold;

				if( abs( relativeVContrast ) < .3 ) { // 45 deg edge
					// 1 1 .
					// 0 0 1
					// . 0 1

					// do a simple blur
					return mix(
						rgbaM,
						(rgbaN + rgbaS + rgbaE + rgbaW) * .25,
						.4
					);
				}

				horzSpan = relativeVContrast > 0.;
			}

			if(!horzSpan) rgbaN = rgbaW;
			if(!horzSpan) rgbaS = rgbaE;
			// . 0 .      1
			// 1 0 1  ->  0
			// . 0 .      1

			bool pairN = contrast( rgbaM, rgbaN ) > contrast( rgbaM, rgbaS );
			if(!pairN) rgbaN = rgbaS;

			vec2 offNP;
			offNP.x = (!horzSpan) ? 0.0 : fxaaQualityRcpFrame.x;
			offNP.y = ( horzSpan) ? 0.0 : fxaaQualityRcpFrame.y;

			bool doneN = false;
			bool doneP = false;

			float nDist = 0.;
			float pDist = 0.;

			vec2 posN = posM;
			vec2 posP = posM;

			int iterationsUsedN = 0;
			int iterationsUsedP = 0;
			for( int i = 0; i < NUM_SAMPLES; i++ ) {

				float increment = float(i + 1);

				if(!doneN) {
					nDist += increment;
					posN = posM + offNP * nDist;
					vec4 rgbaEndN = FxaaTexTop(tex, posN.xy);
					doneN = contrast( rgbaEndN, rgbaM ) > contrast( rgbaEndN, rgbaN );
					iterationsUsedN = i;
				}

				if(!doneP) {
					pDist += increment;
					posP = posM - offNP * pDist;
					vec4 rgbaEndP = FxaaTexTop(tex, posP.xy);
					doneP = contrast( rgbaEndP, rgbaM ) > contrast( rgbaEndP, rgbaN );
					iterationsUsedP = i;
				}

				if(doneN || doneP) break;
			}


			if ( !doneP && !doneN ) return rgbaM; // failed to find end of edge

			float dist = min(
				doneN ? float( iterationsUsedN ) / float( NUM_SAMPLES - 1 ) : 1.,
				doneP ? float( iterationsUsedP ) / float( NUM_SAMPLES - 1 ) : 1.
			);

			// hacky way of reduces blurriness of mostly diagonal edges
			// but reduces AA quality
			dist = pow(dist, .5);

			dist = 1. - dist;

			return mix(
				rgbaM,
				rgbaN,
				dist * .5
			);
		}

		void main() {
			const float edgeDetectionQuality = .2;
			const float invEdgeDetectionQuality = 1. / edgeDetectionQuality;

			gl_FragColor = FxaaPixelShader(
				vUv,
				tDiffuse,
				resolution,
				edgeDetectionQuality, // [0,1] contrast needed, otherwise early discard
				invEdgeDetectionQuality
			);

		}
	`};var ul=class extends tr{constructor(){super();let e=new jn;e.deleteAttribute("uv");let t=new Kt({side:Gt}),i=new Kt,s=new ja(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let r=new Oe(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let o=new Oe(e,i);o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),this.add(o);let a=new Oe(e,i);a.position.set(-5.607,-.754,-.758),a.rotation.set(0,.994,0),a.scale.set(1.97,1.534,3.955),this.add(a);let l=new Oe(e,i);l.position.set(6.167,.857,7.803),l.rotation.set(0,.561,0),l.scale.set(3.927,6.285,3.687),this.add(l);let c=new Oe(e,i);c.position.set(-2.017,.018,6.124),c.rotation.set(0,.333,0),c.scale.set(2.002,4.566,2.064),this.add(c);let u=new Oe(e,i);u.position.set(2.291,-.756,-2.621),u.rotation.set(0,-.286,0),u.scale.set(1.546,1.552,1.496),this.add(u);let h=new Oe(e,i);h.position.set(-2.193,-.369,-5.547),h.rotation.set(0,.516,0),h.scale.set(3.875,3.487,2.986),this.add(h);let d=new Oe(e,cr(50));d.position.set(-16.116,14.37,8.208),d.scale.set(.1,2.428,2.739),this.add(d);let p=new Oe(e,cr(50));p.position.set(-16.109,18.021,-8.207),p.scale.set(.1,2.425,2.751),this.add(p);let g=new Oe(e,cr(17));g.position.set(14.904,12.198,-1.832),g.scale.set(.15,4.265,6.331),this.add(g);let x=new Oe(e,cr(43));x.position.set(-.462,8.89,14.52),x.scale.set(4.38,5.441,.088),this.add(x);let f=new Oe(e,cr(20));f.position.set(3.235,11.486,-12.541),f.scale.set(2.5,2,.1),this.add(f);let m=new Oe(e,cr(100));m.position.set(0,20,0),m.scale.set(1,.1,1),this.add(m)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function cr(n){let e=new An;return e.color.setScalar(n),e}var go=["low","balanced","high","ultra"],ur={shadows:["off","low","medium","high"],ao:["off","on","high"],bloom:["off","on"],grade:["off","on"],antialias:["off","fxaa","smaa","msaa"],reflections:["off","on"],particles:["low","high"],background:["static","animated"],detail:["plain","detailed"]},Mp={low:{scale:1,cap:1,shadows:"off",ao:"off",bloom:"off",grade:"off",antialias:"msaa",reflections:"off",particles:"low",background:"static",detail:"plain"},balanced:{scale:1,cap:1.5,shadows:"low",ao:"off",bloom:"on",grade:"on",antialias:"fxaa",reflections:"on",particles:"high",background:"animated",detail:"detailed"},high:{scale:1,cap:2,shadows:"medium",ao:"on",bloom:"on",grade:"on",antialias:"smaa",reflections:"on",particles:"high",background:"animated",detail:"detailed"},ultra:{scale:1.25,cap:2,shadows:"high",ao:"high",bloom:"on",grade:"on",antialias:"msaa",reflections:"on",particles:"high",background:"animated",detail:"detailed"}},vo={off:0,low:1024,medium:2048,high:4096},bp={low:150,high:900};function Tp(n,e){let t=String(n||"").toLowerCase(),i;return/swiftshader|llvmpipe|softpipe|software|basic render|microsoft basic/.test(t)?i="low":/nvidia|geforce|rtx|gtx|quadro|radeon rx|radeon pro|amd radeon(?!.*graphics)|apple m\d/.test(t)?i="high":i="balanced",e&&e.mobile&&i==="high"&&(i="balanced"),i}function hl(n,e){let t=n||{},i=!go.includes(t.preset),s=i?go.includes(e)?e:"balanced":t.preset,r=Mp[s],o={preset:s,auto:i,renderScale:wS(Number(t.render_scale)||1,.5,2),cap:r.cap};o.scale=r.scale*o.renderScale;for(let[a,l]of Object.entries(ur))o[a]=l.includes(t[a])?t[a]:r[a];return o.adaptive=t.adaptive!==!1,o.showFps=!!t.show_fps,o.post=o.ao!=="off"||o.bloom==="on"||o.grade==="on"||o.antialias==="fxaa"||o.antialias==="smaa",o}function wp(n,e){let t=n||{},i={preset:go.includes(e)?e:"auto"};return t.render_scale!=null&&(i.render_scale=t.render_scale),t.adaptive!=null&&(i.adaptive=t.adaptive),t.show_fps!=null&&(i.show_fps=t.show_fps),i}function Ep(n,e){return Mp[n]?.[e]}var TS={noShadows:"no shadows",shadows:"{n}\xB2 shadows",ao:"ambient occlusion",aoHigh:"full ambient occlusion",bloom:"bloom",reflections:"reflections",noAa:"no anti-aliasing",px:"{w}\xD7{h} px"};function Ap(n,e,t){let i=Object.assign({},TS,t||{});return[n.shadows==="off"?i.noShadows:i.shadows.replace("{n}",vo[n.shadows]),n.ao==="off"?null:n.ao==="high"?i.aoHigh:i.ao,n.bloom==="on"?i.bloom:null,n.reflections==="on"?i.reflections:null,n.antialias==="off"?i.noAa:n.antialias.toUpperCase(),e?i.px.replace("{w}",e[0]).replace("{h}",e[1]):null].filter(Boolean).join(" \xB7 ")}function wS(n,e,t){return Math.min(t,Math.max(e,n))}var Ph=1,Lh=2,Ih=3,St=null,lt=null,dt=null,Pn=null,Ip=0,dr=!1,Jn=kl("atelier"),xn=ws.default,Vn=!1,Ge=hl({},"low"),_o="",yl="balanced",Th={},Hn=null,dl=null,fl=null,bo=!1,So=null,an=null,pl=2.2,rn=null,Zn=1,yi=1,hr=[],wh=0,Mo=[0,0],ml=new Map,gn=Wn(12648430),on=null,Eh=[],gl=[],fs=[],To=[],kn=null,qt=null,Vi=[],xi=0,pr={x:0,y:0},Ah=null,Ot=null,ps=null,Mh=new Set,mn={dist:7.6,height:4.6,lookY:.9,fov:40},Dh=new C(0,mn.height,mn.dist),vl=5,Nh=.34,Uh=.3,Oh=.115,fr=2.6,qb=new C,bh=null,Cp=!1,xo=[];function Rp(n){if(bh){n(bh);return}if(xo.push(n),!Cp){Cp=!0;try{new Xa().load("assets/linen-weave.webp",e=>{for(e.wrapS=e.wrapT=En,e.colorSpace=sn,e.anisotropy=4,bh=e;xo.length;)xo.pop()(e)},void 0,()=>{xo.length=0})}catch{xo.length=0}}}var Hi=null;function ES(){if(Hi||typeof document>"u")return Hi;let n=document.createElement("canvas");n.width=128,n.height=32;let e=n.getContext("2d");e.fillStyle="#e6e6e6",e.fillRect(0,0,128,32);for(let i=-32;i<160;i+=8){let s=e.createLinearGradient(i,0,i+8,0);s.addColorStop(0,"#bdbdbd"),s.addColorStop(.5,"#ffffff"),s.addColorStop(1,"#bdbdbd"),e.fillStyle=s,e.beginPath(),e.moveTo(i,32),e.lineTo(i+6,32),e.lineTo(i+6+16,0),e.lineTo(i+16,0),e.closePath(),e.fill()}let t=Wn(31275);for(let i=0;i<220;i++)e.fillStyle=`rgba(255,255,255,${.08+t()*.12})`,e.fillRect(t()*128,t()*32,1+t()*3,1);return Hi=new Qr(n),Hi.wrapS=Hi.wrapT=En,Hi.repeat.set(10,1),Hi.anisotropy=4,Hi}var yo=null;function Dp(){if(yo||typeof document>"u")return yo;let n=document.createElement("canvas");n.width=n.height=64;let e=n.getContext("2d"),t=e.createRadialGradient(32,32,0,32,32,32);return t.addColorStop(0,"rgba(255,255,255,1)"),t.addColorStop(.35,"rgba(255,255,255,0.55)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,64,64),yo=new Qr(n),yo.colorSpace=sn,yo}var vn=()=>Ge.detail==="detailed";function Rn(n,e){let t=e>6?1.05:1.3;return(n-(e-1)/2)*t}function AS(){let n=new wn;n.name="environment";let e=new Oe(new jn(24,.5,14),new Kt({color:Jn.floor,roughness:.9,metalness:.05,envMapIntensity:.25}));e.position.y=-.25,e.receiveShadow=!0,n.add(e),Rp(i=>{let s=i.clone();s.needsUpdate=!0,s.repeat.set(8,5),e.material.map=s,e.material.needsUpdate=!0});let t=new Oe(new Bn(5.6,5.9,.08,48),new Kt({color:new Me(Jn.floor).multiplyScalar(1.25),roughness:1,envMapIntensity:.25}));t.position.y=.04,t.receiveShadow=!0,n.add(t),Rp(i=>{let s=i.clone();s.needsUpdate=!0,s.repeat.set(3,3),t.material.map=s,t.material.needsUpdate=!0});for(let i=0;i<7;i++){let s=gn(),r=.5+gn()*.5,o=new Oe(new Bn(.22+s*.15,.22+s*.15,r,vn()?28:14),vn()?Up(i%xn.length,.5):new Kt({color:new Me(xn[i%xn.length]),roughness:.85}));if(o.position.set(-7+gn()*14,.3,-4.5-gn()*2),o.castShadow=!0,n.add(o),vn()){let a=new Kt({color:7031343,roughness:.7,envMapIntensity:.3});for(let l of[-1,1]){let c=new Oe(new Bn(.3+s*.15,.3+s*.15,.05,28),a);c.position.set(o.position.x,o.position.y+l*r/2,o.position.z),c.castShadow=!0,n.add(c)}}}for(let i=0;i<5;i++){let s=[],r=-6+gn()*12;for(let l=0;l<=8;l++)s.push(new C(r+l*.35,.03,2.5+Math.sin(l*1.3+i)*.3+gn()*.4));let o=new $r(s),a=new Oe(new Ha(o,24,.02,5),new Kt({color:new Me(xn[(i+2)%xn.length]),roughness:1}));n.add(a)}return n}function CS(n){let e=new wn,t=vn()?Up(n,1):xl("loop-"+n,()=>new Kt({color:new Me(xn[n%xn.length]),roughness:.75,metalness:.05})),i=new Oe(vn()?PS():RS(),t);i.rotation.x=Math.PI/2,i.castShadow=!0,i.receiveShadow=vn(),e.add(i);let s;switch(n%6){case 0:s=new no(.07,8,8);break;case 1:s=new eo(.07,.12,8);break;case 2:s=new jn(.1,.1,.1);break;case 3:s=new ka(.08);break;case 4:s=new eo(.08,.12,4);break;default:s=new Bn(.06,.06,.1,8)}let r=new Oe(s,xl("stitch",()=>new Kt({color:16117990,roughness:.6})));return r.position.set(Uh,Oh*.6,0),e.add(r),e}function xl(n,e){let t=ml.get(n);return t||(t=e(),ml.set(n,t)),t}function Np(){for(let n of ml.values())n.dispose();ml=new Map}function Up(n,e){return xl(`yarn-${n}-${e}`,()=>{let t=new Me(xn[n%xn.length]),i=ES(),s=i;return i&&e!==1&&(s=i.clone(),s.repeat.set(10*e,1),s.needsUpdate=!0),new io({color:t,roughness:.78,metalness:0,map:s||null,bumpMap:s||null,bumpScale:1.2,sheen:1,sheenRoughness:.45,sheenColor:t.clone().lerp(new Me(16777215),.45),envMapIntensity:.45})})}var ms={};function RS(){return ms.plain||(ms.plain=new ir(Uh,Oh,10,20))}function PS(){return ms.detailed||(ms.detailed=new ir(Uh,Oh,22,44))}function LS(){return xl("brass",()=>vn()?new io({color:Jn.brass,metalness:.95,roughness:.26,clearcoat:.3,clearcoatRoughness:.2,envMapIntensity:.85}):new Kt({color:Jn.brass,metalness:.85,roughness:.35}))}function IS(n){let e=new wn,t=LS(),i=vn()?28:14,s=new Oe(new Bn(.09,.13,fr,i),t);s.position.y=fr/2,s.castShadow=!0,e.add(s);let r=new Oe(new no(.15,vn()?24:12,vn()?18:10),t);r.position.y=fr+.08,r.castShadow=!0,e.add(r);let o=new Oe(new Bn(.42,.5,.12,vn()?40:20),t);if(o.position.y=.06,o.castShadow=vn(),o.receiveShadow=!0,e.add(o),vn()){let a=new Oe(new ir(.15,.035,10,28),t);a.rotation.x=Math.PI/2,a.position.y=.14,e.add(a)}return e.position.x=n,e}function Fh(n){n.traverse(e=>{e.geometry&&e.geometry!==ms.plain&&e.geometry!==ms.detailed&&e.geometry.dispose()})}function DS(n,e){let t=new Oe(new to(.42,.56,24),new An({color:e?8380554:14712703,transparent:!0,opacity:0,side:bn}));return t.rotation.x=-Math.PI/2,t.position.set(n,.1,0),t.layers.set(Lh),t.visible=!1,t}function Op(n){on&&(lt.remove(on),Fh(on)),on=new wn,on.name="board",Eh=[],gl=[],To=[],fs=[];let e=n.pegs.length;e!==vl&&(vl=e,Wh(),Bp());for(let t=0;t<e;t++){let i=IS(Rn(t,e));i.userData.pegIndex=t,on.add(i),Eh.push(i);let s=new Oe(new Bn(.55,.55,fr+1.4,8),new An({visible:!1}));s.position.set(Rn(t,e),(fr+1)/2,0),s.userData.pegIndex=t,s.layers.set(Ph),on.add(s),gl.push(s);let r=DS(Rn(t,e),!0);on.add(r),To.push(r);for(let o=0;o<n.cap;o++){let a=new wn;a.position.set(Rn(t,e),.28+o*Nh,0),a.visible=!1,on.add(a),fs.push({slot:a,peg:t,level:o,colorIdx:-1})}}kn=new Oe(new to(.46,.6,28),new An({color:16765562,transparent:!0,opacity:.85,side:bn})),kn.rotation.x=-Math.PI/2,kn.position.y=.1,kn.visible=!!(ps&&ps.peg<e),kn.visible&&(kn.position.x=Rn(ps.peg,e)),kn.layers.set(Lh),on.add(kn),lt.add(on),wo(n,!1)}function NS(){let e=new bt,t=new Float32Array(1200*3);e.setAttribute("position",new Wt(t,3));let i=new Float32Array(1200*3).fill(1);e.setAttribute("color",new Wt(i,3)),e.setDrawRange(0,0);let s=new Kr(e,new Bi);s.frustumCulled=!1,s.layers.set(Ih),lt.add(s),qt={points:s,alive:[],max:1200},Fp()}function Fp(){if(!qt)return;let n=qt.points.material,e=Ge.particles==="high";qt.points.material=e?new Bi({size:.11,map:Dp(),vertexColors:!0,transparent:!0,opacity:1,depthWrite:!1,blending:as}):new Bi({color:16770736,size:.05,transparent:!0,opacity:.9}),n.dispose()}var Pp=new Me(16770736);function Bh(n,e,t,i,s,r){if(Vn||!qt)return;i=Math.min(i,bp[Ge.particles]-qt.alive.length);let o=r!=null?new Me(xn[r%xn.length]):Pp;for(let a=0;a<i;a++){let l=gn()<.35?Pp:o;qt.alive.push({x:n,y:e,z:t,vx:(gn()-.5)*s,vy:.6+gn()*1.2,vz:(gn()-.5)*s,life:.7+gn()*.5,r:l.r*1.6,g:l.g*1.6,b:l.b*1.6})}}function US(){let e=new bt,t=new Float32Array(210),i=[],s=Wn(53335);for(let a=0;a<70;a++){let l={x:-7+s()*14,y:.3+s()*5,z:-6+s()*5.5,ph:s()*6.28,sp:.04+s()*.08};i.push(l),t.set([l.x,l.y,l.z],a*3)}e.setAttribute("position",new Wt(t,3));let r=new Bi({size:.05,map:Dp(),color:16769720,transparent:!0,opacity:.4,depthWrite:!1,blending:as}),o=new Kr(e,r);o.frustumCulled=!1,o.layers.set(Ih),lt.add(o),rn={points:o,seed:i,t:0}}function OS(n){let e=Ge.background==="animated";if(rn&&(rn.points.visible=e),!e||Vn){an&&(an.intensity=pl);return}if(rn){rn.t+=n;let t=rn.points.geometry.attributes.position;for(let i=0;i<rn.seed.length;i++){let s=rn.seed[i],r=s.y+rn.t*s.sp%5.2;r>5.4&&(r-=5.2),t.setXYZ(i,s.x+Math.sin(rn.t*.3+s.ph)*.25,r,s.z+Math.cos(rn.t*.25+s.ph)*.2)}t.needsUpdate=!0}if(an){let t=rn?rn.t:0;an.intensity=pl*(1+.035*Math.sin(t*.8)+.015*Math.sin(t*2.7+1.3))}}function FS(n){if(!qt)return;let e=qt.points.geometry.attributes.position,t=qt.alive,i=0;for(let r=0;r<t.length;r++){let o=t[r];o.life-=n,!(o.life<=0||o.y<0)&&(o.x+=o.vx*n,o.y+=o.vy*n,o.z+=o.vz*n,o.vy-=2.4*n,t[i++]=o)}t.length=i;let s=qt.points.geometry.attributes.color;for(let r=0;r<qt.max&&r<t.length;r++){let o=t[r];e.setXYZ(r,o.x,o.y,o.z);let a=Math.min(1,o.life*1.5);s.setXYZ(r,o.r*a,o.g*a,o.b*a)}qt.points.geometry.setDrawRange(0,t.length),e.needsUpdate=!0,s.needsUpdate=!0}function BS(n,e,t){return .28+e*Nh+(t?1.1:0)}function wo(n,e){Ot=n;let t=n.pegs.length,i=new Set;for(let s of fs){let r=n.pegs[s.peg],o=s.level<r.length;if(s.slot.visible=o,!o){s.colorIdx=-1;continue}let a=r[s.level];if(s.colorIdx!==a){for(;s.slot.children.length;){let h=s.slot.children.pop();Fh(h),s.slot.remove(h)}s.slot.add(CS(a)),s.colorIdx=a}let l=ps&&ps.peg===s.peg&&s.level>=r.length-ps.size,c=Rn(s.peg,t),u=BS(s.peg,s.level,l);e&&!Vn?zS(s.slot.position,{x:c,y:u,z:0},.28):s.slot.position.set(c,u,0)}for(let s=0;s<n.pegs.length;s++){let r=n.pegs[s];r.length>=2&&r.every(o=>o===r[0])&&i.add(s)}for(let s of i)!Mh.has(s)&&Ah&&Ah("complete-peg",s),Mh.has(s)||(Bh(Rn(s,t),1.2,0,40,1.6,n.pegs[s][0]),Vn||(xi=Math.max(xi,.05)));Mh=i}function zS(n,e,t){for(let i of Vi)if(i.vec===n){Vi.splice(Vi.indexOf(i),1);break}Vi.push({vec:n,from:n.clone(),to:new C(e.x,e.y,e.z),t:0,dur:t})}function kS(n){for(let e=Vi.length-1;e>=0;e--){let t=Vi[e];t.t+=n;let i=Math.min(1,t.t/t.dur),s=1-Math.pow(1-i,3);t.vec.lerpVectors(t.from,t.to,s),i>=1&&Vi.splice(e,1)}}function _l(){Vi.length=0,Ln()&&Ot&&wo(Ot,!1)}function zh(n,e){Pn=n,Vn=!!(e&&e.reducedMotion),St=new Oa({canvas:Pn,antialias:!0,powerPreference:"high-performance"}),St.outputColorSpace=sn,St.toneMapping=ao,St.toneMappingExposure=1.05,St.shadowMap.type=th,HS(),Ge=hl(Th,yl),St.shadowMap.enabled=vo[Ge.shadows]>0,lt=new tr,dt=new Vt(mn.fov,1,.1,100),dt.layers.enable(Ph),dt.layers.enable(Lh),dt.layers.enable(Ih),on=null,Hn=null,dl=null,fl=null,bo=!1,So=null,rn=null,qt=null,Np(),ms={},Sl(Jn),NS(),US(),zp(),Ml(),window.addEventListener("resize",Lp),Lp(),dr=!0;let t=performance.now(),i=()=>{if(!dr)return;let s=performance.now(),r=Math.min(250,s-t);t=s;let o=Math.min(.05,r/1e3);kS(o),FS(o),OS(o);let a=s/1e3;for(let l of To)l.userData.active&&(l.material.opacity=.35+Math.sin(a*4)*.15);if(dt.position.copy(Dh),xi>5e-4&&!Vn&&(dt.position.x+=(gn()-.5)*xi,dt.position.y+=(gn()-.5)*xi,xi*=.85),!Vn){let l=Math.max(-.5,Math.min(.5,pr.x)),c=Math.max(-.5,Math.min(.5,pr.y));dt.position.x+=l*.6,dt.position.y+=c*.4}dt.lookAt(0,mn.lookY,0),YS(r),Ip=requestAnimationFrame(i)};Ch=i,i()}var Ch=null;function HS(){_o="";try{let e=St.getContext(),t=e.getExtension("WEBGL_debug_renderer_info");_o=String(t&&e.getParameter(t.UNMASKED_RENDERER_WEBGL)||e.getParameter(e.RENDERER)||"")}catch{_o=""}let n=typeof navigator<"u"&&(navigator.maxTouchPoints>0&&typeof matchMedia=="function"&&matchMedia("(pointer: coarse)").matches||/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent||""));yl=Tp(_o,{mobile:n})}function Bp(){if(!an)return;let n=Math.abs(Rn(0,vl||5))+1.4,e=an.shadow.camera,t=Math.max(n,3.2);e.left=-t,e.right=t,e.top=4.2,e.bottom=-3.4,e.near=4,e.far=20,e.updateProjectionMatrix()}function Sl(n){Jn=n,lt.background=new Me(n.bg),lt.fog=new Fa(n.bg,14,30),Np();for(let r of lt.children.filter(o=>o.isLight))lt.remove(r);pl=2.2;let e=new oo(n.key,pl);e.position.set(4,8,5);let t=vo[Ge.shadows];e.castShadow=t>0,e.shadow.mapSize.set(t||1024,t||1024),e.shadow.bias=-4e-4,e.shadow.normalBias=.02,e.shadow.radius=3,lt.add(e),lt.add(e.target),an=e,Bp(),lt.add(new qa(n.ambient,n.bg,.7));let i=new oo(n.ambient,.5);i.position.set(-5,3,-4),lt.add(i);let s=lt.getObjectByName("environment");s&&(lt.remove(s),Fh(s)),lt.add(AS()),on&&Ot&&Op(Ot)}function zp(){if(!(!St||!lt))if(Ge.reflections==="on"){if(!So)try{let n=new $s(St);So=n.fromScene(new ul,.04).texture,n.dispose()}catch{So=null}lt.environment=So,lt.environmentIntensity=.38}else lt.environment=null}function Ln(){return!!(St&&lt&&dt)}function kh(n){Jn=kl(n),Ln()&&Sl(Jn)}function kp(n){let e=ws[n]||ws.default;if(e!==xn&&(xn=e,Ln()&&Sl(Jn),Ln()&&Ot)){for(let t of fs)t.colorIdx=-1;wo(Ot,!1)}}function Hp(n){Vn=!!n,Vn&&(_l(),xi=0,qt&&(qt.alive.length=0))}function Hh(n){let e=Ge;if(Th=Object.assign({},n||{}),Ge=hl(Th,yl),Zn=1,hr=[],fl=null,VS(Ge.showFps),typeof document<"u"&&document.body&&(document.body.dataset.gfxPreset=Ge.preset,document.body.dataset.gfxBackground=Ge.background),Pn&&(Pn.dataset.gfxPreset=Ge.preset),!Ln())return;let t=vo[Ge.shadows];St.shadowMap.enabled=t>0,an&&(an.castShadow=t>0,t>0&&an.shadow.mapSize.x!==t&&(an.shadow.mapSize.set(t,t),an.shadow.map&&(an.shadow.map.dispose(),an.shadow.map=null))),zp(),e.particles!==Ge.particles&&Fp(),e.detail!==Ge.detail&&Sl(Jn),lt.traverse(i=>{let s=i.material;if(s)for(let r of Array.isArray(s)?s:[s])r.needsUpdate=!0})}function Vp(n){let e=[Math.round(Mo[0]*yi),Math.round(Mo[1]*yi)];return{gpu:_o||"unknown GPU",detected:yl,resolved:Ge,summary:Ap(Ge,Ln()?e:null,n),fps:Math.round(wh),adaptiveScale:Math.round(Zn*100)/100,postFailed:bo,webgl:Ln()}}function VS(n){if(typeof document>"u")return;let e=document.getElementById("fps-meter");n&&!e&&(e=document.createElement("div"),e.id="fps-meter",e.setAttribute("aria-hidden","true"),e.textContent="\u2014 fps",(document.getElementById("app")||document.body).append(e)),e&&(e.hidden=!n)}var GS={uniforms:{tDiffuse:{value:null},uAmount:{value:1},uVignette:{value:.28}},vertexShader:"varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`
    uniform sampler2D tDiffuse; uniform float uAmount; uniform float uVignette;
    varying vec2 vUv;
    void main() {
      vec4 src = texture2D(tDiffuse, vUv);
      vec3 c = src.rgb;
      vec3 lc = clamp(c, 0.0, 1.0);
      // Gentle S-curve, a touch more saturation for the dyed yarn, warm highlights / cool shadows.
      vec3 s = mix(lc, lc * lc * (3.0 - 2.0 * lc), 0.22);
      float l = dot(s, vec3(0.299, 0.587, 0.114));
      s = mix(vec3(l), s, 1.1);
      s *= mix(vec3(0.97, 0.98, 1.04), vec3(1.05, 1.0, 0.94), smoothstep(0.2, 0.8, l));
      s = s * 0.97 + 0.02;
      c = mix(c, s + max(c - 1.0, 0.0), uAmount);
      float d = length((vUv - 0.5) * vec2(1.0, 0.9));
      c *= 1.0 - uVignette * smoothstep(0.32, 0.85, d);
      gl_FragColor = vec4(c, src.a);
    }`};function WS(n,e){return Ge.post?[Ge.ao,Ge.bloom,Ge.grade,Ge.antialias,n,e,yi].join("|"):"none"}function XS(n,e){if(Hn&&(Hn.dispose(),Hn=null),dl=null,!Ge.post)return;let t=Math.max(1,Math.round(n*yi)),i=Math.max(1,Math.round(e*yi));try{let s=new ht(t,i,{type:Et,samples:Ge.antialias==="msaa"?4:0}),r=new il(St,s);if(r.setPixelRatio(yi),r.setSize(n,e),r.addPass(new sl(lt,dt)),Ge.ao!=="off"){let o=new ar(lt,dt,t,i);o.output=ar.OUTPUT.Default,o.blendIntensity=.75,o.updateGtaoMaterial({radius:.5,distanceExponent:1.4,thickness:1,scale:1,samples:Ge.ao==="high"?16:8}),o.updatePdMaterial({lumaPhi:10,depthPhi:2,normalPhi:3,radius:Ge.ao==="high"?6:4,rings:2,samples:Ge.ao==="high"?16:8}),r.addPass(o)}if(Ge.bloom==="on"&&r.addPass(new lr(new se(n,e),.32,.5,.9)),Ge.grade==="on"&&(dl=new ds(GS),r.addPass(dl)),r.addPass(new rl),Ge.antialias==="smaa"&&r.addPass(new cl(t,i)),Ge.antialias==="fxaa"){let o=new ds(Sp);o.material.uniforms.resolution.value.set(1/t,1/i),r.addPass(o)}Hn=r,bo=!1}catch{bo=!0,Hn=null}}function qS(n){if(hr.push(n),hr.length<90)return!1;let e=hr.reduce((s,r)=>s+r,0)/hr.length;hr.length=0,wh=1e3/e;let t=typeof document<"u"&&document.getElementById("fps-meter");if(t&&!t.hidden&&(t.textContent=`${Math.round(wh)} fps \xB7 ${Math.round(yi*100)/100}\xD7`),!Ge.adaptive)return!1;let i=Zn;return e>26?Zn=Math.max(.6,Zn-.1):e<14&&Zn<1&&(Zn=Math.min(1,Zn+.05)),i!==Zn}function YS(n){let e=qS(n),t=Pn.clientWidth||window.innerWidth,i=Pn.clientHeight||window.innerHeight,s=Math.min(window.devicePixelRatio||1,Ge.cap)*Ge.scale*(Ge.adaptive?Zn:1);(t!==Mo[0]||i!==Mo[1]||s!==yi||e)&&(Mo=[t,i],yi=s,St.setPixelRatio(s),St.setSize(t,i,!1));let r=WS(t,i);if(r!==fl&&(fl=r,XS(t,i)),Hn)try{globalThis.GameOptions?globalThis.GameOptions.draw(Hn.renderer,()=>Hn.render(n/1e3)):Hn.render(n/1e3);return}catch{bo=!0,Hn=null}globalThis.GameOptions?globalThis.GameOptions.draw(St,()=>St.render(lt,dt)):St.render(lt,dt)}function mr(n){Ot=n,Ln()&&(!on||gl.length!==n.pegs.length||fs.length&&fs[fs.length-1].level+1!==n.cap?Op(n):wo(n,!0))}function Kn(n){ps=n,Ln()&&(kn&&(kn.visible=!!n,n&&(kn.position.x=Rn(n.peg,Ot.pegs.length))),Ot&&wo(Ot,!1))}function Vh(n,e){let{legalActions:t}=Rr,i=new Set;if(e!=null)for(let s of t(n))s.from===e&&i.add(s.to);To.forEach((s,r)=>{s.userData.active=i.has(r),s.visible=i.has(r),i.has(r)||(s.material.opacity=0)})}function Gi(){To.forEach(n=>{n.userData.active=!1,n.visible=!1,n.material.opacity=0})}function Gp(n){let e=Eh[n];if(!e||Vn)return;let t=e.position.x,i=0,s=setInterval(()=>{e.position.x=t+(i%2===0?.06:-.06),++i>5&&(clearInterval(s),e.position.x=t)},40)}function Wp(n){Ah=n}function Xp(n){if(!Ln()||!Ot)return;let e=Ot.pegs[n];Bh(Rn(n,Ot.pegs.length),.4+e.length*Nh,0,12,.8,e[e.length-1])}function qp(){if(!Ln()||!Ot)return;let n=Ot.pegs.length;for(let e=0;e<n;e++)Bh(Rn(e,n),1.4,0,60,2.2,Ot.pegs[e][0]);Vn||(xi=.12)}var Rh=new Ja;Rh.layers.set(Ph);function Gh(n,e){if(!St)return null;let t=Pn.getBoundingClientRect(),i=(n-t.left)/t.width*2-1,s=-((e-t.top)/t.height)*2+1;Rh.setFromCamera({x:i,y:s},dt);let r=Rh.intersectObjects(gl,!1);return r.length?r[0].object.userData.pegIndex:null}function Yp(n,e){pr.x=n,pr.y=e}function Ml(){dt&&(pr.x=0,pr.y=0,xi=0,Wh(),dt.position.copy(Dh),dt.lookAt(0,mn.lookY,0))}function Wh(){if(!dt||!Pn)return;let e=Math.abs(Rn(0,vl||5))+1.1,t=(fr+.6)/2,i=Math.tan(mn.fov*Math.PI/360),s=0;if(typeof document<"u"){let u=Pn.clientHeight||1,h=Pn.getBoundingClientRect();for(let d of["action-tray","a11y-board"]){let p=document.getElementById(d);if(!p)continue;let g=getComputedStyle(p);if(g.display==="none"||g.visibility==="hidden"||p.offsetWidth<=1)continue;let x=p.getBoundingClientRect();(x.width>h.width*.5||x.left<h.left+h.width*.5)&&(s=Math.max(s,(h.bottom-x.top)/u))}}let r=Math.max(.45,1-Math.min(.4,s)-.04),o=Math.hypot(mn.dist,mn.height-mn.lookY),a=t/(i*r),l=e/(i*dt.aspect*.94),c=Math.max(1,a/o,l/o);Dh.set(0,mn.lookY+(mn.height-mn.lookY)*c,mn.dist*c)}function Lp(){if(!St)return;let n=Pn.clientWidth||window.innerWidth,e=Pn.clientHeight||window.innerHeight;St.setSize(n,e,!1),dt.aspect=n/e,dt.updateProjectionMatrix(),Wh()}function Xh(n){!n&&dr?(dr=!1,cancelAnimationFrame(Ip)):n&&!dr&&Ln()&&Ch&&(dr=!0,Ch())}var jt=null,yn={},_i=null,Yh=null,Ao=Wn(1234),bl=0,jp=0,Zp=null,Qp={select:["loop-lift"],deselect:["loop-lower"],move:["loop-place","loop-settle"],invalid:["move-denied"],"complete-peg":["peg-complete"],win:["loom-finished"],lose:["round-over"],undo:["move-undone"],hint:["hint-chime"],click:["ui-click"],back:["ui-back"],"round-start":["round-start"],"time-warning":["time-warning"],achievement:["achievement-unlock"]},Eo=new Map;function gr(){if(jt)return jt;let n=typeof window<"u"&&(window.AudioContext||window.webkitAudioContext);if(!n)return null;jt=new n;let e=jt.createGain();e.connect(jt.destination),yn.master=globalThis.GameOptions?globalThis.GameOptions.tagBus(e,"master"):e;for(let t of["music","effects","ambience","voice"]){let i=jt.createGain();i.connect(e),yn[t]=globalThis.GameOptions?globalThis.GameOptions.tagBus(i,t):i}return $p(),jt}function $p(){if(!jt||!_i)return;let n=_i.muted?0:1;yn.master.gain.value=n,yn.music.gain.value=_i.music,yn.effects.gain.value=_i.effects,yn.ambience.gain.value=_i.ambience,yn.voice.gain.value=_i.voice}function jh(n){_i=n,$p()}function em(n){Yh=n}function Jp(n){Yh&&Yh(n)}function vr(){let n=gr();if(n&&n.state==="suspended"&&n.resume().catch(()=>{}),n)for(let e of Object.values(Qp))e.forEach(tm)}function tm(n){let e=gr();!e||Eo.has(n)||(Eo.set(n,"loading"),fetch(`sfx/${n}.opus`).then(t=>{if(!t.ok)throw new Error(`HTTP ${t.status}`);return t.arrayBuffer()}).then(t=>e.decodeAudioData(t)).then(t=>Eo.set(n,t)).catch(()=>Eo.set(n,null)))}function ZS(n){let e=Qp[n];if(!jt||!e)return!1;let t=e.length===1?e[0]:e[Ao()*e.length|0],i=Eo.get(t);if(i===void 0)return tm(t),!1;if(!i||i==="loading")return!1;let s=globalThis.GameOptions?globalThis.GameOptions.trackSource(jt.createBufferSource(),n):jt.createBufferSource();return s.buffer=i,s.connect(yn.effects),s.start(),!0}function Zh(n){Ao=Wn((n^2772409361)>>>0)}function Yt(n,e,t,i,s,r){let o=gr();if(!o)return;let a=o.currentTime,l=globalThis.GameOptions?globalThis.GameOptions.trackSource(o.createOscillator(),n):o.createOscillator(),c=o.createGain();l.type=i||"sine",l.frequency.setValueAtTime(e,a),r&&l.frequency.exponentialRampToValueAtTime(Math.max(30,e+r),a+t),c.gain.setValueAtTime(s,a),c.gain.setTargetAtTime(0,a+.015,t/4),l.connect(c),c.connect(yn[n]||yn.effects),l.start(a),l.stop(a+t+.3)}function qh(n,e,t,i){let s=gr();if(!s)return;let r=s.currentTime,o=Math.max(1,s.sampleRate*e|0),a=s.createBuffer(1,o,s.sampleRate),l=a.getChannelData(0);for(let d=0;d<o;d++)l[d]=(Ao()*2-1)*(1-d/o);let c=globalThis.GameOptions?globalThis.GameOptions.trackSource(s.createBufferSource(),n):s.createBufferSource();c.buffer=a;let u=s.createBiquadFilter();u.type="bandpass",u.frequency.value=i,u.Q.value=1.2;let h=s.createGain();h.gain.value=t,c.connect(u),u.connect(h),h.connect(yn[n]||yn.effects),c.start(r)}function Ft(n){if(!_i||_i.muted){Jp(Kp(n));return}try{if(vr(),!ZS(n)){let e=.9+Ao()*.2;switch(n){case"select":Yt("effects",520*e,.09,"triangle",.12);break;case"deselect":Yt("effects",380*e,.08,"triangle",.09);break;case"move":qh("effects",.12,.25,900*e),Yt("effects",300*e,.14,"sine",.14,-80);break;case"invalid":Yt("effects",160,.16,"square",.08,-40);break;case"complete-peg":Yt("effects",660*e,.2,"sine",.16,220),qh("effects",.18,.15,2400);break;case"win":[523,659,784,1046].forEach((t,i)=>setTimeout(()=>Yt("effects",t,.35,"sine",.16),i*110));break;case"lose":Yt("effects",220,.4,"sine",.14,-90);break;case"undo":Yt("effects",340,.12,"triangle",.1,120);break;case"hint":Yt("voice",740,.14,"sine",.12,60);break;case"click":Yt("effects",880,.05,"sine",.07);break;case"back":Yt("effects",420,.07,"sine",.07,-60);break;case"round-start":qh("effects",.35,.12,1400),Yt("effects",196*e,.5,"sine",.08,40);break;case"time-warning":[0,180].forEach(t=>setTimeout(()=>Yt("effects",494,.1,"triangle",.12),t));break;case"achievement":[784,988].forEach((t,i)=>setTimeout(()=>Yt("voice",t,.3,"sine",.14),i*140));break;default:Yt("effects",440,.08,"sine",.08)}}}catch{}Jp(Kp(n))}function Kp(n){return{select:"Loop lifted",deselect:"Loop lowered",move:"Loop placed",invalid:"That move is not allowed","complete-peg":"Peg completed",win:"Loom complete",lose:"Round over",undo:"Move undone",hint:"Hint suggested",achievement:"Achievement unlocked",back:"Back","round-start":"Round started","time-warning":"Time running out"}[n]||""}function nm(){let n=gr();if(!(!n||Zp))try{let e=n.sampleRate*2,t=n.createBuffer(1,e,n.sampleRate),i=t.getChannelData(0),s=0;for(let l=0;l<e;l++)s=s*.98+(Ao()*2-1)*.02,i[l]=s*8;let r=globalThis.GameOptions?globalThis.GameOptions.trackSource(n.createBufferSource(),null):n.createBufferSource();r.buffer=t,r.loop=!0;let o=n.createBiquadFilter();o.type="lowpass",o.frequency.value=320;let a=n.createGain();a.gain.value=.5,r.connect(o),o.connect(a),a.connect(yn.ambience),r.start(),Zp={src:r,g:a}}catch{}}function im(n){JS();let e=[261.6,311.1,392,466.2,523.3],t=()=>{if(!jt||jt.state!=="running")return;let i=Math.max(0,Math.min(1,n?n():0)),s=i>.66?3:i>.33?2:1;for(let r=0;r<s;r++){let o=e[(jp+r*2)%e.length];Yt("music",o,1.6,"sine",.05)}jp+=1};gr(),bl=setInterval(t,1600),t()}function JS(){bl&&(clearInterval(bl),bl=0)}function sm(){typeof document>"u"||document.addEventListener("visibilitychange",()=>{jt&&(document.hidden?jt.suspend().catch(()=>{}):jt.resume().catch(()=>{}))})}var rm=0,QS=!1;async function om(n,e){let t=n||(typeof fetch<"u"?fetch:null);if(!t)return null;try{let i=Date.now(),s=await t("/api/v1/time",{method:"GET",headers:e||{}});if(!s.ok)return null;let r=await s.json(),o=Number(r.serverTime??r.now??r.time);return Number.isFinite(o)?(rm=o-(i+Date.now()>>1),QS=!0,o):null}catch{return null}}function $S(){return Date.now()+rm}function Jh(){return Math.floor($S()/864e5)}var Bt=()=>globalThis.StarHermit||null,Qh="",Po="offline",Ro=null,lm=!1,cm=new Set;function eM(){let n=Bt();return n&&n.token||""}function gt(){let n=Bt();return!!(n&&n.signedIn)}function $h(){return Qh}function um(){return Po}function hm(){return Ro}function dm(n){cm.add(n)}function fm(){let n=Bt();return!!n&&n.canSignIn()}function pm(){let n=Bt();return!!n&&n.signIn()}function mm(){return gt()?Bt().inviteLink():null}function gm(n){return gt()?Bt().loadBindings(n):Promise.resolve(n)}function vm(){let n=Bt();!n||lm||(lm=!0,n.init(),n.on("saved",e=>{Po=e?"synced":"offline"}),n.on("saveconflict",()=>{for(let e of Kh)try{e()}catch{}}),n.on("auth",e=>{e.signedIn||(Po="offline",Ro=null);for(let t of cm)try{t(e)}catch{}}),n.signedIn&&(Qh="Player "+String(n.userId).slice(0,6)))}async function ed(){if(!gt())return null;let n=await Bt().loadJSON();return Po="synced",n}var Kh=new Set;function xm(n){return Kh.add(n),()=>Kh.delete(n)}function ym(){let n=Bt();return!!(n&&(n.saveLoadFailed()||n.saveConflicted()))}function yr(n){!gt()||!n||(Po="saving",Bt().saveJSON(n,2e3))}function tM(){return gt()?Bt().flushSave(!0):Promise.resolve(!1)}if(typeof window<"u"&&typeof document<"u"){let n=()=>{gt()&&(tM(),bm())};window.addEventListener("pagehide",n),document.addEventListener("visibilitychange",()=>{document.hidden&&n()})}var Co=null,xr=null,Tl=0;async function _m(){return gt()?await Bt().getSettings()||{}:{}}function Sm(n){Co=JSON.stringify(n)}function Mm(n){if(!gt()||Co===null)return;let e=JSON.stringify(n);if(e===Co)return;let t=JSON.parse(Co);Co=e,xr=xr||{};for(let i of Object.keys(n))JSON.stringify(n[i])!==JSON.stringify(t[i])&&(xr[i]=n[i]);clearTimeout(Tl),Tl=setTimeout(bm,1500)}function bm(){if(clearTimeout(Tl),Tl=0,!xr||!gt())return Promise.resolve(null);let n=xr;return xr=null,Bt().patchSettings(n)}async function Tm(){if(!gt())return!1;let n=await Bt().profile();return n&&(Qh=n.displayName),!!(n&&n.nickname)}async function nM(n){let e=String(n||"");if(!e)return"";let t=await Bt().profile(e);return t?t.displayName:"Player "+e.slice(0,6)}async function td(){if(Ro=null,!gt())return null;let n=await Bt().leaderboard(null,{pageSize:8});return!n||!n.board||!(n.items||[]).length?null:(Ro=await Promise.all(n.items.slice(0,8).map(async e=>({score:e.score|0,name:await nM(e.userId)}))),Ro)}async function wm(n){let e=Bt();if(!e||!gt())return{posted:!1,rank:null};if((await e.submitScores({"high-score":n}).catch(()=>[])).indexOf("high-score")<0)return{posted:!1,rank:null};try{let s=((await e.leaderboard("high-score",{pageSize:100})).items||[]).find(r=>r.userId===e.userId);return{posted:!0,rank:s?s.rank:null}}catch{return{posted:!0,rank:null}}}async function Em(){return gt()?om(null,{Authorization:"Bearer "+eM()}):null}var nd={signIn:"Sign in with StarHermit",invite:"Invite a friend",copied:"Invite link copied",copyFailed:"Could not copy the invite link",signedOut:"Signed out of StarHermit \u2014 progress keeps saving on this device",playingAs:"Playing as {name}",lbPosting:"Posting score to the leaderboard\u2026",lbRank:"Leaderboard rank: #{rank}",lbPosted:"Score posted to the leaderboard.",lbNotPosted:"Score not posted to the leaderboard."},Am={signIn:"Iniciar sesi\xF3n con StarHermit",invite:"Invitar a un amigo",copied:"Enlace de invitaci\xF3n copiado",copyFailed:"No se ha podido copiar el enlace de invitaci\xF3n",signedOut:"Se ha cerrado la sesi\xF3n de StarHermit: el progreso se sigue guardando en este dispositivo",playingAs:"Jugando como {name}",lbPosting:"Enviando la puntuaci\xF3n a la clasificaci\xF3n\u2026",lbRank:"Puesto en la clasificaci\xF3n: #{rank}",lbPosted:"Puntuaci\xF3n enviada a la clasificaci\xF3n.",lbNotPosted:"La puntuaci\xF3n no se envi\xF3 a la clasificaci\xF3n."},sM={...Am,copyFailed:"No se pudo copiar el enlace de invitaci\xF3n",signedOut:"Se cerr\xF3 la sesi\xF3n de StarHermit: el progreso se sigue guardando en este dispositivo"},Cm={signIn:"Se connecter avec StarHermit",invite:"Inviter un ami",copied:"Lien d\u2019invitation copi\xE9",copyFailed:"Impossible de copier le lien d\u2019invitation",signedOut:"D\xE9connect\xE9 de StarHermit \u2014 la progression reste enregistr\xE9e sur cet appareil",playingAs:"Vous jouez en tant que {name}",lbPosting:"Envoi du score au classement\u2026",lbRank:"Rang au classement : #{rank}",lbPosted:"Score envoy\xE9 au classement.",lbNotPosted:"Score non envoy\xE9 au classement."},rM={...Cm,signedOut:"D\xE9connect\xE9 de StarHermit \u2014 la progression reste sauvegard\xE9e sur cet appareil"},Rm={"en-US":nd,"en-GB":nd,"es-419":sM,"es-ES":Am,"de-DE":{signIn:"Mit StarHermit anmelden",invite:"Freund einladen",copied:"Einladungslink kopiert",copyFailed:"Einladungslink konnte nicht kopiert werden",signedOut:"Von StarHermit abgemeldet \u2013 der Fortschritt wird weiter auf diesem Ger\xE4t gespeichert",playingAs:"Angemeldet als {name}",lbPosting:"Punktzahl wird an die Bestenliste gesendet \u2026",lbRank:"Platz in der Bestenliste: #{rank}",lbPosted:"Punktzahl an die Bestenliste gesendet.",lbNotPosted:"Punktzahl wurde nicht an die Bestenliste gesendet."},"fr-FR":Cm,"fr-CA":rM,"pt-BR":{signIn:"Entrar com StarHermit",invite:"Convidar um amigo",copied:"Link de convite copiado",copyFailed:"N\xE3o foi poss\xEDvel copiar o link de convite",signedOut:"Voc\xEA saiu do StarHermit \u2014 o progresso continua salvo neste dispositivo",playingAs:"Jogando como {name}",lbPosting:"Enviando a pontua\xE7\xE3o para o ranking\u2026",lbRank:"Posi\xE7\xE3o no ranking: #{rank}",lbPosted:"Pontua\xE7\xE3o enviada para o ranking.",lbNotPosted:"A pontua\xE7\xE3o n\xE3o foi enviada para o ranking."},"it-IT":{signIn:"Accedi con StarHermit",invite:"Invita un amico",copied:"Link di invito copiato",copyFailed:"Impossibile copiare il link di invito",signedOut:"Disconnesso da StarHermit: i progressi restano salvati su questo dispositivo",playingAs:"Giochi come {name}",lbPosting:"Invio del punteggio alla classifica\u2026",lbRank:"Posizione in classifica: #{rank}",lbPosted:"Punteggio inviato alla classifica.",lbNotPosted:"Punteggio non inviato alla classifica."}};function oM(n){for(let e of n||[]){let t=String(e||""),i=Object.keys(Rm).find(o=>o.toLowerCase()===t.toLowerCase());if(i)return i;let s=t.split("-")[0].toLowerCase();if(s==="en")return/-(gb|uk|ie|au|nz)$/i.test(t)?"en-GB":"en-US";if(s==="es")return/-es$/i.test(t)?"es-ES":"es-419";if(s==="fr")return/-ca$/i.test(t)?"fr-CA":"fr-FR";let r={de:"de-DE",pt:"pt-BR",it:"it-IT"}[s];if(r)return r}return"en-US"}function Pm(n){return Rm[oM(n)]||nd}var id={settings:"Settings",graphics:"Graphics",quality:"Quality",auto:"Auto (detected: {tier})",renderScale:"Render scale",adaptive:"Adaptive resolution",showFps:"Show frame rate",fromPreset:"From preset ({tier})",postFailed:"Post-processing is unavailable on this device, so the game renders without it.",noWebgl:"3D is unavailable, so graphics settings have no effect.",preset:{low:"Low",balanced:"Balanced",high:"High",ultra:"Ultra"},cat:{shadows:"Shadows",ao:"Ambient occlusion",bloom:"Bloom",grade:"Color grade",antialias:"Anti-aliasing",reflections:"Reflections",particles:"Particles",background:"Ambient motion",detail:"Detail"},tier:{off:"Off",on:"On",low:"Low",medium:"Medium",high:"High",fxaa:"FXAA",smaa:"SMAA",msaa:"MSAA",static:"Still",animated:"Animated",plain:"Plain",detailed:"Detailed"},sum:{noShadows:"no shadows",shadows:"{n}\xB2 shadows",ao:"ambient occlusion",aoHigh:"full ambient occlusion",bloom:"bloom",reflections:"reflections",noAa:"no anti-aliasing",px:"{w}\xD7{h} px"}},aM={...id,cat:{...id.cat,grade:"Colour grade"}},sd={settings:"Ajustes",graphics:"Gr\xE1ficos",quality:"Calidad",auto:"Autom\xE1tica (detectada: {tier})",renderScale:"Escala de renderizado",adaptive:"Resoluci\xF3n adaptativa",showFps:"Mostrar fotogramas por segundo",fromPreset:"Seg\xFAn el preajuste ({tier})",postFailed:"El posprocesado no est\xE1 disponible en este dispositivo, as\xED que el juego se muestra sin \xE9l.",noWebgl:"El 3D no est\xE1 disponible, as\xED que los ajustes gr\xE1ficos no tienen efecto.",preset:{low:"Baja",balanced:"Equilibrada",high:"Alta",ultra:"Ultra"},cat:{shadows:"Sombras",ao:"Oclusi\xF3n ambiental",bloom:"Resplandor",grade:"Correcci\xF3n de color",antialias:"Suavizado de bordes",reflections:"Reflejos",particles:"Part\xEDculas",background:"Movimiento ambiental",detail:"Detalle"},tier:{off:"No",on:"S\xED",low:"Bajas",medium:"Medias",high:"Altas",fxaa:"FXAA",smaa:"SMAA",msaa:"MSAA",static:"Quieto",animated:"Animado",plain:"Sencillo",detailed:"Detallado"},sum:{noShadows:"sin sombras",shadows:"sombras {n}\xB2",ao:"oclusi\xF3n ambiental",aoHigh:"oclusi\xF3n ambiental completa",bloom:"resplandor",reflections:"reflejos",noAa:"sin suavizado",px:"{w}\xD7{h} px"}},lM={...sd,settings:"Configuraci\xF3n",cat:{...sd.cat,grade:"Gradaci\xF3n de color"}},cM={settings:"Einstellungen",graphics:"Grafik",quality:"Qualit\xE4t",auto:"Automatisch (erkannt: {tier})",renderScale:"Renderskalierung",adaptive:"Adaptive Aufl\xF6sung",showFps:"Bildrate anzeigen",fromPreset:"Aus Voreinstellung ({tier})",postFailed:"Nachbearbeitung ist auf diesem Ger\xE4t nicht verf\xFCgbar, daher wird ohne sie gerendert.",noWebgl:"3D ist nicht verf\xFCgbar, daher haben Grafikeinstellungen keine Wirkung.",preset:{low:"Niedrig",balanced:"Ausgewogen",high:"Hoch",ultra:"Ultra"},cat:{shadows:"Schatten",ao:"Umgebungsverdeckung",bloom:"Leuchteffekt",grade:"Farbkorrektur",antialias:"Kantengl\xE4ttung",reflections:"Spiegelungen",particles:"Partikel",background:"Umgebungsbewegung",detail:"Detailgrad"},tier:{off:"Aus",on:"An",low:"Niedrig",medium:"Mittel",high:"Hoch",fxaa:"FXAA",smaa:"SMAA",msaa:"MSAA",static:"Unbewegt",animated:"Animiert",plain:"Einfach",detailed:"Detailliert"},sum:{noShadows:"keine Schatten",shadows:"{n}\xB2-Schatten",ao:"Umgebungsverdeckung",aoHigh:"volle Umgebungsverdeckung",bloom:"Leuchteffekt",reflections:"Spiegelungen",noAa:"keine Kantengl\xE4ttung",px:"{w}\xD7{h} px"}},rd={settings:"Param\xE8tres",graphics:"Graphismes",quality:"Qualit\xE9",auto:"Auto (d\xE9tect\xE9e : {tier})",renderScale:"\xC9chelle de rendu",adaptive:"R\xE9solution adaptative",showFps:"Afficher la fr\xE9quence d\u2019images",fromPreset:"Selon le pr\xE9r\xE9glage ({tier})",postFailed:"Le post-traitement n\u2019est pas disponible sur cet appareil ; le jeu s\u2019affiche sans.",noWebgl:"La 3D n\u2019est pas disponible ; les r\xE9glages graphiques sont sans effet.",preset:{low:"Basse",balanced:"\xC9quilibr\xE9e",high:"Haute",ultra:"Ultra"},cat:{shadows:"Ombres",ao:"Occlusion ambiante",bloom:"Halo lumineux",grade:"\xC9talonnage des couleurs",antialias:"Anticr\xE9nelage",reflections:"Reflets",particles:"Particules",background:"Mouvement d\u2019ambiance",detail:"D\xE9tails"},tier:{off:"Non",on:"Oui",low:"Basses",medium:"Moyennes",high:"Hautes",fxaa:"FXAA",smaa:"SMAA",msaa:"MSAA",static:"Fixe",animated:"Anim\xE9",plain:"Simple",detailed:"D\xE9taill\xE9"},sum:{noShadows:"sans ombres",shadows:"ombres {n}\xB2",ao:"occlusion ambiante",aoHigh:"occlusion ambiante compl\xE8te",bloom:"halo",reflections:"reflets",noAa:"sans anticr\xE9nelage",px:"{w}\xD7{h} px"}},uM={...rd,settings:"R\xE9glages",cat:{...rd.cat,grade:"Correction des couleurs"}},hM={settings:"Configura\xE7\xF5es",graphics:"Gr\xE1ficos",quality:"Qualidade",auto:"Autom\xE1tica (detectada: {tier})",renderScale:"Escala de renderiza\xE7\xE3o",adaptive:"Resolu\xE7\xE3o adaptativa",showFps:"Mostrar taxa de quadros",fromPreset:"Do predefinido ({tier})",postFailed:"O p\xF3s-processamento n\xE3o est\xE1 dispon\xEDvel neste dispositivo, ent\xE3o o jogo \xE9 exibido sem ele.",noWebgl:"O 3D n\xE3o est\xE1 dispon\xEDvel, ent\xE3o as configura\xE7\xF5es gr\xE1ficas n\xE3o t\xEAm efeito.",preset:{low:"Baixa",balanced:"Equilibrada",high:"Alta",ultra:"Ultra"},cat:{shadows:"Sombras",ao:"Oclus\xE3o ambiente",bloom:"Brilho",grade:"Corre\xE7\xE3o de cor",antialias:"Antisserrilhado",reflections:"Reflexos",particles:"Part\xEDculas",background:"Movimento ambiente",detail:"Detalhes"},tier:{off:"N\xE3o",on:"Sim",low:"Baixas",medium:"M\xE9dias",high:"Altas",fxaa:"FXAA",smaa:"SMAA",msaa:"MSAA",static:"Parado",animated:"Animado",plain:"Simples",detailed:"Detalhado"},sum:{noShadows:"sem sombras",shadows:"sombras {n}\xB2",ao:"oclus\xE3o ambiente",aoHigh:"oclus\xE3o ambiente completa",bloom:"brilho",reflections:"reflexos",noAa:"sem antisserrilhado",px:"{w}\xD7{h} px"}},dM={settings:"Impostazioni",graphics:"Grafica",quality:"Qualit\xE0",auto:"Automatica (rilevata: {tier})",renderScale:"Scala di rendering",adaptive:"Risoluzione adattiva",showFps:"Mostra frequenza fotogrammi",fromPreset:"Da preimpostazione ({tier})",postFailed:"La post-elaborazione non \xE8 disponibile su questo dispositivo, quindi il gioco viene mostrato senza.",noWebgl:"Il 3D non \xE8 disponibile, quindi le impostazioni grafiche non hanno effetto.",preset:{low:"Bassa",balanced:"Bilanciata",high:"Alta",ultra:"Ultra"},cat:{shadows:"Ombre",ao:"Occlusione ambientale",bloom:"Bagliore",grade:"Correzione colore",antialias:"Antialiasing",reflections:"Riflessi",particles:"Particelle",background:"Movimento ambientale",detail:"Dettaglio"},tier:{off:"No",on:"S\xEC",low:"Basse",medium:"Medie",high:"Alte",fxaa:"FXAA",smaa:"SMAA",msaa:"MSAA",static:"Fermo",animated:"Animato",plain:"Semplice",detailed:"Dettagliato"},sum:{noShadows:"senza ombre",shadows:"ombre {n}\xB2",ao:"occlusione ambientale",aoHigh:"occlusione ambientale completa",bloom:"bagliore",reflections:"riflessi",noAa:"senza antialiasing",px:"{w}\xD7{h} px"}},Lm={"en-US":id,"en-GB":aM,"es-419":lM,"es-ES":sd,"de-DE":cM,"fr-FR":rd,"fr-CA":uM,"pt-BR":hM,"it-IT":dM};function fM(n){let e=String(n||"en-US"),t=Object.keys(Lm).find(r=>r.toLowerCase()===e.toLowerCase());if(t)return t;let[i,s=""]=e.toLowerCase().split("-");return i==="en"?["gb","uk","ie","au","nz"].includes(s)?"en-GB":"en-US":i==="es"?s==="es"||!s?"es-ES":"es-419":i==="fr"?s==="ca"?"fr-CA":"fr-FR":i==="pt"?"pt-BR":i==="de"?"de-DE":i==="it"?"it-IT":"en-US"}function od(n){return Lm[fM(n)]}var Im={"Color palette":"Colour palette","Loops may only land on a matching color or an empty peg.":"Loops may only land on a matching colour or an empty peg.","Sort every loop so each peg holds one color.":"Sort every loop so each peg holds one colour.","Move loops between pegs until every peg holds one color.":"Move loops between pegs until every peg holds one colour.","A textile atelier of colored loops and brass pegs.":"A textile atelier of coloured loops and brass pegs.","Move loops between pegs \u2014 keeping their stack order \u2014 until every peg is one color.":"Move loops between pegs \u2014 keeping their stack order \u2014 until every peg is one colour.","move loops between pegs \u2014 keeping their stack order \u2014 until every peg holds a single color.":"move loops between pegs \u2014 keeping their stack order \u2014 until every peg holds a single colour.","Only the top loop group lifts. Same-colored loops touching at the top move together.":"Only the top loop group lifts. Same-coloured loops touching at the top move together.","A group lands on a matching color or an empty peg, never past a peg's capacity.":"A group lands on a matching colour or an empty peg, never past a peg's capacity.","Match colors":"Match colours","A loop may only land on a matching color or an empty peg. Mismatched pegs reject the drop.":"A loop may only land on a matching colour or an empty peg. Mismatched pegs reject the drop.","Same-colored loops touching at the top lift together as one group, keeping their order.":"Same-coloured loops touching at the top lift together as one group, keeping their order."};var ad={"That is the same peg.":"Es la misma clavija.","That peg is empty.":"Esa clavija est\xE1 vac\xEDa.","That peg is full.":"Esa clavija est\xE1 llena.","Loops may only land on a matching color or an empty peg.":"Los aros solo pueden ir sobre el mismo color o en una clavija vac\xEDa.","The round is over.":"La ronda termin\xF3.","Unknown peg.":"Clavija desconocida.","Stage {n}":"Etapa {n}","Practice \xB7 difficulty {n}":"Pr\xE1ctica \xB7 dificultad {n}",Learn:"Aprender",Journey:"Traves\xEDa",Daily:"Diario",Practice:"Pr\xE1ctica",Challenge:"Desaf\xEDo","Score chase":"Caza de puntos",Loading:"Cargando","Title screen":"Pantalla de inicio",Ready:"Listo","Mode selection":"Selecci\xF3n de modo","Preparing round":"Preparando la ronda",Tutorial:"Tutorial","Get ready":"Prep\xE1rate","Round active":"Ronda en curso",Paused:"En pausa",Reconnecting:"Reconectando",Resolving:"Calculando el resultado",Results:"Resultados",Progression:"Progreso","Goal:":"Objetivo:","move loops between pegs \u2014 keeping their stack order \u2014 until every peg holds a single color.":"mueve los aros entre clavijas, respetando su orden de apilado, hasta que cada clavija tenga un solo color.",Rules:"Reglas","Only the top loop group lifts. Same-colored loops touching at the top move together.":"Solo se levanta el grupo de aros de arriba. Los aros del mismo color que se tocan arriba se mueven juntos.","A group lands on a matching color or an empty peg, never past a peg's capacity.":"Un grupo va sobre el mismo color o en una clavija vac\xEDa, nunca por encima de su capacidad.","Invalid drops are rejected with an explanation.":"Los movimientos no v\xE1lidos se rechazan con una explicaci\xF3n.",Controls:"Controles","Pointer/touch: tap a peg to lift, tap a target to drop. Drag also works.":"Puntero/t\xE1ctil: toca una clavija para levantar y toca el destino para soltar. Tambi\xE9n puedes arrastrar.","Keyboard: {move} choose peg, {confirm} lift/drop, {cancel} cancel, {undo} undo, {hint} hint, {pause} pause, {camera} reset camera.":"Teclado: {move} elegir clavija, {confirm} levantar/soltar, {cancel} cancelar, {undo} deshacer, {hint} pista, {pause} pausa, {camera} restablecer c\xE1mara.","Gamepad: D-pad/left stick chooses a peg, south button lifts/drops, east cancels, start pauses.":"Control: la cruceta o el stick izquierdo eligen clavija, el bot\xF3n inferior levanta/suelta, el derecho cancela y Start pausa.",Scoring:"Puntuaci\xF3n","Completion + efficiency vs par + no-undo mastery \u2212 invalid attempts.":"Finalizaci\xF3n + eficiencia frente al par + maestr\xEDa sin deshacer \u2212 intentos no v\xE1lidos.","Ties: completion, fewer invalid actions, faster time, then session id.":"Empates: finalizaci\xF3n, menos acciones no v\xE1lidas, menor tiempo y luego ID de sesi\xF3n.","Sort every loop so each peg holds one color.":"Ordena todos los aros para que cada clavija tenga un solo color.","Solo \xB7 ~{n} min \xB7 assists: hints/undo":"Individual \xB7 ~{n} min \xB7 ayudas: pistas/deshacer","(ranked \u2014 undo lowers mastery bonus)":"(clasificatoria: deshacer reduce el bono de maestr\xEDa)","(unranked)":"(sin clasificaci\xF3n)",Difficulty:"Dificultad","Level {n}":"Nivel {n}","Ten seconds left.":"Quedan diez segundos.","Round started. {title}.":"Ronda iniciada. {title}.","Loom complete!":"\xA1Telar completado!","Out of time":"Se acab\xF3 el tiempo","Out of moves":"Sin movimientos",Completion:"Finalizaci\xF3n","Efficiency (par {par}, {moves} moves)":"Eficiencia (par {par}, {moves} movimientos)","No-undo mastery":"Maestr\xEDa sin deshacer","Invalid attempts":"Intentos no v\xE1lidos",Total:"Total",Time:"Tiempo","Your best local score: {score} ({moves} moves).":"Tu mejor puntuaci\xF3n local: {score} ({moves} movimientos).","This is your first recorded score.":"Esta es tu primera puntuaci\xF3n registrada.","Next stage":"Siguiente etapa","Next lesson":"Siguiente lecci\xF3n","Start the Journey":"Empezar la traves\xEDa","Play again":"Jugar de nuevo","Moves {n}/{limit}":"Movimientos {n}/{limit}","Moves {n}":"Movimientos {n}","Score {n}":"Puntos {n}","Uniform pegs: {done} / {total}":"Clavijas de un color: {done} / {total}","Good! Finish the loom.":"\xA1Bien! Termina el telar.",synced:"sincronizado","saving\u2026":"guardando\u2026","sync error":"error de sincronizaci\xF3n",offline:"sin conexi\xF3n","Mode: {mode} \xB7 {title}":"Modo: {mode} \xB7 {title}","{name} \xB7 cloud save {status}":"{name} \xB7 guardado en la nube {status}","Playing locally \u2014 scores are stored on this device.":"Juego local: las puntuaciones se guardan en este dispositivo.","Move loops between pegs until every peg holds one color.":"Mueve los aros hasta que cada clavija tenga un solo color.","Par {par} \xB7 seed {seed}":"Par {par} \xB7 semilla {seed}","{n} moves":"{n} movimientos","No scores yet.":"A\xFAn no hay puntuaciones.","Journey: {done}/{total} stages \xB7 {ach}/{achTotal} achievements \xB7 {rounds} rounds completed":"Traves\xEDa: {done}/{total} etapas \xB7 {ach}/{achTotal} logros \xB7 {rounds} rondas completadas","Peg {n}: {loops}":"Clavija {n}: {loops}",empty:"vac\xEDa","{label} (lifted)":"{label} (levantado)","Moved to peg {n}.":"Movido a la clavija {n}.","Lesson step complete. Now finish the loom on your own.":"Paso de la lecci\xF3n completado. Ahora termina el telar por tu cuenta.","That move is not allowed.":"Ese movimiento no est\xE1 permitido.","Nothing to undo.":"No hay nada que deshacer.","Move undone.":"Movimiento deshecho.","No useful move found \u2014 try undo.":"No hay movimientos \xFAtiles: prueba a deshacer.","Hint: try peg {from} \u2192 peg {to}.":"Pista: prueba clavija {from} \u2192 clavija {to}.","Hint: move from peg {from} to peg {to}.":"Pista: mueve de la clavija {from} a la clavija {to}.","Welcome back \u2014 the atelier kept your place.":"Bienvenido de nuevo: el taller guard\xF3 tu lugar.","Round restored from your last safe snapshot.":"Ronda restaurada desde tu \xFAltimo punto guardado.","Journey {done}/{total} \xB7 Daily day {day}":"Traves\xEDa {done}/{total} \xB7 Desaf\xEDo diario d\xEDa {day}","cloud save {status}":"guardado en la nube {status}","local play":"juego local","Loom complete. Total score {score}.":"Telar completado. Puntuaci\xF3n total {score}.","Round over. Total score {score}.":"Ronda terminada. Puntuaci\xF3n total {score}.","Lifted {n} {color} loops from peg {peg}. Choose a target peg.":"Levantaste {n} aros {color} de la clavija {peg}. Elige una clavija de destino.","Lifted {n} {color} loop from peg {peg}. Choose a target peg.":"Levantaste {n} aro {color} de la clavija {peg}. Elige una clavija de destino.","Stage {n} completed":"Etapa {n} completada","Stage {n} locked":"Etapa {n} bloqueada","Loop Loom playfield":"Tablero de Loop Loom","Open objective panel":"Abrir panel de objetivo","Pause game":"Pausar juego","Objective and progression":"Objetivo y progreso",Objective:"Objetivo",Undo:"Deshacer",Hint:"Pista",Restart:"Reiniciar","Skip anim":"Omitir anim.","Status and scores":"Estado y puntuaciones",Status:"Estado","Top scores":"Mejores puntuaciones",Achievements:"Logros",Help:"Ayuda",Panel:"Panel","Reset view (R)":"Restablecer vista (R)",View:"Vista",Pegs:"Clavijas","A textile atelier of colored loops and brass pegs.":"Un taller textil de aros de colores y clavijas de lat\xF3n.","Move loops between pegs \u2014 keeping their stack order \u2014 until every peg is one color.":"Mueve los aros entre clavijas, respetando su orden, hasta que cada clavija sea de un solo color.",Play:"Jugar","Resume saved round":"Reanudar ronda guardada","Modes & progress":"Modos y progreso","How to play":"C\xF3mo jugar",Settings:"Configuraci\xF3n","Choose a mode":"Elige un modo","Learn \u2014 interactive lessons":"Aprender: lecciones interactivas","Journey \u2014 48 stages":"Traves\xEDa: 48 etapas","Daily \u2014 one shared loom per UTC day":"Diario: un telar compartido por d\xEDa UTC","Practice \u2014 unranked, undo allowed":"Pr\xE1ctica: sin clasificaci\xF3n, deshacer permitido","Challenge \u2014 constrained goals":"Desaf\xEDo: objetivos con restricciones","Score chase \u2014 leaderboards":"Caza de puntos: clasificaciones",Back:"Volver","Start round":"Empezar ronda",Resume:"Continuar","Leave to title":"Volver al inicio",Audio:"Audio",Music:"M\xFAsica",Effects:"Efectos",Ambience:"Ambiente","Voice cues":"Indicaciones de voz","Mute all":"Silenciar todo","Reduced motion":"Movimiento reducido",Accessibility:"Accesibilidad","Color palette":"Paleta de colores",Default:"Predeterminada","Deuteranopia-safe":"Apta para deuteranop\xEDa","Protanopia-safe":"Apta para protanop\xEDa","Tritanopia-safe":"Apta para tritanop\xEDa","High contrast":"Alto contraste","High contrast UI":"Interfaz de alto contraste","Larger text":"Texto m\xE1s grande","Left-handed controls":"Controles para zurdos","Hold to lift (vs tap)":"Mantener para levantar (en vez de tocar)","Timing assistance":"Asistencia de tiempo",Haptics:"Vibraci\xF3n",Privacy:"Privacidad","Share anonymous usage counters":"Compartir contadores de uso an\xF3nimos","Replay tutorial":"Repetir tutorial",Done:"Listo",Retry:"Reintentar",Title:"Inicio",Close:"Cerrar","3D unavailable":"3D no disponible","This device or browser could not create a WebGL context. Your progress and settings are preserved. You can still play with the accessible board below.":"Este dispositivo o navegador no pudo crear un contexto WebGL. Tu progreso y tu configuraci\xF3n se conservan. Puedes seguir jugando con el tablero accesible de abajo.","Continue in 2D":"Continuar en 2D","Loading\u2026":"Cargando\u2026","Preparing the atelier.":"Preparando el taller.",crimson:"carmes\xED",indigo:"\xEDndigo",fern:"helecho",marigold:"cal\xE9ndula",violet:"violeta",ember:"brasa","Daily Loom":"Telar diario","Score Chase":"Caza de puntos","Lift & drop":"Levantar y soltar","Loops lift from the TOP of a peg. Select the highlighted peg, then drop the loop onto the empty peg.":"Los aros se levantan desde ARRIBA de la clavija. Selecciona la clavija resaltada y suelta el aro en la clavija vac\xEDa.","Lift the indigo loop off peg one onto the empty peg.":"Pasa el aro \xEDndigo de la clavija uno a la clavija vac\xEDa.","Now stack crimson onto crimson to finish.":"Ahora apila carmes\xED sobre carmes\xED para terminar.","Match colors":"Combina colores","A loop may only land on a matching color or an empty peg. Mismatched pegs reject the drop.":"Un aro solo puede ir sobre el mismo color o en una clavija vac\xEDa. Las clavijas de otro color lo rechazan.","Lift the indigo loop off peg one onto an empty peg.":"Pasa el aro \xEDndigo de la clavija uno a una clavija vac\xEDa.","Now stack crimson onto the crimson-topped peg.":"Ahora apila carmes\xED sobre la clavija con carmes\xED arriba.","Group lift":"Levantar en grupo","Same-colored loops touching at the top lift together as one group, keeping their order.":"Los aros del mismo color que se tocan arriba se levantan juntos como grupo, sin perder su orden.","Lift BOTH indigo loops at once onto the empty peg.":"Pasa LOS DOS aros \xEDndigo a la vez a la clavija vac\xEDa.","Uniform pegs":"Clavijas de un color","You win when every peg is uniform. Solve this small loom on your own.":"Ganas cuando todas las clavijas son de un solo color. Resuelve este peque\xF1o telar por tu cuenta.","Taut Thread":"Hilo tenso","Solve within a tight move limit.":"Resuelve con un l\xEDmite de movimientos ajustado.","Swap Meet":"Mercadillo","A harder loom with barely any slack.":"Un telar m\xE1s dif\xEDcil, casi sin margen.","Swift Shuttle":"Lanzadera veloz","Solve before the timer runs out.":"Resuelve antes de que se acabe el tiempo.","No Takebacks":"Sin vuelta atr\xE1s","Undo is disabled. Every drop is final.":"Deshacer est\xE1 desactivado. Cada movimiento es definitivo.","First Weave":"Primer tejido","Apprentice of the Loom":"Aprendiz del telar","Seven Suns":"Siete soles","Master Weaver":"Maestro tejedor","Hundred Hands":"Cien manos","Loop lifted":"Aro levantado","Loop lowered":"Aro bajado","Loop placed":"Aro colocado","That move is not allowed":"Ese movimiento no est\xE1 permitido","Peg completed":"Clavija completada","Loom complete":"Telar completado","Round over":"Ronda terminada","Move undone":"Movimiento deshecho","Hint suggested":"Pista sugerida","Achievement unlocked":"Logro desbloqueado","Round started":"Ronda iniciada","Time running out":"Se acaba el tiempo"},Dm={Settings:"Ajustes","The round is over.":"La ronda ha terminado.","Welcome back \u2014 the atelier kept your place.":"Bienvenido de nuevo: el taller ha guardado tu sitio.","Lifted {n} {color} loops from peg {peg}. Choose a target peg.":"Has levantado {n} aros {color} de la clavija {peg}. Elige una clavija de destino.","Lifted {n} {color} loop from peg {peg}. Choose a target peg.":"Has levantado {n} aro {color} de la clavija {peg}. Elige una clavija de destino.","Gamepad: D-pad/left stick chooses a peg, south button lifts/drops, east cancels, start pauses.":"Mando: la cruceta o el stick izquierdo eligen clavija, el bot\xF3n inferior levanta/suelta, el derecho cancela y Start pausa.","This device or browser could not create a WebGL context. Your progress and settings are preserved. You can still play with the accessible board below.":"Este dispositivo o navegador no ha podido crear un contexto WebGL. Tu progreso y tus ajustes se conservan. Puedes seguir jugando con el tablero accesible de abajo."};var Nm={"That is the same peg.":"Das ist derselbe Stab.","That peg is empty.":"Dieser Stab ist leer.","That peg is full.":"Dieser Stab ist voll.","Loops may only land on a matching color or an empty peg.":"Schlaufen d\xFCrfen nur auf passender Farbe oder einem leeren Stab landen.","The round is over.":"Die Runde ist vorbei.","Unknown peg.":"Unbekannter Stab.","Stage {n}":"Etappe {n}","Practice \xB7 difficulty {n}":"Training \xB7 Schwierigkeit {n}",Learn:"Lernen",Journey:"Reise",Daily:"T\xE4glich",Practice:"Training",Challenge:"Herausforderung","Score chase":"Punktejagd",Loading:"Wird geladen","Title screen":"Titelbildschirm",Ready:"Bereit","Mode selection":"Modusauswahl","Preparing round":"Runde wird vorbereitet",Tutorial:"Anleitung","Get ready":"Mach dich bereit","Round active":"Runde l\xE4uft",Paused:"Pausiert",Reconnecting:"Verbindung wird wiederhergestellt",Resolving:"Wird ausgewertet",Results:"Ergebnisse",Progression:"Fortschritt","Goal:":"Ziel:","move loops between pegs \u2014 keeping their stack order \u2014 until every peg holds a single color.":"Verschiebe Schlaufen zwischen den St\xE4ben \u2013 in ihrer Stapelreihenfolge \u2013, bis jeder Stab nur eine Farbe tr\xE4gt.",Rules:"Regeln","Only the top loop group lifts. Same-colored loops touching at the top move together.":"Nur die oberste Schlaufengruppe l\xE4sst sich anheben. Gleichfarbige Schlaufen, die oben aneinanderliegen, bewegen sich zusammen.","A group lands on a matching color or an empty peg, never past a peg's capacity.":"Eine Gruppe landet auf passender Farbe oder einem leeren Stab, nie \xFCber dessen Kapazit\xE4t hinaus.","Invalid drops are rejected with an explanation.":"Ung\xFCltige Ablagen werden mit einer Erkl\xE4rung abgelehnt.",Controls:"Steuerung","Pointer/touch: tap a peg to lift, tap a target to drop. Drag also works.":"Zeiger/Touch: Stab antippen zum Anheben, Ziel antippen zum Ablegen. Ziehen geht auch.","Keyboard: {move} choose peg, {confirm} lift/drop, {cancel} cancel, {undo} undo, {hint} hint, {pause} pause, {camera} reset camera.":"Tastatur: {move} Stab w\xE4hlen, {confirm} anheben/ablegen, {cancel} abbrechen, {undo} r\xFCckg\xE4ngig, {hint} Tipp, {pause} Pause, {camera} Kamera zur\xFCcksetzen.","Gamepad: D-pad/left stick chooses a peg, south button lifts/drops, east cancels, start pauses.":"Gamepad: Steuerkreuz/linker Stick w\xE4hlt einen Stab, untere Taste hebt an/legt ab, rechte Taste bricht ab, Start pausiert.",Scoring:"Wertung","Completion + efficiency vs par + no-undo mastery \u2212 invalid attempts.":"Abschluss + Effizienz gegen\xFCber Par + Meisterschaft ohne R\xFCckg\xE4ngig \u2212 ung\xFCltige Versuche.","Ties: completion, fewer invalid actions, faster time, then session id.":"Gleichstand: Abschluss, weniger ung\xFCltige Aktionen, schnellere Zeit, dann Sitzungs-ID.","Sort every loop so each peg holds one color.":"Sortiere alle Schlaufen, sodass jeder Stab eine Farbe tr\xE4gt.","Solo \xB7 ~{n} min \xB7 assists: hints/undo":"Solo \xB7 ~{n} Min. \xB7 Hilfen: Tipps/R\xFCckg\xE4ngig","(ranked \u2014 undo lowers mastery bonus)":"(gewertet \u2013 R\xFCckg\xE4ngig senkt den Meisterbonus)","(unranked)":"(ohne Wertung)",Difficulty:"Schwierigkeit","Level {n}":"Stufe {n}","Ten seconds left.":"Noch zehn Sekunden.","Round started. {title}.":"Runde gestartet. {title}.","Loom complete!":"Webstuhl fertig!","Out of time":"Zeit abgelaufen","Out of moves":"Keine Z\xFCge mehr",Completion:"Abschluss","Efficiency (par {par}, {moves} moves)":"Effizienz (Par {par}, {moves} Z\xFCge)","No-undo mastery":"Meisterschaft ohne R\xFCckg\xE4ngig","Invalid attempts":"Ung\xFCltige Versuche",Total:"Gesamt",Time:"Zeit","Your best local score: {score} ({moves} moves).":"Deine beste lokale Punktzahl: {score} ({moves} Z\xFCge).","This is your first recorded score.":"Das ist deine erste gespeicherte Punktzahl.","Next stage":"N\xE4chste Etappe","Next lesson":"N\xE4chste Lektion","Start the Journey":"Reise beginnen","Play again":"Nochmal spielen","Moves {n}/{limit}":"Z\xFCge {n}/{limit}","Moves {n}":"Z\xFCge {n}","Score {n}":"Punkte {n}","Uniform pegs: {done} / {total}":"Einfarbige St\xE4be: {done} / {total}","Good! Finish the loom.":"Gut! Mach den Webstuhl fertig.",synced:"synchronisiert","saving\u2026":"wird gespeichert \u2026","sync error":"Synchronisierungsfehler",offline:"offline","Mode: {mode} \xB7 {title}":"Modus: {mode} \xB7 {title}","{name} \xB7 cloud save {status}":"{name} \xB7 Cloud-Speicher {status}","Playing locally \u2014 scores are stored on this device.":"Lokales Spiel \u2013 Punkte werden auf diesem Ger\xE4t gespeichert.","Move loops between pegs until every peg holds one color.":"Verschiebe Schlaufen, bis jeder Stab nur eine Farbe tr\xE4gt.","Par {par} \xB7 seed {seed}":"Par {par} \xB7 Startwert {seed}","{n} moves":"{n} Z\xFCge","No scores yet.":"Noch keine Punkte.","Journey: {done}/{total} stages \xB7 {ach}/{achTotal} achievements \xB7 {rounds} rounds completed":"Reise: {done}/{total} Etappen \xB7 {ach}/{achTotal} Erfolge \xB7 {rounds} Runden abgeschlossen","Peg {n}: {loops}":"Stab {n}: {loops}",empty:"leer","{label} (lifted)":"{label} (angehoben)","Moved to peg {n}.":"Auf Stab {n} verschoben.","Lesson step complete. Now finish the loom on your own.":"Lektionsschritt geschafft. Mach den Webstuhl jetzt allein fertig.","That move is not allowed.":"Dieser Zug ist nicht erlaubt.","Nothing to undo.":"Nichts r\xFCckg\xE4ngig zu machen.","Move undone.":"Zug r\xFCckg\xE4ngig gemacht.","No useful move found \u2014 try undo.":"Kein sinnvoller Zug gefunden \u2013 versuch es mit R\xFCckg\xE4ngig.","Hint: try peg {from} \u2192 peg {to}.":"Tipp: Stab {from} \u2192 Stab {to}.","Hint: move from peg {from} to peg {to}.":"Tipp: von Stab {from} auf Stab {to} verschieben.","Welcome back \u2014 the atelier kept your place.":"Willkommen zur\xFCck \u2013 das Atelier hat deinen Stand bewahrt.","Round restored from your last safe snapshot.":"Runde aus deinem letzten gesicherten Stand wiederhergestellt.","Journey {done}/{total} \xB7 Daily day {day}":"Reise {done}/{total} \xB7 Tagesaufgabe Tag {day}","cloud save {status}":"Cloud-Speicher {status}","local play":"lokales Spiel","Loom complete. Total score {score}.":"Webstuhl fertig. Gesamtpunktzahl {score}.","Round over. Total score {score}.":"Runde vorbei. Gesamtpunktzahl {score}.","Lifted {n} {color} loops from peg {peg}. Choose a target peg.":"{n} Schlaufen ({color}) von Stab {peg} angehoben. W\xE4hle einen Zielstab.","Lifted {n} {color} loop from peg {peg}. Choose a target peg.":"{n} Schlaufe ({color}) von Stab {peg} angehoben. W\xE4hle einen Zielstab.","Stage {n} completed":"Etappe {n} abgeschlossen","Stage {n} locked":"Etappe {n} gesperrt","Loop Loom playfield":"Loop-Loom-Spielfeld","Open objective panel":"Zielbereich \xF6ffnen","Pause game":"Spiel pausieren","Objective and progression":"Ziel und Fortschritt",Objective:"Ziel",Undo:"R\xFCckg\xE4ngig",Hint:"Tipp",Restart:"Neu starten","Skip anim":"Animation \xFCberspringen","Status and scores":"Status und Punkte",Status:"Status","Top scores":"Bestwerte",Achievements:"Erfolge",Help:"Hilfe",Panel:"Bereich","Reset view (R)":"Ansicht zur\xFCcksetzen (R)",View:"Ansicht",Pegs:"St\xE4be","A textile atelier of colored loops and brass pegs.":"Ein Textilatelier aus bunten Schlaufen und Messingst\xE4ben.","Move loops between pegs \u2014 keeping their stack order \u2014 until every peg is one color.":"Verschiebe Schlaufen zwischen den St\xE4ben \u2013 in ihrer Stapelreihenfolge \u2013, bis jeder Stab einfarbig ist.",Play:"Spielen","Resume saved round":"Gespeicherte Runde fortsetzen","Modes & progress":"Modi & Fortschritt","How to play":"Spielanleitung",Settings:"Einstellungen","Choose a mode":"W\xE4hle einen Modus","Learn \u2014 interactive lessons":"Lernen \u2013 interaktive Lektionen","Journey \u2014 48 stages":"Reise \u2013 48 Etappen","Daily \u2014 one shared loom per UTC day":"T\xE4glich \u2013 ein gemeinsamer Webstuhl pro UTC-Tag","Practice \u2014 unranked, undo allowed":"Training \u2013 ohne Wertung, R\xFCckg\xE4ngig erlaubt","Challenge \u2014 constrained goals":"Herausforderung \u2013 Ziele mit Auflagen","Score chase \u2014 leaderboards":"Punktejagd \u2013 Ranglisten",Back:"Zur\xFCck","Start round":"Runde starten",Resume:"Weiter","Leave to title":"Zum Hauptmen\xFC",Audio:"Audio",Music:"Musik",Effects:"Effekte",Ambience:"Atmosph\xE4re","Voice cues":"Sprachhinweise","Mute all":"Alles stumm","Reduced motion":"Weniger Bewegung",Accessibility:"Barrierefreiheit","Color palette":"Farbpalette",Default:"Standard","Deuteranopia-safe":"F\xFCr Deuteranopie","Protanopia-safe":"F\xFCr Protanopie","Tritanopia-safe":"F\xFCr Tritanopie","High contrast":"Hoher Kontrast","High contrast UI":"Oberfl\xE4che mit hohem Kontrast","Larger text":"Gr\xF6\xDFerer Text","Left-handed controls":"Linksh\xE4nder-Steuerung","Hold to lift (vs tap)":"Zum Anheben halten (statt tippen)","Timing assistance":"Zeithilfe",Haptics:"Vibration",Privacy:"Datenschutz","Share anonymous usage counters":"Anonyme Nutzungsz\xE4hler teilen","Replay tutorial":"Anleitung wiederholen",Done:"Fertig",Retry:"Nochmal",Title:"Hauptmen\xFC",Close:"Schlie\xDFen","3D unavailable":"3D nicht verf\xFCgbar","This device or browser could not create a WebGL context. Your progress and settings are preserved. You can still play with the accessible board below.":"Dieses Ger\xE4t oder dieser Browser konnte keinen WebGL-Kontext erstellen. Fortschritt und Einstellungen bleiben erhalten. Du kannst mit dem barrierefreien Brett unten weiterspielen.","Continue in 2D":"In 2D weiter","Loading\u2026":"Wird geladen \u2026","Preparing the atelier.":"Das Atelier wird vorbereitet.",crimson:"Karminrot",indigo:"Indigo",fern:"Farngr\xFCn",marigold:"Ringelblumengelb",violet:"Violett",ember:"Glutorange","Daily Loom":"Tageswebstuhl","Score Chase":"Punktejagd","Lift & drop":"Anheben & ablegen","Loops lift from the TOP of a peg. Select the highlighted peg, then drop the loop onto the empty peg.":"Schlaufen werden OBEN vom Stab genommen. W\xE4hle den markierten Stab und lege die Schlaufe auf den leeren Stab.","Lift the indigo loop off peg one onto the empty peg.":"Hebe die Indigo-Schlaufe von Stab eins auf den leeren Stab.","Now stack crimson onto crimson to finish.":"Staple jetzt Karminrot auf Karminrot, um abzuschlie\xDFen.","Match colors":"Farben abgleichen","A loop may only land on a matching color or an empty peg. Mismatched pegs reject the drop.":"Eine Schlaufe darf nur auf passender Farbe oder einem leeren Stab landen. Unpassende St\xE4be lehnen ab.","Lift the indigo loop off peg one onto an empty peg.":"Hebe die Indigo-Schlaufe von Stab eins auf einen leeren Stab.","Now stack crimson onto the crimson-topped peg.":"Staple jetzt Karminrot auf den Stab mit Karminrot oben.","Group lift":"Gruppe anheben","Same-colored loops touching at the top lift together as one group, keeping their order.":"Gleichfarbige Schlaufen, die oben aneinanderliegen, werden als Gruppe angehoben und behalten ihre Reihenfolge.","Lift BOTH indigo loops at once onto the empty peg.":"Hebe BEIDE Indigo-Schlaufen auf einmal auf den leeren Stab.","Uniform pegs":"Einfarbige St\xE4be","You win when every peg is uniform. Solve this small loom on your own.":"Du gewinnst, wenn jeder Stab einfarbig ist. L\xF6se diesen kleinen Webstuhl allein.","Taut Thread":"Straffer Faden","Solve within a tight move limit.":"L\xF6se ihn innerhalb eines knappen Zuglimits.","Swap Meet":"Tauschb\xF6rse","A harder loom with barely any slack.":"Ein schwerer Webstuhl mit kaum Spielraum.","Swift Shuttle":"Flinkes Schiffchen","Solve before the timer runs out.":"L\xF6se ihn, bevor die Zeit abl\xE4uft.","No Takebacks":"Kein Zur\xFCck","Undo is disabled. Every drop is final.":"R\xFCckg\xE4ngig ist deaktiviert. Jede Ablage ist endg\xFCltig.","First Weave":"Erstes Gewebe","Apprentice of the Loom":"Lehrling am Webstuhl","Seven Suns":"Sieben Sonnen","Master Weaver":"Meisterweber","Hundred Hands":"Hundert H\xE4nde","Loop lifted":"Schlaufe angehoben","Loop lowered":"Schlaufe abgesenkt","Loop placed":"Schlaufe abgelegt","That move is not allowed":"Dieser Zug ist nicht erlaubt","Peg completed":"Stab fertig","Loom complete":"Webstuhl fertig","Round over":"Runde vorbei","Move undone":"Zug r\xFCckg\xE4ngig","Hint suggested":"Tipp angezeigt","Achievement unlocked":"Erfolg freigeschaltet","Round started":"Runde gestartet","Time running out":"Die Zeit l\xE4uft ab"};var ld={"That is the same peg.":"C\u2019est le m\xEAme piquet.","That peg is empty.":"Ce piquet est vide.","That peg is full.":"Ce piquet est plein.","Loops may only land on a matching color or an empty peg.":"Les boucles ne se posent que sur la m\xEAme couleur ou sur un piquet vide.","The round is over.":"La manche est termin\xE9e.","Unknown peg.":"Piquet inconnu.","Stage {n}":"\xC9tape {n}","Practice \xB7 difficulty {n}":"Entra\xEEnement \xB7 difficult\xE9 {n}",Learn:"Apprendre",Journey:"Parcours",Daily:"Du jour",Practice:"Entra\xEEnement",Challenge:"D\xE9fi","Score chase":"Course au score",Loading:"Chargement","Title screen":"\xC9cran d\u2019accueil",Ready:"Pr\xEAt","Mode selection":"Choix du mode","Preparing round":"Pr\xE9paration de la manche",Tutorial:"Tutoriel","Get ready":"Pr\xE9parez-vous","Round active":"Manche en cours",Paused:"En pause",Reconnecting:"Reconnexion",Resolving:"Calcul du r\xE9sultat",Results:"R\xE9sultats",Progression:"Progression","Goal:":"But :","move loops between pegs \u2014 keeping their stack order \u2014 until every peg holds a single color.":"d\xE9placez les boucles entre les piquets \u2014 en gardant leur ordre d\u2019empilement \u2014 jusqu\u2019\xE0 ce que chaque piquet n\u2019ait qu\u2019une couleur.",Rules:"R\xE8gles","Only the top loop group lifts. Same-colored loops touching at the top move together.":"Seul le groupe de boucles du dessus se soul\xE8ve. Les boucles de m\xEAme couleur qui se touchent en haut bougent ensemble.","A group lands on a matching color or an empty peg, never past a peg's capacity.":"Un groupe se pose sur la m\xEAme couleur ou sur un piquet vide, sans jamais d\xE9passer la capacit\xE9 du piquet.","Invalid drops are rejected with an explanation.":"Les d\xE9p\xF4ts non valides sont refus\xE9s avec une explication.",Controls:"Commandes","Pointer/touch: tap a peg to lift, tap a target to drop. Drag also works.":"Pointeur/tactile : touchez un piquet pour soulever, touchez une cible pour d\xE9poser. Le glisser fonctionne aussi.","Keyboard: {move} choose peg, {confirm} lift/drop, {cancel} cancel, {undo} undo, {hint} hint, {pause} pause, {camera} reset camera.":"Clavier : {move} choisir un piquet, {confirm} soulever/d\xE9poser, {cancel} annuler, {undo} d\xE9faire, {hint} indice, {pause} pause, {camera} recentrer la cam\xE9ra.","Gamepad: D-pad/left stick chooses a peg, south button lifts/drops, east cancels, start pauses.":"Manette : croix/stick gauche pour choisir un piquet, bouton du bas pour soulever/d\xE9poser, bouton de droite pour annuler, Start pour la pause.",Scoring:"Score","Completion + efficiency vs par + no-undo mastery \u2212 invalid attempts.":"R\xE9ussite + efficacit\xE9 par rapport au par + ma\xEEtrise sans annulation \u2212 tentatives non valides.","Ties: completion, fewer invalid actions, faster time, then session id.":"\xC9galit\xE9s : r\xE9ussite, moins d\u2019actions non valides, temps plus court, puis identifiant de session.","Sort every loop so each peg holds one color.":"Triez toutes les boucles pour que chaque piquet n\u2019ait qu\u2019une couleur.","Solo \xB7 ~{n} min \xB7 assists: hints/undo":"Solo \xB7 ~{n} min \xB7 aides : indices/annulation","(ranked \u2014 undo lowers mastery bonus)":"(class\xE9 \u2014 l\u2019annulation r\xE9duit le bonus de ma\xEEtrise)","(unranked)":"(non class\xE9)",Difficulty:"Difficult\xE9","Level {n}":"Niveau {n}","Ten seconds left.":"Plus que dix secondes.","Round started. {title}.":"Manche lanc\xE9e. {title}.","Loom complete!":"M\xE9tier termin\xE9 !","Out of time":"Temps \xE9coul\xE9","Out of moves":"Plus de coups",Completion:"R\xE9ussite","Efficiency (par {par}, {moves} moves)":"Efficacit\xE9 (par {par}, {moves} coups)","No-undo mastery":"Ma\xEEtrise sans annulation","Invalid attempts":"Tentatives non valides",Total:"Total",Time:"Temps","Your best local score: {score} ({moves} moves).":"Votre meilleur score local : {score} ({moves} coups).","This is your first recorded score.":"C\u2019est votre premier score enregistr\xE9.","Next stage":"\xC9tape suivante","Next lesson":"Le\xE7on suivante","Start the Journey":"Commencer le parcours","Play again":"Rejouer","Moves {n}/{limit}":"Coups {n}/{limit}","Moves {n}":"Coups {n}","Score {n}":"Score {n}","Uniform pegs: {done} / {total}":"Piquets unis : {done} / {total}","Good! Finish the loom.":"Bien ! Terminez le m\xE9tier.",synced:"synchronis\xE9e","saving\u2026":"enregistrement\u2026","sync error":"erreur de synchronisation",offline:"hors ligne","Mode: {mode} \xB7 {title}":"Mode : {mode} \xB7 {title}","{name} \xB7 cloud save {status}":"{name} \xB7 sauvegarde cloud {status}","Playing locally \u2014 scores are stored on this device.":"Jeu en local \u2014 les scores sont enregistr\xE9s sur cet appareil.","Move loops between pegs until every peg holds one color.":"D\xE9placez les boucles jusqu\u2019\xE0 ce que chaque piquet n\u2019ait qu\u2019une couleur.","Par {par} \xB7 seed {seed}":"Par {par} \xB7 graine {seed}","{n} moves":"{n} coups","No scores yet.":"Aucun score pour l\u2019instant.","Journey: {done}/{total} stages \xB7 {ach}/{achTotal} achievements \xB7 {rounds} rounds completed":"Parcours : {done}/{total} \xE9tapes \xB7 {ach}/{achTotal} succ\xE8s \xB7 {rounds} manches termin\xE9es","Peg {n}: {loops}":"Piquet {n} : {loops}",empty:"vide","{label} (lifted)":"{label} (soulev\xE9)","Moved to peg {n}.":"D\xE9plac\xE9 sur le piquet {n}.","Lesson step complete. Now finish the loom on your own.":"\xC9tape de le\xE7on termin\xE9e. Terminez maintenant le m\xE9tier seul.","That move is not allowed.":"Ce coup n\u2019est pas autoris\xE9.","Nothing to undo.":"Rien \xE0 annuler.","Move undone.":"Coup annul\xE9.","No useful move found \u2014 try undo.":"Aucun coup utile \u2014 essayez d\u2019annuler.","Hint: try peg {from} \u2192 peg {to}.":"Indice : essayez piquet {from} \u2192 piquet {to}.","Hint: move from peg {from} to peg {to}.":"Indice : d\xE9placez du piquet {from} au piquet {to}.","Welcome back \u2014 the atelier kept your place.":"Bon retour \u2014 l\u2019atelier a gard\xE9 votre place.","Round restored from your last safe snapshot.":"Manche restaur\xE9e depuis votre derni\xE8re sauvegarde.","Journey {done}/{total} \xB7 Daily day {day}":"Parcours {done}/{total} \xB7 D\xE9fi du jour {day}","cloud save {status}":"sauvegarde cloud {status}","local play":"jeu en local","Loom complete. Total score {score}.":"M\xE9tier termin\xE9. Score total {score}.","Round over. Total score {score}.":"Manche termin\xE9e. Score total {score}.","Lifted {n} {color} loops from peg {peg}. Choose a target peg.":"{n} boucles {color} soulev\xE9es du piquet {peg}. Choisissez un piquet cible.","Lifted {n} {color} loop from peg {peg}. Choose a target peg.":"{n} boucle {color} soulev\xE9e du piquet {peg}. Choisissez un piquet cible.","Stage {n} completed":"\xC9tape {n} termin\xE9e","Stage {n} locked":"\xC9tape {n} verrouill\xE9e","Loop Loom playfield":"Plateau de Loop Loom","Open objective panel":"Ouvrir le panneau d\u2019objectif","Pause game":"Mettre en pause","Objective and progression":"Objectif et progression",Objective:"Objectif",Undo:"Annuler",Hint:"Indice",Restart:"Recommencer","Skip anim":"Passer l\u2019anim.","Status and scores":"\xC9tat et scores",Status:"\xC9tat","Top scores":"Meilleurs scores",Achievements:"Succ\xE8s",Help:"Aide",Panel:"Panneau","Reset view (R)":"Recentrer la vue (R)",View:"Vue",Pegs:"Piquets","A textile atelier of colored loops and brass pegs.":"Un atelier textile de boucles color\xE9es et de piquets en laiton.","Move loops between pegs \u2014 keeping their stack order \u2014 until every peg is one color.":"D\xE9placez les boucles entre les piquets \u2014 en gardant leur ordre \u2014 jusqu\u2019\xE0 ce que chaque piquet soit d\u2019une seule couleur.",Play:"Jouer","Resume saved round":"Reprendre la manche enregistr\xE9e","Modes & progress":"Modes et progression","How to play":"Comment jouer",Settings:"Param\xE8tres","Choose a mode":"Choisissez un mode","Learn \u2014 interactive lessons":"Apprendre \u2014 le\xE7ons interactives","Journey \u2014 48 stages":"Parcours \u2014 48 \xE9tapes","Daily \u2014 one shared loom per UTC day":"Du jour \u2014 un m\xE9tier commun par jour UTC","Practice \u2014 unranked, undo allowed":"Entra\xEEnement \u2014 non class\xE9, annulation permise","Challenge \u2014 constrained goals":"D\xE9fi \u2014 objectifs sous contrainte","Score chase \u2014 leaderboards":"Course au score \u2014 classements",Back:"Retour","Start round":"Lancer la manche",Resume:"Reprendre","Leave to title":"Retour \xE0 l\u2019accueil",Audio:"Audio",Music:"Musique",Effects:"Effets",Ambience:"Ambiance","Voice cues":"Indications vocales","Mute all":"Tout couper","Reduced motion":"Animations r\xE9duites",Accessibility:"Accessibilit\xE9","Color palette":"Palette de couleurs",Default:"Par d\xE9faut","Deuteranopia-safe":"Adapt\xE9e \xE0 la deut\xE9ranopie","Protanopia-safe":"Adapt\xE9e \xE0 la protanopie","Tritanopia-safe":"Adapt\xE9e \xE0 la tritanopie","High contrast":"Contraste \xE9lev\xE9","High contrast UI":"Interface \xE0 contraste \xE9lev\xE9","Larger text":"Texte plus grand","Left-handed controls":"Commandes pour gauchers","Hold to lift (vs tap)":"Maintenir pour soulever (au lieu de toucher)","Timing assistance":"Aide au chronom\xE9trage",Haptics:"Vibrations",Privacy:"Confidentialit\xE9","Share anonymous usage counters":"Partager des compteurs d\u2019utilisation anonymes","Replay tutorial":"Rejouer le tutoriel",Done:"Termin\xE9",Retry:"Rejouer",Title:"Accueil",Close:"Fermer","3D unavailable":"3D indisponible","This device or browser could not create a WebGL context. Your progress and settings are preserved. You can still play with the accessible board below.":"Cet appareil ou ce navigateur n\u2019a pas pu cr\xE9er de contexte WebGL. Votre progression et vos param\xE8tres sont conserv\xE9s. Vous pouvez jouer avec le plateau accessible ci-dessous.","Continue in 2D":"Continuer en 2D","Loading\u2026":"Chargement\u2026","Preparing the atelier.":"Pr\xE9paration de l\u2019atelier.",crimson:"cramoisi",indigo:"indigo",fern:"foug\xE8re",marigold:"souci",violet:"violet",ember:"braise","Daily Loom":"M\xE9tier du jour","Score Chase":"Course au score","Lift & drop":"Soulever et d\xE9poser","Loops lift from the TOP of a peg. Select the highlighted peg, then drop the loop onto the empty peg.":"Les boucles se soul\xE8vent par le HAUT du piquet. S\xE9lectionnez le piquet en surbrillance, puis d\xE9posez la boucle sur le piquet vide.","Lift the indigo loop off peg one onto the empty peg.":"Soulevez la boucle indigo du piquet un et posez-la sur le piquet vide.","Now stack crimson onto crimson to finish.":"Empilez maintenant cramoisi sur cramoisi pour terminer.","Match colors":"Assortir les couleurs","A loop may only land on a matching color or an empty peg. Mismatched pegs reject the drop.":"Une boucle ne se pose que sur la m\xEAme couleur ou sur un piquet vide. Un piquet d\u2019une autre couleur refuse le d\xE9p\xF4t.","Lift the indigo loop off peg one onto an empty peg.":"Soulevez la boucle indigo du piquet un et posez-la sur un piquet vide.","Now stack crimson onto the crimson-topped peg.":"Empilez maintenant cramoisi sur le piquet coiff\xE9 de cramoisi.","Group lift":"Soulever un groupe","Same-colored loops touching at the top lift together as one group, keeping their order.":"Les boucles de m\xEAme couleur qui se touchent en haut se soul\xE8vent ensemble, en gardant leur ordre.","Lift BOTH indigo loops at once onto the empty peg.":"Soulevez les DEUX boucles indigo d\u2019un coup et posez-les sur le piquet vide.","Uniform pegs":"Piquets unis","You win when every peg is uniform. Solve this small loom on your own.":"Vous gagnez quand chaque piquet est d\u2019une seule couleur. R\xE9solvez ce petit m\xE9tier seul.","Taut Thread":"Fil tendu","Solve within a tight move limit.":"R\xE9solvez avec une limite de coups serr\xE9e.","Swap Meet":"Brocante","A harder loom with barely any slack.":"Un m\xE9tier plus difficile, presque sans marge.","Swift Shuttle":"Navette rapide","Solve before the timer runs out.":"R\xE9solvez avant la fin du chrono.","No Takebacks":"Sans retour","Undo is disabled. Every drop is final.":"L\u2019annulation est d\xE9sactiv\xE9e. Chaque d\xE9p\xF4t est d\xE9finitif.","First Weave":"Premier tissage","Apprentice of the Loom":"Apprenti du m\xE9tier","Seven Suns":"Sept soleils","Master Weaver":"Ma\xEEtre tisserand","Hundred Hands":"Cent mains","Loop lifted":"Boucle soulev\xE9e","Loop lowered":"Boucle repos\xE9e","Loop placed":"Boucle pos\xE9e","That move is not allowed":"Ce coup n\u2019est pas autoris\xE9","Peg completed":"Piquet termin\xE9","Loom complete":"M\xE9tier termin\xE9","Round over":"Manche termin\xE9e","Move undone":"Coup annul\xE9","Hint suggested":"Indice propos\xE9","Achievement unlocked":"Succ\xE8s d\xE9bloqu\xE9","Round started":"Manche lanc\xE9e","Time running out":"Le temps presse"},Um={"Loom complete!":"M\xE9tier termin\xE9!","Good! Finish the loom.":"Bien! Terminez le m\xE9tier.","{name} \xB7 cloud save {status}":"{name} \xB7 sauvegarde infonuagique {status}","cloud save {status}":"sauvegarde infonuagique {status}",Scoring:"Pointage","Score {n}":"Pointage {n}","Top scores":"Meilleurs pointages","Status and scores":"\xC9tat et pointages","Score chase":"Course au pointage","Score Chase":"Course au pointage","Score chase \u2014 leaderboards":"Course au pointage \u2014 classements","Your best local score: {score} ({moves} moves).":"Votre meilleur pointage local : {score} ({moves} coups).","This is your first recorded score.":"C\u2019est votre premier pointage enregistr\xE9.","No scores yet.":"Aucun pointage pour l\u2019instant.","Playing locally \u2014 scores are stored on this device.":"Jeu en local \u2014 les pointages sont enregistr\xE9s sur cet appareil.","Loom complete. Total score {score}.":"M\xE9tier termin\xE9. Pointage total {score}.","Round over. Total score {score}.":"Manche termin\xE9e. Pointage total {score}."};var Om={"That is the same peg.":"\xC9 o mesmo pino.","That peg is empty.":"Esse pino est\xE1 vazio.","That peg is full.":"Esse pino est\xE1 cheio.","Loops may only land on a matching color or an empty peg.":"Os la\xE7os s\xF3 podem ir sobre a mesma cor ou em um pino vazio.","The round is over.":"A rodada acabou.","Unknown peg.":"Pino desconhecido.","Stage {n}":"Etapa {n}","Practice \xB7 difficulty {n}":"Treino \xB7 dificuldade {n}",Learn:"Aprender",Journey:"Jornada",Daily:"Di\xE1rio",Practice:"Treino",Challenge:"Desafio","Score chase":"Ca\xE7a aos pontos",Loading:"Carregando","Title screen":"Tela inicial",Ready:"Pronto","Mode selection":"Sele\xE7\xE3o de modo","Preparing round":"Preparando a rodada",Tutorial:"Tutorial","Get ready":"Prepare-se","Round active":"Rodada em andamento",Paused:"Pausado",Reconnecting:"Reconectando",Resolving:"Calculando o resultado",Results:"Resultados",Progression:"Progresso","Goal:":"Objetivo:","move loops between pegs \u2014 keeping their stack order \u2014 until every peg holds a single color.":"mova os la\xE7os entre os pinos \u2014 mantendo a ordem da pilha \u2014 at\xE9 que cada pino tenha uma s\xF3 cor.",Rules:"Regras","Only the top loop group lifts. Same-colored loops touching at the top move together.":"S\xF3 o grupo de la\xE7os do topo \xE9 levantado. La\xE7os da mesma cor encostados no topo se movem juntos.","A group lands on a matching color or an empty peg, never past a peg's capacity.":"Um grupo vai sobre a mesma cor ou em um pino vazio, nunca acima da capacidade do pino.","Invalid drops are rejected with an explanation.":"Jogadas inv\xE1lidas s\xE3o recusadas com uma explica\xE7\xE3o.",Controls:"Controles","Pointer/touch: tap a peg to lift, tap a target to drop. Drag also works.":"Ponteiro/toque: toque em um pino para levantar e no destino para soltar. Arrastar tamb\xE9m funciona.","Keyboard: {move} choose peg, {confirm} lift/drop, {cancel} cancel, {undo} undo, {hint} hint, {pause} pause, {camera} reset camera.":"Teclado: {move} escolher pino, {confirm} levantar/soltar, {cancel} cancelar, {undo} desfazer, {hint} dica, {pause} pausar, {camera} redefinir c\xE2mera.","Gamepad: D-pad/left stick chooses a peg, south button lifts/drops, east cancels, start pauses.":"Controle: direcional/anal\xF3gico esquerdo escolhe o pino, bot\xE3o de baixo levanta/solta, o da direita cancela, Start pausa.",Scoring:"Pontua\xE7\xE3o","Completion + efficiency vs par + no-undo mastery \u2212 invalid attempts.":"Conclus\xE3o + efici\xEAncia frente ao par + maestria sem desfazer \u2212 tentativas inv\xE1lidas.","Ties: completion, fewer invalid actions, faster time, then session id.":"Empates: conclus\xE3o, menos a\xE7\xF5es inv\xE1lidas, menor tempo e depois ID da sess\xE3o.","Sort every loop so each peg holds one color.":"Organize todos os la\xE7os para que cada pino tenha uma s\xF3 cor.","Solo \xB7 ~{n} min \xB7 assists: hints/undo":"Solo \xB7 ~{n} min \xB7 ajudas: dicas/desfazer","(ranked \u2014 undo lowers mastery bonus)":"(ranqueado \u2014 desfazer reduz o b\xF4nus de maestria)","(unranked)":"(sem ranking)",Difficulty:"Dificuldade","Level {n}":"N\xEDvel {n}","Ten seconds left.":"Faltam dez segundos.","Round started. {title}.":"Rodada iniciada. {title}.","Loom complete!":"Tear conclu\xEDdo!","Out of time":"O tempo acabou","Out of moves":"Sem jogadas",Completion:"Conclus\xE3o","Efficiency (par {par}, {moves} moves)":"Efici\xEAncia (par {par}, {moves} jogadas)","No-undo mastery":"Maestria sem desfazer","Invalid attempts":"Tentativas inv\xE1lidas",Total:"Total",Time:"Tempo","Your best local score: {score} ({moves} moves).":"Sua melhor pontua\xE7\xE3o local: {score} ({moves} jogadas).","This is your first recorded score.":"Esta \xE9 sua primeira pontua\xE7\xE3o registrada.","Next stage":"Pr\xF3xima etapa","Next lesson":"Pr\xF3xima li\xE7\xE3o","Start the Journey":"Come\xE7ar a jornada","Play again":"Jogar de novo","Moves {n}/{limit}":"Jogadas {n}/{limit}","Moves {n}":"Jogadas {n}","Score {n}":"Pontos {n}","Uniform pegs: {done} / {total}":"Pinos de uma cor: {done} / {total}","Good! Finish the loom.":"Muito bem! Termine o tear.",synced:"sincronizado","saving\u2026":"salvando\u2026","sync error":"erro de sincroniza\xE7\xE3o",offline:"offline","Mode: {mode} \xB7 {title}":"Modo: {mode} \xB7 {title}","{name} \xB7 cloud save {status}":"{name} \xB7 salvamento na nuvem {status}","Playing locally \u2014 scores are stored on this device.":"Jogando localmente \u2014 as pontua\xE7\xF5es ficam neste dispositivo.","Move loops between pegs until every peg holds one color.":"Mova os la\xE7os at\xE9 que cada pino tenha uma s\xF3 cor.","Par {par} \xB7 seed {seed}":"Par {par} \xB7 semente {seed}","{n} moves":"{n} jogadas","No scores yet.":"Ainda n\xE3o h\xE1 pontua\xE7\xF5es.","Journey: {done}/{total} stages \xB7 {ach}/{achTotal} achievements \xB7 {rounds} rounds completed":"Jornada: {done}/{total} etapas \xB7 {ach}/{achTotal} conquistas \xB7 {rounds} rodadas conclu\xEDdas","Peg {n}: {loops}":"Pino {n}: {loops}",empty:"vazio","{label} (lifted)":"{label} (levantado)","Moved to peg {n}.":"Movido para o pino {n}.","Lesson step complete. Now finish the loom on your own.":"Passo da li\xE7\xE3o conclu\xEDdo. Agora termine o tear sozinho.","That move is not allowed.":"Essa jogada n\xE3o \xE9 permitida.","Nothing to undo.":"Nada para desfazer.","Move undone.":"Jogada desfeita.","No useful move found \u2014 try undo.":"Nenhuma jogada \xFAtil \u2014 tente desfazer.","Hint: try peg {from} \u2192 peg {to}.":"Dica: tente pino {from} \u2192 pino {to}.","Hint: move from peg {from} to peg {to}.":"Dica: mova do pino {from} para o pino {to}.","Welcome back \u2014 the atelier kept your place.":"Bem-vindo de volta \u2014 o ateli\xEA guardou seu lugar.","Round restored from your last safe snapshot.":"Rodada restaurada do seu \xFAltimo ponto salvo.","Journey {done}/{total} \xB7 Daily day {day}":"Jornada {done}/{total} \xB7 Desafio di\xE1rio dia {day}","cloud save {status}":"salvamento na nuvem {status}","local play":"jogo local","Loom complete. Total score {score}.":"Tear conclu\xEDdo. Pontua\xE7\xE3o total {score}.","Round over. Total score {score}.":"Rodada encerrada. Pontua\xE7\xE3o total {score}.","Lifted {n} {color} loops from peg {peg}. Choose a target peg.":"{n} la\xE7os {color} levantados do pino {peg}. Escolha um pino de destino.","Lifted {n} {color} loop from peg {peg}. Choose a target peg.":"{n} la\xE7o {color} levantado do pino {peg}. Escolha um pino de destino.","Stage {n} completed":"Etapa {n} conclu\xEDda","Stage {n} locked":"Etapa {n} bloqueada","Loop Loom playfield":"Tabuleiro de Loop Loom","Open objective panel":"Abrir painel de objetivo","Pause game":"Pausar o jogo","Objective and progression":"Objetivo e progresso",Objective:"Objetivo",Undo:"Desfazer",Hint:"Dica",Restart:"Reiniciar","Skip anim":"Pular anim.","Status and scores":"Status e pontua\xE7\xF5es",Status:"Status","Top scores":"Melhores pontua\xE7\xF5es",Achievements:"Conquistas",Help:"Ajuda",Panel:"Painel","Reset view (R)":"Redefinir vis\xE3o (R)",View:"Vis\xE3o",Pegs:"Pinos","A textile atelier of colored loops and brass pegs.":"Um ateli\xEA t\xEAxtil de la\xE7os coloridos e pinos de lat\xE3o.","Move loops between pegs \u2014 keeping their stack order \u2014 until every peg is one color.":"Mova os la\xE7os entre os pinos \u2014 mantendo a ordem \u2014 at\xE9 que cada pino tenha uma s\xF3 cor.",Play:"Jogar","Resume saved round":"Retomar rodada salva","Modes & progress":"Modos e progresso","How to play":"Como jogar",Settings:"Configura\xE7\xF5es","Choose a mode":"Escolha um modo","Learn \u2014 interactive lessons":"Aprender \u2014 li\xE7\xF5es interativas","Journey \u2014 48 stages":"Jornada \u2014 48 etapas","Daily \u2014 one shared loom per UTC day":"Di\xE1rio \u2014 um tear compartilhado por dia UTC","Practice \u2014 unranked, undo allowed":"Treino \u2014 sem ranking, desfazer permitido","Challenge \u2014 constrained goals":"Desafio \u2014 objetivos com restri\xE7\xF5es","Score chase \u2014 leaderboards":"Ca\xE7a aos pontos \u2014 rankings",Back:"Voltar","Start round":"Come\xE7ar rodada",Resume:"Continuar","Leave to title":"Voltar ao in\xEDcio",Audio:"\xC1udio",Music:"M\xFAsica",Effects:"Efeitos",Ambience:"Ambiente","Voice cues":"Avisos de voz","Mute all":"Silenciar tudo","Reduced motion":"Movimento reduzido",Accessibility:"Acessibilidade","Color palette":"Paleta de cores",Default:"Padr\xE3o","Deuteranopia-safe":"Para deuteranopia","Protanopia-safe":"Para protanopia","Tritanopia-safe":"Para tritanopia","High contrast":"Alto contraste","High contrast UI":"Interface de alto contraste","Larger text":"Texto maior","Left-handed controls":"Controles para canhotos","Hold to lift (vs tap)":"Segurar para levantar (em vez de tocar)","Timing assistance":"Assist\xEAncia de tempo",Haptics:"Vibra\xE7\xE3o",Privacy:"Privacidade","Share anonymous usage counters":"Compartilhar contadores de uso an\xF4nimos","Replay tutorial":"Rever tutorial",Done:"Conclu\xEDdo",Retry:"Tentar de novo",Title:"In\xEDcio",Close:"Fechar","3D unavailable":"3D indispon\xEDvel","This device or browser could not create a WebGL context. Your progress and settings are preserved. You can still play with the accessible board below.":"Este dispositivo ou navegador n\xE3o conseguiu criar um contexto WebGL. Seu progresso e suas configura\xE7\xF5es foram preservados. Voc\xEA ainda pode jogar com o tabuleiro acess\xEDvel abaixo.","Continue in 2D":"Continuar em 2D","Loading\u2026":"Carregando\u2026","Preparing the atelier.":"Preparando o ateli\xEA.",crimson:"carmesim",indigo:"\xEDndigo",fern:"samambaia",marigold:"cal\xEAndula",violet:"violeta",ember:"brasa","Daily Loom":"Tear di\xE1rio","Score Chase":"Ca\xE7a aos pontos","Lift & drop":"Levantar e soltar","Loops lift from the TOP of a peg. Select the highlighted peg, then drop the loop onto the empty peg.":"Os la\xE7os saem do TOPO do pino. Selecione o pino destacado e solte o la\xE7o no pino vazio.","Lift the indigo loop off peg one onto the empty peg.":"Leve o la\xE7o \xEDndigo do pino um para o pino vazio.","Now stack crimson onto crimson to finish.":"Agora empilhe carmesim sobre carmesim para terminar.","Match colors":"Combine as cores","A loop may only land on a matching color or an empty peg. Mismatched pegs reject the drop.":"Um la\xE7o s\xF3 pode ir sobre a mesma cor ou em um pino vazio. Pinos de outra cor recusam.","Lift the indigo loop off peg one onto an empty peg.":"Leve o la\xE7o \xEDndigo do pino um para um pino vazio.","Now stack crimson onto the crimson-topped peg.":"Agora empilhe carmesim no pino com carmesim no topo.","Group lift":"Levantar em grupo","Same-colored loops touching at the top lift together as one group, keeping their order.":"La\xE7os da mesma cor encostados no topo sobem juntos como grupo, mantendo a ordem.","Lift BOTH indigo loops at once onto the empty peg.":"Leve OS DOIS la\xE7os \xEDndigo de uma vez para o pino vazio.","Uniform pegs":"Pinos de uma cor","You win when every peg is uniform. Solve this small loom on your own.":"Voc\xEA vence quando todos os pinos t\xEAm uma s\xF3 cor. Resolva este pequeno tear sozinho.","Taut Thread":"Fio esticado","Solve within a tight move limit.":"Resolva com um limite de jogadas apertado.","Swap Meet":"Feira de trocas","A harder loom with barely any slack.":"Um tear mais dif\xEDcil, quase sem folga.","Swift Shuttle":"Lan\xE7adeira veloz","Solve before the timer runs out.":"Resolva antes que o tempo acabe.","No Takebacks":"Sem volta","Undo is disabled. Every drop is final.":"Desfazer est\xE1 desativado. Cada jogada \xE9 definitiva.","First Weave":"Primeira trama","Apprentice of the Loom":"Aprendiz do tear","Seven Suns":"Sete s\xF3is","Master Weaver":"Mestre tecel\xE3o","Hundred Hands":"Cem m\xE3os","Loop lifted":"La\xE7o levantado","Loop lowered":"La\xE7o abaixado","Loop placed":"La\xE7o colocado","That move is not allowed":"Essa jogada n\xE3o \xE9 permitida","Peg completed":"Pino conclu\xEDdo","Loom complete":"Tear conclu\xEDdo","Round over":"Rodada encerrada","Move undone":"Jogada desfeita","Hint suggested":"Dica sugerida","Achievement unlocked":"Conquista desbloqueada","Round started":"Rodada iniciada","Time running out":"O tempo est\xE1 acabando"};var Fm={"That is the same peg.":"\xC8 lo stesso piolo.","That peg is empty.":"Quel piolo \xE8 vuoto.","That peg is full.":"Quel piolo \xE8 pieno.","Loops may only land on a matching color or an empty peg.":"Gli anelli possono andare solo sullo stesso colore o su un piolo vuoto.","The round is over.":"Il turno \xE8 finito.","Unknown peg.":"Piolo sconosciuto.","Stage {n}":"Tappa {n}","Practice \xB7 difficulty {n}":"Allenamento \xB7 difficolt\xE0 {n}",Learn:"Impara",Journey:"Percorso",Daily:"Del giorno",Practice:"Allenamento",Challenge:"Sfida","Score chase":"Caccia al punteggio",Loading:"Caricamento","Title screen":"Schermata iniziale",Ready:"Pronto","Mode selection":"Scelta della modalit\xE0","Preparing round":"Preparazione del turno",Tutorial:"Tutorial","Get ready":"Preparati","Round active":"Turno in corso",Paused:"In pausa",Reconnecting:"Riconnessione",Resolving:"Calcolo del risultato",Results:"Risultati",Progression:"Progressi","Goal:":"Obiettivo:","move loops between pegs \u2014 keeping their stack order \u2014 until every peg holds a single color.":"sposta gli anelli tra i pioli \u2014 mantenendo l\u2019ordine della pila \u2014 finch\xE9 ogni piolo ha un solo colore.",Rules:"Regole","Only the top loop group lifts. Same-colored loops touching at the top move together.":"Si solleva solo il gruppo di anelli in cima. Gli anelli dello stesso colore che si toccano in cima si muovono insieme.","A group lands on a matching color or an empty peg, never past a peg's capacity.":"Un gruppo va sullo stesso colore o su un piolo vuoto, mai oltre la capienza del piolo.","Invalid drops are rejected with an explanation.":"Le mosse non valide vengono rifiutate con una spiegazione.",Controls:"Comandi","Pointer/touch: tap a peg to lift, tap a target to drop. Drag also works.":"Puntatore/tocco: tocca un piolo per sollevare, tocca la destinazione per posare. Funziona anche il trascinamento.","Keyboard: {move} choose peg, {confirm} lift/drop, {cancel} cancel, {undo} undo, {hint} hint, {pause} pause, {camera} reset camera.":"Tastiera: {move} scegli il piolo, {confirm} solleva/posa, {cancel} annulla, {undo} indietro, {hint} suggerimento, {pause} pausa, {camera} reimposta la telecamera.","Gamepad: D-pad/left stick chooses a peg, south button lifts/drops, east cancels, start pauses.":"Controller: croce direzionale/levetta sinistra sceglie il piolo, tasto in basso solleva/posa, tasto a destra annulla, Start mette in pausa.",Scoring:"Punteggio","Completion + efficiency vs par + no-undo mastery \u2212 invalid attempts.":"Completamento + efficienza rispetto al par + maestria senza annullare \u2212 tentativi non validi.","Ties: completion, fewer invalid actions, faster time, then session id.":"Parit\xE0: completamento, meno azioni non valide, tempo pi\xF9 breve, poi ID sessione.","Sort every loop so each peg holds one color.":"Ordina tutti gli anelli in modo che ogni piolo abbia un solo colore.","Solo \xB7 ~{n} min \xB7 assists: hints/undo":"In solitaria \xB7 ~{n} min \xB7 aiuti: suggerimenti/annulla","(ranked \u2014 undo lowers mastery bonus)":"(in classifica \u2014 annullare riduce il bonus maestria)","(unranked)":"(senza classifica)",Difficulty:"Difficolt\xE0","Level {n}":"Livello {n}","Ten seconds left.":"Mancano dieci secondi.","Round started. {title}.":"Turno iniziato. {title}.","Loom complete!":"Telaio completato!","Out of time":"Tempo scaduto","Out of moves":"Mosse esaurite",Completion:"Completamento","Efficiency (par {par}, {moves} moves)":"Efficienza (par {par}, {moves} mosse)","No-undo mastery":"Maestria senza annullare","Invalid attempts":"Tentativi non validi",Total:"Totale",Time:"Tempo","Your best local score: {score} ({moves} moves).":"Il tuo miglior punteggio locale: {score} ({moves} mosse).","This is your first recorded score.":"Questo \xE8 il tuo primo punteggio registrato.","Next stage":"Tappa successiva","Next lesson":"Lezione successiva","Start the Journey":"Inizia il percorso","Play again":"Gioca ancora","Moves {n}/{limit}":"Mosse {n}/{limit}","Moves {n}":"Mosse {n}","Score {n}":"Punti {n}","Uniform pegs: {done} / {total}":"Pioli di un colore: {done} / {total}","Good! Finish the loom.":"Bene! Completa il telaio.",synced:"sincronizzato","saving\u2026":"salvataggio\u2026","sync error":"errore di sincronizzazione",offline:"offline","Mode: {mode} \xB7 {title}":"Modalit\xE0: {mode} \xB7 {title}","{name} \xB7 cloud save {status}":"{name} \xB7 salvataggio cloud {status}","Playing locally \u2014 scores are stored on this device.":"Gioco in locale \u2014 i punteggi restano su questo dispositivo.","Move loops between pegs until every peg holds one color.":"Sposta gli anelli finch\xE9 ogni piolo ha un solo colore.","Par {par} \xB7 seed {seed}":"Par {par} \xB7 seme {seed}","{n} moves":"{n} mosse","No scores yet.":"Ancora nessun punteggio.","Journey: {done}/{total} stages \xB7 {ach}/{achTotal} achievements \xB7 {rounds} rounds completed":"Percorso: {done}/{total} tappe \xB7 {ach}/{achTotal} obiettivi \xB7 {rounds} turni completati","Peg {n}: {loops}":"Piolo {n}: {loops}",empty:"vuoto","{label} (lifted)":"{label} (sollevato)","Moved to peg {n}.":"Spostato sul piolo {n}.","Lesson step complete. Now finish the loom on your own.":"Passo della lezione completato. Ora completa il telaio da solo.","That move is not allowed.":"Questa mossa non \xE8 consentita.","Nothing to undo.":"Niente da annullare.","Move undone.":"Mossa annullata.","No useful move found \u2014 try undo.":"Nessuna mossa utile \u2014 prova ad annullare.","Hint: try peg {from} \u2192 peg {to}.":"Suggerimento: prova piolo {from} \u2192 piolo {to}.","Hint: move from peg {from} to peg {to}.":"Suggerimento: sposta dal piolo {from} al piolo {to}.","Welcome back \u2014 the atelier kept your place.":"Bentornato \u2014 l\u2019atelier ti ha tenuto il posto.","Round restored from your last safe snapshot.":"Turno ripristinato dall\u2019ultimo salvataggio sicuro.","Journey {done}/{total} \xB7 Daily day {day}":"Percorso {done}/{total} \xB7 Sfida del giorno {day}","cloud save {status}":"salvataggio cloud {status}","local play":"gioco in locale","Loom complete. Total score {score}.":"Telaio completato. Punteggio totale {score}.","Round over. Total score {score}.":"Turno finito. Punteggio totale {score}.","Lifted {n} {color} loops from peg {peg}. Choose a target peg.":"Sollevati {n} anelli {color} dal piolo {peg}. Scegli un piolo di destinazione.","Lifted {n} {color} loop from peg {peg}. Choose a target peg.":"Sollevato {n} anello {color} dal piolo {peg}. Scegli un piolo di destinazione.","Stage {n} completed":"Tappa {n} completata","Stage {n} locked":"Tappa {n} bloccata","Loop Loom playfield":"Campo di gioco di Loop Loom","Open objective panel":"Apri il pannello obiettivo","Pause game":"Metti in pausa","Objective and progression":"Obiettivo e progressi",Objective:"Obiettivo",Undo:"Annulla",Hint:"Suggerimento",Restart:"Ricomincia","Skip anim":"Salta anim.","Status and scores":"Stato e punteggi",Status:"Stato","Top scores":"Punteggi migliori",Achievements:"Obiettivi",Help:"Aiuto",Panel:"Pannello","Reset view (R)":"Reimposta vista (R)",View:"Vista",Pegs:"Pioli","A textile atelier of colored loops and brass pegs.":"Un atelier tessile di anelli colorati e pioli d\u2019ottone.","Move loops between pegs \u2014 keeping their stack order \u2014 until every peg is one color.":"Sposta gli anelli tra i pioli \u2014 mantenendo l\u2019ordine \u2014 finch\xE9 ogni piolo \xE8 di un solo colore.",Play:"Gioca","Resume saved round":"Riprendi il turno salvato","Modes & progress":"Modalit\xE0 e progressi","How to play":"Come si gioca",Settings:"Impostazioni","Choose a mode":"Scegli una modalit\xE0","Learn \u2014 interactive lessons":"Impara \u2014 lezioni interattive","Journey \u2014 48 stages":"Percorso \u2014 48 tappe","Daily \u2014 one shared loom per UTC day":"Del giorno \u2014 un telaio condiviso per giorno UTC","Practice \u2014 unranked, undo allowed":"Allenamento \u2014 senza classifica, annulla consentito","Challenge \u2014 constrained goals":"Sfida \u2014 obiettivi vincolati","Score chase \u2014 leaderboards":"Caccia al punteggio \u2014 classifiche",Back:"Indietro","Start round":"Inizia il turno",Resume:"Riprendi","Leave to title":"Torna all\u2019inizio",Audio:"Audio",Music:"Musica",Effects:"Effetti",Ambience:"Ambiente","Voice cues":"Indicazioni vocali","Mute all":"Silenzia tutto","Reduced motion":"Movimento ridotto",Accessibility:"Accessibilit\xE0","Color palette":"Tavolozza",Default:"Predefinita","Deuteranopia-safe":"Adatta alla deuteranopia","Protanopia-safe":"Adatta alla protanopia","Tritanopia-safe":"Adatta alla tritanopia","High contrast":"Contrasto elevato","High contrast UI":"Interfaccia ad alto contrasto","Larger text":"Testo pi\xF9 grande","Left-handed controls":"Comandi per mancini","Hold to lift (vs tap)":"Tieni premuto per sollevare (invece di toccare)","Timing assistance":"Assistenza al tempo",Haptics:"Vibrazione",Privacy:"Privacy","Share anonymous usage counters":"Condividi contatori d\u2019uso anonimi","Replay tutorial":"Ripeti il tutorial",Done:"Fatto",Retry:"Riprova",Title:"Inizio",Close:"Chiudi","3D unavailable":"3D non disponibile","This device or browser could not create a WebGL context. Your progress and settings are preserved. You can still play with the accessible board below.":"Questo dispositivo o browser non \xE8 riuscito a creare un contesto WebGL. Progressi e impostazioni sono conservati. Puoi comunque giocare con il piano accessibile qui sotto.","Continue in 2D":"Continua in 2D","Loading\u2026":"Caricamento\u2026","Preparing the atelier.":"Preparazione dell\u2019atelier.",crimson:"cremisi",indigo:"indaco",fern:"felce",marigold:"calendula",violet:"viola",ember:"brace","Daily Loom":"Telaio del giorno","Score Chase":"Caccia al punteggio","Lift & drop":"Solleva e posa","Loops lift from the TOP of a peg. Select the highlighted peg, then drop the loop onto the empty peg.":"Gli anelli si sollevano dalla CIMA del piolo. Seleziona il piolo evidenziato, poi posa l\u2019anello sul piolo vuoto.","Lift the indigo loop off peg one onto the empty peg.":"Sposta l\u2019anello indaco dal piolo uno al piolo vuoto.","Now stack crimson onto crimson to finish.":"Ora impila cremisi su cremisi per finire.","Match colors":"Abbina i colori","A loop may only land on a matching color or an empty peg. Mismatched pegs reject the drop.":"Un anello pu\xF2 andare solo sullo stesso colore o su un piolo vuoto. I pioli di colore diverso lo rifiutano.","Lift the indigo loop off peg one onto an empty peg.":"Sposta l\u2019anello indaco dal piolo uno a un piolo vuoto.","Now stack crimson onto the crimson-topped peg.":"Ora impila cremisi sul piolo con il cremisi in cima.","Group lift":"Sollevamento di gruppo","Same-colored loops touching at the top lift together as one group, keeping their order.":"Gli anelli dello stesso colore che si toccano in cima si sollevano insieme come gruppo, mantenendo l\u2019ordine.","Lift BOTH indigo loops at once onto the empty peg.":"Sposta ENTRAMBI gli anelli indaco insieme sul piolo vuoto.","Uniform pegs":"Pioli di un colore","You win when every peg is uniform. Solve this small loom on your own.":"Vinci quando ogni piolo \xE8 di un solo colore. Risolvi da solo questo piccolo telaio.","Taut Thread":"Filo teso","Solve within a tight move limit.":"Risolvi entro un limite di mosse stretto.","Swap Meet":"Mercatino","A harder loom with barely any slack.":"Un telaio pi\xF9 difficile, quasi senza margine.","Swift Shuttle":"Spola veloce","Solve before the timer runs out.":"Risolvi prima che scada il tempo.","No Takebacks":"Niente ripensamenti","Undo is disabled. Every drop is final.":"Annulla \xE8 disattivato. Ogni mossa \xE8 definitiva.","First Weave":"Prima trama","Apprentice of the Loom":"Apprendista del telaio","Seven Suns":"Sette soli","Master Weaver":"Maestro tessitore","Hundred Hands":"Cento mani","Loop lifted":"Anello sollevato","Loop lowered":"Anello abbassato","Loop placed":"Anello posato","That move is not allowed":"Questa mossa non \xE8 consentita","Peg completed":"Piolo completato","Loom complete":"Telaio completato","Round over":"Turno finito","Move undone":"Mossa annullata","Hint suggested":"Suggerimento proposto","Achievement unlocked":"Obiettivo sbloccato","Round started":"Turno iniziato","Time running out":"Il tempo sta per scadere"};var Bm=["en-US","en-GB","es-419","es-ES","de-DE","fr-FR","fr-CA","pt-BR","it-IT"],ud={"en-US":{},"en-GB":Im,"es-419":ad,"es-ES":{...ad,...Dm},"de-DE":Nm,"fr-FR":ld,"fr-CA":{...ld,...Um},"pt-BR":Om,"it-IT":Fm},cd=new WeakMap,gs="en-US",hd=ud[gs],dd=new Set;function pM(n,e){return String(n).replace(/\{(\w+)\}/g,(t,i)=>e&&e[i]!=null?String(e[i]):t)}function te(n,e){if(n==null)return"";let t=String(n),i=Object.prototype.hasOwnProperty.call(hd,t)?hd[t]:t;return e?pM(i,e):i}var ze=n=>n;function wl(){return gs}function km(n){return dd.add(n),()=>dd.delete(n)}function mM(n=globalThis.document){if(n?.querySelectorAll){for(let e of n.querySelectorAll("[data-i18n]"))e.textContent=te(e.dataset.i18n);for(let e of n.querySelectorAll("[data-i18n-aria]"))e.setAttribute("aria-label",te(e.dataset.i18nAria));for(let e of n.querySelectorAll("[data-i18n-title]"))e.setAttribute("title",te(e.dataset.i18nTitle));for(let e of n.querySelectorAll("[data-i18n-html]"))cd.has(e)||cd.set(e,e.innerHTML.trim()),e.innerHTML=te(cd.get(e))}}function zm(n){let e=ud[n]?n:"en-US",t=e!==gs;gs=e,hd=ud[gs];let i=globalThis.document;if(i?.documentElement&&(i.documentElement.lang=gs,i.readyState!=="loading"&&mM(i)),t)for(let s of[...dd])try{s(gs)}catch(r){console.error(r)}}function Hm(){let n=globalThis.StarHermitLanguage,e=null;try{e=new URLSearchParams(globalThis.location.search).get("lang")}catch{}let t=e&&n?n.match(e,Bm):null;return n?n.create({game:"loop-loom",supported:Bm,panel:!t,apply:i=>zm(t||i)}):(zm("en-US"),null)}Hm();var ae=n=>document.getElementById(n),zt="boot",Ae=Go(),$t=Xo(),X=null,Sd=null,Sr="practice",Lt=null,Zt=0,Cl=!0,El=null,Do=0,fd=!1,Qm=0,$m={"same-peg":ze("That is the same peg."),"empty-source":ze("That peg is empty."),"no-space":ze("That peg is full."),"color-mismatch":ze("Loops may only land on a matching color or an empty peg."),"round-over":ze("The round is over."),"bad-peg":ze("Unknown peg.")},Md=n=>te(Bd[n]);function bd(n){if(!n)return"";let e=String(n.id||"");if(e.startsWith("journey-"))return te("Stage {n}",{n:e.slice(8)});if(n.tutorial)return te(n.tutorial.title);if(e.startsWith("practice"))return te("Practice \xB7 difficulty {n}",{n:n.difficulty!=null?n.difficulty:Ae.difficulty});let t=Ts.find(i=>i.title===n.title);return t?te(t.title):te(n.title||n.id)}var eg={learn:ze("Learn"),journey:ze("Journey"),daily:ze("Daily"),practice:ze("Practice"),challenge:ze("Challenge"),chase:ze("Score chase")};function _n(n,e){zt=n,document.body.dataset.appstate=n,Qn(te(gM(n)))}function gM(n){return{boot:ze("Loading"),title:ze("Title screen"),"profile-ready":ze("Ready"),"mode-select":ze("Mode selection"),preparing:ze("Preparing round"),tutorial:ze("Tutorial"),countdown:ze("Get ready"),active:ze("Round active"),paused:ze("Paused"),reconnecting:ze("Reconnecting"),resolving:ze("Resolving"),results:ze("Results"),progression:ze("Progression")}[n]||n}var Vm=0;function Qn(n,e){let t=te(n,e),i=ae("live-region");i.textContent="",clearTimeout(Vm),Vm=setTimeout(()=>{i.textContent=t},30)}var Gm=0;em(n=>{if(!n)return;let e=ae("caption-line");e.textContent=te(n),e.classList.remove("hidden"),clearTimeout(Gm),Gm=setTimeout(()=>e.classList.add("hidden"),2200)});var Wm=0;function $n(n,e){let t=ae("toast");t.textContent=te(n,e),t.classList.remove("hidden"),clearTimeout(Wm),Wm=setTimeout(()=>t.classList.add("hidden"),2600)}var tg=["loading","title","modes","setup","play","pause","settings","results","help","compat"],Td="title",pd=null;function pt(n){for(let i of tg)document.querySelectorAll(`[data-screen="${i}"]`).forEach(s=>{s.classList.toggle("hidden",i!==n)});let e=n==="play";ae("hud").classList.toggle("hidden",!e),ae("action-tray").classList.toggle("hidden",!e),ae("rail-left").classList.toggle("hidden",!e),ae("rail-right").classList.toggle("hidden",!e),ae("a11y-board").classList.toggle("hidden",!e&&zt!=="active");let t=document.querySelector(`[data-screen="${n}"]`);if(t){let i=t.querySelector("button");i&&(pd=i,i.focus({preventScroll:!0}));for(let s of[t,...t.querySelectorAll("*")])s.scrollTop&&(s.scrollTop=0)}else pd&&n==="play"&&(pd=null)}function ng(){if(Ae.graphics&&typeof Ae.graphics=="object")return;let n={low:"low",medium:"balanced",high:"high"};Ae.graphics={preset:n[Ae.quality]||"auto"}}function _r(){ng(),jh(Ae),Hp(Ae.reducedMotion),Hh(Ae.graphics),kp(Ae.palette),document.body.classList.toggle("reduced-motion",!!Ae.reducedMotion),document.body.classList.toggle("larger-text",Ae.largerText),document.body.classList.toggle("high-contrast",Ae.highContrast),document.body.classList.toggle("left-handed",Ae.leftHanded),document.body.classList.toggle("a11y-board-hidden",!1)}var Gn=()=>Pm([wl()]);function gd(){let n=Object.assign({},Ae);return delete n.bindings,n}function Rl(){Xl(Ae),Mm(gd())}var No=null;function vM(){let n={};for(let[e,t]of Object.entries(Ae.bindings))n[e]=[t];return n.confirm=n.confirm.concat(n.confirm.includes("Space")?[]:["Space"]),n}function xM(n){let e={ArrowLeft:"\u2190",ArrowRight:"\u2192",ArrowUp:"\u2191",ArrowDown:"\u2193",Escape:"Esc"};return e[n]?e[n]:/^Key[A-Z]$/.test(n)?n.slice(3):/^Digit\d$/.test(n)?n.slice(5):n||"\u2014"}var Lo=n=>(No[n]||[]).map(xM).join("/"),ig=[["set-music","music",!0],["set-effects","effects",!0],["set-ambience","ambience",!0],["set-voice","voice",!0],["set-muted","muted"],["set-motion","reducedMotion"],["set-palette","palette"],["set-contrast","highContrast"],["set-text","largerText"],["set-left","leftHanded"],["set-hold","holdToLift"],["set-timing","timingAssist"],["set-haptics","haptics"],["set-telemetry","telemetryConsent"]];function Xm(){for(let[n,e,t]of ig){let i=ae(n);t?i.value=Ae[e]:i.type==="checkbox"?i.checked=!!Ae[e]:i.value=Ae[e]}}function yM(){let n=(e,t,i)=>{let s=ae(e);i||s.type==="checkbox"?(i?s.value=Ae[t]:s.checked=!!Ae[t],s.addEventListener("change",()=>{Ae[t]=i?parseFloat(s.value):s.checked,Rl(),yr(Zi()),ai("settings-change"),_r()})):(s.value=Ae[t],s.addEventListener("change",()=>{Ae[t]=s.value,Rl(),yr(Zi()),ai("settings-change"),_r()}))};for(let[e,t,i]of ig)n(e,t,i)}var Pt=od(wl()),qm=0;function Io(n){Ae.graphics=n,Ae.quality=n.preset||"auto",Rl(),yr(Zi()),ai("settings-change"),Hh(Ae.graphics),Mr(),clearTimeout(qm),qm=setTimeout(Mr,150)}function _M(){Pt=od(wl()),ae("gfx-heading").textContent=Pt.graphics,document.querySelectorAll("#gfx-section [data-gfx-i18n]").forEach(n=>{n.textContent=Pt[n.dataset.gfxI18n]});for(let n of Object.keys(ur)){let e=document.querySelector(`label[for="gfx-${n}"]`);e&&(e.textContent=Pt.cat[n]);let t=ae("gfx-"+n);if(t)for(let i of t.options)i.value!=="preset"&&(i.textContent=Pt.tier[i.value]||i.value)}for(let n of ae("set-quality").options)n.value!=="auto"&&(n.textContent=Pt.preset[n.value])}function SM(){ae("gfx-heading").textContent=Pt.graphics,document.querySelectorAll("#gfx-section [data-gfx-i18n]").forEach(i=>{i.textContent=Pt[i.dataset.gfxI18n]});let n=ae("gfx-cats");n.textContent="";for(let[i,s]of Object.entries(ur)){let r=document.createElement("div");r.className="settings-row";let o=document.createElement("label");o.htmlFor="gfx-"+i,o.textContent=Pt.cat[i];let a=document.createElement("select");a.id="gfx-"+i,a.dataset.gfxCat=i;let l=document.createElement("option");l.value="preset",a.append(l);for(let c of s){let u=document.createElement("option");u.value=c,u.textContent=Pt.tier[c]||c,a.append(u)}a.addEventListener("change",()=>{let c=Object.assign({},Ae.graphics);a.value==="preset"?delete c[i]:c[i]=a.value,Io(c)}),r.append(o,a),n.append(r)}let e=ae("set-quality");for(let i of e.options)i.value!=="auto"&&(i.textContent=Pt.preset[i.value]);e.addEventListener("change",()=>Io(wp(Ae.graphics,e.value)));let t=ae("gfx-scale");t.addEventListener("input",()=>{ae("gfx-scale-value").textContent=t.value+"%"}),t.addEventListener("change",()=>Io(Object.assign({},Ae.graphics,{render_scale:parseInt(t.value,10)/100}))),ae("gfx-adaptive").addEventListener("change",i=>Io(Object.assign({},Ae.graphics,{adaptive:i.target.checked}))),ae("gfx-fps").addEventListener("change",i=>Io(Object.assign({},Ae.graphics,{show_fps:i.target.checked}))),Mr()}function Mr(){ng();let n=Ae.graphics,e=Vp(Pt.sum),t=e.resolved,i=ae("set-quality");i.value=go.includes(n.preset)?n.preset:"auto",i.options[0].textContent=Pt.auto.replace("{tier}",Pt.preset[e.detected]||e.detected);for(let l of Object.keys(ur)){let c=ae("gfx-"+l);if(!c)continue;let u=Ep(t.preset,l);c.options[0].textContent=Pt.fromPreset.replace("{tier}",Pt.tier[u]||u),c.value=ur[l].includes(n[l])?n[l]:"preset"}let s=Math.round(t.renderScale*100);ae("gfx-scale").value=s,ae("gfx-scale-value").textContent=s+"%",ae("gfx-adaptive").checked=t.adaptive,ae("gfx-fps").checked=t.showFps,ae("gfx-summary").textContent=e.webgl?`${e.gpu} \xB7 ${e.summary}`:e.summary;let r=ae("gfx-note"),o=e.webgl?e.postFailed?Pt.postFailed:"":Pt.noWebgl;r.textContent=o,r.classList.toggle("hidden",!o);let a=ae("gfx-section");a.dataset.gfxPreset=t.preset,a.dataset.gfxAuto=t.auto?"1":"0"}function md(n){Td=n,sg(),pt("help")}function sg(){let n=e=>`<b>${Lo(e)}</b>`;ae("help-text").innerHTML=`
    <p><strong>${te("Goal:")}</strong> ${te("move loops between pegs \u2014 keeping their stack order \u2014 until every peg holds a single color.")}</p>
    <h2>${te("Rules")}</h2>
    <ul>
      <li>${te("Only the top loop group lifts. Same-colored loops touching at the top move together.")}</li>
      <li>${te("A group lands on a matching color or an empty peg, never past a peg's capacity.")}</li>
      <li>${te("Invalid drops are rejected with an explanation.")}</li>
    </ul>
    <h2>${te("Controls")}</h2>
    <ul>
      <li>${te("Pointer/touch: tap a peg to lift, tap a target to drop. Drag also works.")}</li>
      <li>${te("Keyboard: {move} choose peg, {confirm} lift/drop, {cancel} cancel, {undo} undo, {hint} hint, {pause} pause, {camera} reset camera.",{move:`<b>${Lo("left")} ${Lo("right")} ${Lo("up")} ${Lo("down")}</b>`,confirm:n("confirm"),cancel:n("cancel"),undo:n("undo"),hint:n("hint"),pause:n("pause"),camera:n("camera")})}</li>
      <li>${te("Gamepad: D-pad/left stick chooses a peg, south button lifts/drops, east cancels, start pauses.")}</li>
    </ul>
    <h2>${te("Scoring")}</h2>
    <ul>
      <li>${te("Completion + efficiency vs par + no-undo mastery \u2212 invalid attempts.")}</li>
      <li>${te("Ties: completion, fewer invalid actions, faster time, then session id.")}</li>
    </ul>`}function ln(n,e){Sr=n,Sd=e,rg(),_n("mode-select","setup opened"),pt("setup")}function rg(){let n=Sr,e=Sd;if(!e)return;ae("setup-title").textContent=bd(e)||te(eg[n]||n),ae("setup-rules").textContent=e.tutorial?te(e.tutorial.text):e.challenge?te(e.challenge.text):te("Sort every loop so each peg holds one color.");let t=n==="daily"||n==="chase";ae("setup-meta").textContent=te("Solo \xB7 ~{n} min \xB7 assists: hints/undo",{n:Math.max(1,Math.round(e.par/3))})+" "+(t?te("(ranked \u2014 undo lowers mastery bonus)"):te("(unranked)"));let i=ae("setup-extra");if(i.innerHTML="",n==="journey"){let s=document.createElement("div");s.className="grid";for(let r=0;r<Es;r++){let o=document.createElement("button");o.type="button",o.textContent=String(r+1);let a=!!$t.journeyDone["journey-"+(r+1)],l=r>$t.journeyUnlocked;o.className=a?"done":l?"locked":"",o.disabled=l,o.setAttribute("aria-label",te(a?"Stage {n} completed":l?"Stage {n} locked":"Stage {n}",{n:r+1})),o.addEventListener("click",()=>{Do=r,ln("journey",As(r))}),s.appendChild(o)}i.appendChild(s)}else if(n==="practice"){let s=document.createElement("div");s.className="settings-row",s.innerHTML='<label for="practice-diff"></label>',s.firstChild.textContent=te("Difficulty");let r=document.createElement("select");r.id="practice-diff";for(let o=1;o<=10;o++){let a=document.createElement("option");a.value=o,a.textContent=te("Level {n}",{n:o}),r.appendChild(a)}r.value=Ae.difficulty,r.addEventListener("change",()=>{Ae.difficulty=parseInt(r.value,10),Rl(),ln("practice",Vl(Ae.difficulty,Date.now()%1e5))}),s.appendChild(r),i.appendChild(s)}else if(n==="challenge"){let s=document.createElement("div");s.className="col",Ts.forEach((r,o)=>{let a=document.createElement("button");a.type="button",a.className="secondary",a.textContent=te(r.title)+" \u2014 "+te(r.text),a.addEventListener("click",()=>ln("challenge",Ho(o,Date.now()%1e5))),s.appendChild(a)}),i.appendChild(s)}}function wd(){return"c"+ ++Qm+"-"+Date.now().toString(36)}function Al(n,e){X=new Nr(n,{mode:e}),Sr=e,Lt=null,Qm=0,Zh(n.seed),vr(),nm(),im(MM),kh(n.theme),mr(X.state),Kn(null),Gi(),Qt(),xs(),Xi(),ai("start"),oi(X),n.timeTargetMs&&!Ae.timingAssist&&(clearInterval(El),fd=!1,El=setInterval(()=>{if(!X||X.status!=="active"){clearInterval(El);return}if(X.elapsedMs()>n.timeTargetMs)clearInterval(El),X.state.status="lost",X.state.terminal="time-limit",og("time-limit");else{let t=n.timeTargetMs-X.elapsedMs();!fd&&t<=1e4&&(fd=!0,Ft("time-warning"),$n(ze("Ten seconds left."))),xs()}},250)),Ft("round-start"),_n(n.tutorial?"tutorial":"active","round started"),pt("play"),n.tutorial&&lg(),Qn(te("Round started. {title}.",{title:bd(n)})+" "+ug())}function MM(){if(!X)return 0;let n=X.state.pegs.reduce((t,i)=>t+i.length,0),e=0;for(let t of X.state.pegs)for(let i=1;i<t.length;i++)t[i]===t[0]&&e++;return n?e/Math.max(1,n-X.state.pegs.filter(t=>t.length<=1).length):0}function og(n){if(!X)return;_n("resolving",n),_l(),X.finish();let e=X.result;e.solved?(Ft("win"),qp()):Ft("lose"),ai("round-end"),ql();let t=Gd($t,X);kd($t);for(let s of t)Ft("achievement");let i=Object.assign({},e,{contentId:X.record.id,seed:X.record.seed,version:X.record.version,day:X.record.day});e.solved&&Hd(i),yr(Zi()),bM(t,n)}var vd=null;function bM(n,e){let t=X.result;vd={unlocked:n,reason:e},ag();let i=ae("btn-next");if(X.mode==="journey"&&t.solved&&Do+1<Es)i.onclick=()=>{Do++,ln("journey",As(Do))};else if(X.mode==="learn"&&t.solved){let s=Ti.findIndex(r=>r.id===X.record.id);s+1<Ti.length?i.onclick=()=>ln("learn",Dr(s+1)):i.onclick=()=>ln("journey",As($t.journeyUnlocked))}else i.onclick=()=>Al(X.record,X.mode);TM(t.total),_n("results","round ended: "+e),pt("results"),Qn(te(t.solved?"Loom complete. Total score {score}.":"Round over. Total score {score}.",{score:t.total})),Pl()}function ag(){if(!vd||!X||!X.result)return;let{unlocked:n,reason:e}=vd,t=X.result;ae("result-headline").textContent=t.solved?te("Loom complete!"):e==="time-limit"?te("Out of time"):te("Out of moves");let i=[[te("Completion"),t.completion],[te("Efficiency (par {par}, {moves} moves)",{par:t.par,moves:t.moves}),t.efficiency],[te("No-undo mastery"),t.mastery],[te("Invalid attempts"),t.invalidPenalty],[te("Total"),t.total]];ae("result-score").innerHTML=i.map(([o,a])=>`<div class="score-line"><span>${o}</span><b>${a}</b></div>`).join("")+`<div class="score-line"><span>${te("Time")}</span><b>${(t.elapsedMs/1e3).toFixed(1)}s</b></div>`,ae("result-achievements").innerHTML=n.map(o=>{let a=Wo.find(l=>l.id===o);return`<span class="badge new">\u2605 ${a?te(a.name):o}</span>`}).join("");let s=Yl("global")[0];ae("result-compare").textContent=s?te("Your best local score: {score} ({moves} moves).",{score:s.score,moves:s.moves}):te("This is your first recorded score.");let r=ae("btn-next");if(X.mode==="journey"&&t.solved&&Do+1<Es)r.textContent=te("Next stage");else if(X.mode==="learn"&&t.solved){let o=Ti.findIndex(a=>a.id===X.record.id);r.textContent=o+1<Ti.length?te("Next lesson"):te("Start the Journey")}else r.textContent=te("Play again")}function TM(n){let e=ae("result-lb"),t=["journey","daily","challenge","chase"].includes(X.mode);if(!gt()||!t){e.hidden=!0;return}e.hidden=!1,xd={pending:!0},yd(),wm(n).then(i=>{xd=i,yd(),td().then(()=>Wi()).catch(()=>{})})}var xd=null;function yd(){let n=ae("result-lb"),e=xd;!e||n.hidden||(n.textContent=e.pending?Gn().lbPosting:e.posted?e.rank?Gn().lbRank.replace("{rank}",e.rank):Gn().lbPosted:Gn().lbNotPosted)}function lg(){let n=X.tutorial,e=X.record.tutorial.steps;if(!n||n.step>=e.length)return;let t=e[n.step];ae("hud-objective").textContent=te(X.record.tutorial.title)+": "+te(t.prompt),Qn(t.prompt)}function xs(){if(!X)return;let n=X.state,e=bs(n,X.record.par,X.elapsedMs()).total,t=(n.moveLimit?te("Moves {n}/{limit}",{n:n.moves,limit:n.moveLimit}):te("Moves {n}",{n:n.moves}))+" \xB7 "+te("Score {n}",{n:e});if(X.record.timeTargetMs&&!Ae.timingAssist){let i=Math.max(0,X.record.timeTargetMs-X.elapsedMs());t+=` \xB7 ${(i/1e3).toFixed(0)}s`}if(ae("hud-status").textContent=t,X.record.tutorial){if(X.tutorial&&X.tutorial.step>=X.record.tutorial.steps.length)ae("hud-objective").textContent=te("Good! Finish the loom.");else if(X.tutorial){let i=X.record.tutorial.steps[X.tutorial.step];i&&(ae("hud-objective").textContent=te(X.record.tutorial.title)+": "+te(i.prompt))}}else{let i=n.pegs.filter(s=>s.length>1&&s.every(r=>r===s[0])).length;ae("hud-objective").textContent=te("Uniform pegs: {done} / {total}",{done:i,total:n.colors})}}function cg(){return te({synced:ze("synced"),saving:ze("saving\u2026"),error:ze("sync error")}[um()]||ze("offline"))}function Xi(){if(!X)return;ae("rail-mode").textContent=te("Mode: {mode} \xB7 {title}",{mode:te(eg[Sr]||Sr),title:bd(X.record)}),ae("rail-online").textContent=gt()?te("{name} \xB7 cloud save {status}",{name:$h(),status:cg()}):te("Playing locally \u2014 scores are stored on this device."),ae("rail-objective").textContent=X.record.challenge?te(X.record.challenge.text):te("Move loops between pegs until every peg holds one color."),ae("rail-progress").textContent=te("Par {par} \xB7 seed {seed}",{par:X.record.par,seed:X.record.seed.toString(16)}),ae("btn-undo").disabled=X.snapshots.length===0||!!X.record.noUndo,ae("tray-undo").disabled=ae("btn-undo").disabled;let n=ae("rail-scores");n.innerHTML="";let e=gt()?hm():null;if(e&&e.length)for(let i of e.slice(0,8)){let s=document.createElement("li");s.textContent=`${i.score} \xB7 ${i.name}`,n.appendChild(s)}else{let i=Yl(X.mode==="daily"?"daily":"global",X.record.day);for(let s of i.slice(0,8)){let r=document.createElement("li");r.textContent=`${s.score} \xB7 ${te("{n} moves",{n:s.moves})} \xB7 ${(s.elapsedMs/1e3).toFixed(0)}s`,n.appendChild(r)}if(!i.length){let s=document.createElement("li");s.textContent=te("No scores yet."),n.appendChild(s)}}let t=ae("rail-achievements");t.innerHTML="";for(let i of Wo){let s=document.createElement("li");s.textContent=($t.achievements[i.id]?"\u2605 ":"\u2606 ")+te(i.name),s.style.color=$t.achievements[i.id]?"var(--accent)":"var(--dim)",t.appendChild(s)}}function Pl(){let n=Object.keys($t.journeyDone).length;ae("rail-journey").textContent=te("Journey: {done}/{total} stages \xB7 {ach}/{achTotal} achievements \xB7 {rounds} rounds completed",{done:n,total:Es,ach:Object.keys($t.achievements).length,achTotal:Wo.length,rounds:$t.roundsCompleted})}function ug(){return X?X.state.pegs.map((n,e)=>te("Peg {n}: {loops}",{n:e+1,loops:n.length?n.map(Md).join(", "):te("empty")})).join(". "):""}function Qt(){let n=ae("a11y-board"),e=document.activeElement,t=e&&e.parentNode===n?Array.prototype.indexOf.call(n.children,e):-1;if(n.innerHTML="",!X)return;let i=X.state,s=Lt!=null?new Set(si(i).filter(r=>r.from===Lt).map(r=>r.to)):new Set;i.pegs.forEach((r,o)=>{let a=document.createElement("button");a.type="button",a.className="peg-btn"+(Lt===o?" selected":"")+(s.has(o)?" legal":"")+(Zt===o?" kb-focus":"");let l=te("Peg {n}: {loops}",{n:o+1,loops:r.length?r.map(Md).join(", "):te("empty")});a.setAttribute("aria-label",Lt===o?te("{label} (lifted)",{label:l}):l),a.innerHTML=r.length?r.slice().reverse().map(c=>`<span class="glyph" style="color:${ws[Ae.palette][c]}">${Fd[c]}</span>`).join(""):'<span class="glyph">\xB7</span>',a.addEventListener("click",()=>{Zt=o,vs(o)}),n.appendChild(a)}),t>=0&&n.children[t]&&n.children[t].focus()}function vs(n){if(!X||X.status!=="active")return;if(vr(),Lt===null){if(X.state.pegs[n].length===0){Ym(n,"empty-source");return}Lt=n,Kn({peg:n,size:ii(X.state,n).size}),Vh(X.state,n),Qt(),Ft("select"),Ae.haptics&&navigator.vibrate&&navigator.vibrate(8);let t=ii(X.state,n);Qn(t.size>1?"Lifted {n} {color} loops from peg {peg}. Choose a target peg.":"Lifted {n} {color} loop from peg {peg}. Choose a target peg.",{n:t.size,color:Md(t.color),peg:n+1});return}if(n===Lt){Lt=null,Kn(null),Gi(),Qt(),Ft("deselect");return}let e=X.applyCommand({id:wd(),type:"move",from:Lt,to:n});if(!e.ok){Ym(n,e.reason,!0);return}if(Lt=null,Kn(null),Gi(),mr(X.state),Xp(n),Ft("move"),Ae.haptics&&navigator.vibrate&&navigator.vibrate(14),oi(X),xs(),Xi(),Qt(),Qn(te("Moved to peg {n}.",{n:n+1})+" "+ug()),X.tutorial&&X.record.tutorial){let t=X.record.tutorial.steps,i=X.tutorial;if(i.step<t.length){let s=t[i.step].expect,r=X.commands[X.commands.length-1];r&&s&&r.from===s.from&&r.to===s.to&&(i.step++,ai("tutorial-step"),i.step<t.length?lg():(ae("hud-objective").textContent=te("Good! Finish the loom."),Qn(ze("Lesson step complete. Now finish the loom on your own."))))}}X.status!=="active"&&og(X.state.terminal||"solved")}function Ym(n,e,t){t||X.applyCommand({id:wd(),type:"invalid"}),Gp(n),Ft("invalid"),Ae.haptics&&navigator.vibrate&&navigator.vibrate([30,40,30]);let i=$m[e]||ze("That move is not allowed.");$n(i),Qn(i),xs()}function Ll(){if(!X||X.status!=="active")return;let n=X.applyCommand({id:wd(),type:"undo"});if(!n.ok){$n($m[n.reason]||ze("Nothing to undo."));return}Lt=null,Kn(null),Gi(),mr(X.state),Ft("undo"),oi(X),xs(),Xi(),Qt(),Qn(ze("Move undone."))}function Il(){if(!X||X.status!=="active")return;let n=X.hint();if(Ft("hint"),!n){$n(ze("No useful move found \u2014 try undo."));return}$n(ze("Hint: try peg {from} \u2192 peg {to}."),{from:n.from+1,to:n.to+1}),Qn(ze("Hint: move from peg {from} to peg {to}."),{from:n.from+1,to:n.to+1}),Kn({peg:n.from,size:ii(X.state,n.from).size}),Vh(X.state,n.from),setTimeout(()=>{Lt===null&&(Kn(null),Gi())},1600)}function wM(n){let e=null,t=null,i=null,s=!1,r=null;n.addEventListener("pointerdown",a=>{zt!=="active"&&zt!=="tutorial"||(r=a.pointerId,n.setPointerCapture(r),e=performance.now(),t={x:a.clientX,y:a.clientY},i=Gh(a.clientX,a.clientY),s=!1)}),n.addEventListener("pointermove",a=>{let l=n.getBoundingClientRect();if(Yp((a.clientX-l.left)/l.width-.5,-((a.clientY-l.top)/l.height-.5)),t&&r===a.pointerId){let c=a.clientX-t.x,u=a.clientY-t.y;Math.hypot(c,u)>14&&(s=!0)}});let o=a=>{if(r!==a.pointerId)return;let l=performance.now()-(e||0),c=Gh(a.clientX,a.clientY);s?i!=null&&c!=null&&(Lt===null&&i!==c&&vs(i),vs(c)):l<600&&c!=null&&vs(c),e=null,t=null,i=null,s=!1,r=null};n.addEventListener("pointerup",o),n.addEventListener("pointercancel",()=>{e=null,t=null,i=null,s=!1,r=null})}function EM(){document.addEventListener("keydown",n=>{let e=s=>(No[s]||[]).includes(n.code);if(n.target&&(n.target.tagName==="INPUT"||n.target.tagName==="SELECT"||n.target.tagName==="TEXTAREA"))return;let t=zt==="active"||zt==="tutorial";if(e("pause")||e("cancel")&&zt==="active"){n.preventDefault(),Dl();return}if(e("cancel")&&!t){let s=tg.find(o=>{let a=document.querySelector(`[data-screen="${o}"]`);return a&&!a.classList.contains("hidden")}),r={help:()=>pt(Td),settings:()=>pt(zt==="paused"?"pause":"title"),modes:()=>Uo(),setup:()=>Uo(),compat:()=>pt(X?"play":"title")}[s];r&&(n.preventDefault(),Ft("back"),r());return}if(!t)return;let i=X?X.state.pegs.length:0;e("left")?(Zt=(Zt-1+i)%i,Qt(),n.preventDefault()):e("right")?(Zt=(Zt+1)%i,Qt(),n.preventDefault()):e("up")?(Zt=Math.max(0,Zt-1),Qt(),n.preventDefault()):e("down")?(Zt=Math.min(i-1,Zt+1),Qt(),n.preventDefault()):e("confirm")?(vs(Zt),n.preventDefault()):e("cancel")?(Lt!==null&&(Lt=null,Kn(null),Gi(),Qt(),Ft("deselect")),n.preventDefault()):e("undo")?(Ll(),n.preventDefault()):e("hint")?(Il(),n.preventDefault()):e("camera")&&(Ml(),n.preventDefault())})}var jm={};function hg(){let n=zt==="active"||zt==="tutorial",e=navigator.getGamepads?navigator.getGamepads():[],t=e&&Array.from(e).find(i=>i&&i.connected);if(t){let i=Ae.gamepad,s=l=>t.buttons[l]&&t.buttons[l].pressed,r=(l,c)=>{let u=jm[l];return jm[l]=c,c&&!u},o=X?X.state.pegs.length:0,a=t.axes[0]||0;r("left",s(14)||a<-.6)&&n&&(Zt=(Zt-1+o)%o,Qt()),r("right",s(15)||a>.6)&&n&&(Zt=(Zt+1)%o,Qt()),r("confirm",s(i.confirm))&&n&&vs(Zt),r("cancel",s(i.cancel))&&n&&Lt!==null&&(Lt=null,Kn(null),Gi(),Qt()),r("undo",s(i.undo))&&n&&Ll(),r("hint",s(i.hint))&&n&&Il(),r("pause",s(i.pause))&&Dl()}requestAnimationFrame(hg)}function Dl(){zt==="active"||zt==="tutorial"?(_n("paused","user paused"),pt("pause"),oi(X)):zt==="paused"&&(_n(X&&X.record.tutorial?"tutorial":"active","resumed"),pt("play"))}function AM(){document.addEventListener("visibilitychange",()=>{document.hidden?(Xh(!1),(zt==="active"||zt==="tutorial")&&(_n("paused","backgrounded"),pt("pause"),oi(X))):(Zm(),X&&zt==="paused"&&($n(ze("Welcome back \u2014 the atelier kept your place.")),oi(X)))}),window.addEventListener("beforeunload",()=>{oi(X)});let n=ae("game-canvas");n.addEventListener("webglcontextlost",e=>{e.preventDefault(),Cl=!1,_d=!1}),n.addEventListener("webglcontextrestored",()=>{Cl=!0,Zm(),X&&mr(X.state)})}var _d=!0;function Zm(){if(_d){Xh(!0);return}_d=!0;try{zh(ae("game-canvas"),{reducedMotion:Ae.reducedMotion}),_r()}catch{}}function CM(){let n=(t,i)=>ae(t).addEventListener("click",()=>{vr(),Ft("click"),i()});ae("btn-signin").textContent=Gn().signIn,ae("btn-invite").textContent=Gn().invite,km(RM),n("btn-signin",()=>pm()),n("btn-invite",async()=>{let t=mm();if(t)try{await navigator.clipboard.writeText(t),$n(Gn().copied)}catch{$n(Gn().copyFailed)}});let e=(t,i)=>ae(t).addEventListener("click",()=>{vr(),Ft("back"),i()});n("btn-play",()=>{let t=qo();if(t){X=t,Jm();return}ln("journey",As($t.journeyUnlocked))}),n("btn-resume-saved",()=>{let t=qo();t&&(X=t,Jm())}),n("btn-modes",()=>{_n("mode-select","user opened modes"),pt("modes")}),n("btn-help-title",()=>md("title")),n("mode-learn",()=>ln("learn",Dr(0))),n("mode-journey",()=>ln("journey",As($t.journeyUnlocked))),n("mode-daily",()=>ln("daily",Hl(Jh()))),n("mode-practice",()=>ln("practice",Vl(Ae.difficulty,Date.now()%1e5))),n("mode-challenge",()=>ln("challenge",Ho(0,Date.now()%1e5))),n("mode-chase",()=>ln("chase",Gl(Date.now()%1e3))),e("mode-back",Uo),n("btn-start-round",()=>Al(Sd,Sr)),e("btn-back-title",Uo),n("btn-pause",Dl),n("btn-resume",Dl),e("btn-leave",()=>{oi(X),X=null,_n("title","user left"),pt("title"),Wi()}),n("btn-open-settings",()=>{Mr(),pt("settings")}),n("btn-title-settings",()=>{Mr(),pt("settings")}),e("btn-settings-close",()=>pt(zt==="paused"?"pause":"title")),n("btn-help-pause",()=>md("pause")),e("btn-help-close",()=>pt(Td)),n("btn-retry",()=>{X&&(ai("retry"),Al(X.record,X.mode))}),e("btn-results-title",Uo),n("btn-undo",Ll),n("btn-hint",Il),n("tray-undo",Ll),n("tray-hint",Il),n("tray-camera",()=>Ml()),n("tray-help",()=>md("play")),n("tray-panel",()=>ae("rail-right").classList.toggle("drawer-open")),n("btn-drawer-left",()=>ae("rail-left").classList.toggle("drawer-open")),n("btn-restart",()=>{X&&Al(X.record,X.mode)}),n("btn-settle",()=>_l()),n("btn-replay-tutorial",()=>{pt("title"),ln("learn",Dr(0))}),e("btn-compat-close",()=>{pt(X?"play":"title")})}function RM(){ae("btn-signin").textContent=Gn().signIn,ae("btn-invite").textContent=Gn().invite,_M(),Mr(),Wi(),Pl();let n=e=>{let t=document.querySelector(`[data-screen="${e}"]`);return t&&!t.classList.contains("hidden")};n("setup")&&rg(),n("help")&&sg(),n("results")&&(ag(),yd()),X&&(xs(),Xi(),Qt())}function Uo(){_n("title","returned to title"),pt("title"),Wi()}function Jm(){Zh(X.record.seed),kh(X.record.theme),mr(X.state),Qt(),xs(),Xi(),_n("active","session restored"),pt("play"),$n(ze("Round restored from your last safe snapshot."))}function Wi(){let n=qo();ae("btn-resume-saved").classList.toggle("hidden",!n);let e=Object.keys($t.journeyDone).length,t=gt()?$h()+" \xB7 ":"";ae("title-status").textContent=t+te("Journey {done}/{total} \xB7 Daily day {day}",{done:e,total:Es,day:Jh()})+" \xB7 "+(gt()?te("cloud save {status}",{status:cg()}):te("local play")),ae("btn-signin").classList.toggle("hidden",!fm()),ae("btn-invite").classList.toggle("hidden",!gt())}async function Km(){_n("boot","initial load"),pt("loading"),vm(),No=vM(),xm(async()=>{let i=await ed();ym()||(jl(Vd(i,Zi())),Ae=Go(),$t=Xo(),_r(),Xm(),Wi(),Pl(),X&&Xi(),yr(Zi()))}),dm(i=>{Wi(),X&&Xi(),i.signedIn||$n(Gn().signedOut)});let n=ae("game-canvas");try{zh(n,{reducedMotion:Ae.reducedMotion}),document.body.dataset.render3d="1"}catch{Cl=!1}if(Wp(i=>Ft(i)),jh(Ae),sm(),_r(),yM(),SM(),CM(),wM(n),EM(),AM(),requestAnimationFrame(hg),await Em(),gt()){let[,i,s,r]=await Promise.all([Tm(),ed(),_m(),gm(No)]);No=r,i&&jl(i)&&(Ae=Go(),$t=Xo());let o=!1;for(let a of Object.keys(gd()))s[a]!==void 0&&s[a]!==null&&(Ae[a]=s[a],o=!0);o&&Xl(Ae),Sm(gd()),(i||o)&&(_r(),Xm()),td().then(()=>{X&&Xi(),Wi()})}let t=zd().filter(i=>!i.ok);t.length&&(ai("error"),console.warn("content validation issues",t)),Pl(),Wi(),_n("title","boot complete"),pt(Cl?"title":"compat")}typeof window<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Km):Km());export{Km as boot};
