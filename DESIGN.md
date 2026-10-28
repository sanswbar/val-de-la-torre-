---
name: Valeria de la Torre
description: Bilingual speaker site. Warm editorial paper, light italic serif, one terracotta ember.
colors:
  white: "#FFFFFF"
  off-white: "#F7F5F2"
  sand: "#EDE8E0"
  sand-dark: "#DDD6CB"
  black: "#0D0D0D"
  gray-dark: "#3A3835"
  gray-mid: "#6B655E"
  gray-line: "#8A847D"
  gray-light: "#C4BDB5"
  accent: "#C8522A"
  accent-dark: "#A33E1A"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(52px, 6vw, 92px)"
    fontWeight: 300
    lineHeight: 1.02
  headline:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(42px, 5.5vw, 72px)"
    fontWeight: 300
    lineHeight: 1.06
  title:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(28px, 3vw, 40px)"
    fontWeight: 300
    lineHeight: 1.2
  quote:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(1.4rem, 2.5vw, 2rem)"
    fontWeight: 400
    lineHeight: 1.4
  body-lead:
    fontFamily: "Jost, Helvetica Neue, sans-serif"
    fontSize: "17px"
    fontWeight: 300
    lineHeight: 1.9
  body:
    fontFamily: "Jost, Helvetica Neue, sans-serif"
    fontSize: "15px"
    fontWeight: 300
    lineHeight: 1.8
  label:
    fontFamily: "Jost, Helvetica Neue, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.2em"
rounded:
  none: "0px"
  sm: "2px"
spacing:
  gutter-mobile: "20px"
  gutter-tablet: "28px"
  gutter-desktop: "40px"
  section-mobile: "56px"
  section-tablet: "88px"
  section-desktop: "120px"
  container-max: "1120px"
components:
  button-primary:
    backgroundColor: "{colors.black}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "15px 32px"
  button-primary-hover:
    backgroundColor: "{colors.accent-dark}"
    textColor: "{colors.white}"
  button-submit:
    backgroundColor: "{colors.black}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "18px 48px"
    width: "100%"
  button-text-link:
    textColor: "{colors.black}"
    typography: "{typography.label}"
    padding: "0"
  button-text-link-hover:
    textColor: "{colors.accent-dark}"
  lang-toggle:
    textColor: "{colors.black}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "9px 18px"
  lang-toggle-hover:
    backgroundColor: "{colors.black}"
    textColor: "{colors.white}"
  input-underline:
    textColor: "{colors.black}"
    rounded: "{rounded.none}"
    padding: "12px 0"
  talk-card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.none}"
    padding: "36px 48px 48px"
  talk-card-hover:
    backgroundColor: "{colors.sand}"
---

# Design System: Valeria de la Torre

## Overview

**Creative North Star: "The Warm Editorial"**

Professional enough that a conference organizer trusts it, and warm enough that it feels like Val. The site is laid out like a fashion or culture magazine: large light italic serif headlines, generous white space, small uppercase labels with wide letter-spacing, and photography given full-bleed room. All of that sits on warm paper instead of cold white, speaks in the first person, and ends with her handwritten signature. The editorial structure provides the trust and the warmth comes from the paper, the voice and the signature. Neither should take over from the other.

Density is low and pacing is slow. Each section is a single idea with plenty of air (120px vertical padding on desktop). Sections are separated by stepping the background tone (paper, white, sand) rather than by rules or cards. Color is almost absent: the palette is warm neutrals and near-black, plus one terracotta ember used sparingly. Motion is quiet. Content fades up gently on scroll, the brand logos glide slowly, and hovers shift color without lifting anything.

**Key Characteristics:**
- Light (300) Cormorant Garamond for every heading, usually italic.
- Jost Light for body text, with tiny uppercase Jost Medium labels at about 0.2em tracking.
- Warm paper neutrals; the near-black `#0D0D0D` stands in for pure black.
- One accent, Terracotta Ember, used as a mark and a hover response and never as a fill area.
- Corners are square or nearly square (0–2px). There are no shadows on surfaces.
- Split and two-column editorial layouts that collapse to a single column on phones, with a fixed CTA bar at the bottom.
- Her signature closes the page.

