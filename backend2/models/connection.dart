import 'package:mongo_dart/mongo_dart.dart';

class Database {
  Database(this.uriString);
  String uriString;

  Future<void> createConn() async {
    final db = Db(uriString);
    await db.open();
  }
}
