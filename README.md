# Daksh Singh — Portfolio Website

A clean, single-page portfolio site that replaces the paper resume for US university
applications (Mechanical Engineering). Wherever a resume would say "link to
certificate / website / photos," the file is embedded on this site directly.

## Structure

```
index.html              Single-page site (all sections)
css/styles.css          Styles — no external dependencies, print-friendly
js/main.js              Active-nav highlighting only
assets/certificates/    Drop award/certificate files here (see its README)
assets/photos/          Drop team/bot/event photos here (see its README)
```

## Viewing locally

It's a static site — just open `index.html` in a browser, or:

```
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Deploying

Static site — no build step. Two easy options:

### Vercel (recommended — hosts the certificate PDFs too)
1. Go to vercel.com → **Add New… → Project → Import Git Repository**.
2. Select `Daksh-Github123/portfolio-website`, branch `claude/daksh-portfolio-site-i0r0eo`.
3. Framework preset: **Other**. Build command: none. Output directory: `./` (root).
4. Deploy. The certificate PDFs under `assets/certificates/` are served automatically.

(Programmatic deploy from this session was blocked by a Vercel "permission to create a
project" error — a team/role restriction on the connected account. Importing from the
dashboard uses your own account permissions and avoids it.)

### GitHub Pages
Enable Pages on this repo/branch, root folder. Also zero-config.

## Data provenance

Every fact traces to the Notion "Activities & Honors" database and "Academics &
Scores" page, or to Daksh's direct answers. Items still awaiting Daksh's input are
marked inline with an amber **flag** and listed in `GAPS.md`.