## Colors

The palette is warm paper and ink with one ember: low saturation, warm undertones throughout, and contrast carried by near-black type.

### Primary
- **Terracotta Ember** (`accent`): the only chromatic color. It appears as the 48px hairline under the hero title, as the keyboard focus ring (2px, 4px offset), and as the underline on the inline email link. It marks things. It is never used as a large fill.
- **Deep Ember** (`accent-dark`): the ember used wherever text has to meet AA. It is the hover fill for the primary and submit buttons (white text 6.4:1, where Terracotta Ember was only 4.47:1), the hover color of text links, and the color of form error text and invalid-field underlines.

### Neutral
- **Ink** (`black`): headlines, primary and submit button fills, and input text on focus. A softened black, never `#000`.
- **Warm Graphite** (`gray-dark`): long-form body text (about, TED description), secondary italic subtitles and the success message.
- **Stone** (`gray-mid`): labels, eyebrows, fact labels, placeholders, the select arrow, the copyright line and the quote attribution. It passes AA on Paper, White and Sand. On Dune it is too light, so the TEDx eyebrow uses Warm Graphite.
- **Stone Line** (`gray-line`): non-text only, at ≥3:1. Used for input underlines at rest and the footer social icons.
- **Pale Stone** (`gray-light`): decorative only. It is no longer used for any text.
- **Paper** (`off-white`): the page's base surface, used for the hero text side, talks, contact and the mobile CTA bar.
- **Gallery White** (`white`): alternating surface for the quote strip, about, brands, footer and talk cards.
- **Sand** (`sand`): image placeholders, talk-card hover fill, and fine dividers (brand-track rules, audience rule, footer and contact top rules).
- **Dune** (`sand-dark`): the deepest surface, used for the TEDx section. Also the quote box border and the underline on inputs at rest.

### Named Rules
**The Single Ember Rule.** Terracotta Ember is the only hue on the page apart from photography and, on hover only, the brand logos. It appears as a hairline, a dot or a hover state. If it ever covers a surface larger than a button, it has gone too far.

**The Tonal Step Rule.** Sections are separated by changing the background (Paper → White → Paper → Dune → White → Paper), not by cards, shadows or heavy rules.

## Typography

**Display Font:** Cormorant Garamond (with Georgia, serif)
**Body Font:** Jost (with Helvetica Neue, sans-serif)

**Character:** A high-contrast, Didone-leaning serif set very light and mostly in italic, paired with a clean geometric sans set light. The serif carries the emotion and the voice; the sans carries information and stays out of the way.

### Hierarchy
- **Display** (300 roman with an italic second line, clamp 52–92px, line-height 1.02): the hero line only ("Redefiniendo / *los límites.*"). On mobile it is clamp 38–56px.
- **Headline** (300 italic, clamp 42–72px, line-height 1.06): section titles such as "Quién soy", "Mis conferencias" and "Trabajemos juntos". On phones it is clamp 32–48px. Headings that are full sentences step down: the TEDx title to clamp 24–40px, and the contact heading ("Compárteme los detalles de tu proyecto.") to clamp 36–52px (30–40px on phones), with balanced line breaks.
- **Title** (300 italic, clamp 28–40px, line-height 1.2): talk names on cards.
- **Quote** (400 italic, clamp 1.4–2rem, line-height 1.4): the Mujica pull-quote, plus the form success message at 24px.
- **Body Lead** (Jost 300, 17px, line-height 1.9, Warm Graphite): the about biography.
- **Body** (Jost 300, 15px, line-height 1.8, Warm Graphite): talk and TED descriptions and contact intro text. It drops to 14px on phones. Justified text always hyphenates automatically.
- **Label** (Jost 500, 11px, 0.12–0.24em tracking, uppercase, Stone): eyebrows, form labels, fact labels, button text, the site name and the language toggle. 11px is the floor at every width.

### Named Rules
**The Light Hand Rule.** Serif headings are always weight 300 and section titles are always italic. Bold serif is not part of this system. Emphasis comes from size and italic, not weight.

**The Whisper Label Rule.** Every piece of UI chrome (labels, buttons, toggles, eyebrows) is tiny uppercase Jost Medium with wide tracking. Sentence-case UI text does not appear.

