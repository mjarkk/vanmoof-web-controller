import 'package:flutter/material.dart';
import '../bike.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import '../local_storage.dart';

class Home extends StatefulWidget {
  const Home({Key? key}) : super(key: key);

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  Map<int, BikeConnection> connections = {};

  searchForBikes() async {
    for (var bike in obtainBikes()) {
      connections[bike.id] = BikeConnection(bike);
    }

    setState(() {});

    FlutterBluePlus flutterBlue = FlutterBluePlus.instance;
    final isOn = await flutterBlue.isOn;
    if (!isOn) {
      await flutterBlue.turnOn();
    }

    flutterBlue.startScan(timeout: const Duration(seconds: 4));
    Set<String> tryingToConnectWith = {};
    flutterBlue.scanResults.listen((results) {
      for (ScanResult r in results) {
        if (tryingToConnectWith.contains(r.device.name)) {
          continue;
        }

        for (var conn in connections.values) {
          if (conn.bike.bluetoothName.contains(r.device.name)) {
            tryingToConnectWith.add(r.device.name);
            conn.connect(r.device).then((_) {
              setState(() {});
              flutterBlue.connectedDevices.then((value) => print(value));
            });
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
                children: connections.values
                    .map((conn) => Text(
                          "bike: ${conn.bike.name}, connected: ${conn.device != null}",
                          key: ValueKey(conn.bike.id),
                          textAlign: TextAlign.center,
                          style: Theme.of(context).textTheme.headline6,
                        ))
                    .toList(),
              ),
            ),
            Expanded(child: Container(color: Colors.pink)),
          ],
        ),
      ),
    );
  }
}
