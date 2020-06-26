
import React from "react";
import { Card } from "react-bootstrap";

const CommentCard = (props) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{props.content}</Card.Title>
        <Card.Text>{props.username}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default CommentCard;
