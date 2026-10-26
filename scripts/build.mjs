// Renders public/index.html, public/technical/index.html and public/resume/index.html
// from data/resume.json (the single source of truth).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const d = JSON.parse(readFileSync(join(root, 'data', 'resume.json'), 'utf8'));

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Inline markup: **bold** only.
const md = (s = '') => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

const pdfHref = `/${d.meta.pdfFile}`;

// ---------- Shared page chrome ----------

const head = (title, description) => `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="noindex">
  <script>document.documentElement.classList.add('js');try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t;}catch(e){}</script>
  <link rel="preload" href="/fonts/ibm-plex-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/ibm-plex-sans-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/css/styles.css">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚙️</text></svg>">
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
`;

// page: 'home' | 'technical'. On home, in-page links are #anchors; elsewhere they point back to /.
const nav = (page) => {
  const home = page === 'home' ? '' : '/';
  const links = [
    [`${home}#projects`, 'Projects'],
    ['/technical/', 'Technical Projects'],
    [`${home}#leadership`, 'Leadership'],
    [`${home}#academics`, 'Academics'],
    [`${home}#honors`, 'Honors'],
  ];
  return `
<nav class="nav" aria-label="Main">
  <div class="nav-inner">
    <a class="nav-brand" href="${page === 'home' ? '#top' : '/'}">${esc(d.person.name)}</a>
    <button class="nav-toggle" id="navToggle" aria-label="Menu" aria-expanded="false" aria-controls="navLinks">Menu</button>
    <div class="nav-links" id="navLinks">${links
      .map(([href, label]) => {
        const current = page === 'technical' && href === '/technical/';
        return `
      <a href="${href}"${current ? ' class="active" aria-current="page"' : ''}>${label}</a>`;
      })
      .join('')}
    </div>
    <div class="nav-actions">
      <button class="theme-toggle" id="themeToggle" type="button" aria-label="Switch to dark mode">Dark</button>
      <a class="btn btn-primary btn-sm" href="${pdfHref}" download>Resume<span class="hide-sm"> (PDF)</span></a>
    </div>
  </div>
</nav>
`;
};

const footer = `
<footer class="footer">
  <div class="wrap">
    <div class="footer-links">
      <a href="mailto:${esc(d.person.email)}">${esc(d.person.email)}</a>
      <a href="${esc(d.person.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>
      <a href="${esc(d.person.teamPage)}" target="_blank" rel="noopener">The Orcas (team page)</a>
      <a href="/technical/">Technical Projects</a>
      <a href="/resume/">Resume (web version)</a>
    </div>
    <p>Last updated: ${esc(d.meta.lastUpdated)}</p>
  </div>
</footer>

<script src="/js/main.js" defer></script>
</body>
</html>
`;

const evidence = (items = []) =>
  items.length
    ? `<div class="evidence">${items
        .map((e) => {
          const ext = e.external || e.cert ? ' target="_blank" rel="noopener"' : '';
          return `<a class="chip${e.cert ? ' chip-cert' : ''}" href="${esc(e.href)}"${ext}>${e.cert ? '<span class="visually-hidden">Certificate: </span>' : ''}${esc(e.label)}${e.external ? ' <span aria-hidden="true">↗</span>' : ''}</a>`;
        })
        .join('')}</div>`
    : '';

// ---------- Home page ----------

const projectCard = (p) => `
        <article class="card${p.flagship ? ' card-flagship' : ''}" id="${esc(p.id)}">
          ${p.photo ? `<img class="card-photo" src="${esc(p.photo.src)}" alt="${esc(p.photo.alt)}" loading="lazy">` : ''}
          <header class="card-head">
            <h3>${esc(p.title)}</h3>
            <span class="dates">${esc(p.dates)}</span>
          </header>
          ${p.org ? `<p class="org">${esc(p.org)}</p>` : ''}
          <p class="role">${esc(p.role)}</p>
          <p class="result">${md(p.result)}</p>
          <ul class="bullets">${p.bullets.map((b) => `<li>${md(b)}</li>`).join('')}</ul>
          ${p.spec ? `<p class="spec">${esc(p.spec)}</p>` : ''}
          ${evidence(p.evidence)}
          ${p.technical ? `<a class="tech-link" href="/technical/#${esc(p.technical)}">Technical details <span aria-hidden="true">→</span></a>` : ''}
        </article>`;

