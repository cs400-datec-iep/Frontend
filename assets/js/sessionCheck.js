var verified = sessionStorage.getItem("verified");
console.log(verified);
if(verified != "ACCESS_GRANTED"){
    window.location.assign("../../index.html");
}