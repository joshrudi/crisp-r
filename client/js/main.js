
checkCurrentUrlForRedirect()

async function checkCurrentUrlForRedirect() {

  if (window.location.pathname != '/') {

    let longUrl = await callGetLongUrlApi(window.location.pathname.split('/')[1])
    if (longUrl != 'none') {
      window.location = longUrl
    }
  }
}

function copyStringToClipBoard(str) {

    const elem = document.createElement('textarea');
    elem.value = str
    document.body.appendChild(elem)
    elem.select()
    document.execCommand('copy')
    document.body.removeChild(elem)
}

function isValidUrl(urlStr) {

  try {
    let url = new URL(urlStr)
    return true
  } catch (error) {
    return false
  }
}

async function generateUrl() {

  let longUrl = document.getElementById('inputUrl').value.toString()

  if (!isValidUrl(longUrl)) {
    if (!isValidUrl('https://' + longUrl)) {
      toastPopup('Invalid URL!')
      return
    } else {
      longUrl = 'https://' + longUrl
    }
  }

  let shortUrl = await callGenerateUrlApi(longUrl)

  document.getElementById("generatedUrlTextBox").innerHTML = 'localhost:8080/' + shortUrl;
}

async function copyUrlToClipboard() {

  let urlToCopy = document.getElementById('generatedUrlTextBox').innerHTML
  if (urlToCopy == 'Please enter a URL') {
    toastPopup('Nothing to Copy!')
  } else {
    copyStringToClipBoard(urlToCopy)
    toastPopup('URL Copied to Clipboard!')
  }
}

async function toastPopup(message) {

  let snackbarContainer = document.querySelector('#toast');
  let data = {message: message};
  snackbarContainer.MaterialSnackbar.showSnackbar(data);
}