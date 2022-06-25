// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'api.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class BikeCredentialsAdapter extends TypeAdapter<BikeCredentials> {
  @override
  final int typeId = 1;

  @override
  BikeCredentials read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return BikeCredentials(
      id: fields[0] as int,
      macAddress: fields[1] as String,
      encryptionKey: fields[2] as String,
      userKeyId: fields[3] as int,
      name: fields[4] as String,
      ownerName: fields[5] as String,
      modelColor: fields[6] as BikeColor?,
      links: fields[7] as BikeLinks?,
    );
  }

  @override
  void write(BinaryWriter writer, BikeCredentials obj) {
    writer
      ..writeByte(8)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.macAddress)
      ..writeByte(2)
      ..write(obj.encryptionKey)
      ..writeByte(3)
      ..write(obj.userKeyId)
      ..writeByte(4)
      ..write(obj.name)
      ..writeByte(5)
      ..write(obj.ownerName)
      ..writeByte(6)
      ..write(obj.modelColor)
      ..writeByte(7)
      ..write(obj.links);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is BikeCredentialsAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

class BikeColorAdapter extends TypeAdapter<BikeColor> {
  @override
  final int typeId = 2;

  @override
  BikeColor read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return BikeColor(
      name: fields[0] as String,
      primary: fields[1] as String,
      secondary: fields[2] as String,
    );
  }

  @override
  void write(BinaryWriter writer, BikeColor obj) {
    writer
      ..writeByte(3)
      ..writeByte(0)
      ..write(obj.name)
      ..writeByte(1)
      ..write(obj.primary)
      ..writeByte(2)
      ..write(obj.secondary);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is BikeColorAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

class BikeLinksAdapter extends TypeAdapter<BikeLinks> {
  @override
  final int typeId = 3;

  @override
  BikeLinks read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return BikeLinks(
      hash: fields[0] as String,
      thumbnail: fields[1] as String,
    );
  }

  @override
  void write(BinaryWriter writer, BikeLinks obj) {
    writer
      ..writeByte(2)
      ..writeByte(0)
      ..write(obj.hash)
      ..writeByte(1)
      ..write(obj.thumbnail);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is BikeLinksAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
