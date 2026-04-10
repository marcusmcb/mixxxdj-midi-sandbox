# DDJ-RX Manual Assessment

## Bottom line

The DDJ-RX operating manual confirms that the controller is a strong candidate for a Mixxx mapping.

It does **not** provide enough low-level MIDI detail to build the mapping by itself.

That gap is now covered by the separate MIDI message list added to this repo. See [ddj-rx-midi-findings.md](c:\Users\marcu\Documents\code\mixxxdj-midi-sandbox\docs\ddj-rx-midi-findings.md).

What the manual does give us is:

- a reliable control inventory
- confirmation of major workflow features
- confirmation that the unit can operate as a general MIDI controller
- confirmation that a separate "List of MIDI Messages" exists

That last point is the most important technical takeaway.

## What the manual confirms

### General MIDI mode exists

The manual explicitly states that:

- when rekordbox is not running, the unit operates as a general MIDI controller
- the unit can also be forced into general MIDI controller mode even if rekordbox is running
- the controller outputs button and control operating data in MIDI format for other DJ software

This materially improves feasibility. We are not trying to coerce a closed-only controller into working with Mixxx.

### A separate MIDI message document exists

The manual states that details are in a separate "List of MIDI Messages" document available from Pioneer/AlphaTheta support.

This is the document we want next. It should tell us:

- note and CC numbers
- MIDI channels
- LED output messages
- any 14-bit or high-resolution controls
- mode-dependent behavior

Without that document, we can still reverse-engineer the mapping, but the work becomes slower and more error-prone.

## What the manual tells us about the hardware layout

### Browser section

Confirmed controls:

- load buttons
- rotary selector
- back button
- tag track button

These are all good candidates for an early Mixxx mapping because they are simple and high-value.

### Deck section

Confirmed controls and behaviors:

- jog dial
- needle search pad
- tempo slider
- master tempo button
- auto beat loop
- loop halve / double
- loop in / out
- capture
- sequencer overdub / start
- hot cue mode
- pad FX 1 / pad FX 2
- slicer / slicer loop
- sampler / velocity sampler
- performance pads
- parameter buttons
- play / pause
- cue
- sync
- shift
- deck select buttons
- grid adjust / grid slide
- slip
- slip reverse
- FX panel
- quantize

The jog wheel behavior is especially encouraging:

- top touch with vinyl mode on: scratch
- top touch with vinyl mode off: pitch bend
- outer section: pitch bend
- shift + top turn: skip through track

That maps cleanly to what Mixxx scripting already supports.

### Mixer section

Confirmed controls:

- per-channel FX assign buttons
- trim
- EQ high / mid / low
- channel meters
- color control
- headphone cue buttons
- crossfader assign switches
- crossfader
- master level
- booth monitor level
- sound color FX buttons
- master cue
- sampler sync / cue / volume

This is enough to define a practical first-pass core mapping.

## Features the manual confirms that Mixxx can likely support

These features have direct or near-direct Mixxx equivalents:

- play / pause
- cue / back cue / cue preview behavior
- sync and master deck selection
- tempo / keylock
- jog bend and jog scratch
- hotcues
- beatjump
- auto and manual loops
- loop move
- slip mode
- reverse / reverse roll style behavior
- quantize
- browser navigation and track loading
- headphone cue
- deck switching
- dual-deck style logic via scripting
- sampler triggering
- effect assignment buttons
- LED feedback

## Features that are likely possible but not first-pass priorities

These are probably supportable, but they add complexity and should not block a usable v1 mapping:

- pad FX banks
- slicer and slicer loop
- sequencer workflow
- velocity sampler curves
- jog illumination behavior
- on-jog display parity
- exact Rekordbox panel toggle behavior
- Sound Color FX parity matching Pioneer naming and behavior

## Important implementation clues from the manual

### Soft takeover style behavior is expected for tempo

The manual references a takeover indicator when decks are switched and the physical tempo slider no longer matches the software position.

In Mixxx terms, this strongly suggests we should plan on soft takeover for absolute controls like:

- tempo sliders
- possibly filter / color style knobs if they are layered

### Crossfader MIDI optimization exists

The utilities section describes an optimization mode for crossfader MIDI messages, especially for scratching.

This implies the crossfader may have a special output mode or timing behavior that could matter during testing. If crossfader behavior feels odd in Mixxx, this setting should be one of the first things to verify.

### Jog touch sensitivity is configurable on-device

The manual includes a jog touch sensitivity adjustment mode. That is useful because a bad scratch experience may be a hardware-sensitivity setting issue rather than a scripting issue.

## What the manual does not tell us

The manual does **not** tell us, at least not in the operating instructions PDF:

- exact MIDI note / CC mappings
- exact LED output values
- whether some controls are 7-bit or 14-bit
- whether pad mode buttons change MIDI messages or only internal controller state
- whether jog display or illumination has accessible MIDI control
- whether any functions use SysEx

These are the gaps that block direct implementation from the manual alone.

## Recommended first usable scope

Based on the manual, the best first milestone remains:

- 2-deck operation first
- browse and load
- play / cue / sync
- jog bend and scratch
- tempo and keylock
- headphone cue
- gain / EQ / filter / channel faders / crossfader
- loop in / out / auto loop / loop halve / loop double
- hotcue mode only for pads
- essential LEDs only

This avoids getting stuck in pad FX, slicer, sequencer, and display parity before the controller is already useful.

## Best next technical step

Use the DDJ-RX "List of MIDI Messages" document to define the first Mixxx implementation pass.

If any specific control behavior is still unclear in practice, the fallback plan is:

- connect the controller to Mixxx on Windows
- enable controller debug logging
- use MIDI-OX if needed
- capture incoming messages for every core control
- test outgoing LED behavior incrementally

## Practical conclusion

The manual moves this project from "possible in theory" to "credible and scoped."

It confirms the DDJ-RX is meant to operate as a general MIDI controller and exposes the exact control groups we would want for a Mixxx mapping.

The main blocker is no longer feasibility. The main blocker is obtaining or reconstructing the low-level MIDI message map.