const simpleCard = (x) => `
        <article class="card" id="${esc(x.id)}">
          <header class="card-head">
            <h3>${esc(x.title)}</h3>
            ${x.dates ? `<span class="dates">${esc(x.dates)}</span>` : ''}
          </header>
          ${x.org ? `<p class="org">${esc(x.org)}</p>` : ''}
          ${x.role ? `<p class="role">${esc(x.role)}</p>` : ''}
          <ul class="bullets">${x.bullets.map((b) => `<li>${md(b)}</li>`).join('')}</ul>
        </article>`;

const section = (id, title, body, { collapsible = false } = {}) =>
  collapsible
    ? `
  <section id="${id}" class="section">
    <details class="collapsible" open>
      <summary class="section-head"><h2>${esc(title)}</h2><span class="chevron" aria-hidden="true"></span></summary>
      <div class="collapsible-body">${body}
      </div>
    </details>
  </section>`
    : `
  <section id="${id}" class="section">
    <div class="section-head"><h2>${esc(title)}</h2></div>${body}
  </section>`;

const flagships = d.projects.filter((p) => p.flagship);
const moreProjects = d.projects.filter((p) => !p.flagship);
const a = d.academics;

const academicsBody = `
    <dl class="facts-list">
      <div><dt>School</dt><dd>${esc(a.school)}</dd></div>
      <div><dt>Current courses (Grade 12)</dt><dd>${esc(a.current)}</dd></div>
      <div><dt>${esc(a.asLevel.label)}</dt><dd>${a.asLevel.results
        .map(([s, g]) => `${esc(s)} <span class="grade">${esc(g)}</span>`)
        .join(', ')}<span class="note">${esc(a.asLevel.note)}</span></dd></div>
      <div><dt>${esc(a.igcse.label)}</dt><dd>${a.igcse.groups
        .map(([g, s]) => `<span class="grade">${esc(g)}</span> ${esc(s)}`)
        .join('<br>')}<span class="note">${esc(a.igcse.note)}</span></dd></div>
      <div><dt>SAT</dt><dd><span class="grade">${esc(a.sat.score)}</span> (${esc(a.sat.detail)})<span class="note">${esc(a.sat.siteNote)}</span></dd></div>
      <div><dt>${esc(a.ap.label)}</dt><dd><span class="grade">${esc(a.ap.score)}</span><span class="note">${esc(a.ap.note)}</span></dd></div>
    </dl>`;

const honorsBody = `
    <ol class="honors">${d.honors
      .map(
        (h) => `
      <li><span class="honor-text">${esc(h.text)}${
          h.cert ? ` <a class="chip chip-cert chip-sm" href="${esc(h.cert)}" target="_blank" rel="noopener">Certificate</a>` : ''
        }</span><span class="dates">${esc(h.year)}</span></li>`
      )
      .join('')}
    </ol>`;

const site = `${head(`${d.person.name} | Mechanical Engineering Portfolio`, d.person.identity)}${nav('home')}
<header class="hero" id="top">
  <div class="wrap">
    <h1>${esc(d.person.name)}</h1>
    <p class="identity">${esc(d.person.identity)}</p>
    <p class="bio">${esc(d.person.bio)}</p>
    <ul class="headline-facts">${d.headlineFacts
      .map((f) => `
      <li><span class="fact-key">${esc(f.key)}</span><span class="fact-text">${esc(f.text)}</span></li>`)
      .join('')}
    </ul>
    <div class="hero-actions">
      <a class="btn btn-primary" href="${pdfHref}" download>Download resume (PDF)</a>
      <a class="btn btn-secondary" href="#projects">View projects</a>
    </div>
  </div>
</header>

<main id="main" class="wrap">
${section(
  'projects',
  'Projects',
  `
      <div class="cards">${flagships.map(projectCard).join('')}
      </div>
      <h3 class="subhead">More engineering &amp; research</h3>
      <div class="cards cards-2">${moreProjects.map(projectCard).join('')}
      </div>`,
  { collapsible: true }
)}
${section(
  'leadership',
  'Leadership & Service',
  `
      <div class="cards cards-2">${d.leadership.map(simpleCard).join('')}
      </div>`,
  { collapsible: true }
)}
${section(
  'activities',
  'Other Activities',
  `
      <div class="cards cards-3">${d.activities.map(simpleCard).join('')}
      </div>
      <p class="interests"><strong>Interests:</strong> ${esc(d.interests)}</p>`,
  { collapsible: true }
)}
${section('academics', 'Academics', academicsBody)}
${section('honors', 'Honors & Awards', honorsBody)}
</main>
${footer}`;

