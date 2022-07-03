import 'bike.dart';

class DummyBikeConnection implements BikeConnection {
  DummyBikeConnection(this.bike);

  final Bike bike;

  @override
  SpeedLimit getSpeedLimit() => bike.powerState.speedLimit;

  @override
  Future<SpeedLimit> setSpeedLimit(SpeedLimit speedLimit) async {
    bike.powerState.speedLimit = speedLimit;
    return getSpeedLimit();
  }

  @override
  PowerLevel getPowerLvl() => bike.powerState.powerLevel;

  @override
  Future<PowerLevel> setPowerLvl(PowerLevel lvl) async {
    bike.powerState.powerLevel = lvl;
    return getPowerLvl();
  }

  @override
  int batteryPercentage() => 80;

  @override
  bool locked() => bike.lockState.locked;

  @override
  Future<void> unlock() async => bike.lockState.locked = false;
}
