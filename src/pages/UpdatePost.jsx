import { getStorage } from "firebase/storage";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UpdatePost = () => {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUplaodError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { postId } = useParams();
  const { currentUser } = useSelector((state) => state.userData);
  const navigate=useNavigate();

  // console.log(currentUser);
  // console.log(formData);

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/v1/posts/getposts?postId=${postId}`);
        const data = await res.json();
        // console.log(data);
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          const postRecived = data.posts[0];
          // console.log(postResive);
          setFormData(postRecived);
        }
      };

      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [postId]);

  const handleImageUpload = () => {
    if (!file) {
      setImageUplaodError("Please select an image");
      return;
    }

    setImageUplaodError(null);
    // setIsImageUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;

    const storageRef = ref(storage, `image/${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, fileName);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        // setImageFileUploadError('Could not upload image (File must be less than 2MB) ',error)
        imageUploadError(error.message);
        imageUploadProgress(null);
        // setDownloadImageUrl(null);
        // setIsImageUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            // setDownloadImageUrl(downloadURL);
            setFormData({ ...formData, coverImage: downloadURL });
            // setIsImageUploading(false);
          })
          .catch((e) => console.log(e.message));
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPublishError(null);
    try {
      const res = await fetch(
        `/api/v1/posts/updatePost/${postId}/${currentUser.user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.post.slug}`);
      }
    } catch (error) {
      setPublishError(error.message);
    }
  };
  return (
    <div className="max-w-3xl mx-auto p-3 min-h-screen">
      <h1 className="text-center text-3xl font-semibold my-7">Update a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex justify-between flex-col md:flex-row gap-4">
          <TextInput
            placeholder="Title"
            className="flex-1"
            value={formData?.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            value={formData?.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="uncategorized">Select a category</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="reactjs">React.js</option>
          </Select>
        </div>
        <div className="flex justify-between gap-4 flex-col md:flex-row border-4 border-teal-500 border-dotted p-3">
          <FileInput
            className="flex-1"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            onClick={handleImageUpload}
            outline
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}`}
                />
              </div>
            ) : (
              "upload image"
            )}
            Upload Image
          </Button>
        </div>
        {formData?.image && (
          <img
            src={formData?.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        {imageUploadError && <Alert color="failure"></Alert>}
        <ReactQuill
          theme="snow"
          value={formData.content}
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData((prev)=>({...prev,content:value}));
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Update Post
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default UpdatePost;
