# ChatGPT Plugin for Hexabot Chatbot Builder

The ChatGPT Plugin integrates OpenAI’s ChatGPT model with Hexabot chatbot workflows to enable Retrieval-Augmented Generation (RAG) capabilities. This plugin allows users to enrich their chatbot responses using relevant content retrieved from a content management system, making interactions more contextual and accurate.

[Hexabot](https://hexabot.ai/) is an open-source chatbot / agent solution that allows users to create and manage AI-powered, multi-channel, and multilingual chatbots with ease. If you would like to learn more, please visit the [official github repo](https://github.com/Hexastack/Hexabot/).

## Prerequisites

Before setting up the ChatGPT Plugin, you will need to generate an API token from OpenAI.

1. Go to the [OpenAI API page](https://openai.com/api).
2. Obtain your API key.
3. Once you have your API key, you can configure the plugin in Hexabot.

## Installation

First, navigate to your Hexabot project directory and make sure the dependencies are installed:

```sh
cd ~/projects/my-chatbot
npm install hexabot-plugin-chatgpt
hexabot dev
```

## Configuration

The ChatGPT Plugin provides several customizable settings that can be configured through the Hexabot admin interface:

- **Model**: The model to be used for generating responses (e.g., `gpt-4o-mini`).
- **Response Size**: The maximum number of tokens in the AI response.
- **Messages to Retrieve**: The number of recent messages to include as context when making requests to OpenAI.
- **Context**: A description or context of the chatbot’s role to guide its responses.
- **Instructions**: Custom instructions for how the AI should handle responses based on your use case.

## How to Use

1. Access settings and confure the API Token.
2. Access the Hexabot Visual Editor and Drag the ChatGPT Plugin block from "Custom Blocks" onto the canvas.
3. Double-click the block to edit and configure the plugin’s settings, including the model, context and other options.

## Contributing

We welcome contributions from the community! Whether you want to report a bug, suggest new features, or submit a pull request, your input is valuable to us.

Please refer to our contribution policy first : [How to contribute to Hexabot](./CONTRIBUTING.md)

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](./CODE_OF_CONDUCT.md)

Feel free to join us on [Discord](https://discord.gg/rNb9t2MFkG)

## License

This software is licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:

1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).

---

_Happy Chatbot Building!_
