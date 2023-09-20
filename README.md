# iMIS Experience Plus

A browser extension to improve the iMIS Staff Site experience.

Latest Version: 1.3.0 (Published on 2023-09-20)

## Features

* Enhanced IQA Editor Experience
* Enhanced RiSE Content Editor Experience
* A "Work Bar" - global search, lookup, and navigation tool

## Usage

Enable or disable any of the features in the extension by clicking on the extension's icon and configuring desired settings:

![Extension menu screenshot](https://github.com/CSI-Inc/imis-experience-plus/blob/master/assets/ext-menu.png?raw=true)

## Installing

* **Microsoft Edge:** <https://microsoftedge.microsoft.com/addons/detail/imis-experience-plus/aggkakldaeijmndiconjpmcmhjdfflna>
* **Google Chrome:** <https://chrome.google.com/webstore/detail/imis-experience-plus/nlodbfllahecdjenoogblmhphkjmekhj>

## Developing

Open the folder in VS Code. Run the "tsc: watch" task to start the TypeScript listener.

In Chrome or Edge, load an unpacked extension (browse to `edge://extensions` or `chrome://extensions`) and point it at your development folder.

Make changes to the .ts file, save, make sure there are no TSC errors, press the "Reload" button on the Extensions screen in your browser, and then refresh iMIS. Your changes should be visible.

## Contributing

Have an idea for a feature to include in the extension? Fixed a bug and want to publish it? Feel free to contribute and send us a PR!

You can also [Report a Bug](https://github.com/CSI-Inc/imis-experience-plus/issues/new?assignees=&labels=bug&projects=&template=report-a-bug.md&title=) or [Suggest a Feature](https://github.com/CSI-Inc/imis-experience-plus/issues/new?assignees=&labels=enhancement&projects=&template=suggest-a-feature.md&title=)!

We'll take care of versioning and packaging.
