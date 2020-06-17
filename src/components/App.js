import React, { useState, useEffect } from 'react'
import Friend from './Friend'
import FriendForm from './FriendForm'
// 🔥 STEP 1- CHECK THE ENDPOINTS USING POSTMAN OR HTTPIE

// in console - http :4000/friends to use HTTPIE
// in console making post request - 
// http post :4000/friends username=Jessica email=something@gmail.com civil=Married role=Student 

// 🔥 STEP 2- FLESH OUT FriendForm.jsx
// 🔥 STEP 3- FLESH THE SCHEMA IN ITS OWN FILE
// 🔥 STEP 4- IMPORT THE SCHEMA, AXIOS AND YUP
import formSchema from '../validation/formSchema'
import axios from 'axios'
import * as Yup from 'yup'

//////////////// INITIAL STATES ////////////////
//////////////// INITIAL STATES ////////////////
//////////////// INITIAL STATES ////////////////
const initialFormValues = {
  ///// TEXT INPUTS /////
  username: '',
  email: '',
  ///// DROPDOWN /////
  role: '',
  ///// RADIO BUTTONS /////
  civil: '',
  ///// CHECKBOXES /////
  hobbies: {
    hiking: false,
    reading: false,
    coding: false,
  },
}
const initialFormErrors = {
  username: '',
  email: '',
  role: '',
  civil: '',
}
const initialFriends = []
const initialDisabled = true


export default function App() {
  //////////////// STATES ////////////////
  //////////////// STATES ////////////////
  //////////////// STATES ////////////////
  const [friends, setFriends] = useState(initialFriends)          // array of friend objects
  const [formValues, setFormValues] = useState(initialFormValues) // object
  const [formErrors, setFormErrors] = useState(initialFormErrors) // object
  const [disabled, setDisabled] = useState(initialDisabled)       // boolean

  //////////////// HELPERS ////////////////
  //////////////// HELPERS ////////////////
  //////////////// HELPERS ////////////////
  const getFriends = () => {
    // 🔥 STEP 5- IMPLEMENT! ON SUCCESS PUT FRIENDS IN STATE
    //    helper to [GET] all friends from `http://localhost:4000/friends`
    axios.get('http://localhost:4000/friends')
      .then(response => {
        setFriends(response.data);
      })
      .catch(err => {
        console.log(err);
      })
  }

  const postNewFriend = newFriend => {
    // 🔥 STEP 6- IMPLEMENT! ON SUCCESS ADD NEWLY CREATED FRIEND TO STATE
    //    helper to [POST] `newFriend` to `http://localhost:4000/friends`
    //    and regardless of success or failure, the form should reset
    axios.post('http://localhost:4000/friends', newFriend)
      .then(res => {
          setFriends([...friends, res.data])
      })
      .catch(err => {
        console.log(err);
      })
      .finally( () => {
        setFormValues(initialFormValues)
      })
  }

  //////////////// EVENT HANDLERS ////////////////
  //////////////// EVENT HANDLERS ////////////////
  //////////////// EVENT HANDLERS ////////////////
  const onInputChange = evt => {
    const name = evt.target.name
    const value = evt.target.value

    // 🔥 STEP 11- RUN VALIDATION WITH YUP

    setFormValues({
      ...formValues,
      [name]: value // NOT AN ARRAY
    })
  }

  const onCheckboxChange = evt => {
    // 🔥 STEP 7- IMPLEMENT!
    // a) pull the `name` of the checkbox from the event
    // b) pull whether `checked` true or false, from the event
    // c) set a new state for the whole form
    const {name, checked} = evt.target
    setFormValues({
      ...formValues, 
      hobbies:{
        ...formValues.hobbies,
        [name]:checked
      } 
    })
  }

  const onSubmit = evt => {
    evt.preventDefault()

    const newFriend = {
      username: formValues.username.trim(),
      email: formValues.email.trim(),
      role: formValues.role,
      civil: formValues.civil,
      // 🔥 STEP 8- WHAT ABOUT HOBBIES?
      hobbies: Object.keys(formValues.hobbies).filter(hobbyName => formValues.hobbies[hobbyName]),
    }
    // 🔥 STEP 9- POST NEW FRIEND USING HELPER
    postNewFriend(newFriend);
  }

  //////////////// SIDE EFFECTS ////////////////
  //////////////// SIDE EFFECTS ////////////////
  //////////////// SIDE EFFECTS ////////////////
  useEffect(() => {
    getFriends()
  }, [])

  useEffect(() => {
    // 🔥 STEP 10- ADJUST THE STATUS OF `disabled` EVERY TIME `formValues` CHANGES
    formSchema.isValid(formValues).then(valid => {
      setDisabled(!valid);
    })
  }, [formValues])

  return (
    <div className='container'>
      <header><h1>Friends App</h1></header>

      <FriendForm
        values={formValues}
        onInputChange={onInputChange}
        onCheckboxChange={onCheckboxChange}
        onSubmit={onSubmit}
        disabled={disabled}
        errors={formErrors}
      />

      {
        friends.map(friend => {
          return (
            <Friend key={friend.id} details={friend} />
          )
        })
      }
    </div>
  )
}
