{

    //This method will only activate when the post is created, but the initial conversion of all the posts to ajax is done by the converttoAjax() mehtod that is mentioned at the end of the this file. 
    let createPost= function(){
        let newPostForm= $('#new-post-form');
        newPostForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type: 'post',       //Since the method of post sending is not POST anymore. As the preventDefault is active, but in the ajax request this could be done.
                url: '/sendposttodb',       //This is the end point that will be hit for the ajax request.
                data: newPostForm.serialize(),      //This converts the post data into json by itself, like the key value pair.
                success: function(data){
                console.log(newPostForm);       //This will output on the browser console.
                console.log(data);
                let newPost=newPostDom(data.data.post);
                $('#posts-list-container').prepend(newPost);
                deletePost($(' .post-delete-button', newPost));     //Execution of this function does not actually deletes the post. It only attatches the link with the delete post. And will only delete the post once you click on the link. This function is like the attatcher of the event listener, and in the function body, we can see that only when the link is clicked to create a new post then this will activate.
                //And the deletePost method only takes one parameter, that parameter will be the a tag. And we could select the a tag, with the help of jquery by using class name and then the post name that is having this class. This will be useful to select the href.
                

                    console.log("$(' .post-delete-button', newPost) : "+ $(' .post-delete-button', newPost));
                // call the create comment class
                
                // new PostComments(data.data.post._id);

                // CHANGE :: enable the functionality of the toggle like button on the new post
                new ToggleLike($(' .toggle-like-button', newPost));         //This functions perfectly.
                    //// console.log("$(' .toggle-like-button', newPost) : "+ $(' .toggle-like-button', newPost));

                new Noty({
                    theme: 'relax',
                    text: "Post published!",
                    type: 'success',
                    layout: 'bottomRight',
                    timeout: 1500                    
                }).show();

                }, error: function(error){
                    console.log(error.responseText);    //This will have to be used, to convert the error to a responseText.                    
                }
            });
        });
    }

    // method to create a post in DOM, this is just like the temporary appearance of the post on the page, in real sense the post is not be added fully.



    // In the below method, I accedentally had post.id in the postDeleteButton section, and the consequence for that is, the compiler was not able to identify, as in the case of html like text, we cannot use post.id and post._id interchangibly. In the other location of javascript we could easily use this, but here we could not do it.
    let newPostDom = function(post){
        return $(`<div id="post-${post._id}" class="allPosts">
                    <div class="postDetails">
                        <div class="postOwnerName">
                            <p>${post.postOwnerName}</p>                    
                        </div>
                        <div class="postContent">
                            <p>${post.content}</p>
                        </div>                    
                            <div class="postDeleteButton">
                                <a class="post-delete-button" href="/posts/destroy/${post._id}">Delete Post</a>
                                
                            </div>
                        <small>                            
                            <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                                0 Likes
                            </a>                        
                        </small>             
                    </div>
                    <div class="postComment">                
                        <form id="post-${ post._id }-comments-form" action="/comment" method="post">
                            <input type="text" name="comment" placeholder="Comment here">
                            <input type="hidden" name="postId" value="${post._id}">
                            <input type="submit" value="Add Comment">
                        </form>                
                    </div>
                    
                    <div class="post-comments-list">                
                        <ul id="post-comments-${post._id}">
                        </ul>
                    </div>
                </div>`)
    }


    let deletePost = function(deleteLink){      //This function is simply attatching the click listener in the format of the ajax and asynchronous manner and this will only be executed only when we click on it.
        // console.log('inside the deletePost '+deleteLink);
        // console.log(deleteLink);
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),        //This is how we will find the href tag from inside the selection of one element of the delete button.
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();   //This selection using the postid makes the post selection easy. This is the main reason why we use the id tag this way, it makes the post selection easy. And then we directly delete it by adding remove button.

                    //There was  a very big confusion here, instead of data.data.post_id I used, data.data.post._id, it seemed correct to me, and the problem is that we could not even figure it out, this is why we do not need to remember things, instead what we should do is remember the process, and use the debugging tool like console.log(data) to really have an understanding of the object variable name. If you even try to mug it up, you will forget.
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }



    // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each.
    //Since the post created before we created, AJAX method was not based on AJAX, so the delete link is not having an AJAX link, this is how retrospecitvely when we upgrade the version of any application, the old posts or old functionality could be integrated with the new functionality. 
    let convertPostsToAjax = function(){
        $('#posts-list-container .allPosts').each(function(){       
            let self = $(this);     //I think here let is used to be sure that the value of 'self' would be something that would not be changed as we loop around, in case of 'var' the value of self might have changed since they are kind of global variable and unlike 'let' it will keep on the last value from the iteration.

            deletePost($(' .post-delete-button', self));

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1];
            // console.log(postId);
            // new PostComments(postId);            //Uncomment this comment to add comments to the posts. I did not do it now since I did not completely understood this part. I have to research this part again, why is this class based component working just fine? Also as I know, since this line is not absolutely necessary for the whole website to be functioning, this line will only make this asynchronous. In the post controller of the comment creation we have not even added the if(req.xhr) condition which means there will be no error while execution of synchronous non-single page website.
            //IMPORTANT : This object when added will only add the ajax nature to the comments that we wish to publish, if we donot add the new PostComments object, then still we will be adding the comment to the page but not with the help of ajax. And at this point I am not able to properly integrate the ajax feature to comments, it seems bit difficult as compared to the addition of ajax to the post. We can anytime comment this line to remove the ajax feature from the comments totally. But the code will still be functioning properly, but as we submit the comment the page will be reloaded every time.
            
        });
    }

    createPost();           //I think this is what is calle the function based component of javascript, this is the main reason why we tried the class based component for comments. These both have similarities and differences, in function based components we runt he function in the end to execute, in the class based components we create the objects and the constructors simply runs our necessary functions for us.

    convertPostsToAjax();       //After creating the new functionality of AJAX, we could easily add the new functionality to all the posts retrospectively. We converted the post to AJAX and added a delete link to it so that all the old posts could be deleted asynchronously. This must be how the version control system works, we always comes up with some or the other new functionality but we have to take care of the old functionality as well adding them to the new functionality retrospectively.
}