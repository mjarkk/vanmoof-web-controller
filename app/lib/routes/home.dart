import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:modal_bottom_sheet/modal_bottom_sheet.dart';
import 'package:mooovy/bike/bike.dart';
import 'package:mooovy/bike/real.dart';
import 'package:mooovy/bike/dummy.dart';
import 'package:mooovy/bike/models.dart';
import 'package:mooovy/local_storage.dart';
import 'package:mooovy/widgets/controls/controls.dart';
import 'package:mooovy/widgets/home_bikes_view/bikes_view.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  _HomeState() : bikes = obtainBikes();

  final List<Bike> bikes;
  int selectedBikeIdx = 0;
  bool useDummy = kDebugMode;

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
        bike.connection = DummyBikeConnection(bike);
      }
      bikes.add(Bike(
        id: 69420,
        name: 'Susy bike',
        macAddress: '69:69:69:69:69:69',
        encryptionKey: '69696969696969696969696969696969',
        userKeyId: 6969,
        ownerName: 'Mr sus',
        modelColor: null,
        links: const BikeLinks(
          hash: "http://my.vanmoof.com/v8/getBikeDataHash/69420",
          thumbnail: "https://my.vanmoof.com/image/model/14",
        ),
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
    final Bike selectedBike = bikes[selectedBikeIdx];

    return CupertinoScaffold(
      overlayStyle: SystemUiOverlayStyle.dark,
      body: Scaffold(
        body: SafeArea(
          child: ListenToBikeState(
            bike: selectedBike,
            child: Column(
              children: [
                BikesView(
                  bikes: bikes,
                  onBikeSelected: setSelectedBikeIdx,
                  selectedBike: selectedBikeIdx,
                ),
                Controls(selectedBike),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
