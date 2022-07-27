import 'dart:convert';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'bike.dart';
import 'encryption.dart';

class RealBikeConnection implements BikeConnection {
  RealBikeConnection(this.bike) : cyrpto = AesEcb(bike.encryptionKey);

  final Bike bike;
  final AesEcb cyrpto;

  // Security
  BluetoothCharacteristic? challenge;
  BluetoothCharacteristic? keyIndex;
  BluetoothCharacteristic? backupCode;
  BluetoothCharacteristic? bikeMessage;

  // Defense
  BluetoothCharacteristic? lockState;
  BluetoothCharacteristic? unlockRequest;
  BluetoothCharacteristic? alarmState;
  BluetoothCharacteristic? alarmMode;

  // Movement
  BluetoothCharacteristic? distance;
  BluetoothCharacteristic? speed;
  BluetoothCharacteristic? uintSystem;
  BluetoothCharacteristic? powerLevelChar;
  BluetoothCharacteristic? speedLimitChar;
  BluetoothCharacteristic? eShifterGear;
  BluetoothCharacteristic? eShifterPoints;
  BluetoothCharacteristic? eShifterMode;

  // BikeInfo
  BluetoothCharacteristic? motorBatteryLevel;
  BluetoothCharacteristic? motorBatteryState;
  BluetoothCharacteristic? moduleBatteryLevel;
  BluetoothCharacteristic? moduleBatteryState;
  BluetoothCharacteristic? bikeFWVersion;
  BluetoothCharacteristic? bleChipFWVersion;
  BluetoothCharacteristic? controllerFWVersion;
  BluetoothCharacteristic? pcbaHardwareVersion;
  BluetoothCharacteristic? gsmFWVersion;
  BluetoothCharacteristic? eShifterFWVersion;
  BluetoothCharacteristic? batteryFWVersion;
  BluetoothCharacteristic? frameNumber;

  // BikeState
  BluetoothCharacteristic? moduleMode;
  BluetoothCharacteristic? moduleState;
  BluetoothCharacteristic? errors;
  BluetoothCharacteristic? wheelSize;
  BluetoothCharacteristic? clock;

  // Sound
  BluetoothCharacteristic? playSoundChar;
  BluetoothCharacteristic? soundVolume;
  BluetoothCharacteristic? bellSound;

  // Light
  BluetoothCharacteristic? lightMode;
  BluetoothCharacteristic? sensor;

  authenticate() async {
    final challengeValue = await challenge!.read();
    var resp = List.generate(
        16, (i) => i < challengeValue.length ? challengeValue[i] : 0);
    resp = cyrpto.encrypt(resp);
    resp.addAll([0, 0, 0, bike.userKeyId]);
    await keyIndex!.write(resp);
  }

