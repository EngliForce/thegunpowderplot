# The Gunpowder Paradox — Operation 1605

A static English-language **A2 escape room** for Dutch mavo 2. Eight chapters, **29 tasks**, dramatic interactions with historical characters, a popup evidence file, optional hints, an individualised trail of clues and a final detective report.

## Upload to GitHub Pages

1. Extract `Gunpowder_Paradox_AI_Resistant_iPad.zip` on your computer.
2. On GitHub, upload **the individual files and the entire `assets` folder** from the extracted ZIP into the same directory. Do **not** upload the ZIP file itself. Keep `index.html`, `game.js`, `data.js`, `styles.css`, `icon.svg` and the `assets` folder together.
3. If GitHub Pages is not enabled, choose **Settings → Pages → Deploy from a branch**. If Pages already works, visit the same address you used before. Wait briefly for GitHub to publish the new files and refresh Safari.
4. The separate **teacher guide is not inside this ZIP** and should never be uploaded to the public repository.

No external JS frameworks, accounts, authentication, downloads, API keys or back-end services are needed. For the puzzle encryption, **access the game through HTTPS** (GitHub Pages), rather than opening `index.html` as a file from the iPad's local storage.

## Gameplay instructions (for teachers and learners)

- Work individually on iPads (landscape is recommended); tap **A+** to enlarge the text even further, or pinch to zoom. There is no audio.
- Complete the small puzzles, read the witness dialogues, inspect the marked objects and use optional hints if you are stuck.
- Tap **Evidence file** at any time to open a popup, with **Evidence**, **Signal trail**, **Suspects**, **Words**, and **My notes** tabs. Close the popup to return to the same puzzle.
- **Signal trail is vital**: symbols and codes are not the same for every student. New signal clues appear only when relevant investigations have been completed.
- In the missing-warning chapter, compare evidence from the tavern (wax mark), Percy’s house (thread colour) and the cellar (gear number), then choose the real packet.
- At the time gate, combine the symbol-to-number decoder from the tavern with four location marks collected during the story. The decoder is deliberately printed in a **different order** from the four place marks.
- The personalised time-gate lock must be opened **before** the final case report can be submitted.
- Progress is saved in **that browser on that device**. Revisiting the same GitHub Pages address in the same browser normally resumes the mission. Tapping **Restart** creates a new mission with new evidence and removes the earlier notes.

## Safeguards and limitations

- The established 27 exercises still use password-derived, encrypted rewards; the additional two puzzles are **calculated from randomly generated evidence in each local playing session**. There is no single answer to the new puzzles that all classmates can exchange.
- To solve the new puzzles normally, students must combine facts found in **different chapters**, rather than copy a fixed solution from a public answer key. Details vary by game, though some two devices could coincidentally generate the same four-digit code.
- A fully static client-side game cannot prevent all cheating. A determined user can still inspect the browser state, brute-force a multiple-choice question or ask AI to interpret several screenshots. The changes make such shortcuts less useful, **not impossible**.
- Progress and notes are stored only in the device's `localStorage` and are **not transmitted to a server**. This means there is no teacher dashboard or classroom data collection.
- Static assets total only a few hundred kilobytes. Thirty simultaneous students require only downloads from GitHub Pages; no shared game server performs per-student checks. The first load still depends on the school's Wi-Fi.

## History

The Gunpowder Plot, the date **5 November 1605**, the anonymous letter to Lord Monteagle on **26 October**, and the discovery of Guy Fawkes on **4 November** are historical. Robert Catesby, Thomas Percy, Lord Monteagle, King James I and Guy Fawkes were real people. The Meridian Order, Evelyn Cross, Nora Vale and Silas Grey and all modern/time-travel devices are fictional. Dialogue is invented and simplified to suit A2 learners. The actual writer of the Monteagle letter remains uncertain.

Historical sources:
- [UK Parliament — Gunpowder Plot FAQ](https://www.parliament.uk/about/faqs/house-of-commons-faqs/gunpowder-plot/)
- [UK Parliament — plot and discovery](https://www.parliament.uk/about/living-heritage/evolutionofparliament/parliamentaryauthority/the-gunpowder-plot-of-1605/overview/the-plot-and-its-discovery/discovery-and-flight/)
