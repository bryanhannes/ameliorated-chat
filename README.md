# Ameliorated Chat

Ameliorated Chat is a better UI for ChatGPT, but completely Open Source and build with Angular and Nest.

The Angular code base is build with lots of opinionated best practices in mind with as little external dependencies as
possible.

This repository is a monorepo managed by [Nx](https://nx.dev) and currently contains the following apps:

- chat: the Angular front end

## Features

This project is still in development, but we have listed to features we want to implement at some point.
If you have any suggestions, please open an issue or make a contribution.

## Existing features

- [x] As a user I should be able to enter my OpenAI API key (saved to localstorage)
- [x] As a user I should be able to see my history of chats (saved to localstorage)
- [x] As a user I should be able to delete chats
- [x] As a user I should be able to start a new chat
- [x] As a user I should be able to update the title of a chat
- [x] As a user I should be able to update my profile picture
- [x] Streaming the chat response
- [x] Deploy somewhere
- [x] A title should be automatically generated when creating a new chat
- [x] As a user I should be able to send a new message by pressing enter or clicking a send button
- [x] As a user I should be able to set the model for the current chat
- [x] As a user I should be able to select the temperature for the current chat
- [x] As a user I should be able to set the initial system message for the current chat
- [x] As a user I should be able to set a default model for future chats
- [x] As a user I should be able to set a default temperature for future chats
- [x] As a user I should be able to set a default initial system message for future chats
- [x] As a user I should be able to mark chats as favorites

- ## Planned features/technical improvements
- [ ] As a user I should be able to group chats in a folder
- [ ] As a user I should be able to choose between a list of default messages
- [ ] As a user I should be able to toggle between light and dark mode
- [ ] Nice loading animations
- [ ] As a user I should be able to select a prompt from a prompt library
- [ ] Responses should have some markup (e.g. bold, italic, links, etc.)
- [ ] Responses should add markup for code examples
- [ ] As a user I should see my chat history in a timeline (grouped by date) Today - yesterday - last 7 days - last 30
  days (check how chatGPT does this)
- [ ] As a user I should be able to add a new chat by with query params = text for the message and model for the model

## Running the project

Checkout the project and run `npm install` to install all dependencies.

### Running the front end

Run `nx run chat:serve` to start the Angular front end

## Suggestions

If you have any suggestions how to improve this project, please open an issue or make a contribution.

## Credits

- Ameliorated Chat is inspired by [TypingMind](https://www.typingmind.com/) build
  by [Tony Dinh](https://twitter.com/tdinh_me)
