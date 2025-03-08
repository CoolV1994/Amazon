/** Amazon Affiliate **/


/** Constants **/
var URL_AMAZON = "https://www.amazon.com";

/** REGEX **/

var REGEX_ID_ITEM = "([/dp/])([A-Z0-9]{10})";
var REGEX_ID_LIST = "([/wishlist/][ls]?)([A-Z0-9]{13})";


/** Querey **/

var QUERY_STRING = window.location.search;
var URL_PARAMS = new URLSearchParams(QUERY_STRING);


/** URL Args **/

var ARG_ITEM = URL_PARAMS.get("item");
console.log(`[Arg] Item: ${ARG_ITEM}`);

var ARG_LIST = URL_PARAMS.get("list");
console.log(`[Arg] List: ${ARG_LIST}`);

var ARG_TAG = URL_PARAMS.get("tag");
console.log(`[Arg] Tag: ${ARG_TAG}`);


/** HTML **/

function getElement (id) {
  var element = document.getElementById(id);
  return element;
}

function setText(id, text="")
{
  var element = getElement(id);
  element.innerHTML = text;
}

function setValue(id, text="")
{
  var element = getElement(id);
  element.value = text;
}

function setLink (id, url)
{
  var element = getElement(id);
  element.innerHTML = url;
  element.href = url;
}

function setURL (url)
{
  window.location.href = url;
  window.location.replace(url);
}

function copyText(id)
{
    var textBox = getElement(id);
    textBox.select();
    textBox.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(textBox.value);
    alert("Text Copied To Clipboard:\n" + textBox.value);
}


/** Functions **/

function getIdFromURL (regex, url)
{
  var match = url.match(regex);
  console.log(`[Regex] ${match}`);
  if (match.length == 0) {
    return false;
  }
  return match[2];
}

function idItemFromURL (url)
{
  return getIdFromURL(REGEX_ID_ITEM, url);
}

function idListFromURL (url)
{
  return getIdFromURL(REGEX_ID_LIST, url);
}

function getPageURL ()
{
  if (ARG_ITEM) {
    console.log(`[Redirect] Item: ${ARG_ITEM}`);
    return `${URL_AMAZON}/dp/${item}/?tag=${tag}`;
  }
  if (ARG_LIST) {
    console.log(`[Redirect] List: ${ARG_LIST}`);
    return `${URL_SITE}/List.html?id=${ARG_LIST}`;
  }
  console.log(`[Redirect] Link`);
  return `${URL_SITE}/Link.html`;
}

function showSection (id, show)
{
  var section = getElement(id);
  section.class = show ? "show" : "hidden";
}


/** Page: Main **/

function redirectItem (id)
{
  if (!ARG_TAG) {
    ARG_TAG = TAG_DEFAULT;
  }
  if (!ARG_ITEM) {
    return false;
  }
  var url = `${URL_AMAZON}/dp/${ARG_ITEM}/?tag=${ARG_TAG}`;
  setLink(id, url);
  setURL(url);
  return true;
}



/** Page: Link **/

function newLinkItem (idOld, idNew, idMsg)
{
  var oldItem = getElement(idOld);
  var oldURL = oldItem.value;
  console.log(`[Link] URL: ${oldURL}`);
  if (!oldURL) {
    setText(idMsg, "Error: Invalid URL");
    return;
  }
  var itemID = idItemFromURL(oldURL);
  console.log(`[Link] Item: ${itemID}`);
  if (!itemID) {
    setText(idMsg, "Error: Invalid ID");
    return;
  }
  setText(idMsg, `Item ID: ${itemID}`);
  var newURL = `${URL_SITE}/?item=${itemID}`;
  console.log(`[Link] New: ${newURL}`);
  setValue(idNew, newURL);
}


/** Page: List **/

function pageLoad ()
{
  if (redirectIten) {
    
  }
}

