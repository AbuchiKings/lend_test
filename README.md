#### **BASE URL** - [https://abuchi-ndinigwe-lendsqr-be-test.koneqtor.com/api/v1](https://abuchi-ndinigwe-lendsqr-be-test.koneqtor.com/api/v1) 

* [Technologies Used](#technologies-used)
* [Features](#features)
* [Entity Relations](#E-R-Diagram)
* [API Endpoints](#api-endpoints)
* [Getting Started](#getting-started)
    * [Installation](#installation)
    * [Testing](#testing)
* [Authors](#authors)



## Technologies Used

* [Node.js](https://nodejs.org) - A runtime environment based off of Chrome's V8 Engine for writing Javascript code on the server.
* [MySQL](https://www.mysql.com) - An Object relational database.
* [Express.js](https://expressjs.com) - A Node.js framework.
* [Typescript](https://www.typescriptlang.org/) - Superset of Javascript.
* [Docker](hhttps://www.docker.com/) - Containerization.
* [Docker-Compose](https://docs.docker.com/compose/) - Container orchestration tool.
* [Redis](https://redis.io/) - Cache database.
* [Knexjs](https://knexjs.org/) - A NodeJS ORM for RDBMS.
* [Postman](https://www.getpostman.com/) - API testing environment.
* [Jest](https://jestjs.io/) - Javascipt Test Framework.



## Features

* Users can sign up for accounts.
* Users can log into their accounts.
* Users can have a wallet.
* Users can fund wallet.
* Users can transfer from wallet to other users.
* Users can withdraw from wallet.

## E-R Diagram

![Entity Relations](E-R.jpeg) 


## API Endpoints

* POST Signup User                  (/auth/signup)
* POST Login User                   (/auth/login)
* POST Fund Wallet                  (/transaction/fund)
* POST Transfer Funds               (/transaction/transfer)
* POST Withdraw From Wallet         (/transaction/withdraw/)





## Getting Started

### Installation

Ensure you have docker installed. Provided environment variables as shown in sample env. On the project root folder:

* Run `make up-d` to build and startup container.
* Run `make down` to shut down


### Testing

Testing was carried out using jest testing framework

## Authors
*  Abuchikings