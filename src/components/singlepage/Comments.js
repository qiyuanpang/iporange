import {Form, Container, Button, FormControl} from 'react-bootstrap';

function Comments(props) {
    return (
       <Container>
	    <Form className="d-flex">
	        <Form.Control
	            type="text"
	            placeholder="This session will be coming soon!"
	            rows={4}
	            as="textarea"
	            size="lg"
	        />
	    </Form>
	    <Button variant="secondary" type="submit" size="sm" style={{float: 'right'}}  disabled>Comment</Button>
       </Container>
    )
}

export default Comments;
