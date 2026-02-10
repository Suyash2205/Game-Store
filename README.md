# Nexus Game Store

A mock online game store (in the spirit of Epic Games and Steam) with games, hardware, checkout, and a contact form.

## Pages

- **Home** (`index.html`) — Hero, featured games, and popular hardware
- **Games** (`games.html`) — Catalog: Spider-Man 2, Hogwarts Legacy, Age of Empires II/IV, Elden Ring, Zelda, Baldur's Gate 3, Cyberpunk 2077, God of War, and more
- **Hardware** (`hardware.html`) — Consoles: PS5, Nintendo Switch (OLED & standard), Xbox Series X/S, Steam Deck, DualSense controller
- **Checkout** (`checkout.html`) — Cart summary and placeholder payment form (no real charges)
- **Contact** (`contact.html`) — “Reach out to us” form (mock; no email sent)

## How to run

Open `index.html` in a browser, or use a local server:

```bash
# Python 3
python3 -m http.server 8000

# Node (npx)
npx serve .
```

Then visit `http://localhost:8000` (or the port shown).

## Features

- Add games and hardware to cart (stored in `localStorage`)
- Cart count in header updates across pages
- Checkout shows order summary and a fake “Place order” flow
- Contact form shows a success message on submit
- Responsive layout and dark theme

All product names are used for demonstration only; trademarks belong to their respective owners.
