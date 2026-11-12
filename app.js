/* BLR Center strategy deck: navigation, reveal, tabs, map, roadmap, decisions */
(function () {
  var deck = document.getElementById('deck');
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var n = slides.length;
  var counter = document.getElementById('counter');
  var bar = document.getElementById('bar');

  /* ---- slide navigation ---- */
  function current() {
    var h = deck.clientHeight;
    return Math.min(n - 1, Math.max(0, Math.round(deck.scrollTop / h)));
  }
  function go(i) {
    i = Math.min(n - 1, Math.max(0, i));
    slides[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function update() {
    var i = current();
    counter.textContent = (i + 1) + ' / ' + n;
    bar.style.width = ((i + 1) / n * 100) + '%';
    slides.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
    if (history.replaceState) history.replaceState(null, '', '#' + slides[i].id);
  }
  deck.addEventListener('scroll', function () { window.requestAnimationFrame(update); });
  document.getElementById('next').addEventListener('click', function () { go(current() + 1); });
  document.getElementById('prev').addEventListener('click', function () { go(current() - 1); });
  deck.setAttribute('tabindex', '-1');
  deck.style.outline = 'none';
  window.addEventListener('load', function () { deck.focus({ preventScroll: true }); });
  deck.addEventListener('mousedown', function (e) { if (!e.target.closest('button,[tabindex]')) deck.focus({ preventScroll: true }); });
  window.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    var onWidget = e.target.closest && e.target.closest('.flip,.phase,#decisions li,.pin,.tab,.navbtn,.notesbtn');
    if (onWidget && (e.key === ' ' || e.key === 'Enter')) return;
    if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].indexOf(e.key) > -1) { e.preventDefault(); go(current() + 1); }
    if (['ArrowUp', 'ArrowLeft', 'PageUp'].indexOf(e.key) > -1) { e.preventDefault(); go(current() - 1); }
    if (e.key === 'Home') go(0);
    if (e.key === 'End') go(n - 1);
  }, true);
  if (location.hash) {
    var target = document.querySelector(location.hash);
    if (target) setTimeout(function () { target.scrollIntoView(); }, 50);
  }
  update();

  /* ---- tap-to-open cards ---- */
  function toggleFlip(el) {
    var opening = !el.classList.contains('open');
    var group = el.parentElement;
    Array.prototype.forEach.call(group.querySelectorAll('.flip.open'), function (x) { if (x !== el) x.classList.remove('open'); });
    el.classList.toggle('open', opening);
    group.classList.toggle('has-open', opening);
  }
  Array.prototype.forEach.call(document.querySelectorAll('.flip'), function (el) {
    el.addEventListener('click', function () { toggleFlip(el); });
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFlip(el); } });
  });

  /* ---- concern tabs ---- */
  var tabs = document.querySelectorAll('#concernTabs .tab');
  Array.prototype.forEach.call(tabs, function (t) {
    t.addEventListener('click', function () {
      Array.prototype.forEach.call(tabs, function (x) { x.setAttribute('aria-selected', 'false'); });
      t.setAttribute('aria-selected', 'true');
      Array.prototype.forEach.call(document.querySelectorAll('.panel'), function (p) { p.removeAttribute('data-active'); });
      document.getElementById(t.getAttribute('data-p')).setAttribute('data-active', '');
    });
  });

  /* ---- channel phases ---- */
  var phaseBtns = document.querySelectorAll('#phasebar .tab');
  var channels = document.querySelectorAll('#channels .ch');
  Array.prototype.forEach.call(phaseBtns, function (b) {
    b.addEventListener('click', function () {
      Array.prototype.forEach.call(phaseBtns, function (x) { x.setAttribute('aria-selected', 'false'); });
      b.setAttribute('aria-selected', 'true');
      var ph = b.getAttribute('data-ph');
      Array.prototype.forEach.call(channels, function (c) {
        var mine = c.getAttribute('data-ph') === ph;
        c.classList.toggle('dim', ph !== 'all' && !mine);
        c.classList.toggle('lit', ph !== 'all' && mine);
      });
    });
  });

  /* ---- partner map ---- */
  var partners = [
    { name: 'R.A.G.E.', focus: 'Resident Association of Greater Englewood. Resident organizing, Englewood Village Meetings, outreach.', lead: 'Asiaha Butler, Co-founder and CEO. Mekazin Alexander, Board Chair.', opp: 'Resident engagement, events, co-posting to an existing Englewood audience' },
    { name: 'Grow Greater Englewood', focus: 'Food sovereignty, urban agriculture, Urban Earth Corps, land stewardship.', lead: 'L. Anton Seals Jr., Executive Director. Atara Young, Board President.', opp: 'Green jobs, youth development, sustainability education' },
    { name: 'Greater Englewood CDC', focus: 'Small business development, entrepreneurship, training, economic development.', lead: 'Shirley Oliphant, Director of Finance and Entrepreneur Center. John Gholar, Board Chair.', opp: 'Small-business features, workforce and training resources' },
    { name: 'Imagine Englewood if', focus: 'Youth programs, environmental awareness, family wellness, We Grow Chicago.', lead: 'Leadership to confirm on the official site.', opp: 'Youth programming, community storytelling and events' },
    { name: 'IMAN', focus: 'Inner-City Muslim Action Network. Health, arts, organizing, Go Green on Racine, Green ReEntry.', lead: 'Leadership to confirm on the official site.', opp: 'Green enterprise, healthy food, community wellness' }
  ];
  var pins = document.querySelectorAll('.pin');
  function showPartner(i, pin) {
    var p = partners[i];
    document.getElementById('infoName').textContent = p.name;
    document.getElementById('infoFocus').textContent = p.focus;
    document.getElementById('infoLead').textContent = p.lead;
    document.getElementById('infoOpp').textContent = 'Opportunity: ' + p.opp;
    Array.prototype.forEach.call(pins, function (x) { x.classList.remove('on'); });
    pin.classList.add('on');
  }
  Array.prototype.forEach.call(pins, function (pin) {
    var i = parseInt(pin.getAttribute('data-i'), 10);
    pin.addEventListener('click', function () { showPartner(i, pin); });
    pin.addEventListener('mouseenter', function () { showPartner(i, pin); });
    pin.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showPartner(i, pin); } });
  });

  /* ---- roadmap phases ---- */
  Array.prototype.forEach.call(document.querySelectorAll('#timeline .phase'), function (ph) {
    function open() {
      Array.prototype.forEach.call(document.querySelectorAll('#timeline .phase'), function (x) { x.classList.remove('open'); });
      ph.classList.add('open');
    }
    ph.addEventListener('click', open);
    ph.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });

  /* ---- decisions checklist ---- */
  var items = document.querySelectorAll('#decisions li');
  var count = document.getElementById('decCount');
  function refreshCount() {
    var done = document.querySelectorAll('#decisions li.done').length;
    count.textContent = done + ' of ' + items.length + ' agreed';
    if (done === items.length) count.textContent += '. We are cleared to launch.';
  }
  Array.prototype.forEach.call(items, function (li) {
    function flip() { li.classList.toggle('done'); li.querySelector('.box').textContent = li.classList.contains('done') ? '✓' : ''; refreshCount(); }
    li.addEventListener('click', flip);
    li.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
  });
})();

