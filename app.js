'use strict';

const $ = (selector) => document.querySelector(selector);
let page = 0;
let soundOn = false;
let audioContext;
let cleanup = () => {};
const progress = { stars: new Set(), parts: new Set(), drawing: null, drawingHistory: [], drawingRedo: [], shipDesign: null, launched: false, flag: false };
const star = (x, y, size = 11, color = '#dfb75e') => `<path class="sparkle" fill="${color}" d="M${x} ${y-size}q2 ${size-2} ${size} ${size}q-${size-2} 2-${size} ${size}q-2-${size-2}-${size}-${size}q${size-2}-2 ${size}-${size}Z"/>`;
const littleStars = [[45,100,6],[160,70,5],[345,38,7],[525,110,9],[470,250,7],[90,220,6],[530,360,4],[310,175,4]].map(s => star(...s)).join('');
const defs = `<defs><filter id="shadow" x="-40%" y="-30%" width="180%" height="180%"><feDropShadow dx="3" dy="8" stdDeviation="3" flood-color="#465638" flood-opacity=".16"/></filter><pattern id="grid" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M22 0H0v22" fill="none" stroke="#d8decb" stroke-width=".8"/></pattern></defs>`;

function rocket(x = 300, y = 305, scale = 1, extra = '') {
  if (progress.shipDesign) {
    return `<g class="${extra}" transform="translate(${x} ${y}) scale(${scale})"><g filter="url(#shadow)"><path d="M-26 128q-11 28 3 60l23-18 20 18q15-35 5-60" fill="#eab856" class="flame"/><path d="M-12 128q-7 23 12 43 17-21 12-43" fill="#f9df91" class="flame"/><image class="custom-ship" href="${progress.shipDesign}" x="-110" y="-91" width="220" height="219" preserveAspectRatio="xMidYMax meet"/></g></g>`;
  }
  return `<g class="${extra}" transform="translate(${x} ${y}) scale(${scale})"><g filter="url(#shadow)"><path d="M-40 68q-60 22-54 88l48-22z" fill="#b34e32"/><path d="M40 68q60 22 54 88l-48-22z" fill="#cf613d"/><path d="M-48 124V7Q-45-55 0-91 45-55 48 7v117Z" fill="#faf3d6" stroke="#52664b" stroke-width="2"/><path d="M-44-9Q-32-58 0-91 32-58 44-9Z" fill="#d75c3a"/><path d="M-43-10q43 13 86 0" fill="none" stroke="#aa4a32" stroke-width="3"/><path d="M-48 106h96v20h-96z" fill="#d15c39"/><path d="M-11 88 0 68 11 88v66H-11Z" fill="#dc6b42" stroke="#b84d32" stroke-width="1.5"/><circle cy="36" r="27" fill="#bac8a3" stroke="#61765b" stroke-width="6"/><circle cy="36" r="19" fill="#527c80"/><path d="M-10 23q12-7 20 3" fill="none" stroke="#a6c6ba" stroke-width="5" stroke-linecap="round"/><circle cx="-32" cy="90" r="2" fill="#899578"/><circle cx="32" cy="90" r="2" fill="#899578"/><path d="M-26 128q-11 28 3 60l23-18 20 18q15-35 5-60" fill="#eab856" class="flame"/><path d="M-12 128q-7 23 12 43 17-21 12-43" fill="#f9df91" class="flame"/></g></g>`;
}
function johnny(x = 245, y = 420, scale = 1, astronaut = false) {
  return `<g transform="translate(${x} ${y}) scale(${scale})" filter="url(#shadow)"><path d="m-18 38-6 51 16 1 10-37 9 37 17-2-7-50" fill="${astronaut?'#e5dec3':'#405d58'}"/><path d="M-26 88h19v9h-28q-2-7 9-9m36 0h19q11 4 9 9H10" fill="#354f46"/><path d="M-20-5q20-13 42 0l10 47q-24 12-57 0Z" fill="${astronaut?'#f7eed6':'#dfab51'}"/><path d="m-20 0-21 28-12-10-6 8q15 21 27 14l17-20m37-20 22 22 16-14 6 8q-18 27-29 19L20 22" fill="${astronaut?'#eee6ce':'#dca14a'}" stroke="#55654b" stroke-width="1"/><circle cx="-54" cy="19" r="7" fill="#d49b70"/><circle cx="63" cy="10" r="7" fill="#d49b70"/>${astronaut?'<circle cy="-36" r="39" fill="#f6eed8" stroke="#798e7b" stroke-width="4"/><circle cy="-35" r="31" fill="#bdd2bf"/>':''}<ellipse cy="-32" rx="25" ry="29" fill="#dfac7f"/><path d="M-25-32q-12-34 19-37 28-10 36 17l-10 15-4-18q-12 11-29 9l-9 15" fill="#5c4431"/><path d="m-25-45 5 22 5-19" fill="#5c4431"/><circle cx="-9" cy="-29" r="2" fill="#3b4334"/><circle cx="10" cy="-29" r="2" fill="#3b4334"/><path d="M-6-17q8 6 15-2" fill="none" stroke="#8d533e" stroke-width="2" stroke-linecap="round"/><circle cx="-17" cy="-21" r="4" fill="#d48b6e" opacity=".5"/><path d="M-8 1 0 13 9 1" fill="none" stroke="${astronaut?'#b2bba4':'#f2cd77'}" stroke-width="3"/>${astronaut?'<rect x="-10" y="17" width="24" height="16" rx="3" fill="#acbfb0"/><circle cx="-3" cy="24" r="2" fill="#d35f3d"/><path d="M3 24h7" stroke="#48685f" stroke-width="2"/>':''}</g>`;
}
function coverArt() {
  return `<svg class="cover-art" viewBox="0 0 600 570" role="group" aria-label="Johnny and his homemade rocket in a paper garden, under Earth, the Moon, and Mars">${defs}${littleStars}
  <path d="M10 462Q164 376 316 423t300-17v164H0Z" fill="#d8ddc0"/><path d="M-20 503q174-110 344-32t300-10v109H-20Z" fill="#b8c39e"/><path d="M40 570q156-119 336-68 79 22 224-6v74" fill="#a6b68a"/><path d="M77 570q56-53 129-78 50-18 72-39" fill="none" stroke="#e8dfbb" stroke-width="39"/>
  <ellipse cx="322" cy="502" rx="153" ry="20" fill="#82966e" opacity=".25"/>
  <g class="tap-art float" data-action="planet" tabindex="0" role="button" aria-label="Spin planet Earth"><circle cx="156" cy="128" r="58" fill="#6d9692"/><path d="m119 85 23-11 7 15 24 3 10 19-11 14-3 25-16 4-9-21-18-3-13-19zm45 77 23-13 15 9-14 20-18 3z" fill="#a8b78b"/><path d="M109 101q10-20 28-25" stroke="#abc3aa" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="156" cy="128" rx="93" ry="31" fill="none" stroke="#a2ae8a" stroke-width="1.3" stroke-dasharray="4 6" transform="rotate(-28 156 128)"/><circle cx="76" cy="160" r="17" fill="#d9d8be"/><circle cx="71" cy="155" r="4" fill="#c0c5a5"/><circle cx="82" cy="166" r="3" fill="#c0c5a5"/></g>
  <g class="tap-art slow-spin" data-action="planet" tabindex="0" role="button" aria-label="Spin Mars"><circle cx="442" cy="116" r="44" fill="#cc7150"/><path d="M412 86q14 17 39 10t27 15l-17 12-34-7-23-11m10 39q19-5 22 4t26 4" stroke="#ad5c42" stroke-width="10" fill="none" opacity=".6"/><circle cx="457" cy="88" r="7" fill="#df9468"/></g>
  <path d="M404 188q-6 17-30 20m5-9-9 10 14 2" stroke="#8d9876" fill="none" stroke-width="1.5" stroke-linecap="round"/>
  <g class="float">${rocket(348,310,.96)}</g>
  <g transform="translate(192 398) rotate(-13)"><path d="m-44 23 6-71 77-1 6 72z" fill="#bca37a"/><path d="m-38-48 13-18 78 2-14 17" fill="#d5bc90"/><path d="m39-47 14-17 8 72-16 15" fill="#a68c65"/><path d="M-21-46v30l13-5 11 5v-31" fill="#ebe0b9"/><path d="m-28 5 16-14M-28-9l16 14" stroke="#695f46" stroke-width="2"/><text x="4" y="10" font-family="Georgia" font-size="12" fill="#6b644a">UP ↑</text></g>
  ${johnny(241,405,.9)}
  <g stroke="#697f55" stroke-width="3" fill="none" stroke-linecap="round"><path d="m83 483-2-46m0 25-13-14m13 4 14-16m402 64 4-56m-4 30-14-15m17 1 14-15M131 530l-6-22m7 13 8-12"/></g><g fill="#e7c36b"><circle cx="80" cy="433" r="8"/><circle cx="503" cy="439" r="8"/><circle cx="518" cy="452" r="5"/></g><g fill="#f3e7bb"><circle cx="61" cy="499" r="4"/><circle cx="458" cy="522" r="5"/><circle cx="534" cy="499" r="3"/></g>
  <g transform="translate(432 365) rotate(12)"><path d="M0 0h40v28H0z" fill="#f5e9c7"/><path d="m3 5 14 8-5 7 12-3 8 6" fill="none" stroke="#788970" stroke-width="1.3"/><path d="m24 5 5 5m0-5-5 5" stroke="#d47348"/></g>
  </svg><span class="orbit-note">a very big dream ↗</span><span class="touch-tip">Psst… tap a planet! ✧</span>`;
}

