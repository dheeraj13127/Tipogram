import {USER_SIGNUP_SUCCESS,USER_SIGIN_SUCCESS,GET_USER_PROFILE} from '../constants/constants'
import axios from 'axios'
import toast from "react-hot-toast";


export const userSignUp =(response, navigate) => async (dispatch) => {
    toast("Will take few seconds", {
      icon: "⏳",
    });
    await axios
      .post("https://tipogram.herokuapp.com/auth/signUp", response)
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
   
    await axios
      .post("https://tipogram.herokuapp.com/auth/signIn", response)
      .then((res) => {
         
       
        const userId = res.data.user._id;
       
        sessionStorage.setItem("tipogramUserId", userId);
        toast.success("Successfully signed in !");
        dispatch({
          type: USER_SIGIN_SUCCESS,
          payload: userId,
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 2500);
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
      .post("https://tipogram.herokuapp.com/auth/getProfile", resp)
      .then((res) => {
        
        dispatch({
          type: GET_USER_PROFILE,
          payload: res.data.user,
        });
      })
      .catch((err) => toast.error("Something went wrong"));
  };