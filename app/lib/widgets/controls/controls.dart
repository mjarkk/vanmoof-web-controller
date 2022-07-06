import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'control.dart';
import '../../bike/bike.dart';
import '../../bike/models.dart';

class Controls extends StatelessWidget {
  const Controls(this.bike, {super.key});

  final Bike bike;

  setSpeedLimit(BikePowerState powerState) async {
    final nextValue = {
      SpeedLimit.jp: SpeedLimit.eu,
      SpeedLimit.eu: SpeedLimit.us,
      SpeedLimit.us: SpeedLimit.noLimit,
      SpeedLimit.noLimit: SpeedLimit.jp,
    }[powerState.speedLimit]!;
    await bike.connection?.setSpeedLimit(nextValue);
  }

  setPowerLevel(BikePowerState powerState) async {
    final nextValue = {
      PowerLevel.off: PowerLevel.first,
      PowerLevel.first: PowerLevel.second,
      PowerLevel.second: PowerLevel.third,
      PowerLevel.third: PowerLevel.fourth,
      PowerLevel.fourth: PowerLevel.max,
      PowerLevel.max: PowerLevel.off,
    }[powerState.powerLevel]!;
    await bike.connection?.setPowerLvl(nextValue);
  }

  @override
  Widget build(BuildContext context) {
    final powerState = context.watch<BikePowerState>();

    return Column(
      children: [
        ConstrainedBox(
          constraints: const BoxConstraints(maxHeight: 300),
          child: Padding(
            padding: const EdgeInsets.all(8),
            child: FixedGrid(
              children: [
                Control(
                  disabled: bike.connection == null,
                  label: 'Assistance',
                  icon: Icons.wind_power,
                  onPressed: () => setPowerLevel(powerState),
                  value: powerLevelToString(powerState.powerLevel),
                ),
                Control(
                  disabled: bike.connection == null,
                  label: 'Speed limit',
                  icon: Icons.speed,
                  onPressed: () => setSpeedLimit(powerState),
                  value: speedLimitToString(powerState.speedLimit),
                ),
              ],
            ),
          ),
        ),
        UnlockButton(bike),
      ],
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
