function createOrder(req,res){
  console.log("Order Submit Clicked");
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
    console.log("clicked");
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

  console.log(shipping +"|"+billing);
  window.location.href = window.location.href + "/addUser" + "?" + 
    "shipping="+shipping+"&"+"billing="+billing;
}

console.log("test");
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
  console.log("clicked to create book");
}

function search(req,res){
    console.log("clicked to filter");

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

    console.log(newurl)
    window.location.href = newurl;
    //+ "=" + document.getElementById("userSelect").value;
  }







