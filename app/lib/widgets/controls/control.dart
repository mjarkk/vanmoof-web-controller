import 'package:flutter/material.dart';

class Control extends StatelessWidget {
  Control({
    required this.icon,
    required this.onPressed,
    this.onLongPress,
    this.onDoubleTap,
    required this.value,
    this.label,
    this.disabled,
    super.key,
  });

  final Function() onPressed;
  final Function()? onLongPress;
  final Function()? onDoubleTap;
  final String? label;
  final String value;
  final IconData icon;
  final bool? disabled;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8),
      child: GestureDetector(
        onTap: disabled == true ? null : onPressed,
        onDoubleTap: disabled == true ? null : onDoubleTap,
        onLongPress: disabled == true ? null : onLongPress,
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            color: Colors.yellow,
          ),
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              Text(
                value,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 50,
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(right: 3),
                    child: Icon(icon, size: 17, color: Colors.black54),
                  ),
                  if (label != null)
                    Text(
                      label!,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 17,
                        color: Colors.black54,
                      ),
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
