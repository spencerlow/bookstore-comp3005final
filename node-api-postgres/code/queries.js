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
const { Console } = require('console');

async function databaseInit(req,res){
  console.log("Initializing Database");
  // Insert all tables
  let ddl_insert = await pool.query(fs.readFileSync('../sql/ddl.sql').toString());
  // Try inserting all mock_data, throws err if exists
  try{
    let dml_insert = await pool.query(fs.readFileSync('../sql/mock_data.sql').toString());
  }catch(err)
  {
    console.log("dml.sql -> " + err.detail);
  }
}

databaseInit();

const getBooks = async (request, response) => {
  //Query for all books
  let books = await pool.query('SELECT * FROM public.book ORDER BY isbn ASC');
  (books.rows) = Promise.all(books.rows.map(async book => {
    // Query for all multi-val (author + genre) per book
    const query = {
      text: 'SELECT author,genre FROM public.book_records WHERE isbn = $1',
      values: [book.isbn],
    }
    let auth_gen = await pool.query(query);
    // Modify original book query and map those attributes for output
    result = ({
      ...book,
      authors:auth_gen.rows.map(element=>element.author),
      genres:auth_gen.rows.map(element=>element.genre)
    })
    return result
    })).then((res,rej)=>{
      // Render and serve page
      let data = pug.renderFile("index.pug",{books:res,currUID:request.app.locals.currUID});
      response.statusCode = 200;
      response.send(data);
  });
}

const addCart = async (request, response) => {
  // Insert new book into cart of user
  const query = {
    text: 'INSERT into public.cart VALUES ($1,$2,$3)',
    values: [request.app.locals.currUID,request.params.isbn,1],
  }
  try{
    let results = await pool.query(query);
  }catch(err){
    console.log(err.detail);
  }
}

const removeFromCart = async (request, response) => {
  // Query delete specified UID and isbn from cart relation
  const query = {
    text: 'DELETE from public.cart WHERE uid=$1 AND isbn=$2',
    values: [request.app.locals.currUID,request.params.isbn],
  }
  try{
    let results = await pool.query(query);
  }catch(err){
    console.log(err.detail);
  }  
  // Redirect back to fresh cart page
  response.redirect("/getCart");
}


const getBookInfo = async (request, response) => {
  // Not used-> but exists for future implementation
  // Query for a book with isbn
  const query = {
    text: 'SELECT * FROM public.book WHERE isbn = $1',
    values: [request.params.isbn],
  }
  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    let data = pug.renderFile("book.pug",{book:results.rows[0],currUID:request.app.locals.currUID});
    response.statusCode = 200;
    response.send(data)
    
  });
}

