---
name: DRAX RAW
description: Drax's camera road case, plastered with worn vinyl stickers from every job; the portfolio is the case.
colors:
  case: "#121214"
  case-2: "#1b1b1e"
  case-line: "rgba(237, 228, 208, 0.12)"
  sticker-red: "#d42a24"
  sticker-red-deep: "#a81d18"
  tour-yellow: "#f1b51c"
  vinyl-blue: "#2a4bb8"
  vinyl-purple: "#5a36a6"
  faded-cream: "#ede4d0"
  print-stock: "#f3ecdc"
  adhesive-residue: "#c8b38c"
  ink: "#141210"
  text-dim: "#b9b0a0"
typography:
  display:
    fontFamily: "Anton, Arial Narrow, sans-serif"
    fontSize: "clamp(7.5rem, 37vw, 15rem)"
    fontWeight: 400
    lineHeight: 0.86
    letterSpacing: "0"
  headline:
    fontFamily: "Anton, Arial Narrow, sans-serif"
    fontSize: "clamp(3.4rem, 15vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.86
    letterSpacing: "0"
  title:
    fontFamily: "Anton, Arial Narrow, sans-serif"
    fontSize: "clamp(1.7rem, 7vw, 2.2rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "0"
  lead:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(1.6rem, 6vw, 2.3rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0"
  body:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.06em"
rounded:
  photo: "2px"
  logo: "4px"
  diecut: "6px"
  cta: "8px"
  pill: "999px"
  round: "50%"
spacing:
  gutter: "clamp(16px, 4vw, 56px)"
  section: "clamp(72px, 12vw, 160px)"
  dock: "72px"
  rail: "84px"
  container: "1320px"
components:
  button-sticker-primary:
    backgroundColor: "{colors.sticker-red}"
    textColor: "{colors.faded-cream}"
    typography: "{typography.label}"
    rounded: "{rounded.diecut}"
    padding: "0 24px"
    height: "56px"
  button-sticker-secondary:
    backgroundColor: "{colors.faded-cream}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.diecut}"
    padding: "0 24px"
    height: "56px"
  button-book-cta:
    backgroundColor: "{colors.tour-yellow}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.cta}"
    padding: "0 28px"
    height: "72px"
  nav-rail-book:
    backgroundColor: "{colors.sticker-red}"
    textColor: "{colors.faded-cream}"
    typography: "{typography.label}"
    rounded: "{rounded.diecut}"
    padding: "0 18px"
    height: "50px"
  nav-rail-link:
    textColor: "{colors.text-dim}"
    typography: "{typography.label}"
    height: "56px"
    width: "64px"
  nav-logo:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.faded-cream}"
    rounded: "{rounded.logo}"
    padding: "0.3em 0.5em 0.2em"
  chip-fact:
    backgroundColor: "{colors.sticker-red}"
    textColor: "{colors.faded-cream}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "10px 16px 8px"
  card-film-print:
    backgroundColor: "{colors.faded-cream}"
    rounded: "{rounded.diecut}"
    padding: "8px"
  card-photo-print:
    backgroundColor: "{colors.print-stock}"
    padding: "10px 10px 34px"
  button-lightbox:
    backgroundColor: "{colors.case-2}"
    textColor: "{colors.faded-cream}"
    width: "52px"
    height: "52px"
---

# Design System: DRAX RAW

## Overview

**Creative North Star: "The Road Case"**

The whole site is Drax's camera road case: a slab of scuffed black laminate, edged in riveted aluminum, plastered with die-cut vinyl stickers from every job. Every piece of content is a physical object stuck to that case. Headings are torn vinyl stickers, films are glossy photo stickers with a title label slapped across the bottom edge, stills are cream-bordered prints held up with masking tape, and the booking section is a full-width slab of red vinyl. Under Drax's fresh stickers, an older layer of bleached, half-covered fragments (REC, DAR, CUT, TZ, 4K, COLOR) shows the case has history.

