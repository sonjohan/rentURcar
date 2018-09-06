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
    var newPost = {
      title: titleInput.val().trim(),
      make: makeInput.val().trim(),
      model: modelInput.val().trim(),
      year: parseFloat(yearInput.val().trim()),
      price: parseFloat(priceInput.val().trim()).toFixed(2),
      image: imageInput.val(),
      AuthorId: authorSelect.val()
    };

    if (updating) {
      newPost.id = postId;
      updatePost(newPost);
    }
    else {
      submitPost(newPost);
    }
  }

  function submitPost(post) {
    $.post("/api/posts", post, function() {
      window.location.href = "/";
    });
  }

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
        titleInput.val(data.title);
        makeInput.val(data.body);
        modelInput.val(data.model);
        yearInput.val(data.year);
        priceInput.val(data.price);
        imageInput.val(data.image);
        authorId = data.AuthorId || data.id;
        updating = true;
      }
    });
  }

  function getAuthors() {
    $.get("/api/authors", renderAuthorList);
  }
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

  function createAuthorRow(author) {
    var listOption = $("<option>");
    listOption.attr("value", author.id);
    listOption.text(author.firstName + " " + author.lastName);
    return listOption;
  }

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
