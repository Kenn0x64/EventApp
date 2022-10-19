import 'dart:ffi';

class Event {

  UnsignedLongLong eventID=const UnsignedLongLong();
  String? evenName;
  String? evenOwner;
  DateTime? startDate;
  DateTime? endDate;
  List<String>? eventMembers;
  List<String>? invitedMembers;
  UnsignedLongLong userID=const UnsignedLongLong();

}
