import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

const Signip = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage,setErrorMessage]=useState(null);
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  console.log(formData);

  const handleSubmit=async(e)=>{
    e.preventDefault();

    if(!formData.username || !formData.email || !formData.password){
      return setErrorMessage('Please fill out all the fields.');
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res= await fetch('/api/v1/users/login',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(formData)
      })

      const data=await res.json();
      if(data.success === false){
        return setErrorMessage(data.message);
      }
      setLoading(false);

      if(res.ok){
        return navigate('/')
      }
    } catch (error) {
        setErrorMessage(error.message);
        setLoading(false);
    }
  }

  return (
    <div className="mt-20">
      <div className="flex gap-10 flex-col md:flex-row md:items-center p-3 max-w-xl md:max-w-5xl mx-auto">
        <div className="font-semibold dark:text-white flex-1">
          <Link to="/" className="font-bold text-4xl dark:text-white">
            <span className="bg-gradient-to-r from-blue-500 to-pink-500 rounded-lg px-2 text-white">
              CDAC
            </span>
            Blog
          </Link>
          <p className="mt-5 text-justify">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit
            obcaecati commodi laboriosam enim harum, exercitationem eveniet sit
            quis libero vitae.
          </p>
        </div>

        <div className="flex-1">
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>

            <div>
              <Label value="your email" />
              <TextInput
                type="text"
                placeholder="email"
                id="email"
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value="your password" />
              <TextInput
                type="password"
                placeholder="*********"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button gradientDuoTone={"purpleToPink"} type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size='sm'/>
                  <p>loading...</p>
                </>
              ): (
                'Sign in'
              )}
            </Button>
            <OAuth />

            {errorMessage && (
              <Alert color='failure'>
                {errorMessage}
              </Alert>
            )}
          </form>

          <div>
            <span className="font-semibold mr-1">Don't have an account?</span>
            <Link to="/sign-up" className="text-blue-500 hover:text-blue-600">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signip;
