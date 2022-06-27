import 'package:hive/hive.dart';

part 'bike.g.dart';

@HiveType(typeId: 1)
class Bike {
  Bike({
    required this.id,
    required this.macAddress,
    required this.encryptionKey,
    required this.userKeyId,
    required this.name,
    required this.ownerName,
    this.modelColor,
    this.links,
  });

  @HiveField(0)
  final int id;
  @HiveField(1)
  final String macAddress;
  @HiveField(2)
  final String encryptionKey;
  @HiveField(3)
  final int userKeyId;
  @HiveField(4)
  final String name;
  @HiveField(5)
  final String ownerName;
  @HiveField(6)
  final BikeColor? modelColor;
  @HiveField(7)
  final BikeLinks? links;

  BikeConnection? connection;

  List<String> get bluetoothName {
    final bleNameSuffix = macAddress.replaceAll(':', '');
    return [
      "ES3-$bleNameSuffix",
      "EX3-$bleNameSuffix",
    ];
  }
}

@HiveType(typeId: 3)
class BikeLinks {
  const BikeLinks({
    required this.hash,
    required this.thumbnail,
  });

  @HiveField(0)
  final String hash;
  @HiveField(1)
  final String thumbnail;
}

@HiveType(typeId: 2)
class BikeColor {
  const BikeColor({
    required this.name,
    required this.primary,
    required this.secondary,
  });

  @HiveField(0)
  final String name;
  @HiveField(1)
  final String primary;
  @HiveField(2)
  final String secondary;
}

abstract class BikeConnection {}
