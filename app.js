import { PROFILE, CATEGORIES, PROJECTS } from './portfolio-data.js';
import { LIVE_PAGES } from './github-pages-data.js';

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const stage = $('#stage');
const box = $('#box');
const lid = $('#lid');
const rebox = $('#rebox');
const overlay = $('#overlay');
const host = $('#modalHost');
const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = ms => new Promise(r => setTimeout(r, reduceMotion ? 0 : ms));
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const safe = escapeHtml;
let opened = false;
let animating = false;
let currentView = null;
let lastFocus = null;
let toastTimer;

// Scale each existing logical frame once. Desktop artwork, navigation,
// portraits and hitboxes all share the original 1672×941 coordinates.
const portrait = matchMedia('(max-width: 860px) and (orientation: portrait)');
const DESIGN_DESKTOP = { width: 1672, height: 941 };
const DESIGN_PORTRAIT = { width: 1080, height: 2160 };
function fit() {
  const mobile = portrait.matches;
  stage.classList.toggle('is-portrait', mobile);
  root.classList.toggle('portrait-layout', mobile);
  const { width, height } = mobile ? DESIGN_PORTRAIT : DESIGN_DESKTOP;
  const vw = document.documentElement.clientWidth || window.innerWidth;
  const vh = document.documentElement.clientHeight || window.innerHeight;

  // Contain the complete frame, including its interactive controls, rather
  // than enlarging it past one viewport edge. Never stretch either axis.
  const scale = Math.min(vw / width, vh / height);

  const x = (vw - width * scale) / 2;
  const y = height * scale < vh ? (vh - height * scale) / 2 : 0;
  stage.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  // Register only the added margins to the same stationary artwork origin.
  root.style.setProperty('--desk-width', `${3000 * scale}px`);
  root.style.setProperty('--desk-height', `${1401 * scale}px`);
  root.style.setProperty('--desk-x', `${x - 664 * scale}px`);
  root.style.setProperty('--desk-y', `${y - 230 * scale}px`);
  window.__stageView = { scale, x, y, vw, vh, width, height, mobile };
  root.classList.toggle('stage-gaps-x', x > .5);
  root.classList.toggle('stage-gaps-y', y > .5);
}
stage.style.transformOrigin = "top left";
fit();
addEventListener('resize',fit,{passive:true});
portrait.addEventListener?.('change',fit);
async function intro() {
 await wait(240);
 box.classList.add('is-landed');

}
intro();

// Phase 5A: classes describe rendering; only the settled open state is interactive.
const lidMotion = $('.lid-motion');
const objects = $('#objects');
const portraitActions = $('.portrait-ui__actions');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let artworkReady = false;
let lidRun = 0;
let activeLidAnimation = null;
function gateObjects(enabled) {
 objects.inert = !enabled;
 portraitActions.inert = !enabled;
 for (const button of $$('.objects button, .portrait-ui__actions button')) button.disabled = !enabled;
}
gateObjects(false);
function setLidState(state) {
 box.dataset.lidState = state;
 for (const name of ['opening','open','closing']) box.classList.toggle('is-' + name, state === name);
 opened = state !== 'closed';
 animating = state === 'opening' || state === 'closing';
 document.body.classList.toggle('is-open', state === 'opening' || state === 'open');
 gateObjects(state === 'open');
 lid.disabled = state !== 'closed' || !artworkReady;
 $('#portraitOpen').disabled = state !== 'closed' || !artworkReady;
 rebox.disabled = state !== 'open';
 $('#portraitClose').disabled = state !== 'open';
}
setLidState('closed');
const lidPose = (travel, tilt = 0, roll = 0) =>
 `translate3d(0, calc(var(--lid-travel) * ${travel}), 0) perspective(2400px) rotateX(${tilt}deg) rotateZ(${roll}deg)`;
