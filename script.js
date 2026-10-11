const $=s=>document.querySelector(s);
const DOCS=[
{id:'c',n:'Dr Leila Mansour',sp:'Cardiologie',role:'Suivi cardiaque après angioplastie',col:'#14958f'},
{id:'g',n:'Dr Karim Trabelsi',sp:'Médecine générale',role:'Médecin traitant, coordination des soins',col:'#3f8fd2'},
{id:'r',n:'Dr Sana Haddad',sp:'Radiologie',role:'Interprétation des examens d\u2019imagerie',col:'#7a6fd0'},
{id:'e',n:'Dr Omar Jaziri',sp:'Endocrinologie',role:'Prise en charge du diabète de type 2',col:'#d08a3f'}];
const dn=id=>DOCS.find(d=>d.id===id);
let P={id:'amine',name:'Amine Ben Salah',age:58,sex:'Homme',blood:'A+',cin:'12345678',emerg:'Salma Ben Salah (épouse) – +216 20 000 000',
chronic:['Hypertension artérielle','Diabète de type 2'],allergies:['Pénicilline'],
hist:['2019 – Diagnostic du diabète de type 2','2022 – Angioplastie coronaire (1 stent)','2025 – Début de l\u2019hypertension traitée'],
meds:[['Metformine','850 mg','2 fois/jour','En continu','e'],['Bisoprolol','5 mg','1 fois/jour (matin)','En continu','c'],['Atorvastatine','40 mg','1 fois/jour (soir)','6 mois, à réévaluer','c'],['Aspirine','75 mg','1 fois/jour','12 mois après stent','c']],
alerts:['Allergie à la pénicilline','LDL au-dessus de la cible (1,35 g/L)','Protéinurie en hausse sur 3 contrôles'],
appts:[['2026-10-22','Contrôle cardiologique','c'],['2026-11-05','Bilan diabète + HbA1c','e']],
past:{c:[['2026-06-10','Échographie cardiaque : fonction VG conservée. Poursuivre le traitement.'],['2026-01-15','Tension à 14/8, ajustement du bisoprolol.']],g:[['2026-09-02','Fatigue légère, bilan sanguin prescrit.']],r:[['2026-03-12','IRM cérébrale : pas d\u2019anomalie aiguë décrite.']],e:[['2026-04-20','Glycémie en amélioration, maintenir la metformine.']]}};
const DEMO=P;
const emp=t=>`<div class="card mut">${t}</div>`;
const allPts=()=>[{id:'amine',n:DEMO.name,a:DEMO.age,c:DEMO.chronic.join(', '),al:DEMO.allergies.join(', '),tr:DEMO.meds.map(m=>m[0]).join(', '),alert:DEMO.alerts[0],x:'#14958f',full:1,cin:DEMO.cin},...OTH,...(DB.pts||[])];
const getP=id=>{if(!id||id==='amine')return DEMO;const p=allPts().find(x=>x.id===id)||{n:'Inconnu',a:'—'};return {id:p.id,name:p.n,age:p.a,sex:'—',blood:'—',cin:p.cin||'—',emerg:'Non renseigné',chronic:[p.c||'Non renseigné'],allergies:[p.al||'Non renseigné'],hist:[],meds:p.tr?[[p.tr,'','—','','g']]:[],alerts:[p.alert||'Aucune alerte'],appts:[],past:{}}};
const LABS=[['Sang','Hémoglobine','g/dL',13,17,[13.2,12.8,12.4]],['Sang','Leucocytes','G/L',4,10,[6.1,7,6.6]],['Sang','Plaquettes','G/L',150,400,[240,255,248]],['Sang','Glycémie à jeun','g/L',.7,1.1,[1.32,1.21,1.18]],['Sang','LDL-cholestérol','g/L',0,1.3,[1.62,1.48,1.35]],['Sang','Créatinine','mg/dL',.7,1.3,[1,1.1,1.1]],['Urine','Protéines','g/L',0,.15,[.1,.18,.22]],['Urine','Glucose urinaire','g/L',0,.5,[.4,.3,.2]],['Urine','pH','',5,8,[6,6,5.5]]];
const LD=['2026-01-15','2026-04-20','2026-09-02'];
const IMG=[{id:'i1',t:'IRM',r:'Cerveau',d:'2026-03-12',doc:'r',ref:'c',rep:'IRM cérébrale sans injection : pas de lésion ischémique récente décrite.',h:200},{id:'i2',t:'Scanner',r:'Thorax',d:'2026-05-05',doc:'r',ref:'g',rep:'Scanner thoracique : parenchyme pulmonaire sans nodule suspect.',h:150},{id:'i3',t:'Radio',r:'Thorax',d:'2025-11-18',doc:'r',ref:'g',rep:'Radiographie thoracique de face : silhouette cardiaque normale.',h:30},{id:'i4',t:'Échographie',r:'Cœur',d:'2026-06-10',doc:'c',ref:'c',rep:'Échographie cardiaque : fonction ventriculaire gauche conservée.',h:100}];
const OTH=[{id:'o0',n:'Marie Dupont',a:67,c:'Insuffisance cardiaque légère',al:'Aucune connue',tr:'Furosémide 20 mg',alert:'Poids à surveiller',x:'#d08a3f'},{id:'o1',n:'Youssef Gharbi',a:41,c:'Asthme',al:'Acariens, pollen',tr:'Salbutamol à la demande',alert:'Aucune alerte',x:'#7a6fd0'}];
// ---- state (persisted in localStorage, demo only) ----
let DB={subs:[{id:'s0',title:'Bilan lipidique externe',cat:'Bilans',date:'2026-09-20',desc:'Bilan réalisé en laboratoire privé.',file:'bilan_lipidique.pdf',img:null,docs:['c','g'],st:'Pending Review',by:null,rd:null,cm:'',log:[]}],obs:[],np:1,nd:0};
try{const x=JSON.parse(localStorage.getItem('mc1'));if(x)DB=x}catch(e){}
const save=()=>{try{localStorage.setItem('mc1',JSON.stringify(DB))}catch(e){}};
let S={v:'land',role:null,card:false,tab:0,asDoc:false,f:{t:'Tous'},lab:3,zoom:1,cin:null,loading:false};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const toast=t=>{const e=document.createElement('div');e.className='toast';e.setAttribute('role','status');e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),2600)};
const go=(v,x={})=>{Object.assign(S,{v},x);render();scrollTo(0,0)};
const modal=h=>{$('#m').innerHTML=h?`<div class="mo" onclick="if(event.target===this)modal()"><div role="dialog" aria-modal="true">${h}</div></div>`:''};
const notify=(who,t)=>{(DB[who==='p'?'np':'nd'])++;DB.log=(DB.log||[]);DB.log.unshift([who,t,new Date().toISOString().slice(0,10)]);save()};
const av=d=>`<div class="av" style="background:${d.col||d.x}" aria-hidden="true">${esc(d.n.replace('Dr ','').split(' ').map(w=>w[0]).join('').slice(0,2))}</div>`;
const stCls={'Pending Review':'warn','Approved':'ok','Rejected':'bad','Clarification Requested':'warn'};
const badge=s=>`<span class="badge ${stCls[s]}">${s}</span>`;
// ---- NFC module: swap NFC.scan for a Web NFC / USB reader driver (NDEFReader) in production ----
const NFC={cards:{'CARD-AMINE-001':'12345678'},async scan(kind){await new Promise(r=>setTimeout(r,1500));const id=kind==='ok'?(S.scanFor?'CARD-'+S.scanFor.toUpperCase():'CARD-AMINE-001'):'CARD-UNKNOWN-999';return id.includes('UNKNOWN')?{ok:false,id}:{ok:true,id,cin:this.cards[id]}}};
function scanPt(id){S.scanFor=id;nfcModal(r=>go('pat',{asDoc:true,tab:0,pid:id}))}
function addPt(){modal(`<h3>Ajouter un patient</h3><form onsubmit="addPtGo(event)"><label for="an">Nom complet</label><input id="an"><div class="grid"><div><label for="aa">Âge</label><input id="aa" type="number" min="0" max="120"></div><div><label for="ac">CIN (8 chiffres)</label><input id="ac" inputmode="numeric"></div></div><label for="ap">Pathologies</label><input id="ap"><label for="al">Allergies</label><input id="al"><label for="at">Traitement</label><input id="at"><p id="ae" class="bad" role="alert"></p><div class="row"><button class="btn">Ajouter</button><button type="button" class="btn g" onclick="modal()">Annuler</button></div></form>`)}
function addPtGo(e){e.preventDefault();const g=i=>$('#'+i).value.trim();if(!g('an')||!g('aa')||!/^\d{8}$/.test(g('ac')))return $('#ae').textContent='Nom, âge et CIN à 8 chiffres sont obligatoires.';DB.pts=DB.pts||[];DB.pts.push({id:'n'+Date.now(),n:g('an'),a:+g('aa'),cin:g('ac'),c:g('ap')||'Non renseigné',al:g('al')||'Non renseigné',tr:g('at'),alert:'Nouveau dossier – informations à compléter',x:'#3f8fd2'});save();modal();toast('Patient ajouté – carte NFC simulée enregistrée');render()}
function rx(e){e.preventDefault();const g=i=>$('#'+i).value.trim();if(!g('rn')||!g('rd')||!g('rf'))return $('#rer').textContent='Renseignez médicament, dosage et fréquence.';DB.rx=DB.rx||[];DB.rx.unshift({pid:P.id||'amine',n:g('rn'),d:g('rd'),f:g('rf'),u:g('ru')||'À définir',date:'2026-10-11'});save();toast('Prescription ajoutée');render()}
function nfcModal(done){
 const draw=(st,msg)=>modal(`<h3>Lecture de la carte NFC</h3><div class="sim">Simulation de démonstration : aucun lecteur matériel n\u2019est connecté. En production, ce module appelle un lecteur NFC réel et le serveur valide la carte.</div>
 <div class="scan ${st}" aria-hidden="true">${{r:'📶',s:'⏳',v:'✔',f:'✖'}[st]}</div><p style="text-align:center" role="status"><b>${msg}</b></p>
 ${st==='r'||st==='f'?`<div class="row" style="justify-content:center"><button class="btn" onclick="NFCgo('ok')">Simuler une carte enregistrée</button><button class="btn g" onclick="NFCgo('bad')">Simuler une carte inconnue</button></div>`:''}<div class="row" style="justify-content:center;margin-top:.8rem"><button class="btn g s" onclick="modal()">Fermer</button></div>`);
 window.NFCgo=async k=>{draw('s','Analyse en cours…');const r=await NFC.scan(k);if(r.ok){draw('v','Carte vérifiée ('+r.id+')');setTimeout(()=>{modal();done(r)},900)}else draw('f','Échec de la vérification : carte non enregistrée')};
 draw('r','Prêt à scanner');}