## Layout

- **Container:** max-width 1120px, centered, with side gutters of 40px on desktop, 28px on tablets (≤960px) and 20px on phones (≤640px). Every mobile section uses the same 20px edges.
- **Vertical rhythm:** section padding is 120px on desktop, 88px on tablets and about 48–56px on phones. Section titles sit 56px above their content on desktop and 20–32px on phones.
- **Hero:** a 50/50 split filling the viewport (100svh) with text on the left on Paper, pushed to the bottom, and the full-bleed portrait on the right. On tablets the photo stacks on top at 56vw height; on phones it is a 100vw square. The hero CTA is hidden on phones and replaced by the fixed bottom CTA bar.
- **About:** an asymmetric 5:6 grid of a 4:5 portrait and text, with a 96px gap. The photo is offset 127px down so it aligns with the first paragraph instead of the heading. Single column at ≤960px.
- **Talks:** two cards side by side with a 13px gap, collapsing to one column. Talk photos are 16:9 (4:3 on phones).
- **TEDx:** a 1:1 grid of text and a 16:9 video thumbnail with an 80px gap; the video drops below the text on mobile.
- **Brands:** a single horizontal track masked at both edges, moved by JS at 40px/s. It pauses on hover and supports touch scrubbing. Slots are 160px wide (110px on phones).
- **Contact:** a 1:1.8 grid of intro and form with a 96px gap. The two-up form row (name and organization) stacks on phones.
- **Header:** fixed with no background. The name is on the left and the language toggle on the right. Only those two controls catch pointer events.

## Elevation & Depth

The system is flat. Depth comes from tonal steps between surfaces (Paper, White, Sand, Dune), from photography, and from hairline borders. Surfaces never cast shadows. Shadow appears in exactly two places, both on imagery: a soft drop shadow under the white play icon on the TEDx thumbnail, and a text shadow on the "Coming soon" overlay, both there to keep white marks legible over photos. The fixed mobile CTA bar uses translucent Paper (96%) with a 12px backdrop blur. That frosted bar is the only layered surface.

### Named Rules
**The Paper Stays Flat Rule.** Cards, buttons and inputs never get a box-shadow. Hover is shown by a color shift (Ink → Ember, White → Sand), a slight image zoom (1.03) or an arrow nudge, never by lifting.

## Shapes

Corners are architectural. Buttons and the language toggle get a near-square 2px radius. Cards, photos, inputs and the quote box are fully square (0px). Lines are 1px hairlines in Sand or Dune. The only round shapes are the 6px Ember credential dot and the play icon. Inputs are underlines rather than boxes. The 48px Ember hairline under the hero title is the system's signature mark.

## Components

Quiet but confident: everything is restrained hairlines and whispered labels, except the solid Ink primary button, which is the one assertive object on any screen.

### Buttons
- **Shape:** nearly square (2px).
- **Primary:** Ink fill, white label text, 15px × 32px padding. It aligns to the start in the hero and spans the full width in the mobile CTA bar.
- **Hover:** the fill turns Deep Ember (200ms ease). The button does not move or lift.
- **Submit:** like Primary but full width with 18px × 48px padding. While sending, the label reads "Enviando…" / "Sending…" at 55% opacity.
- **Text link (secondary):** a bare Ink label followed by a "→" arrow, with a 44px minimum height. On hover the label turns Deep Ember and the arrow slides 5px to the right. Used for "Quiero esta conferencia", "Avísame cuando esté lista" and "Ver TED". The talk CTAs preselect the collaboration type and name the talk in the form.
- **Focus (all controls):** 2px Terracotta Ember outline with a 4px offset.

### Cards / Containers
- **Talk card:** White, square corners, no border and no shadow. A 16:9 photo bleeds to the card edges above a 36/48/48px body. Contents run label → italic title → italic subtitle (Cormorant 400, 20–24px, Warm Graphite) → description → facts row → text-link CTA. Titles take their natural height, so the cards can differ in height. On hover the card fill turns Sand and the photo zooms to 1.03 (300–400ms).
- **Facts row:** a two-column definition list below a Dune hairline. Each item is a Stone label (11px uppercase) over an Ink value (Jost 400, 15px): duration, format, language and audience. Show only confirmed facts. A talk without a set duration leaves that item out.
- **Coming-soon state:** the photo area is a plain Sand panel with a large Warm Graphite italic "Próximamente / Coming soon". The CTA becomes a "notify me" request instead of a booking.
- **Quote box:** White with a 1px Dune border, square, centered, about 92vw wide (max 1200px). It contains the italic quote and a small uppercase citation at 40% opacity.

