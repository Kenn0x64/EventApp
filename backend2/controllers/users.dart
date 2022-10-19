import '../database/connection.dart';
import '../models/user.dart';

class UserOps {
  static Future<void> createUser(Map<String,dynamic> user) async {
    final userCollection = await Database.connect('users');
    await userCollection.insert(user);
  }

  static void deleteUser() {}
  static  Future<void> viewUser(Map<String,dynamic> ) async {
    final userCollection = await Database.connect('users');
    await userCollection.insert(user);
  }
  static void updateUser() {}
}
