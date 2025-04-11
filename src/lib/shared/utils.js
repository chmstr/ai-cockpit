export function sortAutonomyLevels( levels ){
  levels.sort((a, b) => a.level - b.level);
  console.log( "utils.sortLevels", levels );
  return levels;
}

export function setSystemId(sid) {
    console.log("setSystemId: ", sid);
}

export function getById(arr, id) {
  for (var i=0, iLen=arr.length; i<iLen; i++) {
    if (arr[i].$id == id ) return arr[i];
  }
}


export async function getJson( url ){
    const response = await fetch(url);
    console.log( response );
    const parsedValue = await response.json();
    console.log( parsedValue );
    return parsedValue;
}

export async function getJsonFromURL( url ){
    let logmsg = "";
    let res_status = "";
    let json = "";
    await fetch(url, {
        method: "GET",
        headers: {},
        //    mode: 'cors'
      })
        .then(async (response) => {
          logmsg += "|got response";
          console.log("got response");
          //console.log(response);
          //console.log(...response.headers)
          res_status = response.status;

          json = await resolveResponse(response);
    
        })
        .catch((err) => {
          console.error("return error", err);
          json.error = err;
        });
        console.log( "return json: ", json );
        return json;
}

export async function resolveResponse( response){
    let json = "";
    json = await response.json().then((data) => {
        let j = JSON.stringify(data, undefined, 2);
        console.log("resolved json: ", j);
        return j;
      });  
    return json;
}

export async function sendPostRequest( url, data ){
  console.log( "sendPostRequest start");

  // Define the URL to which you want to send the POST request
  //const url = 'https://example.com/api/endpoint';

  // Define the data you want to send in the request body
  // const data = {
  //   key1: 'value1',
  //   key2: 'value2'
  // };
  console.log( "sendPostRequest.data: ", data );

  // Send the POST request using fetch
  await fetch(url, {
    method: 'PATCH', // Specify the HTTP method
    // headers: {
    //   'Content-Type': 'application/json' // Specify the content type
    // },
    body: JSON.stringify(data) // Convert the data to a JSON string
  })
  .then(response => {
    if (!response.ok) {
      // Handle HTTP errors
      throw new Error('sendPostRequest Network response was not ok ' + response.statusText);
    }
    return response.json(); // Parse the JSON from the response
  })
  .then(data => {
    // Handle the JSON data from the response
    console.log('sendPostRequest Success:', data);
  })
  .catch(error => {
    // Handle any errors that occurred during the fetch
    console.error('sendPostRequest Error:', error);
  });

  console.log( "sendPostRequest end");

  return data;

}

export async function sendPatchRequest(url, level, comment) {
  try {
    const payload = {
      level: level,
      comment: comment,
    };
    console.log("payload: ", payload);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.log("response.error: ", response);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // Oder response.text(), falls keine JSON-Antwort erwartet wird
    console.log("response.data:", data);
    return data; // Gibt die Antwort zurück, falls benötigt
  } catch (error) {
    console.error("Fehler beim Senden des PATCH-Requests:", error);
    throw error; // Wirft den Fehler weiter, damit der Aufrufer ihn behandeln kann
  }
}
