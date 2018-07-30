// Grab the articles as a json
$.getJSON("/api/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the articles information on the page
    $("#articles").append(
      "<p data-id='" +
        data[i]._id +
        "'>" +
        data[i].title +
        "<br />" +
        data[i].summary +
        "<br />" +
        data[i].link +
        "</p>"
    );
  }
});

// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#comments").empty();

  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/api/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      for (var i = 0; i < data.comment.length; i++) {
        $("#comments").append(
          "<p>" +
            data.comment[i].title +
            "<br />" +
            data.comment[i].body +
            "<button data-id='" +
            data._id +
            "' id='deletecomment'>Delete Comment</button></p>"
        );
      }

      var commentP = $("<div data-id='" + data._id + "'></div>");
      // The title of the article
      commentP.append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      commentP.append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      commentP.append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      commentP.append(
        "<button data-id='" +
          data._id +
          "' id='savecomment'>Save Comment</button>"
      );
      // If there's a note in the article
      $("#comments").append(commentP);

      if (data.comment) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.comment.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.comment.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savecomment", function() {
  event.preventDefault();
  // Grab the id associated with the article from the submit button
  var commentP = $(this).parent();
  var commentC = commentP.children();
  var commentCC = commentC.children("#comments");
  var commentText = commentCC.val();
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/api/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      // body: $("#bodyinput").val()
      body: commentText
    }
  }).then(function(newComment) {
    $(".commentText").val("");

    var html =
      "<p>" +
      newComment.comment +
      " - - " +
      "</p>";
    $("#" + newComment.thisId + "").append(html);
  });
  // Empty the notes section
  // $("#comments").empty();


  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$(document).on("click", "#deletecomment", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "DELETE",
    url: "/api/articles/" + thisId
  }).then(function(err) {
    if (err) throw err;
  });

  $.ajax({
    method: "GET",
    url: "/api/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log("this is the data " + data);
      for (var i = 0; i < data.comment.length; i++) {
        $("#comments").append(
          "<p>" +
            data.comment[i].title +
            "<br />" +
            data.comment[i].body +
            "</p><button data-id='" +
            data._id +
            "' id='deletecomment'>Delete Comment</button>"
        );
      }
    });
});
