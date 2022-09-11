import 'package:flutter/material.dart';

class BatteryIndicator extends StatelessWidget {
  const BatteryIndicator({
    required this.percentage,
    required this.charging,
    super.key,
  }) : connected = true;

  const BatteryIndicator.noConnection({super.key})
      : percentage = 0,
        charging = false,
        connected = false;

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
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.only(top: 4),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(connected ? '$percentage%' : '--%'),
              if (charging) const Icon(Icons.bolt),
            ],
          ),
        ),
      ],
    );
  }
}