const lidFrame = (offset, travel, tilt, roll, shadow, easing) => ({
 offset, transform: lidPose(travel, tilt, roll), filter: `drop-shadow(${shadow})`, easing
});
const lidRest = lidFrame(0, 0, 0, 0, '0px 0px 0px #0000', 'cubic-bezier(.4,0,.7,.5)');
const lidAway = lidFrame(1, 1, 8, -3, '0px 36px 30px #0000', 'linear');
const lidOpening = [
 lidRest,
 lidFrame(.10, .008, 1, 0, '0px 5px 4px #0003', 'cubic-bezier(.3,.15,.6,.7)'),
 lidFrame(.25, .065, 8, -2, '0px 18px 16px #0004', 'cubic-bezier(.35,.2,.55,.8)'),
 lidFrame(.80, .82, 8, -3, '0px 36px 30px #0001', 'cubic-bezier(.2,.5,.4,1)'),
 lidAway
];
const lidClosing = [
 {...lidAway, offset: 0, easing: 'cubic-bezier(.4,0,.6,.8)'},
 lidFrame(.48, .13, 8, -3, '0px 24px 22px #0004', 'cubic-bezier(.25,.3,.45,.8)'),
 lidFrame(.76, .023, 3, -1, '0px 10px 9px #0003', 'cubic-bezier(.25,.4,.5,.85)'),
 lidFrame(.93, .002, .4, -.1, '0px 2px 2px #0001', 'cubic-bezier(.2,.5,.4,1)'),
 {...lidRest, offset: 1}
];
function moveLid(opening) {
 // One timing source, also used for the bounded watchdog. No child events or
 // unrelated object/portrait transitions can finish this run.
 const duration = motionPreference.matches ? 0 : Number(getComputedStyle(box).getPropertyValue(opening ? '--lid-open-ms' : '--lid-close-ms'));
 if (!duration) return Promise.resolve();
 return new Promise(resolve => {
  let timer;
  const animation = lidMotion.animate(opening ? lidOpening : lidClosing, {duration, fill: 'both'});
  activeLidAnimation = animation;
  const finish = () => {
   clearTimeout(timer);
   motionPreference.removeEventListener('change', preferenceChanged);
   if (activeLidAnimation === animation) activeLidAnimation = null;
   resolve();
  };
  const preferenceChanged = () => { if (motionPreference.matches) animation.finish(); };
  motionPreference.addEventListener('change', preferenceChanged);
  // Cancellation also settles to the requested state; cleanup happens below.
  animation.finished.then(finish, finish);
  timer = setTimeout(() => { animation.cancel(); }, duration + Math.max(250, duration * .2));
 });
}
async function runLid(opening) {
 const run = ++lidRun;
 const focused = document.activeElement;
 const moveFocus = objects.contains(focused) || portraitActions.contains(focused) ||
  [lid, rebox, $('#portraitOpen'), $('#portraitClose')].includes(focused);
 if (moveFocus) $('#homeBtn').focus({preventScroll:true});
 setLidState(opening ? 'opening' : 'closing');
 // The wrapper is hidden only while open, never flashed at its resting pose:
 // animate() installs the first closing keyframe in this same rendering task.
 lidMotion.hidden = false;
 try { await moveLid(opening); }
 finally {
  if (run === lidRun) {
   lidMotion.hidden = opening;
   // First establish the final render, then release the filled animation.
   lid.hidden = opening;
   setLidState(opening ? 'open' : 'closed');
   for (const animation of lidMotion.getAnimations()) animation.cancel();
   if (moveFocus) (opening ? (portrait.matches ? $('.portrait-ui__actions button') : rebox) :
    (portrait.matches ? $('#portraitOpen') : lid)).focus({preventScroll:true});
  }
 }
}
async function openBox() {
 if (!artworkReady || opened || animating) return;
 await runLid(true);
}
async function closeBox() {
 if (!opened || animating) return;
 hideModal();
 await runLid(false);
}
lid.addEventListener('click', openBox);
rebox.addEventListener('click',closeBox);
$('#homeBtn').addEventListener('click',async()=>{hideModal();if(opened)await closeBox();});

