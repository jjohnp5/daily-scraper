$('.add-note').on('click', function(){
    console.log($(this)[0].nextElementSibling.classList)
    $(this).siblings()[0].classList.remove('d-none');
})
$('.update-note').on('click', function(){
    console.log($(this).siblings())
    let noteId = $(this).data('id');
    let text = $(`.note-${noteId}`).text().trim()
    console.log($(`#${noteId}`))
    $(`#${noteId}`).val(text);
    $(this).siblings()[0].classList.remove('d-none');
})
  // When you click the savenote button
  $(document).on("click", "#add-note", function() {
    // Grab the id associated with the article from the submit button
    let artId = $(this).data("id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: `/article/${artId}/notes/add`,
      data: {
        // Value taken from title input
        // Value taken from note textarea
        body: $(`#${artId}`).val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        let noteBody = $(`<p class="note note-${data.note._id}">`).text(data.note.body)
        $(`.note-container-${noteId}`).append(noteBody);

        // Empty the notes section
        $('.add-note-form').addClass('d-none');
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $(`#${artId}`).val("")
    location.reload();
  });
  // When you click the savenote button
  $(document).on("click", "#update-note", function() {
    // Grab the id associated with the article from the submit button
    let noteId = $(this).data("id");
    
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "PUT",
      url: `/notes/update/${noteId}`,
      data: {
        // Value taken from title input
        // Value taken from note textarea
        body: $(`#${noteId}`).val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        $(`.note-${data._id}`).text(data.body);

        // Empty the notes section
        $('.add-note-form').addClass('d-none');
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $(`#${noteId}`).val("")
  });
  
