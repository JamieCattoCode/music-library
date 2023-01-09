const db = require('../db/index');

exports.createArtist = async (req, res) => {
    const { name, genre } = req.body
  
    try {
      const { rows: [ artist ] } = await db.query('INSERT INTO Artists (name, genre) VALUES ($1, $2) RETURNING *', [name, genre]);
      res.status(201).json(artist);
    } catch (err) {
      res.status(500).json(err.message);
    }
  }

exports.readArtists = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM Artists');
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json(err.message);
    }
}

exports.readArtist = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows: [artist] } = await db.query('SELECT * FROM Artists WHERE id = $1', [id]);

        if (!artist) {
            return res.status(404).json({ message: `Artist ${id} does not exist.` });
        }

        res.status(200).json(artist);
    } catch (err) {
        res.status(500).json(err.message);
    }
}

exports.updateArtist = async (req, res) => {
    const { id } = req.params;
    const { name, genre } = req.body;
    let query;
    let paramArray;

    if (name && genre) {
        query = 'UPDATE Artists SET name = $1, genre = $2 WHERE id = $3 RETURNING *'
        paramArray = [name, genre, id];
    } else if (name) {
        query = 'UPDATE Artists SET name = $1 WHERE id = $2 RETURNING *'
        paramArray = [name, id];
    } else if (genre) {
        query = 'UPDATE Artists SET genre = $1 WHERE id = $2 RETURNING *'
        paramArray = [genre, id];
    }

    try {
        const { rows: [artist] } = await db.query(query, paramArray);

        if(!artist) {
            return res.status(404).json({ message: `Artist ${id} does not exist.` })
        }

        res.status(200).json(artist);

    } catch (err) {
        res.status(500).json(err);
    }

}

exports.deleteArtist = async (req, res) => {
    const { id } = req.params;
    console.log(`ID = ${id}`);
    const query = `DELETE FROM Artists WHERE (id = $1) RETURNING *`
    
    try {
        const { rows: [artist] } = await db.query(query, [id]);

        if (!artist) {
            res.status(404).json({ message: `Artist ${id} does not exist.` })
        }

        res.status(200).json(artist);

    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
}