The world is loud, tactile and crowded on purpose, but every sticker is generated from a seed, so the mess is deterministic and repeatable. Nothing sits perfectly square: each sticker carries a small rotation, a speckled wear mask where the vinyl rubbed off, a multiplied grime layer and a soft lifted shadow. Motion follows the same physics: stickers slap on hard with an overshoot, films peel off the case before they play and slap back after.

The world explicitly refuses the dark-minimal cinematic portfolio: no hairline dividers, no mono micro labels, no gold accents, no full-bleed showreel hero. Drax's die-cut photo sticker is the first thing on screen, framed by his name stickers.

**Key Characteristics:**
- Black laminate case with grain overlay; riveted aluminum extrusions separate panels.
- Every heading, button and label is a vinyl sticker with tilt, wear mask, grime and drop shadow.
- Seeded torn clip-path outlines and seeded tilts, never random per render.
- Anton display lettering, Barlow Condensed labels, Barlow body.
- Slap-on motion (scale 1.45 to 1, back.out overshoot) on load and on scroll.
- Phone first: a steel dock under the thumb with a red Book sticker always in reach.

## Colors

A black case carrying five saturated vinyl colors, all slightly bleached and grimed, with faded cream as both a sticker color and the reading color.

### Primary
- **Sticker Red** (sticker-red): the hire color. The RAW name sticker, every WhatsApp Book button (hero, dock, rail), the full-width booking slab, "The work" heading, the dot in the DRAX.RAW logo, YouTube link underline and footer separators.
- **Sticker Red Deep** (sticker-red-deep): ink on stickers that sit on red or yellow: the slash dividers in the yellow role strip and the "Tuongee." lettering on its cream sticker over the red slab.

### Secondary
- **Tour Yellow** (tour-yellow): the attention and state color. Role strip, round play stickers, the "What I shoot" heading, the booking CTA on the red slab, the TZ on the city badge, every hover color for links, the focus ring and the text selection.

### Tertiary
- **Vinyl Blue** (vinyl-blue): city badge, "From the field" heading, film and service sticker variety.
- **Vinyl Purple** (vinyl-purple): "Who's Drax?" heading, film and service sticker variety.

### Neutral
- **Case Black** (case): page background, theme color, the laminate itself, and the dark wedge revealed when a film sticker corner curls.
- **Case Panel** (case-2): raised laminate inside steel frames: the player lid and lightbox buttons.
- **Case Line** (case-line): the only translucent stroke, on lightbox buttons.
- **Faded Cream** (faded-cream): primary text on the case, the paper sticker color, ink on red, blue and purple stickers, the die-cut border around Drax's cutout and the film print border.
- **Print Stock** (print-stock): the slightly warmer cream of photo prints (field stills, About portrait, Book portrait) and the lightbox frame. Distinct from faded cream on purpose: prints are paper, stickers are vinyl.
- **Adhesive Residue** (adhesive-residue): the sticky back revealed in the film corner curl.
- **Ink** (ink): text on cream and yellow stickers, the ink sticker (logo, Sony fact chip), selection text.
- **Dim Cream** (text-dim): secondary body copy, inactive dock links, footer meta.

Tape is a fixed translucent masking color (rgba(214, 200, 168, 0.82)) with fine vertical stripes; it is a material, not a palette token. Steel is drawn with gradients between #3b3c3f and #e2e3e6 and is likewise a material.

### Named Rules
**The Vinyl Pairing Rule.** Sticker colors come with fixed ink: red, blue, purple and ink stickers carry faded cream; yellow and paper stickers carry ink. Never set a sticker color without its paired ink.

**The Red Means Book Rule.** Sticker red is reserved for the hiring path and the brand mark (RAW, the logo dot). Any element that opens WhatsApp is red, except the booking CTA, which is yellow only because it sits on the red slab.

**The Yellow Is The Pointer Rule.** Every hover, focus ring and selection on the site is tour yellow. Do not introduce another interaction color.

## Typography

**Display Font:** Anton (with Arial Narrow, sans-serif)
**Label Font:** Barlow Condensed 600/700 (with Arial Narrow, sans-serif)
**Body Font:** Barlow 400/500 (with system-ui, sans-serif)

