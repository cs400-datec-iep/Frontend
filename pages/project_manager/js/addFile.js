function addFile(){

    if (this.value == "remove"){
        
        
    }

    // document.getElementById("projName").required = false;
    // document.getElementById("projClient").required = false;
    // document.getElementById("projDesc").required = false;
    // document.getElementById("projStartDate").required = false;
    // document.getElementById("projEndDate").required = false;

    var div = document.createElement("div");
    div.classList.add("col-md-5");

    var dropdown = document.createElement("select");
    dropdown.classList.add("custom-select");
    dropdown.classList.add("project-file-dropdown");

    dropdown.id = "type";

    var option1 = document.createElement("option");
    option1.value="";
    option1.selected="Select file type";
    option1.innerHTML= "Select file type";

    var option2 = document.createElement("option");
    option2.value="Billing";
    option2.innerHTML= "Billing";

    var option3 = document.createElement("option");
    option3.value="Tender";
    option3.innerHTML= "Tender";

    var option4 = document.createElement("option");
    option4.value="Quote";
    option4.innerHTML= "Quote";

    var option5 = document.createElement("option");
    option5.value="Proposal";
    option5.innerHTML= "Proposal";

    dropdown.appendChild(option1);    
    dropdown.appendChild(option2);
    dropdown.appendChild(option3);
    dropdown.appendChild(option4);
    dropdown.appendChild(option5);

    var container = document.getElementById("file_ulpoad");

    var div2 = document.createElement("div");
    div2.classList.add("col-md-5");

    var div3 = document.createElement("div");
    div2.classList.add("custom-file");

    var input = document.createElement("input");
    input.setAttribute("type","file");
    input.classList.add("custom-file-input");
    input.id = "customFile";

    var label = document.createElement("label");
    label.classList.add("custom-file-label");
    label.setAttribute("for","customFile");
    var text = document.createTextNode("Choose a file");
    label.appendChild(text);


    var button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-primary");
    button.classList.add("btn-block");
    button.classList.add("text-white");
    button.classList.add("project-add-file-btn");
    button.onclick = addFile;
    button.innerHTML = "Add File";

    div3.appendChild(input);
    div3.appendChild(label);
    div2.appendChild(div3);
    div.appendChild(dropdown);
    container.appendChild(div);
    container.appendChild(div2);
   container.appendChild(button);

   this.value=="remove";

}