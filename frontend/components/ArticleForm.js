import React, { useEffect, useState } from 'react'
import axios from 'axios'
import PT from 'prop-types'


 const initialFormValues = { title: '', text: '', topic: '' }

export default function ArticleForm(props) {
  //const [values, setValues] = useState(initialFormValues)
  

  // ✨ where are my props? Destructure them here
  const {currentArticle,postArticle,updateArticle,setCurrentArticleId, values, setValues} = props

  useEffect(() => {
    // ✨ implement
    // Every time the `currentArticle` prop changes, we should check it for truthiness:
    // if it's truthy, we should set its title, text and topic into the corresponding
    // values of the form. If it's not, we should reset the form back to initial values.
    if(currentArticle){
      setValues({
        title:currentArticle.title,
        text:currentArticle.text,
        topic:currentArticle.topic
      })
    }
   
      },[currentArticle])
  
  
      // const postArticle = () => {
      //   // ✨ implement
      //   // The flow is very similar to the `getArticles` function.
      //   // You'll know what to do! Use log statements or breakpoints
      //   // to inspect the response from the server.
        
      //   const token = localStorage.getItem('token')
      //   axios.post('http://localhost:9000/api/articles', values,{
      //       headers:{
      //           authorization: token
      //       }
      //   }) 
      //     .then(res=>{
      //       console.log(res)
      //       setValues({
      //         title:title,
      //         text:text,
      //         topic:topic
      //       })
      //     })
      //     .catch(err=>{
      //       console.log(err)
      //     })
      
    
      // }

  const onChange = evt => {


    const { id, value } = evt.target
    setValues({ ...values, [id]: value })

    
  }
  const cancelEdit = () =>{
    setValues(initialFormValues)
  }

  const onSubmit = evt => {
    evt.preventDefault()
    // ✨ implement
    // We must submit a new post or update an existing one,
    // depending on the truthyness of the `currentArticle` prop.
   // postArticle()
    const article = {  
      title: values.title,
      topic: values.topic,
      text: values.text
    }
    currentArticle
    ? updateArticle({article, article_id: currentArticle.article_id})
    : postArticle(article)
   
    setValues(initialFormValues)
  }

  const isDisabled = () => {
    // ✨ implement
    // Make sure the inputs have some values
    const text = values.text.trim()
    const title = values.title.trim()
    

    const isTextValid = text.length  >= 1
    const isTitleValid = title.length  >= 1
    const isTopicValid = values.topic === 'JavaScript' || 'Node' || 'React'
    return !(isTextValid && isTitleValid && isTopicValid)

  }

  return (
    // ✨ fix the JSX: make the heading display either "Edit" or "Create"
    // and replace Function.prototype with the correct function
    <form id="form" onSubmit={onSubmit}>
      <h2>Create Article</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled ={isDisabled()} id="submitArticle">Submit</button>
        <button onClick={Function.prototype}>Cancel edit</button>
      </div>
    </form>
  )
}

// 🔥 No touchy: LoginForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}