**Character:** Anton is sticker lettering: tall, condensed, all caps, packed tight (line-height 0.86) so it fills a die-cut shape edge to edge. Barlow Condensed is the printed label on gear and road cases; Barlow is the plain voice of Drax talking.

### Hierarchy
- **Display** (Anton 400, clamp(7.5rem, 37vw, 15rem) on phone, clamp(9rem, 16vw, 16rem) on desktop, 0.86): the DRAX name sticker only. RAW runs at roughly 0.72 of that size (clamp(5.5rem, 26vw, 11rem)). The "Tuongee." booking word sits between them (clamp(5rem, 24vw, 13rem)).
- **Headline** (Anton 400, clamp(3.4rem, 15vw, 6rem), 0.86): section title stickers, one per section, each a different vinyl color.
- **Title** (Anton 400, clamp(1.7rem, 7vw, 2.2rem), 0.95): film title labels; the lead film grows to 3rem on wide screens. Service stickers use Anton at clamp(2rem, 9vw, 4.4rem).
- **Lead** (Barlow Condensed 700, clamp(1.6rem, 6vw, 2.3rem), 1.05, uppercase): the hero promise "I shoot it. I cut it. I color it." and the first About paragraph.
- **Body** (Barlow 400, 1.1rem to clamp(1.2rem, 3.4vw, 1.6rem), 1.4 to 1.5): notes under headings and About copy, capped at 34ch to 46ch.
- **Label** (Barlow Condensed 700, 0.8rem to 1.9rem, 0.06em, uppercase): buttons, dock links (0.1em), film meta (0.08em), "Let's talk" (0.14em), facts and footer.

### Named Rules
**The All Caps On Vinyl Rule.** Anything printed on a sticker is uppercase Anton or uppercase Barlow Condensed. Sentence-case Barlow appears only on the case itself or inside the cream About note.

**The Slash Divider Rule.** Lists of roles and metadata are separated by a plain "/" set in a contrasting color (red deep on yellow, red in the footer), never by dots, bullets or dashes.

## Layout

Single column, phone first. The page is a vertical stack of case panels (hero, films, services, prints, about, booking slab, footer) with a 16px riveted aluminum extrusion between each of the first five. Sections pad at the section rhythm vertically and the gutter horizontally; content caps at the 1320px container.

Navigation changes posture by width. Under 900px it is a fixed 72px steel dock at the bottom (plus safe-area inset) with three icon-plus-label links and the red Book sticker on the right; main content pads its bottom to clear it. At 900px and up it becomes a fixed 84px steel rail down the left edge, main content pads left 84px, and the DRAX.RAW logo sticker becomes fixed beside it.

The hero is a stacked grid on phone (name, Drax cutout, role strip, promise, actions) with the stickers overlapping through negative margins. At 900px it splits into a 1.25fr / 1fr two-column board with Drax spanning the right column and overlapping the name by -14%.

Films go from one column, to two columns at 700px with the first film spanning both, to a 12-column collage at 1100px with uneven spans (7/5, 4/4/4, 5) and staggered top offsets (90px, 50px). Prints are a horizontal scroll-snap row of 78vw cards on phone and a 4-column taped wall at 900px, with prints 1 and 6 spanning two columns and prints 2 and 7 dropped 60px. The booking portrait print appears only at 1000px and up.

Overlap and tilt are the composition. Elements are allowed to cross each other's edges; strict alignment is the exception.

## Elevation & Depth

Depth is physical layering, not interface elevation. There are three planes: the case surface (laminate with grain at 0.09 overlay opacity), the old bleached sticker layer (fragments at 0.16 opacity, desaturated and sepia), and Drax's fresh stickers and prints on top. Stickers use CSS drop-shadow filters on an outer wrapper so the shadow follows the torn outline; prints use box-shadow because they are rectangles.

