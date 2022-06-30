import 'bike.dart';

class DummyBikeConnection implements BikeConnection {
  SpeedLimit _speedLimit = SpeedLimit.eu;

  @override
  Future<SpeedLimit> getSpeedLimit() async => _speedLimit;

  @override
  Future<SpeedLimit> setSpeedLimit(SpeedLimit speedLimit) async {
    _speedLimit = speedLimit;
    return await getSpeedLimit();
  }
}
