////////////////////////////////////////////////////////////////////////
// Pioneer DDJ-RX Mixxx sandbox mapping                               //
////////////////////////////////////////////////////////////////////////
/* global engine                                                      */
/* global script                                                      */
/* global midi                                                        */
////////////////////////////////////////////////////////////////////////

var PioneerDDJRX = function() {};

PioneerDDJRX.deckNumbers = {
    "[Channel1]": 1,
    "[Channel2]": 2,
};

PioneerDDJRX.transportLedNotes = {
    play: 0x0B,
    cue: 0x0C,
    sync: 0x58,
    keylock: 0x1A,
    pfl: 0x54,
    slip: 0x0D,
};

PioneerDDJRX.browserLoadNotes = {
    "[Channel1]": 0x46,
    "[Channel2]": 0x47,
};

PioneerDDJRX.loopSizeSteps = [0.25, 0.5, 1, 2, 4, 8, 16, 32];
PioneerDDJRX.shiftPressed = {};
PioneerDDJRX.jogTouched = {};
PioneerDDJRX.loopSizeIndex = {};
PioneerDDJRX.highResMsb = {};

PioneerDDJRX.init = function() {
    var groups = Object.keys(PioneerDDJRX.deckNumbers);
    var i;

    for (i = 0; i < groups.length; i++) {
        PioneerDDJRX.prepareDeck(groups[i]);
        PioneerDDJRX.bindDeckConnections(groups[i], false);
    }

    engine.connectControl("[Master]", "headMix", "PioneerDDJRX.masterCueLed");
    engine.trigger("[Master]", "headMix");
};

PioneerDDJRX.shutdown = function() {
    var groups = Object.keys(PioneerDDJRX.deckNumbers);
    var i;

    for (i = 0; i < groups.length; i++) {
        PioneerDDJRX.bindDeckConnections(groups[i], true);
        PioneerDDJRX.clearDeckLeds(groups[i]);
        PioneerDDJRX.clearPadLeds(groups[i]);
    }

    engine.connectControl("[Master]", "headMix", "PioneerDDJRX.masterCueLed", true);
    PioneerDDJRX.sendBrowserLed(PioneerDDJRX.browserLoadNotes["[Channel1]"], false);
    PioneerDDJRX.sendBrowserLed(PioneerDDJRX.browserLoadNotes["[Channel2]"], false);
    PioneerDDJRX.sendBrowserLed(0x63, false);
};

PioneerDDJRX.prepareDeck = function(group) {
    PioneerDDJRX.shiftPressed[group] = false;
    PioneerDDJRX.jogTouched[group] = false;
    PioneerDDJRX.loopSizeIndex[group] = 4;
    PioneerDDJRX.highResMsb[group] = {
        tempo: 0,
        trim: 0,
        eqHigh: 0,
        eqMid: 0,
        eqLow: 0,
        volume: 0,
    };

    engine.setValue(group, "beatloop_size", PioneerDDJRX.loopSizeSteps[PioneerDDJRX.loopSizeIndex[group]]);
    engine.softTakeover(group, "pregain", true);
    engine.softTakeover(group, "rate", true);
    engine.softTakeover(group, "volume", true);
    engine.softTakeover("[EqualizerRack1_" + group + "_Effect1]", "parameter1", true);
    engine.softTakeover("[EqualizerRack1_" + group + "_Effect1]", "parameter2", true);
    engine.softTakeover("[EqualizerRack1_" + group + "_Effect1]", "parameter3", true);
    engine.softTakeover("[QuickEffectRack1_" + group + "]", "super1", true);
    engine.softTakeover("[Master]", "crossfader", true);
};

PioneerDDJRX.bindDeckConnections = function(group, remove) {
    var controls = {
        play_indicator: "PioneerDDJRX.playLed",
        cue_indicator: "PioneerDDJRX.cueLed",
        sync_enabled: "PioneerDDJRX.syncLed",
        keylock: "PioneerDDJRX.keylockLed",
        pfl: "PioneerDDJRX.pflLed",
        slip_enabled: "PioneerDDJRX.slipLed",
        track_loaded: "PioneerDDJRX.loadLed",
    };
    var hotcueIndex;

    script.bindConnections(group, controls, remove);

    for (hotcueIndex = 1; hotcueIndex <= 8; hotcueIndex++) {
        engine.connectControl(group, "hotcue_" + hotcueIndex + "_enabled", "PioneerDDJRX.hotcueLed", remove);
        if (!remove) {
            engine.trigger(group, "hotcue_" + hotcueIndex + "_enabled");
        }
    }
};

PioneerDDJRX.deckStatus = function(group) {
    return 0x90 + PioneerDDJRX.deckNumbers[group] - 1;
};

