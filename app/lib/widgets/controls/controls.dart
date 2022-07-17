import 'package:flutter/material.dart';
import 'package:pointycastle/random/fortuna_random.dart';
import 'package:provider/provider.dart';
import 'package:flutter_native_select/flutter_native_select.dart';
import 'control.dart';
import '../../bike/bike.dart';
import '../../bike/models.dart';

class Controls extends StatelessWidget {
  const Controls(this.bike, {super.key});

  final Bike bike;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ConstrainedBox(
          constraints: const BoxConstraints(maxHeight: 300),
          child: Padding(
            padding: const EdgeInsets.all(8),
            child: FixedGrid(
              children: [
                PowerLevelButton(bike),
                SpeedLimitButton(bike),
              ],
            ),
          ),
        ),
        UnlockButton(bike),
      ],
    );
  }
}

class PowerLevelButton extends StatelessWidget {
  const PowerLevelButton(this.bike, {super.key});

  final Bike bike;

  onDoubleTap(PowerLevel currentPowerLevel) async {
    var primary = PowerLevel.fourth;
    var secondary = bike.bikeInfoState.debugPowerLevelsAvailable
        ? PowerLevel.max
        : PowerLevel.third;

    await bike.connection
        ?.setPowerLvl(currentPowerLevel == primary ? secondary : primary);
  }

  onSelectNewLevel(int level) async {
    print(level);
    bike.connection?.setPowerLvl(
        powerLevels(bike.bikeInfoState.debugPowerLevelsAvailable)[level]);
  }

  @override
  Widget build(BuildContext context) {
    final powerState = context.watch<BikePowerState>();

    final powerLevel = powerState.powerLevel;
    late final int powerLevelIndex;

    final allLevels = powerLevels(bike.bikeInfoState.debugPowerLevelsAvailable);
    for (var idx = 0; idx < allLevels.length; idx++) {
      if (allLevels[idx] == powerLevel) {
        powerLevelIndex = idx;
      }
    }

    return DraggableControl(
      label: 'Power Level',
      labelIcon: Icons.wind_power,
      valueLabelForIndex: (int idx) => powerLevelToString(allLevels[idx]),
      levels: allLevels.length,
      selectedLevel: powerLevelIndex,
      onSelectLevel: (l) => onSelectNewLevel(l),
      onDoubleTap: () => onDoubleTap(powerLevel),
      disabled: bike.connection == null,
    );
  }
}

class SpeedLimitButton extends StatelessWidget {
  const SpeedLimitButton(this.bike, {super.key});

  final Bike bike;

  onPressed(SpeedLimit speedLimit) async {
    final nextValue = {
      SpeedLimit.jp: SpeedLimit.eu,
      SpeedLimit.eu: SpeedLimit.us,
      SpeedLimit.us: bike.bikeInfoState.debugPowerLevelsAvailable
          ? SpeedLimit.noLimit
          : SpeedLimit.jp,
      SpeedLimit.noLimit: SpeedLimit.jp,
    }[speedLimit]!;
    await bike.connection?.setSpeedLimit(nextValue);
  }

  onLongPress(SpeedLimit speedLimit) async {
    final List<SpeedLimit> allPowerLevels =
        speedLimits(bike.bikeInfoState.debugPowerLevelsAvailable);

    final options = allPowerLevels
        .map((lvl) => NativeSelectItem(
              value: speedLimitToString(lvl),
              label: speedLimitToString(lvl),
            ))
        .toList();

    final value = await FlutterNativeSelect.openSelect(
        items: options, defaultValue: speedLimitToString(speedLimit));
    if (value == null) return;

    for (var pl in allPowerLevels) {
      if (speedLimitToString(pl) == value) {
        await bike.connection?.setSpeedLimit(pl);
        return;
      }
    }
  }

  onDoubleTap(SpeedLimit currentSpeedLimit) async {
    var primary = SpeedLimit.us;
    await bike.connection
        ?.setSpeedLimit(currentSpeedLimit == primary ? SpeedLimit.eu : primary);
  }

  @override
  Widget build(BuildContext context) {
    final powerState = context.watch<BikePowerState>();

    final speedLimit = powerState.speedLimit;

    return Control(
      disabled: bike.connection == null,
      label: 'Speed limit',
      icon: Icons.speed,
      onPressed: () => onPressed(speedLimit),
      onLongPress: () => onLongPress(speedLimit),
      onDoubleTap: () => onDoubleTap(speedLimit),
      value: speedLimitToString(speedLimit),
    );
  }
}

class UnlockButton extends StatelessWidget {
  const UnlockButton(this.bike);

  final Bike bike;

  @override
  Widget build(BuildContext context) {
    final bikeLockState = context.watch<BikeLockState>();

    return Padding(
      padding: const EdgeInsets.only(bottom: 8, left: 8, right: 8),
      child: Control(
        disabled: bike.connection == null,
        icon: bikeLockState.locked == true ? Icons.lock : Icons.lock_open,
        onPressed: () => bike.connection?.unlock(),
        value: 'Unlock',
      ),
    );
  }
}

class FixedGrid extends StatelessWidget {
  const FixedGrid({
    required this.children,
    super.key,
  });

  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final int l = children.length;
    return Row(
      children: [0, 1]
          .map((columnIdx) => Expanded(
                key: Key("row-$columnIdx"),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    for (int idx = columnIdx; idx < l; idx += 2)
                      Expanded(
                        key: Key('widget-$idx'),
                        child: children[idx],
                      ),
                  ],
                ),
              ))
          .toList(),
    );
  }
}
