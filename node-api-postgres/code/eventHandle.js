//handles request to place a new order
//grabs userInput with billing and shipping
//from webpage and notifies the server to create the order and redirects user
function createOrder(req,res){
  //get user input
  let billing = document.getElementById("billing").value;
  let shipping = document.getElementById("shipping").value;
  //reject empty values
  if (shipping === "")
  {
    alert("Shipping address must be added")
    return;
  }
  if (billing === "")
  {
    alert("Billing address must be added")
    return;
  }
  //clean userinput
  shipping = shipping.trim();
  billing = billing.trim();
  //clean userinput to be url friendly
  shipping = shipping.replaceAll(" ","_");
  billing = billing.replaceAll(" ","_");
  //redirect user/notify server
  window.location.href ="/createOrder" + "?" + 
    "shipping="+shipping+"&"+"billing="+billing;
}
//handles request to change user
//grabs userInput for specified UID and notifies the server to change user and redirects user
function changeUser(req,res){
  //redirect user and notify server
    window.location.href = window.location.href + "/changeUser" + "=" + document.getElementById("userSelect").value;
  }

//handles request to add a new user
//grabs userInput for specified shipping and billing and notifies server to add a new user and redirects user
function addUser(req,res){
  //grab user input
  let shipping = document.getElementById("shipping").value;
  let billing = document.getElementById("billing").value;
  //reject empty values
  if (shipping === "")
  {
    alert("shipping address must be added")
    return;
  }
  if (billing === "")
  {
    alert("shipping address must be added")
    return;
  }
  //clean user input
  shipping = shipping.trim();
  billing = billing.trim();
  //clean user input to be url friendly
  shipping = shipping.replaceAll(" ","_");
  billing = billing.replaceAll(" ","_");
  //redirect user and notfiy server
  window.location.href = window.location.href + "/addUser" + "?" + 
    "shipping="+shipping+"&"+"billing="+billing;
}

//button click notifier
if(document.getElementById("submit")){
  document.getElementById("submit").onclick = changeUser;
  document.getElementById("addUser").onclick = addUser;
}
else if(document.getElementById("checkoutSubmit")){
  document.getElementById("checkoutSubmit").onclick = createOrder;
}

//button click notifier
if (document.getElementById("filter")){
  document.getElementById("filter").onclick = search;
}
//button click notifier
if (document.getElementById("createBook")){
  document.getElementById("createBook").onclick = createBook;
}


//handles request to create a bew book
//grabs userInput for specified isbn,name,stockquantity,royalty,lastmonthsales,page_num,price,pid,author,genre
//and notifies server to add the new book if possible with specified values and redirects user
function createBook(req,res){

  //get userinput
  let isbn= document.getElementById("isbn").value;
  let name= document.getElementById("name").value;
  let stockQuantity= document.getElementById("stockQuantity").value;
  let royalty= document.getElementById("royalty").value;
  let lastMonthSales= document.getElementById("lastMonthSales").value;
  let page_num= document.getElementById("page_num").value;
  let price= document.getElementById("price").value;
  let pid= document.getElementById("pid").value;
  let author= document.getElementById("author").value;
  let genre= document.getElementById("genre").value;
  
//reject empty values
  if (isbn === "" ||
      name === "" ||
      stockQuantity === "" ||
      royalty === "" ||
      lastMonthSales === "" ||
      page_num === "" ||
      price === "" ||
      pid === "" ||
      author === "" ||
      genre === "")
  {
    alert("must fill all inputs to create book");
    return;
  }

  //clean userinput
  isbn = isbn.trim();
  name = name.trim();
  stockQuantity = stockQuantity.trim();
  royalty = royalty.trim();
  lastMonthSales = lastMonthSales.trim();
  page_num = page_num.trim();
  price = price.trim();
  pid = pid.trim();
  
  //clean userinput and set them to be url friendly
  author = author.trim();
  author = author.replaceAll(",","_");
  author = author.replaceAll("&","+");

  genre = genre.trim();
  genre = genre.replaceAll(",","+");

  //redirect user depending on URL
  let newurl = window.location.href
  if (newurl.includes("?"))
  {
    newurl = newurl.split("?")[0]+"?"+
    "isbn="+isbn+"&name="+name+"&stockQuantity="+stockQuantity+
    "&royalty="+royalty+"&lastMonthSales="+lastMonthSales+"&page_num="+
    page_num+"&price="+price+"&pid="+pid+"&author="+author+"&genre="+genre;
  }
  else
  {
    newurl = newurl+"?"+
    "isbn="+isbn+"&name="+name+"&stockQuantity="+stockQuantity+
    "&royalty="+royalty+"&lastMonthSales="+lastMonthSales+"&page_num="+
    page_num+"&price="+price+"&pid="+pid+"&author="+author+"&genre="+genre;
  }
   

//redirect user and notify server
  window.location.href = newurl;
}

/*
handles user requested search queries from browser
and creates a new url with the query to send to the server for it to
use and respond with the proper data from database
*/
function search(req,res){

  //create a new temp url
    let newurl = window.location.href;

    //clean the url
    if (newurl.includes("search"))
    {
      newurl = window.location.href.split("/search")[0] + "/filter?"
    }
    else//already has a previous filter....
    {
      newurl = window.location.href.split("/filter?")[0] + "/filter?"
    }

    //get user input
    let attribute = document.getElementById("attributes").value;
    let sort = document.getElementById("ordering").value;

    //reject empty values
    if (attribute === "")
    {
      alert("must select attribute to search with");
      return;
    }
    if (sort === "")
    {
      alert("must select sorting method");
      return;
    }

    //build new url
    newurl = newurl + "attribute=" + attribute + "&" + "sort=" + sort;

    //include userinput if not empty
    if (document.getElementById("userInput").value !== "")
    {
      let userInput = document.getElementById("userInput").value;
      userInput = userInput.trim();
      userInput = userInput.replaceAll(" ","+");
      newurl = newurl + "&userInput=" + userInput;
    }

    //redirect user and notify server
    window.location.href = newurl;
  }







