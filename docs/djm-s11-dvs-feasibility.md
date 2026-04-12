# DJM-S11 DVS Feasibility With Serato Control Vinyl

## Bottom line

Using Mixxx with Serato control vinyl is clearly feasible.

Using the DJM-S11 as the hardware center for that setup is now confirmed to work at a practical level on Windows because the critical checks have passed:

- Mixxx can see and assign two stereo vinyl-control inputs and two stereo deck outputs through the DJM-S11 ASIO path
- Mixxx deck audio can be returned through the mixer while vinyl control is active

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

## What still needs work

The remaining issue is no longer feasibility. It is calibration and feel.

The current state is:

- audio playback through Mixxx and the DJM-S11 works
- vinyl control is active and usable
- cueing precision and overall control tightness still need tuning

That is a materially better result than a mere feasibility signal. The DVS path is working, but it is not yet dialed in for reliable scratch and cue performance.

If calibration cannot be improved enough, the fallback is not abandoning the controller project. The fallback is:

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
- Mixxx audio now plays back cleanly through the DJM-S11 while vinyl control is enabled

That is enough to move the project out of the speculative stage. The remaining work is setup troubleshooting, not fundamental compatibility discovery.

## Current tuning target

The problem to solve now is not routing. It is control stability.

Mixxx's vinyl-control guidance points to a short list of factors that usually cause messy cueing or imprecise scratching:

- timecode level is too loud or too quiet
- the wrong Serato CV02 side is selected
- latency is too high
- turntable grounding, stylus condition, or RCA integrity is imperfect
- left/right channels are swapped or partially missing

For the DJM-S11 specifically, the vendor utility also exposes a PHONO DVS control-tone level adjustment intended for exactly this class of scratch-position drift.

The fact that reducing buffer size and PHONO DVS control-tone level did not materially improve the feel is useful information. It suggests the next likely causes are not gross software latency or obviously incorrect phono gain, but one of these:

- signal quality is only marginal rather than cleanly green and stable
- Mixxx's current vinyl-control behavior with this device and signal chain is the dominant factor rather than one bad deck path
- the chosen control mode in Mixxx is not a good fit for the current cueing workflow
- the final Linux or Raspberry Pi target may behave differently from the Windows test even if the mapping itself is fine

Additional live testing has now narrowed this further: swapping RCA, cartridge, and related deck-side signal paths did not materially change the behavior. That makes a single bad turntable path less likely and shifts suspicion toward the overall timecode decode quality, Mixxx control mode behavior, or the DJM-S11's aggregate handling of the control signal.

## Recommended tuning pass

Use this order so only one variable changes at a time:

1. In Mixxx Preferences > Vinyl Control, watch the signal-quality doughnut for each deck.
2. Confirm the correct `Serato CV02` side is selected for the side currently on each platter.
3. If the doughnut looks weak, noisy, or unstable, adjust Mixxx `Turntable Input Signal Boost` in small steps only.
4. If scratching still causes the playback point to drift, adjust the DJM-S11 Setting Utility option that reduces the PHONO DVS control-tone level.
5. Lower ASIO buffer size gradually until responsiveness improves without audible dropouts.
6. Check both turntables for clean stylus contact, proper grounding, and intact stereo RCA wiring.
7. If one deck behaves differently from the other, swap inputs between decks to determine whether the issue follows the deck, cartridge, cable, or channel path.

The target is a clean green circular signal with stable direction, followed by usable response in relative and absolute modes.

If swapping deck-side paths does not change the feel, stop spending time on cable swapping. The next useful checks are:

1. compare the doughnut shape and color in `Absolute` versus `Relative`
2. note whether one mode is consistently more controllable for cueing even if both are imperfect
3. treat the remaining issue as a software-or-device interaction problem rather than a simple wiring fault

## Raspberry Pi deployment note

If the long-term target is a Raspberry Pi 500+, split the problem into two parts:

1. controller mapping over MIDI
2. built-in DJM-S11 audio interface and DVS on Linux/ARM

The first part looks promising because Mixxx mappings are platform-agnostic once the MIDI device enumerates correctly.

The second part is still an unknown. The DJM-S11 manual documents Windows and Mac, not Linux. However, because Mac uses no dedicated audio driver, the device may be class-compliant enough for Linux audio to work. That is encouraging, but it is not proof of Raspberry Pi compatibility.

So the safest plan is:

- continue mapping work now, because Windows has already proven the control concept and audio topology
- treat Raspberry Pi audio and DVS as a separate hardware-validation pass once the core mapping exists

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

## Recommended next-step verification on Windows

Before treating DVS as finished, verify the calibration path too:

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
9. Reduce ASIO buffer size until cueing feels responsive without introducing dropouts.
10. If tracking drifts during scratching from PHONO inputs, compare behavior against the DJM-S11 utility's DVS PHONO control-tone adjustment.
11. Confirm whether `Absolute` or `Relative` mode feels more stable for your current cueing workflow.

If those steps succeed, the DVS path is not only feasible but practically usable.

## Practical recommendation

Treat the DJM-S11 project as two linked but separable workstreams:

- controller mapping
- DVS audio-interface validation

Do not block mapping work on full DVS confirmation.

If the S11 audio driver works in Mixxx, great: one device can cover mixer control and DVS routing.

If not, the controller mapping is still worth building, and DVS can be handled by a separate interface.