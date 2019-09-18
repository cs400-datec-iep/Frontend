/*////////////////////////////////////

Function to logout user

*/////////////////////////////////////
function logout(){

    sessionStorage.clear();
    localStorage.clear();
    window.location.assign("../../index.html");
    
}