// ---- views ----
function topbar(){const n=S.role==='p'?DB.np:S.role==='d'?DB.nd:0;return `<header class="top"><span class="logo" onclick="go('${S.role?(S.role==='p'?'pat':'doc'):'land'}',{asDoc:false})" tabindex="0">Med<i>Card</i></span><span class="badge">Démo – données fictives</span><div class="row"><select class="lang" aria-label="Langue" onchange="setLang(this.value)">${Object.entries(LANGS).map(([k,v])=>`<option value="${k}" ${k===LANG?'selected':''}>${v}</option>`).join('')}</select>${S.role?`<button class="btn g s" aria-label="Notifications" onclick="notes()">🔔 ${n}</button><button class="btn g s" onclick="logout()">Déconnexion</button>`:`<button class="btn g s" onclick="go('dlogin')">Doctor Portal</button><button class="btn s" onclick="go('plogin')">Patient Portal</button>`}</div></header>`}
function notes(){const w=S.role==='p'?'p':'d';const l=(DB.log||[]).filter(x=>x[0]===w);if(w==='p')DB.np=0;else DB.nd=0;save();modal(`<h3>Notifications <span class="badge">simulées</span></h3>${l.length?l.map(x=>`<p>• ${esc(x[1])} <span class="mut">${x[2]}</span></p>`).join(''):'<p class="mut">Rien de nouveau pour le moment.</p>'}<button class="btn g s" onclick="modal();render()">Fermer</button>`)}
function logout(){Object.assign(S,{role:null,card:false,asDoc:false,v:'land',tab:0});render()}
function land(){return `<div class="wrap"><section class="hero"><div><h1>Tout votre dossier médical, à portée d\u2019une carte.</h1><p class="mut" style="font-size:1.1rem;max-width:48ch">Imagerie, bilans et traitements réunis en un seul endroit. Le patient se connecte avec sa carte NFC ; le médecin l\u2019approche pour ouvrir le dossier.</p><div class="row" style="margin-top:1rem"><button class="btn" onclick="go('plogin')">Patient Portal</button><button class="btn" onclick="go('dlogin')">Doctor Portal</button><button class="btn g" onclick="document.getElementById('demo').scrollIntoView({behavior:'smooth'})">Try Demo</button></div></div>
<div class="nfc bg"><div class="ring"></div><div class="ring"></div><div class="c"><b>MedCard</b><p style="margin-top:2.4rem;font-size:.85rem">AMINE BEN SALAH<br>CIN •••• 5678</p><p style="position:absolute;inset-inline-end:1rem;top:.8rem;font-size:1.6rem;direction:ltr">))))</p></div></div></section>
<section class="card" id="demo"><h2>Try Demo <span class="badge">identifiants de démonstration</span></h2><div class="grid"><div><h3>Médecin</h3><p>E-mail : <code>doctor@medcard.demo</code><br>Mot de passe : <code>Doctor123!</code></p><button class="btn s" onclick="go('dlogin',{fill:1})">Ouvrir le portail médecin</button></div><div><h3>Patient</h3><p>CIN : <code>12345678</code><br>Mot de passe : <code>Patient123!</code></p><button class="btn s" onclick="go('plogin')">Ouvrir le portail patient</button></div></div><p class="mut">Ces comptes et ces données sont fictifs. Ils ne donnent accès à aucun vrai dossier.</p></section>
<section><h2>Comment ça marche</h2><div class="grid">${[['Obtenir sa carte','Le patient reçoit sa carte NFC, son CIN et un mot de passe lors de l\u2019ouverture de son dossier auprès d\u2019un établissement partenaire.'],['Se connecter','Le patient scanne sa carte, puis saisit son CIN et son mot de passe. Sans carte valide, le formulaire reste bloqué.'],['Consulter les soins','Le médecin scanne la carte du patient et ouvre directement le dossier complet, sans CIN ni mot de passe.'],['Suivre ses soins','Le patient consulte ses informations, ses imageries, ses bilans, ses médecins et ses rendez-vous.']].map((s,i)=>`<div class="card"><span class="badge">Étape ${i+1}</span><h3>${s[0]}</h3><p class="mut">${s[1]}</p></div>`).join('')}</div><p class="mut">Aucune carte n\u2019est en vente via ce site : il s\u2019agit d\u2019une démonstration.</p></section>
<section><h2>Questions fréquentes</h2><div class="card"><details><summary>La carte seule suffit-elle à accéder à un dossier ?</summary><p class="mut">Non. En production, la possession de la carte n\u2019est jamais une preuve d\u2019identité suffisante : le serveur vérifie aussi l\u2019authentification, les droits et journalise chaque accès.</p></details><details><summary>Ce site est-il connecté à un vrai lecteur NFC ?</summary><p class="mut">Non, le scan est simulé. Le module NFC est isolé pour brancher plus tard un lecteur compatible.</p></details><details><summary>Les résumés IA sont-ils fiables ?</summary><p class="mut">Ils sont simulés ici, construits uniquement à partir des données du dossier, signalent les informations manquantes et ne posent aucun diagnostic.</p></details><details><summary>Que faut-il côté serveur ?</summary><p class="mut">Authentification et autorisations serveur, chiffrement en transit et au repos, sessions sécurisées, journaux d\u2019audit. Rien de cela n\u2019existe dans cette démo.</p></details></div></section></div>`}
function plogin(){return `<div class="wrap" style="max-width:480px"><div class="card"><h2>Portail patient</h2><div class="row sp"><b>1. Carte NFC</b><span class="badge ${S.card?'ok':''}">${S.card?'Carte vérifiée':'En attente'}</span></div><button class="btn g" onclick="S.scanFor=null;nfcModal(r=>{S.card=true;S.cin=r.cin;render();toast('Carte vérifiée')})">${S.card?'Scanner à nouveau':'Scanner ma carte'}</button>
<form onsubmit="plog(event)"><fieldset ${S.card?'':'disabled'} style="border:0;padding:0;margin:1rem 0 0"><b>2. Identifiants</b><label for="cin">CIN</label><input id="cin" inputmode="numeric" autocomplete="username"><label for="pw">Mot de passe</label><input id="pw" type="password" autocomplete="current-password"><p id="er" class="bad" role="alert"></p><button class="btn">Se connecter</button></fieldset></form>
${S.card?'':'<p class="mut">Le formulaire est désactivé tant qu\u2019aucune carte valide n\u2019a été détectée.</p>'}<div class="sim" style="margin-top:1rem">Démo : CIN 12345678 · mot de passe Patient123!</div></div></div>`}
function plog(e){e.preventDefault();const c=$('#cin').value.trim(),p=$('#pw').value;if(!S.card)return;if(c!==S.cin||c!==P.cin||p!=='Patient123!'){$('#er').textContent='CIN ou mot de passe incorrect, ou carte non associée à ce CIN.';return}S.role='p';S.v='pat';S.tab=0;S.pid='amine';S.asDoc=false;render()}
function dlogin(){return `<div class="wrap" style="max-width:480px"><div class="card"><h2>Portail médecin</h2><form onsubmit="dlog(event)"><label for="em">E-mail</label><input id="em" autocomplete="username" value="${S.fill?'doctor@medcard.demo':''}"><label for="dp">Mot de passe</label><input id="dp" type="password" value="${S.fill?'Doctor123!':''}"><p id="er" class="bad" role="alert"></p><button class="btn">Se connecter</button></form><div class="sim" style="margin-top:1rem">Démo : doctor@medcard.demo · Doctor123!</div></div></div>`}
function dlog(e){e.preventDefault();if($('#em').value.trim()!=='doctor@medcard.demo'||$('#dp').value!=='Doctor123!'){$('#er').textContent='E-mail ou mot de passe incorrect.';return}S.role='d';S.v='doc';S.q='';render()}
function summary(){if(P!==DEMO)return '<b>Résumé IA (simulé)</b><p>Données insuffisantes : aucun bilan, imagerie ni historique enregistré. Aucun diagnostic proposé.</p>';const l=LABS.filter(x=>x[5][2]<x[3]||x[5][2]>x[4]).map(x=>x[1]+' '+x[5][2]+' '+x[2]);return `<b>Résumé IA (simulé)</b><p>Patient de ${P.age} ans suivi pour ${P.chronic.join(' et ').toLowerCase()}, avec antécédent d\u2019angioplastie en 2022. Dernier bilan (${LD[2]}) : valeurs hors référence – ${l.join(', ')||'aucune'}. Tendance : LDL, glycémie et hémoglobine évoluent sur 3 dates.</p><p class="mut" style="font-size:.85rem">Sources : dossier général, bilans du ${LD.join(', ')}. Information manquante : HbA1c, dernier ECG. Ce résumé ne constitue pas un diagnostic.</p>`}
function doc(){const q=(S.q||'').toLowerCase();const pend=DB.subs.filter(s=>s.docs.includes('c')&&s.st==='Pending Review').length;
 P=DEMO;const all=allPts().filter(p=>p.n.toLowerCase().includes(q));
 return `<div class="wrap"><h2>Bonjour Dr Mansour</h2><div class="row sp"><p class="mut">Cardiologie · ${pend} document(s) en attente de votre revue</p><button class="btn" onclick="addPt()">+ Ajouter un patient</button></div>
 <label for="sq">Rechercher un patient</label><input id="sq" value="${esc(S.q||'')}" oninput="S.q=this.value;render();$('#sq').focus()"><div class="sim" style="margin:.8rem 0">Sans scan NFC, seules les informations générales et un résumé limité sont visibles. Le dossier complet s\u2019ouvre au scan de la carte (simulée).</div>
 <div class="grid">${all.length?all.map(p=>`<div class="card"><div class="row">${av(p)}<div><h3 style="margin:0">${esc(p.n)}</h3><span class="mut">${p.a} ans</span></div></div><p><b>Pathologies :</b> ${esc(p.c)}</p><p><b>Allergies :</b> ${esc(p.al)}</p><p><b>Traitement :</b> ${esc(p.tr)}</p><p class="bad"><b>Alerte :</b> ${esc(p.alert)}</p><div class="sim">${p.full?summary():'<b>Résumé IA (simulé)</b><p>Données limitées sans scan de la carte. Dossier détaillé non disponible : informations manquantes.</p>'}</div><button class="btn s" style="margin-top:.7rem" onclick="scanPt('${p.id}')">📶 Scanner la carte NFC</button></div>`).join(''):'<div class="card">Aucun patient ne correspond à cette recherche.</div>'}</div></div>`}
