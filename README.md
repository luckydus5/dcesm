# DCESM Website

Marketing website for **DCESM, Design & Construction Engineering, Solutions and
Estates Management**. Its purpose is to attract clients and explain what the
company does.

Built as static HTML, CSS and JavaScript. No build step, no dependencies, no
tracking.

---

## Running it

Double click `index.html`.

To preview it the way a real server would, which is worth doing before you
publish:

```powershell
cd D:\Projets\Damascen
python -m http.server 8000
```

Then open <http://localhost:8000>.

---

## Files

| File | Purpose |
|---|---|
| `index.html` | All page content and section text |
| `styles.css` | Design system, layout, responsive rules |
| `script.js` | Menu, scroll effects, counters, form validation |
| `assets/logo.svg` | Full logo, vector, transparent background |
| `assets/logo-mark.svg` | Building mark only, used in the header |
| `assets/logo.png` | Full logo at 900px for email, print, social sharing |
| `assets/favicon-512.png` | Browser tab icon, square |

All logo assets were generated from `logo engeneer.pdf`. Text in the SVGs is
converted to vector outlines, so they render identically everywhere and need no
font files.

---

## Brand colours

Sampled directly from the logo artwork:

| Colour | Hex | Used for |
|---|---|---|
| Red | `#be1e2d` | Buttons, accents, highlights |
| Charcoal | `#404041` | Wordmark, secondary text |
| Ink | `#231f20` | Headings, dark sections, footer |

Defined once at the top of `styles.css` under `:root`. Change them there and the
entire site follows.

---

# Filling in the real data

Every placeholder is marked. Search `index.html` for `DATA:` to find each block,
and for `To be confirmed` to find each empty value.

## 1. Contact details, required

In the contact section and the footer, replace each
`<span class="tbc">To be confirmed</span>` with the real value.

Phone and email should become real links so they work on mobile:

```html
<a href="tel:+250788123456">+250 788 123 456</a>
<a href="mailto:info@dcesm.com">info@dcesm.com</a>
```

Delete the `class="tbc"` attribute once a real value is in, so the dashed
placeholder styling disappears.

## 2. Company statistics

The three figures in the hero are **hidden by default** because no real numbers
have been supplied. They appear automatically once you enter genuine values:

```html
<span class="hero__fact-value" data-count="120" data-suffix="+">120+</span>
```

Set `data-count` to the number and `data-suffix` to `+`, `%` or nothing. The
counter then animates when scrolled into view.

Leave them at `0` and the whole block stays hidden, which is the correct
behaviour until the figures are confirmed. Never publish invented numbers.

## 3. Credentials bar

The four items under "Registered and compliant" are generic. Replace them with
your actual registrations, licences, insurance and memberships, or delete the
whole `<section class="credbar">` if you would rather not make these claims yet.

## 4. Project photos, highest impact

Real photographs of completed buildings persuade clients faster than anything
else on the page.

For each project card, replace the placeholder block:

```html
<div class="proj__media">
  <span class="proj__ph">...</span>
</div>
```

with a real image:

```html
<div class="proj__media">
  <img src="assets/projects/my-building.jpg" alt="Short description of the project">
</div>
```

Then fill in the title, the category chip, the description, and the three
metadata fields (Location, Scope, Completed).

Landscape photos at roughly 1200x750px work best. Six slots are provided; add or
remove `<article class="proj">` blocks as needed.

## 5. About section

The two paragraphs describe a plausible practice but are **not** your real
history. Rewrite them with the true story, founding date and positioning before
publishing.

## 6. Connecting the contact form

The form validates input but **does not send anything yet**. It says so honestly
on submit rather than showing a false confirmation. Pick one option:

**Option A, Formspree.** Works on any host and has a free tier.

1. Create a form at <https://formspree.io> to get your endpoint.
2. Change the form tag:
   ```html
   <form class="form" id="contactForm" action="https://formspree.io/f/YOUR_ID" method="POST">
   ```
3. In `script.js`, find the `TODO` near the bottom and replace the two
   `note.textContent` lines with `form.submit();`

**Option B, Netlify Forms.** If you host on Netlify, add `netlify` and
`name="contact"` to the `<form>` tag and Netlify handles the rest.

**Option C, no form.** Delete the `.contact__formwrap` block and rely on phone,
email and WhatsApp, which many construction clients prefer anyway.

## 7. Optional, WhatsApp button

The floating button on mobile currently jumps to the contact form. To open
WhatsApp instead, change its `href`:

```html
<a href="https://wa.me/250788123456?text=Hello%20DCESM" class="fab">
```

Use the full number with country code, no plus sign and no spaces.

---

# Publishing

Any static host works, since there is no backend.

**Netlify, easiest.** Go to <https://app.netlify.com/drop> and drag the
`Damascen` folder onto the page. You get a live URL immediately and can attach a
custom domain afterwards.

**GitHub Pages.** Push the folder to a repository, then Settings, Pages, deploy
from branch.

**Traditional hosting.** Upload `index.html`, `styles.css`, `script.js` and the
`assets/` folder to `public_html/` by FTP.

---

# What is built in

Verified at 360, 390, 768, 1024 and 1440px: no horizontal scrolling, no
overflowing elements, and all touch targets at least 40px tall.

- Responsive from 360px phones to wide desktops
- Sticky header with scroll progress bar and active section highlighting
- Mobile menu that closes on link tap, on Escape, and on outside click
- Scroll reveal animations and animated statistics counters
- Accessible: skip link, visible focus rings, ARIA states, semantic landmarks
- Honours `prefers-reduced-motion`
- Print stylesheet
- Open Graph tags for link previews
- No cookies, no tracking, no third party requests except the Google Fonts
  stylesheet

To remove the Google Fonts dependency entirely, delete the three `<link>` tags
for fonts in `index.html`. The site falls back to system fonts and still looks
correct.
