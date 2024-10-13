# Harvard Burger 🍔

Harvard Burger is a fun, voice-powered food ordering system that simulates a drive-through experience with an entertaining twist! Instead of a regular order-taker, you'll interact with an AI that has a quirky, funny personality. It uses voice detection and AI to transcribe, process, and fulfill orders, making the whole experience engaging and dynamic.

## Table of Contents

-   [Harvard Burger 🍔](#harvard-burger-)
    -   [Table of Contents](#table-of-contents)
    -   [Inspiration](#inspiration)
    -   [What It Does](#what-it-does)
    -   [How We Built It](#how-we-built-it)
    -   [Challenges We Ran Into](#challenges-we-ran-into)
    -   [Accomplishments That We're Proud Of](#accomplishments-that-were-proud-of)
    -   [What We Learned](#what-we-learned)
    -   [What's Next for Harvard Burger](#whats-next-for-harvard-burger)
-   [How to Run](#how-to-run)
    -   [Prerequisites](#prerequisites)
    -   [Using Node and Python](#using-node-and-python)
        -   [Node](#node)
        -   [Python](#python)
    -   [Using Docker](#using-docker)

## Inspiration

We were inspired by the Smart Cities track and wanted to build something with direct utility—like ordering food—while keeping the interaction fun and playful. With Harvard Burger, we set out to bring a more engaging experience to the traditional drive-through by adding a humorous AI.

## What It Does

-   Detects when you start and stop speaking.
-   Uses AI to transcribe your voice input.
-   Figures out what food items you want to order, including specific details like size and flavor.
-   Generates audio responses with text-to-speech to confirm your order in an amusing way.

## How We Built It

-   **Frontend:** Built with React and TypeScript for handling the user interface.
-   **Backend:** Powered by Flask and Python, managing the AI logic and order processing.
-   **Deployment:** Containerized with Docker, deployed using Defang for cloud hosting.

## Challenges We Ran Into

-   Integrating the frontend, backend, and AI systems to communicate smoothly.
-   Ensuring seamless communication between different parts of the app after deployment.
-   Fine-tuning the AI’s ability to accurately process order details while maintaining a fun, natural conversation.

## Accomplishments That We're Proud Of

-   We successfully implemented all the key features we envisioned.
-   We created a fully functional, deployed version of the app.
-   Overcame technical hurdles in both communication between app components and cloud deployment.

## What We Learned

-   We refined our skills in React, TypeScript, Flask, and Python, especially in how they interact.
-   Learned how to containerize and deploy apps using Docker and Docker Compose.
-   Gained experience deploying to the cloud with Defang.

## What's Next for Harvard Burger

We plan to expand the app by adding a business-facing interface, allowing restaurants to view and fulfill customer orders directly. This will turn _Harvard Burger_ into a practical tool for restaurants, beyond just a fun hackathon project.

# How to Run

## Prerequisites

-   [Node](nodejs.org)
-   [Python](https://www.python.org/)
    -   openai
    -   flask
    -   python-dotenv

or

-   [Docker](https://www.docker.com/get-started)

## Using Node and Python

The first option to running locally is running using node and desktop.

```bash
git clone https://github.com/GrantDeWaay/HackHarvard2024
cd HackHarvard2024
```

### Node

```bash
cd frontend
npm install
npm start
```

### Python

```bash
cd backen
python main.py
```

## Using Docker

```bash
docker compose up
```

navigate to http://localhost:3000/