PioneerDDJRX.padStatus = function(group) {
    return 0x97 + PioneerDDJRX.deckNumbers[group] - 1;
};

PioneerDDJRX.sendDeckLed = function(group, note, enabled) {
    midi.sendShortMsg(PioneerDDJRX.deckStatus(group), note, enabled ? 0x7F : 0x00);
};

PioneerDDJRX.sendPadLed = function(group, note, enabled) {
    midi.sendShortMsg(PioneerDDJRX.padStatus(group), note, enabled ? 0x7F : 0x00);
};

PioneerDDJRX.sendBrowserLed = function(note, enabled) {
    midi.sendShortMsg(0x96, note, enabled ? 0x7F : 0x00);
};

PioneerDDJRX.clearDeckLeds = function(group) {
    var ledName;

    for (ledName in PioneerDDJRX.transportLedNotes) {
        PioneerDDJRX.sendDeckLed(group, PioneerDDJRX.transportLedNotes[ledName], false);
    }
};

PioneerDDJRX.clearPadLeds = function(group) {
    var index;

    for (index = 0; index < 8; index++) {
        PioneerDDJRX.sendPadLed(group, index, false);
    }
};

PioneerDDJRX.relativeDelta = function(value) {
    if (value === 0x40) {
        return 0;
    }
    return value > 0x40 ? value - 0x80 : value;
};

PioneerDDJRX.clamp = function(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
};

PioneerDDJRX.centeredPot = function(fullValue) {
    if (fullValue <= 0x1FFF) {
        return fullValue / 0x1FFF;
    }
    return 1 + (((fullValue - 0x1FFF) / 0x2000) * 3);
};

PioneerDDJRX.linearPot = function(fullValue) {
    return fullValue / 0x3FFF;
};

PioneerDDJRX.compose14Bit = function(group, key, lsbValue) {
    return (PioneerDDJRX.highResMsb[group][key] << 7) + lsbValue;
};

PioneerDDJRX.updateEq = function(group, parameter, fullValue) {
    engine.setParameter("[EqualizerRack1_" + group + "_Effect1]", parameter, PioneerDDJRX.centeredPot(fullValue));
};

PioneerDDJRX.bend = function(group, delta) {
    var direction = delta > 0 ? "rate_temp_up" : "rate_temp_down";
    var steps = Math.min(4, Math.abs(delta));
    var index;

    for (index = 0; index < steps; index++) {
        script.triggerControl(group, direction, 30);
    }
};

PioneerDDJRX.enableScratch = function(group) {
    var deck = PioneerDDJRX.deckNumbers[group];

    if (!engine.isScratching(deck)) {
        engine.scratchEnable(deck, 2048, 33 + (1 / 3), 1 / 8, 1 / 8 / 32, true);
    }
};

PioneerDDJRX.disableScratch = function(group) {
    var deck = PioneerDDJRX.deckNumbers[group];

    if (engine.isScratching(deck)) {
        engine.scratchDisable(deck, true);
    }
};

PioneerDDJRX.anyShiftPressed = function() {
    return PioneerDDJRX.shiftPressed["[Channel1]"] || PioneerDDJRX.shiftPressed["[Channel2]"];
};

PioneerDDJRX.playButton = function(_channel, _control, value, _status, group) {
    if (value) {
        script.toggleControl(group, "play");
    }
};

PioneerDDJRX.cueButton = function(_channel, _control, value, _status, group) {
    engine.setValue(group, PioneerDDJRX.shiftPressed[group] ? "cue_gotoandstop" : "cue_default", value);
};

PioneerDDJRX.syncButton = function(_channel, _control, value, _status, group) {
    if (value) {
        script.toggleControl(group, "sync_enabled");
    }
};

PioneerDDJRX.shiftButton = function(_channel, _control, value, _status, group) {
    PioneerDDJRX.shiftPressed[group] = value > 0;
    engine.setValue("[Controls]", "touch_shift", value);
};

PioneerDDJRX.keyLockButton = function(_channel, _control, value, _status, group) {
    if (value) {
        script.toggleControl(group, "keylock");
    }
};

PioneerDDJRX.slipButton = function(_channel, _control, value, _status, group) {
    if (value) {
        script.toggleControl(group, "slip_enabled");
    }
};

PioneerDDJRX.quantizeButton = function(_channel, _control, value, _status, group) {
    if (value) {
        script.toggleControl(group, "quantize");
    }
};

PioneerDDJRX.autoLoopButton = function(_channel, _control, value, _status, group) {
    if (value) {
        script.triggerControl(group, "beatloop_activate", 40);
    }
};

PioneerDDJRX.loopHalveButton = function(_channel, _control, value, _status, group) {
    if (value) {
        script.triggerControl(group, "loop_halve", 40);
    }
};

