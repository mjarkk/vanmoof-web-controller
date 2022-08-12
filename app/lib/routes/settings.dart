import 'dart:developer';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:modal_bottom_sheet/modal_bottom_sheet.dart';
import 'package:mooovy/api.dart';
import 'package:provider/provider.dart';
import 'package:mooovy/local_storage.dart';
import 'package:mooovy/bike/models.dart';
import 'package:mooovy/bike/bike.dart';

class Settings extends StatelessWidget {
  const Settings({required this.ios, required this.bike, super.key});

  final bool ios;
  final Bike bike;

  PreferredSizeWidget buildAppBar(BuildContext context) => ios
      ? CupertinoNavigationBar(
          backgroundColor: CupertinoTheme.of(context).scaffoldBackgroundColor,
          leading: Container(),
          middle: const Text('Settings'),
          trailing: _CloseButton(onPressed: () => Navigator.pop(context)),
        ) as PreferredSizeWidget
      : AppBar(
          title: const Text('Settings'),
        );

  logout(context) async {
    removeApiTokens();
    final navigator = Navigator.of(context);
    while (true) {
      final popped = await navigator.maybePop();
      if (!popped) {
        break;
      }
    }
    navigator.popAndPushNamed('/login');
  }

  @override
  Widget build(BuildContext context) {
    return CupertinoScaffold(
      overlayStyle: SystemUiOverlayStyle.dark,
      body: Scaffold(
        appBar: buildAppBar(context),
        body: ListenToBikeState(
          bike: bike,
          child: SafeArea(
            child: Column(
              children: [
                _Section(
                  title: 'Bike',
                  children: [
                    BellSoundControl(bike),
                    LightStateControl(bike),
                  ],
                ),
                _Section(
                  title: 'Share bike',
                  children: [
                    ShareBikeControl(bike),
                  ],
                ),
                _Section(
                  title: 'Account',
                  children: [
                    ElevatedButton(
                        onPressed: () => logout(context),
                        child: const Text('Logout')),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class ShareSettings extends StatelessWidget {
  const ShareSettings({required this.bike, super.key});
  final Bike bike;

  @override
  Widget build(BuildContext context) {
    return CupertinoScaffold(
      overlayStyle: SystemUiOverlayStyle.dark,
      body: Scaffold(
        appBar: CupertinoNavigationBar(
          backgroundColor: CupertinoTheme.of(context).scaffoldBackgroundColor,
          leading: Container(),
          middle: const Text('Manage sharing'),
          trailing: _CloseButton(onPressed: () => Navigator.pop(context)),
        ),
        body: SafeArea(
          child: Column(
            children: [
              _Section(
                title: 'Share ${bike.name}',
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Form(
                        child: TextFormField(
                          decoration: const InputDecoration(
                            labelText: 'Email',
                          ),
                          onChanged: (value) {
                            log(value);
                          },
                        ),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          log('Share bike pressed');
                        },
                        child: const Text('Share'),
                      ),
                    ],
                  ),
                ],
              ),
              _Section(
                title: 'Manage share holders',
                children: [
                  Row(
                    children: [
                      const Expanded(
                        child: Text('Share holder 1'),
                      ),
                      const Text("1 day"),
                      IconButton(
                        icon: const Icon(Icons.close),
                        onPressed: () async {
                          var api = obtainApiClient();
                          var list = await api?.getCurrentShares(bike.id);
                          log(list[0]["email"].toString());

                          log('Removed share holder 1');
                        },
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      const Expanded(
                        child: Text('Share holder 2'),
                      ),
                      const Text("Forever"),
                      IconButton(
                        icon: const Icon(Icons.close),
                        onPressed: () {
                          log('Removed share holder 2');
                        },
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      const Expanded(
                        child: Text('Share holder 3'),
                      ),
                      const Text("1 week"),
                      IconButton(
                        icon: const Icon(Icons.close),
                        onPressed: () {
                          log('Removed share holder 3');
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class BellSoundControl extends StatelessWidget {
  const BellSoundControl(this.bike, {super.key});

  final Bike bike;

  mightSetNewBellSound(BellSound? value) {
    if (value != null) bike.connection?.setBellSound(value);
  }

  @override
  Widget build(BuildContext context) {
    final bikeBell = context.watch<BikeBellState>();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.all(6),
          child: Text(
            'Bell sound',
            style: TextStyle(fontSize: 16),
          ),
        ),
        CupertinoSlidingSegmentedControl(
          onValueChanged: mightSetNewBellSound,
          groupValue: bikeBell.bellSound,
          children: bellSoundsToString.map((key, value) => MapEntry(
                key,
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(right: 4),
                      child: Icon(
                        bellIcon(key),
                        size: 18,
                      ),
                    ),
                    Text(value)
                  ],
                ),
              )),
        ),
      ],
    );
  }
}

class ShareBikeControl extends StatelessWidget {
  const ShareBikeControl(this.bike, {super.key});

  final Bike bike;

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () => showModalBottomSheet(
        context: context,
        builder: (context) => ShareSettings(bike: bike),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: const [
          Icon(Icons.share),
          SizedBox(width: 5),
          Text('Manage sharing'),
        ],
      ),
    );
  }
}

class LightStateControl extends StatelessWidget {
  const LightStateControl(this.bike, {super.key});

  final Bike bike;

  mightSetNewLightState(LightState? value) {
    if (value != null) bike.connection?.setLightState(value);
  }

  @override
  Widget build(BuildContext context) {
    final lightState = context.watch<BikeLightState>();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.all(6),
          child: Text(
            'Light control',
            style: TextStyle(fontSize: 16),
          ),
        ),
        CupertinoSlidingSegmentedControl(
          onValueChanged: mightSetNewLightState,
          groupValue: lightState.lightState,
          children: lightStatesToString.map((key, value) => MapEntry(
                key,
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(right: 4),
                      child: Icon(
                        lightIcon(key),
                        size: 18,
                      ),
                    ),
                    Text(value)
                  ],
                ),
              )),
        ),
      ],
    );
  }
}

class _CloseButton extends StatelessWidget {
  const _CloseButton({required this.onPressed, super.key});

  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onPressed,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          color: Colors.black12,
        ),
        padding: const EdgeInsets.all(2),
        child: const Icon(Icons.close_rounded, size: 22),
      ),
    );
  }
}

class _Section extends StatelessWidget {
  const _Section({required this.title, required this.children, super.key});

  final String title;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                title,
                style: Theme.of(context).textTheme.headline6,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Container(
                  height: 1,
                  color: Colors.black26,
                  width: double.infinity,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: children,
          ),
        ],
      ),
    );
  }
}
