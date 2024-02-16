import React, { useState } from 'react'
import PT from 'prop-types'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const initialFormValues = {
  username: '',
  password: '',
}

export default function LoginForm(props) {
  const navigate = useNavigate()
  const [values, setValues] = useState(initialFormValues)
  // ✨ where are my props? Destructure them here
  const {setMessage, setSpinnerOn, login} = props

  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
  }

  const onSubmit = evt => {
    evt.preventDefault()
    setSpinnerOn(true)
   axios.post('http://localhost:9000/api/login', values)
    .then(res =>{
      console.log(res.data.token)
      console.log(res)
      setMessage(res.data.message)
      localStorage.setItem('token', res.data.token)

      navigate('/articles')
      
      
    })
    .catch(err =>{
      console.log(err)
    })
    .finally(()=>{
      setSpinnerOn(false)
    })
  
    
 }

  const isDisabled = () => {
    
  const username1 = values.username.trim()
  const password1 = values.password.trim()

 
  const isUsernameValid = username1.length >= 3;
  const isPasswordValid = password1.length >= 8;

  
  return !(isUsernameValid && isPasswordValid);
  }

  return (
    <form id="loginForm" onSubmit={onSubmit}>
      <h2>Login</h2>
      <input
        maxLength={20}
        value={values.username}
        onChange={onChange}
        placeholder="Enter username"
        id="username"
      />
      <input
        maxLength={20}
        value={values.password}
        onChange={onChange}
        placeholder="Enter password"
        id="password"
      />
      <button disabled={isDisabled()} id="submitCredentials">Submit credentials</button>
    </form>
  )
}

// 🔥 No touchy: LoginForm expects the following props exactly:
LoginForm.propTypes = {
  login: PT.func.isRequired,
}
