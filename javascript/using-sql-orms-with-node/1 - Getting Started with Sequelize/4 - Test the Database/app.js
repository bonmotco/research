const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'movies.db',
  // logging: false
});

// Movie model
class Movie extends Sequelize.Model {}
Movie.init({
      title: Sequelize.STRING
}, { sequelize });

(async () => {
  await sequelize.sync({ force: true });

  try {
    const movie = await Movie.create({
      title: 'Toy Story',
    });
    console.log(movie.toJSON());

    // New entry
    const movie2 = await Movie.create({
      title: 'The Incredibles'
    });
    console.log(movie2.toJSON());

  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();
