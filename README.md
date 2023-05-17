##### [Support UniversalBit Project](https://github.com/universalbit-dev/universalbit-dev/tree/main/support)


<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

<br />
<p align="center">
  <a href="https://github.com/probabletrain/mapgenerator">
      <img src="https://github.com/universalbit-dev/CityGenerator/blob/master/docs/images/STL/model_preview.png" alt="model preview" width="480" height="320">
  </a>

  <h3 align="center">Map Generator</h3>

  <p align="center">
    Create procedural Fab City
    <br />
    <a href=""><strong>Open Generator »</strong></a>
    <br />
    <br />
    <a href="https://maps.probabletrain.com" target="_blank">Read the Docs</a>
    ·
    <a href="https://github.com/probabletrain/mapgenerator/issues">Report Bug</a>
    ·
    <a href="https://github.com/probabletrain/mapgenerator/issues">Request Feature</a>
  </p>
</p>


## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](https://www.gnu.org/licenses/lgpl-3.0.txt)
* [Contact](#contact)



## About The Project
This tool procedurally generates images of city maps. The process can be automated, or controlled at each stage give you finer control over the output.
3D models of generated cities can be downloaded as a `.stl`. The download is a `zip` containing multiple `.stl` files for different components of the map.
Images of generated cities can be downloaded as a `.png` or an `.svg`. There are a few choices for drawing style, ranging from colour themes similar to Google or Apple maps, to a hand-drawn sketch.


### Built With

* [Typescript](https://www.typescriptlang.org/)
* [Gulp](https://gulpjs.com/)


## Getting Started

To get a local copy up and running follow these steps.

### Prerequisites
[Nodejs 18.15.0](https://nodejs.org/en/blog/release/v18.15.0)

* npm
```sh
npm install npm@latest -g
```

* Gulp
```
npm install --global gulp-cli
```

### Installation
 
1. Clone the mapgenerator
```sh
git clone https://github.com/universalbit-dev/CityGenerator.git
```
2. Install NPM packages
```sh
cd CityGenerator
npm install
```
3. Build with Gulp. This will watch for changes to any Typescript files. If you edit the HTML or CSS you will have to rerun this command. [Gulp Notify](https://github.com/mikaelbr/gulp-notify) sends a notification whenever a build finishes.
```
gulp
```
4. Open `dist/index.html` in a web browser, refresh the page whenever the project is rebuilt.
## Usage
See the [documentation](https://github.com/universalbit-dev/CityGenerator/blob/master/docs/README.md).

## Roadmap
See the [open issues](https://github.com/probabletrain/mapgenerator/issues) for a list of proposed features (and known issues).

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact
##### Keir - [@probabletrain](https://twitter.com/probabletrain) - probabletrain@gmail.com
##### Project Link: [https://github.com/probabletrain/mapgenerator](https://github.com/probabletrain/mapgenerator)
#### [Contributors](https://github.com/ProbableTrain/MapGenerator#contributors-)

## License
Distributed under the LGPL-3.0 License. See [lgpl-3.0.txt](https://www.gnu.org/licenses/lgpl-3.0.txt)
