const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bookstore',
  password: 'Kaushik12!',
  port: 5432,
})

const getBooks = (request, response) => {
  pool.query('SELECT * FROM public.books ORDER BY isbn ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

module.exports = {
  getBooks
}