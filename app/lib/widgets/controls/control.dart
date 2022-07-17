import 'package:flutter/material.dart';

class DraggableControl extends StatefulWidget {
  const DraggableControl({
    required this.label,
    required this.labelIcon,
    required this.valueLabelForIndex,
    required this.levels,
    required this.selectedLevel,
    this.onSelectLevel,
    this.onTap,
    this.onDoubleTap,
    this.disabled,
    super.key,
  });

  final String label; // TODO implement me
  final IconData labelIcon; // TODO implement me
  final Function(int idx) valueLabelForIndex;
  final int levels;
  final int selectedLevel;
  final Function(int level)? onSelectLevel;
  final Function()? onTap;
  final Function()? onDoubleTap;
  final bool? disabled; // TODO implement me

  @override
  State<DraggableControl> createState() => _DraggableControlState();
}

class _DraggableControlState extends State<DraggableControl> {
  double? dragStartY;
  int? dragingNewLevel;

  dragUpdate(
      DragUpdateDetails detials, double totalHeight, double sectionHeight) {
    double localPositionY = detials.localPosition.dy;
    if (dragStartY == null) return;
    final diff = dragStartY! - localPositionY;
    const minDiff = 30;
    if (diff < minDiff && diff > -minDiff && dragingNewLevel == null) return;

    if (localPositionY < 0) localPositionY = 0;
    if (localPositionY > totalHeight) localPositionY = totalHeight;

    localPositionY = totalHeight - localPositionY;
    int newLevel = (localPositionY / sectionHeight).floor();
    if (newLevel == widget.levels) newLevel--;

    setState(() {
      dragingNewLevel = newLevel;
    });
  }

  dragEnd() {
    if (dragingNewLevel != null) {
      if (widget.onSelectLevel != null) widget.onSelectLevel!(dragingNewLevel!);
      dragingNewLevel = null;
      if (widget.onSelectLevel == null) setState(() {});
    }
    dragStartY = null;
  }

  @override
  Widget build(BuildContext context) {
    final List<Widget> options = [];

    final highLightFromIdx =
        widget.levels - (dragingNewLevel ?? widget.selectedLevel) - 1;

    for (var i = 0; i < widget.levels; i++) {
      if (i != 0) options.add(Container(height: 1, color: Colors.black38));
      options.add(Expanded(
        key: Key(i.toString()),
        child: Container(
          color: i < highLightFromIdx ? Colors.transparent : Colors.yellow,
          padding: const EdgeInsets.symmetric(horizontal: 10),
          child: i != highLightFromIdx
              ? null
              : Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    widget.valueLabelForIndex(i),
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.black45,
                    ),
                  ),
                ),
        ),
      ));
    }

    return Padding(
      padding: const EdgeInsets.all(8),
      child: LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
          final double height = constraints.maxHeight;
          final double sectionHeight = height / widget.levels;

          return GestureDetector(
            onTap: widget.onTap,
            onDoubleTap: widget.onDoubleTap,
            onVerticalDragStart: (start) => dragStartY = start.localPosition.dy,
            onVerticalDragUpdate: (v) => dragUpdate(v, height, sectionHeight),
            onVerticalDragEnd: (_) => dragEnd(),
            onVerticalDragCancel: dragEnd,
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                color: Colors.yellow.shade100,
              ),
              clipBehavior: Clip.antiAlias,
              child: Column(children: options),
            ),
          );
        },
      ),
    );
  }
}

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
