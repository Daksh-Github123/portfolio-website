# Open items (internal; not deployed)

`data/resume.json` is the source of truth for the site, the Technical Projects page and the PDF.

## Production status
- Production (`portfolio-website-gamma-ivory-77.vercel.app`) still serves the old site (`dpl_AtzateRwVfKRtFvCoZHRk99hdFve`).
- Round 3 preview `dpl_AQjHd9nRCzvXQbDSjQsvtTX8h5Lb` and the round 4 preview are waiting on Daksh's approval.
- After each promotion: load `/`, `/technical/`, `/resume/`, `/Daksh_Singh_Resume.pdf` on the production URL and
  confirm the new content is served (no stale cache).

## Review round 4: done (preview only)
- PDF spacing: no confirmed Technical Skills list yet, so the PDF uses line-height 1.26, 11 pt above sections,
  6 pt above entries. One page, ~0.18 in below the last line.
- If Daksh confirms a skills list: revert to 1.24 / 11 / 5 and add one unheaded line after Honors & Awards:
  `Technical Skills: Python, OpenCV, TensorFlow/TFLite, Raspberry Pi, ESP32, Pixhawk/ArduSub, PCB design,
  3D printing, soldering, Git` (one line only; drop items from the end if it wraps; a CAD tool only if he names one).

## Closed (no longer tracked)
- Scaler / YIIC internship: left out permanently.
- Government school tutoring: left out unless Daksh asks for it.
- iCode field size: keep "national finalist"; no number.
- "~350 hours" (Roboprenr): left out permanently unless Daksh brings it back.

## Waiting on Daksh
1. Approve round 3, then round 4, for promotion to production.
2. Technical Skills list for the PDF (plus a CAD tool, if any).
3. MIT Engineers Without Borders: exact certificate wording. Left out until then.
4. Further Mathematics: add only if he confirms he's registered as a private candidate.
5. Photos: The Orca, Leviathan Mk 1/2, BLADE, club showcase, physical Sharkpedo award + certificate.
6. The Orca: propulsion chain (tether? ESCs?) to restore specific diagram labels.
7. Leviathans: Arduino UNO R3 (left out), what changed Mk 1 → Mk 2, what broke.
8. Voting machine: microcontrollers, RFID voter identification, vote storage/tally, double-vote prevention, display.
9. P.A.C.E.: stack, features, dates.
10. BLADE: is quantized TFLite done? Any real result numbers for the lab-to-field comparison?
These stay out; the site ships without them.

## Later updates
Before each update: regenerate the PDF (`npm run resume:pdf`) and confirm it is still one page.
- IRIS 2026: if BLADE is selected for the National Fair, add "Selected for IRIS National Fair 2026" to the BLADE
  card, the Technical Projects page and the PDF. If not, mention nothing.
- NRL 2026: regionals November 20, nationals early December. Add a placement only if it's a real result (rank or
  award). Otherwise keep "2026 season in progress" until the season ends, then remove that line.
- Sports Day (Nov 2026): after it happens, change "Now organizing Sports Day (800 attendees, November 2026)" to past tense.
- AS Maths retake result (Jan 2027): replace the B and remove the retake note.
- SAT November result: remove "Next sitting"; update the superscore only if a section improves.
- Roboprenr ROS 2 completion (Nov 2026): update the website and PDF lines.
