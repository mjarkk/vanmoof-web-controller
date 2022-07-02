import 'package:flutter/material.dart';

class Control extends StatelessWidget {
  const Control({
    required this.icon,
    required this.onPressed,
    required this.value,
    this.label,
    this.disabled,
    Key? key,
  }) : super(key: key);

  final Function() onPressed;
  final String? label;
  final String value;
  final IconData icon;
  final bool? disabled;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8),
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          elevation: 0,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        ),
        onPressed: disabled == true ? null : onPressed,
        child: Padding(
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
