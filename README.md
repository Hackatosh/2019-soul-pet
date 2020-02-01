# Soul Pet

Welcome to Soul Pet repository !

Soul Pet is a social network for all your animals ! 
The project was initiated as an academic project at [CentraleSupélec](https://www.centralesupelec.fr/).

A running version of the project is available [here](https://soul-pet.cs-campus.fr/).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Before being able to run this project, you need to install :
* [Docker](https://docs.docker.com/install/)
* [Docker Compose](https://docs.docker.com/compose/install/)

This will allows your system to run our application in container by using the docker-compose.yml file.

### Installing

Running the development environment using Docker Compose is very easy !

First, you have to build the project. Go to the root of the project and use the command :

```
docker-compose build
```

Then, you just have to launch the application :

```
docker-compose up
```

You can now connect directly to the application on :

```
localhost
```

Or access the API on :

```
localhost:3001/api
```

When finished, you can stop the application using the following command :

```
docker-compose stop
```

Please note that you can edit docker-compose.yml to modify the ports used by the application.

## Running the tests

Instructions to run Jest are coming soon !

## Deployment

The only difference with the testing environment is that a container with an Nginx reverse-proxy and Cerbot is added to this configuration.

To deploy the project on a live system, you first have to edit the configuration of the **letsencrypt** container in **docker-compose-prod.yml** file.
You have to modify the EMAIL and the URL, which has to correspond to your domain name.

Then, go to the root of the project and use the following command to build the project :

```
docker-compose -f docker-compose-prod.yml build
```

Then run the application using :

```
docker-compose -f docker-compose-prod.yml up
```

The application can then be accessed on :

```
https//your-domain.your-extension
```

The API can directly be accessed on :

```
https//your-domain.your-extension/api
```

When finished, you can stop the server using :

```
docker-compose -f docker-compose-prod.yml stop
```

## Built With

The whole project is written in [Typescript](https://www.typescriptlang.org/docs/home.html). The package management is done with [Yarn](https://yarnpkg.com/) for both the front-end and the back-end.

**Back-End**
* [NodeJS](https://nodejs.org/en/docs/) - Server-side JavaScript runtime environment
* [ExpressJS](https://expressjs.com/) - Web application framework for NodeJS
* [Sequelize](https://sequelize.org/v5/) - ORM for NodeJS
* [MariaDB](https://mariadb.org/) - Relational database management system 
* [atmoz/sftp](https://github.com/atmoz/sftp) - A docker container which runs a SFTP server. Used for storage purpose.

**Front-End**
* [ReactJS](https://reactjs.org/) - Javascript Library used to build the UI
* [create-react-app](https://create-react-app.dev/docs/documentation-intro) - Tool used to bootstrap our React single page application
* [Bootstrap](https://getbootstrap.com/docs/4.4/getting-started/introduction/) - CSS Framework
* [Bootswatch](https://bootswatch.com/) - Themes library for Bootstrap

**Testing**
* [Jest](https://jestjs.io/) - Javascript testing framework

**Deployment**
* [Docker](https://www.docker.com/) - Tool used to run the application in containers (use [Docker-Compose](https://docs.docker.com/compose/))
* [linuxserver/letsencrypt](https://hub.docker.com/r/linuxserver/letsencrypt/) - A docker container which runs certbot and a nginx reverse proxy. Used only in production for HTTPS.

## Contributing

This project does not accept public contribution for now, but if you have any questions on the current state (or want to change my mind about contributions :P), feel free to contact us !
Contact : Edouard Benauw ([Hackatosh](https://github.com/Hackatosh))

## Authors

* **Antoine Apollis** ([apollisa](https://github.com/apollisa)) - *Front-End & CI Configuration*
* **Edouard Benauw** ([Hackatosh](https://github.com/Hackatosh)) - *Back-End & Deployment*
* **Benoît Damiani** ([damianib](https://github.com/damianib)) - *Back-End*
* **Alexis Herbert** ([Raklyon](https://github.com/Raklyon)) - *Front-End*
* **Marine Sobas** ([Marsobad](https://github.com/Marsobad)) - *Back-End* 
* **Adrien Videgrain** ([Zizol](https://github.com/Zizol)) - *Front-End*

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to our teachers, which will have to read all of this !
* Huge thanks to [ViaRézo](https://viarezo.fr/) for allowing us to use one of their virtual machine to run our application
* Thanks to CentraleSupélec 