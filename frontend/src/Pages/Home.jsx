import React, { useState } from 'react'
import axios from 'axios';

const Home = () => {
  const [topic, setTopic] = useState('')             // for input field
  const [submittedTopic, setSubmittedTopic] = useState('') // to store after submit

  const handleChange = (e) => {
    setTopic(e.target.value)
  }

  const handleSubmit = async() => {
    if (topic.trim() !== '') {
      console.log("Submitted:", topic)   // log value
      setSubmittedTopic(topic)           // store value
      setTopic('')               
      console.log(submittedTopic)        // clear input box
      const response = await axios.post('http://localhost:5000/api/generate', {
        topic: submittedTopic
      });

    }
  }

  return (
    <div className="flex flex-col items-center mt-10 gap-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter the Topic"
          value={topic}
          onChange={handleChange}
          className="border border-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Enter
        </button>
      </div>

      
    </div>
  )
}

export default Home
