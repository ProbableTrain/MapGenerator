##### [Support UniversalBit Project](https://github.com/universalbit-dev/universalbit-dev/tree/main/support)

![FabCity](https://github.com/universalbit-dev/CityGenerator/blob/master/docs/images/STL/model_preview.png?raw=true "Procedural City")


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
#### [WebSite](https://maps.probabletrain.com/#/)
#### [Support](https://ko-fi.com/probabletrain)

This tool procedurally generates images of city maps. The process can be automated, or controlled at each stage give you finer control over the output.
3D models of generated cities can be downloaded as a `.stl`. //*

#### [Building Tools](https://github.com/universalbit-dev/building_tools)

The download is a `zip` containing multiple `.stl` files for different components of the map.
Images of generated cities can be downloaded as a `.png` or an `.svg`. There are a few choices for drawing style, ranging from colour themes similar to Google or Apple maps, to a hand-drawn sketch.


### Built With
* [Typescript](https://www.typescriptlang.org/)
* [Gulp](https://gulpjs.com/)


## Getting Started
To get a local copy up and running follow these steps.

### [Nodejs 18.15.0](https://nodejs.org/en/blog/release/v18.15.0)

* Gulp
```
npm install --global gulp-cli
```

### Installation
 
1. Clone the project
```
git clone https://github.com/universalbit-dev/CityGenerator.git
```
2. Install NPM packages
```
cd CityGenerator
npm i
```
3. Build with Gulp. This will watch for changes to any Typescript files. If you edit the HTML or CSS you will have to rerun this command. [Gulp Notify](https://github.com/mikaelbr/gulp-notify) sends a notification whenever a build finishes.
```
gulp
```
4. Open `dist/index.html` in a web browser, refresh the page whenever the project is rebuilt.
## Usage
See the [documentation](https://github.com/universalbit-dev/CityGenerator/blob/master/docs/usageguide.md).

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