function pat(){const T=['Informations générales','Imagerie médicale','Bilans médicaux','Mes médecins',...(S.asDoc?['Espace médecin']:[])];P=getP(S.pid);
 return `<div class="wrap">${S.asDoc?`<div class="sim row sp"><span>Dossier complet ouvert par scan NFC · permissions médecin actives (Dr Mansour)</span><button class="btn g s" onclick="go('doc',{asDoc:false})">Fermer le dossier</button></div>`:''}<div class="row" style="margin:1rem 0">${av({n:P.name,col:'#14958f'})}<div><h2 style="margin:0">${P.name}</h2><span class="mut">CIN ••••${P.cin.slice(-4)}</span></div></div>
 <nav class="tabs" aria-label="Sections">${T.map((t,i)=>`<button class="${S.tab===i?'on':''}" aria-current="${S.tab===i}" onclick="S.tab=${i};render()">${t}</button>`).join('')}</nav>${[t0,t1,t2,t3,t4][S.tab]()}</div>`}
const approved=c=>DB.subs.filter(s=>s.st==='Approved'&&s.cat===c);
function t0(){const ag=approved('General');return `<div class="grid"><div class="card"><h3>Identité</h3><p>${P.sex} · ${P.age} ans · groupe ${P.blood}</p><p><b>Contact d\u2019urgence :</b> ${esc(P.emerg)}</p></div><div class="card"><h3>Alertes</h3>${P.alerts.map(a=>`<p class="bad">⚠ ${a}</p>`).join('')}</div><div class="card"><h3>Pathologies chroniques</h3><p>${P.chronic.join(', ')}</p><h3 style="margin-top:.8rem">Allergies</h3><p>${P.allergies.join(', ')}</p></div></div>
 <div class="card sim">${summary()}</div><div class="grid"><div class="card"><h3>Médicaments actuels</h3>${P.meds.map(m=>`<p>${m[0]} ${m[1]} – ${m[2]}</p>`).join('')}</div><div class="card"><h3>Antécédents</h3>${P.hist.map(h=>`<p>• ${h}</p>`).join('')}</div><div class="card"><h3>Prochains rendez-vous</h3>${P.appts.map(a=>`<p>${a[0]} – ${a[1]}<br><span class="mut">${dn(a[2]).n}</span></p>`).join('')}</div></div>
 <div class="card"><h3>Activité récente</h3>${Object.entries(P.past).flatMap(([k,v])=>v.map(x=>[x[0],dn(k).n,x[1]])).sort().reverse().map(x=>`<p><b>${x[0]}</b> · ${x[1]} : ${x[2]}</p>`).join('')}${ag.map(s=>`<p><b>${s.date}</b> · Document approuvé : ${esc(s.title)}</p>`).join('')}</div>`}
function ph(h,l){return `<svg viewBox="0 0 160 120" role="img" aria-label="Image synthétique ${l}"><defs><radialGradient id="g${h}"><stop offset="0" stop-color="hsl(${h},15%,75%)"/><stop offset="1" stop-color="#0a1d25"/></radialGradient></defs><rect width="160" height="120" fill="#0a1d25"/><ellipse cx="80" cy="60" rx="48" ry="44" fill="url(#g${h})"/><ellipse cx="80" cy="60" rx="26" ry="24" fill="none" stroke="#fff3" stroke-width="2"/><path d="M80 20v80M40 60h80" stroke="#fff2"/><text x="80" y="112" fill="#fff9" font-size="7" text-anchor="middle">PLACEHOLDER SYNTHÉTIQUE · ${l}</text></svg>`}
const IT=['IRM','Scanner','Radio','Échographie','Autre'];
const isPdf=s=>s.ft==='application/pdf'||/\.pdf$/i.test(s.file||'');
const furl=s=>FU[s.id]||s.img||'';
const fsz=n=>n<1048576?Math.round(n/1024)+' Ko':(n/1048576).toFixed(1).replace('.',',')+' Mo';
const exOf=s=>({id:s.id,t:s.it||'Autre',r:s.rg||'—',d:s.date,doc:s.by||'r',ref:s.by||'g',rep:s.desc||'Document approuvé.',h:60,isPdf:isPdf(s),img:isPdf(s)?'':furl(s),pdf:isPdf(s)?furl(s):'',file:s.file,title:s.title,up:1});
const thumb=i=>i.isPdf?`<div class="pdfx"><span aria-hidden="true">📄</span><b>PDF</b><small>${esc(i.file)}</small></div>`:i.img?`<img src="${i.img}" alt="">`:ph(i.h,i.t);
const pdfView=u=>`<iframe src="${u}" title="PDF" style="width:100%;height:55vh;border:1px solid var(--line);border-radius:12px;background:#fff"></iframe><p><a href="${u}" target="_blank" rel="noopener" style="color:var(--b)">Ouvrir le PDF dans un nouvel onglet</a></p>`;
const prev=s=>{const u=furl(s);if(!u)return '<div class="sim">Aperçu non disponible (fichier non conservé dans cette démo).</div>';return isPdf(s)?pdfView(u):`<img src="${u}" alt="Aperçu" style="max-width:100%;border-radius:10px">`};
const revLine=s=>s.by?`<p>Revu par ${dn(s.by).n} le ${s.rd}${s.cm?' : « '+esc(s.cm)+' »':''}</p>`:'';
const depItem=(s,doc)=>`<div class="dep"><div class="row sp"><b>${esc(s.title)}</b>${badge(s.st)}</div><p class="mut">${s.it||s.cat} · ${s.date} · ${esc(s.file)}</p>${revLine(s)}${(s.log||[]).map(l=>`<p class="mut">↳ ${esc(l)}</p>`).join('')}<div class="row">${furl(s)?`<button class="btn g s" onclick="viewSub('${s.id}')">Voir</button>`:''}${doc?(s.st==='Pending Review'?`<button class="btn s" onclick="review('${s.id}')">Ouvrir la revue</button>`:''):(s.st==='Clarification Requested'?`<button class="btn s" onclick="reply('${s.id}')">Répondre</button>`:'')+(s.st==='Pending Review'?`<button class="btn g s" onclick="delSub('${s.id}')">Retirer</button>`:'')}</div></div>`;
function upForm(){const today=new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,10);
 return `<details class="card up" ${S.upOpen?'open':''} ontoggle="S.upOpen=this.open"><summary>➕ Déposer une imagerie</summary><form onsubmit="up(event)" style="margin-top:.6rem"><label for="uf">Fichier (PDF ou image)</label><input id="uf" type="file" accept="application/pdf,image/png,image/jpeg,image/webp,image/gif" onchange="pick(this)"><div id="upv"></div><label for="ut">Titre</label><input id="ut" maxlength="80"><div class="grid"><div><label for="uy">Type d\u2019examen</label><select id="uy">${IT.map(o=>`<option value="${o}">${o}</option>`).join('')}</select></div><div><label for="ur">Région (facultatif)</label><input id="ur" maxlength="40"></div><div><label for="ud">Date de l\u2019examen</label><input id="ud" type="date" value="${today}"></div></div><label for="ux">Description (facultatif)</label><textarea id="ux" rows="2"></textarea><label>Médecins destinataires</label>${DOCS.map(d=>`<label class="ck"><input type="checkbox" name="ad" value="${d.id}" ${d.id==='c'?'checked':''}> ${d.n} – ${d.sp}</label>`).join('')}<p class="mut" style="font-size:.85rem">Démo : le fichier reste sur cet appareil et seul le Dr Mansour peut valider. Il apparaît dans votre dossier après validation.</p><p id="ue" class="bad" role="alert"></p><button class="btn">Envoyer pour revue</button></form></details>`}
function t1(){if(P!==DEMO)return emp("Aucun examen d'imagerie enregistré pour ce patient.");const ex=approved('Imagerie').map(exOf);
 const L=[...IMG,...ex].filter(i=>S.f.t==='Tous'||i.t===S.f.t).sort((a,b)=>b.d.localeCompare(a.d));
 const pend=S.asDoc?[]:DB.subs.filter(s=>s.cat==='Imagerie'&&s.st!=='Approved');
 return `${S.asDoc?'':upForm()}${pend.length?`<div class="card"><h3>Mes dépôts en cours</h3>${pend.map(s=>depItem(s,false)).join('')}</div>`:''}<div class="sim" style="margin-bottom:1rem">Images de démonstration : placeholders synthétiques, aucune donnée de patient réel. Pour de vraies images, utiliser des sources libres avec attribution.</div><div class="row"><label for="ft" style="margin:0">Type</label><select id="ft" style="width:auto" onchange="S.f.t=this.value;render()">${['Tous',...IT].map(o=>`<option value="${o}" ${S.f.t===o?'selected':''}>${o}</option>`).join('')}</select></div><div class="grid" style="margin-top:1rem">${L.length?L.map(i=>`<div class="card"><div class="im" tabindex="0" role="button" aria-label="Agrandir" onclick="img('${i.id}')" onkeydown="if(event.key==='Enter')img('${i.id}')">${thumb(i)}</div><h3 style="margin-top:.6rem">${esc(i.title||i.t+' – '+i.r)}</h3><p class="mut">${i.d} · ${dn(i.doc)?.n}</p>${badge('Approved')}</div>`).join(''):'<div class="card">Aucun examen pour ce filtre.</div>'}</div>`}
function img(id){S.zoom=1;const i=IMG.find(x=>x.id===id)||approved('Imagerie').map(exOf).find(x=>x.id===id);if(!i)return;
 const view=i.isPdf?(i.pdf?pdfView(i.pdf):'<div class="sim">Aperçu non disponible (fichier non conservé dans cette démo).</div>'):`<div class="im" style="cursor:default"><div id="zm" style="width:100%;height:100%;transform-origin:center;transition:transform .2s">${thumb(i)}</div></div><label for="z">Zoom</label><input id="z" type="range" min="1" max="3" step=".1" value="1" oninput="$('#zm').style.transform='scale('+this.value+')'">`;
 modal(`<h3>${esc(i.title||i.t+' – '+i.r)}</h3>${view}<p><b>Date :</b> ${i.d}</p><p><b>Région :</b> ${esc(i.r)}</p>${i.up?`<p><b>Déposé par :</b> le patient</p><p><b>Validé par :</b> ${dn(i.doc)?.n}</p>`:`<p><b>Radiologue :</b> ${dn(i.doc)?.n}</p><p><b>Demandé par :</b> ${dn(i.ref)?.n}</p>`}<p><b>Rapport :</b> ${esc(i.rep)}</p>${badge('Approved')}<br><br><button class="btn g s" onclick="modal()">Fermer</button>`)}