const pages = [
  { title: 'Lil’ Johnny Builds to Mars', label: 'The cover', text: 'A little builder. A big dream. And a whole universe of possibilities.' },
  { title: 'A very big dream.', label: 'A spark of an idea', text: 'Johnny looked up at the twinkly sky. “One day, I’ll go to Mars!” he said. First, he needed a little starlight.', instruction: '<strong>Tap the five golden stars.</strong><br>Watch each one turn rainbow!' },
  { title: 'Let’s build a rocket!', label: 'The little workshop', text: 'A pointy top. Two sturdy fins. A window to see the stars. Johnny had all the pieces. Can you help?', instruction: '<strong>Drag each piece onto the rocket.</strong><br>You can also tap a piece, then tap the rocket.' },
  { title: 'Make it yours.', label: 'A splash of imagination', text: '“Let’s give our rocket some color!” said Johnny. Red fins? A purple nose? Pick your favorite crayons and make it yours!', instruction: '<strong>Color in the rocket with your finger.</strong><br>Your colored rocket will fly all the way to Mars!' },
  { title: 'Ready, set… whoosh!', label: 'Time for lift-off', text: 'Helmet? On. Snacks? Packed. Big dream? Ready! Johnny climbed inside. Mars was waiting.', instruction: '<strong>Hold the launch button.</strong><br>Fill the rocket with whoosh-power!' },
  { title: 'Hello, red planet!', label: 'A brand-new world', text: 'Bump! The rocket landed on soft, rusty sand. “We did it!” laughed Johnny. “We really made it to Mars!”', instruction: '<strong>Tap the little flag to plant it.</strong><br>A tiny flag for a very big adventure.' },
  { title: 'Little hands.<br><em>Limitless dreams.</em>', label: 'The beginning of everything', text: 'Johnny built a rocket. You helped him fly. What wonderful thing will you build next?', instruction: '<strong>The end… for now.</strong><br>Every adventure begins with “what if?”' }
];

