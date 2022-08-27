import 'package:flutter/cupertino.dart';
import 'package:mooovy/bike/bike.dart';
import 'package:flutter/material.dart';
import 'package:mooovy/local_storage.dart';
import 'package:email_validator/email_validator.dart';
import 'package:mooovy/widgets/settings/section.dart';

class ShareBike extends StatefulWidget {
  const ShareBike({required this.bike, super.key});
  final Bike bike;

  @override
  State<ShareBike> createState() => _ShareWith();
}

class _ShareWith extends State<ShareBike> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final api = obtainApiClient();

  double _duration = 14;
  String _email = '';
  String? error;
  String? success;

  submitForm(NavigatorState navigator) async {
    if (_formKey.currentState?.validate() != true) return;
    _formKey.currentState?.save();
    if (_email.isEmpty) return;

    setState(() {
      error = null;
      success = null;
    });

    try {
      int dur = _duration.toInt() * 86400;

      var res = await api?.shareCurrentBike(widget.bike.id, _email, dur);

      setState(() {
        success = 'Shared with ${res["email"]}';
      });
    } catch (e) {
      setState(() {
        error = e.toString();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Column(
        children: [
          Section(
            title: 'Share ${widget.bike.name}',
            children: [
              Form(
                key: _formKey,
                autovalidateMode: AutovalidateMode.always,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
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
                            return (value != null &&
                                    !EmailValidator.validate(value))
                                ? 'Invalid email address'
                                : null;
                          },
                        ),
                        Padding(
                          padding: const EdgeInsets.only(top: 16.0),
                          child: SizedBox(
                            width: double.infinity,
                            child: CupertinoSlider(
                              value: _duration,
                              min: 1.0,
                              max: 365.0,
                              onChanged: (newDuration) =>
                                  setState(() => _duration = newDuration),
                            ),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 6),
                          child: ElevatedButton(
                            onPressed: () => submitForm(Navigator.of(context)),
                            child: Text('Share ${_duration.round()} days'),
                          ),
                        ),
                        error != null
                            ? Text(
                                error!,
                                style: TextStyle(
                                    color: Theme.of(context).errorColor),
                              )
                            : Container(),
                        success != null
                            ? Text(
                                success!,
                                style: const TextStyle(color: Colors.green),
                              )
                            : Container(),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ShareHolderList extends State<ShareSettings> {
  get api => obtainApiClient()!;
  late Future _shareHolders;

  @override
  void initState() {
    super.initState();
    _shareHolders = api?.getCurrentShares(widget.bike.id);
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: _shareHolders,
      builder: (BuildContext context, AsyncSnapshot snapshot) =>
          StatefulBuilder(
        builder: (context, setState) {
          if (snapshot.connectionState != ConnectionState.done) {
            return Center(
                child: Column(children: const [
              CircularProgressIndicator(),
              Text("Loading shares"),
            ]));
          }

          if (snapshot.hasData) {
            if (snapshot.data.length == 0) {
              return const Text('No share holders');
            } else {
              return ListView.builder(
                itemCount: snapshot.data.length,
                itemBuilder: (context, index) {
                  final duration = snapshot.data[index]["duration"];
                  return ListTile(
                    title: Text(snapshot.data[index]["email"]),
                    subtitle: Text(duration == null
                        ? "Forever"
                        : (duration ~/ 86400) > 1
                            ? "${duration / 86400} days"
                            : (duration ~/ 3600) > 1
                                ? "${duration / 3600} hours"
                                : "${duration / 60} minutes"),
                    trailing: IconButton(
                      icon: const Icon(Icons.remove_circle_outline),
                      onPressed: () {
                        api?.removeShare(snapshot.data[index]["guid"]);
                      },
                    ),
                  );
                },
              );
            }
          }

          if (snapshot.hasError) {
            return Text(snapshot.error.toString());
          }

          return const Center(child: CircularProgressIndicator());
        },
      ),
    );
  }
}

class ShareSettings extends StatefulWidget {
  const ShareSettings({required this.bike, super.key});
  final Bike bike;

  @override
  State<ShareSettings> createState() => _ShareHolderList();
}