// ---------- System diagrams (inline SVG, horizontal + vertical layouts) ----------

const LABEL_CH = 7.6; // approx px per char, 13px semibold
const SUB_CH = 6.7; // approx px per char, 11px mono
const boxSize = (n) => ({
  w: Math.max(96, Math.ceil(Math.max(n.label.length * LABEL_CH, (n.sub || '').length * SUB_CH)) + 28),
  h: n.sub ? 52 : 38,
});
const boxSvg = (n, x, y, w, h) => {
  const cx = x + w / 2;
  return `<rect class="dg-box" x="${x}" y="${y}" width="${w}" height="${h}" rx="7"/>` +
    `<text class="dg-label" x="${cx}" y="${n.sub ? y + 21 : y + h / 2 + 4.5}" text-anchor="middle">${esc(n.label)}</text>` +
    (n.sub ? `<text class="dg-sub" x="${cx}" y="${y + 38}" text-anchor="middle">${esc(n.sub)}</text>` : '');
};
const arrow = (x1, y1, x2, y2, mid) => `<line class="dg-edge" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#${mid})"/>`;
const marker = (mid) =>
  `<defs><marker id="${mid}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0 0L10 5L0 10z"/></marker></defs>`;

function describe(dg) {
  const parts = dg.nodes.map((n, i) => {
    const edge = i < dg.nodes.length - 1 && dg.edges && dg.edges[i] ? ` (via ${dg.edges[i]})` : '';
    return `${n.label}${n.sub ? ` [${n.sub}]` : ''}${edge}`;
  });
  let s = `Block diagram: ${parts.join(' → ')}`;
  if (dg.outputs && dg.outputs.length) s += ` → outputs: ${dg.outputs.map((o) => `${o.label}${o.sub ? ` [${o.sub}]` : ''}`).join('; ')}`;
  return `${s}.`;
}

