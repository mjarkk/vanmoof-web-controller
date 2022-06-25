import 'package:app/api.dart';
import 'package:flutter/material.dart';
import 'routes/login.dart';
import 'local_storage.dart';

void main() async {
  await setupLocalStorage();
  obtainBikes();
  runApp(const App());
}

class App extends StatelessWidget {
  const App({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Mooovy',
      theme: ThemeData(
        primarySwatch: Colors.yellow,
        hintColor: Colors.black54,
        toggleableActiveColor: Colors.black,
        inputDecorationTheme: const InputDecorationTheme(
          iconColor: Colors.black,
          focusedBorder: UnderlineInputBorder(
            borderSide: BorderSide(color: Colors.black),
          ),
          border: UnderlineInputBorder(),
          labelStyle: TextStyle(color: Colors.black54),
        ),
      ),
      home: const Login(),
    );
  }
}
