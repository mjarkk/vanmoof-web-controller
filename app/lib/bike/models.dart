import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:mooovy/bike/bike.dart';

class ListenToChanges<T extends ChangeNotifier?> extends StatelessWidget {
  const ListenToChanges(this.value, this.child, {super.key});

  final T value;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider.value(value: value, child: child);
  }
}

// class ListenToBikeState extends StatelessWidget {
//   const ListenToBikeState({required this.bike, required this.child, super.key});

//   final Bike bike;
//   final Widget child;

//   @override
//   Widget build(BuildContext context) {
//     Widget resp = ListenToChanges(bike.power, child);
//     resp = ListenToChanges(bike.lock, resp);
//     resp = ListenToChanges(bike.battery, resp);
//     resp = ListenToChanges(bike.info, resp);
//     resp = ListenToChanges(bike.bell, resp);
//     resp = ListenToChanges(bike.light, resp);
//     resp = ListenToChanges(bike.alarm, resp);
//     return resp;
//   }
// }

class BikePowerState extends ChangeNotifier {
  SpeedLimit _speedLimit = SpeedLimit.eu;
  SpeedLimit get speedLimit => _speedLimit;
  set speedLimit(SpeedLimit value) {
    _speedLimit = value;
    notifyListeners();
  }

  PowerLevel _powerLevel = PowerLevel.fourth;
  PowerLevel get powerLevel => _powerLevel;
  set powerLevel(PowerLevel value) {
    _powerLevel = value;
    notifyListeners();
  }
}

class BikeLockState extends ChangeNotifier {
  bool _locked = false;
  bool get locked => _locked;
  set locked(bool value) {
    _locked = value;
    notifyListeners();
  }
}

class BikeBatteryState extends ChangeNotifier {
  int _batteryPercentage = 100;
  int get batteryPercentage => _batteryPercentage;
  set batteryPercentage(int value) {
    if (value > 100) value = 100;
    _batteryPercentage = value;
    notifyListeners();
  }

  bool _charging = false;
  bool get charging => _charging;
  set charging(bool value) {
    _charging = value;
    notifyListeners();
  }
}

class BikeBellState extends ChangeNotifier {
  BellSound _bellSound = BellSound.bell;
  BellSound get bellSound => _bellSound;
  set bellSound(BellSound value) {
    _bellSound = value;
    notifyListeners();
  }
}

class BikeLightState extends ChangeNotifier {
  LightState _lightState = LightState.off;
  LightState get lightState => _lightState;
  set lightState(LightState value) {
    _lightState = value;
    notifyListeners();
  }
}

class BikeAlarmState extends ChangeNotifier {
  bool _alarm = false;
  bool get alarm => _alarm;
  set alarmState(bool value) {
    _alarm = value;
    notifyListeners();
  }
}

class BikeInfo extends ChangeNotifier {
  List<int> _version = [1, 8, 0];
  List<int> get version => _version;
  set version(List<int> value) {
    assert(value.length >= 2);
    _version = value;
    notifyListeners();
  }

  get debugPowerLevelsAvailable => _version[0] < 2 && _version[1] < 8;
}