function diagram(dg, key) {
  const nodes = dg.nodes;
  const outs = dg.outputs || [];
  const edges = dg.edges || [];
  const sizes = nodes.map(boxSize);
  const outSizes = outs.map(boxSize);
  const desc = describe(dg);

  // Horizontal
  const gapFor = (i) => Math.max(56, edges[i] ? edges[i].length * 6.4 + 22 : 0);
  const outStackH = outSizes.reduce((s, o) => s + o.h, 0) + Math.max(0, outs.length - 1) * 14;
  const H = Math.max(...sizes.map((s) => s.h), outStackH) + 8;
  const cy = H / 2;
  let x = 4;
  let hsvg = '';
  nodes.forEach((n, i) => {
    const { w, h } = sizes[i];
    hsvg += boxSvg(n, x, cy - h / 2, w, h);
    x += w;
    if (i < nodes.length - 1) {
      const g = gapFor(i);
      hsvg += arrow(x + 2, cy, x + g - 3, cy, `${key}-h`);
      if (edges[i]) hsvg += `<text class="dg-edge-label" x="${x + g / 2}" y="${cy - 7}" text-anchor="middle">${esc(edges[i])}</text>`;
      x += g;
    }
  });
  if (outs.length) {
    const g = 64;
    const startX = x;
    const ox = x + g;
    let oy = (H - outStackH) / 2;
    outs.forEach((o, i) => {
      const { w, h } = outSizes[i];
      hsvg += arrow(startX + 2, cy, ox - 3, oy + h / 2, `${key}-h`);
      hsvg += boxSvg(o, ox, oy, w, h);
      oy += h + 14;
    });
    x = ox + Math.max(...outSizes.map((s) => s.w));
  }
  const W = Math.ceil(x + 4);

  // Vertical
  const maxW = Math.max(...sizes.map((s) => s.w));
  const outRowW = outSizes.reduce((s, o) => s + o.w, 0) + Math.max(0, outs.length - 1) * 16;
  const labelW = Math.max(0, ...edges.map((e) => (e ? e.length * 6.4 + 12 : 0)));
  const VW = Math.ceil(Math.max(maxW + 2 * labelW, outRowW) + 8);
  const vcx = VW / 2;
  let y = 4;
  let vsvg = '';
  nodes.forEach((n, i) => {
    const { w, h } = sizes[i];
    vsvg += boxSvg(n, vcx - w / 2, y, w, h);
    y += h;
    if (i < nodes.length - 1) {
      vsvg += arrow(vcx, y + 2, vcx, y + 31, `${key}-v`);
      if (edges[i]) vsvg += `<text class="dg-edge-label" x="${vcx + 8}" y="${y + 21}">${esc(edges[i])}</text>`;
      y += 34;
    }
  });
  if (outs.length) {
    const fromY = y;
    y += 40;
    let ox = vcx - outRowW / 2;
    const rowH = Math.max(...outSizes.map((s) => s.h));
    outs.forEach((o, i) => {
      const { w, h } = outSizes[i];
      vsvg += arrow(vcx, fromY + 2, ox + w / 2, y - 3, `${key}-v`);
      vsvg += boxSvg(o, ox, y, w, h);
      ox += w + 16;
    });
    y += rowH;
  }
  const VH = Math.ceil(y + 4);

  const svg = (layout, w, h, body) => `
          <svg class="dg dg-${layout}" viewBox="0 0 ${w} ${h}" width="${w}" style="max-width:100%;height:auto" role="img" aria-labelledby="${key}-${layout}-t ${key}-${layout}-d">
            <title id="${key}-${layout}-t">${esc(dg.title)}</title>
            <desc id="${key}-${layout}-d">${esc(desc)}</desc>
            ${marker(`${key}-${layout[0]}`)}${body}
          </svg>`;

  // Horizontal layouts wider than the content column would shrink text below legibility; go vertical instead.
  const tall = W > 720;
  return `
        <figure class="diagram${tall ? ' diagram-tall' : ''}">
          <figcaption>${esc(dg.title)}</figcaption>${svg('h', W, H, hsvg)}${svg('v', VW, VH, vsvg)}
        </figure>`;
}

// ---------- Technical Projects page ----------

