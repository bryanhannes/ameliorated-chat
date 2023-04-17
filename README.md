# Ameliorated Chat

Ameliorated Chat is a better UI for ChatGPT, but completely Open Source and build with Angular and Nest.

The Angular code base is build with lots of opinionated best practices in mind with as little external dependencies as
possible.

This repository is a monorepo managed by [Nx](https://nx.dev) and currently contains the following apps:

- chat: the Angular front end
- api: the Nest back end

## Features

This project is still in development, but we have listed to features we want to implement at some point.
If you have any suggestions, please open an issue or make a contribution.

## Existing features

- [x] As a user I should be able to enter my OpenAI API key (saved to localstorage)
- [x] As a user I should be able to see my history of chats (saved to localstorage)

## Planned features/technical improvements

- [ ] Deploy somewhere
- [ ] As a user I should be able to start a new chat
- [ ] As a user I should be able to send a new message by pressing enter of clicking a send button
- [ ] As a user I should be able to delete chats
- [ ] As a user I should be able to group chats in a folder
- [ ] As a user I should be able to select the model
- [ ] As a user I should be able to select the temperature
- [ ] As a user I should be able to choose between a list of default messages
- [ ] As a user I should be able to toggle between light and dark mode
- [ ] A title should be automatically generated when creating a new chat
- [ ] As a user I should be able to update the title of a chat
- [ ] As a user I should be able to update my profile picture
- [ ] Nice loading animations
- [ ] Streaming the chat response
- [ ] As a user I should be able to select a prompt from a prompt library

## Running the project

Checkout the project and run `npm install` to install all dependencies.

### Running the front end

Run `nx run chat:serve` to start the Angular front end

### Running the back end

Run `nx run api:serve` to start the Nest back end

## Suggestions

If you have any suggestions how to improve this project, please open an issue or make a contribution.

## Credits

- Ameliorated Chat is inspired by [TypingMind]('https://www.typingmind.com/') build
  by [Tony Dinh]('https://twitter.com/tdinh_me')
