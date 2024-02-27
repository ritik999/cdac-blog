import { Button, Textarea } from "flowbite-react";
import moment from "moment";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const Comments = ({ comment, onEdit, onDelete }) => {
  const { currentUser } = useSelector((state) => state.userData);
  const [isEdit, setIsEdit] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  console.log(comment);

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/v1/comments/edit/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editedContent }),
      });

      if (res.ok) {
        setIsEdit(false);
        onEdit(comment._id, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = () => {
    setIsEdit(true);
    // setEditedContent(comment.content);
  };

  return (
    <div className="flex flex-col p-4 border-2 mb-4 shadow-sm rounded-md text-sm dark:border-gray-500">
      <div className="flex items-center">
        <div>
          <img
            className="w-10 h-10 rounded-full bg-gray-200"
            src={comment.userId.profilePicture}
            alt={comment.userId.username}
          />
        </div>
        <div className="flex gap-2 items-center mb-1">
          <span className="font-bold mr-1 text-sm">
            @{comment.userId.username}
          </span>
          <span className="text-gray-500 text-sm">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
      </div>
      {isEdit ? (
        <>
          <Textarea
          className="mb-3"
            placeholder="Add a comment"
            maxLength={200}
            onChange={(e) => setEditedContent(e.target.value)}
            value={editedContent}
          />

          <div className="flex justify-end gap-2 text-sm">
            <Button
              outline
              type="button"
              gradientDuoTone="purpleToBlue"
              size="sm"
              onClick={(e) => setIsEdit(false)}
            >
              Cancle
            </Button>
            <Button
              type="button"
              size="sm"
              gradientDuoTone="purpleToBlue"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </>
      ) : (
        <>
          <div>
            <p className="text-gray-500 px-11 pb-2">{comment.content}</p>

            <div className="flex justify-end gap-2">
              {currentUser &&
                (currentUser._id == comment.userId._id ||
                  currentUser.user.userRole == "admin") && (
                  <Button
                    type="button"
                    gradientDuoTone='purpleToPink'
                    // className="hover:text-red-500"
                    onClick={handleEdit}
                  >
                    Edit
                  </Button>
                )}
              {currentUser &&
                (currentUser._id == comment.userId._id ||
                  currentUser.user.userRole == "admin") && (
                  <Button
                    outline
                    type="button"
                    gradientDuoTone='purpleToBlue'
                    // size='xs'
                    // className="text-gray-400 hover:text-red-500"
                    onClick={() => onDelete(comment._id)}
                  >
                    Delete
                  </Button>
                )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Comments;
