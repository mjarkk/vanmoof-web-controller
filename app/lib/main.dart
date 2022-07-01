import 'package:flutter/material.dart';
import 'routes/login.dart';
import 'local_storage.dart';
import 'routes/home.dart';

void main() async {
  await setupLocalStorage();
  runApp(const App());
}

class App extends StatelessWidget {
  const App({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = ThemeData(
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
    );

    final Map<String, WidgetBuilder> routes = {
      '/login': (context) => const Login(),
      '/home': (context) => const Home(),
    };

    String initialRoute = '/login';

    final bikes = obtainBikes();
    final api = obtainApiClient();
    if (bikes.isNotEmpty && api != null) {
      initialRoute = '/home';
    }

    return MaterialApp(
      title: 'Mooovy',
      debugShowCheckedModeBanner: false,
      theme: theme,
      routes: routes,
      initialRoute: initialRoute,
    );
  }
}
