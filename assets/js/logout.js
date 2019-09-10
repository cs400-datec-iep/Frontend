function logout(){

    sessionStorage.clear();
    localStorage.clear();
    window.location.assign("../../index.html");
    
}