/* ---- speaker notes ---- */
(function () {
  var data = window.BLR_NOTES || {};
  var panel = document.createElement('aside');
  panel.className = 'notes'; panel.id = 'notes';
  panel.innerHTML = '<p class="k">Speaker notes</p><h4 id="notesTitle"></h4><ul id="notesList"></ul>';
  document.body.appendChild(panel);
  var btn = document.createElement('button');
  btn.className = 'notesbtn'; btn.id = 'notesBtn'; btn.textContent = 'Notes'; btn.title = 'Toggle speaker notes (N)';
  document.body.appendChild(btn);
  function render() {
    var active = document.querySelector('.slide.is-active') || document.querySelector('.slide');
    if (!active) return;
    var h = active.querySelector('h1,h2');
    document.getElementById('notesTitle').textContent = h ? h.textContent : '';
    var list = document.getElementById('notesList'); list.innerHTML = '';
    (data[active.id] || []).forEach(function (t) { var li = document.createElement('li'); li.textContent = t; list.appendChild(li); });
  }
  function toggle() { document.body.classList.toggle('show-notes'); render(); }
  btn.addEventListener('click', toggle);
  document.addEventListener('keydown', function (e) { if (e.key === 'n' || e.key === 'N') toggle(); });
  document.getElementById('deck').addEventListener('scroll', function () { window.requestAnimationFrame(render); });
  render();
})();
