console.log("inside search.js");


document.getElementById("submit").onclick = search;

function search(){
    console.log("clicked");

    let newurl = "/seach?"    
    //console.log(document.getElementById("userSelect").value)
    //window.location.href = window.location.href;
    + "=" + document.getElementById("userSelect").value;
  }