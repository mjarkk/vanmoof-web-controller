import 'package:mooovy/bike/bike.dart';

Bike bikeCredentialsFromJson(Map<String, dynamic> json) {
  return Bike(
    id: json['id'],
    macAddress: json['macAddress'],
    encryptionKey: json['key']['encryptionKey'],
    userKeyId: json['key']['userKeyId'],
    name: json['name'],
    ownerName: json['ownerName'],
    modelColor: json['modelColor'] == null
        ? null
        : _bikeColorFromJson(json['modelColor']),
    links: json['links'] == null ? null : _bikeLinksFromJson(json['links']),
  );
}

BikeColor _bikeColorFromJson(Map<String, dynamic> json) {
  return BikeColor(
    name: json['name'],
    primary: json['primary'],
    secondary: json['secondary'],
  );
}

BikeLinks _bikeLinksFromJson(Map<String, dynamic> json) {
  return BikeLinks(
    hash: json['hash'],
    thumbnail: json['thumbnail'],
  );
}
