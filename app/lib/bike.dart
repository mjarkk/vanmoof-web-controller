import 'dart:typed_data';

import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'api.dart';
import 'package:encrypt/encrypt.dart';

class BikeConnection {
  BikeConnection(this.bike)
      : encrypter = Encrypter(AES(
          Key.fromUtf8(bike.encryptionKey),
          mode: AESMode.ecb,
        ));

  final Encrypter encrypter;
  final BikeCredentials bike;
  BluetoothDevice? device;

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
  BluetoothCharacteristic? powerLevel;
  BluetoothCharacteristic? speedLimit;
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
  BluetoothCharacteristic? playSound;
  BluetoothCharacteristic? soundVolume;
  BluetoothCharacteristic? bellSound;

  // Light
  BluetoothCharacteristic? lightMode;
  BluetoothCharacteristic? sensor;

  authenticate() async {
    final challengeValue = await challenge!.read();
    var resp = List.generate(
        16, (i) => i < challengeValue.length ? challengeValue[i] : 0);

    resp = encrypter
        .encryptBytes(challengeValue, iv: IV(Uint8List(16)))
        .bytes
        .toList();

    resp.addAll([0, 0, 0, bike.userKeyId]);

    await keyIndex!.write(resp);

    print('yays');
  }

  connect(BluetoothDevice device) async {
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
        "6acc5534-e631-4069-944d-b8ca7598ad50": (c) => powerLevel = c,
        "6acc5535-e631-4069-944d-b8ca7598ad50": (c) => speedLimit = c,
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
        "6acc5571-e631-4069-944d-b8ca7598ad50": (c) => playSound = c,
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
      autoConnect: true,
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
        if (align != null) {
          align(char);
          print('assign $serviceUuid -> $charUuid');
        }
      }
    }

    await authenticate();

    this.device = device;
  }
}
