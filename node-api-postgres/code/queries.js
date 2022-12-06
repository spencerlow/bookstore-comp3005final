const pug = require('pug');
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bookstore',
  password: 'password',
  //password: 'student',
  port: 5432,
})

const fs = require('fs');
//let file = fs.readFileSync('./ddl.sql').toString();

//raw buffer is returned
//console.log(fs.readFileSync('./ddl.sql'));
//buffer toString
//console.log(fs.readFileSync('./ddl.sql').toString());

//creating tables
// pool.query(fs.readFileSync('../sql/ddl.sql').toString(), (err, result) =>{  
//   if (err){
//     throw err
//   }
//   console.log("success")
// });
async function databaseInit(req,res){
  console.log("Initializing Database");
  let ddl_insert = await pool.query(fs.readFileSync('../sql/ddl.sql').toString());
  let dml_insert = await pool.query(fs.readFileSync('../sql/mock_data.sql').toString());
}

databaseInit();
//mock data
//await pool.query(fs.readFileSync('../sql/mock_data.sql').toString());

const getBooks = async (request, response) => {
  let books = await pool.query('SELECT * FROM public.book ORDER BY isbn ASC');
  //console.log("BOOKS",books.rows);
  (books.rows) = Promise.all(books.rows.map(async book => {
    const query = {
      text: 'SELECT author,genre FROM public.book_records WHERE isbn = $1',
      values: [book.isbn],
    }
    let auth_gen = await pool.query(query);
    result = ({
      ...book,
      authors:auth_gen.rows.map(element=>element.author),
      genres:auth_gen.rows.map(element=>element.genre)
    })
    return result
    })).then((res,rej)=>{
      let data = pug.renderFile("index.pug",{books:res,currUID:request.app.locals.currUID});
      response.statusCode = 200;
      response.send(data);
  });
}

const addCart = async (request, response) => {
  const query = {
    text: 'INSERT into public.cart VALUES ($1,$2,$3)',
    values: [request.app.locals.currUID,request.params.isbn,1],
  }
  let results = await pool.query(query);
  //console.log(request.params.isbn," Added to cart of User",1)
}


const getBookInfo = async (request, response) => {
  const query = {
    text: 'SELECT * FROM public.book WHERE isbn = $1',
    values: [request.params.isbn],
  }
  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    //console.log(results.rows[0])
    let data = pug.renderFile("book.pug",{book:results.rows[0],currUID:request.app.locals.currUID});
    response.statusCode = 200;
    response.send(data)
    
  })
}
const getCart = async (request, response) => {
  const query = {
    text: 'SELECT * FROM public.cart WHERE uid = $1',
    values: [request.app.locals.currUID], 
  }
  let books = await pool.query(query);
  (books.rows) = Promise.all(books.rows.map(async book => {
    const query = {
      text: 'SELECT name, stockquantity, price FROM public.book WHERE isbn = $1',
      values: [book.isbn],
    }
    let addOn = await pool.query(query);
    result = ({
      ...book,
      name:addOn.rows.map(element=>element.name),
      stockquantity:addOn.rows.map(element=>element.stockquantity),
      price:addOn.rows.map(element=>element.price)
    })
    return result
    })).then((res,rej)=>{
      let data = pug.renderFile("cart.pug",{books:res,currUID:request.app.locals.currUID});
      response.statusCode = 200;
      response.send(data);
  });
}

const getUsers = (request, response) => {
  pool.query('SELECT * FROM public.users ORDER BY uid ASC', (error, results) => {
    if (error) 
    {
      throw error
    }
    // console.log(request.app.locals.currUID);
    // console.log(response.app.locals.currUID);
    let data = pug.renderFile("users.pug",{users:results.rows,currUID:request.app.locals.currUID});
    response.statusCode = 200;
    response.send(data);
  })

  // let results = pool.query(query);
  // console.log(results.rows)
  // response.statusCode = 200;
  // response.send(results.rows)
}

module.exports = {
  getUsers,
  getBooks,
  getBookInfo,
  addCart,
  getCart
}