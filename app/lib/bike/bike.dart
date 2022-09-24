import 'package:flutter/material.dart';
import 'package:mooovy/bike/models.dart';
import 'package:hive/hive.dart';
import 'package:provider/provider.dart';

part 'bike.g.dart';

@HiveType(typeId: 1)
class Bike {
  Bike({
    required this.id,
    required this.macAddress,
    required this.encryptionKey,
    required this.userKeyId,
    required this.name,
    required this.ownerName,
    this.modelColor,
    this.links,
  })  : power = BikePowerState(),
        lock = BikeLockState(),
        battery = BikeBatteryState(),
        info = BikeInfo(),
        bell = BikeBellState(),
        light = BikeLightState(),
        alarm = BikeAlarmState();

  @HiveField(0)
  final int id;
  @HiveField(1)
  final String macAddress;
  @HiveField(2)
  final String encryptionKey;
  @HiveField(3)
  final int userKeyId;
  @HiveField(4)
  final String name;
  @HiveField(5)
  final String ownerName;
  @HiveField(6)
  final BikeColor? modelColor;
  @HiveField(7)
  final BikeLinks? links;

  BikeConnection? connection;

  bool get connected => connection != null;
  bool get disconnected => connection == null;

  // States..
  final BikePowerState power;
  final BikeLockState lock;
  final BikeBatteryState battery;
  final BikeInfo info;
  final BikeBellState bell;
  final BikeLightState light;
  final BikeAlarmState alarm;
  injectState(Widget child) {
    Widget resp = child;
    resp = ListenToChanges(power, child);
    resp = ListenToChanges(lock, resp);
    resp = ListenToChanges(battery, resp);
    resp = ListenToChanges(info, resp);
    resp = ListenToChanges(bell, resp);
    resp = ListenToChanges(light, resp);
    resp = ListenToChanges(alarm, resp);
    return resp;
  }

  List<String> get bluetoothName {
    final bleNameSuffix = macAddress.replaceAll(':', '');
    return [
      "ES3-$bleNameSuffix",
      "EX3-$bleNameSuffix",
    ];
  }
}

@HiveType(typeId: 3)
class BikeLinks {
  const BikeLinks({
    required this.hash,
    required this.thumbnail,
  });

  @HiveField(0)
  final String hash;
  @HiveField(1)
  final String thumbnail;
}

@HiveType(typeId: 2)
class BikeColor {
  const BikeColor({
    required this.name,
    required this.primary,
    required this.secondary,
  });

  @HiveField(0)
  final String name;
  @HiveField(1)
  final String primary;
  @HiveField(2)
  final String secondary;
}

abstract class BikeConnection {
  Future<SpeedLimit> setSpeedLimit(SpeedLimit speedLimit);
  Future<PowerLevel> setPowerLvl(PowerLevel lvl);
  Future<BellSound> setBellSound(BellSound sound);
  Future<LightState> setLightState(LightState state);
  Future<bool> setAlarmState(bool state);
  Future<void> unlock();
}

enum SpeedLimit { jp, eu, us, noLimit }

enum PowerLevel { off, first, second, third, fourth, max }

enum BellSound { bell, sonar, party, foghorn }

enum LightState { off, on, auto }

List<SpeedLimit> speedLimits(bool debugPowerLevelAvailable) {
  final resp = [
    SpeedLimit.jp,
    SpeedLimit.eu,
    SpeedLimit.us,
  ];
  if (debugPowerLevelAvailable) {
    resp.add(SpeedLimit.noLimit);
  }
  return resp;
}

String speedLimitToString(SpeedLimit? lvl) => {
      null: '-',
      SpeedLimit.jp: '🇯🇵',
      SpeedLimit.eu: '🇪🇺',
      SpeedLimit.us: '🇺🇸',
      SpeedLimit.noLimit: '😎',
    }[lvl]!;

List<PowerLevel> powerLevels(bool debugPowerLevelsAvailable) {
  final resp = [
    PowerLevel.off,
    PowerLevel.first,
    PowerLevel.second,
    PowerLevel.third,
    PowerLevel.fourth,
  ];
  if (debugPowerLevelsAvailable) {
    resp.add(PowerLevel.max);
  }
  return resp;
}

String powerLevelToString(PowerLevel? lvl) => {
      null: '-',
      PowerLevel.off: 'OFF',
      PowerLevel.first: '1',
      PowerLevel.second: '2',
      PowerLevel.third: '3',
      PowerLevel.fourth: '4',
      PowerLevel.max: '5',
    }[lvl]!;

Map<BellSound, String> bellSoundsToString = {
  BellSound.bell: 'Bell',
  BellSound.sonar: 'Sonar',
  BellSound.party: 'Party',
  BellSound.foghorn: 'Foghorn',
};

Map<LightState, String> lightStatesToString = {
  LightState.off: 'OFF',
  LightState.on: 'ON',
  LightState.auto: 'AUTO',
};

IconData bellIcon(BellSound sound) => <BellSound, IconData>{
      BellSound.bell: Icons.notifications,
      BellSound.sonar: Icons.sensors,
      BellSound.party: Icons.celebration,
      BellSound.foghorn: Icons.directions_boat,
    }[sound]!;

IconData lightIcon(LightState state) => <LightState, IconData>{
      LightState.off: Icons.flashlight_off,
      LightState.on: Icons.flashlight_on,
      LightState.auto: Icons.sunny,
    }[state]!;
