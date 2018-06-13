// Grab the articles as a json
updateArticles();

$('#update-articles').on('click', ()=>{
    updateArticles();
})

$(document).on('click','.save', function(){
    data = {}
    data.title = $(`.article_${$(this).data('number')}`).text();
    data.link = $(`.article_${$(this).data('number')}`).attr('href');
    $.ajax({
        url: 'article/save',
        data: data,
        method: 'post'

}).then(d=>{
    alert(d.title + " has been saved.")
})
})
  // Whenever someone clicks a p tag
//   $(document).on("click", "p", function() {
//     // Empty the notes from the note section
//     $("#notes").empty();
//     // Save the id from the p tag
//     var thisId = $(this).attr("data-id");
  
//     // Now make an ajax call for the Article
//     $.ajax({
//       method: "GET",
//       url: "/articles/" + thisId
//     })
//       // With that done, add the note information to the page
//       .then(function(data) {
//         console.log(data);
//         // The title of the article
//         $("#notes").append("<h2>" + data.title + "</h2>");
//         // An input to enter a new title
//         $("#notes").append("<input id='titleinput' name='title' >");
//         // A textarea to add a new note body
//         $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
//         // A button to submit a new note, with the id of the article saved to it
//         $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
//         // If there's a note in the article
//         if (data.note) {
//           // Place the title of the note in the title input
//           $("#titleinput").val(data.note.title);
//           // Place the body of the note in the body textarea
//           $("#bodyinput").val(data.note.body);
//         }
//       });
//   });
 
  function updateArticles(){
    $.getJSON("/articles", function(data) {
        $('#articles').empty();
        // For each one
        for (var i = 0; i < data.length; i++) {
            let wrapper = $(`<div class="card">`);
            let heading = $('<div class="card-header">');
            let cardBody = $('<div class="card-body">')
            let headingH3 = $('<h3>');
            let titleLink = $(`<a class="article_${i}">`).attr('href', data[i].link).text(data[i].title);
            let saveButton = $('<button class="btn btn-success save">').text('Save Article').data('number', i);
            heading.append(headingH3);
            headingH3.append(titleLink)
            cardBody.append(saveButton);
            wrapper.append(heading);
            wrapper.append(cardBody);

          // Display the apropos information on the page
          $("#articles").append(wrapper);
        }
      });
      
  }