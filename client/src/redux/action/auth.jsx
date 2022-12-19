import {USER_SIGNUP_SUCCESS,USER_SIGIN_SUCCESS,GET_USER_PROFILE,GET_ALL_USERS, UPDATE_BADGES, UPDATE_USER_PROFILE} from '../constants/constants'
import axios from 'axios'
import toast from "react-hot-toast";


export const userSignUp =(response, navigate) => async (dispatch) => {
    toast("Will take few seconds", {
      icon: "⏳",
    });
    await axios
      .post("https://tipogram-h94e.onrender.com/auth/signUp", response)
      .then((res) => {
        
        const userId = res.data.user._id;
        
        sessionStorage.setItem("tipogramUserId", userId);

        toast.success("Successfully signed up !");
        dispatch({
          type: USER_SIGNUP_SUCCESS,
          payload: userId,
        });
        setTimeout(() => {
          navigate("/dashboard");
        }, 2500);
      })
      .catch((err) => toast.error("Something went wrong"));
  };


export const userSignIn =
  (response, navigate) => async (dispatch) => {
    toast("Will take few seconds", {
      icon: "⏳",
    });
    await axios
      .post("https://tipogram-h94e.onrender.com/auth/signIn", response)
      .then((res) => {
         
       
        const userId = res.data.user._id;
       
        sessionStorage.setItem("tipogramUserId", userId);
        toast.success("Successfully signed in !");
        dispatch({
          type: USER_SIGIN_SUCCESS,
          payload: userId,
        });

        
        navigate("/dashboard");
      
      })
      .catch((err) => {
        // toast.error("Something went wrong");
        toast.error(err.response.data.message);
      });
  };
  export const userSignOut = (navigate) => async (dispatch) => {
    toast.success("Successfully signed out !");
    sessionStorage.setItem("tipogramUserId", "");
    navigate("/signin");
  };

  export const getUserProfile = (resp) => async (dispatch) => {
    await axios
      .post("https://tipogram-h94e.onrender.com/auth/getProfile", resp)
      .then((res) => {
        
        dispatch({
          type: GET_USER_PROFILE,
          payload: res.data.user,
        });
      })
      .catch((err) => toast.error("Something went wrong"));
  };


  export const getAllUsers = () => async (dispatch) => {
    await axios
      .get("https://tipogram-h94e.onrender.com/auth/getAllUsers")
      .then((res) => {
        
        dispatch({
          type: GET_ALL_USERS,
          payload: res.data.users,
        });
      })
      .catch((err) =>{
        
       toast.error("Something went wrong")
      });
  };


  export const updateUserBadges = (userId,bData) => async (dispatch) => {
    let data={
      badgesData:bData,
      userId:userId
    }
    await axios
    .post(`https://tipogram-h94e.onrender.com/dashboard/addBadges`, data)
    .then((res) => {
      toast("New badge unlocked !",{
        icon: "🤩",
      })

      dispatch({
        type:UPDATE_BADGES,
        payload: res.data.message,
      });
      setTimeout(() => {
        window.location.reload();
       },1500)
    })
    .catch((err) =>{
      
     toast.error("Something went wrong")
    });
  }

  export const updateUserProfile = (userId,userName,profileImage) => async (dispatch) => {
    let data={
      userName:userName,
      profileImage:profileImage,
    }
    await axios
    .put(`https://tipogram-h94e.onrender.com/auth/updateUserProfile/${userId}`, data)
    .then((res) => {
      toast.success("Profile updated successfully")
     setTimeout(() => {
      window.location.reload();
     },1500)
      dispatch({
        type:UPDATE_USER_PROFILE,
        payload: res.data.message,
      });
    })
    .catch((err) =>{
      
     toast.error("Something went wrong")
    });
  }