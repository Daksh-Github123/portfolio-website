// Renders public/index.html and public/resume/index.html from data/resume.json.
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

const fontFaces = `
    <link rel="preload" href="/fonts/ibm-plex-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/fonts/ibm-plex-sans-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin>`;

// ---------- Site ----------

const evidence = (items = []) =>
  items.length
    ? `<div class="evidence">${items
        .map((e) => {
          const ext = e.external || e.cert ? ' target="_blank" rel="noopener"' : '';
          const icon = e.cert ? 'Certificate: ' : '';
          return `<a class="chip${e.cert ? ' chip-cert' : ''}" href="${esc(e.href)}"${ext}><span class="visually-hidden">${icon}</span>${esc(e.label)}${e.external ? ' <span aria-hidden="true">↗</span>' : ''}</a>`;
        })
        .join('')}</div>`
    : '';

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

const [flagships, moreProjects] = [d.projects.filter((p) => p.flagship), d.projects.filter((p) => !p.flagship)];
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

const site = `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(d.person.name)} | Mechanical Engineering Portfolio</title>
  <meta name="description" content="${esc(d.person.identity)}">
  <script>document.documentElement.classList.add('js');try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t;}catch(e){}</script>${fontFaces}
  <link rel="stylesheet" href="/css/styles.css">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚙️</text></svg>">
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>

<nav class="nav" aria-label="Main">
  <div class="nav-inner">
    <a class="nav-brand" href="#top">${esc(d.person.name)}</a>
    <button class="nav-toggle" id="navToggle" aria-label="Menu" aria-expanded="false" aria-controls="navLinks">Menu</button>
    <div class="nav-links" id="navLinks">
      <a href="#projects">Projects</a>
      <a href="#leadership">Leadership</a>
      <a href="#academics">Academics</a>
      <a href="#honors">Honors</a>
    </div>
    <div class="nav-actions">
      <button class="theme-toggle" id="themeToggle" type="button" aria-label="Switch to dark mode">Dark</button>
      <a class="btn btn-primary btn-sm" href="${pdfHref}" download>Resume<span class="hide-sm"> (PDF)</span></a>
    </div>
  </div>
</nav>

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

<footer class="footer">
  <div class="wrap">
    <div class="footer-links">
      <a href="mailto:${esc(d.person.email)}">${esc(d.person.email)}</a>
      <a href="${esc(d.person.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>
      <a href="${esc(d.person.teamPage)}" target="_blank" rel="noopener">The Orcas (team page)</a>
      <a href="/resume/">Resume (web version)</a>
    </div>
    <p>Last updated: ${esc(d.meta.lastUpdated)}</p>
  </div>
</footer>

<script src="/js/main.js" defer></script>
</body>
</html>
`;

// ---------- Resume (print / PDF) ----------

const projectById = Object.fromEntries(d.projects.map((p) => [p.id, p]));
const leaderById = Object.fromEntries(d.leadership.map((x) => [x.id, x]));

// Roles share the title line when they fit (~one printed line), otherwise get their own line.
const INLINE_ROLE_MAX = 92;
const entry = ({ title, subtitle, role, dates, bullets }) => {
  const head = `${esc(title)}${subtitle ? `<span class="r-sub">, ${esc(subtitle)}</span>` : ''}`;
  const inline = role && `${title}${subtitle ? `, ${subtitle}` : ''} | ${role}`.length <= INLINE_ROLE_MAX;
  return `
      <div class="r-entry">
        <div class="r-line"><span class="r-title">${head}${inline ? `<span class="r-role"> | ${esc(role)}</span>` : ''}</span><span class="r-date">${esc(dates)}</span></div>
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

const contact = [
  esc(d.person.location),
  d.person.emailOnPdf ? `<a href="mailto:${esc(d.person.email)}">${esc(d.person.email)}</a>` : null,
  `Portfolio: <a href="${esc(d.meta.siteUrl)}">${esc(d.meta.siteUrlLabel)}</a>`,
  `Team: <a href="${esc(d.person.teamPage)}">${esc(d.person.teamPageLabel)}</a>`,
]
  .filter(Boolean)
  .join(' · ');

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
    <p>${contact}</p>
  </header>

  <section>
    <h2>Education</h2>
    <div class="r-entry">
      <div class="r-line"><span class="r-title">Inventure Academy, Bengaluru<span class="r-sub">, Cambridge curriculum</span></span><span class="r-date">Class of 2027</span></div>
      <ul>
        <li><strong>Current (Grade 12):</strong> ${esc(a.current)}</li>
        <li><strong>AS Level (Jun 2026):</strong> ${a.asLevel.results.map(([s, g]) => `${esc(s)} ${esc(g)}`).join(', ')}</li>
        <li><strong>IGCSE (2025):</strong> ${a.igcse.groups.map(([g, s]) => `${esc(g)}: ${esc(s)}`).join('; ')}. ${esc(a.igcse.note)}</li>
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

  <p class="r-interests"><strong>Interests:</strong> ${esc(d.interests)}</p>
</main>
</body>
</html>
`;

writeFileSync(join(root, 'public', 'index.html'), site);
mkdirSync(join(root, 'public', 'resume'), { recursive: true });
writeFileSync(join(root, 'public', 'resume', 'index.html'), resume);
console.log('built public/index.html and public/resume/index.html');
