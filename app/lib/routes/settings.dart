import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:modal_bottom_sheet/modal_bottom_sheet.dart';
import 'package:provider/provider.dart';
import 'package:mooovy/local_storage.dart';
import 'package:mooovy/bike/models.dart';
import 'package:mooovy/bike/bike.dart';
import 'package:mooovy/widgets/settings/share_settings.dart';
import 'package:mooovy/widgets/settings/section.dart';
import 'package:mooovy/widgets/settings/close_button.dart';

class Settings extends StatelessWidget {
  const Settings({required this.ios, required this.bike, super.key});

  final bool ios;
  final Bike bike;

  PreferredSizeWidget buildAppBar(BuildContext context) => ios
      ? CupertinoNavigationBar(
          backgroundColor: CupertinoTheme.of(context).scaffoldBackgroundColor,
          leading: Container(),
          middle: const Text('Settings'),
          trailing:
              SettingsCloseButton(onPressed: () => Navigator.pop(context)),
        ) as PreferredSizeWidget
      : AppBar(
          title: const Text('Settings'),
        );

  @override
  Widget build(BuildContext context) {
    return CupertinoScaffold(
      overlayStyle: SystemUiOverlayStyle.dark,
      body: Scaffold(
        appBar: buildAppBar(context),
        body: bike.injectState(SafeArea(
          child: Column(
            children: [
              Section(
                title: 'Bike',
                children: [
                  BellSoundControl(bike),
                  LightStateControl(bike),
                  AlarmControl(bike),
                ],
              ),
              Section(
                title: 'Share bike',
                children: [ShareBikeControl(bike)],
              ),
              const Section(
                title: 'Account',
                children: [LogoutButton()],
              ),
            ],
          ),
        )),
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
        SizedBox(
          width: double.infinity,
          child: CupertinoSlidingSegmentedControl(
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
        SizedBox(
          width: double.infinity,
          child: CupertinoSlidingSegmentedControl(
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
        ),
      ],
    );
  }
}

class AlarmOption extends StatelessWidget {
  const AlarmOption(this.icon, this.text, {super.key});

  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Padding(
          padding: const EdgeInsets.only(right: 4),
          child: Icon(icon, size: 18),
        ),
        Text(text)
      ],
    );
  }
}

class AlarmControl extends StatelessWidget {
  const AlarmControl(this.bike, {super.key});

  final Bike bike;

  mightSetNewAlarmState(bool? value) {
    if (value != null) bike.connection?.setAlarmState(value);
  }

  final options = const <bool, AlarmOption>{
    false: AlarmOption(Icons.alarm_off, 'Off'),
    true: AlarmOption(Icons.alarm_on, 'On'),
  };

  @override
  Widget build(BuildContext context) {
    final alarmState = context.watch<BikeAlarmState>();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.all(6),
          child: Text(
            'Alarm',
            style: TextStyle(fontSize: 16),
          ),
        ),
        SizedBox(
          width: double.infinity,
          child: CupertinoSlidingSegmentedControl(
            onValueChanged: mightSetNewAlarmState,
            groupValue: alarmState.alarm,
            children: options.map((key, value) => MapEntry(key, value)),
          ),
        ),
      ],
    );
  }
}

class LogoutButton extends StatelessWidget {
  const LogoutButton({super.key});

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
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: () => logout(context),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            Icon(
              Icons.logout,
              size: 18,
            ),
            SizedBox(width: 5),
            Text('Logout'),
          ],
        ),
      ),
    );
  }
}
