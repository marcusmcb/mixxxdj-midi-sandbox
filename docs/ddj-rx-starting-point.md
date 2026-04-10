# Pioneer DDJ-RX Starting Point

## Primary Goal

Produce a practical Mixxx mapping for the Pioneer DDJ-RX with an emphasis on core DJ workflow before advanced controller parity.

## First Milestone

Deliver a usable 2-deck mapping with:

- play / cue / sync
- browse and load
- channel faders and crossfader
- gain / EQ / filter
- pitch faders
- jog wheel bend and scratch
- headphone cue
- one pad mode for hotcues
- basic LEDs

## Best Reference Mappings

- Pioneer DDJ-SX
- Pioneer DDJ-400
- Pioneer DDJ-FLX4
- Pioneer DDJ-SB2 / DDJ-SB3

## Information Still Needed

- confirmation of any controls whose PDF rows are hard to interpret after extraction
- LED output behavior
- whether jog touch and wheel rotation are standard MIDI
- whether pad mode buttons change MIDI notes or require stateful scripting

## Manual Findings

The operating manual confirms several important things:

- the DDJ-RX can operate as a general MIDI controller
- it outputs button and control data in MIDI format for other DJ software
- a separate "List of MIDI Messages" document exists and is the key next artifact to obtain
- the hardware exposes the right functional groups for a practical Mixxx mapping

The manual is enough to define a first-pass control inventory, but not enough to implement the mapping without either the MIDI message list or live MIDI capture.

See [ddj-rx-manual-assessment.md](c:\Users\marcu\Documents\code\mixxxdj-midi-sandbox\docs\ddj-rx-manual-assessment.md) for the full breakdown.

The MIDI message list is now available and changes the next step from research to implementation planning. See [ddj-rx-midi-findings.md](c:\Users\marcu\Documents\code\mixxxdj-midi-sandbox\docs\ddj-rx-midi-findings.md) and [ddj-rx-v1-mapping-plan.md](c:\Users\marcu\Documents\code\mixxxdj-midi-sandbox\docs\ddj-rx-v1-mapping-plan.md).

## Practical Questions To Answer Early

- Does the controller enumerate cleanly in Mixxx on Windows?
- Are deck sides fixed to channels or layer-switched?
- Are tempo faders 7-bit or 14-bit?
- Do pads send simple notes or mode-dependent messages?
- Are LEDs monochrome or multi-color via velocity/value changes?

## Suggested Folder Layout Later

- mappings/pioneer-ddj-rx/Pioneer-DDJ-RX.midi.xml
- mappings/pioneer-ddj-rx/Pioneer-DDJ-RX-scripts.js
- notes/midi-captures.md
- notes/control-inventory.md
- notes/implementation-log.md