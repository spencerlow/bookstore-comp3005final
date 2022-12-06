
console.log("test");
document.getElementById("submit").onclick = changeUser;

function changeUser(req,res){
    console.log("clicked");
    window.location.href = window.location.href + "/changeUser" + "=" + document.getElementById("userSelect").value;
  }


function addUser(req,res){
  //if === is true, alert
}