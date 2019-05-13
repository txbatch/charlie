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
  if (ignore.indexOf(node.parentNode.tagName) === -1) {
    elms += 1;
    // Strip commas from numbers, and add zeroes where appropriate
    if (node.nodeValue.match(/([0-9],[0-9])/)) {
      node.nodeValue = node.nodeValue.replace(/,/g, "");
    }
    // Hide dollar amounts
    if (node.nodeValue.match(/\$[0-9]+.[0-9]+/)) {
      // Usually these are inside brackets or added alongside numbers
      node.nodeValue = node.nodeValue.replace(/\$[0-9]+.[0-9]+/, "").replace(/\(\)|\[\]|\/|at|\@/g, "").trim();
      // If it's a self-encapsulated element, then remove it
      if (node.nodeValue === "") {
        node.parentNode.remove();
      }
    }
    // (Loose) attempt to de-link addresses & txids
    if (node.parentNode.tagName === "A" && !($(node.parentNode).hasClass("charlie-link")) && ! (!node.nodeValue.match(/([0-9]|[A-Z]){30}/i))) {
      var el = node.parentNode;
      var txt = node.nodeValue;
      node.nodeValue = "[View " + (txt.length <= 60 ? "Address" : "Transaction") + "]"; // This can appear left or right depending on the explorer
      $(el).css('padding-right', '5px');
      // We use an <a> link so styling is preserved...
      $(el).before('<a style="padding-right: 5px; text-decoration: none; color: green" class="charlie-link">' + txt +'</a>');

      /* Copy text on click
      $(el.parentNode).on('click', 'a.charlie-link', function(event) {
        var copy_text = event.target.innerText;
        if (copy_text.length >= 1) {
          var copy_box = document.createElement("input");
          copy_box.setAttribute("type", "text");
          copy_box.setAttribute("value", copy_text);
          copy_box.setAttribute("id", "copy_box");
          document.body.appendChild(copy_box);
          copy_box = document.getElementById("copy_box");
          copy_box.select();
          var successful = document.execCommand('copy');
          if (successful) {
            console.log('Copied "' + copy_text + '"');
          } else {
            console.log('Could not copy...');
          }
          copy_box.parentNode.removeChild(copy_box);
          window.getSelection().removeAllRanges()
        }
        var new_selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(event.target);
        new_selection.removeAllRanges();
        new_selection.addRange(range);
      });
      */

    }
  }
}

var multi = 0;

function iterate() {
  var current_elms = elms;
  elms = 0;

  var node, iter;
  iter = document.createNodeIterator(document.body, NodeFilter.SHOW_TEXT);
  while ((node = iter.nextNode())) {
    substitute(node);
  }

  if (elms > current_elms) {
    setTimeout(function(){iterate();}, 500);
  } else {
    setTimeout(function(){iterate();}, multi+500);
  }
}

iterate();