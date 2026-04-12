# DJM-S11 V1 Control Inventory

## Implemented in the first scaffold

| Control area | Mapped controls | Notes |
| --- | --- | --- |
| Browser | browse encoder, browse press, back, global shift | follows the existing DDJ-RX library behavior pattern |
| Load | load deck 1, load deck 2 | loads the currently selected library track |
| Mixer core | trim, EQ high, EQ mid, EQ low, filter, channel faders, crossfader | all handled as 14-bit controls |
| Headphone mix | headphone volume, headphone mix | mapped to `[Master] headVolume` and `[Master] headMix` |
| Loop workflow | 4-beat loop, loop halve, loop double | uses Mixxx loop engine controls |
| Hotcue workflow | hot cue mode button, pads 1 to 8 | pads activate hotcues, shift plus pad clears hotcues |
| Touch-MIDI deck controls | sync, key lock | deck-specific touch controls on MIDI channels 1 and 2 |
| LED feedback | load, sync, key lock, hot cue mode, hotcue pads | assumes MIDI-out mirrors MIDI-in for these confirmed controls |

## Deferred from this pass

- direct deck play control
- direct deck cue control
- quantize button
- headphone cue/PFL buttons
- roll, slicer, sampler mode buttons
- touch-screen transport extras whose deck targeting is still ambiguous in the extracted PDF
- deck 3 and deck 4 mapping
- FX sections and Smooth Echo

## Why transport is still conservative

The vendor MIDI text clearly exposes deck-specific sync and key lock for channels 1 and 2, but the extracted PDF is less reliable for a clean deck-1 and deck-2 play/cue pair than it is for browse, loops, pads, and mixer controls.

That means the first scaffold intentionally favors controls whose MIDI values are strong enough to trust immediately.

## Best next live checks

1. Confirm the DJM-S11 enumerates as a MIDI device in Mixxx on Windows.
2. Manually load the new mapping and verify browse, back, and load first.
3. Verify trim, EQ, filter, line faders, and crossfader move the expected Mixxx controls.
4. Put the controller in hot cue mode and verify pads 1 to 8 trigger or clear hotcues as expected.
5. Test the touch sync and key-lock controls for decks 1 and 2.
6. On the Raspberry Pi 500+, check whether the DJM-S11 exposes both MIDI and multichannel audio cleanly under Linux before assuming DVS parity with Windows.

## Most likely next code additions

- deck transport once the cleanest play/cue MIDI path is confirmed live
- quantize if the touch-MIDI screen behavior is stable in Mixxx
- headphone cue if the per-channel cue buttons can be confirmed from live MIDI traffic