/** Amazon Affiliate **/

var URL_AMAZON = "https://www.amazon.com";

var REGEX_ID_ITEM = "";
var REGEX_ID_LIST = "";

var QUERY_STRING = window.location.search;
var URL_PARAMS = new URLSearchParams(QUERY_STRING);

var ARG_ITEM = URL_PARAMS.get("item");
console.log(`[Arg] Item ID: ${ARG_ITEM}`);

var ARG_LIST = URL_PARAMS.get("list");
console.log(`[Arg] List ID: ${ARG_LIST}`);

var ARG_TAG = URL_PARAMS.get("tag");
console.log(`[Arg] Tag ID: ${ARG_TAG}`);

