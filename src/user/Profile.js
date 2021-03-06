import React, { Component, useLayoutEffect } from "react";
import { isAuthenticated } from "../auth";
import { Redirect, Link } from "react-router-dom";
import { read } from "./apiUser";
import DefaultProfile from "../images/avatar.jpg";
import DeleteUser from "./DeleteUser";
import { listByUser } from "../post/apiPost";
import ProfileTabs from "./ProfileTabs";

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            user: {},
            redirectToSignin: false,

            error: "",
            posts: [],
            loadingPosts:true,
        };
    }

    // check follow
//    checkFollow = user => {
//        const jwt = isAuthenticated();
//        const match = user.followers.find(follower => {
            // one id has many other ids (followers) and vice versa
//            return follower._id === jwt.user._id;
//        });
//        return match;
//    };

//    clickFollowButton = callApi => {
//        const userId = isAuthenticated().user._id;
//        const token = isAuthenticated().token;

//        callApi(userId, token, this.state.user._id).then(data => {
//            if (data.error) {
//                this.setState({ error: data.error });
//            } else {
//                this.setState({ user: data, following: !this.state.following });
//            }
//        });
//    };

    init = userId => {
        const token = isAuthenticated().token;
        read(userId, token).then(data => {
            if (data.error) {
                this.setState({ redirectToSignin: true });
            } else {

                this.setState({ user: data });
                this.loadPosts(data._id);
            }
        });
    };

    loadPosts = userId => {
        const token = isAuthenticated().token;
        listByUser(userId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } 
            else {
                this.setState({ posts: data,loadingPosts:false });
            }
        })
    };

    componentDidMount(){
        const userId = this.props.match.params.userId;
        this.init(userId);
    }

    componentWillReceiveProps(props) {
        const userId = props.match.params.userId;
        this.init(userId);
    }

    render() {
        const { redirectToSignin, user, posts,loadingPosts } = this.state;
        if (redirectToSignin) return <Redirect to="/signin" />;

        const photoUrl = user._id
            ? `${process.env.REACT_APP_API_URL}/user/photo/${
                  user._id
              }?${new Date().getTime()}`
            : DefaultProfile;

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Profile</h2>
                <div className="row">
                    <div className="col-md-4">
                        <img
                            style={{ height: "200px", width: "auto" }}
                            className="img-thumbnail"
                            src={photoUrl}
                            onError={i => (i.target.src = `${DefaultProfile}`)}
                            alt={user.name}
                        />
                    </div>

                    <div className="col-md-8">
                        <div className="lead mt-2">
                            <p>Hello {user.name}</p>
                            <p>Email: {user.email}</p>
                            <p>{`Joined ${new Date(
                                user.created
                            ).toDateString()}`}</p>
                        </div>

                        {isAuthenticated().user &&
                        isAuthenticated().user._id === user._id ? (
                            <div className="d-inline-block">
                                <Link
                                    className="btn btn-raised btn-info mr-5"
                                    to={`/post/create`}
                                >
                                    Create Post
                                </Link>
                                <Link
                                    className="btn btn-raised btn-success mr-5"
                                    to={`/user/edit/${user._id}`}
                                >
                                    Edit Profile
                                </Link>
                                <DeleteUser userId={user._id} />
                            </div>
                        ) : (
                            <hr/>

                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="col md-12 mt-5 mb-5">
                        <hr />
                        <p className="lead">{user.about}</p>
                        <hr />
                        <ProfileTabs 
                        posts={posts}
                        loadingPosts={loadingPosts}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile;
