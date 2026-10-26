# Open items (internal; not deployed)

`data/resume.json` is the source of truth for the site, the Technical Projects page and the PDF.

## Production status
- Daksh approved promoting round 4 (which includes round 3) on October 26, 2026; production
  (`portfolio-website-gamma-ivory-77.vercel.app`) now serves it, replacing `dpl_AtzateRwVfKRtFvCoZHRk99hdFve`.
- After each promotion: load `/`, `/technical/`, `/resume/`, `/Daksh_Singh_Resume.pdf` on the production URL and
  confirm the new content is served (no stale cache).

## Review round 4: done (promoted)
- Technical Skills line (confirmed by Daksh, with Onshape as the CAD tool) added after Honors & Awards, PDF only.
  The full list wraps, so items were dropped from the end until it fit on one line:
  `Python, OpenCV, TensorFlow/TFLite, Raspberry Pi, ESP32, Pixhawk/ArduSub, Onshape`
  (dropped: PCB design, 3D printing, soldering, Git). Spacing back to 1.24 / 11 pt / 5 pt; one page, ~0.06 in spare.

## Closed (no longer tracked)
- Scaler / YIIC internship: left out permanently.
- Government school tutoring: left out unless Daksh asks for it.
- iCode field size: keep "national finalist"; no number.
- "~350 hours" (Roboprenr): left out permanently unless Daksh brings it back.

## Waiting on Daksh
1. MIT Engineers Without Borders: exact certificate wording. Left out until then.
2. Further Mathematics: add only if he confirms he's registered as a private candidate.
3. Photos: The Orca, Leviathan Mk 1/2, BLADE, club showcase, physical Sharkpedo award + certificate.
4. The Orca: propulsion chain (tether? ESCs?) to restore specific diagram labels.
5. Leviathans: Arduino UNO R3 (left out), what changed Mk 1 → Mk 2, what broke.
6. Voting machine: microcontrollers, RFID voter identification, vote storage/tally, double-vote prevention, display.
7. P.A.C.E.: stack, features, dates.
8. BLADE: is quantized TFLite done? Any real result numbers for the lab-to-field comparison?
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
