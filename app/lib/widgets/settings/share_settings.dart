import 'package:flutter/cupertino.dart';
import 'package:mooovy/bike/bike.dart';
import 'package:flutter/material.dart';
import 'package:mooovy/local_storage.dart';
import 'package:email_validator/email_validator.dart';
import 'package:mooovy/widgets/settings/close_button.dart';
import 'package:mooovy/widgets/settings/section.dart';

class ShareBikeForm extends StatefulWidget {
  const ShareBikeForm({
    required this.bike,
    required this.refreshList,
    super.key,
  });

  final Bike bike;
  final Function() refreshList;

  @override
  State<ShareBikeForm> createState() => _ShareBikeFormState();
}

class _ShareBikeFormState extends State<ShareBikeForm> {
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
      final res = await api?.shareCurrentBike(widget.bike.id, _email, dur);

      success = 'Shared with ${res["email"]}';
    } catch (e) {
      error = e.toString();
    } finally {
      setState(() {});
      widget.refreshList();
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

class _ShareHolderList extends StatefulWidget {
  const _ShareHolderList({
    required this.shareHolders,
    required this.refreshList,
    super.key,
  });

  final dynamic shareHolders;
  final Function() refreshList;

  @override
  State<_ShareHolderList> createState() => _ShareHolderListState();
}

class _ShareHolderListState extends State<_ShareHolderList> {
  get api => obtainApiClient()!;
  String? error;
  String? success;

  @override
  Widget build(BuildContext context) {
    if (widget.shareHolders == null) {
      return Center(
          child: Column(children: const [
        CircularProgressIndicator(),
        Text("Loading shares"),
      ]));
    }

    if (widget.shareHolders.length == 0) {
      return const Text('No share holders');
    }

    return Column(
      mainAxisSize: MainAxisSize.max,
      children: [
        error != null
            ? Text(
                error!,
                style: TextStyle(color: Theme.of(context).errorColor),
              )
            : Container(),
        success != null
            ? Text(
                success!,
                style: const TextStyle(color: Colors.green),
              )
            : Container(),
        Expanded(
          child: ListView.builder(
            itemCount: widget.shareHolders.length,
            itemBuilder: (context, index) {
              var shareHolder = widget.shareHolders[index];
              var duration = shareHolder["duration"];
              return ListTile(
                title: Text(shareHolder["email"]),
                subtitle: Text(duration == null
                    ? "Forever"
                    : (duration ~/ 29030400) > 1
                        ? "${duration ~/ 29030400} years"
                        : (duration ~/ 2419200) > 1
                            ? "${duration ~/ 2419200} months"
                            : (duration ~/ 604800) > 1
                                ? "${duration ~/ 604800} weeks"
                                : (duration ~/ 86400) > 1
                                    ? "${duration ~/ 86400} days"
                                    : (duration ~/ 3600) > 1
                                        ? "${duration ~/ 3600} hours"
                                        : "${duration ~/ 60} minutes"),
                trailing: IconButton(
                  icon: const Icon(Icons.delete),
                  onPressed: () async {
                    setState(() {
                      error = null;
                      success = null;
                    });

                    try {
                      await api?.removeShare(shareHolder["guid"]);
                      success = 'Successfully removed shareholder';
                    } catch (e) {
                      error = e.toString();
                    } finally {
                      widget.refreshList();
                    }
                  },
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

class ShareSettings extends StatefulWidget {
  const ShareSettings({required this.bike, super.key});

  final Bike bike;

  @override
  State<ShareSettings> createState() => _ShareSettingsState();
}

class _ShareSettingsState extends State<ShareSettings> {
  dynamic _shareHolders;

  get api => obtainApiClient()!;

  obtainShareHolders() async {
    _shareHolders = await api?.getCurrentShares(widget.bike.id);
    setState(() {});
  }

  @override
  void initState() {
    super.initState();
    obtainShareHolders();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CupertinoNavigationBar(
        backgroundColor: CupertinoTheme.of(context).scaffoldBackgroundColor,
        leading: Container(),
        middle: const Text('Manage sharing'),
        trailing: SettingsCloseButton(onPressed: () => Navigator.pop(context)),
      ),
      body: SafeArea(
          child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(6),
            child: ShareBikeForm(
              bike: widget.bike,
              refreshList: obtainShareHolders,
            ),
          ),
          Expanded(
            child: _ShareHolderList(
              shareHolders: _shareHolders,
              refreshList: obtainShareHolders,
            ),
          ),
        ],
      )),
    );
  }
}
