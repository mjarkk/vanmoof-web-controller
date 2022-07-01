import 'package:flutter/material.dart';
import 'package:animated_fractionally_sized_box/animated_fractionally_sized_box.dart';

import 'bike/bike.dart';

class BikesView extends StatelessWidget {
  const BikesView({
    required this.bikes,
    required this.onBikeSelected,
    required this.selectedBike,
    Key? key,
  }) : super(key: key);

  final List<Bike> bikes;
  final void Function(int) onBikeSelected;
  final int selectedBike;

  @override
  Widget build(BuildContext context) {
    if (bikes.length == 1) {
      return Expanded(
        child: _BikeView(bikes[0]),
      );
    }

    return Expanded(
      child: Column(
        children: [
          Expanded(
            child: PageView(
              controller: PageController(initialPage: selectedBike),
              scrollDirection: Axis.horizontal,
              children: bikes
                  .map((bike) => _BikeView(bike, key: Key(bike.id.toString())))
                  .toList(),
              onPageChanged: (idx) => onBikeSelected(idx),
            ),
          ),
          _SelectedBikeIndicator(
            total: bikes.length,
            selected: selectedBike,
          ),
        ],
      ),
    );
  }
}

class _SelectedBikeIndicator extends StatelessWidget {
  const _SelectedBikeIndicator({
    required this.total,
    required this.selected,
    Key? key,
  }) : super(key: key);

  final int total;
  final int selected;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(total, (index) => index)
          .map((idx) => Padding(
                key: Key('indicator-$idx'),
                padding: const EdgeInsets.all(3),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 100),
                  height: 11,
                  width: 11,
                  decoration: BoxDecoration(
                    color: idx == selected ? Colors.black26 : Colors.black12,
                    shape: BoxShape.circle,
                  ),
                ),
              ))
          .toList(),
    );
  }
}

class _BikeView extends StatelessWidget {
  const _BikeView(this.bike, {Key? key}) : super(key: key);

  final Bike bike;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: const EdgeInsets.all(10),
            child: bike.connection == null
                ? const BatteryIndicator.noConnection()
                : BatteryIndicator(
                    percentage: bike.connection!.batteryPercentage(),
                    charging: false,
                  ),
          ),
          Text(
            "bike: ${bike.name}, connected: ${bike.connection != null}",
            key: ValueKey(bike.id),
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.headline6,
          ),
        ],
      ),
    );
  }
}

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

    return Container(
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
    );
  }
}
