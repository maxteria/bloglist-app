import axios from 'axios'
const baseUrl = 'http://localhost:3000/api/blogs'

const getAll = async () =>  {
  try {
    const response = await axios.get(baseUrl)
    return response.data
  }
  catch (error) {
    console.log(error)
  }
}

export default { getAll }
