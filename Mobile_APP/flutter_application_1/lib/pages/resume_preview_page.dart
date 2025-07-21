import 'package:flutter/material.dart';
import 'package:flutter_application_1/models/resume_models.dart';
import 'package:url_launcher/url_launcher.dart';

class ResumePreviewPage extends StatelessWidget {
  final Resume resume;

  const ResumePreviewPage({super.key, required this.resume});

  String _generateResumeText() {
    final StringBuffer buffer = StringBuffer();

    buffer.writeln('Name: ${resume.name ?? ''}');
    buffer.writeln('Email: ${resume.email ?? ''}');
    buffer.writeln('');

    if (resume.experience != null && resume.experience!.isNotEmpty) {
      buffer.writeln('Experience:');
      for (var exp in resume.experience!) {
        buffer.writeln('  Title: ${exp.title ?? ''}');
        buffer.writeln('  Company: ${exp.company ?? ''}');
        buffer.writeln('  Location: ${exp.location ?? ''}');
        buffer.writeln('  Start Date: ${exp.startDate?.toLocal().toString().split(' ')[0] ?? ''}');
        buffer.writeln('  End Date: ${exp.endDate?.toLocal().toString().split(' ')[0] ?? 'Present'}');
        buffer.writeln('  Description: ${exp.description ?? ''}');
        buffer.writeln('');
      }
    }

    if (resume.education != null && resume.education!.isNotEmpty) {
      buffer.writeln('Education:');
      for (var edu in resume.education!) {
        buffer.writeln('  School: ${edu.school ?? ''}');
        buffer.writeln('  Degree: ${edu.degree ?? ''}');
        buffer.writeln('  Field of Study: ${edu.fieldOfStudy ?? ''}');
        buffer.writeln('  Start Date: ${edu.startDate?.toLocal().toString().split(' ')[0] ?? ''}');
        buffer.writeln('  End Date: ${edu.endDate?.toLocal().toString().split(' ')[0] ?? 'Present'}');
        buffer.writeln('');
      }
    }

    if (resume.skills != null && resume.skills!.isNotEmpty) {
      buffer.writeln('Skills:');
      buffer.writeln('  ${resume.skills!.join(', ')}');
    }

    return buffer.toString();
  }

  Future<void> _sendEmail() async {
    final String emailSubject = 'Resume for ${resume.name ?? ''}';
    final String emailBody = _generateResumeText();

    final Uri emailLaunchUri = Uri(
      scheme: 'mailto',
      path: '',
      query: _encodeQueryParameters(<String, String>{
        'subject': emailSubject,
        'body': emailBody,
      }),
    );

    if (await canLaunchUrl(emailLaunchUri)) {
      await launchUrl(emailLaunchUri);
    } else {
      // Fallback for platforms that don't support mailto or if no email client is configured
      // You might want to show a dialog here with the resume text to copy
      print('Could not launch email client.');
    }
  }

  String? _encodeQueryParameters(Map<String, String> params) {
    return params.entries
        .map((e) => '${Uri.encodeComponent(e.key)}=${Uri.encodeComponent(e.value)}')
        .join('&');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Resume Preview'),
        actions: [
          IconButton(
            icon: const Icon(Icons.email),
            onPressed: _sendEmail,
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Text(_generateResumeText()),
        ),
      ),
    );
  }
}