### Inputs / Fields
- **Style:** no box. Transparent background with a 1px Stone Line underline, 15px Jost Light text, 12px vertical padding and 0px radius. Placeholders are Stone. An optional field says so in its label ("(opcional)").
- **Focus:** the underline turns Ink and thickens to 2px (200ms). There is no glow or ring.
- **Error:** validation runs on submit, then again on each fix. The underline turns Deep Ember, and a 13px Deep Ember message sits under the field, linked through `aria-describedby`. Focus moves to the first invalid field. A send failure appears inline below a Dune hairline, with the direct email as an underlined link. The typed message is never cleared.
- **Select:** native appearance is removed and a Pale Stone "↓" glyph serves as the arrow.
- **Labels:** whisper labels (10px uppercase, Stone) placed 10px above the field.
- **Success:** the form is replaced by an italic Cormorant message centered below a Dune hairline.

### Navigation
- **Header:** a transparent fixed bar with 44px targets. The site name is a whisper label in Ink and fades to 60% opacity on hover. The language toggle is a 2px-radius chip of 92% Paper with a 1px Ink border at 25% opacity, so it stays readable over any section; on hover it fills with Ink and the text turns white. While the header sits over the hero photo (`on-dark`, measured at every width), the toggle becomes a white outline, and on tablet and phone the name turns white too.
- **Mobile CTA bar:** fixed to the bottom on screens ≤640px, frosted Paper with a Sand top rule, holding a full-width primary button and respecting the safe area. It slides away (300ms ease-out) once the contact section is on screen, so it never covers the form.
- **Footer:** White with a Sand top rule. Social icons in Stone Line, with 44px hit areas, turn Ink on hover. The grayscale signature sits at 25% opacity and the copyright is a Stone whisper label.

### Brand Carousel (signature)
A continuous strip of client logos between two Sand hairlines, with soft edge masks. It glides at 40px/s and pauses on hover, on keyboard focus, and entirely under `prefers-reduced-motion`; dragging still works. Logos are grayscale at 45% opacity. Each logo's width is tuned by hand so they look the same size. On hover a logo shows its own color: Meta blue, Amex blue, Levi's red, and pure black for wordmark logos. This is the only place where colors other than Ember may appear.

## Do's and Don'ts

### Do:
- **Do** set every serif heading in Cormorant Garamond at weight 300, and section titles in italic.
- **Do** write all UI chrome as 11px uppercase Jost Medium with 0.12–0.24em tracking. Never go below 11px.
- **Do** use Terracotta Ember only as a hairline, a dot or the focus ring, and Deep Ember for hover fills, link hovers and errors.
- **Do** separate sections by stepping the background through Paper, White, Sand and Dune.
- **Do** keep corners at 0px for surfaces and photos and 2px for buttons.
- **Do** show hover through color, a 1.03 image zoom or a 5px arrow nudge, on 200ms ease timing (300–400ms for card fills and photos).
- **Do** fade content up 28px over 0.7s on scroll, and turn this off under `prefers-reduced-motion`.
- **Do** keep side margins at exactly 20px on phones across every section.
- **Do** close the page with her signature (`firma-val.png`) in grayscale at low opacity.

### Don't:
- **Don't** add box-shadows to cards, buttons or inputs. The paper stays flat.
- **Don't** introduce a second accent color or fill large areas with Ember.
- **Don't** use bold or semibold serif headings.
- **Don't** use pure `#000` or cold pure-white page backgrounds. Paper (`#F7F5F2`) is the base and White is the alternate.
- **Don't** draw inputs as boxes. Fields are underlines.
- **Don't** round corners beyond 2px, except the play icon.
- **Don't** set text in Pale Stone or with opacity-faded black. Text uses Stone or darker.
