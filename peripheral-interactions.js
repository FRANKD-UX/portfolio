// Phase 3B: source-pixel silhouettes; never create decorative click targets.
export async function initPeripheralDesk(stage, overlay) {
 const layers = await fetch('assets/scenes/phase3b/layers.json').then(r => {
  if (!r.ok) throw new Error('Peripheral layer manifest unavailable');
  return r.json();
 });
 const desk = document.createElement('div');
 desk.className = 'peripheral-desk'; desk.setAttribute('aria-hidden', 'true');
 const items = [];
 for (const [name, data] of Object.entries(layers)) {
  const [x,y,r,b] = data.bounds;
  const makeImage = suffix => {
   const img = new Image(); img.src = `assets/scenes/phase3b/${name}${suffix}.webp`;
   img.alt = ''; img.draggable = false;
   Object.assign(img.style, {left:`${x}px`,top:`${y}px`,width:`${r-x}px`,height:`${b-y}px`});
   return img;
  };
  const bed = makeImage('-bed'), el = makeImage('');
  bed.className = 'peripheral-bed'; el.className = 'peripheral-object'; el.dataset.accessory = name;
  desk.append(bed); items.push({...data, el, x:0, y:0, angle:0});
 }
 // Decode before replacing the flattened pixels, avoiding a flash of repairs.
 await Promise.all(items.flatMap(item => [item.el.decode(), desk.querySelector(`img[src$="/${item.el.dataset.accessory}-bed.webp"]`).decode()]));
 const surfaces = desk.cloneNode(false);
 surfaces.classList.add('peripheral-surfaces');
 surfaces.append(...items.map(item => item.el));
 stage.querySelector('.concept-art--open').append(desk);
 stage.querySelector('#sceneCanvas').append(surfaces);
 const fine = matchMedia('(any-hover: hover) and (any-pointer: fine)');
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 let pointer = null, frame = 0, previous = 0;
 const enabled = () => fine.matches && !reduced.matches && !document.hidden && !window.__stageView.mobile && overlay.getAttribute('aria-hidden') !== 'false';
 const schedule = () => { if (!frame) frame = requestAnimationFrame(tick); };
 const reset = () => {
  pointer = null; cancelAnimationFrame(frame); frame = 0; previous = 0;
  for (const item of items) { item.x = item.y = item.angle = 0; item.el.style.transform = ''; }
 };
 function tick(now) {
  frame = 0;
  if (!enabled()) { reset(); return; }
  const dt = previous ? Math.min(now - previous, 50) : 16.67;
  previous = now;
  const blend = 1 - Math.exp(-dt / 105);
  let unsettled = false;
  const view = window.__stageView;
  // Pointer events only store client coordinates; frame uses the existing
  // logical view transform, with no getBoundingClientRect/layout reads.
  const px = pointer ? (pointer.x-view.x)/view.scale : Infinity;
  const py = pointer ? (pointer.y-view.y)/view.scale : Infinity;
  for (const item of items) {
   const [[ax,ay],[bx,by]] = item.axis;
   const fraction = pointer ? Math.max(0,Math.min(1,((px-ax)*(bx-ax)+(py-ay)*(by-ay))/((bx-ax)**2+(by-ay)**2))) : 0;
   const dx = ax + (bx-ax)*fraction-px, dy = ay + (by-ay)*fraction-py;
   const distance = Math.hypot(dx,dy);
   const strength = Math.max(0,1-distance/item.radius)**2;
   const length = distance || 1;
   const tx = strength ? dx/length*item.displacement*strength : 0;
   const ty = strength ? dy/length*item.displacement*strength : 0;
   const turn = strength ? (dx*(by-ay)-dy*(bx-ax))/(length*Math.hypot(bx-ax,by-ay))*item.rotation*strength : 0;
   item.x += (tx-item.x)*blend; item.y += (ty-item.y)*blend; item.angle += (turn-item.angle)*blend;
   const moving = Math.max(Math.abs(tx-item.x),Math.abs(ty-item.y),Math.abs(turn-item.angle)) > .002;
   if (!moving) { item.x=tx; item.y=ty; item.angle=turn; }
   item.el.style.transform = tx===0 && ty===0 && turn===0 && !moving ? '' : `translate(${item.x.toFixed(4)}px,${item.y.toFixed(4)}px) rotate(${item.angle.toFixed(4)}deg)`;
   unsettled ||= moving;
  }
  if (unsettled) schedule(); else previous = 0;
 }
 window.addEventListener('pointermove', e => {
  if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
  if (!enabled()) return;
  pointer = {x:e.clientX,y:e.clientY}; schedule();
 }, {passive:true});
 const returnHome = () => { pointer=null; schedule(); };
 document.documentElement.addEventListener('pointerleave', returnHome);
 window.addEventListener('blur', reset);
 window.addEventListener('resize', reset, {passive:true});
 document.addEventListener('visibilitychange', reset);
 fine.addEventListener('change', reset); reduced.addEventListener('change', reset);
 new MutationObserver(() => { if (!enabled()) reset(); }).observe(overlay, {attributes:true,attributeFilter:['aria-hidden']});
}
