import 'package:flutter/material.dart';
import '../../bike/bike.dart';
import 'battery.dart';

class BikeView extends StatelessWidget {
  const BikeView(this.bike, {Key? key}) : super(key: key);

  final Bike bike;

  @override
  Widget build(BuildContext context) {
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
            child: bike.connection == null
                ? const BatteryIndicator.noConnection()
                : BatteryIndicator(
                    percentage: bike.connection!.batteryPercentage(),
                    charging: false,
                  ),
          ),
        ],
      ),
    );
  }
}
