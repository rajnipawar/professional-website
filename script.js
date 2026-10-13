const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

// ---------- Toast + clipboard ----------
const toast = $('#toast');
let toastTimer;
function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}
async function copyText(text, okMsg) {
    try {
        await navigator.clipboard.writeText(text);
        showToast(okMsg);
    } catch (e) {
        showToast('Copy failed: your browser blocked clipboard access');
    }
}

// ---------- Theme ----------
const root = document.documentElement;
const themeBtn = $('#theme-toggle');
function currentTheme() {
    return root.getAttribute('data-theme')
        || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}
function syncThemeIcon() {
    themeBtn.innerHTML = currentTheme() === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}
themeBtn.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    syncThemeIcon();
});
syncThemeIcon();

// ---------- Mobile menu ----------
const menuBtn = $('#menu-toggle');
const nav = $('#nav');
function setMenu(open) {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.innerHTML = open ? '<i class="fas fa-xmark"></i>' : '<i class="fas fa-bars"></i>';
}
menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
$$('a', nav).forEach(a => a.addEventListener('click', () => setMenu(false)));

// ---------- Scroll: progress, header, scroll spy ----------
const progress = $('#progress');
const header = $('#header');
const navLinks = $$('.nav-link');
const spyTargets = navLinks.map(l => $(l.getAttribute('href'))).filter(Boolean);

function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    header.classList.toggle('scrolled', y > 8);

    let current = spyTargets[0];
    for (const s of spyTargets) {
        if (s.id !== 'top' && s.offsetTop - 160 <= y) current = s;
    }
    if (y > 200 && y + window.innerHeight >= document.documentElement.scrollHeight - 4) current = spyTargets[spyTargets.length - 1];
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current.id));
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

$('#to-top-link').addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

// ---------- Typewriter rotator ----------
const rotator = $('#rotator');
const phrases = ['GPU data movement', 'HPC storage', 'smart storage systems with AI', 'tiered GPU memory'];
if (!reduceMotion) {
    let p = 0, i = phrases[0].length, deleting = true;
    const tick = () => {
        rotator.textContent = phrases[p].slice(0, i);
        let delay = deleting ? 35 : 70;
        if (deleting && i === 0) { deleting = false; p = (p + 1) % phrases.length; delay = 300; }
        else if (!deleting && i === phrases[p].length) { deleting = true; delay = 2000; }
        i += deleting ? -1 : 1;
        setTimeout(tick, delay);
    };
    setTimeout(tick, 2200);
}

// ---------- Reveal on scroll ----------
if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach((el, idx) => {
        el.style.transitionDelay = (idx % 4) * 60 + 'ms';
        io.observe(el);
    });
} else {
    $$('.reveal').forEach(el => el.classList.add('visible'));
}

