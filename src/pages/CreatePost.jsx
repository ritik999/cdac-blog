import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { CircularProgressbar } from 'react-circular-progressbar';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { app } from '../firebase';

const CreatePost = () => {
    const [file,setFile]=useState(null);
    const [imageUploadProgress,setImageUploadProgress]=useState(null);
    const [imageUploadError,setImageUplaodError]=useState(null);
    const [formData,setFormData]=useState({});
    const [publishError,setPublishError]=useState(null);

    console.log(formData.coverImage)
    const handleImageUpload=()=>{
        console.log('img upload start');
        if(!file){
            setImageUplaodError('Please select an image');
            return;
        }

        setImageUplaodError(null);
        // setIsImageUploading(true);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        console.log(fileName);
        const storageRef = ref(storage, `postImg/${fileName}`);
        console.log(storageRef);
        const uploadTask = uploadBytesResumable(storageRef, file);
        console.log(uploadTask);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            console.log(snapshot);
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setImageUploadProgress(progress.toFixed(0));
              console.log(progress);
          },
          (error) => {
            // setImageFileUploadError('Could not upload image (File must be less than 2MB) ',error)
            setImageUplaodError(error.message);
            setImageUploadProgress(null);
            // setDownloadImageUrl(null);
            // setIsImageUploading(false);
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                // setDownloadImageUrl(downloadURL);
                console.log(downloadURL);
                setFormData({ ...formData, coverImage: downloadURL });
                // setIsImageUploading(false);
                setImageUploadProgress(null);
              })
              .catch((e) => console.log(e.message));
          }
        );

    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setPublishError(null);
        try {
            const res=await fetch('/api/v1/posts/create',{
                method:'POST',
                headers:{
                'Content-Type':'application/json',
                },
                body:JSON.stringify(formData)
            })

            const data=await res.json();

            if(!res.ok){
                setPublishError(data.message);
                return;
            }
        } catch (error) {
            setPublishError(error.message);
        }
    }
  return (
    <div className='max-w-3xl mx-auto p-3 min-h-screen'>
        <h1 className='text-center text-3xl font-semibold my-7'>Create a post</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className='flex justify-between flex-col md:flex-row gap-4'>
                <TextInput placeholder='Title' className='flex-1' onChange={(e)=>setFormData({...formData,title:e.target.value})} />
                <Select onChange={(e)=>setFormData({...formData,category:e.target.value})}>
                    <option value='uncategorized'>Select a category</option>
                    <option value='java'>Java</option>
                    <option value='python'>Python</option>
                    <option value='reactjs'>React.js</option>
                </Select>
            </div>
            <div className='flex justify-between gap-4 flex-col md:flex-row border-4 border-teal-500 border-dotted p-3'>
                <FileInput className='flex-1' type='file' accept='image/*' onChange={(e)=>{setFile(e.target.files[0])}} />
                <Button type='button' gradientDuoTone='purpleToBlue' size='sm' onClick={handleImageUpload} outline>
                    {
                        imageUploadProgress ? (
                            <div className='w-16 h-16'>
                            <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}`} />
                            </div>
                        ): 'Upload Image'
                    }
                </Button>
            </div>
            {
                formData.coverImage && (
                    <img src={formData.coverImage} alt='upload' className='w-full h-72 object-cover' />
                )
            }
            {imageUploadError && (
                <Alert color='failure'></Alert>
            )}
            <ReactQuill onChange={(value)=>setFormData({...formData,content:value})} theme="snow" placeholder='do something' className='h-72 mb-12' required/>
            <Button type='submit' gradientDuoTone='purpleToPink'>
                Publish
            </Button>
            {publishError && <Alert className='mt-5' color='failure'>{publishError}</Alert>}
        </form>
    </div>
  )
}

export default CreatePost