function tell(message) { $('#live').textContent = message; const status = $('#status'); if (status) status.textContent = message; }
function tone(frequency = 550, duration = .16) {
  if (!soundOn) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    audioContext.resume();
    const oscillator = audioContext.createOscillator(), gain = audioContext.createGain();
    oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gain.gain.setValueAtTime(.1, audioContext.currentTime); gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + duration);
    oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.start(); oscillator.stop(audioContext.currentTime + duration);
  } catch (_) { /* Sound is optional on browsers without Web Audio. */ }
}
function celebrate() {
  tone(660,.3);
  const layer = document.createElement('div'); layer.className = 'celebration'; layer.setAttribute('aria-hidden','true');
  for (let i=0;i<30;i++) { const piece = document.createElement('i'); piece.className='confetti'; piece.style.cssText=`left:${Math.random()*100}%;background:${['#d65e3a','#e8bd61','#6f927b','#efe7c7'][i%4]};animation-delay:${Math.random()*.7}s;transform:rotate(${i*27}deg)`; layer.append(piece); }
  $('#scene').append(layer); setTimeout(() => layer.remove(),3500);
}
function art(content, night = false) {
  $('#scene').className = `scene${night?' night':''}`;
  $('#scene').innerHTML = `<div class="activity-scene"><svg class="activity-svg" viewBox="0 0 600 570" aria-hidden="true">${defs}${content}</svg></div>`;
}
function baseGround(mars = false) {
  return `<path d="M0 438q140-45 310-5t290-12v149H0Z" fill="${mars?'#c78055':'#ccd4b3'}"/><path d="M0 506q180-70 330-10t270-14v88H0Z" fill="${mars?'#b76b48':'#b3c29a'}"/><ellipse cx="314" cy="507" rx="130" ry="17" fill="${mars?'#935236':'#7d9367'}" opacity=".25"/>`;
}
function render() {
  cleanup(); cleanup=()=>{};
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  $('#read').classList.remove('speaking'); $('#read').setAttribute('aria-label','Read this page aloud');
  const p = pages[page];
  $('#story').className='story page-enter';
  $('#story').innerHTML=page===0 ? `<div class="eyebrow">An interactive storybook</div><h1>Lil’ Johnny <br>Builds to<br><em class="underline">Mars.</em></h1><p class="intro">A little builder. A big dream.<br>And a whole universe of possibilities.</p><button class="primary" id="start">Open the book <span>↗</span></button><p class="interaction-note">✧ A story to tap, build & explore</p><div class="cover-stamp"><span class="stamp-star">✺</span> For the dreamer in every little one.</div>` : `<div class="eyebrow">${String(page).padStart(2,'0')} / ${p.label}</div><h2>${p.title}</h2><p class="story-copy">${p.text}</p><p class="instruction">${p.instruction}</p><p id="status" class="activity-status" aria-live="polite"></p><div id="controls" class="activity-controls"></div>`;
  $('#previous').disabled=page===0; $('#next').disabled=page===pages.length-1;
  $('#next .nav-label').textContent=page===0?'Let’s begin':page===pages.length-1?'The end':'Turn the page';
  $('#page-count').textContent=page===0?'THE COVER':`${page} OF ${pages.length-1} · ${page===pages.length-1?'THE END':'THE ADVENTURE'}`;
  $('#page-dots').innerHTML=pages.map((p,i)=>`<button class="page-dot${i===page?' active':''}" aria-label="${i===0?'Cover':`Page ${i}: ${p.label}`}" ${i===page?'aria-current="page"':''} data-page="${i}"></button>`).join('');
  document.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>go(Number(b.dataset.page))));
  $('#live').textContent='';
  if (page===0) {
    $('#scene').className='scene'; $('#scene').innerHTML=coverArt(); $('#start').onclick=()=>go(1);
    document.querySelectorAll('[data-action="planet"]').forEach(el=>{ const spin=()=>{ el.classList.remove('wiggle'); void el.getBoundingClientRect(); el.classList.add('wiggle'); tone(420); tell('A whole universe to explore!'); }; el.onclick=spin; el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();spin();}}; });
  } else if(page===1) renderStars();
  else if(page===2) renderBuild();
  else if(page===3) renderDraw();
  else if(page===4) renderLaunch();
  else if(page===5) renderMars();
  else renderEnd();
}
function go(index) { if(index<0||index>=pages.length)return; page=index; tone(360,.1); render(); }