// ---------- Cursor spotlight + card tilt ----------
if (finePointer && !reduceMotion) {
    $$('.spot, .proj-card').forEach(el => {
        el.addEventListener('pointermove', e => {
            const r = el.getBoundingClientRect();
            el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            el.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
    });
    $$('.proj-card').forEach(card => {
        card.addEventListener('pointermove', e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-4px)`;
        });
        card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
}

// Pause SVG (SMIL) animations for reduced motion
if (reduceMotion) $$('svg.illo').forEach(svg => svg.pauseAnimations && svg.pauseAnimations());

// ---------- Copy email ----------
$$('.copy-email').forEach(btn => btn.addEventListener('click', () => copyText(btn.dataset.email, 'Email address copied')));

// ---------- Project filter ----------
const projCards = $$('.proj-card');
$$('[data-pfilter]').forEach(chip => {
    chip.addEventListener('click', () => {
        const cat = chip.dataset.pfilter;
        $$('[data-pfilter]').forEach(c => c.classList.toggle('active', c === chip));
        projCards.forEach(card => card.classList.toggle('is-hidden', cat !== 'all' && card.dataset.cat !== cat));
        projGrid.scrollLeft = 0;
        buildDots();
    });
});

// ---------- Project slider (phone layout) ----------
const projGrid = $('.proj-grid');
const dotsEl = $('#proj-dots');
const prevBtn = $('#slide-prev');
const nextBtn = $('#slide-next');
const visibleCards = () => projCards.filter(c => !c.classList.contains('is-hidden'));
let currentSlide = 0;

function goToSlide(i) {
    const cards = visibleCards();
    const card = cards[Math.max(0, Math.min(i, cards.length - 1))];
    if (!card) return;
    projGrid.scrollTo({ left: card.offsetLeft - (projGrid.clientWidth - card.offsetWidth) / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
}
function syncSlider() {
    const cards = visibleCards();
    const center = projGrid.scrollLeft + projGrid.clientWidth / 2;
    let best = Infinity;
    cards.forEach((c, i) => {
        const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
        if (d < best) { best = d; currentSlide = i; }
    });
    [...dotsEl.children].forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide >= cards.length - 1;
}
function buildDots() {
    dotsEl.innerHTML = '';
    visibleCards().forEach((card, i) => {
        const dot = document.createElement('button');
        dot.className = 'proj-dot';
        dot.setAttribute('aria-label', 'Go to project ' + (i + 1));
        dot.addEventListener('click', () => goToSlide(i));
        dotsEl.appendChild(dot);
    });
    syncSlider();
}
prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
projGrid.addEventListener('scroll', syncSlider, { passive: true });
window.addEventListener('resize', syncSlider);
buildDots();

// ---------- Project dialog ----------
const projDialog = $('#proj-dialog');
const pdMedia = $('#pd-media');
const pdBody = $('#pd-body');
let lastFocus = null;

function openProject(key) {
    const card = $(`.proj-card[data-project="${key}"]`);
    if (!card) return;
    lastFocus = document.activeElement;
    const media = card.querySelector('.proj-media');
    pdMedia.className = 'pd-media ' + [...media.classList].filter(c => c.startsWith('media-')).join(' ');
    pdMedia.innerHTML = '';
    pdMedia.appendChild(card.querySelector('svg.illo').cloneNode(true));
    pdBody.innerHTML = '';
    pdBody.appendChild(card.querySelector('template.proj-detail').content.cloneNode(true));
    if (reduceMotion) { const s = pdMedia.querySelector('svg'); s && s.pauseAnimations && s.pauseAnimations(); }
    projDialog.showModal();
}
function closeProject() { projDialog.close(); }
projDialog.addEventListener('close', () => { lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true }); });

projCards.forEach(card => {
    card.addEventListener('click', () => openProject(card.dataset.project));
    card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProject(card.dataset.project); }
    });
});
$$('.open-proj').forEach(btn => btn.addEventListener('click', () => openProject(btn.dataset.open)));
$('#pd-close').addEventListener('click', closeProject);
projDialog.addEventListener('click', e => { if (e.target === projDialog) closeProject(); });

// Publication links inside the dialog jump to the filtered publication list
pdBody.addEventListener('click', e => {
    const link = e.target.closest('a[data-search]');
    if (!link) return;
    e.preventDefault();
    closeProject();
    focusPublication(link.dataset.search);
});

// ---------- Publications: search + filter ----------
const pubs = $$('.pub');
const years = $$('.pub-year');
const searchInput = $('#pub-search');
const segs = $$('.seg');
const countEl = $('#pub-count');
const emptyEl = $('#pub-empty');
let activeFilter = 'all';

pubs.forEach(p => $$('h3, .authors, .venue', p).forEach(el => { el.dataset.orig = el.innerHTML; }));

function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function highlight(el, query) {
    el.innerHTML = el.dataset.orig;
    if (!query) return;
    const re = new RegExp('(' + escapeRegExp(query) + ')', 'gi');
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
        if (!node.nodeValue.match(re)) return;
        const span = document.createElement('span');
        span.innerHTML = node.nodeValue
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(re, '<mark>$1</mark>');
        node.replaceWith(...span.childNodes);
    });
}

function applyPubFilters() {
    const q = searchInput.value.trim();
    const ql = q.toLowerCase();
    let shown = 0;
    pubs.forEach(p => {
        const visible = (activeFilter === 'all' || p.dataset.type === activeFilter)
            && (!ql || p.textContent.toLowerCase().includes(ql));
        p.classList.toggle('hidden', !visible);
        if (visible) {
            shown++;
            p.classList.add('visible');
            $$('h3, .authors, .venue', p).forEach(el => highlight(el, q));
        }
    });
    years.forEach(y => y.classList.toggle('hidden', !pubs.some(p => p.dataset.year === y.dataset.year && !p.classList.contains('hidden'))));
    emptyEl.hidden = shown !== 0;
    countEl.textContent = (q || activeFilter !== 'all') ? `Showing ${shown} of ${pubs.length}` : `${pubs.length} entries`;
}

segs.forEach(btn => btn.addEventListener('click', () => {
    activeFilter = btn.dataset.filter;
    segs.forEach(b => b.classList.toggle('active', b === btn));
    applyPubFilters();
}));
searchInput.addEventListener('input', applyPubFilters);
applyPubFilters();

// "/" focuses the publication search
document.addEventListener('keydown', e => {
    if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName) && !document.querySelector('dialog[open]')) {
        e.preventDefault();
        searchInput.focus();
    }
});

function focusPublication(query) {
    searchInput.value = query;
    activeFilter = 'all';
    segs.forEach(b => b.classList.toggle('active', b.dataset.filter === 'all'));
    applyPubFilters();
    $('#publications').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    const first = pubs.find(p => !p.classList.contains('hidden'));
    if (first) {
        first.classList.remove('flash');
        void first.offsetWidth;
        first.classList.add('flash');
    }
}

// ---------- BibTeX dialog ----------
const bibDialog = $('#bib-dialog');
const bibText = $('#bib-text');
$$('.bib-open').forEach(btn => btn.addEventListener('click', () => {
    bibText.textContent = btn.dataset.bib;
    bibDialog.showModal();
}));
$('#bib-close').addEventListener('click', () => bibDialog.close());
$('#bib-copy').addEventListener('click', () => copyText(bibText.textContent, 'BibTeX copied'));
bibDialog.addEventListener('click', e => { if (e.target === bibDialog) bibDialog.close(); });

// ---------- Experience year tabs ----------
const yearTabs = $$('.year-tab');
yearTabs.forEach(tab => tab.addEventListener('click', () => {
    yearTabs.forEach(t => {
        const on = t === tab;
        t.classList.toggle('active', on);
        t.setAttribute('aria-selected', String(on));
        $('#' + t.dataset.yearTab).hidden = !on;
    });
}));

// ---------- Footer year ----------
$('#year').textContent = new Date().getFullYear();
