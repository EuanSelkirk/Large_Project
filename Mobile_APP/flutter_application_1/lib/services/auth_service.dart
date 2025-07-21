import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthService {
  final _storage = const FlutterSecureStorage();

  static const _keyToken = 'token';
  static const _keyUserId = 'userId';
  static const _keyFirstName = 'firstName';
  static const _keyLastName = 'lastName';

  Future<void> saveUserData(String token, String userId, String firstName, String lastName) async {
    await _storage.write(key: _keyToken, value: token);
    await _storage.write(key: _keyUserId, value: userId);
    await _storage.write(key: _keyFirstName, value: firstName);
    await _storage.write(key: _keyLastName, value: lastName);
  }

  Future<String?> getToken() async {
    return await _storage.read(key: _keyToken);
  }

  Future<String?> getUserId() async {
    return await _storage.read(key: _keyUserId);
  }

  Future<String?> getFirstName() async {
    return await _storage.read(key: _keyFirstName);
  }

  Future<String?> getLastName() async {
    return await _storage.read(key: _keyLastName);
  }

  Future<void> deleteUserData() async {
    await _storage.delete(key: _keyToken);
    await _storage.delete(key: _keyUserId);
    await _storage.delete(key: _keyFirstName);
    await _storage.delete(key: _keyLastName);
  }
}
