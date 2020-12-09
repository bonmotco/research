const db = require('./db');
const { Movie, Person } = db.models;
const { Op } = db.Sequelize;

(async () => {
  await db.sequelize.sync({ force: true });

  try {
    // Movies
    await Movie.create({
      title: 'Toy Story',
      runtime: 81,
      releaseDate: '1995-11-22',
      isAvailableOnVHS: true,
    });

    await Movie.create({
      title: 'Toy Story 2',
      runtime: 62,
      releaseDate: '1999-11-24',
      isAvailableOnVHS: true,
    });

    await Movie.create({
      title: 'The Incredibles',
      runtime: 115,
      releaseDate: '2004-04-14',
      isAvailableOnVHS: true,
    });

    const movie3 = await Movie.build({
      title: 'Toy Story 3',
      runtime: 103,
      releaseDate: '2010-06-18',
      isAvailableOnVHS: false,
    });
    await movie3.save();

    // People
    await Person.create({
      firstName: 'Tom',
      lastName: 'Hanks',
    });

    const person2 = await Person.build({
      firstName: 'Brad',
      lastName: 'Bird',
    });
    await person2.save();

    // Finder methods ------------------------------------------------------ /
    // const movieById = await Movie.findByPk(1);
    // console.log(movieById.toJSON());

    // const movieByRuntime = await Movie.findOne({ where: { runtime: 115 } });
    // console.log(movieByRuntime.toJSON());

    const movies = await Movie.findAll({
      attributes: ['id', 'title'],
      where: {
        releaseDate: {
          [Op.gte]: '2004-01-01', // greater than or equal to the date
        },
        runtime: {
          [Op.gt]: 95, // greater than 95
        },
      },
      order: [['id', 'DESC']]
    });
    console.log( movies.map(movie => movie.toJSON()) );

  } catch(error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      console.error('Validation errors: ', errors);
    } else {
      throw error;
    }
  }
})();
