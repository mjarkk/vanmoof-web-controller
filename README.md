## [Mooovy](https://mooovy.app/)

A web app for changing the speed limit of your VanMoof S3 and X3.

**NOT** an offical VanMoof service/product!

![preview](public/screenshot_light.png?raw=true "preview")

- **[Web app: mooovy.app](https://mooovy.app/)**
- [Discord server](https://discord.gg/gQFC2n7Tc9)

### Current features

- Change your speed limit to JP (24 km/h), EU (25 km/h), US (32 km/h) or 😎 (37 km/h).
- Set your power level, this also unlocks a new power level 5.
- A sound board with the following sounds:

| Short | 🔘 Click            | 🧨 Error | 👍 Pling         | 🤔 Cling clong | 🔔 Bell       | 🔔 Normal bike bell | 🎉 Bell Tada         | 😚 Whistle | 🚢 BOAT | ⚡️ Wuup | 🫤 Success but error |
| ----- | ------------------- | -------- | ---------------- | -------------- | ------------- | ------------------- | -------------------- | ---------- | ------- | -------- | ------------------- |
| Long  | 🔋 Charding noise.. | 🚨 Alarm | 🚨 Alarm stage 2 | 🔋 Charging..  | 🆕 Updating.. | 🎉 Update complete  | 💥 Make wired noises |

- Share your bike to someone using their email.
- Show a list of people you are currently sharing your bike with and a button to stop sharing.
- Set your bell tone (Bell, Submarine, Sonar, Party & Foghorn)
- Upload your own custom bell (will replace the Foghorn/Ping bell)

### Want to help?

Here are some things you can do to help!

- [Confirm v1.8.**2** still works](https://github.com/mjarkk/vanmoof-web-controller/issues/22) (v1.8.**1** has been confirmed to work already!)
- Help reverse engineer how the refresh token works for the VanMoof API
- Hackin support for older/newer bikes
- Help with finding out what is send from / to the bike over bluetooth and having a good workflow for doing this

### Development

This project is build using [NextJS (a React framework)](https://nextjs.org) and deployed on [vercel](https://vercel.com)

**Install**

```sh
npm i
```

**Run**

```sh
npm run dev
```

**Compress logos**

```sh
cd public
npx @squoosh/cli --max-optimizer-rounds 10 --quant '{numColors:8}' --output-dir compressed_logos --webp auto --oxipng auto logo_full.png
npx @squoosh/cli --max-optimizer-rounds 10 --resize '{width:512,height:512}' --quant '{numColors:8}' --output-dir compressed_logos --webp auto --oxipng auto --suffix _512 logo_full.png
npx @squoosh/cli --max-optimizer-rounds 10 --resize '{width:256,height:256}' --quant '{numColors:8}' --output-dir compressed_logos --webp auto --oxipng auto --suffix _256 logo_full.png
npx @squoosh/cli --max-optimizer-rounds 10 --resize '{width:128,height:128}' --quant '{numColors:8}' --output-dir compressed_logos --webp auto --oxipng auto --suffix _128 logo_full.png
npx @squoosh/cli --max-optimizer-rounds 10 --resize '{width:64,height:64}' --quant '{numColors:8}' --output-dir compressed_logos --webp auto --oxipng auto --suffix _64 logo_full.png
```
