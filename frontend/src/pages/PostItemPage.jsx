import React from 'react';
import Navbar from '../components/Navbar';
import PostForm from '../components/PostForm';

const PostItemPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <PostForm />
    </div>
  );
};

export default PostItemPage;