function viewSub(id){const s=DB.subs.find(x=>x.id===id);if(!s)return;modal(`<h3>${esc(s.title)}</h3><p class="mut">${s.it||s.cat} · ${s.date} · ${esc(s.file)}</p>${s.desc?`<p>${esc(s.desc)}</p>`:''}${prev(s)}${badge(s.st)}<br><br><button class="btn g s" onclick="modal()">Fermer</button>`)}
function delSub(id){if(!confirm(T('Retirer ce dépôt ?')))return;DB.subs=DB.subs.filter(s=>s.id!==id);IDBF.del(id);if(FU[id]){URL.revokeObjectURL(FU[id]);delete FU[id]}save();toast('Dépôt retiré');render()}
function revCard(){const L=DB.subs.filter(s=>s.docs.includes('c'));return `<div class="card"><h3>Documents déposés par le patient</h3>${L.length?L.map(s=>depItem(s,true)).join(''):'<p class="mut">Aucun document déposé.</p>'}</div>`}
const stat=x=>{const [a,b,c]=x[5];const out=c<x[3]||c>x[4];const d=c-b,tr=Math.abs(d)<(x[4]-x[3]||1)*.03?'→ stable':d>0?'↑ en hausse':'↓ en baisse';return [out,tr]};
function t2(){if(P!==DEMO)return emp('Aucun bilan enregistré pour ce patient.');const L=LABS[S.lab]||LABS[3];const k=LABS.indexOf(L);const [lo,hi,v]=[L[3],L[4],L[5]];const mn=Math.min(lo,...v)*.9,mx=Math.max(hi,...v)*1.1,y=n=>150-(n-mn)/(mx-mn)*130,x=i=>50+i*110;
 return `<div class="sim" style="margin-bottom:1rem">Résultats fictifs à titre de démonstration. Les valeurs hors plage sont signalées, sans diagnostic.</div><div class="card"><div class="row sp"><h3>Évolution</h3><select aria-label="Paramètre" style="width:auto" onchange="S.lab=+this.value;render()">${LABS.map((l,i)=>`<option value="${i}" ${i===k?'selected':''}>${l[1]}</option>`).join('')}</select></div><svg viewBox="0 0 320 180" style="width:100%;max-width:560px" role="img" aria-label="Courbe ${L[1]}"><rect x="30" y="${y(hi)}" width="270" height="${Math.max(2,y(lo)-y(hi))}" fill="#14958f" opacity=".18"/><polyline fill="none" stroke="#3f8fd2" stroke-width="3" points="${v.map((n,i)=>x(i)+','+y(n)).join(' ')}"/>${v.map((n,i)=>`<circle cx="${x(i)}" cy="${y(n)}" r="5" fill="${n<lo||n>hi?'#c4503c':'#14958f'}"/><text x="${x(i)}" y="${y(n)-10}" font-size="10" text-anchor="middle" fill="currentColor">${n}</text><text x="${x(i)}" y="172" font-size="9" text-anchor="middle" fill="currentColor">${LD[i].slice(5)}</text>`).join('')}</svg><p class="mut">Zone teintée : plage de référence ${lo}–${hi} ${L[2]}</p></div>
 ${['Sang','Urine'].map(c=>`<div class="card scroll"><h3>Bilan ${c==='Sang'?'sanguin':'urinaire'}</h3><table><tr><th>Paramètre</th>${LD.map(d=>`<th>${d}</th>`).join('')}<th>Référence</th><th>Tendance</th></tr>${LABS.filter(l=>l[0]===c).map(l=>{const [o,t]=stat(l);return `<tr><td>${l[1]} (${l[2]||'—'})</td>${l[5].map(n=>`<td class="${n<l[3]||n>l[4]?'bad':''}">${n}${n<l[3]||n>l[4]?' ⚑':''}</td>`).join('')}<td>${l[3]}–${l[4]}</td><td>${t}</td></tr>`}).join('')}</table></div>`).join('')}
 ${approved('Bilans').length?`<div class="card"><h3>Documents de bilans approuvés</h3>${approved('Bilans').map(s=>`<p>${s.date} – ${esc(s.title)} <span class="mut">(${esc(s.file)}, revu par ${dn(s.by).n})</span></p>`).join('')}</div>`:''}`}
function t3(){if(P!==DEMO)return emp('Aucun médecin assigné à ce patient.');return `<div class="grid">${DOCS.map(d=>{const pr=DB.subs.filter(s=>s.docs.includes(d.id)&&s.st==='Pending Review').length;const meds=P.meds.filter(m=>m[4]===d.id);const ob=DB.obs.filter(o=>o.d===d.id&&(o.pid||'amine')==='amine'&&S.asDoc);return `<div class="card"><div class="row">${av(d)}<div><h3 style="margin:0">${d.n}</h3><span class="mut">${d.sp}</span></div></div><p>${d.role}</p>${P.appts.filter(a=>a[2]===d.id).map(a=>`<p>📅 ${a[0]} – ${a[1]}</p>`).join('')}<p><b>Historique :</b></p>${(P.past[d.id]||[]).map(x=>`<p class="mut">${x[0]} – ${x[1]}</p>`).join('')}${ob.map(o=>`<p>📝 <b>${o.date}</b> – ${esc(o.t)}</p>`).join('')}${S.asDoc?`<p><b>Médicaments :</b></p>${meds.map(m=>`<p class="mut">${m[0]} ${m[1]}, ${m[2]}, ${m[3]}</p>`).join('')}`:''}</div>`}).join('')}</div>`}
function t4(){const d=P===DEMO,pid=P.id||'amine',obs=DB.obs.filter(o=>(o.pid||'amine')===pid),rxs=(DB.rx||[]).filter(r=>r.pid===pid),lo=d?LABS.filter(x=>x[5][2]<x[3]||x[5][2]>x[4]).map(x=>x[1]):[];
return `${d?revCard():''}<div class="grid"><div class="card"><h3>Constantes récentes</h3>${d?'<p>Tension 13/8 · FC 68 bpm · SpO₂ 98 %</p><p>84 kg · 1,76 m · IMC 27,1</p><p class="mut">Valeurs fictives.</p>':'<p class="mut">Aucune constante enregistrée.</p>'}</div><div class="card"><h3>Points d'attention (médecin)</h3>${d?`<p class="bad">Hors référence : ${lo.join(', ')}</p><p>Allergie : ${P.allergies.join(', ')}, éviter les pénicillines.</p><p class="mut">Informations manquantes : HbA1c, ECG récent.</p>`:'<p class="mut">Dossier incomplet : ajoutez vos observations.</p>'}</div></div><div class="card"><h3>Observations médicales</h3><form onsubmit="ob(event)"><label for="ot">Nouvelle observation</label><textarea id="ot" rows="3"></textarea><p id="oe" class="bad" role="alert"></p><button class="btn s">Enregistrer</button></form>${obs.length?obs.map(o=>`<p><b>${o.date}</b> – ${esc(o.t)}</p>`).join(''):'<p class="mut">Aucune observation.</p>'}</div><div class="card"><h3>Prescriptions</h3><form onsubmit="rx(event)"><div class="grid"><div><label for="rn">Médicament</label><input id="rn"></div><div><label for="rd">Dosage</label><input id="rd"></div><div><label for="rf">Fréquence</label><input id="rf"></div><div><label for="ru">Durée</label><input id="ru"></div></div><p id="rer" class="bad" role="alert"></p><button class="btn s">Ajouter</button></form>${rxs.length?rxs.map(r=>`<p>${r.date} – <b>${esc(r.n)}</b> ${esc(r.d)}, ${esc(r.f)}, ${esc(r.u)}</p>`).join(''):'<p class="mut">Aucune prescription ajoutée.</p>'}</div>`}
function pick(el){const f=el.files[0],v=$('#upv');if(!f){v.innerHTML='';return}
 const t=$('#ut');if(!t.value)t.value=f.name.replace(/\.[^.]+$/,'').replace(/[_-]+/g,' ');
 const pdf=f.type==='application/pdf'||/\.pdf$/i.test(f.name);
 v.innerHTML=pdf?`<p class="mut">📄 ${esc(f.name)} · ${fsz(f.size)}</p>`:/^image\/(png|jpe?g|webp|gif)$/.test(f.type)?`<img src="${URL.createObjectURL(f)}" alt="Aperçu" style="max-height:140px;max-width:100%;border-radius:10px;margin-top:.5rem"><p class="mut">${esc(f.name)} · ${fsz(f.size)}</p>`:'<p class="bad">Format non pris en charge.</p>'}
async function up(e){e.preventDefault();const f=$('#uf').files[0],t=$('#ut').value.trim(),a=[...document.querySelectorAll('[name=ad]:checked')].map(x=>x.value),er=$('#ue');
 if(!f)return er.textContent='Choisissez un fichier PDF ou image.';
 const pdf=f.type==='application/pdf'||/\.pdf$/i.test(f.name);
 if(!pdf&&!/^image\/(png|jpe?g|webp|gif)$/.test(f.type))return er.textContent='Format non pris en charge (PDF, JPG, PNG, WebP).';
 if(f.size>15*1048576)return er.textContent='Fichier trop volumineux (15 Mo maximum).';
 if(!t)return er.textContent='Ajoutez un titre.';if(!a.length)return er.textContent='Sélectionnez au moins un médecin.';
 const blob=pdf&&f.type!=='application/pdf'?f.slice(0,f.size,'application/pdf'):f,id='s'+Date.now();
 FU[id]=URL.createObjectURL(blob);const saved=await IDBF.put(id,blob);
 DB.subs.unshift({id,pid:'amine',title:t,cat:'Imagerie',it:$('#uy').value,rg:$('#ur').value.trim(),date:$('#ud').value||'2026-10-11',desc:$('#ux').value.trim(),file:f.name,ft:blob.type,size:f.size,img:null,docs:a,st:'Pending Review',by:null,rd:null,cm:'',log:[]});
 if(a.includes('c'))notify('d','Nouveau document à revoir : '+t);save();S.upOpen=false;toast(saved?'Imagerie envoyée pour revue':'Imagerie envoyée (non conservée après fermeture de la page)');render()}
function review(id){const s=DB.subs.find(x=>x.id===id);modal(`<h3>Revue : ${esc(s.title)}</h3><p class="mut">${s.it||s.cat} · ${s.date} · ${esc(s.file)}</p><p>${esc(s.desc)||'Pas de description.'}</p>${prev(s)}<label for="rc">Commentaire (obligatoire pour refuser ou demander des précisions)</label><textarea id="rc" rows="3"></textarea><p id="re" class="bad" role="alert"></p><div class="row"><button class="btn" onclick="dec('${id}','Approved')">Approve</button><button class="btn r" onclick="dec('${id}','Rejected')">Reject</button><button class="btn g" onclick="dec('${id}','Clarification Requested')">Request clarification</button></div>`)}
function dec(id,st){const s=DB.subs.find(x=>x.id===id),c=$('#rc').value.trim();if(st!=='Approved'&&!c)return $('#re').textContent='Ajoutez un commentaire.';
 if(!s.docs.includes('c'))return;Object.assign(s,{st,by:'c',rd:'2026-10-11',cm:c});save();notify('p',`Dr Mansour : « ${s.title} » – ${st}`);modal();toast(st);render()}
