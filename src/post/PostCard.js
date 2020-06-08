import React from 'react';
import DefaultPost from "../images/mountains.jpg";
import {Link} from 'react-router-dom'

const PostCard=(props)=>{
    const { post,i }= props
    const posterId = post.postedBy
                    ? `/user/${post.postedBy._id}`
                    : "";
    const posterName = post.postedBy
                        ? post.postedBy.name
                        : " Unknown";

    return(
        <div className="card col-md-4" key={i}>
            <div className="card-body">
                <img
                    src={post.photos.length?`${post.photos[0].link}`:`${DefaultPost}`}
                    alt={post.title}
                    onError={i =>
                    (i.target.src = `${DefaultPost}`)
                    }
                    className="img-thumbnail mb-3"
                    style={{ height: "200px", width: "100%" }}
                />
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">
                    {post.body.substring(0, 100)}
                </p>
                <br />
                <p className="font-italic mark">
                    Posted by{" "}
                    <Link to={`${posterId}`}>
                        {posterName}{" "}
                    </Link>
                    on {new Date(post.created).toDateString()}
                </p>
                <Link
                    to={`/post/${post._id}`}
                    className="btn btn-raised btn-primary btn-sm"
                >
                    Read more
                </Link>
            </div>
        </div>
    )
}

export default PostCard;
