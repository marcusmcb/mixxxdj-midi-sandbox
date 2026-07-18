## Mixxx DJ MIDI Sandbox

This repo is a sandbox for prototyping controller mappings, MIDI scripts, and hardware-compatibility notes for Mixxx DJ.

The current long-term goal is to run Mixxx DJ on a Raspberry Pi 500+ with this DJ setup:

- Pioneer DJM-S11 mixer
- two Pioneer CRSS-12 turntables
- CRSS-12 decks connected to the DJM-S11 in digital vinyl / DVS-style use
- DJM-S11 connected by USB to the Raspberry Pi 500+

The practical development path is Windows first, then Raspberry Pi OS. Windows gives us the official DJM-S11 driver and ASIO utility, which makes it the best place to prove the mapping, audio routing, and DVS behavior before moving to Linux/ARM.

## Project Status

The DJM-S11 work is no longer only speculative. This repo contains a first Mixxx mapping scaffold for the mixer, plus feasibility notes for DJM-S11 DVS routing and Raspberry Pi deployment.

The CRSS-12 part is still an open hardware-validation track. The key unanswered question is whether the CRSS-12 digital vinyl mode outputs a Mixxx-readable control signal through the DJM-S11, or whether its deeper platter behavior depends on Serato/rekordbox-specific HID or USB behavior.

## Implemented So Far

### DJM-S11 mapping scaffold

Mapping files:

- `mappings/pioneer-djm-s11/Pioneer-DJM-S11.midi.xml`
- `mappings/pioneer-djm-s11/Pioneer-DJM-S11-scripts.js`

Current mapped areas:

- browser encoder, browser press, back, and shift
- load deck 1 and load deck 2
- trim, EQ high, EQ mid, EQ low
- filter, channel faders, crossfader
- headphone volume and headphone mix
- 4-beat loop, loop halve, loop double
- hot cue mode and pads 1 through 8
- sync and key lock
- experimental play, silent cue, PFL, and global quantize
- basic LED feedback for load, play, sync, key lock, PFL, hot cue mode, and hotcue pads

The transport-related controls are deliberately marked experimental until they are confirmed against the physical DJM-S11.

### DJM-S11 DVS feasibility

Windows testing has already shown that the DJM-S11 can work with Mixxx at a practical audio-routing level:

- Mixxx can see the DJM-S11 ASIO device.
- Two stereo vinyl-control inputs can be assigned.
- Two stereo deck outputs can be assigned.
- Mixxx deck audio can return through the DJM-S11 while vinyl control is active.

The remaining DVS issue is calibration and feel. Playback works, but cueing precision and scratch tightness still need more tuning.

### Documentation and notes

Useful project notes:

- `notes/djm-s11-v1-control-inventory.md`
- `docs/djm-s11-feasibility.md`
- `docs/djm-s11-dvs-feasibility.md`
- `docs/djm-s11-manual-assessment.md`
- `docs/djm-s11-v1-plan.md`

The repo also contains earlier DDJ-RX mapping exploration, but the current focus is the DJM-S11 plus CRSS-12 path.

## What Still Needs To Be Built

### DJM-S11 mapping

Next likely mapping additions:

- replace any incorrect experimental play/cue/PFL/quantize bindings with exact live MIDI values
- roll mode behavior
- slicer mode behavior
- sampler mode behavior
- parameter buttons
- deck 3 and deck 4 controls, if needed
- FX sections and Smooth Echo controls
- more complete LED feedback once the input side is stable

### CRSS-12 validation and mapping

The CRSS-12 is not yet mapped in this repo.

Before building a CRSS-12 mapping, we need to confirm:

- whether each CRSS-12 appears as a standalone MIDI or HID device on Windows
- whether it appears as a usable MIDI or HID device on Raspberry Pi OS
- what MIDI messages its pads send
- whether platter, pitch, transport, or deck-state controls send mappable MIDI/HID data
- whether digital vinyl mode produces a signal Mixxx can decode through the DJM-S11 inputs

Current expectation: CRSS-12 performance pads are likely mappable, but full platter-style digital deck control in Mixxx is not proven yet.

### Raspberry Pi 500+ support

The Mixxx mapping files should be portable if the DJM-S11 MIDI device enumerates correctly on Raspberry Pi OS.

The bigger unknown is the DJM-S11 audio interface on Linux/ARM. For the target setup to work cleanly on the Raspberry Pi 500+, Raspberry Pi OS must expose enough stable USB audio channels for:

- two stereo vinyl-control inputs
- two stereo deck outputs
- low-latency playback
- reliable MIDI input and output

If the DJM-S11 does not expose the needed audio channels on Linux/ARM, the controller mapping may still be usable, but DVS may require a separate known-good Linux-compatible audio interface.

## What Still Needs To Be Tested

### On Windows

1. Load the DJM-S11 mapping in Mixxx.
2. Confirm browse, back, load, mixer, loop, and hotcue controls.
3. Test experimental play, silent cue, PFL, and quantize controls.
4. Record any incorrect MIDI bindings and replace them in the mapping.
5. Test CRSS-12 digital vinyl mode through the DJM-S11 into Mixxx vinyl control.
6. Check whether the CRSS-12 sends standalone MIDI/HID messages over USB.
7. Continue DVS tuning for signal quality, latency, and scratch/cue response.

### On Raspberry Pi 500+

1. Install Mixxx on Raspberry Pi OS.
2. Connect the DJM-S11 over USB.
3. Confirm MIDI enumeration.
4. Confirm multichannel audio enumeration.
5. Check whether Mixxx can assign two vinyl-control inputs and two deck outputs.
6. Test whether the same DJM-S11 mapping loads and responds.
7. Connect the CRSS-12 decks and test whether Mixxx receives usable control signal or device messages.
8. Tune audio latency and stability under Raspberry Pi OS.

## Feasibility Summary

Windows with DJM-S11: feasible and already partly implemented.

Windows with DJM-S11 plus CRSS-12: plausible, but the CRSS-12 digital vinyl behavior still needs direct testing.

Raspberry Pi 500+ with DJM-S11: plausible for MIDI mapping, unproven for multichannel audio and DVS.

Raspberry Pi 500+ with DJM-S11 plus CRSS-12: the long-term target, but dependent on Linux/ARM audio enumeration and CRSS-12 control-signal behavior.

Marcus McBride, 2026
https://www.mcbportfolio.com
