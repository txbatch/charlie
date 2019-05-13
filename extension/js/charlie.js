var elms = 0;

function substitute(node) {
  var ignore = [
    "STYLE",
    "SCRIPT",
    "NOSCRIPT",
    "OBJECT",
    "SVG",
    "INPUT",
    "IFRAME",
    "FORM",
    "TEXTAREA"
  ];
  if (ignore.indexOf(node.parentElement.tagName) == -1) {
    elms += 1;
    // Strip commas from numbers
    if (node.nodeValue.match(/([0-9],[0-9])/g)) {
      node.nodeValue = node.nodeValue.replace(/,/g, "");
    }
  }
}

function iterate() {
  var current_elms = elms;
  elms = 0;
  console.log("Looking for commas...");

  var node, iter;
  iter = document.createNodeIterator(document.body, NodeFilter.SHOW_TEXT);
  while ((node = iter.nextNode())) {
    substitute(node);
  }

  if (elms > current_elms) {
    setTimeout(function(){iterate();}, 500);
  } else {
    setTimeout(function(){iterate();}, 3000);
  }
}

iterate();