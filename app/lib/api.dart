import 'package:dio/dio.dart';
import 'dart:convert';
import 'package:hive/hive.dart';
import 'bike/bike.dart';
import 'bike/from_json.dart';

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

    return bikes.map((b) => bikeCredentialsFromJson(b)).toList();
  }
}
