import 'package:flutter/material.dart';
import 'package:flutter_application_1/models/resume_models.dart';
import 'package:flutter_application_1/pages/resume_preview_page.dart';
import 'package:flutter_application_1/widgets/education_entry.dart';
import 'package:flutter_application_1/widgets/experience_entry.dart';
import 'package:flutter_application_1/widgets/skill_entry.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_application_1/services/auth_service.dart';

class ResumeEditorPage extends StatefulWidget {
  final int userId;
  const ResumeEditorPage({super.key, required this.userId});

  @override
  State<ResumeEditorPage> createState() => _ResumeEditorPageState();
}

class _ResumeEditorPageState extends State<ResumeEditorPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final List<Experience> _experiences = [];
  final List<Education> _educations = [];
  final List<Skill> _skills = [];
  final AuthService _authService = AuthService();

  Resume? _currentResume;

  @override
  void initState() {
    super.initState();
    _fetchResume();
  }

  Future<void> _fetchResume() async {
    if (widget.userId == 0) {
      // Load demo data for DEMO user
      _nameController.text = 'John Doe';
      _emailController.text = 'john.doe@example.com';
      setState(() {
        _experiences.add(Experience(
          title: 'Software Engineer',
          company: 'Tech Solutions Inc.',
          location: 'New York, NY',
          startDate: DateTime(2022, 1, 1),
          endDate: DateTime(2024, 6, 30),
          description: 'Developed and maintained software applications.',
        ));
        _educations.add(Education(
          school: 'University of Example',
          degree: 'Master of Science',
          fieldOfStudy: 'Computer Science',
          startDate: DateTime(2020, 9, 1),
          endDate: DateTime(2022, 5, 31),
        ));
        _skills.add(Skill(name: 'Flutter'));
        _skills.add(Skill(name: 'Dart'));
        _skills.add(Skill(name: 'MongoDB'));
      });
      return;
    }

    final token = await _authService.getToken();
    if (token == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Authentication token not found.')),
      );
      return;
    }

    try {
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/resumes/user/${widget.userId}'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        if (data.isNotEmpty) {
          _currentResume = Resume.fromJson(data[0]); // Assuming one resume per user for now
          _nameController.text = _currentResume!.name ?? '';
          _emailController.text = _currentResume!.email ?? '';
          setState(() {
            _experiences.addAll(_currentResume!.experience ?? []);
            _educations.addAll(_currentResume!.education ?? []);
            _skills.addAll(_currentResume!.skills?.map((s) => Skill(name: s)).toList() ?? []);
          });
        }
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load resume: ${response.body}')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading resume: $e')),
      );
    }
  }

  void _addExperienceEntry() {
    setState(() {
      _experiences.add(Experience());
    });
  }

  void _removeExperienceEntry(int index) {
    setState(() {
      _experiences.removeAt(index);
    });
  }

  void _addEducationEntry() {
    setState(() {
      _educations.add(Education());
    });
  }

  void _removeEducationEntry(int index) {
    setState(() {
      _educations.removeAt(index);
    });
  }

  void _addSkillEntry() {
    setState(() {
      _skills.add(Skill());
    });
  }

  void _removeSkillEntry(int index) {
    setState(() {
      _skills.removeAt(index);
    });
  }

  Future<void> _saveResume() async {
    if (_formKey.currentState!.validate()) {
      final token = await _authService.getToken();
      if (token == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Authentication token not found.')),
        );
        return;
      }

      final resume = Resume(
        userId: widget.userId.toString(),
        name: _nameController.text,
        email: _emailController.text,
        experience: _experiences,
        education: _educations,
        skills: _skills.map((s) => s.name!).toList(),
      );

      try {
        http.Response response;
        if (_currentResume != null) {
          // Update existing resume
          response = await http.patch(
            Uri.parse('http://localhost:5000/api/resumes/${_currentResume!.id}'),
            headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'},
            body: jsonEncode(resume.toJson()),
          );
        } else {
          // Create new resume
          response = await http.post(
            Uri.parse('http://localhost:5000/api/resumes'),
            headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'},
            body: jsonEncode(resume.toJson()),
          );
        }

        if (response.statusCode == 200 || response.statusCode == 201) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Resume saved successfully!')),
          );
          // Refresh the current resume after saving
          _fetchResume();
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Failed to save resume: ${response.body}')),
          );
        }
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error saving resume: $e')),
        );
      }
    }
  }

  Future<void> _deleteResume() async {
    if (_currentResume == null || _currentResume!.id == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('No resume to delete.')),
      );
      return;
    }

    final token = await _authService.getToken();
    if (token == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Authentication token not found.')),
      );
      return;
    }

    try {
      final response = await http.delete(
        Uri.parse('http://localhost:5000/api/resumes/${_currentResume!.id}'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Resume deleted successfully!')),
        );
        if (mounted) {
          Navigator.pop(context); // Go back to previous page
        }
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to delete resume: ${response.body}')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error deleting resume: $e')),
      );
    }
  }

  void _previewResume() {
    final resume = Resume(
      name: _nameController.text,
      email: _emailController.text,
      experience: _experiences,
      education: _educations,
      skills: _skills.map((s) => s.name!).where((s) => s.isNotEmpty).toList(),
    );

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ResumePreviewPage(resume: resume),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Resume Editor'),
        actions: [
          IconButton(
            icon: const Icon(Icons.save),
            onPressed: _saveResume,
          ),
          IconButton(
            icon: const Icon(Icons.remove_red_eye),
            onPressed: _previewResume,
          ),
          IconButton(
            icon: const Icon(Icons.delete),
            onPressed: _deleteResume,
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(labelText: 'Name'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your name';
                  }
                  return null;
                },
              ),
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(labelText: 'Email'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your email';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Experience', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  IconButton(
                    icon: const Icon(Icons.add),
                    onPressed: _addExperienceEntry,
                  ),
                ],
              ),
              ..._experiences.asMap().entries.map((entry) {
                int idx = entry.key;
                Experience exp = entry.value;
                return ExperienceEntry(
                  key: ValueKey(exp),
                  index: idx,
                  onRemove: _removeExperienceEntry,
                  experience: exp,
                );
              }).toList(),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Education', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  IconButton(
                    icon: const Icon(Icons.add),
                    onPressed: _addEducationEntry,
                  ),
                ],
              ),
              ..._educations.asMap().entries.map((entry) {
                int idx = entry.key;
                Education edu = entry.value;
                return EducationEntry(
                  key: ValueKey(edu),
                  index: idx,
                  onRemove: _removeEducationEntry,
                  education: edu,
                );
              }).toList(),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Skills', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  IconButton(
                    icon: const Icon(Icons.add),
                    onPressed: _addSkillEntry,
                  ),
                ],
              ),
              ..._skills.asMap().entries.map((entry) {
                int idx = entry.key;
                Skill skill = entry.value;
                return SkillEntry(
                  key: ValueKey(skill),
                  index: idx,
                  onRemove: _removeSkillEntry,
                  skill: skill,
                );
              }).toList(),
            ],
          ),
        ),
      ),
    );
  }
}