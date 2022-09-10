import 'package:flutter/material.dart';
import 'package:email_validator/email_validator.dart';
import 'package:mooovy/api.dart';
import 'package:mooovy/local_storage.dart';

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  String _email = '';
  String _password = '';
  String? error;

  submitForm(NavigatorState navigator) async {
    if (_formKey.currentState?.validate() != true) return;
    _formKey.currentState?.save();
    if (_email.isEmpty || _password.isEmpty) return;

    setState(() {
      error = null;
    });

    try {
      final api = await authenticate(_email, _password);
      final bikes = await api.getBikes();

      await storeApiTokens(api);
      await storeBikes(bikes);

      navigator.popAndPushNamed('/home', arguments: bikes);
    } catch (e) {
      setState(() {
        error = e.toString();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mooovy'),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            autovalidateMode: AutovalidateMode.always,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: Text(
                    'Login using your VanMoof account',
                    style: Theme.of(context).textTheme.headline5,
                  ),
                ),
                TextFormField(
                  decoration: const InputDecoration(
                    icon: Icon(Icons.email),
                    hintText: 'VanMoof account email',
                    labelText: 'Email',
                  ),
                  onSaved: (value) {
                    _email = value ?? '';
                  },
                  validator: (String? value) {
                    return (value != null && !EmailValidator.validate(value))
                        ? 'Invalid email address'
                        : null;
                  },
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: TextFormField(
                    obscureText: true,
                    decoration: const InputDecoration(
                      icon: Icon(Icons.password),
                      hintText: 'VanMoof account password',
                      labelText: 'Password',
                    ),
                    onSaved: (value) {
                      _password = value ?? '';
                    },
                    validator: (String? value) {
                      if (value != null && value.isEmpty) {
                        return 'Password is required.';
                      }
                    },
                  ),
                ),
                ElevatedButton(
                  onPressed: () => submitForm(Navigator.of(context)),
                  child: const Text('Login'),
                ),
                error != null
                    ? Text(
                        error!,
                        style: TextStyle(color: Theme.of(context).errorColor),
                      )
                    : Container(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
