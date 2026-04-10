## Mixxx DJ MIDI Sandbox

This repo is a sandbox for prototyping controller mappings and MIDI scripts for Mixxx DJ.

The initial target is the Pioneer DDJ-RX, originally designed for Rekordbox. The goal is to determine whether a practical Mixxx mapping is possible, then build it incrementally instead of trying to clone the full Rekordbox workflow in one pass.

The repo now also includes an exploratory track for the Pioneer DJM-S11 scratch mixer, with a separate feasibility pass for Mixxx controller mapping and Serato control-vinyl DVS usage.

## Feasibility

Yes, this is realistically possible.

Mixxx supports custom controller mappings using:

- an XML mapping file to bind MIDI messages
- an optional JavaScript file for more advanced behavior

Mixxx's controller scripting system supports the main categories a DDJ-RX mapping would need:

- transport controls
- mixer controls
- EQ and filter knobs
- browser navigation and track loading
- hotcues and pad modes
- loops and beatjump
- jog wheel bending and scratching
- LED feedback
- deck layers and modifier states such as SHIFT

This is not speculative. Mixxx already ships with mappings for several Pioneer controllers, including the DDJ-SB, DDJ-SB2, DDJ-SB3, DDJ-SX, DDJ-400, and DDJ-FLX4. The DDJ-RX is not listed as an included mapping, but the DDJ-SX family is especially relevant because it is also a 4-channel Pioneer controller with pads, jog wheels, LEDs, and layered controls.

The main unknown is not whether Mixxx can support a controller like this. The main unknown is whether the DDJ-RX exposes the right MIDI messages in a way that is easy to capture and map, especially for:

- jog wheel touch and rotation behavior
- pad mode switching
- LED and color feedback
- any non-standard or proprietary behavior

If the DDJ-RX presents standard MIDI messages for those controls on Windows, the project is viable.

## What We Need

To get started productively, we need four things:

1. The DDJ-RX MIDI message documentation.
2. A clear feature scope for a first usable mapping.
3. A way to inspect incoming and outgoing MIDI behavior while testing.
4. One or two reference Mixxx mappings from similar Pioneer controllers.

### 1. DDJ-RX documentation

Best case:

- a MIDI implementation chart
- a service manual or technical appendix
- documentation showing LED output messages as well as button/knob input messages

If the Pioneer user manual only documents surface behavior and not MIDI data, we can still proceed, but development becomes more trial-and-error.

### 2. First-pass feature scope

Do not aim for 100 percent controller coverage first.

The best first milestone is a usable core mapping:

- deck 1 and deck 2 play / cue / sync
- channel faders, crossfader, gain, EQ, filter
- load selected track
- browse encoder and library navigation
- jog wheel bend and scratch
- headphone cue
- pitch faders
- basic loop controls
- hotcue pads for one mode
- basic LED feedback for play, cue, sync, cue monitor, and loaded deck state

That produces a working controller quickly. Advanced pad modes, slicer behavior, Beat FX, sampler layers, and four-deck switching can come later.

### 3. Test and capture tools

Useful tools for Windows:

- Mixxx with controller debugging enabled
- MIDI-OX to inspect raw MIDI input/output if needed

Mixxx supports rapid iteration because controller scripts reload when saved, and controller debugging can log incoming and outgoing MIDI traffic.

### 4. Reference mappings

The best references to mine from Mixxx are likely:

- Pioneer DDJ-SX
- Pioneer DDJ-400
- Pioneer DDJ-FLX4
- Pioneer DDJ-SB2 or DDJ-SB3

Those show established patterns for:

- jog wheel scaling and scratch handling
- shift layers
- pad mode switching
- high-resolution tempo sliders
- LED update callbacks
- deck-to-layer switching

## Recommended Build Strategy

### Phase 1: Confirm hardware behavior

- Verify the DDJ-RX is visible to Windows and to Mixxx as a MIDI device.
- Capture the MIDI messages for the core controls.
- Confirm whether LEDs accept standard MIDI note/CC output.

### Phase 2: Build a minimal mapping

- Create the XML mapping file.
- Create a JavaScript mapping file.
- Implement only a core 2-deck workflow.
- Ignore advanced pad modes until the basics are solid.

### Phase 3: Add feedback and layers

- Add transport LEDs and deck state LEDs.
- Add shift behavior.
- Add loop and hotcue layers.
- Add deck 3/4 switching if it feels worth the complexity.

### Phase 4: Refine advanced features

- performance pads and additional pad banks
- Beat FX / Color FX behavior
- waveform/jog ring LEDs if available
- sampler and AutoDJ extras

## Risks

The main risks are predictable:

- missing or incomplete MIDI documentation from Pioneer
- unusual LED behavior requiring trial-and-error
- controls that depend on Rekordbox-specific behavior not exposed as plain MIDI
- extra complexity from trying to mirror the original hardware workflow too closely

These are manageable if the first milestone stays narrow.

## Strong Recommendation

Start by treating the DDJ-RX as a solid 2-deck Mixxx controller with good transport, mixer, jog, browser, and hotcue support.

Do not try to recreate every Rekordbox mode in version 1.

That approach has the best odds of producing a usable result quickly.

## Immediate Next Inputs

If you want to move from assessment into implementation planning, the most useful things you can provide next are:

1. The DDJ-RX PDF manual or any MIDI implementation chart.
2. A photo or list of the controls you consider must-have for a first usable mapping.
3. A sample Mixxx mapping you want to use as a baseline, especially a Pioneer one.
4. Confirmation of your Mixxx version and whether you are testing on Windows only.

## Proposed Repo Direction

This repo can evolve into:

- notes and reverse-engineering docs
- captured MIDI message references
- a working DDJ-RX XML mapping
- a working DDJ-RX JavaScript mapping
- test notes for each implemented control group

Marcus McBride, 2026
https://www.mcbportfolio.com
