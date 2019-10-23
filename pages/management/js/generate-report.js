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