# Daksh Singh — Portfolio Website

Portfolio site and downloadable resume for US university applications (Mechanical Engineering).

**Live URL (in submitted applications — never rename or remove):**
https://portfolio-website-gamma-ivory-77.vercel.app

## How it works

All content lives in one file, `data/resume.json`. Both the website and the PDF resume
are generated from it, so they can't disagree.

```
data/resume.json          Single source of truth for every fact on the site and in the PDF
scripts/build.mjs         Renders public/index.html and public/resume/index.html
scripts/resume-pdf.mjs    Renders /resume to public/Daksh_Singh_Resume.pdf (headless Chromium)
scripts/redact_certs.py   Renders certificate PDFs to WebP with signatures / ID codes blurred
public/                   Everything Vercel serves (and nothing else)
source/certificates/      Original certificate PDFs (not deployed)
```

## Updating content

```
npm install
npm run resume:pdf      # rebuilds the site AND regenerates the PDF
```

Commit everything in `public/` (including the PDF). Vercel serves `public/` as-is; there is no
build step at deploy time, so the PDF can never fail at request time.

## Deploying safely

Production deploys from `claude/daksh-portfolio-site-i0r0eo`. Do work on a separate branch, which
gives a Vercel preview URL; merge into the production branch only after Daksh approves.

## Adding a certificate

1. Put the original PDF in `source/certificates/`.
2. Add its blur regions (signatures, QR/ID codes) to `scripts/redact_certs.py` and run
   `python3 scripts/redact_certs.py source/certificates public/assets/certificates /tmp/certs`.
3. Reference the `.webp` from `data/resume.json`.
