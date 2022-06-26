import 'package:hive_flutter/hive_flutter.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';
import 'api.dart';

_getEncryptionKey() async {
  const secureStorage = FlutterSecureStorage();
  final encryptionKey = await secureStorage.read(key: 'encryptionKey');
  if (encryptionKey == null) {
    final key = Hive.generateSecureKey();
    await secureStorage.write(
      key: 'encryptionKey',
      value: base64UrlEncode(key),
    );
    return key;
  }
  return base64Url.decode(encryptionKey);
}

late final List<int> encryptionKey;

setupLocalStorage() async {
  await Hive.initFlutter();

  Hive.registerAdapter(BikeCredentialsAdapter());
  Hive.registerAdapter(BikeColorAdapter());
  Hive.registerAdapter(BikeLinksAdapter());

  encryptionKey = await _getEncryptionKey();
  await Hive.openBox(
    "apiCredentials",
    encryptionCipher: HiveAesCipher(encryptionKey),
  );
  await Hive.openBox(
    "bikeCredentials",
    encryptionCipher: HiveAesCipher(encryptionKey),
  );
}

closeStorage() async {
  await Hive.close();
}

Box<dynamic> _apiCredentialsBox() => Hive.box("apiCredentials");
apiCredentialsBoxListenable() => _apiCredentialsBox().listenable();

Box<dynamic> _bikeCredentialsBox() => Hive.box("bikeCredentials");
bikeCredentialsBoxListenable() => _bikeCredentialsBox().listenable();

storeApiTokens(ApiClient api) async {
  final store = _apiCredentialsBox();
  await store.putAll({
    'token': api.token,
    'refreshToken': api.refreshToken,
  });
  await store.flush();
}

ApiClient? obtainApiClient() {
  final store = _apiCredentialsBox();
  final token = store.get('token');
  final refreshToken = store.get('refreshToken');
  if (token == null || refreshToken == null) {
    return null;
  }
  return ApiClient(token: token, refreshToken: refreshToken);
}

storeBikes(List<BikeCredentials> bikes) async {
  final store = _bikeCredentialsBox();
  store.clear();
  for (var bike in bikes) {
    await store.put(bike.id.toString(), bike);
  }
}

List<BikeCredentials> obtainBikes() {
  return _bikeCredentialsBox().values.toList().cast();
}