PioneerDDJRX.loopDoubleButton = function(_channel, _control, value, _status, group) {
    if (value) {
        script.triggerControl(group, "loop_double", 40);
    }
};

PioneerDDJRX.loopInButton = function(_channel, _control, value, _status, group) {
    engine.setValue(group, "loop_in", value);
};

PioneerDDJRX.loopOutButton = function(_channel, _control, value, _status, group) {
    engine.setValue(group, PioneerDDJRX.shiftPressed[group] ? "reloop_toggle" : "loop_out", value);
};

PioneerDDJRX.headphoneCueButton = function(_channel, _control, value, _status, group) {
    if (value) {
        script.toggleControl(group, "pfl");
    }
};

PioneerDDJRX.jogTouch = function(_channel, _control, value, _status, group) {
    PioneerDDJRX.jogTouched[group] = value > 0;

    if (PioneerDDJRX.jogTouched[group]) {
        PioneerDDJRX.enableScratch(group);
    } else {
        PioneerDDJRX.disableScratch(group);
    }
};

PioneerDDJRX.jogPlatterTick = function(_channel, _control, value, _status, group) {
    var delta = PioneerDDJRX.relativeDelta(value);
    var deck = PioneerDDJRX.deckNumbers[group];

    if (!delta) {
        return;
    }

    if (PioneerDDJRX.jogTouched[group]) {
        PioneerDDJRX.enableScratch(group);
        engine.scratchTick(deck, delta);
    } else {
        PioneerDDJRX.bend(group, delta);
    }
};

PioneerDDJRX.jogWheelTick = function(channel, control, value, status, group) {
    PioneerDDJRX.jogPlatterTick(channel, control, value, status, group);
};

PioneerDDJRX.tempoMsb = function(_channel, _control, value, _status, group) {
    PioneerDDJRX.highResMsb[group].tempo = value;
};

PioneerDDJRX.tempoLsb = function(_channel, _control, value, _status, group) {
    var fullValue = PioneerDDJRX.compose14Bit(group, "tempo", value);
    engine.setParameter(group, "rate", script.absoluteLin(fullValue, -1, 1, 0, 0x3FFF));
};

PioneerDDJRX.trimMsb = function(_channel, _control, value, _status, group) {
    PioneerDDJRX.highResMsb[group].trim = value;
};

PioneerDDJRX.trimLsb = function(_channel, _control, value, _status, group) {
    var fullValue = PioneerDDJRX.compose14Bit(group, "trim", value);
    engine.setParameter(group, "pregain", PioneerDDJRX.centeredPot(fullValue));
};

PioneerDDJRX.eqHighMsb = function(_channel, _control, value, _status, group) {
    PioneerDDJRX.highResMsb[group.replace("[EqualizerRack1_", "").replace("_Effect1]", "")].eqHigh = value;
};

PioneerDDJRX.eqHighLsb = function(_channel, _control, value, _status, group) {
    var channelGroup = group.replace("[EqualizerRack1_", "").replace("_Effect1]", "");
    PioneerDDJRX.updateEq(channelGroup, "parameter3", PioneerDDJRX.compose14Bit(channelGroup, "eqHigh", value));
};

PioneerDDJRX.eqMidMsb = function(_channel, _control, value, _status, group) {
    PioneerDDJRX.highResMsb[group.replace("[EqualizerRack1_", "").replace("_Effect1]", "")].eqMid = value;
};

PioneerDDJRX.eqMidLsb = function(_channel, _control, value, _status, group) {
    var channelGroup = group.replace("[EqualizerRack1_", "").replace("_Effect1]", "");
    PioneerDDJRX.updateEq(channelGroup, "parameter2", PioneerDDJRX.compose14Bit(channelGroup, "eqMid", value));
};

PioneerDDJRX.eqLowMsb = function(_channel, _control, value, _status, group) {
    PioneerDDJRX.highResMsb[group.replace("[EqualizerRack1_", "").replace("_Effect1]", "")].eqLow = value;
};

PioneerDDJRX.eqLowLsb = function(_channel, _control, value, _status, group) {
    var channelGroup = group.replace("[EqualizerRack1_", "").replace("_Effect1]", "");
    PioneerDDJRX.updateEq(channelGroup, "parameter1", PioneerDDJRX.compose14Bit(channelGroup, "eqLow", value));
};

PioneerDDJRX.volumeMsb = function(_channel, _control, value, _status, group) {
    PioneerDDJRX.highResMsb[group].volume = value;
};

PioneerDDJRX.volumeLsb = function(_channel, _control, value, _status, group) {
    var fullValue = PioneerDDJRX.compose14Bit(group, "volume", value);
    engine.setParameter(group, "volume", PioneerDDJRX.linearPot(fullValue));
};

