import 'package:flutter/material.dart';
import 'package:email_validator/email_validator.dart';
import '../api.dart';
import '../local_storage.dart';

class Login extends StatefulWidget {
  const Login({Key? key}) : super(key: key);

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  String _email = '';
  String _password = '';
  String? error;

  submitForm() async {
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
                TextFormField(
                  decoration: const InputDecoration(
                    icon: Icon(Icons.email),
                    hintText: 'VanMoof accout email',
                    labelText: 'Email',
                  ),
                  onSaved: (value) {
                    _email = value ?? '';
                  },
                  validator: (String? value) {
                    return (value != null && !EmailValidator.validate(value))
                        ? 'Not a valid email address'
                        : null;
                  },
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: TextFormField(
                    obscureText: true,
                    decoration: const InputDecoration(
                      icon: Icon(Icons.password),
                      hintText: 'VanMoof accout password',
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
                  onPressed: submitForm,
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
