# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People who book speakers: event organizers at companies (HR, leadership, diversity and inclusion teams), universities, DIF and other government or community events, and general congresses. No one segment comes first, so the site has to work for a corporate buyer and a university or community organizer equally. A secondary audience is brand and marketing teams looking at content or brand collaborations.

The visitor is usually checking whether Valeria fits an event: who she is, what her talks are about, whether she is credible (TEDx, brand work), and how to reach her.

## Product Purpose

valdelatorre.com is the personal site of Valeria de la Torre, a speaker and content creator. Its job is to turn interested organizers and brands into contact-form inquiries for talks and collaborations. Success means qualified inquiries that include the organization, the type of collaboration, an estimated date, and the audience.

## Positioning

Valeria speaks from her own experience. She spent years in the mountains, traveling, and moving, and in 2024 an accident forced her to rebuild her life from scratch. Her talks cover adversity we don't choose, adaptation, and rebuilding. One talk is testimonial ("La montaña que no elegí"), and the other is a practical five-phase method ("De la supervivencia a la reconstrucción"). A TEDx talk backs this up ("No hay prótesis para un espíritu amputado", Universidad Panamericana Guadalajara).

## Operating Context

- Visitors are bilingual and international. Spanish (ES) and English (EN) carry equal weight, with a language toggle in the header. Spanish is the HTML default, and every piece of copy lives in `translations.js` for both languages.
- Visitors arrive from her social profiles (Instagram, LinkedIn) or from referrals, often on a phone. A fixed CTA bar sits at the bottom of the screen on mobile.
- Inquiries go through a Formspree form (`formspree.io/f/xkoaayrd`). Valeria reads and answers each one herself.

## Capabilities and Constraints

- Static HTML/CSS/vanilla JS (`index.html`, `style.css`, `main.js`, `translations.js`). There is no build step. It is hosted at the custom domain `valdelatorre.com` (CNAME, GitHub Pages-style).
- Sections: hero, Mujica quote, about, talks (2), TEDx, brand carousel, contact form, footer with Instagram and LinkedIn.
- Contact form fields: name, organization, email, collaboration type (talk / brand collaboration / content / other), estimated date, description.
- Every copy change must be made in both ES and EN.
- Talk 02 ("De la supervivencia a la reconstrucción") **cannot be booked yet** (confirmed 2026-10-28). Present it as upcoming in both languages, not with a booking CTA.
- Talk facts (confirmed 2026-10-28): Talk 01 runs 45–60 min and can be adapted. Both talks can be given in person or virtually, in Spanish or English. The audience for both is "Todo tipo de público" / "All audiences". Talk 02's duration has not been set.
- **Open:** no OG image yet (there is a placeholder comment in `<head>`).

## Brand Commitments

- Name: Valeria de la Torre ("Val"). Copy is in the first person and her voice is warm and personal ("Leo cada mensaje y respondo personalmente").
- Hero line: "Redefiniendo los límites." / "Redefining limits."
- Her handwritten signature (`assets/images/firma-val.png`) appears in the footer.
- **Her story is told indirectly.** Copy says "an accident changed my life" and goes no further than what she has published. Future copy and imagery must not add details about her injury, disability, or prosthesis, or put them in front.

## Evidence on Hand

- TEDx talk: https://www.youtube.com/watch?v=KGalxsvs9Kg (thumbnail `assets/images/tedxval.webp`).
- Brand logos she has collaborated with (`assets/images/logo-*`): Össur, lululemon, Habits, American Express, Meta, West Elm, Levi's, Nespresso, Salomon.
- Photography: hero (`hero-val.webp`), about (`about-val.webp`), on stage (`conferencia3.webp`, `conf2-blur.webp`), TED (`ted-val.jpg`), TikTok thumbnail.
- Socials: Instagram `@valdelatorre`, LinkedIn `valdelatorrega`.
- **Not on hand. Do not invent:** testimonials, organizer quotes, audience numbers, event counts, fees, press mentions, or a client list beyond the logos above.

## Product Principles

1. **Earn the inquiry.** Each section should help an organizer decide to get in touch. The form is the destination.
2. **Her voice, first person.** The site reads as Valeria talking to you, not as an agency pitching her.
3. **Dignity over drama.** Present her story with restraint. The message (rebuilding, adaptation) leads, and the injury does not.
4. **Two languages, one site.** ES and EN are equal. Nothing ships in only one language.
5. **Proof stays real.** Credibility comes only from verifiable assets: the TEDx talk, actual brand collaborations, real photos.