// Canonical category titles supply the integrated labels; destinations stay intact.
for (const object of $$('.objects .object')) {
 const hint = $('.object__hint', object);
 if (CATEGORIES[object.dataset.open]) hint.textContent = CATEGORIES[object.dataset.open].title;
 hint.setAttribute('aria-hidden', 'true');
}
// Phase 3A: extracted surface, hit region and label share the button transform.
const objectLayers = await fetch('assets/scenes/phase3a/layers.json').then(r => {
 if (!r.ok) throw new Error('Object layer manifest unavailable');
 return r.json();
});
for (const [name, layer] of Object.entries(objectLayers)) {
 const object = $('.object--' + name);
 const [x,y,right,bottom] = layer.bounds;
 for (const [property,value] of Object.entries({left:x,top:y,width:right-x,height:bottom-y})) {
  object.style.setProperty(property, value + 'px', 'important');
 }
 object.style.setProperty('--object-clip', layer.clip);
 object.style.setProperty('--object-x', x + 'px');
 object.style.setProperty('--object-y', y + 'px');
 object.classList.add('object--layered');
 const surface = document.createElement('span');
 surface.className = 'object__surface';
 surface.setAttribute('aria-hidden','true');
 const art = document.createElement('img');
 art.src = 'assets/scenes/phase3a/' + name + '.webp';
 art.alt = ''; art.draggable = false;
 surface.append(art);
 if (name === 'id' || name === 'folder') {
  const raised = art.cloneNode();
  raised.src = 'assets/scenes/phase3a/' + name + '-raised.webp';
  raised.className = 'object__raised';
  surface.append(raised);
 }
 if (name === 'id') {
  const cover = document.createElement('span');
  cover.className = 'object__photo-cover';
  surface.append(cover, $('.concept-art--open > .concept-portrait--open').cloneNode(true));
 }
 const hit = document.createElement('span');
 hit.className = 'object__hit'; hit.setAttribute('aria-hidden','true');
 object.prepend(surface, hit);
}

// Do not uncover the reconstructed bed until every extracted texture is decoded.
await Promise.all($$('.object__surface img').map(image => image.decode()));
artworkReady = true;
setLidState('closed');

// Peripheral setup is independent of all Phase 3A controls.
import('./peripheral-interactions.js').then(({initPeripheralDesk}) => initPeripheralDesk(stage, overlay)).catch(console.error);
$('#portraitOpen').addEventListener('click',openBox);
$('#portraitClose').addEventListener('click',closeBox);

const navWrap = $('.nav__projects');
const toggle = $('#projectsToggle');
function closeDropdown(){navWrap.classList.remove('is-active');toggle.setAttribute('aria-expanded','false')}
toggle.addEventListener('click',e=>{e.stopPropagation();const now=navWrap.classList.toggle('is-active');toggle.setAttribute('aria-expanded',String(now))});
document.addEventListener('click',e=>{if(!navWrap.contains(e.target))closeDropdown()});

const itemById = new Map(PROJECTS.map(p=>[p.id,p]));
const livePageById = new Map(LIVE_PAGES.map(p=>[p.id,p]));
const categoryIds = Object.keys(CATEGORIES);
const projectCard = p => `<button type="button" class="project-card" data-case="${safe(p.id)}" aria-label="View ${safe(p.name)} case study">
 <div class="project-card__art technical-card"><img src="${safe(p.thumbnail)}" alt="" width="600" height="230" loading="lazy"></div>
 <div class="project-card__body"><small>${safe(p.eyebrow)}</small><h3>${safe(p.name)}</h3><p>${safe(p.description)}</p></div></button>`;
