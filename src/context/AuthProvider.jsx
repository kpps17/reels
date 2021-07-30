import React, { useState, useEffect } from 'react';
import { firebaseAuth } from '../config/firebase';

export function AuthProvide({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    function login(email, password) {
        return firebaseAuth.signInWithEmailAndPassword(email, password);
    }
    function signOut() {
        return firebaseAuth.signOut();
    }

    function signUp(email, password) {
        return firebaseAuth.createUserWithEmailAndPassword(email, password);
    }

    useEffect(() => {
        firebaseAuth.onAuthStateChanged(user => {
            console.log("inside auth state changed");
            setCurrentUser(user);
        })
    }, []);

    let value = {
        currentUser: currentUser,
        signOut: signOut,
        login: login,
        signUp: signUp
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const AuthContext = React.createContext();