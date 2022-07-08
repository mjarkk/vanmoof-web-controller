import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:modal_bottom_sheet/modal_bottom_sheet.dart';

class Settings extends StatelessWidget {
  const Settings({this.ios, super.key});

  final bool? ios;

  @override
  Widget build(BuildContext context) {
    return CupertinoScaffold(
      overlayStyle: SystemUiOverlayStyle.dark,
      body: Scaffold(
        appBar: ios == true
            ? CupertinoNavigationBar(
                backgroundColor:
                    CupertinoTheme.of(context).scaffoldBackgroundColor,
                leading: Container(),
                middle: const Text('Settings'),
                trailing: _CloseButton(onPressed: () => Navigator.pop(context)),
              ) as PreferredSizeWidget
            : AppBar(
                title: const Text('Settings'),
              ),
        body: const SafeArea(
          child: Text('sus'),
        ),
      ),
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
