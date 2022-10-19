import 'package:dart_frog/dart_frog.dart';


Future<Response> onRequest(RequestContext context) async {
 
  // await userCollection.insert({'name': 'jack'});

  return Response(body: 'test');
}