function reply(id){const s=DB.subs.find(x=>x.id===id);modal(`<h3>Répondre à la demande</h3><p>${esc(s.cm)}</p><label for="rr">Votre réponse</label><textarea id="rr" rows="3"></textarea><p id="rer" class="bad" role="alert"></p><button class="btn" onclick="(function(){const v=$('#rr').value.trim();if(!v)return $('#rer').textContent='Écrivez une réponse.';s=DB.subs.find(x=>x.id==='${id}');s.log.push('Réponse du patient : '+v);s.st='Pending Review';notify('d','Réponse du patient pour : '+s.title);save();modal();render()})()">Envoyer</button>`)}
function ob(e){e.preventDefault();const t=$('#ot').value.trim();if(!t)return $('#oe').textContent='Saisissez une observation.';DB.obs.unshift({d:'c',pid:P.id||'amine',t,date:'2026-10-11'});save();toast('Observation enregistrée');render()}
function render(){const v={land,plogin,dlogin,doc,pat}[S.v];$('#app').innerHTML=topbar()+v();}
// ---- file store: uploaded files live in IndexedDB (metadata stays in localStorage) ----
const FU={};
const IDBF={db:null,
 open(){return this.db||(this.db=new Promise(r=>{try{const q=indexedDB.open('mc_files',1);q.onupgradeneeded=()=>q.result.createObjectStore('f');q.onsuccess=()=>r(q.result);q.onerror=q.onblocked=()=>r(null)}catch(e){r(null)}}))},
 async put(id,b){const db=await this.open();if(!db)return false;return new Promise(r=>{try{const t=db.transaction('f','readwrite');t.objectStore('f').put(b,id);t.oncomplete=()=>r(true);t.onerror=t.onabort=()=>r(false)}catch(e){r(false)}})},
 async del(id){const db=await this.open();if(!db)return;try{db.transaction('f','readwrite').objectStore('f').delete(id)}catch(e){}},
 async all(){const db=await this.open();if(!db)return{};return new Promise(r=>{const o={};try{const c=db.transaction('f').objectStore('f').openCursor();c.onsuccess=()=>{const k=c.result;if(k){o[k.key]=k.value;k.continue()}else r(o)};c.onerror=()=>r(o)}catch(e){r(o)}})}};
