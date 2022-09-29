import 'package:flutter/material.dart';

class ControlButtonLabel extends StatelessWidget {
  const ControlButtonLabel(this.icon, [this.label]);

  final IconData icon;
  final String? label;

  @override
  Widget build(BuildContext context) {
    return Row(
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
    );
  }
}

class DraggableControl extends StatefulWidget {
  const DraggableControl({
    required this.valueLabelForIndex,
    this.label,
    required this.levels,
    required this.selectedLevel,
    this.onSelectLevel,
    this.onTap,
    this.onDoubleTap,
    this.disabled,
    super.key,
  });

  final Function(int idx) valueLabelForIndex;
  final Widget? label;
  final int levels;
  final int selectedLevel;
  final Function(int idx)? onSelectLevel;
  final Function()? onTap;
  final Function()? onDoubleTap;
  final bool? disabled;

  @override
  State<DraggableControl> createState() => _DraggableControlState();
}

class _DraggableControlState extends State<DraggableControl> {
  double? dragStartY;
  int? dragingNewLevel;

  get disabled => widget.disabled ?? false;

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

  Widget selectorWidgetBuilder(
      BuildContext context, BoxConstraints constraints) {
    final List<Widget> options = [];

    final highLightFromIdx =
        widget.levels - (dragingNewLevel ?? widget.selectedLevel) - 1;

    for (var i = 0; i < widget.levels; i++) {
      if (i != 0) options.add(Container(height: 1, color: Colors.black38));

      options.add(
        Expanded(
          key: Key(i.toString()),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 50),
            color: disabled
                ? Colors.transparent
                : Colors.yellow.withAlpha(i < highLightFromIdx ? 0 : 255),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            child: FittedBox(
              fit: BoxFit.contain,
              alignment: Alignment.centerLeft,
              child: Text(
                widget.valueLabelForIndex(widget.levels - i - 1),
                textAlign: TextAlign.left,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: i == highLightFromIdx && !disabled
                      ? Colors.black87
                      : Colors.black12,
                ),
              ),
            ),
          ),
        ),
      );
    }

    final double height = constraints.maxHeight;
    final double sectionHeight = height / widget.levels;

    final visableContent = Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        color: Colors.yellow.shade100,
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: options,
      ),
    );

    if (widget.disabled == true) return visableContent;

    return GestureDetector(
      onTap: widget.onTap,
      onDoubleTap: widget.onDoubleTap,
      onVerticalDragStart: (start) => dragStartY = start.localPosition.dy,
      onVerticalDragUpdate: (v) => dragUpdate(v, height, sectionHeight),
      onVerticalDragEnd: (_) => dragEnd(),
      onVerticalDragCancel: dragEnd,
      child: visableContent,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8),
      child: Column(children: [
        Expanded(child: LayoutBuilder(builder: selectorWidgetBuilder)),
        if (widget.label != null)
          Padding(
            padding: const EdgeInsets.only(top: 10),
            child: widget.label!,
          ),
      ]),
    );
  }
}

class Control extends StatelessWidget {
  const Control({
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
            color: disabled == true ? Colors.yellow.shade100 : Colors.yellow,
          ),
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              Text(
                value,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 50,
                  color: disabled == true ? Colors.black45 : Colors.black,
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(right: 3),
                    child: Icon(icon,
                        size: 17,
                        color:
                            disabled == true ? Colors.black45 : Colors.black54),
                  ),
                  if (label != null)
                    Text(
                      label!,
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 17,
                        color:
                            disabled == true ? Colors.black45 : Colors.black54,
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
