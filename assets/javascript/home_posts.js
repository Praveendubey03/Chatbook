{
    let createPost = function () {
        let newPostForm = $('#new-post-form');


        newPostForm.submit(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function (data) {
                    console.log(data);

                }, error: function (errror) {
                    console.log(error.resposeText);
                }

            })
        });
    }

    createPost;
}