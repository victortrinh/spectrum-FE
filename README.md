# Welcome to Spectrum (Front-End)

Spectrum is a Web application for dynamically creating a music data set. It is Spotify-compatible and creates a database using Spotify's free 30-second samples and performing various feature extraction and signal processing to create a data set ready for applied machine learning.
Our objective is to build a tested, standard and easy to deploy Web application for creating a music data set.

# Authors

* Loic Grant-Steinhardt -
* Loic Prenevost -
* Eric Charbonneau -
* Jean-Christophe Bernard -
* Victor Trinh - [victortrinh](https://github.com/victortrinh) 

Under the supervision of
* Pierre-Luc Delisle - [pldelisle](https://github.com/pldelisle) 
* Michael McGuffin

# Setup
## Yarn
### Install yarn
https://yarnpkg.com/en/docs/install#windows-stable

### Install npm and node

## Application
### Install react-scripts
yarn add react-scripts

### Install packages
yarn install

### Run application 
yarn start

# Project architecture
## Folder structure

```bash
├── src
│   ├── @types
│   ├── common
│   │   ├── api
│   │   |   ├── service.ts
│   │   ├── components
│   │   |   ├── SharedAppComponents.tsx
│   │   ├── images
│   │   ├── resources
│   │   ├── responsive
│   │   ├── styles
│   ├── page
│   │   ├── common
│   │   |   ├── models
│   │   |   ├── SharedPageComponents.tsx
│   │   ├── PageComponents.tsx
│   │   ├── PageApp.tsx
│   ├── App.tsx
│   ├── index.tsx
```

# Contributing
If you find a bug or have an idea for an improvement, please first have a look at our [contribution guideline](https://github.com/pldelisle/spectrum/blob/master/CONTRIBUTING.md). Then,
- [X] Create a branch by feature and/or bug fix
- [X] Get the code
- [X] Commit and push
- [X] Create a pull request

# Branch naming

| Instance        | Branch                                              | Description, Instructions, Notes                   |
|-----------------|-----------------------------------------------------|----------------------------------------------------|
| Stable          | stable                                              | Accepts merges from Development and Hotfixes       |
| Development     | dev/ [Short description] [Issue number]             | Accepts merges from Features / Issues and Hotfixes |
| Features/Issues | feature/ [Short feature description] [Issue number] | Always branch off HEAD or dev/                     |
| Hotfix          | fix/ [Short feature description] [Issue number]     | Always branch off Stable                           |

# Commits syntax

##### Adding code:
> \+ Added [Short Description] [Issue Number]

##### Deleting code:
> \- Deleted [Short Description] [Issue Number]

##### Modifying code:
> \* Changed [Short Description] [Issue Number]

##### Merging branches:
> Y Merged [Short Description]

# Acknowledgment
Thanks to [École de technologie supérieure](https://www.etsmtl.ca/) and [Michael McGuffin ](https://www.etsmtl.ca/en/research/professors/mmcguffin/) for supervising this final project.

Icons made by <a href="http://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>