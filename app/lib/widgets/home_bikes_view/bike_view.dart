import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../bike/bike.dart';
import '../../bike/models.dart';
import 'battery.dart';

class BikeView extends StatelessWidget {
  const BikeView(this.bike, {super.key});

  final Bike bike;

  @override
  Widget build(BuildContext context) {
    final batteryState = context.watch<BikeBatteryState>();

    return Padding(
      padding: const EdgeInsets.all(10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            bike.name,
            style: Theme.of(context).textTheme.headline6,
            textAlign: TextAlign.center,
          ),
          Padding(
            padding: const EdgeInsets.all(10),
            child: bike.disconnected
                ? const BatteryIndicator.noConnection()
                : BatteryIndicator(
                    percentage: batteryState.batteryPercentage,
                    charging: false,
                  ),
          ),
        ],
      ),
    );
  }
}
