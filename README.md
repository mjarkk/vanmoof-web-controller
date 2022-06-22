## [Change VanMoof S&X 3 speed limit](https://vanmoof-web-controller.vercel.app/)

A web app for changing the speed limit of your VanMoof S3 and X3.

**NOT** an offical VanMoof service/product!

![preview](public/screenshot_light.png?raw=true "preview")

https://vanmoof-web-controller.vercel.app/

### Current features
- Change your speed limit to JP (24 km/h), EU (25 km/h), US (32 km/h) or 😎 (37 km/h)
- Set your power level, this also unlocks a new power level 5.
- A sound board with the following sounds:

Short | 🔘 Click | 🧨 Error | 👍 Pling | 🤔 Cling clong | 🔔 Bell | 🔔 Normal bike bell | 🎉 Bell Tada | 😚 Whistle | 🚢 BOAT | ⚡️ Wuup | 🫤 Success but error | 
--- | --- | --- | --- |--- |--- |--- |--- |--- |--- |--- |---
Long | 🔋 Charding noise.. | 🚨 Alarm | 🚨 Alarm stage 2 | 🔋 Charging.. | 🆕 Updating.. | 🎉 Update complete | 💥 Make wired noises
- You can share your bike to someone using their email


### Want to help?

Here are some things you can do to help!

- Help reverse engineer how the refresh token works for the VanMoof API
- Hackin support for older bikes
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
