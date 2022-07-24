import 'package:mooovy/bike/bike.dart';
import 'package:flutter/foundation.dart';

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
