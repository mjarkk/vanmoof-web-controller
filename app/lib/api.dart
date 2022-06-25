import 'package:dio/dio.dart';
import 'dart:convert';
import 'package:hive/hive.dart';

part 'api.g.dart';

const String _apiKey = 'fcb38d47-f14b-30cf-843b-26283f6a5819';

Future<ApiClient> authenticate(String email, String password) async {
  final basicAuth = base64.encode(utf8.encode('$email:$password'));

  final Response<dynamic> resp;
  try {
    final client = Dio(BaseOptions(
      headers: {
        'Api-Key': _apiKey,
        'Authorization': 'Basic $basicAuth',
      },
      responseType: ResponseType.json,
      receiveDataWhenStatusError: true,
    ));
    resp = await client.get('https://my.vanmoof.com/api/v8/authenticate');
  } catch (e) {
    if (e is DioError && e.response != null) {
      throw 'Authentication failed, error: ${e.response!.data.toString()}';
    }
    throw 'Authentication failed';
  }

  return ApiClient(
    token: resp.data['token'],
    refreshToken: resp.data['refreshToken'],
  );
}

class ApiClient {
  const ApiClient({
    required this.token,
    required this.refreshToken,
  });

  final String token;
  final String refreshToken;

  getBikes() async {
    final Response<dynamic> resp;
    try {
      final client = Dio(BaseOptions(
        headers: {
          'Api-Key': _apiKey,
          'Authorization': 'Bearer $token',
        },
        responseType: ResponseType.json,
        receiveDataWhenStatusError: true,
      ));
      resp = await client.get(
          'https://my.vanmoof.com/api/v8/getCustomerData?includeBikeDetails');
    } catch (e) {
      if (e is DioError && e.response != null) {
        throw 'Unable to obtain bikes, error: ${e.response!.data.toString()}';
      }
      throw 'Unable to obtain bikes';
    }

    final List<dynamic> bikes = resp.data['data']['bikeDetails'];
    if (bikes.isEmpty) throw 'You have no bikes connected to your account';

    return bikes.map((b) => _bikeCredentialsFromJson(b)).toList();
  }
}

BikeCredentials _bikeCredentialsFromJson(Map<String, dynamic> json) {
  return BikeCredentials(
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

@HiveType(typeId: 1)
class BikeCredentials {
  const BikeCredentials({
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
}

BikeColor _bikeColorFromJson(Map<String, dynamic> json) {
  return BikeColor(
    name: json['name'],
    primary: json['primary'],
    secondary: json['secondary'],
  );
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

BikeLinks _bikeLinksFromJson(Map<String, dynamic> json) {
  return BikeLinks(
    hash: json['hash'],
    thumbnail: json['thumbnail'],
  );
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
