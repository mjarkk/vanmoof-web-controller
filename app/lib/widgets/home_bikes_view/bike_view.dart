import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:modal_bottom_sheet/modal_bottom_sheet.dart';
import 'package:provider/provider.dart';
import 'package:mooovy/bike/bike.dart';
import 'package:mooovy/bike/models.dart';
import 'package:mooovy/routes/settings.dart';
import 'battery.dart';

class BikeView extends StatelessWidget {
  const BikeView(this.bike, {super.key});

  final Bike bike;

  openSetting(BuildContext context) {
    if (defaultTargetPlatform == TargetPlatform.iOS) {
      // Show a fancy full screen modal on IOS
      CupertinoScaffold.showCupertinoModalBottomSheet(
        context: context,
        expand: true,
        builder: (context) => Settings(ios: true, bike: bike),
      );
    } else {
      Navigator.push(
        context,
        MaterialPageRoute(
            builder: (context) => Settings(ios: false, bike: bike)),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final batteryState = context.watch<BikeBatteryState>();

    return Padding(
      padding: const EdgeInsets.all(10),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  bike.name,
                  style: Theme.of(context).textTheme.headline6,
                  textAlign: TextAlign.center,
                ),
                IconButton(
                  onPressed: () => openSetting(context),
                  icon: const Icon(
                    Icons.settings,
                    size: 22,
                  ),
                ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 10),
              child: bike.disconnected
                  ? const BatteryIndicator.noConnection()
                  : BatteryIndicator(
                      percentage: batteryState.batteryPercentage,
                      charging: batteryState.charging,
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
