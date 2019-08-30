function displayProcess(process) {

    document.getElementById("uploadProgressBar").style.width = process + '%';
    document.getElementById("uploadProgressBar").innerHTML = process + '%';
    
}

function uploadBlob() {
    // Show progress bar
    displayProcess(0);
    document.getElementById("uploadProgressBarContainer").classList.remove('hidden');

    var blobUri = 'https://' + 'dateciepfiles' + '.blob.core.windows.net' + '/files';
    var fileLocation = blobUri + "/internal";
    var SASS = '?sv=2018-03-28&ss=b&srt=sco&sp=rwdlac&se=2021-10-14T13:50:19Z&st=2019-08-29T05:50:19Z&spr=https,http&sig=bxQCmWAAas9zXW0L3bAnQFKzqvmjHI8SRMeCE%2BcMwwM%3D';
    var blobService = AzureStorage.Blob.createBlobServiceWithSas(blobUri, SASS);
    var token = sessionStorage.getItem("token");
    var urlGetProjectID = 'https://datectestapi.azurewebsites.net/api/GetLastProjectID';

    //Get Last Project ID
    fetch(urlGetProjectID, {
        async: false,
        method: 'GET',
        crossDomain: true,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(function (a) { return a.json() })
    .then(function (j) {
        localStorage.setItem("newProjectID", j.Result + 1);
    })
    .catch(error => { console.error('Error:', error); return error; });

    // If one file has been selected in the HTML file input element
    var file = $('#FileInput').get(0).files[0];
    var lastProjectID = localStorage.getItem("newProjectID");

    var customBlockSize = file.size > 1024 * 1024 * 32 ? 1024 * 1024 * 4 : 1024 * 512;
    blobService.singleBlobPutThresholdInBytes = customBlockSize;

    var finishedOrError = false;
    var speedSummary = blobService.createBlockBlobFromBrowserFile('internal',lastProjectID+ "_" +file.name, file, { blockSize: customBlockSize }, function (error, result, response) {
        finishedOrError = true;
        if (error) {
            alert('Error');
        } else {
            displayProcess(100);
        }
    });

    function refreshProgress() {
        setTimeout(function () {
            if (!finishedOrError) {
                var process = speedSummary.getCompletePercent();
                displayProcess(process);
                refreshProgress();
            }
        }, 200);
    }

    refreshProgress();

    var list = document.getElementById("fileList");
    var item = document.createElement("li");
    var p =  document.createElement("p");
    p.innerHTML = "<a href='"+fileLocation+"/"+ lastProjectID+ "_" +file.name +"'>"+file.name+"</a>";
    item.appendChild(p);
    list.appendChild(item);
}