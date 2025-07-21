class Experience {
  String? title;
  String? company;
  String? location;
  DateTime? startDate;
  DateTime? endDate;
  String? description;

  Experience({
    this.title,
    this.company,
    this.location,
    this.startDate,
    this.endDate,
    this.description,
  });

  Map<String, dynamic> toJson() => {
        'title': title,
        'company': company,
        'location': location,
        'startDate': startDate?.toIso8601String(),
        'endDate': endDate?.toIso8601String(),
        'description': description,
      };

  factory Experience.fromJson(Map<String, dynamic> json) => Experience(
        title: json['title'],
        company: json['company'],
        location: json['location'],
        startDate: json['startDate'] != null ? DateTime.parse(json['startDate']) : null,
        endDate: json['endDate'] != null ? DateTime.parse(json['endDate']) : null,
        description: json['description'],
      );
}

class Education {
  String? school;
  String? degree;
  String? fieldOfStudy;
  DateTime? startDate;
  DateTime? endDate;

  Education({
    this.school,
    this.degree,
    this.fieldOfStudy,
    this.startDate,
    this.endDate,
  });

  Map<String, dynamic> toJson() => {
        'school': school,
        'degree': degree,
        'fieldOfStudy': fieldOfStudy,
        'startDate': startDate?.toIso8601String(),
        'endDate': endDate?.toIso8601String(),
      };

  factory Education.fromJson(Map<String, dynamic> json) => Education(
        school: json['school'],
        degree: json['degree'],
        fieldOfStudy: json['fieldOfStudy'],
        startDate: json['startDate'] != null ? DateTime.parse(json['startDate']) : null,
        endDate: json['endDate'] != null ? DateTime.parse(json['endDate']) : null,
      );
}

class Skill {
  String? name;

  Skill({this.name});

  Map<String, dynamic> toJson() => {
        'name': name,
      };

  factory Skill.fromJson(Map<String, dynamic> json) => Skill(
        name: json['name'],
      );
}

class Resume {
  String? id;
  String? userId;
  String? name;
  String? email;
  List<Experience>? experience;
  List<Education>? education;
  List<String>? skills;

  Resume({
    this.id,
    this.userId,
    this.name,
    this.email,
    this.experience,
    this.education,
    this.skills,
  });

  Map<String, dynamic> toJson() => {
        '_id': id,
        'userId': userId,
        'name': name,
        'email': email,
        'experience': experience?.map((e) => e.toJson()).toList(),
        'education': education?.map((e) => e.toJson()).toList(),
        'skills': skills,
      };

  factory Resume.fromJson(Map<String, dynamic> json) => Resume(
        id: json['_id'],
        userId: json['userId'],
        name: json['name'],
        email: json['email'],
        experience: (json['experience'] as List<dynamic>?)
            ?.map((e) => Experience.fromJson(e as Map<String, dynamic>))
            .toList(),
        education: (json['education'] as List<dynamic>?)
            ?.map((e) => Education.fromJson(e as Map<String, dynamic>))
            .toList(),
        skills: (json['skills'] as List<dynamic>?)
            ?.map((e) => e as String)
            .toList(),
      );
}