function renderStars() {
  art(`<circle cx="467" cy="105" r="43" fill="#e7ddb4"/><circle cx="453" cy="95" r="9" fill="#d1c79f"/><circle cx="481" cy="119" r="6" fill="#d1c79f"/>${littleStars}<path d="M0 465q140-70 290-18t310-8v131H0Z" fill="#57745b"/><path d="M0 523q170-83 350-28t250 0v75H0Z" fill="#3c5c49"/>${johnny(285,426,1.1)}<path d="M203 523h180" stroke="#9aac7d" stroke-width="2" stroke-linecap="round"/>`,true);
  const positions=[[15,17],[43,8],[66,35],[25,43],[79,58]];
  positions.forEach(([x,y],i)=>{
    const b=document.createElement('button'), found=progress.stars.has(i);
    b.className=`star-button${found?' found':''}`; b.style.cssText=`left:${x}%;top:${y}%`;
    b.innerHTML='<span aria-hidden="true">✦</span>';
    b.setAttribute('aria-label',found?`Rainbow star ${i+1} collected`:`Collect star ${i+1}`); b.disabled=found;
    b.onclick=()=>{
      if(progress.stars.has(i)) return;
      progress.stars.add(i); b.classList.add('found'); b.disabled=true;
      b.setAttribute('aria-label',`Rainbow star ${i+1} collected`);
      tone(440+progress.stars.size*100); update(); if(progress.stars.size===5)celebrate();
    };
    $('.activity-scene').append(b);
  });
  function update(){tell(progress.stars.size===5?'Five little sparks. One BIG idea!':`${progress.stars.size} of 5 stars collected ✦`);} update();
}

const parts = [
  {id:'nose',name:'pointy top',svg:'<path d="M10 65Q12 27 40 5q28 22 30 60Z" fill="#d75c3a" stroke="#a44b31" stroke-width="2"/>'},
  {id:'fins',name:'rocket fins',svg:'<path d="M32 10Q2 25 4 65l28-16zm16 0q30 15 28 55L48 49Z" fill="#ce603d" stroke="#a44b31" stroke-width="2"/>'},
  {id:'window',name:'round window',svg:'<circle cx="40" cy="36" r="27" fill="#bac8a3" stroke="#61765b" stroke-width="6"/><circle cx="40" cy="36" r="19" fill="#527c80"/><path d="M30 25q12-7 20 3" stroke="#a6c6ba" stroke-width="4" fill="none"/>'}
];
function renderBuild() {
  art(`${littleStars}${baseGround()}<path d="M44 510v-95m0 34 15-18m-15 40-14-21" stroke="#7d9167" stroke-width="3" fill="none"/><g transform="translate(320 258)"><path d="M-50 166V40Q-47-23 0-61 47-23 50 40v126Z" fill="#f8f0d2" stroke="#829275" stroke-width="2"/><path d="M-45 24Q-32-25 0-61 32-25 45 24Z" fill="${progress.parts.has('nose')?'#d75c3a':'#dedfc8'}" stroke="#8e9b7f" stroke-dasharray="5 5"/><g id="fins-shape" fill="${progress.parts.has('fins')?'#ce603d':'#dedfc8'}" stroke="#8e9b7f" stroke-dasharray="5 5"><path d="M-45 105q-63 20-57 85l57-26Z"/><path d="M45 105q63 20 57 85l-57-26Z"/></g><circle id="window-shape" cy="75" r="28" fill="${progress.parts.has('window')?'#527c80':'#dedfc8'}" stroke="#829275" stroke-width="5" stroke-dasharray="5 5"/><path d="M-50 147H50v20H-50" fill="#d4b36d"/></g>${johnny(134,380,.8)}`);
  const container=$('.activity-scene'); const target=document.createElement('button');target.className='drop-target';target.setAttribute('aria-label','Place selected piece on the rocket');container.append(target);
  const tray=document.createElement('div');tray.className='build-pieces';tray.innerHTML=parts.map(p=>`<button class="piece${progress.parts.has(p.id)?' placed':''}" data-part="${p.id}" aria-label="Select ${p.name}" ${progress.parts.has(p.id)?'disabled':''}><svg viewBox="0 0 80 75" aria-hidden="true">${p.svg}</svg></button>`).join(''); container.append(tray);
  let selected=null;
  target.onclick=()=>{if(selected)place(selected);else tell('Pick a piece below, then tap the rocket.');};
  function place(id){ if(progress.parts.has(id))return;progress.parts.add(id);selected=null;tone(500+progress.parts.size*110);renderBuild();if(progress.parts.size===3)celebrate(); }
  tray.querySelectorAll('.piece:not(.placed)').forEach(b=>{
    b.onclick=()=>{selected=b.dataset.part;tray.querySelectorAll('.piece').forEach(p=>p.classList.toggle('selected',p===b));tell('Now tap the rocket to add this piece.');};
    let origin=null, moved=false;
    b.onpointerdown=e=>{origin={x:e.clientX,y:e.clientY};moved=false;b.setPointerCapture(e.pointerId);};
    b.onpointermove=e=>{if(!origin)return;const dx=e.clientX-origin.x,dy=e.clientY-origin.y;if(Math.abs(dx)+Math.abs(dy)>8)moved=true;if(moved)b.style.transform=`translate(${dx}px,${dy}px)`;};
    b.onpointerup=e=>{if(!origin)return;origin=null;b.style.transform='';if(moved){const r=target.getBoundingClientRect();if(e.clientX>=r.left-35&&e.clientX<=r.right+35&&e.clientY>=r.top-35&&e.clientY<=r.bottom+35)place(b.dataset.part);else tell('Bring the piece onto the rocket. Try again!');}};
    b.onpointercancel=()=>{origin=null;b.style.transform='';};
  });
  tell(progress.parts.size===3?'Built with a little help from YOU!':`${progress.parts.size} of 3 pieces in place`);
}

