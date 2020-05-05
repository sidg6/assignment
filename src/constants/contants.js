
export const CONSTANTS = function () {

 const API = {
  API_URL: window.location.search !==''? "https://hn.algolia.com/api/v1/search":"https://hn.algolia.com/api/v1/search?page="
 }

 return {
  API: API
 }
}();
