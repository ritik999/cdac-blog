import { Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";

const PostPage = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`api/v1/post/getpost?slug=${postSlug}`);
        const data = res.json();

        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        setPost(data.posts[0]);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postSlug]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size={"xl"} />
      </div>
    );

  return (
    <main className="max-w-6xl flex flex-col min-h-screen p-4 mx-auto">
      <h1 className="text-3xl mt-10 text-center max-w-2xl mx-auto p-3 font-serif lg:text-4xl">
        {post?.title} Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        Molestiae, rem?
      </h1>
      <Link className="self-center mt-5">
        <Button  color="gray" pill size={"xs"}>
          {post?.slug}javascript
        </Button>
      </Link>
      <img
        src={post?.image}
        alt={post?.title}
        className="mt-10 max-h-[600px] w-full object-cover"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 max-w-3xl mx-auto w-full text-xs">
        <span>
          {post && new Date(post.createdAt).toLocaleDateString()}12-10-2024
        </span>
        <span className="italic">
          {post && new Date(post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
    </main>
  );
};

export default PostPage;
