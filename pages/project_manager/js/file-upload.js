/*////////////////////////////////////

Function to display progress bar for fileupload

*/ ////////////////////////////////////
function displayProcess(process) {
  document.getElementById("uploadProgressBar").style.width = process + "%";
  document.getElementById("uploadProgressBar").innerHTML = process + "%";
}

/*////////////////////////////////////

Function to upload file to storage

////////////////////////////////////
*/ async function uploadFile() {
  //Url
  var urlGetLastProjectID = urlMain + "api/GetLastProjectID";

  // Show progress bar
  displayProcess(0);
  document
    .getElementById("uploadProgressBarContainer")
    .classList.remove("hidden");

  let response = await fetch(urlGetLastProjectID, {
    method: "GET",
    crossDomain: true,
    headers: {
      Authorization: "Bearer " + token
    }
  });

  //Store Result into var
  var lastProjID = response.json();

  lastProjID.then(function(result) {
    const fileInput = document.querySelector("#FileInput");

    var type = fileInput.files[0].type;
    var name = fileInput.files[0].name;

    var blob = fileInput.files[0].slice(0, fileInput.files[0].size, type);
    newFile = new File([blob], result + "_" + name, { type: type });
    displayProcess(100);
    ArrayOfFiles.push(newFile);

    //Get html container
    var list = document.getElementById("fileList");

    //Generate upload file list with remove button
    //File list container
    var item = document.createElement("li");
    item.id = fileInput.files[0].name;

    //File name in list
    var p = document.createElement("p");
    // p.innerHTML = "<a href='" + fileLocation + "/" + lastProjectID + "_" + file.name + "'>" + file.name + "</a>";
    p.innerHTML = fileInput.files[0].name;

    //Delete file button
    var btn = document.createElement("button");
    btn.classList.add("btn-circle-edit", "btn-danger", "col-md-2", "ml-2");
    btn.innerHTML = "X";
    btn.setAttribute("type", "button");
    btn.onclick = function() {
      //Searches for file in list and removes it
      for (var i = 0; i < ArrayOfFiles.length; i++) {
        if (ArrayOfFiles[i].Name == file.name) {
          ArrayOfFiles.splice(i, 1);
          var elem = document.getElementById(item.id);
          elem.parentNode.removeChild(elem);
        }
      }
    };

    //Append Elements to Container
    p.appendChild(btn);
    item.appendChild(p);
    list.appendChild(item);
  });
}