// ---- i18n : fr / en / ar (Arabic switches the page to right-to-left) ----
// Source strings in the code are French (plus a few English labels). Every text node / aria-label / alt
// that appears in the DOM is translated on the fly by a MutationObserver, so new UI text only needs a row in ROWS.
const LANGS={fr:'Français',en:'English',ar:'العربية'};
let LANG='fr';try{const l=localStorage.getItem('mc_lang');if(LANGS[l])LANG=l}catch(e){}
const LI={fr:0,en:1,ar:2};
// [français, English, العربية, (optional) original English label used in the source]
const ROWS=[
// ----- app shell / landing -----
["MedCard – Dossier médical NFC (démo)","MedCard – NFC medical record (demo)","MedCard – الملف الطبي عبر NFC (عرض تجريبي)"],
["Démo – données fictives","Demo – fictional data","عرض تجريبي – بيانات وهمية"],
["Langue","Language","اللغة"],
["Portail médecin","Doctor Portal","بوابة الطبيب","Doctor Portal"],
["Portail patient","Patient Portal","بوابة المريض","Patient Portal"],
["Essayer la démo","Try Demo","جرّب العرض التجريبي","Try Demo"],
["Tout votre dossier médical, à portée d’une carte.","Your whole medical record, one card away.","ملفك الطبي كاملاً في بطاقة واحدة."],
["Imagerie, bilans et traitements réunis en un seul endroit. Le patient se connecte avec sa carte NFC ; le médecin l’approche pour ouvrir le dossier.","Imaging, lab results and treatments in one place. Patients sign in with their NFC card; doctors tap it to open the record.","التصوير الطبي والتحاليل والعلاجات في مكان واحد. يسجّل المريض دخوله ببطاقة NFC، ويقرّبها الطبيب لفتح الملف."],
["identifiants de démonstration","demo credentials","بيانات دخول تجريبية"],
["Médecin","Doctor","الطبيب"],
["E-mail :","Email:","البريد الإلكتروني:"],
["E-mail","Email","البريد الإلكتروني"],
["Mot de passe :","Password:","كلمة المرور:"],
["Mot de passe","Password","كلمة المرور"],
["Ouvrir le portail médecin","Open the doctor portal","فتح بوابة الطبيب"],
["Patient","Patient","المريض"],
["CIN :","CIN:","رقم بطاقة التعريف (CIN):"],
["CIN","CIN","رقم بطاقة التعريف"],
["CIN (8 chiffres)","CIN (8 digits)","رقم بطاقة التعريف (8 أرقام)"],
["Ouvrir le portail patient","Open the patient portal","فتح بوابة المريض"],
["Ces comptes et ces données sont fictifs. Ils ne donnent accès à aucun vrai dossier.","These accounts and data are fictional. They do not give access to any real record.","هذه الحسابات والبيانات وهمية ولا تتيح الوصول إلى أي ملف حقيقي."],
["Comment ça marche","How it works","كيف يعمل؟"],
["Obtenir sa carte","Get your card","الحصول على البطاقة"],
["Le patient reçoit sa carte NFC, son CIN et un mot de passe lors de l’ouverture de son dossier auprès d’un établissement partenaire.","The patient receives an NFC card, a CIN and a password when their record is opened at a partner facility.","يتسلّم المريض بطاقة NFC ورقم بطاقة التعريف وكلمة مرور عند فتح ملفه لدى مؤسسة شريكة."],
["Se connecter","Sign in","تسجيل الدخول"],
["Le patient scanne sa carte, puis saisit son CIN et son mot de passe. Sans carte valide, le formulaire reste bloqué.","The patient scans their card, then enters their CIN and password. Without a valid card, the form stays locked.","يمسح المريض بطاقته ثم يُدخل رقم بطاقة التعريف وكلمة المرور. وبدون بطاقة صالحة يبقى النموذج مقفلاً."],
["Consulter les soins","Consult the record","الاطلاع على الملف"],
["Le médecin scanne la carte du patient et ouvre directement le dossier complet, sans CIN ni mot de passe.","The doctor scans the patient’s card and opens the full record directly, with no CIN or password.","يمسح الطبيب بطاقة المريض ويفتح الملف الكامل مباشرة، دون رقم بطاقة التعريف أو كلمة مرور."],
["Suivre ses soins","Follow your care","متابعة الرعاية"],
["Le patient consulte ses informations, ses imageries, ses bilans, ses médecins et ses rendez-vous.","The patient views their information, imaging, lab results, doctors and appointments.","يطّلع المريض على معلوماته وصور التصوير الطبي والتحاليل وأطبائه ومواعيده."],
["Aucune carte n’est en vente via ce site : il s’agit d’une démonstration.","No card is sold through this site: this is a demonstration.","لا تُباع أي بطاقة عبر هذا الموقع: إنه مجرد عرض تجريبي."],
["Questions fréquentes","Frequently asked questions","الأسئلة الشائعة"],
["La carte seule suffit-elle à accéder à un dossier ?","Is the card alone enough to access a record?","هل تكفي البطاقة وحدها للوصول إلى الملف؟"],
["Non. En production, la possession de la carte n’est jamais une preuve d’identité suffisante : le serveur vérifie aussi l’authentification, les droits et journalise chaque accès.","No. In production, possessing the card is never sufficient proof of identity: the server also checks authentication and permissions, and logs every access.","لا. في بيئة الإنتاج لا تُعدّ حيازة البطاقة إثباتاً كافياً للهوية أبداً: إذ يتحقق الخادم أيضاً من المصادقة والصلاحيات ويسجّل كل عملية دخول."],
["Ce site est-il connecté à un vrai lecteur NFC ?","Is this site connected to a real NFC reader?","هل هذا الموقع مرتبط بقارئ NFC حقيقي؟"],
["Non, le scan est simulé. Le module NFC est isolé pour brancher plus tard un lecteur compatible.","No, the scan is simulated. The NFC module is isolated so a compatible reader can be plugged in later.","لا، المسح محاكى. وحدة NFC معزولة ليمكن ربط قارئ متوافق لاحقاً."],
["Les résumés IA sont-ils fiables ?","Are the AI summaries reliable?","هل ملخصات الذكاء الاصطناعي موثوقة؟"],
["Ils sont simulés ici, construits uniquement à partir des données du dossier, signalent les informations manquantes et ne posent aucun diagnostic.","They are simulated here, built only from the record’s data, flag missing information and make no diagnosis.","هي هنا محاكاة، تُبنى فقط على بيانات الملف، وتنبّه إلى المعلومات الناقصة، ولا تضع أي تشخيص."],
["Que faut-il côté serveur ?","What is needed on the server side?","ماذا يلزم من جهة الخادم؟"],
["Authentification et autorisations serveur, chiffrement en transit et au repos, sessions sécurisées, journaux d’audit. Rien de cela n’existe dans cette démo.","Server-side authentication and authorization, encryption in transit and at rest, secure sessions, audit logs. None of this exists in this demo.","مصادقة وصلاحيات من جهة الخادم، وتشفير أثناء النقل وعند التخزين، وجلسات آمنة، وسجلات تدقيق. لا شيء من ذلك موجود في هذا العرض."],
// ----- login -----
["1. Carte NFC","1. NFC card","1. بطاقة NFC"],
["En attente","Waiting","في الانتظار"],
["Scanner ma carte","Scan my card","مسح بطاقتي"],
["Scanner à nouveau","Scan again","المسح من جديد"],
["2. Identifiants","2. Credentials","2. بيانات الدخول"],
["Le formulaire est désactivé tant qu’aucune carte valide n’a été détectée.","The form is disabled until a valid card has been detected.","النموذج معطّل إلى أن يتم اكتشاف بطاقة صالحة."],
["Démo : CIN 12345678 · mot de passe Patient123!","Demo: CIN 12345678 · password Patient123!","عرض تجريبي: رقم بطاقة التعريف \u206612345678\u2069 · كلمة المرور \u2066Patient123!\u2069"],
["Démo : doctor@medcard.demo · Doctor123!","Demo: doctor@medcard.demo · Doctor123!","عرض تجريبي: \u2066doctor@medcard.demo\u2069 · \u2066Doctor123!\u2069"],
["CIN ou mot de passe incorrect, ou carte non associée à ce CIN.","Incorrect CIN or password, or card not linked to this CIN.","رقم بطاقة التعريف أو كلمة المرور غير صحيحة، أو أن البطاقة غير مرتبطة بهذا الرقم."],
["E-mail ou mot de passe incorrect.","Incorrect email or password.","البريد الإلكتروني أو كلمة المرور غير صحيحة."],
["Lecture de la carte NFC","Reading the NFC card","قراءة بطاقة NFC"],
["Simulation de démonstration : aucun lecteur matériel n’est connecté. En production, ce module appelle un lecteur NFC réel et le serveur valide la carte.","Demo simulation: no hardware reader is connected. In production, this module calls a real NFC reader and the server validates the card.","محاكاة تجريبية: لا يوجد أي قارئ فعلي متصل. في بيئة الإنتاج تستدعي هذه الوحدة قارئ NFC حقيقياً ويتحقق الخادم من البطاقة."],
["Prêt à scanner","Ready to scan","جاهز للمسح"],
["Analyse en cours…","Scanning…","جارٍ التحليل…"],
["Simuler une carte enregistrée","Simulate a registered card","محاكاة بطاقة مسجّلة"],
["Simuler une carte inconnue","Simulate an unknown card","محاكاة بطاقة غير معروفة"],
["Fermer","Close","إغلاق"],
["Échec de la vérification : carte non enregistrée","Verification failed: card not registered","فشل التحقق: البطاقة غير مسجّلة"],
["Carte vérifiée","Card verified","تم التحقق من البطاقة"],
// ----- top bar / navigation -----
["Notifications","Notifications","الإشعارات"],
["Déconnexion","Log out","تسجيل الخروج"],
["Sections","Sections","الأقسام"],
["Informations générales","General information","معلومات عامة"],
["Imagerie médicale","Medical imaging","التصوير الطبي"],
["Bilans médicaux","Lab results","التحاليل الطبية"],
["Mes médecins","My doctors","أطبائي"],
["Espace médecin","Doctor area","فضاء الطبيب"],
["simulées","simulated","محاكاة"],
["Rien de nouveau pour le moment.","Nothing new for now.","لا جديد حالياً."],
// ----- people -----
["Amine Ben Salah","Amine Ben Salah","أمين بن صالح"],
["Salma Ben Salah (épouse) – +216 20 000 000","Salma Ben Salah (wife) – +216 20 000 000","سلمى بن صالح (الزوجة) – \u2066+216 20 000 000\u2069"],
["Marie Dupont","Marie Dupont","ماري دوبون"],
["Youssef Gharbi","Youssef Gharbi","يوسف الغربي"],
["Dr Leila Mansour","Dr Leila Mansour","د. ليلى منصور"],
["Dr Karim Trabelsi","Dr Karim Trabelsi","د. كريم الطرابلسي"],
["Dr Sana Haddad","Dr Sana Haddad","د. سناء حداد"],
["Dr Omar Jaziri","Dr Omar Jaziri","د. عمر الجزيري"],
["Dr Mansour","Dr Mansour","د. منصور"],
["Cardiologie","Cardiology","أمراض القلب"],
["Médecine générale","General medicine","الطب العام"],
["Radiologie","Radiology","الأشعة"],
["Endocrinologie","Endocrinology","الغدد الصماء"],
["Suivi cardiaque après angioplastie","Cardiac follow-up after angioplasty","متابعة القلب بعد رأب الشريان"],
["Médecin traitant, coordination des soins","Primary care physician, care coordination","الطبيب المعالج وتنسيق الرعاية"],
["Interprétation des examens d’imagerie","Interpretation of imaging exams","قراءة فحوصات التصوير الطبي"],
["Prise en charge du diabète de type 2","Management of type 2 diabetes","علاج السكري من النوع 2"],
["Historique :","History:","السجل:"],
// ----- general information tab -----
["Identité","Identity","الهوية"],
["Homme","Male","ذكر"],["Femme","Female","أنثى"],
["Contact d’urgence :","Emergency contact:","جهة الاتصال في الطوارئ:"],
["Alertes","Alerts","تنبيهات"],
["Allergie à la pénicilline","Penicillin allergy","حساسية من البنسلين"],
["LDL au-dessus de la cible (1,35 g/L)","LDL above target (1.35 g/L)","مستوى LDL أعلى من الهدف (\u20661.35 g/L\u2069)"],
["Protéinurie en hausse sur 3 contrôles","Proteinuria rising over 3 checks","ارتفاع البروتين في البول خلال 3 فحوصات"],
["Pathologies chroniques","Chronic conditions","الأمراض المزمنة"],
["Hypertension artérielle","Hypertension","ارتفاع ضغط الدم الشرياني"],
["hypertension artérielle","hypertension","ارتفاع ضغط الدم الشرياني"],
["Diabète de type 2","Type 2 diabetes","السكري من النوع 2"],
["diabète de type 2","type 2 diabetes","السكري من النوع 2"],
["Allergies","Allergies","الحساسية"],
["Pénicilline","Penicillin","البنسلين"],
["Résumé IA (simulé)","AI summary (simulated)","ملخص الذكاء الاصطناعي (محاكى)"],
["Médicaments actuels","Current medications","الأدوية الحالية"],
["En continu","Ongoing","بشكل متواصل"],
["à réévaluer","to be reassessed","مع إعادة التقييم"],
["6 mois, à réévaluer","6 months, to be reassessed","6 أشهر مع إعادة التقييم"],
["12 mois après stent","12 months after stent","12 شهراً بعد الدعامة"],
["À définir","To be defined","يحدَّد لاحقاً"],
["Antécédents","Medical history","السوابق المرضية"],
["Diagnostic du diabète de type 2","Type 2 diabetes diagnosed","تشخيص السكري من النوع 2"],
["Angioplastie coronaire (1 stent)","Coronary angioplasty (1 stent)","رأب الشريان التاجي (دعامة واحدة)"],
["Début de l’hypertension traitée","Treated hypertension begins","بداية علاج ارتفاع ضغط الدم"],
["Prochains rendez-vous","Upcoming appointments","المواعيد القادمة"],
["Contrôle cardiologique","Cardiology check-up","فحص دوري للقلب"],
["Bilan diabète + HbA1c","Diabetes check-up + HbA1c","فحص السكري + HbA1c"],
["Activité récente","Recent activity","النشاط الأخير"],
["Fatigue légère, bilan sanguin prescrit.","Mild fatigue, blood tests prescribed.","تعب خفيف، وُصفت تحاليل الدم."],
["Échographie cardiaque : fonction VG conservée. Poursuivre le traitement.","Cardiac ultrasound: LV function preserved. Continue treatment.","إيكو القلب: وظيفة البطين الأيسر محفوظة. مواصلة العلاج."],
["Glycémie en amélioration, maintenir la metformine.","Blood sugar improving, continue metformin.","تحسّن سكر الدم، مواصلة تناول الميتفورمين."],
["IRM cérébrale : pas d’anomalie aiguë décrite.","Brain MRI: no acute abnormality described.","رنين مغناطيسي للدماغ: لا شذوذ حاد مذكور."],
["Tension à 14/8, ajustement du bisoprolol.","Blood pressure 14/8, bisoprolol adjusted.","الضغط 14/8، تعديل جرعة البيسوبرولول."],
// ----- imaging tab -----
["Déposer une imagerie","Upload an imaging study","رفع فحص تصوير طبي"],
["Fichier (PDF ou image)","File (PDF or image)","الملف (PDF أو صورة)"],
["Titre","Title","العنوان"],
["Type d’examen","Exam type","نوع الفحص"],
["IRM","MRI","الرنين المغناطيسي"],
["Scanner","CT scan","الأشعة المقطعية"],
["Radio","X-ray","الأشعة السينية"],
["Échographie","Ultrasound","الموجات فوق الصوتية"],
["Autre","Other","أخرى"],
["Région (facultatif)","Body area (optional)","المنطقة (اختياري)"],
["Date de l’examen","Exam date","تاريخ الفحص"],
["Description (facultatif)","Description (optional)","الوصف (اختياري)"],
["Médecins destinataires","Recipient doctors","الأطباء المستلمون"],
["Démo : le fichier reste sur cet appareil et seul le Dr Mansour peut valider. Il apparaît dans votre dossier après validation.","Demo: the file stays on this device and only Dr Mansour can approve it. It appears in your record once approved.","عرض تجريبي: يبقى الملف على هذا الجهاز ولا يمكن إلا للدكتور منصور الموافقة عليه. يظهر في ملفك بعد الموافقة."],
["Envoyer pour revue","Submit for review","إرسال للمراجعة"],
["Images de démonstration : placeholders synthétiques, aucune donnée de patient réel. Pour de vraies images, utiliser des sources libres avec attribution.","Demo images: synthetic placeholders, no real patient data. For real images, use free sources with attribution.","صور تجريبية: نماذج اصطناعية دون أي بيانات لمريض حقيقي. للحصول على صور حقيقية استخدم مصادر حرة مع الإشارة إلى المصدر."],
["Type","Type","النوع"],
["Tous","All","الكل"],
["Agrandir","Enlarge","تكبير"],
["Cœur","Heart","القلب"],["Cerveau","Brain","الدماغ"],["Thorax","Chest","الصدر"],
["Aucun examen pour ce filtre.","No exams match this filter.","لا توجد فحوصات تطابق هذا الفلتر."],
["Zoom","Zoom","تقريب"],
["Date :","Date:","التاريخ:"],["Région :","Body area:","المنطقة:"],
["Radiologue :","Radiologist:","طبيب الأشعة:"],["Demandé par :","Requested by:","بطلب من:"],["Rapport :","Report:","التقرير:"],
["Déposé par :","Uploaded by:","رُفع بواسطة:"],["le patient","the patient","المريض"],["Validé par :","Approved by:","تمت الموافقة بواسطة:"],
["IRM cérébrale sans injection : pas de lésion ischémique récente décrite.","Brain MRI without contrast: no recent ischemic lesion described.","رنين مغناطيسي للدماغ دون حقن: لا آفة إقفارية حديثة مذكورة."],
["Scanner thoracique : parenchyme pulmonaire sans nodule suspect.","Chest CT: lung parenchyma without suspicious nodule.","أشعة مقطعية للصدر: نسيج رئوي دون عقيدات مشبوهة."],
["Radiographie thoracique de face : silhouette cardiaque normale.","Frontal chest X-ray: normal cardiac silhouette.","أشعة سينية للصدر من الأمام: ظل قلبي طبيعي."],
["Échographie cardiaque : fonction ventriculaire gauche conservée.","Cardiac ultrasound: left ventricular function preserved.","إيكو القلب: وظيفة البطين الأيسر محفوظة."],
["Document approuvé.","Approved document.","مستند معتمد."],
// ----- uploads -----
["Choisissez un fichier PDF ou image.","Choose a PDF or image file.","اختر ملف PDF أو صورة."],
["Format non pris en charge.","Unsupported format.","الصيغة غير مدعومة."],
["Format non pris en charge (PDF, JPG, PNG, WebP).","Unsupported format (PDF, JPG, PNG, WebP).","الصيغة غير مدعومة (PDF وJPG وPNG وWebP)."],
["Fichier trop volumineux (15 Mo maximum).","File too large (15 MB maximum).","الملف كبير جداً (الحد الأقصى 15 ميغابايت)."],
["Aperçu","Preview","معاينة"],
["Ajoutez un titre.","Add a title.","أضف عنواناً."],
["Sélectionnez au moins un médecin.","Select at least one doctor.","اختر طبيباً واحداً على الأقل."],
["Mes dépôts en cours","My pending uploads","ملفاتي قيد المتابعة"],
["Voir","View","عرض"],
["Retirer","Remove","إزالة"],
["Retirer ce dépôt ?","Remove this upload?","هل تريد إزالة هذا الملف؟"],
["Dépôt retiré","Upload removed","تمت إزالة الملف"],
["Imagerie envoyée pour revue","Imaging sent for review","تم إرسال الفحص للمراجعة"],
["Imagerie envoyée (non conservée après fermeture de la page)","Imaging sent (not kept after the page is closed)","تم إرسال الفحص (لن يُحفظ بعد إغلاق الصفحة)"],
["Ouvrir le PDF dans un nouvel onglet","Open the PDF in a new tab","فتح ملف PDF في تبويب جديد"],
["Aperçu non disponible (fichier non conservé dans cette démo).","Preview unavailable (file not kept in this demo).","المعاينة غير متاحة (الملف غير محفوظ في هذا العرض)."],
["Imagerie","Imaging","التصوير الطبي"],
["Bilans","Lab results","التحاليل"],
["Documents de bilans approuvés","Approved lab documents","مستندات التحاليل المعتمدة"],
["Documents déposés par le patient","Documents uploaded by the patient","مستندات رفعها المريض"],
["Aucun document déposé.","No documents uploaded.","لا توجد مستندات مرفوعة."],
["Ouvrir la revue","Open review","فتح المراجعة"],
["Bilan lipidique externe","External lipid panel","تحليل دهون خارجي"],
["Bilan réalisé en laboratoire privé.","Test carried out at a private laboratory.","تحليل أُجري في مخبر خاص."],
["En attente de revue","Pending review","قيد المراجعة","Pending Review"],
["Approuvé","Approved","تمت الموافقة","Approved"],
["Refusé","Rejected","مرفوض","Rejected"],
["Précisions demandées","Clarification requested","مطلوب توضيح","Clarification Requested"],
["Approuver","Approve","موافقة","Approve"],
["Refuser","Reject","رفض","Reject"],
["Demander des précisions","Request clarification","طلب توضيح","Request clarification"],
// ----- lab results -----
["Résultats fictifs à titre de démonstration. Les valeurs hors plage sont signalées, sans diagnostic.","Fictional results for demonstration only. Out-of-range values are flagged, with no diagnosis.","نتائج وهمية لغرض العرض فقط. تُعلَّم القيم الخارجة عن المجال دون أي تشخيص."],
["Évolution","Progress over time","التطور عبر الزمن"],
["Paramètre","Parameter","المؤشر"],
["Hémoglobine","Hemoglobin","الهيموغلوبين"],
["Leucocytes","White blood cells","الكريات البيضاء"],
["Plaquettes","Platelets","الصفيحات الدموية"],
["Glycémie à jeun","Fasting glucose","سكر الدم الصائم"],
["LDL-cholestérol","LDL cholesterol","الكوليسترول LDL"],
["Créatinine","Creatinine","الكرياتينين"],
["Protéines","Protein","البروتين"],
["Glucose urinaire","Urine glucose","سكر البول"],
["Bilan sanguin","Blood panel","التحليل الدموي"],
["Bilan urinaire","Urine panel","تحليل البول"],
["Référence","Reference","المرجع"],
["Tendance","Trend","الاتجاه"],
["↓ en baisse","↓ decreasing","↓ في انخفاض"],
["→ stable","→ stable","→ مستقر"],
["↑ en hausse","↑ increasing","↑ في ارتفاع"],
// ----- doctor portal -----
["Bonjour Dr Mansour","Hello Dr Mansour","مرحباً د. منصور"],
["+ Ajouter un patient","+ Add a patient","+ إضافة مريض"],
["Ajouter un patient","Add a patient","إضافة مريض"],
["Rechercher un patient","Search for a patient","البحث عن مريض"],
["Sans scan NFC, seules les informations générales et un résumé limité sont visibles. Le dossier complet s’ouvre au scan de la carte (simulée).","Without an NFC scan, only general information and a limited summary are visible. The full record opens when the card is scanned (simulated).","دون مسح بطاقة NFC لا تظهر سوى المعلومات العامة وملخص محدود. يُفتح الملف الكامل عند مسح البطاقة (محاكاة)."],
["Pathologies :","Conditions:","الأمراض:"],["Allergies :","Allergies:","الحساسية:"],["Traitement :","Treatment:","العلاج:"],["Alerte :","Alert:","تنبيه:"],
["Scanner la carte NFC","Scan the NFC card","مسح بطاقة NFC"],
["Insuffisance cardiaque légère","Mild heart failure","قصور قلبي خفيف"],
["Aucune connue","None known","لا شيء معروف"],
["Poids à surveiller","Monitor weight","مراقبة الوزن"],
["Asthme","Asthma","الربو"],
["Acariens","Dust mites","عث الغبار"],["pollen","Pollen","حبوب اللقاح"],
["Salbutamol à la demande","Salbutamol as needed","سالبوتامول عند الحاجة"],
["Aucune alerte","No alerts","لا توجد تنبيهات"],
["Données limitées sans scan de la carte. Dossier détaillé non disponible : informations manquantes.","Limited data without a card scan. Detailed record unavailable: missing information.","بيانات محدودة دون مسح البطاقة. الملف التفصيلي غير متاح: معلومات ناقصة."],
["Aucun patient ne correspond à cette recherche.","No patient matches this search.","لا يوجد مريض يطابق هذا البحث."],
["Nom complet","Full name","الاسم الكامل"],["Âge","Age","العمر"],["Pathologies","Conditions","الأمراض"],["Traitement","Treatment","العلاج"],
["Ajouter","Add","إضافة"],["Annuler","Cancel","إلغاء"],
["Nom, âge et CIN à 8 chiffres sont obligatoires.","Name, age and an 8-digit CIN are required.","الاسم والعمر ورقم بطاقة التعريف المكوّن من 8 أرقام حقول إلزامية."],
["Non renseigné","Not provided","غير مذكور"],
["Inconnu","Unknown","غير معروف"],
["Nouveau dossier – informations à compléter","New record – information to complete","ملف جديد – معلومات يجب استكمالها"],
["Patient ajouté – carte NFC simulée enregistrée","Patient added – simulated NFC card registered","تمت إضافة المريض – تم تسجيل بطاقة NFC المحاكاة"],
["Dossier complet ouvert par scan NFC · permissions médecin actives (Dr Mansour)","Full record opened by NFC scan · doctor permissions active (Dr Mansour)","تم فتح الملف الكامل عبر مسح NFC · صلاحيات الطبيب مفعّلة (د. منصور)"],
["Fermer le dossier","Close record","إغلاق الملف"],
["Données insuffisantes : aucun bilan, imagerie ni historique enregistré. Aucun diagnostic proposé.","Insufficient data: no lab results, imaging or history recorded. No diagnosis offered.","بيانات غير كافية: لا توجد تحاليل أو صور تصوير أو سجل مسجّل. لا يُقترح أي تشخيص."],
["Aucun examen d'imagerie enregistré pour ce patient.","No imaging exam recorded for this patient.","لا يوجد أي فحص تصوير مسجّل لهذا المريض."],
["Aucun bilan enregistré pour ce patient.","No lab results recorded for this patient.","لا توجد تحاليل مسجّلة لهذا المريض."],
["Aucun médecin assigné à ce patient.","No doctor assigned to this patient.","لا يوجد طبيب مُعيَّن لهذا المريض."],
["Constantes récentes","Recent vital signs","المؤشرات الحيوية الأخيرة"],
["Tension 13/8 · FC 68 bpm · SpO₂ 98 %","Blood pressure 13/8 · HR 68 bpm · SpO₂ 98 %","الضغط 13/8 · النبض \u206668 bpm\u2069 · SpO₂ \u206698 %\u2069"],
["84 kg · 1,76 m · IMC 27,1","84 kg · 1.76 m · BMI 27.1","\u206684 kg\u2069 · \u20661,76 m\u2069 · مؤشر كتلة الجسم 27,1"],
["Valeurs fictives.","Fictional values.","قيم وهمية."],
["Aucune constante enregistrée.","No vital signs recorded.","لا توجد مؤشرات حيوية مسجّلة."],
["Points d'attention (médecin)","Points of attention (doctor)","نقاط الانتباه (للطبيب)"],
["Allergie : Pénicilline, éviter les pénicillines.","Allergy: Penicillin, avoid penicillins.","حساسية: البنسلين، تجنّب مشتقات البنسلين."],
["Informations manquantes : HbA1c, ECG récent.","Missing information: HbA1c, recent ECG.","معلومات ناقصة: HbA1c، تخطيط قلب حديث."],
["Dossier incomplet : ajoutez vos observations.","Incomplete record: add your observations.","ملف غير مكتمل: أضف ملاحظاتك."],
["Observations médicales","Medical observations","الملاحظات الطبية"],
["Nouvelle observation","New observation","ملاحظة جديدة"],
["Enregistrer","Save","حفظ"],
["Aucune observation.","No observations.","لا توجد ملاحظات."],
["Saisissez une observation.","Enter an observation.","أدخل ملاحظة."],
["Observation enregistrée","Observation saved","تم حفظ الملاحظة"],
["Prescriptions","Prescriptions","الوصفات الطبية"],
["Médicament","Medication","الدواء"],["Dosage","Dosage","الجرعة"],["Fréquence","Frequency","عدد المرات"],["Durée","Duration","المدة"],
["Aucune prescription ajoutée.","No prescription added.","لم تتم إضافة أي وصفة."],
["Renseignez médicament, dosage et fréquence.","Fill in medication, dosage and frequency.","أدخل الدواء والجرعة وعدد المرات."],
["Prescription ajoutée","Prescription added","تمت إضافة الوصفة"],
["Médicaments :","Medications:","الأدوية:"],
["Metformine","Metformin","ميتفورمين"],["Bisoprolol","Bisoprolol","بيسوبرولول"],["Atorvastatine","Atorvastatin","أتورفاستاتين"],["Aspirine","Aspirin","أسبرين"],["Furosémide","Furosemide","فوروسيميد"],["Salbutamol","Salbutamol","سالبوتامول"],
// ----- review workflow -----
["Pas de description.","No description.","لا يوجد وصف."],
["Commentaire (obligatoire pour refuser ou demander des précisions)","Comment (required to reject or request clarification)","تعليق (إلزامي عند الرفض أو طلب التوضيح)"],
["Ajoutez un commentaire.","Add a comment.","أضف تعليقاً."],
["Répondre","Reply","ردّ"],
["Répondre à la demande","Reply to the request","الردّ على الطلب"],
["Votre réponse","Your reply","ردّك"],
["Envoyer","Send","إرسال"],
["Écrivez une réponse.","Write a reply.","اكتب رداً."],
];

