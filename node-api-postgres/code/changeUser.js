
console.log("HELLO");
document.getElementById("submit").onclick = changeUser;
function changeUser(){
    console.log("clicked");
    //console.log(document.getElementById("userSelect").value)
    window.location.href = window.location.href + "/user" + "=" + document.getElementById("userSelect").value;
  }