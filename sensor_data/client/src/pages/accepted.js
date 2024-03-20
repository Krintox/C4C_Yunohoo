import React, { useEffect, useState, useContext } from "react";
// import {useParams} from "react-router-dom";
// import {UserContext} from "./UserContext";
// import {formatISO9075} from "date-fns";
import axios from "axios";
// import {Link} from 'react-router-dom';

function MyPosts() {
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/myposts")
      .then((response) => console.log(response.data))
      .catch((error) => console.log(error));
  }, []);
  

  return (
    <div>
        {myPosts.map((post) => (
          <li key={post._id}>{post.title}</li>
        ))}
    </div>
  );
}

export default MyPosts;
