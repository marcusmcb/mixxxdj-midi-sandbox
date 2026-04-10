# DDJ-RX V1 Control Inventory

## Scope of this pass

This inventory reflects the controls now scaffolded in the XML mapping and implemented in the JavaScript mapping.

The current pass focuses on deck 1 and deck 2 only.

## Browser and global

| Control | MIDI | Mixxx target | Status |
| --- | --- | --- | --- |
| Rotary selector | `0xB6 / 0x40` | `[Playlist] SelectTrackKnob` or `SelectPlaylist` while shift is held | Implemented |
| Rotary press | `0x96 / 0x41` | `[Playlist] ToggleSelectedSidebarItem` | Implemented |
| Back | `0x96 / 0x65` | `[Skin] show_maximized_library` toggle | Implemented |
| Tag Track | `0x96 / 0x67` | `[Playlist] LoadSelectedIntoFirstStopped` | Implemented |
| Load deck 1 | `0x96 / 0x46` | `[Channel1] LoadSelectedTrack` | Implemented |
| Load deck 2 | `0x96 / 0x47` | `[Channel2] LoadSelectedTrack` | Implemented |
| Master cue | `0x96 / 0x63` | `[Master] headMix` toggle between cue and main | Implemented |
| Crossfader | `0xB6 / 0x01 + 0x21` | `[Master] crossfader` | Implemented |

## Deck transport and performance

| Control | MIDI | Mixxx target | Status |
| --- | --- | --- | --- |
| Play | `0x90/0x91 / 0x0B` | `play` | Implemented |
| Cue | `0x90/0x91 / 0x0C` | `cue_default`, shifted `cue_gotoandstop` | Implemented |
| Sync | `0x90/0x91 / 0x58` | `sync_enabled` | Implemented |
| Shift | `0x90/0x91 / 0x40` | local modifier plus `[Controls] touch_shift` | Implemented |
| Keylock | `0x90/0x91 / 0x1A` | `keylock` | Implemented |
| Slip | `0x90/0x91 / 0x0D` | `slip_enabled` | Implemented |
| Quantize | `0x90/0x91 / 0x35` | `quantize` | Implemented |
| Auto beat loop | `0x90/0x91 / 0x14` | `beatloop_activate` | Implemented |
| Loop halve | `0x90/0x91 / 0x12` | `loop_halve` | Implemented |
| Loop double | `0x90/0x91 / 0x13` | `loop_double` | Implemented |
| Loop in | `0x90/0x91 / 0x10` | `loop_in` | Implemented |
| Loop out | `0x90/0x91 / 0x11` | `loop_out`, shifted `reloop_toggle` | Implemented |
| Hotcue pads 1-8 | `0x97/0x98 / 0x00-0x07` | `hotcue_n_activate`, shifted `hotcue_n_clear` | Implemented |

## Jogs and tempo

| Control | MIDI | Mixxx target | Status |
| --- | --- | --- | --- |
| Jog touch | `0x90/0x91 / 0x36` | scratch enable and disable | Implemented |
| Jog platter rotation | `0xB0/0xB1 / 0x1F` | scratching while touched, temporary bend otherwise | Implemented |
| Jog wheel side rotation | `0xB0/0xB1 / 0x21` | temporary bend | Implemented |
| Tempo fader | `0xB0/0xB1 / 0x00 + 0x20` | `rate` via 14-bit reconstruction | Implemented |

## Mixer

| Control | MIDI | Mixxx target | Status |
| --- | --- | --- | --- |
| Trim | `0xB0/0xB1 / 0x04 + 0x24` | `pregain` via centered 14-bit scaling | Implemented |
| EQ high | `0xB0/0xB1 / 0x07 + 0x27` | `[EqualizerRack1_[ChannelN]_Effect1] parameter3` | Implemented |
| EQ mid | `0xB0/0xB1 / 0x0B + 0x2B` | `[EqualizerRack1_[ChannelN]_Effect1] parameter2` | Implemented |
| EQ low | `0xB0/0xB1 / 0x0F + 0x2F` | `[EqualizerRack1_[ChannelN]_Effect1] parameter1` | Implemented |
| Channel fader | `0xB0/0xB1 / 0x13 + 0x33` | `volume` | Implemented |
| Headphone cue | `0x90/0x91 / 0x54` | `pfl` | Implemented |
| Quick effect / color | `0xB6 / 0x17 + 0x37`, `0x18 + 0x38` | `[QuickEffectRack1_[ChannelN]] super1` | Implemented |

## LED feedback

| LED | Source control | Status |
| --- | --- | --- |
| Play | `play_indicator` | Implemented |
| Cue | `cue_indicator` | Implemented |
| Sync | `sync_enabled` | Implemented |
| Keylock | `keylock` | Implemented |
| Deck PFL | `pfl` | Implemented |
| Slip | `slip_enabled` | Implemented |
| Load deck 1 / 2 | `track_loaded` | Implemented |
| Master cue | `[Master] headMix` | Implemented |
| Hotcue pads 1-8 | `hotcue_n_enabled` | Implemented |

## Deferred from this pass

- Deck 3 and deck 4 transport and jogs
- Parameter buttons for beatloop size changes
- Pad mode selection buttons and non-hotcue pad modes
- FX assignment buttons and beat FX sections
- Sampler workflow and sequencer controls
- On-jog display or advanced jog illumination
- Crossfader assign switches