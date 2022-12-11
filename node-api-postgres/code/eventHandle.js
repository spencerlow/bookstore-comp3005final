function createOrder(req,res){
  let billing = document.getElementById("billing").value;
  let shipping = document.getElementById("shipping").value;
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
  shipping = shipping.trim();
  billing = billing.trim();
  shipping = shipping.replaceAll(" ","_");
  billing = billing.replaceAll(" ","_");
  window.location.href ="/createOrder" + "?" + 
    "shipping="+shipping+"&"+"billing="+billing;
}

function changeUser(req,res){
    window.location.href = window.location.href + "/changeUser" + "=" + document.getElementById("userSelect").value;
  }


function addUser(req,res){
  //if === is true, alert
  let shipping = document.getElementById("shipping").value;
  let billing = document.getElementById("billing").value;
  // if (shipping === billing)
  // {
  //   alert("the shipping and billing cannot be the same);
  //   return;
  // }
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
  shipping = shipping.trim();
  billing = billing.trim();
  shipping = shipping.replaceAll(" ","_");
  billing = billing.replaceAll(" ","_");

  window.location.href = window.location.href + "/addUser" + "?" + 
    "shipping="+shipping+"&"+"billing="+billing;
}


if(document.getElementById("submit")){
  document.getElementById("submit").onclick = changeUser;
  document.getElementById("addUser").onclick = addUser;
}
else if(document.getElementById("checkoutSubmit")){
  document.getElementById("checkoutSubmit").onclick = createOrder;
}

//does not trigger if placed in conditions
if (document.getElementById("filter")){
  document.getElementById("filter").onclick = search;
}
if (document.getElementById("createBook")){
  document.getElementById("createBook").onclick = createBook;
}



function createBook(req,res){

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

  isbn = isbn.trim();
  name = name.trim();
  stockQuantity = stockQuantity.trim();
  royalty = royalty.trim();
  lastMonthSales = lastMonthSales.trim();
  page_num = page_num.trim();
  price = price.trim();
  pid = pid.trim();
  
  author = author.trim();
  author = author.replaceAll(",","_");
  author = author.replaceAll("&","+");

  genre = genre.trim();
  genre = genre.replaceAll(",","+");


  // let newurl = window.location.href.split("/controlPanel")[0]+"/addBook?"+
  // "isbn="+isbn+"&name="+name+"&stockQuantity="+stockQuantity+
  // "&royalty="+royalty+"&lastMonthSales="+lastMonthSales+"&page_num="+
  // page_num+"&price="+price+"&pid="+pid+"&author="+author+"&genre="+genre;
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
   


  window.location.href = newurl;
}

function search(req,res){

    let newurl = window.location.href;

    if (newurl.includes("search"))
    {
      newurl = window.location.href.split("/search")[0] + "/filter?"
    }
    else//already has a previous filter....
    {
      newurl = window.location.href.split("/filter?")[0] + "/filter?"
    }

    let attribute = document.getElementById("attributes").value;
    let sort = document.getElementById("ordering").value;

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

    newurl = newurl + "attribute=" + attribute + "&" + "sort=" + sort;

    if (document.getElementById("userInput").value !== "")
    {
      let userInput = document.getElementById("userInput").value;
      userInput = userInput.trim();
      userInput = userInput.replaceAll(" ","+");
      newurl = newurl + "&userInput=" + userInput;
    }

    window.location.href = newurl;
    //+ "=" + document.getElementById("userSelect").value;
  }