const modalBar = (name, crumb) => `<div class="modal__bar"><span>${safe(crumb || 'Frank Ndlovu')}</span><span>${safe(name)}</span><button type="button" class="close" data-close aria-label="Close">×</button></div>`;

function renderProfile(view = 'about') {
 const views = [
  ['about','Overview'],['experience','Experience'],['credentials','Certifications'],['skills','Skills'],['education','Education']
 ];
 const count=PROFILE.certifications.completed.length;
 const tabs=views.map(([id,title])=>`<button type="button" data-view="${id}" class="dossier-tab ${view===id?'is-active':''}" ${view===id?'aria-current="page"':''}>${title}</button>`).join('');
 const overview=`<div class="dossier-overview">
  <h3>From code to production.</h3><p>${safe(PROFILE.intro)}</p>
  <div class="dossier-metrics"><div><strong>${count}</strong><span>Completed credentials</span></div><div><strong>2023</strong><span>Freelancing since</span></div><div><strong>2027</strong><span>Expected BSc completion</span></div></div>
  <div class="dossier-focus"><h4>What I work on</h4><p>Cloud and DevOps engineering · Backend APIs and enterprise integrations · Identity and access controls · Infrastructure and observability · Full-stack product delivery.</p></div>
  <div class="dossier-inline-actions"><button data-view="credentials" type="button" class="dossier-primary">View all ${count} certifications</button><button data-view="experience" type="button" class="dossier-secondary">Experience</button></div>
  </div>`;
 const experience=`<div class="dossier-section"><h3>Work that ships.</h3>
 ${PROFILE.experience.map((e,i)=>`<article class="dossier-job"><span>${safe(e.date)}</span><div><h4>${safe(e.role)}</h4><strong>${safe(e.organization)}</strong><p>${safe(e.description)}</p></div></article>`).join('')}
 <div class="dossier-note"><b>Delivery experience</b><p>CI/CD and release automation, .NET 8/Angular applications, EF Core migrations, SQL Server and PostgreSQL, Microsoft 365 integrations, Entra ID and RBAC, Windows/IIS and Linux hosting, Zabbix monitoring, Docker-based services, and operational troubleshooting.</p></div></div>`;
 const credentialAssets = {
  'CompTIA Security+': {file:'comptia-security-plus.png', alt:'CompTIA Security+ certification badge'},
  'Microsoft SC-900: Security, Compliance, and Identity Fundamentals': {file:'microsoft-fundamentals.svg', alt:'Microsoft Certified Fundamentals badge'},
  'Oracle Cloud Infrastructure Foundations Associate': {file:'Oracle .png', alt:'Oracle Cloud Infrastructure Foundations Associate supplied graphic'},
  'Google Cybersecurity Professional Certificate': {file:'google-cybersecurity.png', alt:'Google Cybersecurity course completion badge'},
  'Microsoft Cybersecurity Analyst Professional Certificate': {file:'microsoft-cybersecurity.png', alt:'Microsoft Cybersecurity Analyst course completion badge'},
  'GitHub Foundations': {file:'github-foundations.png', alt:'GitHub Foundations certification badge'},
  'FNB App Academy — Full Stack Development': {file:'FNB.png', alt:'FNB App Academy Full Stack Development supplied graphic'},
  'ALX Software Engineering — Back-End Specialization': {file:'ALX.png', alt:'ALX Software Engineering Back-End Specialization supplied graphic'},
  'Python Developer Certificate': {file:'Rita africa .png', alt:'RITA Africa Python Developer Certificate supplied graphic'}
 };
 const credentialCards=PROFILE.certifications.completed.map(c=>{
  const asset=credentialAssets[c.name];
  return `<article class="credential"><div class="credential__visual">${asset?`<img src="assets/certifications/${asset.file}" alt="${asset.alt}" width="112" height="96" />`:`<span class="credential__issuer-text">${safe(c.issuer)}</span>`}</div><div><h4>${safe(c.name)}</h4><p>${safe(c.issuer)}</p></div><time>${safe(c.date)}</time>${c.verificationUrl?`<a href="${safe(c.verificationUrl)}" target="_blank" rel="noopener noreferrer">Verify credential</a>`:''}</article>`;
 }).join('');
 const credentials=`<div class="dossier-section"><h3>${count} completed credentials.</h3><p class="dossier-subtitle">Completed qualifications listed on my CV, separated from the certifications I am currently studying toward.</p><div class="credential-list">${credentialCards}</div>
 <h4 class="dossier-subhead">In progress / current focus</h4><div class="studying-grid">${PROFILE.certifications.studying.map(t=>`<div class="studying-item">${safe(t)}</div>`).join('')}</div></div>`;
 const skills=`<div class="dossier-section"><h3>My engineering toolkit.</h3><p class="dossier-subtitle">Competencies connected to demonstrated projects, with source-backed work, implementation accounts and exposure distinguished.</p><div class="dossier-skills">${PROFILE.skillGroups.map(g=>`<section><h4>${safe(g.title)}</h4><div class="dossier-pills">${g.items.map(x=>`<span>${safe(x)}</span>`).join('')}</div></section>`).join('')}</div></div>`;
 const education=`<div class="dossier-section"><h3>Formal learning &amp; development.</h3><div class="dossier-school-list">${PROFILE.educationItems.map((e,i)=>`<article class="dossier-school"><h4>${safe(e.title)}</h4><p>${safe(e.institution)}</p><time>${safe(e.date)}</time><small>${safe(e.detail)}</small></article>`).join('')}</div><div class="dossier-note"><b>Continuing professional development</b><p>Azure administration and DevOps, infrastructure as code, and HashiCorp tooling remain active study areas. Current-focus credentials are not presented as completed certifications.</p></div></div>`;
 const content={about:overview,experience,credentials,skills,education}[view]||overview;
 return `<section class="modal dossier" aria-label="Frank Ndlovu — profile and credentials">
  <div class="dossier-bar"><span>Profile &amp; credentials</span><button type="button" class="dossier-close" data-close aria-label="Close profile">×</button></div>
  <div class="dossier-layout"><aside class="dossier-identity"><div class="dossier-photo"><img src="assets/profile/frank-portrait.jpg" alt="Frank Ndlovu" /></div>
     <h2>Frank<br>Ndlovu</h2><p class="dossier-identity__role">Software Developer<br>&amp; DevOps Engineer</p><p class="dossier-identity__location">Benoni · Johannesburg, South Africa</p>
     <div class="dossier-contact"><a href="${safe(PROFILE.github)}" target="_blank" rel="noopener noreferrer">GitHub</a><a href="${safe(PROFILE.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a></div>
     <a class="dossier-cv" href="${safe(PROFILE.cvFile)}" download="Frank-Ndlovu-CV.pdf">Download CV</a>
    </aside>
    <div class="dossier-main"><nav class="dossier-tabs" aria-label="Profile sections">${tabs}</nav><div class="dossier-panel" id="dossierPanel">${content}</div><div class="dossier-footer"><span>Software engineering · Cloud · Security</span><button type="button" data-view="contact">Get in touch</button></div></div>
  </div></section>`;
}
function renderCatalog(key){
 if (key === 'apps') return renderCameraDevice();
 const category = CATEGORIES[key];
 const projects = PROJECTS.filter(p=>p.category===key);
 return `<section class="modal" aria-label="${safe(category.title)}">${modalBar(category.title,'Selected work')}
 <div class="modal__body"><div class="catalog-head"><div><div class="eyebrow">Open the folder / explore</div><h2 class="hand-head">${safe(category.title)}.</h2></div><p>${safe(category.subtitle)}</p></div>
 <div class="catalog-grid">${projects.map(projectCard).join('')}</div><p class="catalog-note">${safe(category.hint)}</p></div></section>`;
}