const tpSection = (p) => {
  const meta = [p.years, p.team].filter(Boolean).join(' · ');
  const specs = p.specs && p.specs.length
    ? `
        <div class="tp-block">
          <h3>At a glance</h3>
          <table class="spec-table"><tbody>${p.specs
            .map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`)
            .join('')}</tbody></table>
        </div>`
    : '';
  const diagrams = (p.diagrams || []).map((dg, i) => diagram(dg, `${p.id}-${i}`)).join('');
  const task = p.task
    ? `
        <div class="tp-task">
          <h3>The task</h3>${p.task.map((t) => `<p>${md(t)}</p>`).join('')}
          ${p.taskSource ? `<p class="tp-source">Source: <a href="${esc(p.taskSource.href)}" target="_blank" rel="noopener">${esc(p.taskSource.label)} <span aria-hidden="true">↗</span></a></p>` : ''}
        </div>`
    : '';
  const subs = p.subsystems && p.subsystems.length
    ? `
        <div class="tp-block">
          <h3>How it works</h3>${p.subsystems.map(([h, t]) => `<h4>${esc(h)}</h4><p>${md(t)}</p>`).join('')}
        </div>`
    : '';
  const decisions = p.decisions && p.decisions.length
    ? `
        <div class="tp-block">
          <h3>Design decisions</h3>
          <ol class="decisions">${p.decisions
            .map(
              (x) => `<li><p class="decision">${esc(x.decision)}</p>${
                x.why || x.tradeoff
                  ? `<dl>${x.why ? `<div><dt>Why</dt><dd>${esc(x.why)}</dd></div>` : ''}${x.tradeoff ? `<div><dt>Trade-off</dt><dd>${esc(x.tradeoff)}</dd></div>` : ''}</dl>`
                  : ''
              }</li>`
            )
            .join('')}</ol>
        </div>`
    : '';
  const list = (title, items) =>
    items && items.length
      ? `
        <div class="tp-block">
          <h3>${title}</h3>
          <ul class="bullets">${items.map((t) => `<li>${md(t)}</li>`).join('')}</ul>
        </div>`
      : '';
  return `
      <section class="tp" id="${esc(p.id)}" aria-labelledby="${esc(p.id)}-h">
        <header class="tp-head">
          ${p.label ? `<p class="tp-label">${esc(p.label)}</p>` : ''}
          ${meta ? `<p class="tp-meta">${esc(meta)}</p>` : ''}
          <h2 id="${esc(p.id)}-h">${esc(p.name)}${p.subtitle ? `<span class="tp-subtitle">${esc(p.subtitle)}</span>` : ''}</h2>
          ${p.role ? `<p class="role">${esc(p.role)}</p>` : ''}
          ${p.summary ? `<p class="tp-summary">${md(p.summary)}</p>` : ''}
        </header>${task}${specs}${diagrams}${subs}${decisions}${list('What broke and what we changed', p.changes)}${list('My role', p.myRole)}
        ${p.result ? `<p class="tp-result"><strong>Result:</strong> ${md(p.result)}</p>` : ''}
        ${evidence(p.evidence)}
      </section>`;
};

const tocItems = [...d.technicalProjects.map((p) => [p.id, p.toc]), ['small-builds', 'Smaller builds']];
const tocList = (cls) => `<ol class="${cls}">${tocItems.map(([id, label]) => `<li><a href="#${id}">${esc(label)}</a></li>`).join('')}</ol>`;

const technical = `${head(`Technical Projects | ${d.person.name}`, 'Engineering case studies: how each system works, the design decisions, what broke and what changed.')}${nav('technical')}
<main id="main" class="wrap tp-page">
  <header class="tp-intro">
    <h1>Technical Projects</h1>
    <p>${esc(d.technicalIntro)}</p>
  </header>

  <details class="toc-mobile">
    <summary>Jump to a project</summary>
    ${tocList('toc-list')}
  </details>

  <div class="tp-layout">
    <aside class="toc" aria-label="Projects on this page">
      <p class="toc-title">On this page</p>
      ${tocList('toc-list')}
    </aside>
    <div class="tp-content">${d.technicalProjects.map(tpSection).join('')}
      <section class="tp" id="small-builds" aria-labelledby="small-builds-h">
        <header class="tp-head"><h2 id="small-builds-h">Smaller builds</h2></header>
        <div class="small-builds">${d.smallBuilds
          .map((b) => `
          <div class="small-build"><h3>${esc(b.name)}</h3><p>${esc(b.text)}</p></div>`)
          .join('')}
        </div>
      </section>
    </div>
  </div>
