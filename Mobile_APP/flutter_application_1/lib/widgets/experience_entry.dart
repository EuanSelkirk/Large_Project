import 'package:flutter/material.dart';
import 'package:flutter_application_1/models/resume_models.dart';

class ExperienceEntry extends StatefulWidget {
  final int index;
  final Function(int) onRemove;
  final Experience experience;

  const ExperienceEntry({
    super.key,
    required this.index,
    required this.onRemove,
    required this.experience,
  });

  @override
  State<ExperienceEntry> createState() => _ExperienceEntryState();
}

class _ExperienceEntryState extends State<ExperienceEntry> {
  late TextEditingController _titleController;
  late TextEditingController _companyController;
  late TextEditingController _locationController;
  late TextEditingController _startDateController;
  late TextEditingController _endDateController;
  late TextEditingController _descriptionController;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(text: widget.experience.title);
    _companyController = TextEditingController(text: widget.experience.company);
    _locationController = TextEditingController(text: widget.experience.location);
    _startDateController = TextEditingController(
        text: widget.experience.startDate?.toIso8601String().substring(0, 10));
    _endDateController = TextEditingController(
        text: widget.experience.endDate?.toIso8601String().substring(0, 10));
    _descriptionController = TextEditingController(text: widget.experience.description);

    _titleController.addListener(() {
      widget.experience.title = _titleController.text;
    });
    _companyController.addListener(() {
      widget.experience.company = _companyController.text;
    });
    _locationController.addListener(() {
      widget.experience.location = _locationController.text;
    });
    _startDateController.addListener(() {
      widget.experience.startDate = DateTime.tryParse(_startDateController.text);
    });
    _endDateController.addListener(() {
      widget.experience.endDate = DateTime.tryParse(_endDateController.text);
    });
    _descriptionController.addListener(() {
      widget.experience.description = _descriptionController.text;
    });
  }

  @override
  void dispose() {
    _titleController.dispose();
    _companyController.dispose();
    _locationController.dispose();
    _startDateController.dispose();
    _endDateController.dispose();
    _descriptionController.dispose();
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
              controller: _titleController,
              decoration: const InputDecoration(labelText: 'Title'),
            ),
            TextFormField(
              controller: _companyController,
              decoration: const InputDecoration(labelText: 'Company'),
            ),
            TextFormField(
              controller: _locationController,
              decoration: const InputDecoration(labelText: 'Location'),
            ),
            TextFormField(
              controller: _startDateController,
              decoration: const InputDecoration(labelText: 'Start Date (YYYY-MM-DD)'),
            ),
            TextFormField(
              controller: _endDateController,
              decoration: const InputDecoration(labelText: 'End Date (YYYY-MM-DD)'),
            ),
            TextFormField(
              controller: _descriptionController,
              decoration: const InputDecoration(labelText: 'Description'),
              maxLines: 3,
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