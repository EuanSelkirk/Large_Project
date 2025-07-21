import 'package:flutter/material.dart';
import 'package:flutter_application_1/models/resume_models.dart';

class EducationEntry extends StatefulWidget {
  final int index;
  final Function(int) onRemove;
  final Education education;

  const EducationEntry({
    super.key,
    required this.index,
    required this.onRemove,
    required this.education,
  });

  @override
  State<EducationEntry> createState() => _EducationEntryState();
}

class _EducationEntryState extends State<EducationEntry> {
  late TextEditingController _schoolController;
  late TextEditingController _degreeController;
  late TextEditingController _fieldOfStudyController;
  late TextEditingController _startDateController;
  late TextEditingController _endDateController;

  @override
  void initState() {
    super.initState();
    _schoolController = TextEditingController(text: widget.education.school);
    _degreeController = TextEditingController(text: widget.education.degree);
    _fieldOfStudyController = TextEditingController(text: widget.education.fieldOfStudy);
    _startDateController = TextEditingController(
        text: widget.education.startDate?.toIso8601String().substring(0, 10));
    _endDateController = TextEditingController(
        text: widget.education.endDate?.toIso8601String().substring(0, 10));

    _schoolController.addListener(() {
      widget.education.school = _schoolController.text;
    });
    _degreeController.addListener(() {
      widget.education.degree = _degreeController.text;
    });
    _fieldOfStudyController.addListener(() {
      widget.education.fieldOfStudy = _fieldOfStudyController.text;
    });
    _startDateController.addListener(() {
      widget.education.startDate = DateTime.tryParse(_startDateController.text);
    });
    _endDateController.addListener(() {
      widget.education.endDate = DateTime.tryParse(_endDateController.text);
    });
  }

  @override
  void dispose() {
    _schoolController.dispose();
    _degreeController.dispose();
    _fieldOfStudyController.dispose();
    _startDateController.dispose();
    _endDateController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8.0),
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          children: [
            TextFormField(
              controller: _schoolController,
              decoration: const InputDecoration(labelText: 'School'),
            ),
            TextFormField(
              controller: _degreeController,
              decoration: const InputDecoration(labelText: 'Degree'),
            ),
            TextFormField(
              controller: _fieldOfStudyController,
              decoration: const InputDecoration(labelText: 'Field of Study'),
            ),
            TextFormField(
              controller: _startDateController,
              decoration: const InputDecoration(labelText: 'Start Date (YYYY-MM-DD)'),
            ),
            TextFormField(
              controller: _endDateController,
              decoration: const InputDecoration(labelText: 'End Date (YYYY-MM-DD)'),
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