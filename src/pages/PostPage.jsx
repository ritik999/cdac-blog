import { Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

const PostPage = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  console.log('postPage run');
  useEffect(() => {
    console.log('effect run');
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/v1/posts/getposts?slug=${postSlug}`);
        const data =await res.json();

        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        console.log(data);
        setPost(data.posts[0]);
        setLoading(false)
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postSlug]);

  console.log(post);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/api/v1/posts/getposts?limit=3`);
        const data = await res.json();
        // console.log(data);
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size={"xl"} />
      </div>
    );

  return (
    <main className="max-w-6xl flex flex-col min-h-screen p-4 mx-auto">
      <h1 className="text-3xl mt-10 text-center max-w-2xl mx-auto p-3 font-serif lg:text-4xl">
        {post?.title}
      </h1>
      <Link className="self-center mt-5">
        <Button  color="gray" pill size={"xs"}>
          {post?.slug}
        </Button>
      </Link>
      <img
        src={post?.image}
        alt={post?.title}
        className="mt-10 max-h-[600px] w-full object-cover"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 max-w-5xl mx-auto w-full text-xs">
        <span className="font-semibold text-sm">
          {post && new Date(post.createdAt).toLocaleDateString()}
        </span>
        <span className="italic text-sm ">
          {/* {post.content} */}
          {post && (post?.content?.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className="p-3 text-lg text-justify max-w-4xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className="max-w-4xl mt-12 mx-auto w-full">
        <CallToAction />
      </div>

      {post && <CommentSection postId={post._id}/>}

      <div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='text-xl mt-5'>Recent articles</h1>
        <div className='flex flex-wrap gap-5 mt-5 justify-center'>
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
};

export default PostPage;