function renderCameraDevice(){
 const pages = LIVE_PAGES;
 return `<section class="camera-device" aria-label="Public websites viewer">
   <div class="camera-device__flash" aria-hidden="true"><span></span></div>
   <div class="camera-device__body">
     <div class="camera-device__lens" aria-hidden="true"></div>
     <div class="camera-device__screen">
       <div class="device-topline"><span class="device-light">●</span> Live websites <span>${pages.length} public website${pages.length===1?'':'s'}</span></div>
       <div class="device-scroll">
         ${pages.length ? pages.map((p,i)=>`<button type="button" class="device-row" data-live="${safe(p.id)}" aria-label="Explore ${safe(p.name)} live website">
           <div class="device-preview device-preview--illustrated" style="--pv:${safe(p.accent||'#6695a8')}"><img src="${safe(itemById.get(p.caseId)?.thumbnail)}" alt="Technical component illustration for ${safe(p.name)}" loading="lazy"/><span class="concept-label">Technical architecture</span></div>
           <div class="device-row__info"><span class="device-row__num">${safe(p.platform||'GitHub Pages')}</span><h3>${safe(p.name)}</h3><p>${safe(p.description||'A public web project published through GitHub Pages.')}</p><span class="live-status ${p.verified?'live-status--verified':''}">${p.verified?'URL checked':'Owner-provided public URL'}</span><span class="device-row__link">Open details and website</span></div>
         </button>`).join('') : `<div class="device-empty"><h3>No verified Pages deployments yet</h3><p>Run <code>npm run sync:pages</code> on your Ubuntu computer to discover your currently live public GitHub Pages websites.</p></div>`}
       </div>
     </div>
     <div class="camera-device__controls" aria-hidden="true"><span class="control-round"></span><span class="control-round"></span><span class="control-dpad"><em>●</em></span><span class="control-round"></span></div>
   </div>
   <button type="button" class="camera-device__close" data-close aria-label="Close camera viewer">×</button>
  </section>`;
}
function renderLivePage(page){
 const detail = page.caseId && itemById.get(page.caseId);
 const checked = page.verified && page.checkedAt ? `Checked ${new Date(page.checkedAt).toLocaleDateString('en-ZA',{year:'numeric',month:'long',day:'numeric'})}` : (page.statusLabel||'Owner-provided website link; not independently checked');
 return `<section class="modal live-detail" aria-label="${safe(page.name)} live website details">${modalBar('Live websites')}
 <div class="modal__body"><div class="eyebrow">${safe(page.platform||'GitHub Pages')} / ${safe(page.repo)}</div><h2 class="hand-head">${safe(page.name)}.</h2>
 <p class="lead">${safe(page.description||'A website published from one of my public GitHub repositories.')}</p>
 <div class="live-meta"><span class="live-status ${page.verified?'live-status--verified':''}">${safe(checked)}</span>${page.language?`<span>${safe(page.language)}</span>`:''}</div>
 <div class="live-detail__preview live-detail__preview--illustrated"><img src="${safe(detail?.diagram)}" alt="Technical architecture for ${safe(page.name)}" loading="lazy"><div class="live-detail__preview-label">Architecture illustration · Visit the website for current screens</div></div>
 <div class="live-links"><a href="${safe(page.url)}" target="_blank" rel="noopener noreferrer" class="ink-btn">View website</a><a href="${safe(page.source)}" target="_blank" rel="noopener noreferrer" class="ink-btn ink-btn--light">View source repository</a>${detail?`<button type="button" class="ink-btn ink-btn--light" data-view="case:${safe(detail.id)}">Read case study</button>`:''}</div>
 <p class="catalog-note">Only links in the local inventory are displayed. The <code>npm run sync:pages</code> command checks GitHub Pages deployments; Vercel projects are curated separately and retained when synchronizing.</p>
 </div></section>`;
}

