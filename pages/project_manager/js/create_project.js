function create_project() {
    //get input values
    var projectName = document.getElementById("projName").value;
    var projClient = document.getElementById("projClient").value;
    var projDesc = document.getElementById("projDesc").value;
    var projStartDate = document.getElementById("projStartDate").value;
    var projEndDate = document.getElementById("projEndDate").value;
    var userIdList = JSON.parse(localStorage.getItem("userIDs"));

    if(projStartDate > projEndDate){
        alert("Dates do not match!");
    } else if(projStartDate == projEndDate){
        alert("Dates do not match!");
    } 



    // console.log(projectName);
    // console.log(projClient);
    // console.log(projDesc);
    // console.log(projStartDate);
    // console.log(projEndDate);
    // console.log(userIdList);
}