const getCart = async (request, response) => {
  // Grab all books in cart
  const query = {
    text: 'SELECT * FROM public.cart WHERE uid = $1',
    values: [request.app.locals.currUID], 
  }
  let books = await pool.query(query);
  (books.rows) = Promise.all(books.rows.map(async book => {
    // Grab all information for each book in cart
    const query = {
      text: 'SELECT name, stockquantity, price FROM public.book WHERE isbn = $1',
      values: [book.isbn],
    }
    let addOn = await pool.query(query);
    // Modify object to add new attribute
    result = ({
      ...book,
      name:addOn.rows.map(element=>element.name),
      stockquantity:addOn.rows.map(element=>element.stockquantity),
      price:addOn.rows.map(element=>element.price)
    })
    return result
    })).then((res,rej)=>{
      // Combine total price for cart
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
        // Render and serve page
        let data = pug.renderFile("cart.pug",{books:res,user:results.rows[0],cartTotal:total.toFixed(2)});
        response.statusCode = 200;
        response.send(data);
        
      });

  });
}
const createOrder = async (request, response) => {
  // Get next free orderID
  let nextOrderID = await pool.query('SELECT COUNT(*) FROM public.orders');
  // Parse url for shipping + billing
  let shipping = request.url.split("?")[1].split("&")[0].split("=")[1];
  let billing = request.url.split("?")[1].split("&")[1].split("=")[1];
  shipping = shipping.replaceAll("_"," ");
  billing = billing.replaceAll("_"," ");
  // Insert a new order into relation
  const orderQuery = {
    text: 'INSERT into public.Orders VALUES ($1,$2,$3,$4,$5)',
    values: [nextOrderID.rows[0].count,"warehouse",request.app.locals.currUID,billing,shipping],
  }
  try{
    await pool.query(orderQuery);
  }catch(err){
    console.log(err.detail);
  }
  //Obtain all books that were submitted for order from cart
  const bookQuery = {
    text: 'SELECT * FROM public.cart WHERE uid = $1',
    values: [request.app.locals.currUID], 
  }
  let books = await pool.query(bookQuery);
  books.rows.forEach (async (element) => {
    //Insert into order_contents relation
    const insertContentsQuery = {
      text: 'INSERT into public.order_contents VALUES ($1,$2,$3)',
      values: [nextOrderID.rows[0].count,element.isbn,element.cartquantity],
    }
    try{
      let results = await pool.query(insertContentsQuery);
      
    }catch(err){
      console.log(err);
    }
    //Update stock of sold book
    const updateStockQuery = {
      text: 'UPDATE public.book SET stockquantity= stockquantity - 1 WHERE isbn=$1',
      values: [element.isbn],
    }
    let results1 = await pool.query(updateStockQuery);
    //Check stock of book, if less than threshold send email
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
    
    //Delete all books in the cart of order
    const deleteCartQuery = {
      text: 'DELETE from public.cart WHERE uid=$1 AND isbn=$2',
      values: [request.app.locals.currUID,element.isbn],
    }
    let results3 = await pool.query(deleteCartQuery);
  });
  //Redirect back to cart page
  response.statusCode = 200;
  response.redirect("/getCart");
}

const getUsers = (request, response) => {
  //Query to get user with uid asc
  pool.query('SELECT * FROM public.users ORDER BY uid ASC', (error, results) => {
    if (error) 
    {
      throw error
    }

    let data = pug.renderFile("users.pug",{users:results.rows,currUID:request.app.locals.currUID});
    response.statusCode = 200;
    response.send(data);
  })
}

const addUser = async (request, response) => {

  let nextUID = 0;

  //Query for next user id
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

  // Parse url for shipping + billing
  let shipping = request.url.split("?")[1].split("&")[0].split("=")[1];
  let billing = request.url.split("?")[1].split("&")[1].split("=")[1];
  //console.log("shipping | " + shipping);
  //console.log("billing | " + billing);
  shipping = shipping.replaceAll("_"," ");
  billing = billing.replaceAll("_"," ");

//create new user
  const query2 = {
    // Insert new stuff into relation uid,userbilling,usershipping,account_type,cardid,storeid
    text: 'INSERT into public.users VALUES ($1,$2,$3,$4,$5,$6)',
    values: [nextUID,shipping,billing,"customer",nextUID,1],
  }
  try{
    let results = await pool.query(query2);
  }catch(err){
    console.log(err.detail);
    return;
  }
  response.status(200).redirect("http://localhost:3000/users");
}