### Shadow Vocabulary
- **Stuck** (`filter: drop-shadow(0 2px 1px rgba(0,0,0,0.45)) drop-shadow(0 10px 18px rgba(0,0,0,0.35))`): every vinyl sticker at rest.
- **Lifted** (`filter: drop-shadow(0 4px 2px rgba(0,0,0,0.4)) drop-shadow(0 18px 24px rgba(0,0,0,0.45))`): sticker buttons and film prints on hover (film uses 22px 26px for the far shadow).
- **Print** (`box-shadow: 0 2px 2px rgba(0,0,0,0.35), 0 16px 26px rgba(0,0,0,0.45)`): taped photo prints; About and Book portraits deepen the far shadow to 22px 36px and 26px 40px.
- **Die-cut border** (`filter: drop-shadow(5px 0 0 #ede4d0)` in four directions plus `drop-shadow(0 14px 22px rgba(0,0,0,0.55))`): the cream vinyl border and shadow around Drax's hero cutout.
- **Extrusion** (`box-shadow: 0 6px 14px rgba(0,0,0,0.55), 0 -2px 6px rgba(0,0,0,0.4)`): aluminum strips casting onto the panels above and below.
- **Lid** (`box-shadow: 0 30px 80px rgba(0,0,0,0.7)`): the film player lid over a 0.92 black backdrop.

### Named Rules
**The Shadow On The Wrapper Rule.** A sticker is two elements: the outer carries tilt and drop-shadow, the inner carries color, wear mask and torn clip-path. Putting a mask or clip on the shadowed element cuts its own shadow off.

**The Wear Is Mandatory Rule.** Every vinyl surface carries the speckled wear mask (300px tile) and the multiplied grime and sheen layer at 0.4 opacity. A clean flat color block is not a sticker.

## Shapes

Three silhouettes carry the world. Torn stickers use a seeded clip-path polygon: a rectangle whose four edges are bitten to a maximum depth (rough, 1.6% to 6%) at 14 steps per long edge. Clean die-cut stickers are plain rectangles with softly rounded corners (6px for buttons, 0.18em for alternating service stickers, 8px for the booking CTA). Round stickers are full circles (play button, city badge) or pills (facts, Seen tag).

Tape strips are 26px tall with straight long edges and ragged short ends from a seeded clip-path, rotated up to 8 degrees, centered over the top edge of a print. Prints are square-cornered with a thicker bottom margin (34px to 40px), like instant photos. Steel parts (dock, rail, player lid) use gradient border-images and dotted rivets, never rounded corners.

Tilt is part of shape: stickers rotate within a seeded range (2.2 degrees for films, 3.5 for prints, 5 for services, up to 9 for the city badge); sticker buttons alternate -1.5 and 1.2 degrees.

Icons are a custom 24px set with 2.4 stroke, square caps and miter joins, chunky enough to read as printed on vinyl.

## Components

### Buttons
Character: stickers you can slap. Tactile, tilted, heavy.
- **Shape:** clean die-cut vinyl with gently rounded corners (6px), 56px tall, icon plus uppercase label at 1.25rem.
- **Primary:** red sticker with cream label (Book on WhatsApp). **Secondary:** cream sticker with ink label (Watch my films).
- **Hover:** lifts 3px and scales to 1.03 while the shadow switches to Lifted (0.25s, ease-out cubic-bezier(0.16, 1, 0.3, 1)). **Active:** presses down 1px and scales to 0.98.
- **Booking CTA:** the largest button, yellow on the red slab, 72px tall, 8px corners, WhatsApp icon at 30px, rotated -1.5 degrees; hover lifts 4px.
- **Close (player):** small cream sticker, 44px tall, rotated 2 degrees.
- **Lightbox controls:** the one non-sticker button: 52px square case-panel tiles with a 2px case-line border; hover turns icon and border yellow.

### Chips
- **Style:** fact stickers in the About section: pill-shaped (999px) vinyl in red, ink and yellow, uppercase label at 1.05rem, each with its own tilt (-4, 3, -2 degrees).
- **Seen tag:** a small cream pill stuck at -10 degrees on a film after it has been played.

