const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bookstore',
  password: 'Kaushik12!',
  port: 5432,
})
const pug = require('pug');

const getBooks = (request, response) => {
  pool.query('SELECT * FROM public.books ORDER BY isbn ASC', (error, results) => {
    if (error) {
      throw error
    }
    //Cause we kinda fucked up book so placeholder data set
    //let data = pug.renderFile("index.pug",{books:results.rows});
    let res = [
    {'isbn':1, 'name': 'Spencers Life','royalty':5,'lastMonthSales':0,'page_num':10,'price':10.99,'pID':2},
    {'isbn':2, 'name': 'Pauls Book','royalty':1,'lastMonthSales':0,'page_num':69,'price':4.20,'pID':1}]
    let data = pug.renderFile("index.pug",{books:res});
    //console.log(results)
    response.statusCode = 200;
    response.send(data)
    //response.status(200).json(results.rows)
  })
}

const getBookInfo = (request, response) => {
  const query = {
    text: 'SELECT * FROM public.books WHERE isbn = $1',
    values: [request.params.isbn],
  }
  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }

    //let data = pug.renderFile("index.pug",{books:results.rows});
    //let res = [
    //{'isbn':1, 'name': 'Spencers Life','royalty':5,'lastMonthSales':0,'page_num':10,'price':10.99,'pID':2},
    //{'isbn':2, 'name': 'Pauls Book','royalty':1,'lastMonthSales':0,'page_num':69,'price':4.20,'pID':1}]
    //let data = pug.renderFile("index.pug",{books:res});
    //console.log(results)
    //response.statusCode = 200;
    //response.send(data)
    response.status(200).json(results.rows)
  })
}

module.exports = {
  getBooks,
  getBookInfo
}