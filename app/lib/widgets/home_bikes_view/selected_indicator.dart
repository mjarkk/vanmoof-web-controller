import 'package:flutter/material.dart';

class SelectedBikeIndicator extends StatelessWidget {
  const SelectedBikeIndicator({
    required this.total,
    required this.selected,
    Key? key,
  }) : super(key: key);

  final int total;
  final int selected;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(total, (index) => index)
          .map((idx) => Padding(
                key: Key('indicator-$idx'),
                padding: const EdgeInsets.all(3),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 100),
                  height: 11,
                  width: 11,
                  decoration: BoxDecoration(
                    color: idx == selected ? Colors.black26 : Colors.black12,
                    shape: BoxShape.circle,
                  ),
                ),
              ))
          .toList(),
    );
  }
}
