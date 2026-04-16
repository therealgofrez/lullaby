<a id="readme-top"></a>


[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![GNU GPLv3 License][license-shield]][license-url]


<br />
<div align="center">
  <a href="https://github.com/therealgofrez/lullaby">
    <img src="icon.svg" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Lullaby</h3>

  <p align="center">
    A dreamcore-inspired tool for discovering relaxing YouTube videos
    <br />
    <br />
    <a href="https://github.com/therealgofrez/lullaby">View Demo</a>
    &middot;
    <a href="https://github.com/therealgofrez/lullaby/issues">Report Bug</a>
    &middot;
    <a href="https://github.com/gofrez/therealgofrez/issues">Request Feature</a>
  </p>
</div>



<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



## About The Project

Lullaby is a web tool that helps you discover random youtube videos to help you fall asleep or just find some unknown videos. It searches for old and obscure videos using the YouTube API, giving you a cozy, dreamcore-inspired interface to explore content.

Features:
* Random video discovery from various relaxing categories (ASMR, ambient sounds, video essays, documentaries, etc.)
* Custom search with random date ranges to find hidden gems
* Night mode for comfortable late-night browsing
* Sleep timer with visual countdown
* Immersive mode to reduce distractions while watching
* Auto-redirect option to open videos directly on YouTube

> **Note:** Due to YouTube API limitations, the tool may sometimes return popular or mainstream videos. You might need to draw multiple times to find truly obscure and interesting content. The randomization helps, but the algorithm isn't perfect!




### Built With

* Vanilla JavaScript
* YouTube IFrame API
* Lucide Icons




## Getting Started

To get a local copy up and running follow these steps.

### Prerequisites

* A YouTube Data API v3 key (free from Google Cloud Console)
* A local web server (Python's http.server, Live Server extension, etc.)

### Installation

1. Get a free YouTube API Key at [https://console.cloud.google.com/apis/api/youtube.googleapis.com](https://console.cloud.google.com/apis/api/youtube.googleapis.com)
2. Clone the repo
   ```sh
   git clone https://github.com/gofrez/lullaby.git
   ```
3. Start a local web server (required for YouTube embed to work)
   ```sh
   python -m http.server 8000
   ```
   Or use VS Code's Live Server extension
4. Open `http://localhost:8000` in your browser
5. Click the settings icon and enter your YouTube API key
6. Start discovering videos!

## Usage

1. **Random Discovery**: Click the "Draw" button or press Space to get a random relaxing video
2. **Custom Search**: Type keywords in the search box (e.g., "rain sounds", "video essay", "lo-fi")
3. **Night Mode**: Press 'N' or click the moon icon for a darker theme
4. **Sleep Timer**: Set a timer in settings to auto-pause after 15m, 30m, 45m, 1h, or 1.5h
5. **Immersive Mode**: Toggle in settings to hide UI elements while watching
6. **Keyboard Shortcuts**:
   - `Space` - Draw a new video
   - `N` - Toggle night mode
   - `Esc` - Go back home or close settings



## Roadmap

- [x] Random video discovery
- [x] Night mode
- [x] Sleep timer
- [x] Immersive mode
- [ ] Save favorite videos
- [ ] Playlist creation
- [ ] More search filters
- [ ] Video history

See the [open issues](https://github.com/therealgofrez/lullaby/issues) for a full list of proposed features (and known issues).



## Contributing

Contributions are welcome! If you have suggestions or improvements:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request




## License

Distributed under the GNU General Public License v3.0. See `LICENSE` for more information.



## Contact

Gofrez - [@gofrez](https://github.com/therealgofrez)

Project Link: [https://github.com/gofrez/lullaby](https://github.com/gofrez/lullaby)



## Acknowledgments

* [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference)
* [Lucide Icons](https://lucide.dev/)
* [Google Fonts](https://fonts.google.com/)
* [Best README Template](https://github.com/othneildrew/Best-README-Template)






[contributors-shield]: https://img.shields.io/github/contributors/gofrez/lullaby.svg?style=for-the-badge
[contributors-url]: https://github.com/gofrez/lullaby/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/gofrez/lullaby.svg?style=for-the-badge
[forks-url]: https://github.com/gofrez/lullaby/network/members
[stars-shield]: https://img.shields.io/github/stars/gofrez/lullaby.svg?style=for-the-badge
[stars-url]: https://github.com/gofrez/lullaby/stargazers
[issues-shield]: https://img.shields.io/github/issues/gofrez/lullaby.svg?style=for-the-badge
[issues-url]: https://github.com/gofrez/lullaby/issues
[license-shield]: https://img.shields.io/github/license/gofrez/lullaby.svg?style=for-the-badge
[license-url]: https://github.com/gofrez/lullaby/blob/master/LICENSE