// Remove empty paper around the artwork so even a small drawing is visible in flight.
function cropShipDrawing(canvas) {
  const { width, height } = canvas;
  const pixels = canvas.getContext('2d').getImageData(0, 0, width, height).data;
  let left = width, top = height, right = -1, bottom = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (pixels[(y * width + x) * 4 + 3] > 0) {
        left = Math.min(left, x); right = Math.max(right, x);
        top = Math.min(top, y); bottom = Math.max(bottom, y);
      }
    }
  }
  if (right < left) return null;
  const cropped = document.createElement('canvas');
  cropped.width = right - left + 1; cropped.height = bottom - top + 1;
  cropped.getContext('2d').drawImage(canvas, left, top, cropped.width, cropped.height, 0, 0, cropped.width, cropped.height);
  return cropped.toDataURL();
}

function renderDraw() {
  art(`${littleStars}${baseGround()}<g transform="rotate(-7 110 400)"><path d="M70 360h92v75H70z" fill="#dec591"/><path d="m76 373 55 39m-55 0 55-39" stroke="#9b8259" stroke-width="2"/></g><path d="m479 475 42-90 10 5-39 91-14 13Z" fill="#d5633d"/><path d="m478 475 14 6-14 13Z" fill="#e8d2a0"/><path d="m478 486 4 3-4 5" fill="#3e564b"/>`);
  const board = document.createElement('div');
  board.className = 'draw-board';
  board.innerHTML = '<canvas aria-label="Coloring area: color in the rocket outline here"></canvas>';
  $('.activity-scene').append(board);
  const canvas = $('canvas'), ctx = canvas.getContext('2d');
  const paint = document.createElement('canvas'), pen = paint.getContext('2d');
  canvas.width = paint.width = 900; canvas.height = paint.height = 600;
  pen.lineCap = 'round'; pen.lineJoin = 'round'; pen.lineWidth = 32;
  const silhouette = new Path2D('M350 340Q270 375 260 515L350 475V490H550V475L640 515Q630 375 550 340V240Q550 135 450 55Q350 135 350 240Z');
  const details = new Path2D('M350 340V475M550 340V475M356 210Q450 235 544 210M350 460H550M430 490V433L450 399L470 433V490M508 300A58 58 0 1 0 392 300A58 58 0 1 0 508 300');
  let color = '#e24b4b', tool = 'crayon', drawing = false, restoreImage = null, active = true;
  let actionBefore = null, strokePointer = null;
  function checkpoint() {
    actionBefore = { uri: paint.toDataURL(), pixels: pen.getImageData(0, 0, paint.width, paint.height) };
  }
  function updateUndo() {
    const button = $('#undo');
    if (button) button.disabled = !!restoreImage || drawing || progress.drawingHistory.length === 0;
    const redo = $('#redo');
    if (redo) redo.disabled = !!restoreImage || drawing || progress.drawingRedo.length === 0;
  }
  // Fill against the outline alone, so existing crayon marks never split a part.
  const boundary = document.createElement('canvas');
  boundary.width = canvas.width; boundary.height = canvas.height;
  const edge = boundary.getContext('2d');
  edge.lineWidth = 7; edge.lineJoin = 'round'; edge.lineCap = 'round';
  edge.stroke(silhouette); edge.stroke(details);
  const walls = edge.getImageData(0, 0, boundary.width, boundary.height).data;
  function fillPart(p) {
    const x = Math.floor(p.x), y = Math.floor(p.y), width = canvas.width, height = canvas.height;
    if (x < 0 || y < 0 || x >= width || y >= height || !ctx.isPointInPath(silhouette, p.x, p.y)) {
      tell('Tap inside a rocket part to fill it!'); return;
    }
    const start = y * width + x;
    if (walls[start * 4 + 3]) { tell('Tap a little farther inside the outline.'); return; }
    const seen = new Uint8Array(width * height), queue = new Int32Array(width * height);
    const fillCanvas = document.createElement('canvas');
    fillCanvas.width = width; fillCanvas.height = height;
    const fillCtx = fillCanvas.getContext('2d'), pixels = fillCtx.createImageData(width, height);
    const rgb = [1, 3, 5].map(i => parseInt(color.slice(i, i + 2), 16));
    let head = 0, tail = 1; queue[0] = start; seen[start] = 1;
    function visit(i) {
      if (!seen[i] && !walls[i * 4 + 3]) { seen[i] = 1; queue[tail++] = i; }
    }
    while (head < tail) {
      const i = queue[head++], offset = i * 4, column = i % width;
      pixels.data[offset] = rgb[0]; pixels.data[offset + 1] = rgb[1];
      pixels.data[offset + 2] = rgb[2]; pixels.data[offset + 3] = 255;
      if (column > 0) visit(i - 1);
      if (column < width - 1) visit(i + 1);
      if (i >= width) visit(i - width);
      if (i < width * (height - 1)) visit(i + width);
    }
    checkpoint();
    fillCtx.putImageData(pixels, 0, 0); pen.globalCompositeOperation = 'source-over'; pen.drawImage(fillCanvas, 0, 0);
    compose(); remember(); tell('Splash! That part is ready for space.'); tone(620);
  }
  function compose() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fffef8'; ctx.fill(silhouette);
    ctx.save(); ctx.clip(silhouette); ctx.drawImage(paint, 0, 0); ctx.restore();
    ctx.strokeStyle = '#405b50'; ctx.lineWidth = 7; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.stroke(silhouette); ctx.stroke(details);
  }
  function remember() {
    const next = paint.toDataURL();
    if (actionBefore !== null && next !== actionBefore.uri) {
      progress.drawingHistory.push(actionBefore.pixels);
      if (progress.drawingHistory.length > 20) progress.drawingHistory.shift();
      progress.drawingRedo.length = 0;
    }
    actionBefore = null;
    progress.drawing = next;
    progress.shipDesign = cropShipDrawing(canvas);
    updateUndo();
  }
  compose();
  if (progress.drawing) {
    restoreImage = new Image();
    restoreImage.onload = () => {
      if (!active) return;
      pen.drawImage(restoreImage, 0, 0); restoreImage = null; compose(); remember();
    };
    restoreImage.src = progress.drawing;
  } else remember();
  const controls = $('#controls');
  controls.innerHTML = '<div class="drawing-tools" role="group" aria-label="Coloring tools"><button class="small-button" data-tool="crayon" aria-pressed="true">Crayon</button><button class="small-button" data-tool="bucket" aria-pressed="false">Paint bucket</button><button class="small-button" data-tool="eraser" aria-pressed="false">Erase</button></div><div class="palette" aria-label="Drawing colors">' + ['#e24b4b','#ec8b35','#efc443','#49a86a','#438ed5','#5556b3','#9656bf'].map((c,i) => `<button class="color-dot" style="background:${c}" data-color="${c}" aria-label="${['Red','Orange','Yellow','Green','Blue','Indigo','Purple'][i]} crayon" aria-pressed="${i===0}"></button>`).join('') + '</div><div class="drawing-actions"><button id="undo" class="small-button" disabled>Undo ↶</button><button id="redo" class="small-button" disabled>Redo ↷</button><button id="clear" class="small-button">Start over</button></div>';
  document.querySelectorAll('[data-tool]').forEach(b => b.onclick = () => {
    tool = b.dataset.tool;
    document.querySelectorAll('[data-tool]').forEach(t => t.setAttribute('aria-pressed', String(t === b)));
    tell(tool === 'bucket' ? 'Pick a color, then tap inside a rocket part!' : tool === 'eraser' ? 'Drag to erase color wherever you like!' : 'Draw and color with your crayon!');
  });
  document.querySelectorAll('[data-color]').forEach(b => b.onclick = () => {
    color = b.dataset.color;
    document.querySelectorAll('[data-color]').forEach(c => c.setAttribute('aria-pressed', String(c===b)));
    tone(500);
  });
  $('#clear').onclick = () => {
    if (restoreImage) return;
    save(); checkpoint(); pen.clearRect(0, 0, paint.width, paint.height); compose(); remember();
    tell('A fresh rocket to color in!');
  };
  $('#undo').onclick = () => {
    if (drawing || restoreImage || progress.drawingHistory.length === 0) return;
    progress.drawingRedo.push(pen.getImageData(0, 0, paint.width, paint.height));
    const previous = progress.drawingHistory.pop();
    pen.putImageData(previous, 0, 0);
    compose(); remember(); tell('Last action undone!'); tone(480);
  };
  $('#redo').onclick = () => {
    if (drawing || restoreImage || progress.drawingRedo.length === 0) return;
    progress.drawingHistory.push(pen.getImageData(0, 0, paint.width, paint.height));
    pen.putImageData(progress.drawingRedo.pop(), 0, 0);
    compose(); remember(); tell('Your action is back!'); tone(620);
  };
  updateUndo();
  // Invert the tilted paper so finger strokes stay under the pointer.
  function point(e) {
    const r = canvas.getBoundingClientRect(), angle = -3 * Math.PI / 180;
    const dx = e.clientX - (r.left + r.width/2), dy = e.clientY - (r.top + r.height/2);
    return {x: (dx*Math.cos(angle)+dy*Math.sin(angle))/canvas.clientWidth*900+450,
      y: (-dx*Math.sin(angle)+dy*Math.cos(angle))/canvas.clientHeight*600+300};
  }
  canvas.onpointerdown = e => {
    if (restoreImage || drawing) return;
    if (tool === 'bucket') { fillPart(point(e)); return; }
    checkpoint(); drawing = true; strokePointer = e.pointerId; canvas.setPointerCapture(e.pointerId); updateUndo();
    pen.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    pen.lineWidth = tool === 'eraser' ? 60 : 32;
    const p = point(e); pen.strokeStyle = color; pen.beginPath(); pen.moveTo(p.x,p.y);
    pen.lineTo(p.x+.1,p.y+.1); pen.stroke(); compose();
  };
  canvas.onpointermove = e => {
    if (!drawing || e.pointerId !== strokePointer) return;
    const p = point(e); pen.lineTo(p.x,p.y); pen.stroke(); compose();
  };
  const save = (e) => {
    if (!drawing || (e && e.pointerId !== strokePointer)) return;
    drawing = false; strokePointer = null; pen.globalCompositeOperation = 'source-over';
    remember(); tell(tool === 'eraser' ? 'Erased! You can color that spot again.' : 'Your colored rocket is ready for lift-off!'); tone(620);
  };
  canvas.onpointerup = save; canvas.onpointercancel = save; canvas.onlostpointercapture = save;
  cleanup = () => { save(); active = false; };
  tell('Choose a crayon and color your rocket!');
}

