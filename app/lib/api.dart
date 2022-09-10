import 'package:dio/dio.dart';
import 'dart:convert';
import 'package:mooovy/bike/from_json.dart';

const String _apiKey = 'fcb38d47-f14b-30cf-843b-26283f6a5819';

Future<ApiClient> authenticate(String email, String password) async {
  try {
    final basicAuth = base64.encode(utf8.encode('$email:$password'));
    final Response<dynamic> resp;

    final client = Dio(BaseOptions(
      headers: {
        'Api-Key': _apiKey,
        'Authorization': 'Basic $basicAuth',
      },
      responseType: ResponseType.json,
      receiveDataWhenStatusError: true,
    ));
    resp = await client.get('https://api.vanmoof-api.com/v8/authenticate');

    return ApiClient(
      token: resp.data['token'],
      refreshToken: resp.data['refreshToken'],
    );
  } catch (e) {
    if (e is DioError && e.response != null) {
      throw 'Authentication failed, error: ${e.response!.data.toString()}';
    }
    throw 'Authentication failed';
  }
}

class ApiClient {
  const ApiClient({
    required this.token,
    required this.refreshToken,
  });

  final String token;
  final String refreshToken;

  getCurrentShares(int bikeid) async {
    try {
      final Response<dynamic> resp;

      final client = Dio(BaseOptions(
        headers: {
          'Api-Key': _apiKey,
          'Authorization': 'Bearer $token',
        },
        responseType: ResponseType.json,
        receiveDataWhenStatusError: true,
      ));
      resp = await client.get(
          'https://api.vanmoof-api.com/v8/getBikeSharingInvitationsForBike/$bikeid');

      return resp.data['invitations'] as List<dynamic>;
    } catch (e) {
      if (e is DioError && e.response != null) {
        throw 'Unable to obtain shares, error: ${e.response!.data.toString()}';
      }
      throw 'Unable to obtain shares, check your connection.';
    }
  }

  shareCurrentBike(int bikeid, String email, int duration) async {
    try {
      final Response<dynamic> resp;

      final client = Dio(BaseOptions(
        headers: {
          'Api-Key': _apiKey,
          'Authorization': 'Bearer $token',
        },
        responseType: ResponseType.json,
        receiveDataWhenStatusError: true,
      ));
      var data = {
        'bikeId': bikeid,
        'email': email,
        'duration': duration,
      };

      resp = await client.post(
          'https://api.vanmoof-api.com/v8/createBikeSharingInvitation',
          data: data);

      return resp.data["result"] as Map<String, dynamic>;
    } catch (e) {
      if (e is DioError && e.response != null) {
        throw 'Unable to share the bike, error: ${e.response!.data.toString()}';
      }
      throw 'Failed to share the bike.';
    }
  }

  removeShare(String guid) async {
    try {
      final Response<dynamic> resp;

      final client = Dio(BaseOptions(
        headers: {
          'Api-Key': _apiKey,
          'Authorization': 'Bearer $token',
        },
        responseType: ResponseType.json,
        receiveDataWhenStatusError: true,
      ));

      resp = await client.post(
          'https://api.vanmoof-api.com/v8/revokeBikeSharingInvitation/$guid');

      return resp.data as Map<String, dynamic>;
    } catch (e) {
      if (e is DioError && e.response != null) {
        throw 'Unable to remove share holder, error: ${e.response!.data.toString()}';
      }
      throw 'Failed to remove the share holder.';
    }
  }

  getBikes() async {
    try {
      final Response<dynamic> resp;

      final client = Dio(BaseOptions(
        headers: {
          'Api-Key': _apiKey,
          'Authorization': 'Bearer $token',
        },
        responseType: ResponseType.json,
        receiveDataWhenStatusError: true,
      ));
      resp = await client.get(
          'https://api.vanmoof-api.com/v8/getCustomerData?includeBikeDetails');

      final List<dynamic> bikes = resp.data['data']['bikeDetails'];
      if (bikes.isEmpty) throw 'You have no bikes connected to your account';

      return bikes.map((b) => bikeCredentialsFromJson(b)).toList();
    } catch (e) {
      if (e is DioError && e.response != null) {
        throw 'Unable to obtain bikes, error: ${e.response!.data.toString()}';
      }
      throw 'Unable to obtain bikes';
    }
  }
}
