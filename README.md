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
##### [WebSite](https://maps.probabletrain.com/#/)
##### [Support](https://ko-fi.com/probabletrain)

This tool procedurally generates images of city maps. The process can be automated, or controlled at each stage give you finer control over the output.
#### [Generated](https://github.com/universalbit-dev/CityGenerator/blob/master/docs/algorithmoverview.md) cities can be downloaded as a | '.png' | '.svg' | 'heightmap'| 

#### Getting Started
* [Blender](https://www.blender.org/)
* [Building Tools](https://github.com/universalbit-dev/building_tools)
* [ThreeJS](https://threejs.org/manual/#en/fundamentals)
  
To get a local copy up and running follow these steps.
##### Install [Nodejs 18.15.0](https://nodejs.org/en/blog/release/v18.15.0)
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```
```
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```
```
nvm i 18
```


* [Gulp](https://www.npmjs.com/package/gulp)
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

### Workers
multi-threaded CPU miner for Litecoin and Bitcoin

[Installation](https://github.com/universalbit-dev/CityGenerator/tree/master/workers#readme)

#### setup folder permission: 
```
sudo chmod 755 -R workers
```

## Contributing
Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact
##### [UniversalBit](https://github.com/universalbit-dev)
##### Keir - [@probabletrain](https://twitter.com/probabletrain) - probabletrain@gmail.com
##### Project Link: [https://github.com/probabletrain/mapgenerator](https://github.com/probabletrain/mapgenerator)
#### [Contributors](https://github.com/ProbableTrain/MapGenerator#contributors-)


## License
Distributed under the LGPL-3.0 License. See [lgpl-3.0.txt](https://www.gnu.org/licenses/lgpl-3.0.txt)

[Bash Reference Manual](https://www.gnu.org/software/bash/manual/html_node/index.html)