### Cards / Containers
- **Film sticker:** a cream-bordered (8px) photo sticker with 6px corners and a screen-blended gloss at 120 degrees. A round yellow play sticker sits over the top-right corner at 8 degrees, and a torn title label in the film's own color sits across the bottom-left edge at -2 degrees. Hover lifts the print 4px, curls the bottom-right corner to show the adhesive back, and spins the play sticker to -8 degrees at 1.12 scale.
- **Photo print:** print-stock border (10px, 34px bottom), 3:2 image, masking tape across the top, zoom-in cursor; hover lifts 4px and scales 1.02.
- **About note:** a large cream torn sticker (rough 1.6) holding the bio, padded 26px, first paragraph set as Lead.
- **Booking slab:** full-width sticker-red panel with its own grime and sheen layer at 0.45; on wide screens a taped portrait print of Drax hangs on the right at 5 degrees.

### Navigation
- **Phone dock:** fixed bottom bar, 72px plus safe-area, dark vertical laminate gradient, 3px brushed-steel top border, a rivet at each end, a heavy upward shadow. Links are icon over 0.8rem label in dim cream, 64px by 56px minimum; hover and focus turn yellow. The red Book sticker sits on the right at -3 degrees.
- **Desktop rail:** the same parts rotated into an 84px fixed left rail with a steel right border and rivets top and bottom; the Book sticker stacks icon over label.
- **Logo:** an ink sticker reading DRAX.RAW in Anton at 1.35rem with a red dot, 4px corners, tilted -2 degrees; absolute on phone, fixed beside the rail on desktop.

### Player (signature)
The case lid opens and the film plays inside it. A full-viewport dialog over a 0.92 black backdrop holds a case-panel lid in a 6px brushed-steel border-image frame, with the film title in Anton, the Close sticker, a 16:9 (or 9:16 for vertical reels) YouTube nocookie embed and an Open on YouTube link. Opening: the tapped film sticker peels off from its top-right (rotate -14, rise 70px, fade, 0.42s power2.in), then the lid scales in from 1.12 at -3 degrees (0.45s back.out(1.6)). Closing slaps the sticker back into place (0.38s back.out(2)).

### Slap-On Motion (signature)
All motion is GSAP and is skipped entirely under prefers-reduced-motion. Any element marked as slappable enters from scale 1.45, opacity 0 and a random rotation within 10 degrees, to rest in 0.42s with back.out(2.2). In the hero the old fragments fade in first (0.8s, 0.04 stagger), then Drax's stickers slap on 0.16s apart, and the first three each jolt the whole hero 4px down like a thud. Below the fold, stickers batch in as they reach 88% of the viewport, once, with a 0.09s stagger.

## Do's and Don'ts

### Do:
- **Do** build every new heading, label and button from the sticker primitive: outer wrapper with tilt and Stuck shadow, inner vinyl with color, wear mask and optional torn outline.
- **Do** seed every torn outline, tape edge and tilt (tornClip, tapeClip, tilt) so the layout is identical on every load; pick a new unused seed for each new sticker.
- **Do** pair sticker colors with their fixed ink (cream on red, blue, purple, ink; ink on yellow and paper).
- **Do** keep sticker red for the WhatsApp booking path and the brand mark, and yellow for every hover, focus (3px outline, 3px offset) and selection.
- **Do** show stills as print-stock prints with masking tape, and films as cream-bordered photo stickers with a torn title label.
- **Do** separate major case panels with the riveted aluminum extrusion.
- **Do** mark new stickers as slappable so they join the slap-on motion, and keep every animation behind the reduced-motion check.
- **Do** keep touch targets at 44px minimum (dock links 56px, buttons 56px, CTA 72px).

### Don't:
- **Don't** use hairline dividers, mono micro labels, gold accents or a full-bleed showreel hero; the world was chosen against the dark-minimal cinematic portfolio.
- **Don't** set a sticker perfectly square to the page or without wear and grime; flat clean color blocks break the case.
- **Don't** put a clip-path or mask on the element that carries the drop-shadow.
- **Don't** use rounded corners on steel parts or on photo prints.
- **Don't** introduce new interaction colors, gradients on text, or glass and blur effects.
- **Don't** separate roles or metadata with dots, bullets or dashes; use "/" in a contrasting color.
- **Don't** write any Unicode dash in copy; ASCII hyphen only.
- **Don't** rely on the unused leftovers in the global stylesheet (the steel color variable and the plain section-title class); section headings use the headline sticker sizing documented above.