  connect(BluetoothDevice device, {bool autoConnect = true}) async {
    final Map<String, Map<String, Function(BluetoothCharacteristic)>>
        asignmentMap = {
      // securityService
      "6acc5500-e631-4069-944d-b8ca7598ad50": {
        "6acc5501-e631-4069-944d-b8ca7598ad50": (c) => challenge = c,
        "6acc5502-e631-4069-944d-b8ca7598ad50": (c) => keyIndex = c,
        "6acc5503-e631-4069-944d-b8ca7598ad50": (c) => backupCode = c,
        "6acc5505-e631-4069-944d-b8ca7598ad50": (c) => bikeMessage = c,
      },
      // defenseService
      "6acc5520-e631-4069-944d-b8ca7598ad50": {
        "6acc5521-e631-4069-944d-b8ca7598ad50": (c) => lockState = c,
        "6acc5522-e631-4069-944d-b8ca7598ad50": (c) => unlockRequest = c,
        "6acc5523-e631-4069-944d-b8ca7598ad50": (c) => alarmState = c,
        "6acc5524-e631-4069-944d-b8ca7598ad50": (c) => alarmMode = c,
      },
      // movementService
      "6acc5530-e631-4069-944d-b8ca7598ad50": {
        "6acc5531-e631-4069-944d-b8ca7598ad50": (c) => distance = c,
        "6acc5532-e631-4069-944d-b8ca7598ad50": (c) => speed = c,
        "6acc5533-e631-4069-944d-b8ca7598ad50": (c) => uintSystem = c,
        "6acc5534-e631-4069-944d-b8ca7598ad50": (c) => powerLevelChar = c,
        "6acc5535-e631-4069-944d-b8ca7598ad50": (c) => speedLimitChar = c,
        "6acc5536-e631-4069-944d-b8ca7598ad50": (c) => eShifterGear = c,
        "6acc5537-e631-4069-944d-b8ca7598ad50": (c) => eShifterPoints = c,
        "6acc5538-e631-4069-944d-b8ca7598ad50": (c) => eShifterMode = c,
      },
      // bikeInfoService
      "6acc5540-e631-4069-944d-b8ca7598ad50": {
        "6acc5541-e631-4069-944d-b8ca7598ad50": (c) => motorBatteryLevel = c,
        "6acc5542-e631-4069-944d-b8ca7598ad50": (c) => motorBatteryState = c,
        "6acc5543-e631-4069-944d-b8ca7598ad50": (c) => moduleBatteryLevel = c,
        "6acc5544-e631-4069-944d-b8ca7598ad50": (c) => moduleBatteryState = c,
        "6acc554a-e631-4069-944d-b8ca7598ad50": (c) => bikeFWVersion = c,
        "6acc554b-e631-4069-944d-b8ca7598ad50": (c) => bleChipFWVersion = c,
        "6acc554c-e631-4069-944d-b8ca7598ad50": (c) => controllerFWVersion = c,
        "6acc554d-e631-4069-944d-b8ca7598ad50": (c) => pcbaHardwareVersion = c,
        "6acc554e-e631-4069-944d-b8ca7598ad50": (c) => gsmFWVersion = c,
        "6acc554f-e631-4069-944d-b8ca7598ad50": (c) => eShifterFWVersion = c,
        "6acc5550-e631-4069-944d-b8ca7598ad50": (c) => batteryFWVersion = c,
        "6acc5552-e631-4069-944d-b8ca7598ad50": (c) => frameNumber = c,
      },
      // bikeStateService
      "6acc5560-e631-4069-944d-b8ca7598ad50": {
        "6acc5561-e631-4069-944d-b8ca7598ad50": (c) => moduleMode = c,
        "6acc5562-e631-4069-944d-b8ca7598ad50": (c) => moduleState = c,
        "6acc5563-e631-4069-944d-b8ca7598ad50": (c) => errors = c,
        "6acc5564-e631-4069-944d-b8ca7598ad50": (c) => wheelSize = c,
        "6acc5567-e631-4069-944d-b8ca7598ad50": (c) => clock = c,
      },
      // soundService
      "6acc5570-e631-4069-944d-b8ca7598ad50": {
        "6acc5571-e631-4069-944d-b8ca7598ad50": (c) => playSoundChar = c,
        "6acc5572-e631-4069-944d-b8ca7598ad50": (c) => soundVolume = c,
        "6acc5574-e631-4069-944d-b8ca7598ad50": (c) => bellSound = c,
      },
      // lightService
      "6acc5580-e631-4069-944d-b8ca7598ad50": {
        "6acc5581-e631-4069-944d-b8ca7598ad50": (c) => lightMode = c,
        "6acc5584-e631-4069-944d-b8ca7598ad50": (c) => sensor = c,
      },
    };

    await device.connect(
      autoConnect: autoConnect,
      timeout: const Duration(seconds: 10),
    );
    final services = await device.discoverServices();
    for (BluetoothService service in services) {
      String serviceUuid = service.uuid.toString();
      final alignmentChars = asignmentMap[serviceUuid];
      if (alignmentChars == null) continue;

      for (BluetoothCharacteristic char in service.characteristics) {
        final charUuid = char.uuid.toString();
        final align = alignmentChars[charUuid];
        if (align != null) align(char);
      }
    }

    await authenticate();

    await Future.wait([
      bltReadSpeedLimit(),
      bltReadPowerLvl(),
      bltReadBatteryPercentage(),
      bltReadLocked(),
      bltReadFWVersion(),
    ]);

    bike.connection = this;
  }

  Future<List<int>> bltReadAndDecrypt(BluetoothCharacteristic char) async {
    final value = await char.read();
    var decrypted = cyrpto.decrypt(value);
    final lastPaddedByte = decrypted.lastIndexWhere((b) => b != 0);
    decrypted.removeRange(lastPaddedByte + 1, decrypted.length);
    return decrypted;
  }

  bltWriteEncrypted(BluetoothCharacteristic char, List<int> value) async {
    final List<int> payload = [];

    final nonce = await challenge!.read();
    payload.addAll(nonce);

    // Add value
    payload.addAll(value);

    // Make the payload align to 16 byte
    final padding = 16 - (payload.length % 16);
    payload.addAll(List.generate(padding, (_) => 0));

    final encrypted = cyrpto.encrypt(payload);
    await char.write(encrypted);
  }

  bltPlaySound(int nr) async {
    await bltWriteEncrypted(playSoundChar!, [nr]);
  }

  Future<SpeedLimit> bltReadSpeedLimit() async {
    final speedLimitBytes = await bltReadAndDecrypt(speedLimitChar!);
    final resp = _speedLimitToEnum(
      speedLimitBytes.isEmpty ? 0x0 : speedLimitBytes[0],
    );
    bike.power.speedLimit = resp;
    return resp;
  }

