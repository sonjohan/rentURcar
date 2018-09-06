$(document).ready(function() {

  var titleInput = $("#title");
  var makeInput = $("#make");
  var modelInput = $("#model");
  var yearInput = $("#year");
  var priceInput = $("#price");
  var imageInput = $("#image");
  var cmsForm = $("#cms");
  var authorSelect = $("#author");
  
  $(cmsForm).on("submit", handleFormSubmit);

  var url = window.location.search;
  var postId;
  var authorId;

  var updating = false;

  if (url.indexOf("?post_id=") !== -1) {
    postId = url.split("=")[1];
    getPostData(postId, "post");
  }

  else if (url.indexOf("?author_id=") !== -1) {
    authorId = url.split("=")[1];
  }

  getAuthors();

  function handleFormSubmit(event) {
    event.preventDefault();

    if (!titleInput.val().trim() || !authorSelect.val()) {
      return;
    }
    // Constructing a newPost object to hand to the database
    var newPost = {
      title: titleInput.val().trim(),
      make: makeInput.val().trim(),
      model: modelInput.val().trim(),
      year: parseFloat(yearInput.val().trim()),
      price: parseFloat(priceInput.val().trim()).toFixed(2),
      image: imageInput.val(),
      AuthorId: authorSelect.val()
    };

    // If we're updating a post run updatePost to update a post
    // Otherwise run submitPost to create a whole new post
    if (updating) {
      newPost.id = postId;
      updatePost(newPost);
    }
    else {
      submitPost(newPost);
    }
  }

  // Submits a new post and brings user to blog page upon completion
  function submitPost(post) {
    $.post("/api/posts", post, function() {
      window.location.href = "/";
    });
  }

  // Gets post data for the current post if we're editing, or if we're adding to an author's existing posts
  function getPostData(id, type) {
    var queryUrl;
    switch (type) {
    case "post":
      queryUrl = "/api/posts/" + id;
      break;
    case "author":
      queryUrl = "/api/authors/" + id;
      break;
    default:
      return;
    }
    $.get(queryUrl, function(data) {
      if (data) {
        console.log(data.AuthorId || data.id);
        // If this post exists, prefill our cms forms with its data
        titleInput.val(data.title);
        makeInput.val(data.body);
        modelInput.val(data.model);
        yearInput.val(data.year);
        priceInput.val(data.price);
        imageInput.val(data.image);
        authorId = data.AuthorId || data.id;
        // If we have a post with this id, set a flag for us to know to update the post
        // when we hit submit
        updating = true;
      }
    });
  }

  // A function to get Authors and then render our list of Authors
  function getAuthors() {
    $.get("/api/authors", renderAuthorList);
  }
  // Function to either render a list of authors, or if there are none, direct the user to the page
  // to create an author first
  function renderAuthorList(data) {
    if (!data.length) {
      window.location.href = "/cms";
    }
    $(".hidden").removeClass("hidden");
    var rowsToAdd = [];
    for (var i = 0; i < data.length; i++) {
      rowsToAdd.push(createAuthorRow(data[i]));
    }
    authorSelect.empty();
    console.log(rowsToAdd);
    console.log(authorSelect);
    authorSelect.append(rowsToAdd);
    authorSelect.val(authorId);
  }

  // Creates the author options in the dropdown
  function createAuthorRow(author) {
    var listOption = $("<option>");
    listOption.attr("value", author.id);
    listOption.text(author.firstName + " " + author.lastName);
    return listOption;
  }

  // Update a given post, bring user to the blog page when done
  function updatePost(post) {
    $.ajax({
      method: "PUT",
      url: "/api/posts",
      data: post
    })
      .then(function() {
        window.location.href = "/";
      });
  }
});
