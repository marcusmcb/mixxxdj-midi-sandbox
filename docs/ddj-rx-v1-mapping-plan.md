# DDJ-RX Mixxx V1 Mapping Plan

## Goal

Build a first usable Mixxx mapping for the DDJ-RX without trying to recreate full Rekordbox parity.

## V1 Scope

### Include

- browser rotary selector
- deck load buttons
- play / pause
- cue
- sync
- jog bend
- jog scratch
- tempo sliders
- keylock / master tempo
- channel trims
- EQ high / mid / low
- channel faders
- crossfader
- headphones cue
- master cue
- auto beat loop
- loop in / out
- loop halve / double
- hot cue mode button
- performance pads in hot cue mode only
- parameter buttons only where needed for hotcue / loop support
- quantize
- slip
- basic play / cue / sync / load / hotcue LEDs

### Exclude from V1

- pad FX modes
- slicer modes
- sequencer
- sampler workflow
- velocity sampler
- dual deck mode
- grid adjust / slide
- sound color FX parity
- advanced jog illumination and on-jog display behavior

## Technical approach

### File structure

Planned files:

- `mappings/pioneer-ddj-rx/Pioneer-DDJ-RX.midi.xml`
- `mappings/pioneer-ddj-rx/Pioneer-DDJ-RX-scripts.js`

### XML responsibilities

Use XML for:

- straightforward button bindings where state is simple
- wiring incoming MIDI to JS handlers
- declaring the JS script file and function prefix

### JavaScript responsibilities

Use JS for:

- jog wheel relative decoding
- scratch enable / disable and tick handling
- 14-bit tempo handling if Mixxx XML support is not sufficient for the exact behavior wanted
- soft takeover setup
- LED feedback callbacks
- deck-layer abstractions if later needed

## Recommended control implementation order

### Step 1. Browser and transport

Implement first:

- browser rotary selector
- load left / right
- play / pause
- cue
- sync

Reason:

This produces immediate proof that the controller is talking to Mixxx correctly.

### Step 2. Mixer core

Implement next:

- trims
- EQ high / mid / low
- channel faders
- crossfader
- headphone cue
- master cue

Reason:

These controls are high-value and mostly deterministic from the MIDI list.

### Step 3. Tempo and jogs

Implement next:

- tempo sliders
- keylock / master tempo
- jog side pitch bend
- jog top touch scratch behavior

Reason:

This is the most important part of the performance feel, but it is more stateful and should come after the core wiring is proven.

### Step 4. Loops and hotcues

Implement next:

- auto beat loop
- loop halve / double
- loop in / out
- hot cue mode
- pads 1 to 8 in hot cue mode

Reason:

This makes the controller genuinely usable for live mixing.

### Step 5. LEDs

Add callback-driven LEDs for:

- play
- cue
- sync
- load / track loaded
- hotcue enabled state where practical

Reason:

Mixxx should drive the controller state, not only mirror button presses.

## Technical notes from the MIDI list

### 14-bit controls

The following should be treated as high-resolution controls:

- tempo: `CC 0 / 32`
- crossfader: `CC 1 / 33`
- trim: `CC 4 / 36`
- EQ high: `CC 7 / 39`
- EQ mid: `CC 11 / 43`
- EQ low: `CC 15 / 47`
- channel fader: `CC 19 / 51`

### Relative controls

These need relative decoding:

- browser rotary selector
- jog wheel rotation

### Likely reference mappings to mine

- Pioneer DDJ-SX
- Pioneer DDJ-SB2
- Pioneer DDJ-SB3
- Pioneer DDJ-400
- Pioneer DDJ-FLX4

The DDJ-SX is probably the best structural reference because it is a 4-channel Pioneer controller with similar deck and pad behavior.

## Suggested success criteria for V1

V1 is successful if the DDJ-RX can be used in Mixxx for a normal 2-deck session with:

- loading tracks from the library
- transport control
- jog bend and scratch
- tempo adjustment
- channel mixing
- cueing in headphones
- simple loops
- hotcues
- readable LED feedback for the basics