import 'package:flutter/material.dart';
import 'package:animated_fractionally_sized_box/animated_fractionally_sized_box.dart';

class BatteryIndicator extends StatelessWidget {
  const BatteryIndicator({
    required this.percentage,
    required this.charging,
    Key? key,
  })  : connected = true,
        super(key: key);

  const BatteryIndicator.noConnection({Key? key})
      : percentage = 0,
        charging = false,
        connected = false,
        super(key: key);

  final int percentage;
  final bool charging;
  final bool connected;

  final double halfHeight = 6;
  final animationDuration = const Duration(milliseconds: 100);

  @override
  Widget build(BuildContext context) {
    Color progressColor = charging ? Colors.blue : Colors.green;
    progressColor = progressColor.withOpacity(connected ? 1 : 0);

    connected ? percentage / 100 : 0;

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Container(
          decoration: BoxDecoration(
            color: Colors.black12,
            borderRadius: BorderRadius.circular(halfHeight),
          ),
          height: halfHeight + halfHeight,
          child: AnimatedFractionallySizedBox(
            duration: animationDuration,
            widthFactor: connected ? percentage / 100 : 0,
            alignment: Alignment.centerLeft,
            child: AnimatedContainer(
              duration: animationDuration,
              decoration: BoxDecoration(
                color: progressColor,
                borderRadius: BorderRadius.circular(halfHeight),
              ),
              child: const Align(
                alignment: Alignment.centerRight,
                child: Text('50%'),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
