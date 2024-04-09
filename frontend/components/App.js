import React, { useState } from 'react'
import PrivateRoute from './PrivateRoute'
import axios from 'axios'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App(props) {
  
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState(null)
  const [spinnerOn, setSpinnerOn] = useState(false)

  const initialFormValues = { title: '', text: '', topic: '' }
  
  const [values, setValues] = useState(initialFormValues)
  

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/') }
  const redirectToArticles = () => { navigate('/articles') }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    localStorage.removeItem('token');
    redirectToLogin()
    setMessage("Goodbye!")

  }

  const login = ({username,password}) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    /*setSpinnerOn(true)
   axios.post('http://localhost:9000/api/login', {username,password})
    .then(res =>{
      console.log('token')
      console.log(res)
      setMessage(res.data.message)
      localStorage.setItem('token', res.data.token)
      navigate('/articles')
      setSpinnerOn(false)
    })
    .catch(err =>{
      console.log(err)
    })*/

    
  }
      
  
    
  

   const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    const token = localStorage.getItem('token')
    setSpinnerOn(true)
    setMessage('')
        axios.get('http://localhost:9000/api/articles',{
          headers:{
              authorization: token
          }
      } ) 
        .then(res=>{
            setMessage(res.data.message)
            setArticles(res.data.articles)
            redirectToArticles()
        })
        .catch(err=>{
            console.log(err)
            
        })
        .finally(()=>{
          setSpinnerOn(false)
        })

  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setSpinnerOn(true)
    setMessage('')
    const token = localStorage.getItem('token')
    
    axios.post('http://localhost:9000/api/articles',article,{
      headers:{
          authorization: token
      }
  } )  
       .then(res=>{
        console.log(res,'type')
       // setCurrentArticleId(res.data.article.article_id)
        setMessage(res.data.message)
        setArticles(articles => {
      
          return articles.concat(res.data.article)
        })
        
        
      })
      .catch(err=>{
        console.log(err)
        
      })
      .finally(()=>{
        setSpinnerOn(false)
      })
  

  }

  const updateArticle = ({ article_id, article }) => {
    const token = localStorage.getItem('token')
    // ✨ implement
    // You got this!
    axios.put(`http://localhost:9000/api/articles/${article_id}`, article,{
      headers:{
          authorization: token
      }
  })  
  .then(res=>{
    console.log(res)
    let articles1 = [...articles]
    setMessage(res.data.message)
    articles1 = articles1.map(art =>{
      if(res.data.article.article_id === art.article_id){
          return res.data.article
      }else{
        return art
      }
      
    })
    setArticles(articles1)
    
     })
  .catch(err =>{
    console.log(err)
  })
}

  const deleteArticle = article_id => {
    // ✨ implement
    const token = localStorage.getItem('token')
    axios.delete(`http://localhost:9000/api/articles/${article_id}`,{
      headers:{
          authorization: token
      }
  })  
  .then(res =>{
    console.log(res)
    let articles2 = [...articles]
    const deletedResult = articles2.filter(art => article_id !== art.article_id)
    setArticles(deletedResult)

    setMessage(res.data.message)
    
  })
  .catch(err =>{
    console.log(err)
  })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on ={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          {/* <Route element={<PrivateRoute/>}> */}
              {/* <Route element={<ArticleForm />} path= "/articles" /> */}
              
          {/* </Route> */}
          <Route path="/" element={<LoginForm setMessage = {setMessage} setSpinnerOn= {setSpinnerOn}  />} />
          <Route path = '/' element={<PrivateRoute/>}>
          <Route path="articles" element={
            <>
              <ArticleForm setValues={setValues} values={values} setCurrentArticleId={setCurrentArticleId}  
               currentArticle={articles.find(art => art.article_id == currentArticleId)} 
              postArticle={postArticle} updateArticle={updateArticle}/>
              <Articles setCurrentArticleId={setCurrentArticleId} currentArticleId={currentArticleId} articles={articles} setArticles={setArticles} setMessage = {setMessage} setSpinnerOn= {setSpinnerOn} getArticles={getArticles} deleteArticle={deleteArticle}/>
            </>
          } />
          </Route>
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
