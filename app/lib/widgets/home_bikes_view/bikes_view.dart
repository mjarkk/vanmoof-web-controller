import 'package:flutter/material.dart';
import 'package:mooovy/widgets/home_bikes_view/selected_indicator.dart';
import 'package:mooovy/widgets/home_bikes_view/bike_view.dart';
import 'package:mooovy/bike/bike.dart';

class BikesView extends StatelessWidget {
  const BikesView({
    required this.bikes,
    required this.onBikeSelected,
    required this.selectedBike,
    super.key,
  });

  final List<Bike> bikes;
  final void Function(int) onBikeSelected;
  final int selectedBike;

  @override
  Widget build(BuildContext context) {
    if (bikes.length == 1) {
      return Expanded(
        child: BikeView(bikes[0]),
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
                  .map((bike) => BikeView(bike, key: Key(bike.id.toString())))
                  .toList(),
              onPageChanged: (idx) => onBikeSelected(idx),
            ),
          ),
          SelectedBikeIndicator(
            total: bikes.length,
            selected: selectedBike,
          ),
        ],
      ),
    );
  }
}
