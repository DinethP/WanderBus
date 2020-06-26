
import React, { useState, useContext } from "react";
import { Form, Container, Button } from "react-bootstrap";
import locationContext from "../state/LocationContext";

const CommentForm = (props) => {
  const [commentContent, setCommentContent] = useState("");
  const locs = useContext(locationContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    locs.addComment(props.id, commentContent);
  };

  const handleChange = (e) => {
    setCommentContent(e.target.value);
  };

  return (
    <Container className="grey-container mb-3 mt-3">
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Add Comment:</Form.Label>
          <Form.Control
            as="textarea"
            name="content"
            type="text"
            placeholder="Comment"
            onChange={handleChange}
            value={commentContent}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default CommentForm;
