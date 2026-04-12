# DJM-S11 DVS Feasibility With Serato Control Vinyl

## Bottom line

Using Mixxx with Serato control vinyl is clearly feasible.

Using the DJM-S11 as the hardware center for that setup now looks feasible in principle because one major hardware-driver check has already passed in Mixxx on Windows:

- Mixxx can see and assign two stereo vinyl-control inputs and two stereo deck outputs through the DJM-S11 ASIO path

If it does, then Mixxx does not need Serato certification. It only needs access to the audio channels.

The newly added DJM-S11 manual increases confidence here because it confirms:

- a dedicated Windows audio driver
- ASIO buffer-size tuning
- USB audio output routing in the Setting Utility
- DVS-specific PHONO control-tone adjustment
- an intended DVS turntable workflow through the mixer

## What Mixxx already supports

Mixxx 2.5 has built-in vinyl-control support.

The manual explicitly states that:

- Mixxx supports Serato CV02 and 2.5 control vinyl
- Serato records are recommended if you are buying new control vinyl
- Mixxx supports external-mixer vinyl-control setups
- Mixxx supports up to 4 vinyl-control decks
- Mixxx can use any audio interface the operating system exposes through suitable drivers

Mixxx also exposes deck-level controls for vinyl mode, cueing mode, passthrough, and signal status.

So the software side is already there. We are not trying to bolt DVS onto Mixxx ourselves.

## What the hardware needs to provide

For a normal 2-deck external-mixer DVS setup with turntables, Mixxx needs:

- 2 stereo inputs for timecode signal
- 2 stereo outputs for deck audio back to the mixer
- stable low-latency drivers
- correct phono preamp handling, either in hardware or through proper line-level conversion

For Serato control vinyl specifically, Mixxx expects stereo timecode input, not mono.

For good scratch feel, Mixxx recommends low latency, roughly around 10 ms or better.

## Why the DJM-S11 is a plausible DVS device for Mixxx

The S11 is clearly designed as a USB battle mixer with DVS workflows in mind.

That does not prove Mixxx compatibility by itself, but it makes the hardware profile promising:

- it has turntable-oriented battle-mixer design
- it ships with Windows drivers
- it is intended to sit between turntables and DJ software
- it supports Serato DVS and rekordbox DVS in the vendor ecosystem

The manual strengthens this further by documenting:

- a DVS connections section with turntables, control vinyl, and PC/Mac
- a requirement that the PC/Mac be correctly connected and the channel input selectors correctly set
- a `DJM-S11 Audio Output` routing control in the Setting Utility
- USB channel pairs including `USB 1/2`, `USB 3/4`, and `USB 5/6`

Those facts strongly suggest the device has the right physical I/O shape for Mixxx DVS too.

## What still needs verification

The remaining issue is no longer device enumeration. It is live DVS signal flow and calibration.

- does Mixxx show healthy timecode signal quality on both decks when the turntables are playing Serato CV02?
- does the DJM-S11 return Mixxx deck audio to the correct mixer channels instead of leaving those channels on the raw PHONO source?

If yes, then the setup is likely workable end-to-end.

If no, then the fallback is not abandoning the controller project. The fallback is:

- use the DJM-S11 as MIDI controller and external mixer only
- use a separate known-good DVS audio interface for timecode input/output

## Expected routing model

The most likely working topology is:

1. Turntables send Serato CV02 signal into the DJM-S11 phono inputs.
2. The DJM-S11 USB interface presents those inputs to Mixxx as vinyl-control inputs.
3. Mixxx decodes the timecode and outputs deck audio on separate stereo outputs.
4. Those outputs return to the DJM-S11 mixer channels for normal external mixing and scratching.

The manual is consistent with this model. It explicitly documents DVS use with turntables, exposes PC/Mac audio driver setup, and includes USB output routing options that look compatible with a multi-channel DJ workflow.

If the S11 driver exposes that routing cleanly, the setup is exactly the kind of external-mixer DVS workflow Mixxx already documents.

One practical implication from the manual matters here: for DVS operation, the channel input selector switches for CH1 and CH2 should be on the computer side, `A/B`, not left on `PHONO`.

If a channel is left on `PHONO`, you will hear the Serato control tone directly from the turntable input. That means the timecode source is reaching the mixer, but the channel is not listening to Mixxx's USB deck return.

## Known-good signs from current testing

The current Windows test already established these points:

- Mixxx is running with the DJM-S11 connected and powered on
- the Sound API shows generic `ASIO`, which is normal for many Windows apps
- inside Mixxx input and output assignments, the DJM-S11 ASIO device is available specifically
- two stereo vinyl-control inputs can be assigned
- two stereo deck outputs can be assigned

That is enough to move the project out of the speculative stage. The remaining work is setup troubleshooting, not fundamental compatibility discovery.

## Targeted troubleshooting for the current symptom

If you can hear the control tone but not the track audio, work through this exact order:

1. On the DJM-S11, set CH1 and CH2 input selectors to `A` or `B` for the connected computer, not `PHONO`.
2. In Mixxx, keep `Vinyl Control 1/2` assigned to the DJM-S11 input stereo pairs and `Deck 1/2` assigned to the DJM-S11 output stereo pairs.
3. In Mixxx, load real tracks to Deck 1 and Deck 2.
4. In Mixxx, enable vinyl control for both decks.
5. In Preferences > Vinyl Control, select the correct Serato CV02 side for each record side actually on the platter.
6. In the DJM-S11 Setting Utility, verify the `DJM-S11 Audio Output` routing sends the USB returns for CH1 and CH2 to the expected deck channels rather than an alternate bus.
7. If Mixxx still shows weak or missing signal quality, test the DJM-S11 PHONO DVS control-tone adjustment and check turntable grounding, stylus condition, and left/right RCA integrity.

If step 1 is wrong, the rest of the setup can appear half-correct: Mixxx may see the inputs, but you will still hear only timecode tone at the mixer.

## Recommended verification steps on Windows

Before writing a lot of mapping code, verify the audio path first:

1. Install the official DJM-S11 Windows driver.
2. Connect the DJM-S11 by USB and open Mixxx.
3. In Preferences > Sound Hardware, leave the main Sound API on `ASIO` and select the DJM-S11 device in the specific input/output assignment rows.
4. Check the Input tab for at least:
   Vinyl Control 1 with a stereo pair
   Vinyl Control 2 with a stereo pair
5. Check the Output tab for at least:
   Deck 1 with a stereo pair
   Deck 2 with a stereo pair
6. In Preferences > Vinyl Control, select Serato CV02 Vinyl Side A or Side B as appropriate.
7. Put Serato control vinyl on both decks and confirm Mixxx shows healthy timecode signal.
8. Set CH1 and CH2 input selectors on the DJM-S11 to `A/B`, not `PHONO`, so the mixer monitors the Mixxx USB returns.
9. If tracking drifts during scratching from PHONO inputs, compare behavior against the DJM-S11 utility's DVS PHONO control-tone adjustment.

If those steps succeed, DVS feasibility is effectively confirmed.

## Practical recommendation

Treat the DJM-S11 project as two linked but separable workstreams:

- controller mapping
- DVS audio-interface validation

Do not block mapping work on full DVS confirmation.

If the S11 audio driver works in Mixxx, great: one device can cover mixer control and DVS routing.

If not, the controller mapping is still worth building, and DVS can be handled by a separate interface.