function renderLaunch() {
  art(`${littleStars}<path d="M0 466q182-40 340-2t260-9v115H0Z" fill="#acbc96"/><path d="M210 456h193v13H210z" fill="#7f9271"/><path d="M205 475h206" stroke="#6e8362" stroke-width="3"/><g class="launch-rocket">${rocket(310,286,.95)}</g><g fill="#efeddb"><ellipse cx="228" cy="474" rx="48" ry="20"/><ellipse cx="390" cy="475" rx="50" ry="22"/></g>`);
  $('#controls').innerHTML='<button class="primary hold-button" id="launch">Hold to launch <span>↑</span></button>';$('#controls').insertAdjacentHTML('afterend','<div class="fuel-meter" role="progressbar" aria-label="Whoosh power" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div>');
  let fuel=0,interval=null,done=false;
  const button=$('#launch'),meter=$('.fuel-meter');
  function stop(){clearInterval(interval);interval=null;if(!done&&fuel>0)tell('Nearly there! Hold again to keep fueling.');}
  function start(){if(done||interval)return;button.textContent='Keep holding…';interval=setInterval(()=>{fuel=Math.min(100,fuel+3);meter.firstElementChild.style.width=`${fuel}%`;meter.setAttribute('aria-valuenow',fuel);if(fuel%15===0)tone(180+fuel*4,.12);if(fuel===100){done=true;stop();progress.launched=true;$('.activity-scene').classList.add('launched');button.textContent='Blast off! ✦';button.disabled=true;tell('WHOOOOSH! Next stop: Mars!');celebrate();}},60);}
  button.onpointerdown=e=>{button.setPointerCapture(e.pointerId);start();};button.onpointerup=stop;button.onpointercancel=stop;button.onlostpointercapture=stop;
  button.onkeydown=e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();start();}};button.onkeyup=e=>{if(e.key===' '||e.key==='Enter')stop();};button.onblur=stop;
  cleanup=()=>clearInterval(interval);tell('Press and hold. Let’s go to Mars!');
}

