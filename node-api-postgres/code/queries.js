const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bookstore',
  password: 'password',
  port: 5432,
})
const pug = require('pug');

const fs = require('fs');
//let file = fs.readFileSync('./ddl.sql').toString();

//raw buffer is returned
console.log(fs.readFileSync('./ddl.sql'));
//buffer toString
console.log(fs.readFileSync('./ddl.sql').toString());

//creating tables
pool.query(fs.readFileSync('./ddl.sql').toString(), (err, result) =>{  
  if (err){
    throw err
  }
  console.log("success")
});

//mock data
/*
pool.query(fs.readFileSync('./mock_data.sql').toString(), (err, result) =>{  
  if (err){
    throw err
  }
  console.log("success")
});
*/

const getBooks = (request, response) => {
  pool.query('SELECT * FROM public.book ORDER BY isbn ASC', (error, results) => {
    if (error) {
      throw error
    }
    (results.rows).forEach(function (element) {
      const query = {
        text: 'SELECT author,genre FROM public.book_records WHERE isbn = $1',
        values: [element.isbn],
      }
      pool.query(query, (error, results2) => {
        if (error) {
          throw error
        }
        element.authors = [];
        element.genres = [];
        results2.rows.forEach(function (element2) {
          element.authors.push(element2.author);
          element.genres.push(element2.genre);
        });
        
        console.log(element)
      })
      
    });
    //console.log(results.rows)
    let data = pug.renderFile("index.pug",{books:results.rows});
    response.statusCode = 200;
    response.send(data)
  })
}

const getBookInfo = (request, response) => {
  const query = {
    text: 'SELECT * FROM public.book WHERE isbn = $1',
    values: [request.params.isbn],
  }
  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    //console.log(results.rows[0])
    let data = pug.renderFile("book.pug",{book:results.rows[0]});
    response.statusCode = 200;
    response.send(data)
    
  })
}

const getUsers = (request, response) => {
  pool.query('SELECT * FROM public.users ORDER BY uid ASC', (error, results) => {
    if (error) 
    {
      throw error
    }
    let data = pug.renderFile("users.pug",{users:results.rows});
    response.statusCode = 200;
    response.send(data);
  })
}

module.exports = {
  getUsers,
  getBooks,
  getBookInfo
}