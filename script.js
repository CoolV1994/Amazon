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


function showSection (id, show)
{
  var section = getElement(id);
  section.class = show ? "show" : "hidden";
}


/** Page: Main **/

function redirectItem ()
{
  if (!ARG_TAG) {
    ARG_TAG = TAG_DEFAULT;
  }
  if (!ARG_ITEM) {
    return false;
  }
  var url = `${URL_AMAZON}/dp/${ARG_ITEM}/?tag=${ARG_TAG}`;
  setLink(URL_REDIRECT, url);
  setURL(url);
  return true;
}



/** Page: Link **/

function newLinkItem ()
{
  var oldItem = getElement(URL_OLD);
  var oldURL = oldItem.value;
  console.log(`[Link] URL: ${oldURL}`);
  if (!oldURL) {
    setText(TEXT_MESSAGE, "Error: Invalid URL");
    return;
  }
  var itemID = idItemFromURL(oldURL);
  console.log(`[Link] Item: ${itemID}`);
  if (!itemID) {
    setText(TEXT_MESSAGE, "Error: Invalid ID");
    return;
  }
  setText(TEXT_MESSAGE, `Item ID: ${itemID}`);
  var newURL = `${URL_SITE}/?item=${itemID}`;
  console.log(`[Link] New: ${newURL}`);
  setValue(URL_NEW, newURL);
}


function addListeners ()
{
  getElement(BUTTON_LINK).addEventListener("click", newLinkItem);
  getElement(BUTTON_COPY).addEventListener("click", copyText(BUTTON_COPY));
}



/** Page: Load **/

function pageLoad ()
{
  addListeners();
//  showSection(SECTION_NOSCRIPT, false);
  var redirect = redirectIten();
  showSection(SECTION_REDIRECT, redirect);
  showSection(SECTION_LINK, !redirect);
}