function renderMars() {
  art(`${littleStars}<circle cx="113" cy="106" r="28" fill="#74998f"/><path d="m94 91 13-10 14 14-8 14-13-5m19 12 13 2-8 10" fill="#b7c5a0"/>${baseGround(true)}<g transform="translate(458 348) scale(.55)">${rocket(0,0,.8)}</g>${johnny(252,401,1.15,true)}<ellipse cx="83" cy="491" rx="26" ry="9" fill="#9c583e"/><ellipse cx="498" cy="534" rx="34" ry="9" fill="#9c583e"/><path d="m348 501 14 3m14 8 14 3m-72-21 12 2" stroke="#8e5239" stroke-width="5" stroke-linecap="round"/><g id="flag-art" transform="translate(335 ${progress.flag?310:240})"><path d="M0 0v169" stroke="#ecdfb6" stroke-width="5"/><path d="M2 0q30 12 62 1v45q-32 14-62-1Z" fill="#e9c069" stroke="#bb914c"/><path d="m31 10 4 9 10 1-8 7 2 10-9-5-8 5 2-10-7-7 10-1Z" fill="#c75d3d"/></g>`,true);
  const button=document.createElement('button');button.className='drop-target mars-flag';button.style.cssText='inset:43% 19% 12% 48%';button.setAttribute('aria-label','Plant the flag on Mars');button.onclick=()=>{if(progress.flag){tell('You and Johnny: official Mars explorers!');tone(650);return;}progress.flag=true;$('#flag-art').setAttribute('transform','translate(335 310)');tell('One small flag. One giant dream. You did it!');celebrate();};$('.activity-scene').append(button);tell(progress.flag?'You and Johnny: official Mars explorers!':'The flag is ready. Give it a tap!');
}

