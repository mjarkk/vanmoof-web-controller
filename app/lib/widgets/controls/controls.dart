import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
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
    var secondary =
        bike.info.debugPowerLevelsAvailable ? PowerLevel.max : PowerLevel.third;

    await bike.connection
        ?.setPowerLvl(currentPowerLevel == primary ? secondary : primary);
  }

  onSelectNewLevel(PowerLevel level) => bike.connection?.setPowerLvl(level);

  @override
  Widget build(BuildContext context) {
    final powerState = context.watch<BikePowerState>();
    final powerLevel = powerState.powerLevel;

    late final int powerLevelIndex;
    final allLevels = powerLevels(bike.info.debugPowerLevelsAvailable);
    for (var idx = 0; idx < allLevels.length; idx++) {
      if (allLevels[idx] == powerLevel) {
        powerLevelIndex = idx;
      }
    }

    return DraggableControl(
      label: const ControlButtonLabel(Icons.wind_power, 'Power Level'),
      valueLabelForIndex: (int idx) => powerLevelToString(allLevels[idx]),
      levels: allLevels.length,
      selectedLevel: powerLevelIndex,
      onSelectLevel: (l) => onSelectNewLevel(allLevels[l]),
      onDoubleTap: () => onDoubleTap(powerLevel),
      disabled: bike.connection == null,
    );
  }
}

class SpeedLimitButton extends StatelessWidget {
  const SpeedLimitButton(this.bike, {super.key});

  final Bike bike;

  onDoubleTap(SpeedLimit currentSpeedLimit) async {
    var primary = SpeedLimit.us;
    await bike.connection
        ?.setSpeedLimit(currentSpeedLimit == primary ? SpeedLimit.eu : primary);
  }

  onSelectNewLevel(SpeedLimit limit) => bike.connection?.setSpeedLimit(limit);

  @override
  Widget build(BuildContext context) {
    final powerState = context.watch<BikePowerState>();
    final speedLimit = powerState.speedLimit;

    late final int speedLimitIndex;
    final allLevels = speedLimits(bike.info.debugPowerLevelsAvailable);
    for (var idx = 0; idx < allLevels.length; idx++) {
      if (allLevels[idx] == speedLimit) {
        speedLimitIndex = idx;
      }
    }

    return DraggableControl(
      valueLabelForIndex: (int idx) => speedLimitToString(allLevels[idx]),
      label: const ControlButtonLabel(Icons.speed, 'Speed limit'),
      levels: allLevels.length,
      selectedLevel: speedLimitIndex,
      onSelectLevel: (l) => onSelectNewLevel(allLevels[l]),
      disabled: bike.connection == null,
      onDoubleTap: () => onDoubleTap(speedLimit),
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
