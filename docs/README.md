<br />
<p align="center">
  <a href="https://github.com/probabletrain/mapgenerator">
      <img src="images/logo.png" alt="Logo" width="125" height="125">
  </a>

  <h3 align="center">Map Generator</h3>

  <p align="center">
    Create procedural American-style cities
    <br />
    <a href="https://probabletrain.itch.io/city-generator"><strong>Open Generator »</strong></a>
    <br />
    <br />
    <a href="https://github.com/probabletrain/mapgenerator/issues">Report Bug</a>
    ·
    <a href="https://github.com/probabletrain/mapgenerator/issues">Request Feature</a>
  </p>
</p>

<!-- TODO Changelog https://github.com/anikethsaha/docsify-plugin/tree/master/packages/docsify-changelog-plugin -->
<!-- TODO top announcement banner https://github.com/anikethsaha/docsify-plugin/tree/master/packages/docsify-top-banner-plugin -->



## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)



## About The Project

![Map Generator Screen Shot](images/screenshot.png)

This tool procedurally generates images of city maps. The process can be automated, or controlled at each stage give you finer control over the output. Generated cities can be downloaded as a `.png` or an `.svg`. There are a few choices for drawing style, ranging from colour themes similar to Google or Apple maps, to a hand-drawn sketch.


### Built With

* [Typescript](https://www.typescriptlang.org/)
* [Gulp](https://gulpjs.com/)


## Getting Started

To get a local copy up and running follow these steps.

### Prerequisites


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
git clone https://github.com/probabletrain/mapgenerator.git
```
2. Install NPM packages
```sh
cd mapgenerator
npm install
```
3. Add this line to `node_modules/@svgdotjs/svg.js/package.json`
```
"browserify": {
  "transform": [["babelify", { "presets": ["@babel/preset-env"] }]]
},
```
4. Build with Gulp. This will watch for changes to any Typescript files. If you edit the HTML or CSS you will have to rerun this command. [Gulp Notify](https://github.com/mikaelbr/gulp-notify) sends a notification whenever a build finishes.
```
gulp
```
5. Open `dist/index.html` in a web browser, refresh the page whenever the project is rebuilt.

## Roadmap

See the [open issues](https://github.com/probabletrain/mapgenerator/issues) for a list of proposed features (and known issues).




## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request




## License

Distributed under the GPL-3.0 License. See `LICENSE` for more information.



<!-- CONTACT -->

## Contact

Keir - [@probabletrain](https://twitter.com/probabletrain) - probabletrain@gmail.com

Project Link: [https://github.com/probabletrain/mapgenerator](https://github.com/probabletrain/mapgenerator)
