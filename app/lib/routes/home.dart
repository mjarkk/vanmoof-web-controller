import 'package:flutter/material.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import '../bike/bike.dart';
import '../bike/real.dart';
import '../bike/dummy.dart';
import '../local_storage.dart';
import '../widgets/controls/controls.dart';
import '../widgets/home_bikes_view/bikes_view.dart';

class Home extends StatefulWidget {
  const Home({Key? key}) : super(key: key);

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  _HomeState() : bikes = obtainBikes();

  final List<Bike> bikes;
  int selectedBikeIdx = 0;
  bool useDummy = false;

  searchForBikes() async {
    FlutterBluePlus flutterBlue = FlutterBluePlus.instance;
    try {
      await flutterBlue.isAvailable;
      flutterBlue.setLogLevel(LogLevel.critical);
      flutterBlue.startScan(timeout: const Duration(seconds: 4));
    } catch (e) {
      flutterBlue = FlutterBluePlus.instance;
      await flutterBlue.isAvailable;
      flutterBlue.setLogLevel(LogLevel.critical);
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

  setupDummyConnections() {
    setState(() {
      for (Bike bike in bikes) {
        bike.connection = DummyBikeConnection();
      }
      bikes.add(Bike(
        id: -1,
        name: 'susy demo bike',
        macAddress: 'MAC:MAC:MAC',
        encryptionKey: '',
        userKeyId: 6969,
        ownerName: 'Mr sus',
        modelColor: null,
        links: null,
      ));
    });
  }

  @override
  void didChangeDependencies() {
    if (useDummy) {
      setupDummyConnections();
    } else {
      searchForBikes();
    }
    super.didChangeDependencies();
  }

  setSelectedBikeIdx(int idx) {
    setState(() {
      selectedBikeIdx = idx;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            BikesView(
              bikes: bikes,
              onBikeSelected: setSelectedBikeIdx,
              selectedBike: selectedBikeIdx,
            ),
            Controls(bikes[selectedBikeIdx]),
          ],
        ),
      ),
    );
  }
}