</main>
${footer}`;

// ---------- Resume (print / PDF) ----------

const projectById = Object.fromEntries(d.projects.map((p) => [p.id, p]));
const leaderById = Object.fromEntries(d.leadership.map((x) => [x.id, x]));

// Roles share the title line when they fit (~one printed line), otherwise get their own line.
// `inlineRole: true` forces the role onto the title line (it may wrap there).
const INLINE_ROLE_MAX = 86;
const entry = ({ title, subtitle, role, dates, bullets, inlineRole }) => {
  const headHtml = `${esc(title)}${subtitle ? `<span class="r-sub">, ${esc(subtitle)}</span>` : ''}`;
  const inline = role && (inlineRole || `${title}${subtitle ? `, ${subtitle}` : ''} | ${role}`.length <= INLINE_ROLE_MAX);
  return `
      <div class="r-entry">
        <div class="r-line"><span class="r-title">${headHtml}${inline ? `<span class="r-role"> | ${esc(role)}</span>` : ''}</span><span class="r-date">${esc(dates)}</span></div>
        ${role && !inline ? `<div class="r-role">${esc(role)}</div>` : ''}
        <ul>${bullets.map((b) => `<li>${md(b)}</li>`).join('')}</ul>
      </div>`;
};

const engineering = ['mate-rov', 'blade', 'house-plants', 'wro', 'nrl', 'roboprenr']
  .map((id) => projectById[id])
  .map((p) => entry({ ...p.pdf, dates: p.dates }))
  .join('');

const leadershipPdf = d.pdfLeadershipOrder
  .map((id) => {
    if (id === 'tech-for-change') return entry({ ...d.pdfTechForChange, subtitle: 'Inventure Academy', dates: projectById[id].dates });
    const x = leaderById[id];
    return entry({ title: x.title, subtitle: '', role: x.pdf.role, dates: x.dates, bullets: x.pdf.bullets });
  })
  .join('');

const [topGrade, topSubjects] = a.igcse.groups[0];
const igcseCounts = a.igcse.groups.slice(1).map(([g, subj]) => `${subj.split(',').length} ${g}`).join(', ');
const igcsePdf = `${esc(topGrade)} in ${esc(topSubjects)}; ${esc(igcseCounts)}; ${esc(a.igcse.pdfSuffix)}`;

const contactLine1 = [esc(d.person.location), d.person.emailOnPdf ? `<a href="mailto:${esc(d.person.email)}">${esc(d.person.email)}</a>` : null]
  .filter(Boolean)
  .join(' · ');
const contactLine2 = `Portfolio: <a href="${esc(d.meta.siteUrl)}">${esc(d.meta.siteUrlLabel)}</a> · Team: <a href="${esc(d.person.teamPage)}">${esc(d.person.teamPageLabel)}</a>`;

const resume = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(d.meta.pdfTitle)}</title>
  <meta name="robots" content="noindex">
  <link rel="stylesheet" href="/css/resume.css">
</head>
<body>
<div class="r-toolbar"><a href="/">← Portfolio</a><a href="${pdfHref}" download>Download PDF</a></div>
<main class="r-page">
  <header class="r-header">
    <h1>${esc(d.person.name)}</h1>
    <p>${contactLine1}</p>
    <p>${contactLine2}</p>
  </header>

  <section>
    <h2>Education</h2>
    <div class="r-entry">
      <div class="r-line"><span class="r-title">Inventure Academy, Bengaluru<span class="r-sub">, Cambridge curriculum</span></span><span class="r-date">Class of 2027</span></div>
      <ul>
        <li><strong>Current:</strong> ${esc(a.currentPdf)}</li>
        <li><strong>${esc(a.asLevel.pdfLabel)}:</strong> ${a.asLevel.results.map(([s, g]) => `${esc(s)} ${esc(g)}`).join(', ')}${a.asLevel.pdfNote ? ` (${esc(a.asLevel.pdfNote)})` : ''}</li>
        <li><strong>IGCSE:</strong> ${igcsePdf}</li>
        <li><strong>SAT:</strong> ${esc(a.sat.score)} (${esc(a.sat.detail)}) · <strong>AP Computer Science A:</strong> ${esc(a.ap.score)}</li>
      </ul>
    </div>
  </section>

  <section>
    <h2>Engineering &amp; Research</h2>${engineering}
  </section>

  <section>
    <h2>Leadership &amp; Service</h2>${leadershipPdf}
  </section>

  <section>
    <h2>Honors &amp; Awards</h2>
    <ul class="r-honors">${d.honors
      .filter((h) => h.pdf !== false)
      .map((h) => `<li><span>${esc(h.text)}</span><span class="r-date">${esc(h.year)}</span></li>`)
      .join('')}</ul>
  </section>

  ${d.pdfSkills ? `<p class="r-interests r-skills"><strong>Technical Skills:</strong> ${esc(d.pdfSkills)}</p>` : ''}
  ${d.interestsOnPdf ? `<p class="r-interests"><strong>Interests:</strong> ${esc(d.interests)}</p>` : ''}
</main>
</body>
</html>
`;

writeFileSync(join(root, 'public', 'index.html'), site);
for (const [dir, html] of [['technical', technical], ['resume', resume]]) {
  mkdirSync(join(root, 'public', dir), { recursive: true });
  writeFileSync(join(root, 'public', dir, 'index.html'), html);
}
console.log('built public/index.html, public/technical/index.html, public/resume/index.html');
