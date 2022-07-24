import 'bike.dart';

class DummyBikeConnection implements BikeConnection {
  DummyBikeConnection(this.bike) {
    bike.battery.batteryPercentage = 80;
  }

  final Bike bike;

  @override
  Future<SpeedLimit> setSpeedLimit(SpeedLimit speedLimit) async {
    bike.power.speedLimit = speedLimit;
    return speedLimit;
  }

  @override
  Future<PowerLevel> setPowerLvl(PowerLevel lvl) async {
    bike.power.powerLevel = lvl;
    return lvl;
  }

  @override
  Future<void> unlock() async => bike.lock.locked = false;

  @override
  Future<BellSound> setBellSound(BellSound sound) async {
    bike.bell.bellSound = sound;
    return sound;
  }
}
