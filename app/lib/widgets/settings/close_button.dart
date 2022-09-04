import 'package:flutter/material.dart';

class SettingsCloseButton extends StatelessWidget {
  const SettingsCloseButton({required this.onPressed, super.key});

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
