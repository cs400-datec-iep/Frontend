var verified = sessionStorage.getItem("verified");
console.log(verified);
if(verified != "ACCESS_GRANTED"){
    window.location.replace("../../index.html");
}