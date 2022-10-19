import 'package:dotenv/dotenv.dart';
import 'package:mongo_dart/mongo_dart.dart';


class Database {
  static late Db? _db;
  
  static Future<DbCollection> connect(String collectionName) async {
    final env = DotEnv(includePlatformEnvironment: true)..load();
    _db = await Db.create(env['DB_URI']!);
    await _db!.open();
    return  _db!.collection(collectionName);
  }

  void closeConnection() {
    _db!.close();
  }
}