/*
Search query
1. Grab user input by splitting url
2. build the string that PG query will use (qSTR)
3. whereString is if a user includes a typed search
4. table is the table the search will belong to
*/
const searchQuery = async (request, response) => {
  // Parse for attr, sort, and input
  let attribute = request.url.split("?")[1].split("&")[0].split("=")[1];
  let sort = request.url.split("?")[1].split("&")[1].split("=")[1];
  let userInput = "";
  //userinput is given
  if (request.url.split("?")[1].split("&").length === 3)
  {
    userInput = request.url.split("?")[1].split("&")[2].split("=")[1];
  }

  // Build query string
  let whereString = ""

  let qStr = "SELECT * FROM"
  let table = ""

  //find table and replace unique attributes to match table names
  if (attribute === "ISBN" ||
    attribute === "stockQuantity" ||
    attribute === "royalty" ||
    attribute === "lastMonthSales" ||
    attribute === "page_Num" ||
    attribute === "bookName" ||
    attribute === "price"){
      table = "public.book";
      if (attribute === "bookName"){attribute = "name"};
    }
  else if (attribute === "orderID" ||
  attribute === "cur_location" ||
  attribute === "orderBilling" ||
  attribute === "orderShipping"){
    table = "public.orders";
  }
  else if(attribute === "orderQuantity" ||
          attribute === "orderID_contents"){
    table = "public.order_contents";
    if (attribute === "orderID_contents"){attribute = "orderID"};
  }
  else if (attribute === "pID" ||
  attribute === "address" ||
  attribute === "email" ||
  attribute === "banking"){
    table = "public.publisher";
  }
  else if (attribute === "phoneNumber"){
    table = "public.has_numbers";
  }
  else if (attribute === "author" ||
  attribute === "genre"){
    table="public.book_records";
  }
  else if(attribute === "storeID" || attribute === "storeName"){
    table = "public.bookstore";
    if (attribute === "storeName"){attribute = "name"};
  }
  else if(attribute === "UID" ||
  attribute === "userBilling" ||
  attribute === "userShipping" ||
  attribute === "account_type" ||
  attribute === "cartID"){
    table ="public.users";
  }
  else if(attribute === "cartQuantity"){
    table ="public.cart";
  }
  else{
    console.log("Searched non-existing attribute");
    return;
  }

  //clean up userinput
  userInput = userInput.replaceAll("+"," ")

  //create the WHERE string with userinput
  if (userInput !== "")
  {
    //console.log("           comparing:" + attribute);
    if (attribute === "ISBN" ||
        attribute === "name" ||
        attribute === "address" ||
        attribute === "email" ||
        attribute === "banking" ||
        attribute === "name" ||
        attribute === "userBilling" ||
        attribute === "userShipping" ||
        attribute === "account_type" ||
        attribute === "cur_location" ||
        attribute === "orderBilling" ||
        attribute === "orderShipping" ||
        attribute === "phoneNumber" ||
        attribute === "author" ||
        attribute === "genre")
        { 
          //console.log("           p1");
          whereString = " WHERE "+attribute+" = "+ "'" +userInput +"'";
        }
        else{
          //console.log("                 p2");
          whereString = " WHERE "+attribute+" = "+userInput;
        }
    
  }


// let q1 = 'SELECT * FROM public.users ORDER BY UID ASC'
// let q2 = 'SELECT * FROM public.users'
// let q3 = ' ORDER BY UID ASC'

//build query string
qStr = qStr + " " + table + whereString + " ORDER BY " + attribute + " " + sort;
  const query = {  
    text: qStr,
  }
  try{
    let results = await pool.query(query);
    let columns = {};
    for(field of results.fields)
    {
      columns[field.name] = field.name;
    }
    //pug render
    let data = pug.renderFile("search.pug",{table:results,columns,currUID:request.app.locals.currUID});
    response.statusCode = 200;
    response.send(data);

  }catch(err){
    console.log(err);
    return;
  }
}

