
import React, { useContext } from "react";
import CommentForm from "./CommentForm";
import CommentCard from "./CommentCard";
import userContext from "../state/UserContext";

const CommentSection = (props) => {
  const userCtx = useContext(userContext);

  return (
    <div className="mt-5 mb-5">
      <h4>Comments:</h4>

      {props.comments.length === 0
        ? "No Comments Yet!"
        : props.comments.map((val) => (
            <CommentCard username={val.username} content={val.content} />
          ))}
      <hr />
      {userCtx.user.logged_in ? (
        <CommentForm id={props.id} />
      ) : (
        <h5 className="mt-2 mb-3">Login to add a comment!</h5>
      )}
    </div>
  );
};

export default CommentSection;