const MAP=new Map();ROWS.forEach(r=>{MAP.set(r[0],r);if(r[3])MAP.set(r[3],r)});
const norm=s=>s.replace(/\s+/g,' ').trim();
const RULES=[];
// R(regex, en, ar, fr): templates; $1 = raw capture, %1 = translated capture
const R=(re,en,ar,fr)=>RULES.push([re,m=>{const t={en,ar,fr}[LANG];if(t==null)return null;return typeof t==='function'?t(m):t.replace(/([$%])(\d)/g,(_,c,i)=>c==='$'?m[i]:trs(m[i]))}]);
// ---- dynamic strings (numbers, dates, names, free text slots) ----
const LRM2=s=>'\u2066'+s+'\u2069';
R(/^Étape (\d+)$/,'Step $1','الخطوة $1');
R(/^Carte vérifiée \((.+)\)$/,'Card verified ($1)',m=>'تم التحقق من البطاقة ('+LRM2(m[1])+')');
R(/^CIN (•.*)$/,'CIN $1',m=>'رقم بطاقة التعريف '+LRM2(m[1]));
R(/^(\d+) ans$/,'$1 years old',m=>m[1]+(+m[1]>10?' سنة':' سنوات'));
R(/^groupe (.+)$/,'blood group $1',m=>'فصيلة الدم '+LRM2(m[1]));
R(/^(\d+) fois\/jour(?: \((matin|soir)\))?$/,
  m=>{const n=+m[1],w=n===1?'once daily':n===2?'twice daily':n+' times daily';return w+(m[2]?' ('+(m[2]==='matin'?'morning':'evening')+')':'')},
  m=>{const n=+m[1],w=n===1?'مرة واحدة يومياً':n===2?'مرتان يومياً':n+' مرات يومياً';return w+(m[2]?' ('+(m[2]==='matin'?'صباحاً':'مساءً')+')':'')});
