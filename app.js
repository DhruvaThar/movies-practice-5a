const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const pathDB = path.join(__dirname, "moviesData.db");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: pathDB,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("Server running at http://localhost:3001/");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// API 1

app.get("/movies/", async (request, response) => {
  const allMovies = `
    SELECT movie_name FROM Movie;`;
  allMovieQuery = await db.all(allMovies);
  response.send(allMovieQuery);
});

// API 2

app.post("/movies/", async (request, response) => {
  const newMovie = request.body;
  const { directorId, movieName, leadActor } = newMovie;
  const addMovie = `
    UPDATE Movie (director_id, movie_name, lead_actor)
    VALUES
    (
    ${directorId},
    "${movieName}",
    "${leadActor}");`;
  response.send("Movie Successfully Added");
});

// API 3

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovie = `
    SELECT * FROM Movie WHERE movie_id = ${movieId};`;
  const output = await db.get(getMovie);
  response.send(output);
});

// API 4

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const updateMovie = request.body;
  const { directorId, movieName, leadActor } = updateMovie;
  const updateMovieQuery = `
    UPDATE Movie
    SET director_id = ${directorId},
    movie_name = "${movieName}",
    lead_actor = "${leadActor}"
    WHERE movie_id = ${movieId};`;
  await db.run(updateMovieQuery);
  response.send("Movie Details Updated");
});

// API 5

app.delete("/movies/:movieId/", (request, response) => {
  const { movieId } = request.params;
  const Query = `
    DELETE FROM movie WHERE movie_id = ${movieId};`;
  response.send("Movie Removed");
});

// API 6

app.get("/directors/", async (request, response) => {
  const Query = `
    SELECT * FROM Director;`;
  const allDirectors = await db.all(Query);
  response.send(allDirectors);
});

// API 7

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const movieQuery = `
    SELECT movie_name FROM Movie WHERE director_id = ${directorId};`;
  const directorMovies = await db.all(movieQuery);
  response.send(directorMovies);
});
module.exports = app;
