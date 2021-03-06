$(document).ready(function () {

  $("#second-navigation").css("display","none");

  var blogContainer = $(".blog-container");
  var postCategorySelect = $("#category");

  $(document).on("click", "button.delete", handlePostDelete);
  $(document).on("click", "button.edit", handlePostEdit);

  var posts;

  $('#search-menu').on("click", function () {
    event.preventDefault();
    $("#main-navigation").css("display","none");
    $("#second-navigation").css("display","inline");
  });

  var url = window.location.search;
  var authorId;
  if (url.indexOf("?author_id=") !== -1) {
    authorId = url.split("=")[1];
    getPosts(authorId);
  }

  else {
    getPosts();
  }

  $('#search-input').keyup(function () {
    console.log("key");
    autocomplete($(this).val().trim());
  });



  function getPosts(author) {
    authorId = author || "";
    if (authorId) {
      authorId = "/?author_id=" + authorId;
    }
    $.get("/api/posts" + authorId, function (data) {
      console.log("Posts", data);
      posts = data;
      if (!posts || !posts.length) {
        displayEmpty(author);
      }
      else {
        initializeRows();
      }
    });
  }

  function deletePost(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/posts/" + id
    })
      .then(function () {
        getPosts(postCategorySelect.val());
      });
  }

  function initializeRows() {
    blogContainer.empty();
    var postsToAdd = [];
    for (var i = 0; i < posts.length; i++) {
      postsToAdd.push(createNewRow(posts[i]));
    }
    blogContainer.append(postsToAdd);
  }

  function createNewRow(post) {
    var formattedDate = new Date(post.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
    var newPostCard = $("<div>");
    newPostCard.addClass("card float-left mr-3");
    newPostCard.css({
      width: '30%'
    });
    var newPostCardHeading = $("<div>");
    newPostCardHeading.addClass("card-header");
    var deleteBtn = $("<button>");
    deleteBtn.text("x");
    deleteBtn.addClass("delete btn btn-danger");
    var editBtn = $("<button>");
    editBtn.text("EDIT");
    editBtn.addClass("edit btn btn-info");
    var newPostTitle = $("<h4>");
    newPostTitle.addClass("text-dark");
    var newPostDate = $("<small>");
    var newPostAuthor = $("<p>");
    newPostAuthor.text("Posted by: " + post.Author.firstName + " " + post.Author.lastName);
    newPostAuthor.css({
      float: "right",
      color: "blue"
    });
    var newPostCardBody = $("<div>");
    newPostCardBody.addClass("card-body");
    var newPostBody = $("<p>");
    newPostTitle.text(post.title + " ");
    //Blob

    //body of the card
    newPostBody.html(
      "<img src='" + post.image + "'> </img><p>" + post.make + " " + post.model + "<br>" + post.year + "<br>$" + post.price + "/day</p>"
    );
    console.log(post.image);
    newPostDate.text("Posted: " + formattedDate);
    newPostCardBody.append(newPostDate);
    newPostCardHeading.append(deleteBtn);
    newPostCardHeading.append(editBtn);
    newPostCardHeading.append(newPostTitle);
    newPostBody.append(newPostAuthor);
    newPostCardBody.append(newPostBody);
    newPostCard.append(newPostCardHeading);
    newPostCard.append(newPostCardBody);
    newPostCard.data("post", post);
    return newPostCard;
  }

  function handlePostDelete() {
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");
    deletePost(currentPost.id);
  }

  function handlePostEdit() {
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");
    window.location.href = "/cms?post_id=" + currentPost.id;
  }

  function displayEmpty(id) {
    var query = window.location.search;
    var partial = "";
    if (id) {
      partial = " for Author #" + id;
    }
    blogContainer.empty();
    var messageH2 = $("<h2>");
    messageH2.css({ "text-align": "center", "margin-top": "50px" });
    messageH2.html("No cars posted yet" + partial + ", Sign Up <a href='/signup" + query +
      "'>here</a> to get started.");
    blogContainer.append(messageH2);
  }

  function autocomplete(val) {
    var queryURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
      + val + '.json?access_token=pk.eyJ1Ijoic29uam9oYW4iLCJhIjoiY2pqMHNuaXpxMGh5dzNrbzR4dDhjazRsMCJ9.Uk7w4H_ayd295uZifRYCbg&autocomplete=true';
    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function (response) {
      var availableTags = [];
      for (i = 0; i < response.features.length; i++) {
        availableTags.push(response.features[i].place_name);
      };
      $(function () {
        $("#search-input").autocomplete({
          source: availableTags
        });
      });
    });
  };

});
