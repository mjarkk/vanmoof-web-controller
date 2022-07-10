import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:modal_bottom_sheet/modal_bottom_sheet.dart';
import 'package:provider/provider.dart';
import '../../bike/bike.dart';
import '../../bike/models.dart';
import '../../routes/settings.dart';
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
        builder: (context) => const Settings(ios: true),
      );
    } else {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const Settings()),
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
            Image.network(
              bike.links!.thumbnail,
              fit: BoxFit.cover,
              height: 200,
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
