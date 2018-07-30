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
        "<br /><a href=" +
        data[i].link +
        ">"+data[i].link+"</a></p><button id='comment' type='button' class='btn btn-dark' data-id='" +
        data[i]._id +"'>Comment</button><hr>"
    );
  }
});

// Whenever someone clicks a p tag
$(document).on("click", "#comment", function() {
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
            "   <button type='button' class='deletecomment btn btn-dark' data-id='" +
            data._id +
            "' id='"+data.comment[i]._id+"'>Delete Comment</button></p><br /><hr>"
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
        "<br /><button type='button' class='btn btn-warning' data-id='" +
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
$(document).on("click", "#savecomment", function(event) {
  var thisId = $(this).attr("data-id");

  // Run update POST request to add comment, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/api/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  }).then(function(newComment) {
  });
  // Empty the notes section
  // $("#comments").empty();

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
  event.preventDefault();
});

$(document).on("click", ".deletecomment", function() {
  var thisId = $(this).attr("id");
  $.ajax({
    method: "DELETE",
    url: "/api/articles/" + thisId
  }).then(function(data) {
  }); 
});
