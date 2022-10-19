import 'dart:ffi';

import 'package:dart_frog/dart_frog.dart';
import '../../controllers/users.dart';
import '../../models/user.dart';

Future<Response> onRequest(RequestContext context)async {

  await UserOps.createUser({'firstName': 'test1','secondName': 'test2'});
  return Response(body:'done');
}
