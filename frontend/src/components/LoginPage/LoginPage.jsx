import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import {useDispatch, useSelector } from "react-redux";
import { login } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import { addChatTofriend, addFriend, addMessage, addFriendList } from '../../store/chatSlice'

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [selectedFileName, setSelectedFileName] = useState(""); // State to track the selected file name
    const navigate = useNavigate()
    const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, 
  } = useForm();
  const onLoginSubmit = async (data) => {
    console.log(import.meta.env.VITE_API_PREFIX);
    
    const res = await axios.post(`${import.meta.env.VITE_API_PREFIX}/users/login`,{email:data.email, password:data.password}, {withCredentials:'include'})
    dispatch(login(res.data.data))  
    const friendList = await axios.post(`${import.meta.env.VITE_API_PREFIX}/friends/friend-list`, {userId:res.data.data.id},{withCredentials:true})
      dispatch(addFriendList(friendList.data.data))
      friendList.data.data.forEach((e) => {
       
        async function getChat(){
            let senderId = e.friendId;
            
            const useChats = await axios.post(`${import.meta.env.VITE_API_PREFIX}/chats/get-chat`,{senderId, receiverId:res.data.data.id},{withCredentials:true});
            
            dispatch(addChatTofriend({userId:senderId, message:useChats.data.data}))
        }
        getChat();
      })      

    navigate('/home')
    toast('user logined successfully!')
  };

  const onSignupSubmit = async (data) => {
    console.log('Form data:', data);
    const formData = new FormData();
  
    // Append form fields to FormData
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
  
    // Append the avatar file (if selected)
    if (data.avatar && data.avatar instanceof File) {
      formData.append("avatar", data.avatar, data.avatar.name);
    }
    try {
      const registerResponse = await axios.post(`http://localhost:3000/users/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Register response:', registerResponse);
  
      onLoginSubmit(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('There was an error: ' + error.message);
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      setValue("avatar", file); // Set the file object directly
    } else {
      setSelectedFileName("");
      setValue("avatar", null);
    }
  };
  return (
    <div className="items-center justify-center flex h-screen w-full">
      <div className="bg-gray-100 p-5 w-[500px] rounded-lg shadow-md">
        {/* Tabs */}
        <div className="flex justify-around bg-white rounded-t-lg p-2 mb-5">
          <button
            className={`w-full py-2 px-4 rounded-t-lg text-center ${
              activeTab === "login"
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`w-full py-2 px-4 rounded-t-lg text-center ${
              activeTab === "signup"
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Signup
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white p-5 rounded-b-lg">
          {activeTab === "login" && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Login</h2>
              <form onSubmit={handleSubmit(onLoginSubmit)}>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-2 mb-3 border rounded"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-2 mb-3 border rounded"
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-2 rounded"
                >
                  Login
                </button>
              </form>
            </div>
          )}

          {activeTab === "signup" && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Signup</h2>
              <form onSubmit={handleSubmit(onSignupSubmit)} encType="multipart/form-data">                <input
                  type="text"
                  placeholder="Username"
                  className="w-full p-2 mb-3 border rounded"
                  {...register("username", { required: "Username is required" })}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">
                    {errors.username.message}
                  </p>
                )}
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-2 mb-3 border rounded"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-2 mb-3 border rounded"
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
                {/* Styled Avatar Upload */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Avatar
                  </label>
                  <div className="flex items-center">
                    <label
                      htmlFor="avatar"
                      className="bg-orange-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-orange-600"
                    >
                      Choose File
                    </label>
                    <input
                      type="file"
                      id="avatar"
                      className="hidden"
                      {...register("avatar")}
                      onChange={handleFileChange}
                    />
                    <span className="ml-3 text-gray-600">
                      {selectedFileName || "No file chosen"}
                    </span>
                  </div>
                  {errors.avatar && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.avatar.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-2 rounded"
                >
                  Signup
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
