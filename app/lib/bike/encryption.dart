import 'package:pointycastle/export.dart';
import 'package:hex/hex.dart';
import 'dart:typed_data';

class AesEcb {
  AesEcb(String encryptionKey) {
    Uint8List key = Uint8List.fromList(HEX.decode(encryptionKey));

    _encryptionChiper = ECBBlockCipher(AESEngine());
    _encryptionChiper.init(true, KeyParameter(key));

    _decryptionChiper = ECBBlockCipher(AESEngine());
    _decryptionChiper.init(false, KeyParameter(key));
  }

  late final BlockCipher _encryptionChiper;
  late final BlockCipher _decryptionChiper;

  encrypt(List<int> value) {
    _encryptionChiper.reset();
    return _encryptionChiper.process(Uint8List.fromList(value)).toList();
  }

  List<int> decrypt(List<int> value) {
    _decryptionChiper.reset();
    return _decryptionChiper.process(Uint8List.fromList(value)).toList();
  }
}
