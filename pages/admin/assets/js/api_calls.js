function getData(){




}

function post_Json_Data(payload, token, url){

    fetch(url, {
        async: false,
        method: 'POST',
        crossDomain: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(payload)
      }) .then(function (a) { console.log(a.json());return a.json(); })
      .then(function (j) { 
            return j.status;
      }).catch(error => {console.error('Error:', error); return error;});

}


function putData(){




}