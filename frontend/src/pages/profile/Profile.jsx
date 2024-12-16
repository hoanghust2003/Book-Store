import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import getBaseUrl from '../../utils/baseURL';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const { register, handleSubmit, setValue } = useForm();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar || '');

  useEffect(() => {
    if (currentUser) {
      setValue('name', currentUser.name);
      setAvatarUrl(currentUser.avatar); // Set avatar URL from user profile
    }
  }, [currentUser, setValue]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file)); // Update avatar preview
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);

    // Append avatar only if it's selected
    if (avatarFile) {
      console.log("Sending avatar file:", avatarFile);
      formData.append('avatar', avatarFile);
    }

    try {
      const response = await axios.put(`${getBaseUrl()}/auth/profile`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setCurrentUser(response.data.profile);
      setAvatarUrl(response.data.profile.avatar); // Update avatar URL
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error('Failed to update profile', error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Name</label>
          <input
            type="text"
            {...register('name', { required: true })}
            className="p-2 border w-full rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Avatar</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-2 w-full"
          />
          {avatarUrl && <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full mt-2" />}
        </div>
        <button type="submit" className="w-full py-2 bg-blue-500 text-white font-bold rounded-md">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
