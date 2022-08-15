// The comments to each and every post are applied exactly like that of the how the post is created.
// The main difference is only one thing, the comments only belong to the posts. This is why we need to have associate everything to the postId. Since the postId is the unique parameter of the posts.


// Let's implement this via classes

// this class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX

class PostComments{
    // constructor is used to initialize the instance of the class whenever a new instance is created
    constructor(postId){
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);

        this.createComment(postId);
        console.log('The postComments object has been created.');

        let self = this;
        // call for all the existing comments
        $(' .delete-comment-button', this.postContainer).each(function(){
            self.deleteComment($(this));
        });
    }


    createComment(postId){
        let pSelf = this;       //This will be called at the time of the constructor creation. This is simply because it will be executed.
        this.newCommentForm.submit(function(e){     //This is the click handler that is being applied to all the post that is being created out there. But it will not be executed just now, only the click handler is being applied, and the callback will wait for the submit to be clicked. And the value of the 'this' variable in this context will be the "post" object for now. But as soon as the post is created and click handler is applied, when the submit button is clicked then the value of the 'this' method is comment object, not the 'post' object. This is the beauty of the 'this' object.
            e.preventDefault();
            let self = this;        //This is the comment object. As it will be executed after the comment is created.

            $.ajax({
                type: 'post',
                url: '/comment',        //First this end point will be hit, then the comment will be created, and then after success the illusion of the comment being posted will be created.
                data: $(self).serialize(),  //The post data is being converted to the json object. This will be useful in the case when we want to send the data to the next success or the failure function.
                success: function(data){    //This method is run only after the complete success of the above end point. And we try to show that the comment is added asynchronously, and it is being done asynchronously, and the data of the post or comment is being added to the db, but the data is not being fetched from the db. Although the data is being shown such that it is available as soon as we comment. But this is just an illusion.
                    console.log(self);
                    let newComment = pSelf.newCommentDom(data.data.comment);        //This will create the html of the comment.
                    console.log(newComment);
                    $(`#post-comments-${postId}`).prepend(newComment);  //This will mimic the addition of the comment or post.
                    pSelf.deleteComment($(' .delete-comment-button', newComment));  //It will add the delete handler.

                    // CHANGE :: enable the functionality of the toggle like button on the new comment
                    new ToggleLike($(' .toggle-like-button', newComment));

                    new Noty({
                        theme: 'relax',
                        text: "Comment published!",
                        type: 'success',
                        layout: 'bottomRight',
                        timeout: 1500
                        
                    }).show();

                }, error: function(error){
                    console.log(error.responseText);
                }
            });


        });
    }


    newCommentDom(comment){
        // I've added a class 'delete-comment-button' to the delete comment link and also id to the comment's li
        return $(`<li id="comment-${ comment._id }">
                        <p>                            
                            <small>
                                <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
                            </small>
                            
                            ${comment.content}
                            <br>
                            <small>
                                ${comment.user.name}
                            </small>
                        </p>
                        <small>
                            
                                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                                    0 Likes
                                </a>
                            
                        </small>

                </li>`);
    }


    deleteComment(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Comment Deleted",
                        type: 'success',
                        layout: 'bottomRight',
                        timeout: 1500
                        
                    }).show();
                },error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }
}