  @override
  Future<SpeedLimit> setSpeedLimit(SpeedLimit speedLimit) async {
    bike.power.speedLimit = speedLimit;
    final asNr = {
      SpeedLimit.jp: 0x2,
      SpeedLimit.eu: 0x0,
      SpeedLimit.us: 0x1,
      SpeedLimit.noLimit: 0x3,
    }[speedLimit]!;

    await bltWriteEncrypted(speedLimitChar!, [asNr]);
    await Future.delayed(const Duration(milliseconds: 100));
    return await bltReadSpeedLimit();
  }

  @override
  Future<PowerLevel> setPowerLvl(PowerLevel lvl) async {
    bike.power.powerLevel = lvl;

    final asNr = {
      PowerLevel.off: 0x0,
      PowerLevel.first: 0x1,
      PowerLevel.second: 0x2,
      PowerLevel.third: 0x3,
      PowerLevel.fourth: 0x4,
      PowerLevel.max: 0x5,
    }[lvl]!;

    await bltWriteEncrypted(powerLevelChar!, [asNr]);

    return await bltReadPowerLvl();
  }

  Future<PowerLevel> bltReadPowerLvl() async {
    final lvlBytes = await bltReadAndDecrypt(powerLevelChar!);
    final parsedPowerLevel =
        _powerLevelToEnum(lvlBytes.isEmpty ? 0x0 : lvlBytes[0]);
    bike.power.powerLevel = parsedPowerLevel;
    return parsedPowerLevel;
  }

  Future<int> bltReadBatteryPercentage() async {
    final value = await bltReadAndDecrypt(moduleBatteryLevel!);
    bike.battery.batteryPercentage = value[0];
    return bike.battery.batteryPercentage;
  }

  @override
  Future<void> unlock() async {
    await bltWriteEncrypted(lockState!, [0x2]);
  }

  Future<bool> bltReadLocked() async {
    final value = await bltReadAndDecrypt(lockState!);
    bike.lock.locked =
        value.isEmpty ? false : (value[0] == 0x1 || value[0] == 0x2);
    return bike.lock.locked;
  }

  Future<List<int>> bltReadFWVersion() async {
    final value = await bltReadAndDecrypt(bikeFWVersion!);
    final List<int> decodedValue =
        utf8.decode(value).split('.').map((v) => int.tryParse(v) ?? 0).toList();
    bike.info.version = decodedValue;
    return decodedValue;
  }

  @override
  Future<BellSound> setBellSound(BellSound sound) async {
    final asNr = {
      BellSound.bell: 0x16,
      BellSound.sonar: 0x0a,
      BellSound.party: 0x17,
      BellSound.foghorn: 0x18,
    }[sound]!;

    await bltWriteEncrypted(bellSound!, [asNr, 0x1]);

    return await bltReadBellSound();
  }

  Future<BellSound> bltReadBellSound() async {
    final value = await bltReadAndDecrypt(bellSound!);
    final parsedSound = _bellSoundToEnum(value.isEmpty ? 0x0 : value[0]);
    bike.bell.bellSound = parsedSound;
    return parsedSound;
  }

  @override
  Future<LightState> setLightState(LightState state) async {
    final asNr = {
      LightState.off: 0x0,
      LightState.on: 0x1,
      LightState.auto: 0x2,
    }[state]!;

    await bltWriteEncrypted(lightMode!, [asNr, 0x1]);

    return await bltReadLightState();
  }

  Future<LightState> bltReadLightState() async {
    final value = await bltReadAndDecrypt(lightMode!);
    final parsedState = _lightStateToEnum(value.isEmpty ? 0x0 : value[0]);
    bike.light.lightState = parsedState;
    return parsedState;
  }

}

SpeedLimit _speedLimitToEnum(int nr) =>
    {
      0x2: SpeedLimit.jp,
      0x0: SpeedLimit.eu,
      0x1: SpeedLimit.us,
    }[nr] ??
    SpeedLimit.noLimit;

PowerLevel _powerLevelToEnum(int nr) =>
    {
      0x1: PowerLevel.first,
      0x2: PowerLevel.second,
      0x3: PowerLevel.third,
      0x4: PowerLevel.fourth,
      0x5: PowerLevel.max,
    }[nr] ??
    PowerLevel.off;

BellSound _bellSoundToEnum(int nr) =>
    {
      0x16: BellSound.bell,
      0x0a: BellSound.sonar,
      0x17: BellSound.party,
      0x18: BellSound.foghorn,
    }[nr] ??
    BellSound.sonar;

LightState _lightStateToEnum(int nr) =>
    {
      0x0: LightState.off,
      0x1: LightState.on,
      0x2: LightState.auto,
    }[nr] ??
    LightState.off;
