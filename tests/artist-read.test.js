const { expect } = require('chai')
const request = require('supertest')
const db = require('../src/db')
const app = require('../src/app')

describe('read artists', () => {
  let artists
  beforeEach(async () => {
    const responses = await Promise.all([
      db.query('INSERT INTO Artists (name, genre) VALUES( $1, $2) RETURNING *', [
        'Tame Impala',
        'rock',
      ]),
      db.query('INSERT INTO Artists (name, genre) VALUES( $1, $2) RETURNING *', [
        'Kylie Minogue',
        'pop',
      ]),
      db.query('INSERT INTO Artists (name, genre) VALUES( $1, $2) RETURNING *', [
        'Tame Antelope',
        'jazz',
      ]),
    ]);

    artists = responses.map(({ rows }) => rows[0]);
  });

  describe('GET /artists', () => {
    it('returns all artist records in the database', async () => {
      const { status, body } = await request(app).get('/artists').send();

      expect(status).to.equal(200);
      expect(body.length).to.equal(3);

      body.forEach((artistRecord) => {
        const expected = artists.find((a) => a.id === artistRecord.id);

        expect(artistRecord).to.deep.equal(expected);
      });
    });
  });

  describe('GET /artists/{id}', () => {
    it('returns a specific artist based on the id', async () => {
        console.log(artists);
        const { status, body } = await request(app).get(`/artists/${artists[0].id}`).send();

        expect(status).to.equal(200);
        expect(body).to.deep.equal(artists[0]);
    });

    it('returns an error if the artist is not in the database', async() => {
        const { status, body } = await request(app).get('/artists/999999999').send();

        expect(status).to.equal(500);
        expect(body.message).to.equal('Artist 999999999 does not exist.');
    });
  });
});