# Left by Design: Rethinking Everyday Experiences for Left-Handed Users

A college design thinking project focused on redesigning digital payment interactions for left-handed users in demanding physical environments.

## Persona: Roshni (42, Vegetable Vendor)
- **Physical Context**: Holds phone in left hand while right hand handles produce.
- **Cognitive Model**: Believes wrong taps are permanent and irreversible; blames herself when transactions fail.
- **HMW Question**: *"How might we help Roshni, a left-handed vendor, complete each payment confidently on her own, with her other hand busy and customers waiting?"*

## Core Testing Function
Tap every PIN digit and the Pay button using **only the thumb of the holding hand**.

## Key Innovations
1. **Holding Hand Adaptation**: Select holding hand on first screen; keypad and Pay button nest directly into the natural radial sweep of the holding thumb.
2. **Top-Pinned Amount (Zero Palm Occlusion)**: Amount (`₹180`) and vendor name are pinned to the top of the viewport so the user's hand and palm never cover the payment details while typing.
3. **Ergonomic Reach Architecture**: Pay button is anchored inside the thumb's resting comfort zone rather than the distant bottom-right corner.
4. **Calm, Blameless Errors**: Reassuring feedback (*"That PIN did not match. Try again. Take your time, no money was deducted."*) and persistent reassurance (*"You can clear a digit before paying."*).
5. **Multi-Sensory Feedback**: Synthesized Web Audio clicks, haptic vibrations, and speech readout (`speechSynthesis`).
6. **Observer Testing Suite**: Live stopwatch, wrong tap counter, hand-switch tracker, confidence rating (1–5), comparative summary table, and Markdown/CSV export.

## Running the Application
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