function renderEnd() {
  art(`${littleStars}${baseGround()}<circle cx="330" cy="245" r="160" fill="#e6dfba"/><circle cx="330" cy="245" r="142" fill="none" stroke="#c0bb94" stroke-dasharray="3 9"/><path d="m332 111 16 32 37 5-27 27 6 36-32-17-33 17 7-36-27-27 37-5Z" fill="#d8ab50"/><text x="330" y="249" text-anchor="middle" fill="#45614a" font-family="Georgia" font-size="31">Official little</text><text x="330" y="291" text-anchor="middle" fill="#45614a" font-family="Georgia" font-style="italic" font-size="45">space explorer</text><text x="330" y="329" text-anchor="middle" fill="#7a8568" font-family="Trebuchet MS" font-size="11" letter-spacing="3">BIG DREAMS START WITH YOU</text>${johnny(152,425,.9,true)}<g transform="rotate(16 490 390)">${rocket(490,390,.36)}</g>`);
  $('#controls').innerHTML='<button class="primary replay" id="replay">Read it again <span>↺</span></button>';
  $('#replay').onclick=()=>{progress.stars.clear();progress.parts.clear();progress.drawing=null;progress.drawingHistory.length=0;progress.drawingRedo.length=0;progress.shipDesign=null;progress.launched=false;progress.flag=false;go(0);};
  tell('Keep building. Keep dreaming.');
}

$('#previous').onclick=()=>go(page-1);$('#next').onclick=()=>go(page+1);
$('.brand').onclick=e=>{e.preventDefault();go(0);};
$('#sound').onclick=()=>{soundOn=!soundOn;$('#sound').setAttribute('aria-pressed',String(soundOn));$('#sound').setAttribute('aria-label',`Turn sound ${soundOn?'off':'on'}`);$('#sound').innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z${soundOn?'M15 8q4 4 0 8m3-11q7 7 0 14':'M16 9l5 6m0-6-5 6'}"/></svg>`;tone();};
$('#read').onclick=()=>{
  if(!('speechSynthesis' in window)){tell('Read-aloud is not available in this browser. Enjoy reading together!');return;}
  if(window.speechSynthesis.speaking){window.speechSynthesis.cancel();$('#read').setAttribute('aria-label','Read this page aloud');return;}
  const p=pages[page], utterance=new SpeechSynthesisUtterance(`${p.title.replace(/<[^>]*>/g,' ')}. ${p.text} ${p.instruction?p.instruction.replace(/<br>/g,' ').replace(/<[^>]*>/g,''):''}`);
  utterance.rate=.85;utterance.pitch=1.08;utterance.lang='en-US';$('#read').setAttribute('aria-label','Stop reading aloud');utterance.onend=()=>$('#read').setAttribute('aria-label','Read this page aloud');utterance.onerror=()=>{tell('Read-aloud could not start. Try again or read together.');$('#read').setAttribute('aria-label','Read this page aloud');};window.speechSynthesis.speak(utterance);
};
document.addEventListener('keydown',e=>{if(e.target.matches('input,textarea,button,canvas'))return;if(e.key==='ArrowRight'){e.preventDefault();go(page+1);}if(e.key==='ArrowLeft'){e.preventDefault();go(page-1);}});
render();
