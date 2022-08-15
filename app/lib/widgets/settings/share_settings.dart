import 'package:mooovy/bike/bike.dart';
import 'package:flutter/material.dart';
import 'package:mooovy/local_storage.dart';

class ShareWith extends StatelessWidget {
  const ShareWith({required this.bike, super.key});
  final Bike bike;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Column(
        children: [
          _Section(
            title: 'Share ${bike.name}',
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Form(
                    child: TextFormField(
                      decoration: const InputDecoration(
                        labelText: 'Email',
                      ),
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      // TODO:
                      // Make the Share button functional.
                      // Add a time slider like the web app.
                    },
                    child: const Text('Share'),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ShareHolderList extends State<ShareSettings> {
  final api = obtainApiClient();
  late Future _shareHolders;

  @override
  void initState() {
    super.initState();
    _shareHolders = api?.getCurrentShares(widget.bike.id);
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: FutureBuilder(
        future: _shareHolders,
        builder: (BuildContext context, AsyncSnapshot snapshot) =>
            StatefulBuilder(
          builder: (context, setState) {
            if (snapshot.hasData) {
              if (snapshot.data.length == 0) {
                return const Text('No share holders');
              } else {
                return ListView.builder(
                  itemCount: snapshot.data.length,
                  itemBuilder: (context, index) {
                    return ListTile(
                      title: Text(snapshot.data[index]["email"]),
                      subtitle: Text(snapshot.data[index]["duration"] == null
                          ? "Forever"
                          : (snapshot.data[index]["duration"] ~/ 86400) > 1
                              ? "${snapshot.data[index]["duration"] / 86400} days"
                              : (snapshot.data[index]["duration"] ~/ 3600) > 1
                                  ? "${snapshot.data[index]["duration"] / 3600} hours"
                                  : "${snapshot.data[index]["duration"] / 60} minutes"),
                      trailing: IconButton(
                        icon: const Icon(Icons.close),
                        onPressed: () async {
                          // TODO: Remove share holder
                          // By using the data from snapshot.data[index]["guid"]
                        },
                      ),
                    );
                  },
                );
              }
            } else {
              return const CircularProgressIndicator();
            }
          },
        ),
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

class _Section extends StatelessWidget {
  const _Section({required this.title, required this.children, super.key});

  final String title;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                title,
                style: Theme.of(context).textTheme.headline6,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Container(
                  height: 1,
                  color: Colors.black26,
                  width: double.infinity,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: children,
          ),
        ],
      ),
    );
  }
}

class _CloseButton extends StatelessWidget {
  const _CloseButton({required this.onPressed, super.key});

  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onPressed,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          color: Colors.black12,
        ),
        padding: const EdgeInsets.all(2),
        child: const Icon(Icons.close_rounded, size: 22),
      ),
    );
  }
}
