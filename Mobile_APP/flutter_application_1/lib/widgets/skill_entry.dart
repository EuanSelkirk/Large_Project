import 'package:flutter/material.dart';
import 'package:flutter_application_1/models/resume_models.dart';

class SkillEntry extends StatefulWidget {
  final int index;
  final Function(int) onRemove;
  final Skill skill;

  const SkillEntry({
    super.key,
    required this.index,
    required this.onRemove,
    required this.skill,
  });

  @override
  State<SkillEntry> createState() => _SkillEntryState();
}

class _SkillEntryState extends State<SkillEntry> {
  late TextEditingController _skillNameController;

  @override
  void initState() {
    super.initState();
    _skillNameController = TextEditingController(text: widget.skill.name);

    _skillNameController.addListener(() {
      widget.skill.name = _skillNameController.text;
    });
  }

  @override
  void dispose() {
    _skillNameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8.0),
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Row(
          children: [
            Expanded(
              child: TextFormField(
                controller: _skillNameController,
                decoration: const InputDecoration(labelText: 'Skill'),
              ),
            ),
            IconButton(
              icon: const Icon(Icons.remove_circle),
              onPressed: () => widget.onRemove(widget.index),
            ),
          ],
        ),
      ),
    );
  }
}