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
  document.getElementById("filter").onclick = search;
}
else if(document.getElementById("checkoutSubmit")){
  document.getElementById("checkoutSubmit").onclick = createOrder;
}



function search(){
    console.log("clicked to filter");

    //let newurl = "/seach?"    
    //console.log(document.getElementById("userSelect").value)
    //window.location.href = window.location.href;
    //+ "=" + document.getElementById("userSelect").value;
  }







