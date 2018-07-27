$.getJSON("/api/all", function(data) {
  // Call our function to generate a table body
  displayResults(data);
});

function displayResults(scrapedData) {
  // First, empty the table
  $("tbody").empty();

  // Then, for each entry of that json...
  scrapedData.forEach(function(article) {
    // Append each of the animal's properties to the table
    $("tbody").append(
      "<tr><td>" +article.title + "</td>" +
        "<td>" + article.link +"</td></tr>"
    );
  });
}

