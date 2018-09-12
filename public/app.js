// $(document).ready(function() {
  $(document).on("click", ".btn.btn-warning.scrape", function() {
  // Grab the articles as a json
  $.getJSON("/api/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
      // Display the articles information on the page
      $("#articles").prepend(
        "<div class='card' data-id='" +
          data[i]._id +
          "'><p id='title'>" +
          data[i].title +
          "</p><p id='summary'>" +
          data[i].summary +
          "<br><a href=" +
          data[i].link +
          ">" +
          data[i].link +
          "</a></p><center><button id='comment' type='button' class='btn btn-dark' data-id='" +
          data[i]._id +
          "'>Comment</button></center></div><hr>"
      );
    }
  });

  //comment is clicked
  $(document).on("click", "#comment", function() {
    // Empty the notes from the comment section
    $("#comments").empty();

    var thisId = $(this).attr("data-id");

    $.ajax({
      method: "GET",
      url: "/api/articles/" + thisId
    }).then(function(data) {
      for (var i = 0; i < data.comment.length; i++) {
        $("#comments").append(
          "<p id='commentAdded'>Title: " +
            data.comment[i].title +
            "<br>Comment: " +
            data.comment[i].body +
            "<button type='button' class='deletecomment btn btn-dark' data-id='" +
            data._id +
            "' id='" +
            data.comment[i]._id +
            "'>Delete Comment</button></p><br><hr>"
        );
      }

      var commentP = $("<div data-id='" + data._id + "'></div>");
      // The title of the article
      commentP.append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      commentP.append(
        "<input id='titleinput' name='title' placeholder='Title'>"
      );
      // A textarea to add a new comment body
      commentP.append(
        "<textarea id='bodyinput' name='body' placeholder='Comment'></textarea>"
      );
      // A button to submit a new comment, with the id of the article saved to it
      commentP.append(
        "<br><center><button type='button' class='btn btn-dark' data-id='" +
          data._id +
          "' id='savecomment'>Save Comment</button></center>"
      );
      $("#commentTextArea").empty();
      $("#commentTextArea").append(commentP);

      if (data.comment) {
        // Place the title of the comment in the title input
        $("#titleinput").val(data.comment.title);
        // Place the body of the comment in the body textarea
        $("#bodyinput").val(data.comment.body);
      }
    });
  });

  // When you click the savecomment button
  $(document).on("click", "#savecomment", function(event) {
    event.preventDefault();
    var thisId = $(this).attr("data-id");
    var id = $(this).attr("data-id");

    // Run update POST request to add comment, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/api/articles/" + thisId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    }).then(function(data) {
      $.ajax({
        method: "GET",
        url: "/api/articles/" + id
      }).then(function(data) {
        $("#comments").empty();
        for (var i = 0; i < data.comment.length; i++) {
          $("#comments").append(
            "<p id='commentAdded'>Title: " +
              data.comment[i].title +
              "<br>Comment: " +
              data.comment[i].body +
              "<button type='button' class='deletecomment btn btn-dark' data-id='" +
              data._id +
              "' id='" +
              data.comment[i]._id +
              "'>Delete Comment</button></p><br><hr>"
          );
        }
      });
    });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

  $(document).on("click", ".deletecomment", function(event) {
    var thisId = $(this).attr("id");
    var id = $(this).attr("data-id");
    $.ajax({
      method: "DELETE",
      url: "/api/articles/" + thisId
    }).then(function(data) {
      $.ajax({
        method: "GET",
        url: "/api/articles/" + id
      }).then(function(data) {
        $("#comments").empty();
        for (var i = 0; i < data.comment.length; i++) {
          $("#comments").append(
            "<p id='commentAdded'>Title: " +
              data.comment[i].title +
              "<br>Comment: " +
              data.comment[i].body +
              "<button type='button' class='deletecomment btn btn-dark' data-id='" +
              data._id +
              "' id='" +
              data.comment[i]._id +
              "'>Delete Comment</button></p><br><hr>"
          );
        }
      });
    });
  });
});
