import { Alert, Button, Modal, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { app } from "../firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
} from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

const DashProfile = () => {
  const { currentUser, error, loading } = useSelector(
    (state) => state.userData
  );
  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [downloadImageUrl, setDownloadImageUrl] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const navitage=useNavigate();

  console.log(imageFileUploadProgress, imageFileUploadError, downloadImageUrl);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileURL(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploadError(null);
    setIsImageUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    console.log(fileName);
    console.log(imageFile);
    const storageRef = ref(storage, `image/${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    console.log(storageRef);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        // setImageFileUploadError('Could not upload image (File must be less than 2MB) ',error)
        setImageFileUploadError(error.message);
        setImageFileUploadProgress(null);
        setDownloadImageUrl(null);
        setIsImageUploading(false);
      },
      () => {
        console.log(uploadTask.snapshot.ref);
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            setDownloadImageUrl(downloadURL);
            setFormData({ ...formData, profilePicture: downloadURL });
            setIsImageUploading(false);
          })
          .catch((e) => console.log(e.message));
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      setImageFileUploadError("no changes made");
      return;
    }

    if (isImageUploading) {
      setImageFileUploadError("wait for image to upload");
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/v1/users/update/${currentUser?.user?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("user updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    setShowModel(false);
    dispatch(deleteUserStart());
    try {
      const res = await fetch(`/api/v1/users/delete/${currentUser.user._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess());
        // navitage('/sign-up');
      }
    } catch (error) {
      deleteUserFailure(error.message);
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch(`/api/v1/users/signout/${currentUser.user._id}`, {
        method: "GET",
      });

      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        // navitage('/sign-in')
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-lg w-full p-3 mx-auto">
      <h1 className="font-bold my-7 text-center text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative self-center w-32 h-32 rounded-full overflow-hidden shadow-md cursor-pointer"
          onClick={() => filePickerRef.current.click()}
        >
          {isImageUploading && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}

          <img
            src={currentUser?.user?.profilePicture || 'https://w7.pngwing.com/pngs/831/88/png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile-thumbnail.png'}
            className={`w-full h-full rounded-full object-cover border-4 border-[red] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>

        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}

        <TextInput
          type="text"
          id="username"
          defaultValue={currentUser?.user?.username || ''}
          onChange={handleChange}
          placeholder="username"
        />
        <TextInput
          type="email"
          id="email"
          defaultValue={currentUser?.user?.email || ""}
          onChange={handleChange}
          placeholder="email"
        />
        <TextInput
          type="password"
          id="password"
          defaultValue={"************"}
          onChange={handleChange}
          placeholder="password"
        />

        <Button
          type="submit"
          gradientDuoTone={"purpleToBlue"}
          disabled={loading || isImageUploading}
          outline
        >
          {loading ? "loading..." : "submit"}
        </Button>
        {currentUser.role == "admin" && (
            <Link to={"/create-post"}>
              <Button type="button" gradientDuoTone={"purpleToPink"}>
                Create a post
              </Button>
            </Link>
        )}
      </form>
      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      <div className="text-red-500 flex justify-between mt-2">
        <span className="cursor-pointer" onClick={()=>setShowModel(true)}>
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={handleSignout}>
          Sign Out
        </span>
      </div>
      <Modal
        show={showModel}
        size="md"
        onClose={() => setShowModel(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this product?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setShowModel(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;
