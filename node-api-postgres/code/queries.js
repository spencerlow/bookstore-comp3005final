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
  //let dml_insert = await pool.query(fs.readFileSync('../sql/mock_data.sql').toString());
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
  try{
    let results = await pool.query(query);
  }catch(err){
    console.log(err.detail);
  }
  //console.log(request.params.isbn," Added to cart of User",1)
}

const removeFromCart = async (request, response) => {
  const query = {
    text: 'DELETE from public.cart WHERE uid=$1 AND isbn=$2',
    values: [request.app.locals.currUID,request.params.isbn],
  }
  try{
    let results = await pool.query(query);
  }catch(err){
    console.log(err.detail);
  }  
  response.redirect("/getCart");
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
    
  });
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
      let total = 0;
      res.forEach(element => {
        total += (parseFloat(element.price));
      });
      //QUERY FOR USER SHIPPPING/BILLING
      const query = {
        text: 'SELECT uid,userBilling,userShipping FROM public.users WHERE uid = $1',
        values: [request.app.locals.currUID], 
      }
      pool.query(query, (error, results) => {
        if (error) {
          throw error
        }
        //console.log(results.rows[0])
        let data = pug.renderFile("cart.pug",{books:res,user:results.rows[0],cartTotal:total.toFixed(2)});
        response.statusCode = 200;
        response.send(data);
        
      });
      // let data = pug.renderFile("cart.pug",{books:res,currUID:request.app.locals.currUID,cartTotal:total.toFixed(2)});
      // response.statusCode = 200;
      // response.send(data);

  });
}
const createOrder = async (request, response) => {
  let nextOrderID = await pool.query('SELECT COUNT(*) FROM public.orders');
  let shipping = request.url.split("?")[1].split("&")[0].split("=")[1];
  let billing = request.url.split("?")[1].split("&")[1].split("=")[1];
  console.log("CreateOrder Shipping: | " + shipping);
  console.log("CreateOrder Billing | " + billing);
  shipping = shipping.replaceAll("_"," ");
  billing = billing.replaceAll("_"," ");
  const orderQuery = {
    text: 'INSERT into public.Orders VALUES ($1,$2,$3,$4,$5)',
    values: [nextOrderID.rows[0].count,billing,request.app.locals.currUID,billing,shipping],
  }
  try{
    await pool.query(orderQuery);
  }catch(err){
    console.log(err.detail);
  }
  const bookQuery = {
    text: 'SELECT * FROM public.cart WHERE uid = $1',
    values: [request.app.locals.currUID], 
  }
  let books = await pool.query(bookQuery);
  console.log(books.rows)
  books.rows.forEach (async (element) => {
    const insertContentsQuery = {
      text: 'INSERT into public.order_contents VALUES ($1,$2,$3)',
      values: [nextOrderID.rows[0].count,element.isbn,element.cartquantity],
    }
    try{
      let results = await pool.query(insertContentsQuery);
      
    }catch(err){
      console.log(err);
    }
    console.log(element,element.isbn)
    const updateStockQuery = {
      text: 'UPDATE public.book SET stockquantity= stockquantity - 1 WHERE isbn=$1',
      values: [element.isbn],
    }
    let results1 = await pool.query(updateStockQuery);

    const checkStockQuery = {
      text: 'SELECT stockquantity,isbn,pid,lastmonthsales FROM public.book WHERE isbn=$1',
      values: [element.isbn],
    }
    let results2 = await pool.query(checkStockQuery);
    if(results2.rows[0].stockquantity < 10){
      const publisherInfoQuery = {
        text: 'SELECT * FROM public.publisher WHERE pid=$1',
        values: [results2.rows[0].pid],
      }
      let results = await pool.query(publisherInfoQuery);
      //console.log(results);
      console.log("");
      console.log("DETECTED LOW BOOK STOCK (MIN 10)");
      console.log("======= SYSTEM E-MAIL =======");
      console.log("To: Publisher",results.rows[0].pid);
      console.log("Email: ",results.rows[0].email);
      console.log("Address: ",results.rows[0].address);
      console.log("Banking Route: #",results.rows[0].banking);

      console.log("ORDER");
      console.log("Book ISBN: ",results2.rows[0].isbn);
      console.log("Quantity (Based on last month sales): ",results2.rows[0].lastmonthsales);
      console.log("======= END =======");
      console.log("")
    }
    
    const deleteCartQuery = {
      text: 'DELETE from public.cart WHERE uid=$1 AND isbn=$2',
      values: [request.app.locals.currUID,element.isbn],
    }
    let results3 = await pool.query(deleteCartQuery);
    //console.log(results2)
  });
  //let data = pug.renderFile("cart.pug",{books:[],user:request.app.locals.currUID,cartTotal:0});
  response.statusCode = 200;
  response.redirect("/getCart");
  // books.rows.forEach (async (element) => {
  //   const deleteCartQuery = {
  //     text: 'DELETE from public.cart WHERE uid=$1 AND isbn=$2',
  //     values: [request.app.locals.currUID,elements.isbn],
  //   }
  //   console.log("Delete -> ",deleteCartQuery);
  //   try{
  //     let results = await pool.query(deleteCartQuery);
  //   }catch(err){
  //     console.log(err);
  //   }
  // });
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

const addUser = async (request, response) => {

  let nextUID = 0;

//find nextUID
  const query = {
    text: 'SELECT * FROM public.users ORDER BY uid ASC',
  }
  try{
    let results = await pool.query(query);
    nextUID = results.rows.length
  }catch(err){
    console.log(err.detail);
    return;
  }

  console.log("in here");
  console.log("nextuid:" + nextUID);

  console.log(request.url);
  let shipping = request.url.split("?")[1].split("&")[0].split("=")[1];
  let billing = request.url.split("?")[1].split("&")[1].split("=")[1];
  console.log("shipping | " + shipping);
  console.log("billing | " + billing);
  shipping = shipping.replaceAll("_"," ");
  billing = billing.replaceAll("_"," ");

//create new user
  const query2 = {
    // uid,userbilling,usershipping,account_type,cardid,storeid
    text: 'INSERT into public.users VALUES ($1,$2,$3,$4,$5,$6)',
    values: [nextUID,shipping,billing,"customer",nextUID,1],
  }
  try{
    let results = await pool.query(query2);
  }catch(err){
    console.log(err.detail);
    return;
  }

  //let data = pug.renderFile("users.pug",{currUID:request.app.locals.currUID});
  //response.statusCode = 200;
  //response.send(data);    
  //response.send('/users');
  // 
  response.status(200).redirect("http://localhost:3000/users");
  //request.url = request.url.split("/addUser")[0]   
  

  //console.log(request.params.isbn," Added to cart of User",1)
}


const searchQuery = async (request, response) => {

  //get user table
  const query = {
    text: 'SELECT * FROM public.users ORDER BY uid ASC',
  }
  try{
    let results = await pool.query(query);
  }catch(err){
    console.log(err.detail);
    return;
  }

  //get book table

  //get order table

  //get publisher table

  //get phonenumber table

  //get order contents table

  //get bookstore?
  //get book_records


  let data = pug.renderFile("search.pug",{});
  response.statusCode = 200;
  response.send(data);
}

const reports = async (request, response) => {
  let report1 ={name:"Sales vs Expenses",rid:"1"};
  let report2 ={name:"Sales by Author", rid:"2"};
  let report3 ={name:"Sales by Genre",rid:"3"};

  let list = [report1,report2,report3];

  let data = pug.renderFile("reports.pug",{report1,report2,report3});
  response.statusCode = 200;
  response.send(data);
}

const report1 = async (request, response) => {
  //REPORT 1 -> SALES VS EXPENDITURES (ASSUMING EXPENSES = ROYALTIES PAID)
  //TABLE ISBN NAME QUANTITY_SOLD RAW_PRICE(PRICE*QUANTITY_SOLD) ROYALTY_CALC(ROYALTY*QUANTITY_SOLD) PROFIT
  const query = {
    text: 'SELECT isbn, count(*) FROM public.order_contents WHERE isbn IS NOT NULL GROUP BY isbn',
  }
  try{
    let books_ordered = await pool.query(query);
    (books_ordered.rows) = Promise.all(books_ordered.rows.map(async book => {
      const bookInfoQuery = {
        text: 'SELECT * FROM public.book where isbn=$1',
        values:[book.isbn],
      }
      let bookInfo = await pool.query(bookInfoQuery);
      let net_in_calc = (parseInt(book.count) *parseFloat(bookInfo.rows[0].price)).toFixed(2);
      let expense_calc = (net_in_calc * parseFloat((bookInfo.rows[0].royalty)/100)).toFixed(2);
      result = ({
        ...book,
        name:bookInfo.rows.map(element=>element.name),
        price:bookInfo.rows.map(element=>element.price),
        net_in:net_in_calc,
        expense:expense_calc,
        net_prof:(net_in_calc - expense_calc).toFixed(2)
      })
      return result
      })).then((res,rej)=>{
        let total = 0;
        res.forEach(element => {
          total += (parseFloat(element.net_prof));
        });
        total = total.toFixed(2)
        let data = pug.renderFile("./reports/report1.pug",{sales:res,total});
        response.statusCode = 200;
        response.send(data);
      });
  }
  catch(err){
    return;
  }
}
const report2 = async (request, response) => {
  //REPORT 2 -> SALES PER AUTHOR
  //TABLE ISBN NAME QUANTITY_SOLD RAW_PRICE(PRICE*QUANTITY_SOLD) ROYALTY_CALC(ROYALTY*QUANTITY_SOLD) PROFIT
  const query = {
    text: 'SELECT book_records.author,  COUNT(book_records.isbn) FROM book_records LEFT JOIN order_contents ON book_records.isbn = order_contents.isbn GROUP BY book_records.author',
  }
  try{
    let auth_count = await pool.query(query);
    let data = pug.renderFile("./reports/report2.pug",{sales:auth_count.rows});
    response.statusCode = 200;
    response.send(data);
  }
  catch(err){
    return;
  }
}
const report3 = async (request, response) => {
  //REPORT 2 -> SALES PER AUTHOR
  //TABLE ISBN NAME QUANTITY_SOLD RAW_PRICE(PRICE*QUANTITY_SOLD) ROYALTY_CALC(ROYALTY*QUANTITY_SOLD) PROFIT
  const query = {
    text: 'SELECT book_records.genre,  COUNT(book_records.isbn) FROM book_records LEFT JOIN order_contents ON book_records.isbn = order_contents.isbn GROUP BY book_records.genre',
  }
  try{
    let gen_count = await pool.query(query);
    let data = pug.renderFile("./reports/report3.pug",{sales:gen_count.rows});
    response.statusCode = 200;
    response.send(data);
  }
  catch(err){
    return;
  }
}


module.exports = {
  getUsers,
  getBooks,
  getBookInfo,
  addCart,
  getCart,
  removeFromCart,
  createOrder,
  addUser,
  searchQuery,
  reports,
  report1,
  report2,
  report3
}