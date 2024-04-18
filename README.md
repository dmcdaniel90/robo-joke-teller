# Joke Teller

This project, named "Joke Teller", is a fun and interactive web application that delivers jokes to the user, originally created as part of the Zero To Mastery course, "20 Javascript Projects". It has been extended to use modern web technologies such as Typescript and Parcel and additional features have been added to enhance the user experience.

## Getting Started

- [Live Demo](https://dmcdaniel90.github.io/robo-joke-teller)

**Note**: The application uses the JokeAPI to fetch jokes. The free version of the API has a limit of 50 requests per day. If the limit is reached, the application will display a message to the user.

**Warning** The JokeAPI includes adult content. The application, by default, filters out jokes that are flagged as explicit, but the user can choose to display them by toggling the "NSFW Mode" button. I am not responsible for any inappropriate content that may be presented or any offense caused.

## Technology Stack

- **HTML/CSS**: For structuring and styling the web pages.
- **TypeScript**: Used for adding interactivity and handling API requests.
- **Parcel**: As the web application bundler, facilitating development and build processes.

## Prerequisites

- Node.js and npm (Node Package Manager)
- A modern web browser

## Installation

1. Clone the repository:

```bash
git clone https://github.com/dmcdaniel90/robo-joke-teller.git
```

2. Navigate to the project directory:

```bash
cd robo-joke-teller
```

3. Install the project dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

## Future Improvements

- Add a feature to allow the user to share jokes on social media
- Implement a more organised Typescript structure
- Migrate to a more robust API for fetching jokes

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Zero To Mastery](https://zerotomastery.io/)
- [JokeAPI](https://jokeapi.dev/)
- [Parcel](https://parceljs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [GitHub Pages](https://pages.github.com/)

## Collaboration

If you would like to collaborate on this project, please feel free to fork the repository and submit a pull request.
