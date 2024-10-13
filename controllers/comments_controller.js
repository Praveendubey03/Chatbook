const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');

module.exports.create = async function(req, res) {
    try {
        let post = await Post.findById(req.body.post);

        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            await post.save(); // Await the save operation
            
            comment = await Comment.findById(comment._id).populate('user', 'name email');

            commentsMailer.newComment(comment);
            
            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Comment published!"
                });
            }

            req.flash('success', 'Comment published!');
            res.redirect('/');
        }
    } catch (err) {
        req.flash('error', err.message || 'Error while creating comment');
        return res.redirect('back');
    }
}

module.exports.destroy = async function(req, res) {
    try {
        let comment = await Comment.findById(req.params.id);

        if (!comment) {
            req.flash('error', 'Comment not found');
            return res.redirect('back');
        }

        if (comment.user.equals(req.user._id)) {
            let postId = comment.post;

            await comment.remove(); // Await the removal

            await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment deleted"
                });
            }

            req.flash('success', 'Comment deleted!');
            return res.redirect('back');
        } else {
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error', err.message || 'Error while deleting comment');
        return res.redirect('back');
    }
};