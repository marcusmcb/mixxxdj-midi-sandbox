////////////////////////////////////////////////////////////////////////
// Pioneer DJM-S11 Mixxx sandbox mapping                              //
////////////////////////////////////////////////////////////////////////
/* global engine                                                      */
/* global script                                                      */
/* global midi                                                        */
////////////////////////////////////////////////////////////////////////

var PioneerDJMS11 = function() {};

PioneerDJMS11.deckNumbers = {
    "[Channel1]": 1,
    "[Channel2]": 2,
};

PioneerDJMS11.deckLedNotes = {
    load: 0x46,
    sync: 0x58,
    keylock: 0x1A,
    hotcueMode: 0x1B,
};

PioneerDJMS11.shiftPressed = false;
PioneerDJMS11.hotCueMode = {};
PioneerDJMS11.highResMsb = {};

PioneerDJMS11.init = function() {
    var groups = Object.keys(PioneerDJMS11.deckNumbers);
    var index;

    PioneerDJMS11.highResMsb["[Master]"] = {
        crossfader: 0,
        headphoneVolume: 0,
        headphoneMix: 0,
    };

    for (index = 0; index < groups.length; index++) {
        PioneerDJMS11.prepareDeck(groups[index]);
        PioneerDJMS11.bindDeckConnections(groups[index], false);
    }
};

PioneerDJMS11.shutdown = function() {
    var groups = Object.keys(PioneerDJMS11.deckNumbers);
    var index;

    for (index = 0; index < groups.length; index++) {
        PioneerDJMS11.bindDeckConnections(groups[index], true);
        PioneerDJMS11.clearDeckLeds(groups[index]);
        PioneerDJMS11.clearPadLeds(groups[index]);
    }
};

PioneerDJMS11.prepareDeck = function(group) {
    PioneerDJMS11.hotCueMode[group] = true;
    PioneerDJMS11.highResMsb[group] = {
        trim: 0,
        eqHigh: 0,
        eqMid: 0,
        eqLow: 0,
        filter: 0,
        volume: 0,
    };

    engine.softTakeover(group, "pregain", true);
    engine.softTakeover(group, "volume", true);
    engine.softTakeover("[EqualizerRack1_" + group + "_Effect1]", "parameter1", true);
    engine.softTakeover("[EqualizerRack1_" + group + "_Effect1]", "parameter2", true);
    engine.softTakeover("[EqualizerRack1_" + group + "_Effect1]", "parameter3", true);
    engine.softTakeover("[QuickEffectRack1_" + group + "]", "super1", true);
    engine.softTakeover("[Master]", "crossfader", true);
    engine.softTakeover("[Master]", "headVolume", true);
    engine.softTakeover("[Master]", "headMix", true);

    PioneerDJMS11.sendDeckLed(group, PioneerDJMS11.deckLedNotes.hotcueMode, true);
};

PioneerDJMS11.bindDeckConnections = function(group, remove) {
    var controls = {
        sync_enabled: "PioneerDJMS11.syncLed",
        keylock: "PioneerDJMS11.keylockLed",
        track_loaded: "PioneerDJMS11.loadLed",
    };
    var hotcueIndex;

    script.bindConnections(group, controls, remove);

    for (hotcueIndex = 1; hotcueIndex <= 8; hotcueIndex++) {
        engine.connectControl(group, "hotcue_" + hotcueIndex + "_enabled", "PioneerDJMS11.hotcueLed", remove);
        if (!remove) {
            engine.trigger(group, "hotcue_" + hotcueIndex + "_enabled");
        }
    }

    if (!remove) {
        engine.trigger(group, "sync_enabled");
        engine.trigger(group, "keylock");
        engine.trigger(group, "track_loaded");
    }
};

PioneerDJMS11.deckStatus = function(group) {
    return 0x90 + PioneerDJMS11.deckNumbers[group] - 1;
};

PioneerDJMS11.padStatus = function(group) {
    return 0x97 + PioneerDJMS11.deckNumbers[group] - 1;
};

PioneerDJMS11.sendDeckLed = function(group, note, enabled) {
    midi.sendShortMsg(PioneerDJMS11.deckStatus(group), note, enabled ? 0x7F : 0x00);
};

PioneerDJMS11.sendPadLed = function(group, note, enabled) {
    midi.sendShortMsg(PioneerDJMS11.padStatus(group), note, enabled ? 0x7F : 0x00);
};

PioneerDJMS11.clearDeckLeds = function(group) {
    var ledName;

    for (ledName in PioneerDJMS11.deckLedNotes) {
        PioneerDJMS11.sendDeckLed(group, PioneerDJMS11.deckLedNotes[ledName], false);
    }
};

