# DJM-S11 Mixxx V1 Plan

## Goal

Build a first useful Mixxx mapping for the DJM-S11 that respects what the hardware is best at:

- 2-deck battle workflow
- strong mixer control
- hotcue and loop performance
- selective use of touch-MIDI controls

## V1 include

- browse encoder push and rotation
- back
- load deck 1 and deck 2
- play
- cue
- sync
- key lock
- quantize
- 4-beat loop
- loop halve / double
- hot cue mode
- pads 1 to 8 in hot cue mode
- mixer trim
- EQ high / mid / low
- filter
- channel faders
- crossfader
- headphone cue
- headphone volume
- headphone mix
- basic LED feedback

## V1 exclude

- Touch FX behavior parity
- full Deck 3 and 4 screen workflow
- Smooth Echo parity
- full software FX bank parity
- Dual Control semantics
- every touch-MIDI page element
- vendor-specific screen rendering concepts

## Mapping approach

### XML

Use XML to wire the direct notes and CCs to Mixxx or JS handlers.

### JavaScript

Use JavaScript for:

- 14-bit control assembly where needed
- relative browse handling
- LED feedback connections
- any shifted or touch-screen-specific logic that is clearer in code

## Recommended order

### Step 1

Prove the basic control path:

- browse
- back
- load
- play
- cue
- sync

### Step 2

Make the mixer usable:

- trim
- EQ
- filter
- faders
- crossfader
- cue monitoring

### Step 3

Add performance workflow:

- 4-beat loop
- loop halve / double
- hotcue mode
- hotcue pads
- quantize
- key lock

### Step 4

Layer in selective touch-MIDI extras:

- touch play
- touch sync
- touch library view if useful
- selected extra buttons that map cleanly to Mixxx controls

## Verification gates

Before expanding v1, verify these four things:

1. The DJM-S11 enumerates as a MIDI device in Mixxx.
2. The DJM-S11 ASIO driver exposes usable stereo inputs and outputs in Mixxx.
3. Basic LEDs follow Mixxx state rather than only mirroring button presses.
4. Touch-screen MIDI controls send stable, ordinary MIDI values in real use.

## Best immediate next step

The next concrete move should be:

- add the DJM-S11 user manual PDF to the repo if you have it
- verify audio I/O visibility in Mixxx on Windows
- then scaffold `mappings/pioneer-djm-s11/` in the same way as the DDJ-RX work

If the audio I/O check passes, the project can move directly from feasibility into implementation.