PioneerDDJRX.quickEffectMsb = function(_channel, control, value) {
    var group = control === 0x17 || control === 0x37 ? "[Channel1]" : "[Channel2]";
    PioneerDDJRX.highResMsb[group].quickEffect = value;
};

PioneerDDJRX.quickEffectLsb = function(_channel, control, value) {
    var group = control === 0x37 ? "[Channel1]" : "[Channel2]";
    var fullValue = PioneerDDJRX.compose14Bit(group, "quickEffect", value);
    engine.setParameter("[QuickEffectRack1_" + group + "]", "super1", PioneerDDJRX.linearPot(fullValue));
};

PioneerDDJRX.crossfaderMsb = function(_channel, _control, value) {
    PioneerDDJRX.highResMsb["[Master]"] = PioneerDDJRX.highResMsb["[Master]"] || {};
    PioneerDDJRX.highResMsb["[Master]"].crossfader = value;
};

PioneerDDJRX.crossfaderLsb = function(_channel, _control, value) {
    var fullValue = (PioneerDDJRX.highResMsb["[Master]"].crossfader << 7) + value;
    engine.setParameter("[Master]", "crossfader", script.absoluteLin(fullValue, -1, 1, 0, 0x3FFF));
};

PioneerDDJRX.loadButton = function(_channel, _control, value, _status, group) {
    if (value) {
        script.triggerControl(group, "LoadSelectedTrack", 40);
    }
};

PioneerDDJRX.masterCueButton = function(_channel, _control, value) {
    var masterIsCued;

    if (!value) {
        return;
    }

    masterIsCued = engine.getValue("[Master]", "headMix") > 0;
    engine.setValue("[Master]", "headMix", masterIsCued ? -1 : 1);
};

PioneerDDJRX.browseEncoder = function(_channel, _control, value) {
    var delta = PioneerDDJRX.relativeDelta(value);

    if (!delta) {
        return;
    }

    if (PioneerDDJRX.anyShiftPressed()) {
        engine.setValue("[Playlist]", "SelectPlaylist", delta);
    } else {
        engine.setValue("[Playlist]", "SelectTrackKnob", delta);
    }
};

PioneerDDJRX.browseEncoderPress = function(_channel, _control, value) {
    if (value) {
        script.triggerControl("[Playlist]", "ToggleSelectedSidebarItem", 40);
    }
};

PioneerDDJRX.backButton = function(_channel, _control, value) {
    if (value) {
        script.toggleControl("[Skin]", "show_maximized_library");
    }
};

PioneerDDJRX.tagTrackButton = function(_channel, _control, value) {
    if (value) {
        script.triggerControl("[Playlist]", "LoadSelectedIntoFirstStopped", 40);
    }
};

PioneerDDJRX.hotCuePad = function(_channel, control, value, _status, group) {
    var hotcueNumber = control + 1;
    var controlName = "hotcue_" + hotcueNumber + (PioneerDDJRX.shiftPressed[group] ? "_clear" : "_activate");

    if (value) {
        script.triggerControl(group, controlName, 40);
    }
};

PioneerDDJRX.playLed = function(value, group) {
    PioneerDDJRX.sendDeckLed(group, PioneerDDJRX.transportLedNotes.play, value > 0);
};

PioneerDDJRX.cueLed = function(value, group) {
    PioneerDDJRX.sendDeckLed(group, PioneerDDJRX.transportLedNotes.cue, value > 0);
};

PioneerDDJRX.syncLed = function(value, group) {
    PioneerDDJRX.sendDeckLed(group, PioneerDDJRX.transportLedNotes.sync, value > 0);
};

PioneerDDJRX.keylockLed = function(value, group) {
    PioneerDDJRX.sendDeckLed(group, PioneerDDJRX.transportLedNotes.keylock, value > 0);
};

PioneerDDJRX.pflLed = function(value, group) {
    PioneerDDJRX.sendDeckLed(group, PioneerDDJRX.transportLedNotes.pfl, value > 0);
};

PioneerDDJRX.slipLed = function(value, group) {
    PioneerDDJRX.sendDeckLed(group, PioneerDDJRX.transportLedNotes.slip, value > 0);
};

PioneerDDJRX.loadLed = function(value, group) {
    PioneerDDJRX.sendBrowserLed(PioneerDDJRX.browserLoadNotes[group], value > 0);
};

PioneerDDJRX.masterCueLed = function(value) {
    PioneerDDJRX.sendBrowserLed(0x63, value > 0);
};

PioneerDDJRX.hotcueLed = function(value, group, control) {
    var match = /hotcue_(\d+)_enabled/.exec(control);

    if (!match) {
        return;
    }

    PioneerDDJRX.sendPadLed(group, parseInt(match[1], 10) - 1, value > 0);
};
