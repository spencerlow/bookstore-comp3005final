
console.log("test");
document.getElementById("submit").onclick = changeUser;
document.getElementById("addUser").onclick = addUser;

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