function renderContact(){
 return `<section class="modal contact-modal" aria-label="Contact Frank">${modalBar('Contact')}
 <div class="contact-modal__body"><div class="eyebrow">Say hello / build something worthwhile</div><h2 class="hand-head">You've got mail.</h2>
 <p><b>To:</b> ${safe(PROFILE.email)}<br><b>Subject:</b> Let's build something.</p>
 <p>Interested in engineering work, technical collaboration or a product idea? I'm particularly interested in backend development, cloud platforms and DevOps engineering.</p>
 <div class="contact-modal__links"><a href="mailto:${encodeURIComponent(PROFILE.email)}?subject=Let%27s%20build%20something">Email me</a><a href="${safe(PROFILE.github)}" target="_blank" rel="noopener noreferrer">GitHub</a><a href="${safe(PROFILE.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a></div>
 <p class="contact-sign">Best,<br>Frank</p></div></section>`;
}
function sectionBlock(id,number,title,body){return `<section class="case-section" id="${safe(id)}"><h2>${safe(title)}</h2>${body}</section>`}
function technicalFigure(path, caption) {
 return `<figure class="technical-figure"><div class="technical-figure__viewport" tabindex="0" role="region" aria-label="${safe(caption)}"><img src="${safe(path)}" alt="${safe(caption)}" width="1000" height="600" loading="lazy"></div><figcaption>${safe(caption)} <a href="${safe(path)}" target="_blank" rel="noopener noreferrer">Open full-size SVG</a></figcaption></figure>`;
}
function renderCase(project) {
 const paragraphs = values => values.map(value=>`<p>${safe(value)}</p>`).join('');
 const link = `${project.link ? `<a class="ink-btn" href="${safe(project.link)}" target="_blank" rel="noopener noreferrer">View live website</a>` : ''}${project.source ? `<a class="ink-btn ink-btn--light" href="${safe(project.source)}" target="_blank" rel="noopener noreferrer">View public repository</a>` : ''}`;
 const related=PROJECTS.filter(p=>p.category===project.category && p.id!==project.id).slice(0,2);
 const narrative=project.sections.map((part,i)=>{
  const id=i===0?'case-problem':i===1?'case-build':'case-detail-'+i;
  const body=paragraphs(part.paragraphs);
  return i<3 ? sectionBlock(id,'',part.title,body) : `<section class="case-section case-expandable" id="${id}"><details><summary><h2>${safe(part.title)}</h2><span class="case-expand-label">Read section</span></summary><div>${body}</div></details></section>`;
 }).join('');
 const additionalDiagrams=(project.diagrams||[]).map(id=>technicalFigure('assets/technical/'+id+'.svg',
  ({'boomerang-workflow':'Representative backend-governed workflow: departmental completion returns to Support for final validation.',
    reconciliation:'Reconciliation controls from the implementation account: bounded reads, dry-run review and guarded administrative repair.',
    'zoho-lifecycle':'External ticket updates and internal incident transitions are different state models.',
    'course-revisions':'Source-backed revision model: new content IDs preserve the original enrolment, progress and attempt linkage.'})[id])).join('');
 return `<div class="case-shell" role="document">
  <div class="case-scroll" id="caseScroll">
   <header class="case-hero"><div><div class="eyebrow">${safe(project.eyebrow)} / ${safe(project.year)}</div><h1>${safe(project.name)}</h1><p class="case-status">${safe(project.status)}</p><p>${safe(project.description)}</p><dl class="case-meta"><div><dt>My role</dt><dd>${safe(project.role)}</dd></div><div><dt>Timeframe</dt><dd>${safe(project.year)}</dd></div></dl></div>
   <img class="case-technical-preview" src="${safe(project.thumbnail)}" alt="Component summary for ${safe(project.name)}" width="600" height="230"></header>
   ${sectionBlock('case-overview','','Technical executive summary',paragraphs([project.summary])+ '<div class="skill-tags">'+project.stack.map(t=>`<span>${safe(t)}</span>`).join('')+'</div>')}
   ${sectionBlock('case-approach','','Architecture',technicalFigure(project.diagram,project.diagramCaption))}
   ${narrative}
   ${additionalDiagrams?sectionBlock('case-diagrams','','Technical detail diagrams',additionalDiagrams):''}
   ${sectionBlock('case-outcome','','Evidence and implementation status',paragraphs([project.evidence,project.status]))}
   <footer class="case-footer"><h2>Explore the engineering work</h2>${link}<button class="ink-btn ink-btn--light" type="button" data-view="${safe(project.category)}">Back to ${safe(CATEGORIES[project.category].title)}</button>
   ${related.length?`<div class="catalog-grid" style="margin-top:36px">${related.map(projectCard).join('')}</div>`:''}</footer>
  </div>
  <aside class="case-side"><button type="button" class="close" data-close aria-label="Close case study">×</button><h4>On this page</h4><button type="button" data-scroll="case-overview">Summary</button><button type="button" data-scroll="case-approach">Architecture</button><button type="button" data-scroll="case-problem">Context</button><button type="button" data-scroll="case-build">Contribution</button>${additionalDiagrams?'<button type="button" data-scroll="case-diagrams">Detail diagrams</button>':''}<button type="button" data-scroll="case-outcome">Evidence & status</button></aside>
 </div>`;
}
function showToast(message){
 const target=$('#toast');target.textContent=message;target.classList.add('is-active');clearTimeout(toastTimer);toastTimer=setTimeout(()=>target.classList.remove('is-active'),2600);
}
function render(key){
 if(['about','experience','credentials','skills','education'].includes(key))return renderProfile(key);
 if(key==='contact')return renderContact();
 if(CATEGORIES[key])return renderCatalog(key);
 if(key.startsWith('live:')){const page=livePageById.get(key.slice(5));if(page)return renderLivePage(page)}
 if(key.startsWith('case:')){const p=itemById.get(key.slice(5));if(p)return renderCase(p)}
 return renderCatalog('projects');
}
function showModal(key){
 if(!key)return;
 closeDropdown();
 if(currentView===null)lastFocus=document.activeElement;
 currentView=key;
 host.classList.toggle('modal-host--case',key.startsWith('case:'));
 host.innerHTML=render(key);
 overlay.classList.add('is-visible');overlay.setAttribute('aria-hidden','false');
 host.focus();
 const scroll=$('#caseScroll');if(scroll)scroll.scrollTop=0;
}
function hideModal(){
 if(!currentView)return;
 overlay.classList.remove('is-visible');overlay.setAttribute('aria-hidden','true');
 host.innerHTML='';currentView=null;
 lastFocus?.focus?.({preventScroll:true});
}
$$('[data-open]').forEach(el=>el.addEventListener('click',()=>{
 if ((objects.contains(el) || portraitActions.contains(el)) && (animating || !opened)) return;
 showModal(el.dataset.open);
}));
$('#scrim').addEventListener('click',hideModal);
host.addEventListener('click',e=>{
 const button=e.target.closest('button');
 if(!button)return;
 if(button.hasAttribute('data-close'))return hideModal();
 if(button.hasAttribute('data-view'))return showModal(button.dataset.view);
 if(button.hasAttribute('data-case'))return showModal('case:'+button.dataset.case);
 if(button.hasAttribute('data-live'))return showModal('live:'+button.dataset.live);
 if(button.hasAttribute('data-scroll'))return $('#'+button.dataset.scroll)?.scrollIntoView({behavior:reduceMotion?'instant':'smooth',block:'start'});
});
addEventListener('keydown',e=>{
 if(e.key==='Escape'){if(currentView)hideModal();else closeDropdown();}
 });
// Scene imagery is self-contained; no invisible 3D trinkets are rendered.
