import 'bike.dart';

class DummyBikeConnection implements BikeConnection {
  DummyBikeConnection(this.bike) {
    bike.batteryState.batteryPercentage = 80;
  }

  final Bike bike;

  @override
  Future<SpeedLimit> setSpeedLimit(SpeedLimit speedLimit) async {
    bike.powerState.speedLimit = speedLimit;
    return speedLimit;
  }

  @override
  Future<PowerLevel> setPowerLvl(PowerLevel lvl) async {
    bike.powerState.powerLevel = lvl;
    return lvl;
  }

  @override
  Future<void> unlock() async => bike.lockState.locked = false;
}
