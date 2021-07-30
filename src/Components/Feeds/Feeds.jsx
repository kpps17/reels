import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { Button } from "@material-ui/core";
import { PhotoCamera } from "@material-ui/icons";
import { useState } from 'react';
import { firebaseStorage, firebaseDb, timeStamp } from '../../config/firebase';
import { uuid } from 'uuidv4';
import { useEffect } from 'react';
import VideoPost from '../VideoPost/VideoPost';

const Feeds = (props) => {
    const { currentUser } = useContext(AuthContext);
    const { signOut } = useContext(AuthContext);
    const [videoFile, setVideoFile] = useState(null);
    const [posts, setPosts] = useState([]);
    const handleLogOut = async (e) => {
        try {
            await signOut();
            props.history.push("/login");
        } catch (err) {
            console.log(err);
        }
    }

    const handleInputFile = (e) => {
        let file = e.target.files[0];
        setVideoFile(file);
    }

    const handleUploadFile = async () => {
        try {
            let uid = currentUser.uid;
            const uploadVideoObj = firebaseStorage.ref(`profilePhotos/${uid}/${Date.now()}.mp4`).put(videoFile);
            uploadVideoObj.on(
                'state_changed',
                function (snapshot) {
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(progress);
                },
                function (error) {
                    console.log(error);
                },
                async function () {
                    let url = await uploadVideoObj.snapshot.ref.getDownloadURL();
                    console.log(url);
                    let pid = uuid();
                    await firebaseDb.collection("posts").doc(pid).set({
                        pid: pid,
                        uid: uid,
                        comments: [],
                        likes: [],
                        url: url,
                        createdAt: timeStamp()
                    });
                    let docRef = await firebaseDb.collection("users").doc(uid).get();
                    let document = docRef.data();
                    document.postsCreated.push(pid);
                    await firebaseDb.collection("users").doc(uid).set(document);
                }
            );
        } catch (err) {

        }
    }

    useEffect(() => {
        firebaseDb.collection('posts').orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
            let allPosts = snapshot.docs.map((doc) => {
                return doc.data();
            })
            setPosts(allPosts);
        });
    }, []);

    let conditionObject = {
        root: null,
        threshold: "0.8"
    };

    useEffect(() => {
        let elements = document.querySelectorAll('.video-container');
        let observerObject = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                let child = entry.target.children[0];
                child.play().then(() => {
                    if (entry.isIntersecting == false) {
                        child.pause();
                    }
                })
            })
        }, conditionObject);
        elements.forEach(element => {
            observerObject.observe(element);
        })
    }, [posts])

    return (
        <div>
            <h1>Feeds</h1>
            <div>
                <button onClick={handleLogOut}> Log Out </button>
            </div>
            <div className="uploadVideo">
                <div>
                    <input type="file" onChange={handleInputFile} />
                    <label>
                        <Button onClick={handleUploadFile} variant="contained" color="secondary" startIcon={<PhotoCamera></PhotoCamera>}> Upload </Button>
                    </label>
                </div>
            </div>
            <div className="feeds-video-list">
                {posts.map(post => {
                    return <VideoPost key={post.pid} photoObj={post}></VideoPost>;
                })}
            </div>
        </div>
    );
}

export default Feeds;