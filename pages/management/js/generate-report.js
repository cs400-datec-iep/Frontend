function generateReport(){

    var createXLSLFormatObj = [];
 
    /* XLS Head Columns */
    var xlsHeader = ["Project Name", "Work Done(%)","Expected Work Done(%)"];

    var raw = JSON.parse(sessionStorage.getItem("duedates"));
    var raw1 = JSON.parse(sessionStorage.getItem("timeline"));
    var raw2 = JSON.parse(sessionStorage.getItem("billing"));
    var raw3 = JSON.parse(sessionStorage.getItem("project_status"));
    var raw4 = JSON.parse(sessionStorage.getItem("project_progress_status"));

    var data = [];

    for(var i = 1; i < raw.length; i++){
        data.push(raw[i]);
    }

    for(var i = 0; i < 2; i++){
    data.push({});
    }

    data.push(["Project Name","Progress Status","Start Date","Expected End Date"]);
    for(var i = 1; i < raw1.length; i++){
        data.push(raw1[i]);
    }

    for(var i = 0; i < 2; i++){
        data.push({});
    }

    data.push(["Project Name","Project Cost","Amount Billed"]);
    for(var i = 1; i < raw2.length; i++){
        data.push(raw2[i]);
    }

    for(var i = 0; i < 2; i++){
        data.push({});
    }

    data.push(["Number Active","Number Inactive"]);
    for(var i = 0; i < raw3.length; i++){
        data.push(raw3[i]);
    }

    for(var i = 0; i < 2; i++){
        data.push({});
    }

    data.push(["Status","Number"]);
    for(var i = 0; i < raw4.length; i++){
        data.push(raw4[i]);
    }
    
    /* XLS Rows Data */
    var xlsRows = data;

    createXLSLFormatObj.push(xlsHeader);
    $.each(xlsRows, function(index, value) {
        var innerRowData = [];
        $.each(value, function(ind, val) {

            innerRowData.push(val);
        });
        createXLSLFormatObj.push(innerRowData);
    });

    /* File Name */
    var filename = "Smart_Reporting:"+new Date()+".xlsx";

    /* Sheet Name */
    var ws_name = "Sheet 1";

    if (typeof console !== 'undefined') console.log(new Date());
    var wb = XLSX.utils.book_new(),
        ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);

    /* Add worksheet to workbook */
    XLSX.utils.book_append_sheet(wb, ws, ws_name);

    /* Write workbook and Download */
    if (typeof console !== 'undefined') console.log(new Date());
    XLSX.writeFile(wb, filename);
    if (typeof console !== 'undefined') console.log(new Date());
}

// function generateReportPdf(){
//         // create BytescoutPDF object instance
//         var pdf = new BytescoutPDF();

//         // set document properties: Title, subject, keywords, author name and creator name
//         pdf.propertiesSet("Sample document title", "Sample subject", "keyword1, keyword 2, keyword3", "Document Author Name", "Document Creator Name");

//         // set page size
//         pdf.pageSetSize(BytescoutPDF.A4);

//         // set page orientation (BytescoutPDF.PORTRAIT = portrait, BytescoutPDF.LANDSCAPE = landscape)
//         pdf.pageSetOrientation(BytescoutPDF.PORTRAIT);

//         // add new page
//         pdf.pageAdd();

//     if (!IsInternetExplorer8OrLower) // images and drawings from canvas are supported on IE version 9 and higher, other modern browsers should work fine
//     {
//         // create temporary canvas (you can also simply get existing canvas)
//         var canvas = document.createElement('canvas');
//         // set width and height
//         canvas.width = 320;
//         canvas.height = 240;

//         // get context from canvas (to draw on)
//         var context = canvas.getContext("2d");

//         // set white background color
//         context.fillStyle = "#EEEEEE";
//         // and fill the background with white color
//         context.fillRect(0, 0, 320, 240);

//         // draw the yellow circle
//         context.strokeStyle = "#000000";
//         context.fillStyle = "#FFFF00";
//         context.beginPath();
//         context.arc(100, 100, 50, 0, Math.PI * 2, true);
//         context.closePath();
//         context.stroke();
//         context.fill();

//         // load image from canvas into BytescoutPDF
//         pdf.imageLoadFromCanvas(canvas);

//         // place this mage at given X, Y coordinates on the page
//         pdf.imagePlace(20, 40);

//         // place this mage at given coordinates and dimesionson on the page
//         pdf.imagePlaceSetSize(20, 170, 0, 80, 60);
//     }

//         // return BytescoutPDF object instance
//         return pdf;
//     }

// }