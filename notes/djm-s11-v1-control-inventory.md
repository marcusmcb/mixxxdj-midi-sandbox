# DJM-S11 V1 Control Inventory

## Implemented in the first scaffold

| Control area | Mapped controls | Notes |
| --- | --- | --- |
| Browser | browse encoder, browse press, back, global shift | follows the existing DDJ-RX library behavior pattern |
| Experimental transport | play, silent cue, deck PFL, global quantize | transport uses a mix of common Pioneer note conventions and touch-MIDI values that should be validated live on Windows |
| Load | load deck 1, load deck 2 | loads the currently selected library track |
| Mixer core | trim, EQ high, EQ mid, EQ low, filter, channel faders, crossfader | all handled as 14-bit controls |
| Headphone mix | headphone volume, headphone mix | mapped to `[Master] headVolume` and `[Master] headMix` |
| Loop workflow | 4-beat loop, loop halve, loop double | uses Mixxx loop engine controls |
| Hotcue workflow | hot cue mode button, pads 1 to 8 | pads activate hotcues, shift plus pad clears hotcues |
| Touch-MIDI deck controls | sync, key lock | deck-specific touch controls on MIDI channels 1 and 2 |
| LED feedback | load, play, sync, key lock, deck PFL, hot cue mode, hotcue pads | assumes MIDI-out mirrors MIDI-in for these confirmed controls |

## Deferred from this pass

- roll, slicer, sampler mode buttons
- touch-screen transport extras whose deck targeting is still ambiguous in the extracted PDF
- deck 3 and deck 4 mapping
- FX sections and Smooth Echo

## Why transport is still conservative

The vendor MIDI text clearly exposes deck-specific sync and key lock for channels 1 and 2, but the extracted PDF is less reliable for a clean deck-1 and deck-2 play/cue pair than it is for browse, loops, pads, and mixer controls.

That means the scaffold now includes an experimental transport layer for play, cue, PFL, and quantize. It is useful enough to test in Mixxx, but it should be treated as provisional until validated on the hardware.

## Best next live checks

1. Confirm the DJM-S11 enumerates as a MIDI device in Mixxx on Windows.
2. Manually load the new mapping and verify browse, back, and load first.
3. Verify trim, EQ, filter, line faders, and crossfader move the expected Mixxx controls.
4. Put the controller in hot cue mode and verify pads 1 to 8 trigger or clear hotcues as expected.
5. Test play, silent cue, and PFL on both deck sides and note exactly which buttons respond.
6. Test whether the global quantize button toggles quantize for both deck 1 and deck 2 as intended.
7. Test the touch sync and key-lock controls for decks 1 and 2.
8. On the Raspberry Pi 500+, check whether the DJM-S11 exposes both MIDI and multichannel audio cleanly under Linux before assuming DVS parity with Windows.

## Most likely next code additions

- replace any experimental transport bindings that prove wrong with the exact live MIDI values from the DJM-S11
- add roll, slicer, and sampler mode behavior once the mode buttons are confirmed live
- add deck 3 and deck 4 controls after the 2-deck transport surface is stable