PioneerDJMS11.clearPadLeds = function(group) {
    var hotcueIndex;

    for (hotcueIndex = 0; hotcueIndex < 8; hotcueIndex++) {
        PioneerDJMS11.sendPadLed(group, hotcueIndex, false);
    }
};

PioneerDJMS11.relativeDelta = function(value) {
    if (value === 0x40) {
        return 0;
    }
    return value > 0x40 ? value - 0x80 : value;
};

PioneerDJMS11.centeredPot = function(fullValue) {
    if (fullValue <= 0x1FFF) {
        return fullValue / 0x1FFF;
    }
    return 1 + (((fullValue - 0x1FFF) / 0x2000) * 3);
};

PioneerDJMS11.linearPot = function(fullValue) {
    return fullValue / 0x3FFF;
};

PioneerDJMS11.compose14Bit = function(group, key, lsbValue) {
    return (PioneerDJMS11.highResMsb[group][key] << 7) + lsbValue;
};

PioneerDJMS11.updateEq = function(group, parameter, fullValue) {
    engine.setParameter("[EqualizerRack1_" + group + "_Effect1]", parameter, PioneerDJMS11.centeredPot(fullValue));
};

PioneerDJMS11.shiftButton = function(_channel, _control, value) {
    PioneerDJMS11.shiftPressed = value > 0;
    engine.setValue("[Controls]", "touch_shift", value);
};

PioneerDJMS11.browseEncoder = function(_channel, _control, value) {
    var delta = PioneerDJMS11.relativeDelta(value);

    if (!delta) {
        return;
    }

    if (PioneerDJMS11.shiftPressed) {
        engine.setValue("[Playlist]", "SelectPlaylist", delta);
    } else {
        engine.setValue("[Playlist]", "SelectTrackKnob", delta);
    }
};

PioneerDJMS11.browseEncoderPress = function(_channel, _control, value) {
    if (value) {
        script.triggerControl("[Playlist]", "ToggleSelectedSidebarItem", 40);
    }
};

PioneerDJMS11.backButton = function(_channel, _control, value) {
    if (value) {
        script.toggleControl("[Skin]", "show_maximized_library");
    }
};

PioneerDJMS11.loadButton = function(_channel, _control, value, _status, group) {
    if (value) {
        script.triggerControl(group, "LoadSelectedTrack", 40);
    }
};

PioneerDJMS11.fourBeatLoopButton = function(_channel, _control, value, _status, group) {
    if (value) {
        script.triggerControl(group, "beatloop_activate", 40);
    }
};

PioneerDJMS11.loopHalveButton = function(_channel, _control, value, _status, group) {
    if (value) {
        script.triggerControl(group, "loop_halve", 40);
    }
};

PioneerDJMS11.loopDoubleButton = function(_channel, _control, value, _status, group) {
    if (value) {
        script.triggerControl(group, "loop_double", 40);
    }
};

PioneerDJMS11.hotCueModeButton = function(_channel, _control, value, _status, group) {
    if (!value) {
        return;
    }

    PioneerDJMS11.hotCueMode[group] = !PioneerDJMS11.hotCueMode[group];
    PioneerDJMS11.sendDeckLed(group, PioneerDJMS11.deckLedNotes.hotcueMode, PioneerDJMS11.hotCueMode[group]);
};

PioneerDJMS11.hotCuePad = function(_channel, control, value, _status, group) {
    var hotcueNumber = control + 1;
    var controlName;

    if (!value || !PioneerDJMS11.hotCueMode[group]) {
        return;
    }

    controlName = "hotcue_" + hotcueNumber + (PioneerDJMS11.shiftPressed ? "_clear" : "_activate");
    script.triggerControl(group, controlName, 40);
};

PioneerDJMS11.syncTouch = function(_channel, _control, value, _status, group) {
    if (value) {
        script.toggleControl(group, "sync_enabled");
    }
};

PioneerDJMS11.keyLockTouch = function(_channel, _control, value, _status, group) {
    if (value) {
        script.toggleControl(group, "keylock");
    }
};

PioneerDJMS11.trimMsb = function(_channel, _control, value, _status, group) {
    PioneerDJMS11.highResMsb[group].trim = value;
};

PioneerDJMS11.trimLsb = function(_channel, _control, value, _status, group) {
    engine.setParameter(group, "pregain", PioneerDJMS11.centeredPot(PioneerDJMS11.compose14Bit(group, "trim", value)));
};

PioneerDJMS11.eqHighMsb = function(_channel, _control, value, _status, group) {
    var channelGroup = group.replace("[EqualizerRack1_", "").replace("_Effect1]", "");
    PioneerDJMS11.highResMsb[channelGroup].eqHigh = value;
};