R(/^(\d+) mois$/,'$1 months',m=>m[1]+(+m[1]>10?' شهراً':' أشهر'));
R(/^(.+?) \((g\/dL|G\/L|g\/L|mg\/dL|—)\)$/,'%1 ($2)',m=>trs(m[1])+' ('+LRM2(m[2])+')');
R(/^(\S+) (\d+(?:[.,]\d+)?) (mg|g|ml)$/,'%1 $2 $3',m=>trs(m[1])+' '+LRM2(m[2]+' '+m[3]));
R(/^(.+?) ([\d.]+) (g\/dL|G\/L|g\/L|mg\/dL)$/,'%1 $2 $3',m=>trs(m[1])+' '+LRM2(m[2]+' '+m[3]));
R(/^Zone teintée : plage de référence (.+)$/,'Shaded area: reference range $1',m=>'المنطقة المظللة: المجال المرجعي '+LRM2(m[1]));
R(/^Courbe (.+)$/,'Chart: %1','منحنى %1');
R(/^Image synthétique (.+)$/,'Synthetic image: %1','صورة اصطناعية: %1');
R(/^PLACEHOLDER SYNTHÉTIQUE · (.+)$/,'SYNTHETIC PLACEHOLDER · %1','نموذج اصطناعي · %1');
R(/^(\d+) document\(s\) en attente de votre revue$/,'$1 document(s) awaiting your review','$1 مستند(ات) في انتظار مراجعتك');
R(/^Patient de (\d+) ans suivi pour (.+) et (.+), avec antécédent d’angioplastie en 2022\. Dernier bilan \((.+?)\) : valeurs hors référence – (.+)\. Tendance : LDL, glycémie et hémoglobine évoluent sur 3 dates\.$/,
  'Patient aged $1, followed for %2 and %3, with a history of angioplasty in 2022. Latest results ($4): out-of-range values – %5. Trend: LDL, blood sugar and hemoglobin changing over 3 dates.',
  'مريض عمره $1 سنة، يخضع للمتابعة بسبب %2 و%3، مع سوابق رأب الشريان التاجي سنة 2022. آخر تحاليل ($4): قيم خارج المجال المرجعي – %5. الاتجاه: LDL وسكر الدم والهيموغلوبين تتغير على مدى 3 تواريخ.');
R(/^Sources : dossier général, bilans du (.+)\. Information manquante : HbA1c, dernier ECG\. Ce résumé ne constitue pas un diagnostic\.$/,
  'Sources: general record, lab results of $1. Missing information: HbA1c, latest ECG. This summary is not a diagnosis.',
  m=>'المصادر: الملف العام، تحاليل بتواريخ '+m[1].replace(/, /g,'، ')+'. معلومات ناقصة: HbA1c، آخر تخطيط للقلب. هذا الملخص لا يُعدّ تشخيصاً.');
R(/^Hors référence : (.+)$/,'Out of range: %1','خارج المجال المرجعي: %1');
R(/^Revue : (.+)$/,'Review: $1','مراجعة: $1');
R(/^Revu par (Dr .+?) le (\d{4}-\d\d-\d\d)(?: : « ([\s\S]*) »)?$/,
  m=>'Reviewed by '+trs(m[1])+' on '+m[2]+(m[3]?': “'+m[3]+'”':''),
  m=>'راجعه '+trs(m[1])+' بتاريخ '+m[2]+(m[3]?': «'+m[3]+'»':''));
R(/^\((.+), revu par (.+)\)$/,'($1, reviewed by %2)','($1، راجعه %2)');
R(/^Nouveau document à revoir : ([\s\S]+)$/,'New document to review: $1','مستند جديد للمراجعة: $1');
R(/^Réponse du patient pour : ([\s\S]+)$/,'Patient’s reply for: $1','ردّ المريض بخصوص: $1');
R(/^Réponse du patient : ([\s\S]+)$/,'Patient’s reply: $1','ردّ المريض: $1');
R(/^Dr Mansour : « ([\s\S]*) » – (.+)$/,'Dr Mansour: “$1” – %2','د. منصور: «$1» – %2',m=>'Dr Mansour : « '+m[1]+' » – '+trs(m[2]));
R(/^(Dr [^:«]+?) : (?!«)(.+)$/,'%1: %2','%1: %2');
R(/^([\d.,]+) (Ko|Mo)$/,m=>m[1]+(m[2]==='Ko'?' KB':' MB'),m=>m[1]+(m[2]==='Ko'?' ك.ب':' م.ب'));

function trs(s){if(!s)return s;const k=norm(s);const r=MAP.get(k);if(r)return r[LI[LANG]];
 for(const [re,f] of RULES){const m=k.match(re);if(m){const x=f(m);if(x!=null)return x}}
 let m=k.match(/^([^\p{L}\p{N}]+)(.+)$/u);if(m){const x=trs(m[2]);return x===m[2]?s:m[1]+x}
 m=k.match(/^(.+?)(\s[·–:|])$/);if(m){const x=trs(m[1]);return x===m[1]?s:x+m[2]}
 for(const sep of [' – ',' · ',' : ',', ']){if(k.includes(sep)){const p=k.split(sep),q=p.map(trs);if(q.some((v,i)=>v!==p[i]))return q.join(sep===', '&&LANG==='ar'?'، ':sep)}}
 return s}
const T=(s,...a)=>{let x=trs(s);a.forEach((v,i)=>x=x.replace('{'+i+'}',v));return x};
// Arabic: keep ISO dates left-to-right even after Arabic words (bidi would otherwise reverse them), same for numeric ranges like 13–17
const FIXRX=/(?<![\d.,])(\d{4}-\d\d-\d\d|\d+(?:[.,]\d+)?–\d+(?:[.,]\d+)?)(?!\d)/g;
const fixAr=x=>LANG!=='ar'?x:x.split(/(\u2066[^\u2069]*\u2069)/).map((p,i)=>i%2?p:p.replace(FIXRX,'\u2066$1\u2069')).join('');
const SKIP=/^(SCRIPT|STYLE|TEXTAREA|CODE)$/,ATTR=['aria-label','alt','title','placeholder'];
function trNode(n){const d=n.nodeValue;if(!d||!/\S/.test(d))return;if(n.parentNode&&SKIP.test(n.parentNode.tagName))return;const core=d.trim(),x=fixAr(trs(core));if(x!==core)n.nodeValue=d.match(/^\s*/)[0]+x+d.match(/\s*$/)[0]}
function trAttrs(el){for(const a of ATTR){const v=el.getAttribute&&el.getAttribute(a);if(v){const x=fixAr(trs(v));if(x!==v)el.setAttribute(a,x)}}}
function trTree(r){if(r.nodeType===3)return trNode(r);if(r.nodeType!==1||SKIP.test(r.tagName))return;trAttrs(r);
 const w=document.createTreeWalker(r,5,{acceptNode:n=>n.nodeType===1&&SKIP.test(n.tagName)?2:1});let n;while(n=w.nextNode())n.nodeType===3?trNode(n):trAttrs(n)}
new MutationObserver(ms=>{for(const m of ms){if(m.type==='childList')m.addedNodes.forEach(trTree);else if(m.type==='characterData')trNode(m.target);else trAttrs(m.target)}})
 .observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:ATTR});
function applyLang(){const h=document.documentElement;h.lang=LANG;h.dir=LANG==='ar'?'rtl':'ltr';document.title=T('MedCard – Dossier médical NFC (démo)')}
function setLang(l){if(!LANGS[l])return;LANG=l;try{localStorage.setItem('mc_lang',l)}catch(e){}applyLang();modal();render();const e=$('.lang');if(e)e.focus()}
applyLang();

render();
IDBF.all().then(m=>{let n=0;for(const[k,b]of Object.entries(m))if(!FU[k]){FU[k]=URL.createObjectURL(b);n++}if(n)render()});
