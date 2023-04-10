import { useRef, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const userRef = useRef();
  const errRef = useRef();

  const [username, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMSg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, [])

  useEffect(() => {
    setErrMSg('');
  }, [username, password])

  const handleSubmit = async(e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:4000/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    const resp_json = await response.json();
    if (resp_json.response_status==200) {
      navigate(`/chatroom/${username}`);
      if(resp_json.data.status==1){
        console.log("hello");
        navigate("/clients");

      }
      setSuccess(true);
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } 
  }
  if (!success) {
  return (
    
    <section>
      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
      <form className='lgn-form' onSubmit={handleSubmit}>
        <h1>Sign In</h1>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setUser(e.target.value)}
          value={username}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
        <button className='sign-btn'><i className="bi bi-box-arrow-in-right"></i></button>
      </form>

    </section>
    )} else {
      return null;
    }
  }
export default Login;