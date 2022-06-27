import 'bike/bike.dart';
import 'package:flutter/material.dart';

class Controls extends StatelessWidget {
  const Controls(this.bike, {Key? key}) : super(key: key);

  final Bike bike;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GridView.count(
        primary: false,
        padding: const EdgeInsets.all(10),
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
        crossAxisCount: 2,
        children: [
          _Control(
            label: 'Assistance',
            icon: Icons.wind_power,
            onPressed: () {},
          ),
          _Control(
            label: 'Speed limit',
            icon: Icons.speed,
            onPressed: () {},
          ),
        ],
      ),
    );
  }
}

class _Control extends StatelessWidget {
  const _Control({
    required this.label,
    required this.icon,
    required this.onPressed,
    Key? key,
  }) : super(key: key);

  final Function() onPressed;
  final String label;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () {},
      child: Column(
        children: [
          Icon(icon),
          Text(label),
        ],
      ),
    );
  }
}
