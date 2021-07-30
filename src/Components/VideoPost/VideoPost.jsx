import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { firebaseDb, timeStamp } from '../../config/firebase';
import { Card, CardHeader, CardAction, CardContent, Button, makeStyles, Typography, TextField, CardMedia, Avatar, Container } from "@material-ui/core"
import './VideoPost.css'
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import ReactDOM from 'react-dom';
import { Favorite, FavoriteBorder } from "@material-ui/icons";

const VideoPost = (props) => {

    let videoUrl = props.photoObj.url;
    let [user, setUser] = useState(null);
    let [comment, setComment] = useState("");
    let [commentList, setCommentList] = useState([]);
    let [likesCount, setLikesCount] = useState(null);
    let [isLiked, setIsLiked] = useState(false);
    let { currentUser } = useContext(AuthContext);

    useEffect(async () => {
        let userId = props.photoObj.uid;
        let docRef = await firebaseDb.collection('users').doc(userId).get();
        let userPostCreated = docRef.data();

        let commentList = props.photoObj.comments;
        let updateCommentList = [];

        let likes = props.photoObj.likes;

        for (let i = 0; i < commentList.length; i++) {
            let commentObj = commentList[i];
            let doc = await firebaseDb.collection('users').doc(commentObj.uid).get();
            let commentuserPic = doc.data().profileImageUrl;
            updateCommentList.push({ profilePic: commentuserPic, comment: commentObj.comment })
        }

        if(likes.includes(currentUser.userId)) {
            setIsLiked(true);
            setLikesCount(likes.length - 1);
        } else {
            if(likes.length != 0) setLikesCount(likes.length);
        }

        setUser(userPostCreated);
        setCommentList(updateCommentList);
    }, []);

    const addCommentToCommentList = async (e) => {
        let profilePic;
        if (currentUser.uid == user.userId) {
            profilePic = user.profileImageUrl;
        } else {
            let doc = await firebaseDb.collection('users').doc(currentUser.uid).get();
            let userImg = doc.data().profileImageUrl;
            profilePic = userImg;
        }
        let newCommentedList = [...commentList, { profilePic: profilePic, comment: comment }];
        let postObj = props.photoObj;
        postObj.comments.push({ uid: currentUser.uid, comment: comment });
        await firebaseDb.collection('posts').doc(postObj.pid).set(postObj);
        setCommentList(newCommentedList);
        setComment("");
    }

    const toggleLikeItem = async () => {
        if(isLiked) {
            let postDoc = props.photoObj;
            let filteredLikes = postDoc.filter(uid => {
                if(uid == currentUser.userId) 
                    return false;
                return true;
            });
            postDoc.likes = filteredLikes;
            let doc = await firebaseDb.collection('posts').doc(postDoc.pid).set(postDoc);
            setIsLiked(false);
            likesCount == 1 ? setLikesCount(null) : setLikesCount(likesCount - 1);
        } else {
            let postDoc = props.photoObj;
            postDoc.likes.push(currentUser.userId);
            await firebaseDb.collection('posts').doc(postDoc.pid).set(postDoc);
            setIsLiked(true);
            likesCount == null ? setLikesCount(1) : setLikesCount(likesCount);
        }
    }
 
    return (
        <Container>
            <Card style={{ height: "600px", width: "300px" }}>
                <Avatar src={user ? user.profileImageUrl : ""}></Avatar>
                <Typography varient="span"> {user ? user.username : ""} </Typography>
                <div className="video-container">
                    <Video src={videoUrl}></Video>
                </div>
                <Typography variant="p">Comments </Typography>
                <TextField variant="outlined" label="Add a comment" size="small" type="string" value={comment} onChange={(e) => setComment(e.target.value)}></TextField>
                <Button variant="contained" onClick={addCommentToCommentList}>Post</Button>
                {commentList.map((commentObj) => {
                    return (
                        <div>
                            <Avatar src={commentObj.profilePic}></Avatar>
                            <Typography variant="p">{commentObj.comment}</Typography>
                        </div>
                    );
                })}
            </Card>
        </Container>
    );
}

function Video(props) {
    const handleAutoScrol = (e) => {
        let next = ReactDOM.findDOMNode(e.target).parentNode.parentNode.parentNode.parentNode.nextSiblings;
        if (next) {
            next.scrollIntoView({ behaviour: "smooth" });
            e.target.muted = true;
        }
    }

    return (
        <video className="video-styles" controls muted={true} id={props.id} loop={true} onEnded={handleAutoScrol}>
            <source src={props.src} type="video/mp4"></source>
        </video>
    )
}

export default VideoPost;