PioneerDJMS11.eqHighLsb = function(_channel, _control, value, _status, group) {
    var channelGroup = group.replace("[EqualizerRack1_", "").replace("_Effect1]", "");
    PioneerDJMS11.updateEq(channelGroup, "parameter3", PioneerDJMS11.compose14Bit(channelGroup, "eqHigh", value));
};

PioneerDJMS11.eqMidMsb = function(_channel, _control, value, _status, group) {
    var channelGroup = group.replace("[EqualizerRack1_", "").replace("_Effect1]", "");
    PioneerDJMS11.highResMsb[channelGroup].eqMid = value;
};

PioneerDJMS11.eqMidLsb = function(_channel, _control, value, _status, group) {
    var channelGroup = group.replace("[EqualizerRack1_", "").replace("_Effect1]", "");
    PioneerDJMS11.updateEq(channelGroup, "parameter2", PioneerDJMS11.compose14Bit(channelGroup, "eqMid", value));
};

PioneerDJMS11.eqLowMsb = function(_channel, _control, value, _status, group) {
    var channelGroup = group.replace("[EqualizerRack1_", "").replace("_Effect1]", "");
    PioneerDJMS11.highResMsb[channelGroup].eqLow = value;
};

PioneerDJMS11.eqLowLsb = function(_channel, _control, value, _status, group) {
    var channelGroup = group.replace("[EqualizerRack1_", "").replace("_Effect1]", "");
    PioneerDJMS11.updateEq(channelGroup, "parameter1", PioneerDJMS11.compose14Bit(channelGroup, "eqLow", value));
};

PioneerDJMS11.filterMsb = function(_channel, _control, value, _status, group) {
    var channelGroup = group.replace("[QuickEffectRack1_", "").replace("]", "");
    PioneerDJMS11.highResMsb[channelGroup].filter = value;
};

PioneerDJMS11.filterLsb = function(_channel, _control, value, _status, group) {
    var channelGroup = group.replace("[QuickEffectRack1_", "").replace("]", "");
    engine.setParameter(group, "super1", PioneerDJMS11.linearPot(PioneerDJMS11.compose14Bit(channelGroup, "filter", value)));
};

PioneerDJMS11.volumeMsb = function(_channel, _control, value, _status, group) {
    PioneerDJMS11.highResMsb[group].volume = value;
};

PioneerDJMS11.volumeLsb = function(_channel, _control, value, _status, group) {
    engine.setParameter(group, "volume", PioneerDJMS11.linearPot(PioneerDJMS11.compose14Bit(group, "volume", value)));
};

PioneerDJMS11.crossfaderMsb = function(_channel, _control, value) {
    PioneerDJMS11.highResMsb["[Master]"].crossfader = value;
};

PioneerDJMS11.crossfaderLsb = function(_channel, _control, value) {
    var fullValue = (PioneerDJMS11.highResMsb["[Master]"].crossfader << 7) + value;
    engine.setParameter("[Master]", "crossfader", script.absoluteLin(fullValue, -1, 1, 0, 0x3FFF));
};

PioneerDJMS11.headphoneVolumeMsb = function(_channel, _control, value) {
    PioneerDJMS11.highResMsb["[Master]"].headphoneVolume = value;
};

PioneerDJMS11.headphoneVolumeLsb = function(_channel, _control, value) {
    engine.setParameter("[Master]", "headVolume", PioneerDJMS11.linearPot((PioneerDJMS11.highResMsb["[Master]"].headphoneVolume << 7) + value));
};

PioneerDJMS11.headphoneMixMsb = function(_channel, _control, value) {
    PioneerDJMS11.highResMsb["[Master]"].headphoneMix = value;
};

PioneerDJMS11.headphoneMixLsb = function(_channel, _control, value) {
    engine.setParameter("[Master]", "headMix", script.absoluteLin((PioneerDJMS11.highResMsb["[Master]"].headphoneMix << 7) + value, -1, 1, 0, 0x3FFF));
};

PioneerDJMS11.syncLed = function(value, group) {
    PioneerDJMS11.sendDeckLed(group, PioneerDJMS11.deckLedNotes.sync, value > 0);
};

PioneerDJMS11.keylockLed = function(value, group) {
    PioneerDJMS11.sendDeckLed(group, PioneerDJMS11.deckLedNotes.keylock, value > 0);
};

PioneerDJMS11.loadLed = function(value, group) {
    PioneerDJMS11.sendDeckLed(group, PioneerDJMS11.deckLedNotes.load, value > 0);
};

PioneerDJMS11.hotcueLed = function(value, group, control) {
    var match = /hotcue_(\d+)_enabled/.exec(control);

    if (!match) {
        return;
    }

    PioneerDJMS11.sendPadLed(group, parseInt(match[1], 10) - 1, value > 0);
};