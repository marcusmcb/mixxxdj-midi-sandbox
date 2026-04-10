# DDJ-RX MIDI Findings

## Bottom line

The low-level MIDI blocker is effectively resolved.

The DDJ-RX MIDI message document confirms:

- the controller exposes standard MIDI note and CC messages
- the device uses a predictable channel layout by controller section
- many absolute controls use 14-bit MIDI pairs
- LEDs can be driven by MIDI output for many core controls

This is enough to begin a real Mixxx mapping plan.

## Channel model

The DDJ-RX message list defines channels by section:

- deck 1 / mixer ch1: MIDI channel 1
- deck 2 / mixer ch2: MIDI channel 2
- deck 3 / mixer ch3: MIDI channel 3
- deck 4 / mixer ch4: MIDI channel 4
- FX1 section: MIDI channel 5
- FX2 section: MIDI channel 6
- browser / global section: MIDI channel 7
- performance pads for deck 1: MIDI channel 8
- performance pads for deck 2: MIDI channel 9
- performance pads for deck 3: MIDI channel 10
- performance pads for deck 4: MIDI channel 11

In practice, that means the input/output status bytes line up as expected:

- deck buttons and knobs: `0x90` to `0x93` and `0xB0` to `0xB3`
- FX section: `0x94` / `0x95` and `0xB4` / `0xB5`
- browser/global: `0x96` and `0xB6`
- pad channels: `0x97` to `0x9A` and `0xB7` to `0xBA`

That is a clean structure and fits Mixxx mapping work well.

## Important implementation findings

### 1. The controller is not just note-based

The DDJ-RX uses both:

- note messages for buttons, modes, LEDs, and some touch states
- CC messages for continuous controls and some relative encoders

### 2. Several main controls are 14-bit

The message list shows paired MSB/LSB CC values for several key controls.

Examples:

- tempo slider: `CC 0 / 32`
- crossfader: `CC 1 / 33`
- trim: `CC 4 / 36`
- EQ high: `CC 7 / 39`
- EQ mid: `CC 11 / 43`
- EQ low: `CC 15 / 47`
- channel fader: `CC 19 / 51`
- color knobs in mixer/global section: 14-bit pairs as well

This is good news. It means smoother, higher-resolution response for the most important controls.

### 3. Browser controls are on a separate global channel

The browser section uses channel 7, which simplifies mapping:

- rotary selector uses relative CC
- load buttons are note-based
- back and tag track buttons are note-based

### 4. Performance pads are mode-dependent but structured

The pad section is more complex, but it is structured rather than arbitrary:

- pad messages are separated by deck-specific pad channels
- each mode uses a different note range
- velocity sampler mode uses CC values for pad pressure/velocity

This means a first hotcue-only implementation can stay simple, while later pad modes can be layered in systematically.

### 5. LED feedback is available

The message list includes MIDI-out rows for many LEDs.

That means we should be able to support at least:

- play LEDs
- cue LEDs
- sync LEDs
- load / track loaded indicators
- mode button LEDs
- at least part of the pad illumination behavior

## High-confidence control inventory for V1

These controls are strong first-pass candidates because the message list makes them straightforward:

- play / pause
- cue
- sync
- jog wheel side rotation
- jog top / platter interaction
- tempo slider
- master tempo / keylock
- deck select buttons
- browse encoder
- load buttons
- back button
- trim
- EQ high / mid / low
- channel faders
- crossfader
- headphone cue
- master cue
- auto beat loop
- loop halve / double
- loop in / out
- hot cue mode button
- performance pads in hot cue mode
- parameter buttons
- quantize
- slip

## Controls that likely need extra care

These are possible, but they should not be part of the first implementation pass:

- slicer and slicer loop
- pad FX modes
- sequencer controls
- velocity sampler behavior
- jog illumination parity
- advanced on-jog display behavior
- sound color FX parity beyond a basic Mixxx-friendly approximation

## Specific notes that matter for Mixxx

### Relative controls

The message list shows relative values for controls like jog rotation and the browser rotary selector. Those need dedicated relative-value decoding in the JS mapping, not simple XML-only absolute mapping.

### Absolute 14-bit controls

Tempo, faders, and EQ should be handled in JavaScript or with explicit support for high-resolution data so we do not throw away precision unnecessarily.

### Shifted controls

The DDJ-RX consistently exposes shifted functions as distinct note values in many places. That means some shifted behavior can be mapped directly rather than only through software-maintained modifier state.

### Pad modes

Because the MIDI list distinguishes pad modes, we can treat the performance pad section as an intentionally layered subsystem rather than an ambiguous one.

## Practical conclusion

We now have enough technical detail to do meaningful planning for a Mixxx mapping.

The next blocker is no longer missing MIDI information. The next challenge is deciding how narrow the first implementation should be.

The right answer is still a small, usable V1 focused on:

- 2 decks
- transport
- jogs
- tempo
- mixer
- browse/load
- loops
- hotcues
- basic LEDs