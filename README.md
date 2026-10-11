# The Gunpowder Paradox — Operation 1605

A standalone A2-level English history escape room for year 2 of Dutch mavo. Eight chapters, 27 puzzles, an automatic evidence notebook, optional speech and clues, and a final detective report. The real Gunpowder Plot is clearly separated from the fictional Meridian Order time-travel narrative.

## Publish on GitHub Pages

1. **Unzip** `Gunpowder_Paradox_GitHub_Pages.zip`.
2. Upload the **contents** of the extracted folder (not the ZIP itself) to the root of your GitHub Pages repository, or to a subfolder such as `gunpowder/`. Preserve the `assets/` subfolder and file names.
3. If Pages is not yet enabled, select **Settings → Pages → Deploy from a branch → main → /(root)**. If Pages is already configured, the subfolder will be available under your normal GitHub Pages address, e.g. `https://your-account.github.io/your-repository/gunpowder/`.
4. Visit `index.html` through the published HTTPS website. You do **not** need Node.js, npm, a database, API keys or a backend.

For a quick local test on a computer, run `python -m http.server 8000` in this folder and open `http://localhost:8000` in your browser. An HTTPS connection (or localhost) is preferred because the puzzle seals use the browser's Web Crypto API. Do not edit the encrypted puzzle data by hand.

## Instructions for students

- Click **Enter the Time Machine** and complete the tasks in each chapter.
- Use the glowing hotspots, conversation choices and other exercises to find evidence.
- Check **Case notebook** for clues and use the ruled area for your own notes.
- If stuck, reveal the two optional hints for that task.
- Write the names, date and signal into the final report to repair history.
- You can return to the same device/browser later; your progress is saved.

## About privacy, security and performance

- This is a pure static site: no third-party JavaScript libraries, analytics, logins, fonts or requests to third-party services. Image files are original AI-generated, compressed WebP illustrations.
- Game progress and personal detective notes are kept **only** in the browser's `localStorage`; they are not uploaded anywhere. **Restart** removes them from that browser.
- All answer validation uses **encrypted challenge payloads** and password-derived keys rather than an easy-to-read answer list in the source. This discourages casual view-source cheating, but **no static browser game can be completely cheat-proof**. A determined technical user can still inspect runtime behaviour or brute-force short multiple-choice solutions.
- Browser text-to-speech is optional and uses the voices installed on each device. If it is unavailable, pupils can read all dialogue and narration instead.
- All downloads are served by GitHub Pages and can be cached by the browser. Thirty concurrent learners do not use a central session server or database, so concurrency is not a bottleneck here. Actual speed still depends on the school's network and devices.

## Educational and historical notes

The central facts are based on historical accounts of the Gunpowder Plot. The planned attack was set for **5 November 1605**, an anonymous warning was given to **Lord Monteagle on 26 October**, and **Guy Fawkes** was discovered on **4 November**. **Robert Catesby**, **Thomas Percy**, **King James I**, **Lord Monteagle** and **Guy Fawkes** are historical people. **Evelyn Cross**, **Nora Vale**, **Silas Grey**, the **Meridian Order** and all time-travel devices are fictional. Some conversations with real characters are dramatised for A2 learners rather than quotations.

Sources:
- [UK Parliament: Gunpowder Plot FAQ](https://www.parliament.uk/about/faqs/house-of-commons-faqs/gunpowder-plot/)
- [UK Parliament: Receiving the warning](https://www.parliament.uk/about/living-heritage/evolutionofparliament/parliamentaryauthority/the-gunpowder-plot-of-1605/overview/the-plot-and-its-discovery/discovery-and-flight/)
- [UK Parliament: Discovery and flight](https://www.parliament.uk/about/living-heritage/evolutionofparliament/parliamentaryauthority/the-gunpowder-plot-of-1605/overview/the-plot-and-its-discovery/discovery-and-flight1/)

**Important:** The separate `Gunpowder_Paradox_DOCENTENHANDLEIDING.txt` is **not included** in the deployable ZIP. Keep it off the student website.
