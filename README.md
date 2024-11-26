# My Contributors

My Contributors is a GitHub crew generator that allows you to fetch and display information about GitHub users and their repositories. This project is built using Next.js, Tailwind CSS, and TypeScript.

## Features

- Fetch GitHub user details
- Display user information in a card format
- Copy user profile link to clipboard
- Preview top 10 collaborators in a GitHub repository with the copied URL

## Installation

1. Clone the repository:
	```sh
	git clone https://github.com/your-username/my-contributors.git
	```
2. Navigate to the project directory:
	```sh
	cd my-contributors
	```
3. Install dependencies:
	```sh
	npm install
	```

## Usage

1. Start the development server:
	```sh
	npm run dev
	```
2. Open your browser and navigate to `http://localhost:3000`.

## Project Structure

- `app/layout.tsx`: Defines the root layout of the application.
- `app/page.tsx`: Contains the main page component and logic for fetching and displaying GitHub user data.
- `components/userCard.tsx`: Component for displaying user information in a card format.
- `components/ui/input.tsx`: Custom input component.
- `components/inputArea.tsx`: Component for the input area where users can enter a GitHub username.
- `tailwind.config.ts`: Tailwind CSS configuration file.
- `components.json`: Configuration file for component aliases and settings.

## Example

To fetch and display a GitHub user's information, enter the GitHub username in the input field and click the "Find" button. The user's details will be displayed in a card format. You can also preview the top 10 collaborators in a GitHub repository using the copied URL.

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [GitHub API](https://docs.github.com/en/rest)
