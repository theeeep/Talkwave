# Real-Time Chat Application Backend

## Overview

This repository contains the backend implementation for a real-time chat application. Built with modern web technologies, it provides a robust foundation for scalable, real-time communication.

## Table of Contents

1. [Features](#features)
2. [Technology Stack](#technology-stack)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Usage](#usage)
7. [API Documentation](#api-documentation)
8. [WebSocket Events](#websocket-events)
9. [Deployment](#deployment)

## Features

- Real-time messaging functionality
- Secure user authentication and authorization
- Persistent message storage using PostgreSQL
- Scalable architecture for high concurrent users
- RESTful API for easy integration with front-end applications

## Technology Stack

- **Runtime Environment:** Node.js
- **Web Framework:** Express.js
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Real-time Communication:** WebSocket
- **Authentication:** JSON Web Tokens (JWT)

## Prerequisites

Ensure you have the following installed:

- Node.js (v20.0.0 or higher)
- PostgreSQL (v12.0 or higher)
- pnpm (v9.0.0 or higher)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/theeeep/Talkwave.git
   cd Talkwave

2. Install dependencies:

  ```bash
  pnpm install
  ```

## Configuration

1. Create a .env file in the root directory:

  ```bash
  DATABASE_URL="postgresql://username:password@localhost:5432/chat_db"
PORT=3000
JWT_SECRET=your_secure_jwt_secret
```

## Usage

Start the server :

  ```bash
  pnpm start
  ```

The server will be accessible at `https://talkwave-uklm.onrender.com` (or the specified PORT on your local machine).

## API Documentation

## Authentication

- <span style="color: orange;">***POST /api/auth/signup***</span>
 : Resgister / Sign up a new user

    ```json
    Body
      {
       "fullName": "string",
       "userName": "string",
       "password": "string",
       "confirmPassword": "string",
       "gender": "string"
      }
    ```

- <span style="color: orange;">***POST /api/auth/login***</span> : Authenticate a user

    ```json
    Body
      { 
       "userName": "string",
       "password": "string",
      }
    ```

- <span style="color: orange;">***POST /api/auth/logout***</span> : Log Out user

- <span style="color:green;">***GET /api/auth/me***</span> : Get Authenticated user

    ```json
    Headers
      {
       "cookie" : "jwt Token"
      }
    ```

## Messages

- <span style="color: green;">***GET api/messages/id***</span> : To get all messages between sender and reviever, here id in  of recieverId

  ```json
    Headers
      {
       "cookie" : "jwt Token"
      }
    ```

- <span style="color: orange;">***POST api/messages/send/id***</span> : Send Message

     ```json
    Headers
      {
       "cookie" : "jwt Token"
      }

      Body
      {
        "message":"string"
      } 
    ```

- <span style="color: green;">***GET api/messages/users***</span> : Get all users

   ```json
    Headers
      {
       "cookie" : "jwt Token"
      }
    ```  

## WebSocket Events

- **connection** : Establish a new WebSocket connection
- **message** : Send/Recieve a new message
- **disconnect** : Handle client disconnection

## Deployment

This application is deployed and live on Render. You can access the live version at:
`https://talkwave-uklm.onrender.com`

### Accessing the Deployed Application

- **API Endpoint**:  Will add later using Swagger

### Deployment Configuration

If you're deploying your own instance on Render:

1. Create a new Web Service on Render.
2. Connect your GitHub repository.
3. Use the following settings:
   - **Environment**: Node
   - **Build Command**: `pnpm install && npx prisma generate && pnpx prisma migrate deploy`
   - **Start Command**: `pnpm start`
4. Add the following environment variables in the Render dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: Your secure JWT secret
   - `PORT`: 10000 (Render uses port 10000 by default)

Note: Ensure your `DATABASE_URL` points to a production-ready database, not your local development database.
