import { Button, Modal, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comments from "./Comments";
import {HiOutlineExclamationCircle} from 'react-icons/hi'

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.userData);
  const [ comment, setComment ] = useState("");
  const [ commentError, setCommentError ] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate=useNavigate();

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCommentError(null);

    if (comment.length == 0) return;

    try {
      const res = await fetch("/api/v1/comments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId: postId,
          userId: currentUser.user._id,
        }),
      });

      const data = res.json();

      if (res.ok) {
        setComment("");
        // setComment((prev)=>[...prev,da])
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/v1/comments/getComments/${postId}`);

        if (res.ok) {
          const data =await res.json();
          // console.log(data);
          setComments(data.comments);
        }
      } catch (error) {
        console.log(error.messsage);
      }
    };
    getComments();
  }, [postId]);

  console.log(comments);

  const handleEdit = (commentId, editedContent) => {
    setComments((prev) =>
      prev.map((c) =>
        c._id == commentId ? { ...c, content: editedContent } : c
      )
    );
  };
  
  const handleDeleteComment=async(commentId)=>{
    setShowModal(false);
    try {
        if (!currentUser) {
          navigate('/sign-in');
          return;
        }
        const res = await fetch(`/api/v1/comments/delete/${commentId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          const data = await res.json();
          setComments(comments.filter((comment) => comment._id !== commentId));
        }
      } catch (error) {
        console.log(error.message);
      }
  }

  

  return (
    <div className="max-w-2xl mx-auto p-3 w-full">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-sm text-gray-500">
          <p>Signed in as:</p>
          <img
            className="w-5 h-5 object-cover rounded-full"
            src={currentUser.user.profilePicture}
          />
          <Link className="text-cyan-600 text-sm" to="/dashboard?tab=profile">
            @{currentUser.user.username}
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-1 my-5 text-sm text-gray-500">
          <p>You must be signed to comment:</p>
          <Link className="text-cyan-600 text-sm" to="/sign-in">
            sign-in
          </Link>
        </div>
      )}

      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment"
            rows={3}
            maxLength={200}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between mt-5">
            <p className="text-gray-500 text-sm">
              {200-comment?.length} characters remaining
            </p>
            <Button type="submit" outline gradientDuoTone='purpleToBlue'>
              Submit
            </Button>
          </div>
        </form>
      )}
      {comments?.length === 0 ? (
        <p className="text-sm mt-5">No comments yet</p>
      ) : (
        <>
          <div className="flex items-center my-5 gap-1 text-sm">
            <p>Comments</p>
            <div className="border border-gray-500 py-1 px-2 rounded-sm">
              <p>{comments.length || 0}</p>
            </div>
          </div>
          {console.log(comments)}
          { comments.length>0 && comments.map((item) => {
            console.log(item);
            return(
            <Comments
              key={item._id}
              comment={item}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                handleDeleteComment(commentId)
              }}
            />)
            })}
        </>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteComment}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CommentSection;
