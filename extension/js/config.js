function saveOptions(blacklist) {
  blacklist = blacklist.replace(/\s+/g, "").toLowerCase().split(",");
  blacklist = blacklist.filter(function(item) {return item.length > 1;});
  chrome.storage.sync.set({
      "blacklist": blacklist
    },
    function() {
      $("#save-btn").text("Saved");
      $("#save-btn").css('background-color', 'lightgreen');
      populateSettings();
    }
  );
}

function reset(){
    chrome.storage.sync.set({
      "blacklist": default_blacklisted_sites
    },
    function() {
      populateSettings();
    }
  ); 
}

function populateSettings() {
  $("blacklist input").val("");
  chrome.storage.sync.get(null, function(result) {
    $("#blacklist input").val(result.blacklist.join(", "));
  });
}

$(document).ready(function() {
  $("#blacklist").keypress(function(e) {
    if (e.which == 13) {
      e.preventDefault();
      saveOptions(e.target.value);
    }
  });

  populateSettings();
});
