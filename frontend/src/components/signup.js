import {Button, Form,Container,Row} from 'react-bootstrap';
import { useState } from 'react';
export default function Signup(){
   const [email, setEmail]=useState('');
   const [password, setPassword]=useState('');
   const [validated, setValidated] = useState(false);

   return(
          <Container>
          <Row>
                 <h1 className='text-center mt-5 mb-3' >Register</h1>
                 </Row>
                 <Form noValidate validated={validated} >
                 <Row>
                  <Form.Group controlId='formEmail'>
                      <Form.Label>Email address</Form.Label>
                      <Form.Control type="email" onChange={(e)=>setEmail(e.target.value)} required/>
                      <Form.Control.Feedback type='invalid'>please enter a valid email</Form.Control.Feedback>
                  </Form.Group>
                  </Row>
                  <Row>
                  <Form.Group controlId='formPassword'>
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password" onChange={(e)=>setPassword(e.target.value)} required/>
                      <Form.Control.Feedback type='invalid'>please set a password</Form.Control.Feedback>
                  </Form.Group>
                  </Row>
                  <Button variant="link" onClick={onclick}>Have an account? Login Now</Button>

                  <Container className='text-center'>
                      <Button type="submit" variant='dark'>Register</Button>
                  </Container>
                  </Form>
          </Container>
    )
}