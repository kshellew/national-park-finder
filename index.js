'use strict';

// put your own value below!
const apiKey = 'wkFxl3F3UFamHzW0lgQUV9msukRgbdVAUcbCLEdz'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const state = $('#js-state-code').val();
    const maxResults = $('#js-max-results').val();
    getPark(state, maxResults);
  });
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function getPark(query, maxResults=10) {
  const params = {
    api_key: apiKey,
    limit: maxResults,
    stateCode: query,
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function displayResults(responseJson) {


  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  $('#js-state-code').val('');
  $('#js-max-results').val('');
  // iterate through the returned object
  for (let i = 0; i < responseJson.data.length; i++){
    // for each object add a list item to the results list with the park name, description, website url and address
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>Description: ${responseJson.data[i].description}</p>
      <a href='${responseJson.data[i].url}' target="_blank">Park URL</a> 
      <p>Park Directions: ${responseJson.data[i].directionsInfo}</p>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
};

$(watchForm);