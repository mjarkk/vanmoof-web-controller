import 'package:flutter/material.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import '../bike/bike.dart';
import '../bike/real.dart';
import '../local_storage.dart';
import '../controls.dart';

class Home extends StatefulWidget {
  const Home({Key? key}) : super(key: key);

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  _HomeState() : bikes = obtainBikes();

  final List<Bike> bikes;

  searchForBikes() async {
    FlutterBluePlus flutterBlue = FlutterBluePlus.instance;
    try {
      flutterBlue.startScan(timeout: const Duration(seconds: 4));
    } catch (e) {
      flutterBlue = FlutterBluePlus.instance;
      flutterBlue.startScan(timeout: const Duration(seconds: 4));
    }

    for (var device in await flutterBlue.connectedDevices) {
      for (Bike bike in bikes) {
        if (bike.bluetoothName.contains(device.name)) {
          RealBikeConnection(bike)
              .connect(device, autoConnect: false)
              .then((_) => setState(() {}));
          break;
        }
      }
    }

    Set<String> tryingToConnectWith = {};
    flutterBlue.scanResults.listen((results) {
      for (ScanResult r in results) {
        if (tryingToConnectWith.contains(r.device.name)) {
          continue;
        }

        for (Bike bike in bikes) {
          if (bike.bluetoothName.contains(r.device.name)) {
            tryingToConnectWith.add(r.device.name);
            RealBikeConnection(bike)
                .connect(r.device)
                .then((_) => setState(() {}));
            break;
          }
        }
      }
    });
  }

  @override
  void didChangeDependencies() {
    searchForBikes();
    super.didChangeDependencies();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: bikes
                    .map((bike) => Text(
                          "bike: ${bike.name}, connected: ${bike.connection != null}",
                          key: ValueKey(bike.id),
                          textAlign: TextAlign.center,
                          style: Theme.of(context).textTheme.headline6,
                        ))
                    .toList(),
              ),
            ),
            Controls(bikes[0]),
          ],
        ),
      ),
    );
  }
}
