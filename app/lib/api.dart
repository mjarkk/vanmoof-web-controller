import 'package:dio/dio.dart';
import 'dart:convert';
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
    resp = await client.get('https://api.vanmoof-api.com/v8/authenticate');
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

  getCurrentShares(int bikeid) async {
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
          'https://api.vanmoof-api.com/v8/getBikeSharingInvitationsForBike/$bikeid');
    } catch (e) {
      if (e is DioError && e.response != null) {
        throw 'Unable to obtain shares, error: ${e.response!.data.toString()}';
      }
      throw 'Unable to obtain shares, check your connection.';
    }

    return resp.data['invitations'] as List<dynamic>;
  }

  shareCurrentBike(int bikeid, String email, int duration) async {
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
      var data = {
        'bikeId': bikeid,
        'email': email,
        'duration': duration,
      };

      resp = await client.post(
          'https://api.vanmoof-api.com/v8/createBikeSharingInvitation',
          data: data);
    } catch (e) {
      if (e is DioError && e.response != null) {
        throw 'Unable to obtain shares, error: ${e.response!.data.toString()}';
      }
      throw 'Failed to share the bike.';
    }

    return resp.data["result"] as Map<String, dynamic>;
  }

  removeShare(String guid) async {
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

      resp = await client.post(
          'https://api.vanmoof-api.com/v8/revokeBikeSharingInvitation/$guid');
    } catch (e) {
      if (e is DioError && e.response != null) {
        throw 'Unable to remove share holder, error: ${e.response!.data.toString()}';
      }
      throw 'Failed to remove the share holder.';
    }

    return resp.data as Map<String, dynamic>;
  }

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
          'https://api.vanmoof-api.com/v8/getCustomerData?includeBikeDetails');
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
