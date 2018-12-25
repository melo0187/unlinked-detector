const loc = window.location
let wsUri
if (loc.protocol === 'https:') {
  wsUri = 'wss:'
} else {
  wsUri = 'ws:'
}
wsUri += '//' + loc.host
var ws = new WebSocket(wsUri)

ws.onopen = function () {
  ws.send('start scanning')
}
ws.onmessage = function (event) {
  var eventObj = JSON.parse(event.data)

  var statusContainer = document.getElementById("status")

  var updateSpan = document.createElement("span")
  var updateText = document.createTextNode(eventObj.msg)
  updateSpan.appendChild(updateText)
  if (eventObj.level === 'WARN')
    updateSpan.classList.add('warning')

  if (!!eventObj.pageUrl)
    updateSpan.setAttribute('pageUrl', eventObj.pageUrl)

  if (statusContainer.lastElementChild.getAttribute('pageUrl') !== updateSpan.getAttribute('pageUrl'))
    statusContainer.appendChild(document.createElement("br"))

  statusContainer.appendChild(updateSpan)
  updateSpan.scrollIntoView()
}