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

Any static host works. GitHub Pages: enable Pages on this repo/branch, root folder.
No build step required.

## Data provenance

Every fact traces to the Notion "Activities & Honors" database and "Academics &
Scores" page, or to Daksh's direct answers. Items still awaiting Daksh's input are
marked inline with an amber **flag** and listed in `GAPS.md`.
