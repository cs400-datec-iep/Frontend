
/*////////////////////////////////////

Function to display progress bar for fileupload

*/////////////////////////////////////
function displayProcess(process) {

    document.getElementById("uploadProgressBar").style.width = process + '%';
    document.getElementById("uploadProgressBar").innerHTML = process + '%';

}

/*////////////////////////////////////

Function to upload file blob to storage

*/////////////////////////////////////
function uploadBlob() {

    // Show progress bar
    displayProcess(0);
    document.getElementById("uploadProgressBarContainer").classList.remove('hidden');

    /////////////////////////////////////////////////////////////////////////////////
    //Setup Azure storage connection////////////////////////////////////////////////
    var blobUri = 'https://' + 'dateciepfiles' + '.blob.core.windows.net' + '/files';
    var fileLocation = blobUri + "/internal";
    var SASS = '?sv=2018-03-28&ss=b&srt=sco&sp=rwdlac&se=2021-10-14T13:50:19Z&st=2019-08-29T05:50:19Z&spr=https,http&sig=bxQCmWAAas9zXW0L3bAnQFKzqvmjHI8SRMeCE%2BcMwwM%3D';
    var blobService = AzureStorage.Blob.createBlobServiceWithSas(blobUri, SASS);
    /////////////////////////////////////////////////////////////////////////////////

    //Urls
    var urlGetLastProjectID = urlMain+'api/GetLastProjectID';

    //Get Last Project ID
    async function lastProjID() {
        let response = await fetch(urlGetLastProjectID, {
            method: 'GET',
            crossDomain: true,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        //Store Result into var
        var lastProjID = response.json();

        lastProjID.then(function (result) {

            //If one file has been selected in the HTML file input element
            var file = $('#FileInput').get(0).files[0];
            var lastProjectID = result;
            var customBlockSize = file.size > 1024 * 1024 * 32 ? 1024 * 1024 * 4 : 1024 * 512;
            blobService.singleBlobPutThresholdInBytes = customBlockSize;
            var finishedOrError = false;
            var speedSummary = blobService.createBlockBlobFromBrowserFile('internal', lastProjectID + "_" + file.name, file, { blockSize: customBlockSize }, function (error, result, response) {
                finishedOrError = true;
                if (error) {
                    alert('Error');
                } else {
                    displayProcess(100);

                    //Data encapsulation
                    var payload_files = {
                        'ProjectID': lastProjectID,
                        'Name': file.name,
                        'Type': file.name.split('.').pop(),
                        'Directory': fileLocation + "/" + lastProjectID + "_" + file.name
                    }
                    ArrayOfFiles.push(payload_files);
                }
            });

            //Refersh progress bar
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

            //Get html container
            var list = document.getElementById("fileList");

            //Generate upload file list with remove button
            //File list container
            var item = document.createElement("li");
            item.classList.add();
            item.id = file.name;

            //File name in list
            var p = document.createElement("p");
            p.innerHTML = "<a href='" + fileLocation + "/" + lastProjectID + "_" + file.name + "'>" + file.name + "</a>";

            //Delete file button
            var btn = document.createElement("button");
            btn.classList.add('btn-circle', 'btn-danger', 'col-md-2', 'ml-2');
            btn.innerHTML = "X";
            btn.setAttribute("type", "button");
            btn.onclick = function () {
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

        })
    }
    lastProjID();
}