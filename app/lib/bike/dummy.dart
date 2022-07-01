import 'bike.dart';

class DummyBikeConnection implements BikeConnection {
  SpeedLimit _speedLimit = SpeedLimit.eu;
  PowerLevel _powerLevel = PowerLevel.fourth;

  @override
  SpeedLimit getSpeedLimit() => _speedLimit;

  @override
  Future<SpeedLimit> setSpeedLimit(SpeedLimit speedLimit) async {
    _speedLimit = speedLimit;
    return getSpeedLimit();
  }

  @override
  Future<PowerLevel> setPowerLvl(PowerLevel lvl) async {
    _powerLevel = lvl;
    return _powerLevel;
  }

  @override
  PowerLevel getPowerLvl() => _powerLevel;

  @override
  int batteryPercentage() => 80;
}
