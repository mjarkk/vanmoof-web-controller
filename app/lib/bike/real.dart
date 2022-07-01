import 'bike.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
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

    await bltReadSpeedLimit();
    await bltReadPowerLvl();
    await bltReadBatteryPercentage();

    bike.connection = this;
  }

  bltReadAndDecrypt(BluetoothCharacteristic char) async {
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

  playSound(int nr) async {
    await bltWriteEncrypted(playSoundChar!, [nr]);
  }

  int _speedLimit = 0;

  Future<SpeedLimit> bltReadSpeedLimit() async {
    final speedLimitBytes = await bltReadAndDecrypt(speedLimitChar!);
    _speedLimit = speedLimitBytes[0];
    return _speedLimitToEnum(speedLimitBytes[0]);
  }

  @override
  SpeedLimit getSpeedLimit() => _speedLimitToEnum(_speedLimit);

  @override
  Future<SpeedLimit> setSpeedLimit(SpeedLimit speedLimit) async {
    final asNr = {
      SpeedLimit.jp: 0x2,
      SpeedLimit.eu: 0x0,
      SpeedLimit.us: 0x1,
      SpeedLimit.noLimit: 0x3,
    }[speedLimit]!;
    _speedLimit = asNr;

    await bltWriteEncrypted(speedLimitChar!, [asNr]);
    await Future.delayed(const Duration(milliseconds: 100));
    return await bltReadSpeedLimit();
  }

  PowerLevel _powerLevel = PowerLevel.fourth;

  @override
  PowerLevel getPowerLvl() => _powerLevel;

  @override
  Future<PowerLevel> setPowerLvl(PowerLevel lvl) async {
    _powerLevel = lvl;

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
    final parsedPowerLevel = _powerLevelToEnum(lvlBytes[0]);
    _powerLevel = parsedPowerLevel;
    return parsedPowerLevel;
  }

  int _batteryPercentage = 0;

  @override
  int batteryPercentage() => _batteryPercentage;

  Future<int> bltReadBatteryPercentage() async {
    final value = await bltReadAndDecrypt(moduleBatteryLevel!);
    _batteryPercentage = value[0]!;
    return _batteryPercentage;
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