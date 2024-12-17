import {  createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import axios from "axios";
import getBaseUrl from "../utils/baseURL";

const AuthContext =  createContext();

export const useAuth = () => {
    return useContext(AuthContext)
}

const googleProvider = new GoogleAuthProvider();

// authProvider
export const AuthProvide = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);


    // register a user
    // const registerUser = async (email,password) => {

    //     return await createUserWithEmailAndPassword(auth, email, password);
    // }
    const registerUser = async (name, email, password) => {
        console.log("Registering user with details:", { name, email, password });
        try {
            const response = await axios.post(`${getBaseUrl()}/auth/register`, { name, email, password }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log("Registration successful:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error registering user:", error);
            if (error.response) {
                console.error("Error response data:", error.response.data);
                console.error("Error response status:", error.response.status);
                console.error("Error response headers:", error.response.headers);
            }
            console.log("Failed registration details:", { name, email, password });
            throw error;
        }
    }

    // login the user
    // const loginUser = async (email, password) => {
    
    //     return await signInWithEmailAndPassword(auth, email, password)
    // }
    const loginUser = async (email, password) => {
        const response = await axios.post(`${getBaseUrl()}/auth/login`, { email, password }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const user = response.data.user;
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('tokenType', 'jwt');

        // Fetch user profile
        const profileResponse = await axios.get(`${getBaseUrl()}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${response.data.token}`
            }
    });

    setCurrentUser(profileResponse.data.profile);
    return profileResponse.data.profile;
    }

    // sing up with google
    const signInWithGoogle = async () => {
     
        // return await signInWithPopup(auth, googleProvider)
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const token = await user.getIdToken();
    
            // Store the token and token type in local storage
            localStorage.setItem('token', token);
            localStorage.setItem('tokenType', 'firebase');
    
            // Fetch user profile
            const profileResponse = await axios.get(`${getBaseUrl()}/auth/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            setCurrentUser(profileResponse.data.profile);
            return profileResponse.data.profile;
        } catch (error) {
            console.error("Google sign in failed:", error.message);
            throw error;
        }
    }

    // logout the user
    // const logout = () => {
    //     return signOut(auth)
    // }
    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('tokenType');
    }

    // manage user
    // useEffect(() => {
    //     const unsubscribe =  onAuthStateChanged(auth, (user) => {
    //         setCurrentUser(user);
    //         setLoading(false);

    //         if(user) {
               
    //             const {email, displayName, photoURL} = user;
    //             const userData = {
    //                 email, username: displayName, photo: photoURL
    //             } 
    //         }
    //     })

    //     return () => unsubscribe();
    // }, [])
    useEffect(() => {
        const token = localStorage.getItem('token');
        const tokenType = localStorage.getItem('tokenType');
        if (token) {
            axios.get(`${getBaseUrl()}/auth/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                const profileData = response.data.profile;
                if (profileData) {
                    setCurrentUser(profileData);
                }
                setLoading(false);
            }).catch(error => {
                console.error("Failed to fetch user profile:", error);
                localStorage.removeItem('token');
                localStorage.removeItem('tokenType');
                setLoading(false);
            }); 
        } else {
            setLoading(false);
        }
    }, []);


    const value = {
        currentUser,
        setCurrentUser,
        loading,
        registerUser,
        loginUser,
        signInWithGoogle,
        logout
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}