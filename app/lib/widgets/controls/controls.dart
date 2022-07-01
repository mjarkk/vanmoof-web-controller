import '../../bike/bike.dart';
import 'control.dart';
import 'package:flutter/material.dart';

class Controls extends StatefulWidget {
  const Controls(this.bike, {Key? key}) : super(key: key);

  final Bike bike;

  @override
  State<Controls> createState() => _ControlsState();
}

class _ControlsState extends State<Controls> {
  setSpeedLimit() async {
    final nextValue = {
      SpeedLimit.jp: SpeedLimit.eu,
      SpeedLimit.eu: SpeedLimit.us,
      SpeedLimit.us: SpeedLimit.noLimit,
      SpeedLimit.noLimit: SpeedLimit.jp,
    }[widget.bike.connection?.getSpeedLimit()]!;
    await widget.bike.connection?.setSpeedLimit(nextValue);
    setState(() {});
  }

  setPowerLevel() async {
    final nextValue = {
      PowerLevel.off: PowerLevel.first,
      PowerLevel.first: PowerLevel.second,
      PowerLevel.second: PowerLevel.third,
      PowerLevel.third: PowerLevel.fourth,
      PowerLevel.fourth: PowerLevel.max,
      PowerLevel.max: PowerLevel.off,
    }[widget.bike.connection?.getPowerLvl()]!;
    await widget.bike.connection?.setPowerLvl(nextValue);
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return ConstrainedBox(
      constraints: const BoxConstraints(maxHeight: 300),
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: FixedGrid(
          children: [
            Control(
              disabled: widget.bike.connection == null,
              label: 'Assistance',
              icon: Icons.wind_power,
              onPressed: setPowerLevel,
              value: powerLevelToString(widget.bike.connection?.getPowerLvl()),
            ),
            Control(
              disabled: widget.bike.connection == null,
              label: 'Speed limit',
              icon: Icons.speed,
              onPressed: setSpeedLimit,
              value:
                  speedLimitToString(widget.bike.connection?.getSpeedLimit()),
            ),
          ],
        ),
      ),
    );
  }
}

class FixedGrid extends StatelessWidget {
  const FixedGrid({
    required this.children,
    Key? key,
  }) : super(key: key);

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
