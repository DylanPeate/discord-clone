<h1 align="center">Discord Clone</ha>

<h3 align="center">A place to connect and talk to your friends.</h3>

<p align="center"><a  href="https://dylan-peate-capstone.herokuapp.com/">Live Demo</a></p>

### Splash Page

<img width="909" alt="Screen Shot 2022-06-15 at 7 57 20 AM" src="https://user-images.githubusercontent.com/96932019/179501425-1f2cdc7f-7fbb-4b21-843c-699eb4e24963.png">

### App

<img width="904" alt="Screen Shot 2022-06-15 at 7 58 25 AM" src="https://user-images.githubusercontent.com/96932019/179501534-1d3cbc29-ef3b-47cc-bf05-290996355851.png">

### Login

<img width="899" alt="Screen Shot 2022-06-15 at 8 00 27 AM" src="https://user-images.githubusercontent.com/96932019/179501656-ebf5b636-8d61-4241-a028-d9b12c3af999.png">

### Sign Up

<img width="898" alt="Screen Shot 2022-06-15 at 8 01 03 AM" src="https://user-images.githubusercontent.com/96932019/179501695-f743eb44-d83b-4ad6-a99e-2c9fe2f650c0.png">

## Discord at a Glance

Discord is a fullstack application which allows users to connect to different channels and chat in real time with the use of websockets.

## Getting Started

1. Clone the repository

```
git clone https://github.com/DylanPeate/discord-clone.git

```

2. Install dependencies

- In root folder, install Python server.

```
pipenv install
```

- Navigate to React-app folder, install React

```
cd React-app
npm install
```

3. Setup your PostgreSQL user, password and database

4. create a .env file in root folder, based on the .env.example with proper settings for your development environment

5. Migrate and seed your database in root folder

```
pipenv run flask db upgrade
pipenv run flask seed all

```

6. Start the server

- In root folder

```
pipenv run flask run
```

- Navigate to React-app folder

```
npm start
```

7. Have fun!

## Application Architecture

Discord is built around a react and redux front end, uses flask as a backend and postgres for a database.

### Technologies Used

- [Docker](https://www.docker.com/)
- [React.js](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [Javascript](https://www.javascript.com/)
- [Google Map API](https://developers.google.com/maps)
- [Python](https://www.python.org/)
- [Flask](https://flask.palletsprojects.com/en/2.1.x/)
- [Flask SQL Alchmeny](https://flask-sqlalchemy.palletsprojects.com/en/2.x/)
- [Flask Alembic](https://flask-alembic.readthedocs.io/en/stable/)
- [PostgresSQL](https://www.postgresql.org/)
- [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)

## Future Improvements

In the future I would like to impliment servers, dms, and voice chat.

## Conatact

- Dylan Peate
 <a href="https://www.linkedin.com/in/dylan-peate-839511231/">Linkedin</a>
 <a href="https://github.com/dylanpeate">Github</a>
 <a href="mailto:info@dylanpeate.com">Email me</a>
