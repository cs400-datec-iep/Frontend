function getData() {




}

function post_Json_Data(payload, token, url) {
  sessionStorage.setItem("created_User", "null");

  fetch(url, {
    async: false,
    method: 'POST',
    crossDomain: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(payload)
  }).then(function (a) { return a.json(); })
    .then(function (j) {
      console.log(j);
      sessionStorage.setItem("created_User", j);
      return j;
    }).catch(error => { console.error('Error:', error); return error; });


}


function putData() {




}