const reports = async (request, response) => {
  //List reports + rid so it can direct
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
    //Grab ordered books
    let books_ordered = await pool.query(query);
    (books_ordered.rows) = Promise.all(books_ordered.rows.map(async book => {
      //Get info per book
      const bookInfoQuery = {
        text: 'SELECT * FROM public.book where isbn=$1',
        values:[book.isbn],
      }
      let bookInfo = await pool.query(bookInfoQuery);
      //Calculate net income + expense
      let net_in_calc = (parseInt(book.count) *parseFloat(bookInfo.rows[0].price)).toFixed(2);
      let expense_calc = (net_in_calc * parseFloat((bookInfo.rows[0].royalty)/100)).toFixed(2);
      //Add attributes to object
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
        //Calculate total value of book sale
        let total = 0;
        res.forEach(element => {
          total += (parseFloat(element.net_prof));
        });
        total = total.toFixed(2)
        //Render and server pug
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
  //Query count for each author
  const query = {
    text: 'SELECT book_records.author,  COUNT(book_records.isbn) FROM book_records LEFT JOIN order_contents ON book_records.isbn = order_contents.isbn GROUP BY book_records.author',
  }
  try{
    let auth_count = await pool.query(query);
    //Render and Serve
    let data = pug.renderFile("./reports/report2.pug",{sales:auth_count.rows});
    response.statusCode = 200;
    response.send(data);
  }
  catch(err){
    return;
  }
}
const report3 = async (request, response) => {
  //REPORT 3 -> SALES PER GENRE
   //Query count for each Genre
  const query = {
    text: 'SELECT book_records.genre,  COUNT(book_records.isbn) FROM book_records LEFT JOIN order_contents ON book_records.isbn = order_contents.isbn GROUP BY book_records.genre',
  }
  try{
    let gen_count = await pool.query(query);
    //Render and serve
    let data = pug.renderFile("./reports/report3.pug",{sales:gen_count.rows});
    response.statusCode = 200;
    response.send(data);
  }
  catch(err){
    return;
  }
}

const controlPanel = async (request, response) => {
  //Grab all publishers
  //Grab all books
  let publisher = await pool.query('SELECT * FROM public.publisher'); 
  let books = await pool.query('SELECT * FROM public.book ORDER BY isbn ASC');

  let successAdd="";
  
  //Check if we are being given a request for adding books
  if (request.url.includes("?")){
    successAdd = true;

    let newbook = {};
    //parse url
    const info = request.url.split("?")[1].split("&")
    for (q of info)
    {
      if (q.split("=")[0] !== "author" && q.split("=")[0] !== "genre"){
        newbook[q.split("=")[0]] = q.split("=")[1]
      }
      else if(q.split("=")[0] === "author"){
        newbook.author = q.split("=")[1].replaceAll("_"," ").split("+");
      }
      else if(q.split("=")[0] ==="genre"){
        newbook.genre = q.split("=")[1].split("+");
      }
    }


    //add to book
    const bookQuery = {
      text: 'INSERT into public.book VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      values: [newbook.isbn,newbook.name,newbook.stockQuantity,newbook.royalty,newbook.lastMonthSales,newbook.page_num,newbook.price,newbook.pid],
    }
    try{
      let result = await pool.query(bookQuery);
    }catch(err){
      console.log(err.detail);
      successAdd = false;

    }

    //get phonenumbers
    let phonenumbers;
    const phonequery = {
      text: 'SELECT * FROM public.has_numbers WHERE pid = $1',
      values: [newbook.pid],
    }
    try{
      phonenumbers = await pool.query(phonequery);
    }catch(err){
      console.log(err.detail);
    }
   
    //add to records for:
      //each genre, of every author, of every phonenumber
    for (genre of newbook.genre)
    {
      for (author of newbook.author)
      {
        for (phonerow of phonenumbers.rows)
        {
          //console.log(genre+"|"+author+"|"+phonerow.phonenumber);
          const recordQuery = {
            text: 'INSERT into public.book_records VALUES ($1,$2,$3,$4,$5)',
            values: [newbook.isbn, 0, phonerow.phonenumber, author, genre],
          }
          try{
            await pool.query(recordQuery);
          }catch(err){
            console.log(err.detail);
            //console.log(err);
            successAdd = false;
          }
        }
      }
    }
  }
  if (successAdd === true)
  {
    console.log("Book added.");
  }
  //Render and Serve
  let data = pug.renderFile("controlPanel.pug",{books:books.rows,currUID:request.app.locals.currUID,publisher:publisher.rows,successAdd:successAdd});
  response.statusCode = 200;
  response.send(data);
}

const removeBook = async (request, response) => {
  //Query to remove the book
  const removeBookQuery = {
    text: 'DELETE FROM book WHERE isbn =$1',
    values:[request.params.isbn],
  }
  //Serve back to control panel url for refreshed list of books
  let result = await pool.query(removeBookQuery);
  response.statusCode = 200;
  response.redirect("/controlPanel");
}

//Exports
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
  report3,
  controlPanel,
  removeBook
}