##### [Support UniversalBit Project](https://github.com/universalbit-dev/universalbit-dev/tree/main/support)

## Table of Contents

* [About the Project](#about-the-project-probabletrain)
* [Getting Started](#getting-started)
* [Installation](#installation)
* [Workers](#workers)
* [3D Buildings](https://github.com/universalbit-dev/CityGenerator/tree/master/public/3D/buildings)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](https://www.gnu.org/licenses/lgpl-3.0.txt)
* [Contact](#contact)

##### About The Project: @probabletrain
* [WebSite](https://maps.probabletrain.com/#/)
* [Support](https://ko-fi.com/probabletrain)
  
---

##### This tool procedurally generates images of city maps. The process can be automated, or controlled at each stage give you finer control over the output.
#### [Generated](https://github.com/universalbit-dev/CityGenerator/blob/master/docs/algorithmoverview.md) city ​​map can be downloaded as map.png map.svg or map.png(heightmap) file.

#### Getting Started 3D modeling
* [Blender](https://www.blender.org/)
* [Building Tools](https://ranjian0.github.io/building_tools/)
* [ThreeJS](https://threejs.org/manual/#en/fundamentals)

To get a local copy up and running follow these steps.
##### Install [Node v20.6.0](https://nodejs.org/en/blog/release/v20.6.0)
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
```
```
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

```
[Node v20.6.0](https://nodejs.org/en/blog/release/v20.6.0)
```
nvm i 20
```
### Installation

* Clone the project
```
git clone https://github.com/universalbit-dev/CityGenerator.git citygenerator
```
* Install packages with npm 
```
cd citygenerator
npm i && npm audit fix
```


* Build with Gulp. This will watch for changes to any Typescript files. If you edit the HTML or CSS you will have to rerun this command.
[Gulp Notify](https://github.com/mikaelbr/gulp-notify) sends a notification whenever a build finishes.
```
gulp
```
* open `dist/index.html` in a web browser, refresh the page whenever the project is rebuilt.
* [documentation](https://github.com/universalbit-dev/CityGenerator/blob/master/docs/usageguide.md).
* [open issues](https://github.com/probabletrain/mapgenerator/issues) for a list of proposed features (and known issues).

### Workers
##### Multi-threaded CPU miner for Litecoin and Bitcoin
[Installation](https://github.com/universalbit-dev/CityGenerator/tree/master/workers#readme)


##### Contributing
##### Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**. For major changes, please open an issue first to discuss what you would like to change.

* Fork the Project
* Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
* Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
* Push to the Branch (`git push origin feature/AmazingFeature`)
* Open a Pull Request

## Contact
##### UniversalBit - [UniversalBit-dev](https://github.com/universalbit-dev)
##### Keir - [@probabletrain](https://twitter.com/probabletrain) - probabletrain@gmail.com
##### Project Link: [https://github.com/probabletrain/mapgenerator](https://github.com/probabletrain/mapgenerator)
#### [Contributors](https://github.com/ProbableTrain/MapGenerator#contributors-)


## License
Distributed under the LGPL-3.0 License. See [lgpl-3.0.txt](https://www.gnu.org/licenses/lgpl-3.0.txt)

[Bash Reference Manual](https://www.gnu.org/software/bash/manual/html_node/index.html)
