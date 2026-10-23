# Open items (internal; not deployed)

`data/resume.json` is the source of truth for the site, the Technical Projects page and the PDF.

## Review round 2: done
- A: PDF de-duplicated (MATE awards now only in Honors), email added, AS retake note, IGCSE on one line,
  Roboprenr "5 courses completed", Project Vita 2023–present. Still one page.
- B: all 8 website fixes (gripper wording, Sharkpedo certificate chip removed, Roboprenr 5 courses,
  Tech for Change signup cap once, Project Vita Grade 9 / 2023–present, no photos, PDF honors de-duplicated).
- E: /technical/ page generated from `technicalProjects` + `smallBuilds` in the data file; not in the PDF.

## PDF spacing: trade-off to decide
A3's spacing at 10.5 pt doesn't fit one page with every entry, even after de-duplication (~16 lines over).
Shipped: 10.5 pt (font not shrunk), 0.65 in margins, 20 pt name, line-height 1.24, 10 pt above sections,
5 pt above entries. PDF-only trims (facts unchanged): MATE role inline as "CTO (2026)" (bullet 2 carries the
rest), BLADE's "Independent research project" subtitle dropped, Interests line dropped, shorter wording on
Education / house plants / NRL / Student Council lines.
To get the full A3 spacing plus ~0.5 in at the bottom, cut ~1 entry, e.g. the house-plant preprint or Roboprenr.

## Waiting on Daksh
1. Photos: The Orca, Leviathan Mk 1/2, BLADE, club showcase, physical Sharkpedo award + certificate.
2. Does "~350 hours" still apply to the 5 completed Roboprenr courses? (Removed everywhere until confirmed.)
3. Technical Projects answers. The page shows only confirmed facts; sections are thin where facts are missing:
   - Leviathans: control hardware, what changed Mk 1 → Mk 2, what broke (Daksh earlier mentioned Arduino UNO R3 /
     ESP32 control-box and clamp logic; not used because the brief limits the page to E3 facts; confirm to add).
   - WRO car names (Zephyrus 2024, Huayra 2025)? Note the 2025 certificate lists the team as "Huayra".
   - Voting machine: microcontrollers, RFID voter identification, vote storage/tally, double-vote prevention, display.
   - P.A.C.E.: stack, features, dates.
   - NRL 2026 regionals (Nov) and nationals (Dec) results.
   - BLADE: is quantized TFLite done? Any real result numbers for the lab-to-field comparison?
4. Earlier CONFIRM list still open: Further Maths private candidate; MIT EWB wording; iCode field size;
   government school tutoring numbers; Scaler/YIIC internship; technical skills for the PDF; noindex.

## Later updates
- AS Maths retake result (Jan 2027): replace the B and remove the retake note.
- SAT November result: remove "Next sitting"; update the superscore only if a section improves.
