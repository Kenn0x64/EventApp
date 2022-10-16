import 'package:dart_frog/dart_frog.dart';
import 'package:mongo_dart/mongo_dart.dart';
// import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../models/connection.dart';

Response onRequest(RequestContext context) {
  final db = Database('');
  db.createConn();

  return Response(body: 'test');
}
