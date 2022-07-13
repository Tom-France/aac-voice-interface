# Augmentative and Alternative Communication (AAC) application
This repo is based on the great work from AsTeRICS Grid, you can find it here:
https://github.com/asterics/AsTeRICS-Grid
We encourage you to read the doc available there.

# Goal
In practice, use of classic AAC can be bothersome as it needs a lot of inputs depending on user's situation: multiple click to select the corresponding icon, submit, then select again, etc...
Aim of this project is to add faster interaction with the different icons and in the long term, add voice recognition to allow for even faster use.  

# What's new
! BEWARE, EVERYTHING IS HIGHLY EXPERIMENTAL AND WE CAN NOT GUARANTEE IT IS FULLY FUNCTIONAL !
* Work in progress: added `customInput` in input options. It allows to directly run a grid element action from a trigger. For now only keyboards interaction are supported and only home, play and clear actions are supported. Custom input relies on a map configuration looking like this:
```
{
    multiKeysEventSelect: new Map([
        ["77:79:84", "Home"], 
        ["8", "Clear"],
        ["80", "Play"]
    ])
}
```
Key is the sorted keycodes combination and value is the custom id of a grid element. Action related to the grid element will be triggered when combination is pressed down.
* Work in progress: added voice capture to be sent to a data model training. Action related is to be able to switch between a training use of tha app and a voice translator use when data model have enough voice recording

## TODO

1. Add custom ID in edit view for all grid element. (for now, custom id is hardcoded for home, play and clear buttons)
2. Add options to configure custom input method
3. Improve custom input mapping to support wider variety of input configurations (voice, keyboard sequence, etc...).
4. Update internationalization
5. Add a switch to change between voice training mode and voice recognition mode

## Documentation
see [User documentation](docs/documentation_user/README.md) or [AsTeRICS Grid Playlist on YouTube](https://www.youtube.com/playlist?list=PL0UXHkT03dGrIHldlEKR0ZWfNMkShuTNz).

## Run project locally
1. clone the project `git@github.com:Tom-France/AsTeRICS-Grid.git`
2. install node.js (v12.XX) https://nodejs.org/
3. install yarn, see https://yarnpkg.com/
4. go to the directory of the cloned project and run `yarn install`
5. run `npm run start` and open http://localhost:9095

## Npm scripts
After `yarn install` the following commands are available:
1. `npm run start` --> starts a webserver serving the AsTeRICS grid on `http://localhost:9095`, does hot reloading if js-sources change.
2. `npm run start-legacy` --> same as `start` but js sources are transformed to ES5 using babel.
3. `npm run start-no-live` --> same as `start` but hot reloading is disabled.
4. `npm run build` --> builds the js-files in folder `src` to `app/build` and `app/build_legacy` folders.
5. `npm run start-superlogin-dev` --> runs [superlogin](https://github.com/colinskow/superlogin) locally and makes it possible to create "online users" within the locally running application. A local [CouchDb](https://couchdb.apache.org/) instance is necessary in order to work.
6. `npm run release` -> releases the current version with a new tag and push it to `gh-pages` branch in order to be served at https://grid.asterics.eu/
7. `npm run release-latest` -> same as `npm run release` but with destination https://grid.asterics.eu/latest/
8. `npm run test` -> runs tests of the project using [Jest](https://jestjs.io/).

## Acknowledgements and Attribution
* Thanks to Nessia, David, TOM France, Contentsquare, the team (Lionel, Stéphane, Guillaume, Benjamin, Medhi, and Ahmed), Benjamin Klaus (main dev of Asterics GRID) & all the people involved in the process.
