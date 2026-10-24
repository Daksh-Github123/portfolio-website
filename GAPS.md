# Open items (internal; not deployed)

`data/resume.json` is the source of truth for the site, the Technical Projects page and the PDF.

## Review round 3: done (preview only, not promoted)
- PDF: house-plant role now inline ("| First author, Zenodo preprint"); Roboprenr bullet shortened to one line
  (November date kept on the website only). No entries cut, font still 10.5 pt.
- Technical page: Orca TDP bullet removed and credited to Leviathans (2025, no page count); Orca propulsion
  diagram relabelled generically (Pilot controls (topside) → Pixhawk 2.4.8 / ArduSub → Motor controllers →
  6 thrusters); servo sealing only under "What broke"; WRO "Did most of the design and strategy for the 2025
  car."; small builds merged into "Early electronics builds"; intro's second sentence cut; WRO team and car
  names on the technical page, spec table and home card; Leviathans clamp, ESP32 control box, spec rows and
  diagram.
- `noindex` now on every page (home, technical, resume), production included once promoted.

## PDF spacing: measured result
The requested spacing (line-height 1.3, 7 pt above entries, 13 pt above sections) overflows to 2 pages.
Before round 3 the PDF had ~0.04 in spare, not ~0.9 in. The two saved lines give ~0.4 in. Spending any
of that on spacing drops below the 0.4–0.5 in target (e.g. 1.26 / 11 pt / 6 pt leaves 0.18 in), so per
"step the spacing back" the PDF ships at line-height 1.24, 11 pt above sections (was 10), 5 pt above entries:
one page with 0.39 in below the last line. If Daksh prefers more air over bottom space, 1.26 / 11 / 6 also fits.

## Waiting on Daksh
1. Approve the preview before promotion to production.
2. Photos: The Orca, Leviathan Mk 1/2, BLADE, club showcase, physical Sharkpedo award + certificate.
3. "~350 hours" for Roboprenr: removed everywhere until confirmed.
4. The Orca: confirm the propulsion chain (tether? ESCs?) to restore specific labels.
5. Leviathans: Arduino UNO R3 (left out), what changed Mk 1 → Mk 2, what broke.
6. Voting machine: microcontrollers, RFID voter identification, vote storage/tally, double-vote prevention, display.
7. P.A.C.E.: stack, features, dates.
8. NRL 2026 regionals (Nov) and nationals (Dec) results.
9. BLADE: is quantized TFLite done? Any real result numbers for the lab-to-field comparison?
10. Earlier CONFIRM list still open: Further Maths private candidate; MIT EWB wording; iCode field size;
    government school tutoring numbers; Scaler/YIIC internship; technical skills for the PDF.
These stay out; the site ships without them.

## Later updates
- AS Maths retake result (Jan 2027): replace the B and remove the retake note.
- SAT November result: remove "Next sitting"; update the superscore only if a section improves.
- Roboprenr ROS 2 completion (Nov 2026): update the website and PDF lines.
