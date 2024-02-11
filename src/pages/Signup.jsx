import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInStart,signInSuccess,signInFailure } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";

const Signup = () => {
  const [formData, setFormData] = useState({});
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const {loading, error:errorMessage}=useSelector(state=>state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  // console.log(formData);

  const handleSubmit=async(e)=>{
    e.preventDefault();

    if(!formData.username || !formData.email || !formData.password){
      return dispatch(signInFailure('all fields are required'));
    }

    try {
      dispatch(signInStart());
      const res= await fetch('/api/v1/users/register',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(formData)
      })

      const data=await res.json();
      if(data.success === false){
        return dispatch(signInFailure(data.message))
      }

      if(res.ok){
        dispatch(signInSuccess(data));
        return navigate('/sign-in')
      }
    } catch (error) {
        dispatch(signInFailure(error.message));
    }
  }

  return (
    <div className="min-h-screen mt-20">
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
              <Label value="your username" />
              <TextInput
                type="text"
                placeholder="username"
                id="username"
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value="your email" />
              <TextInput
                type="text"
                placeholder="email"
                id="username"
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value="your password" />
              <TextInput
                type="password"
                placeholder="password"
                id="username"
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
                'Sign up'
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
            <span className="font-semibold mr-1">Have an account?</span>
            <Link to="/sign-in" className="text-blue-500 hover:text-blue-600">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
