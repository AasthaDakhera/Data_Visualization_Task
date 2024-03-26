import {Container,Row,Form,Button} from 'react-bootstrap'
import { useState } from 'react';
export default function Login(){
    const [validated, setValidated] = useState(false);
    const [email,setEmail]= useState('');
    const [password, setPassword]= useState('');
    return(
        <Container  >
        <Row>
        <h1 className='text-center mt-5 mb-3'>Login</h1>
        </Row>
        <Form noValidate validated={validated} >
        <Row className='mb-3'>
         <Form.Group controlId='formEmail'>
             <Form.Label>Email address</Form.Label>
             <Form.Control type="email" onChange={(e)=>setEmail(e.target.value)} required/>
             <Form.Control.Feedback type="invalid">
               Please choose a email.
             </Form.Control.Feedback>
         </Form.Group>
         </Row>
         <Row className='mb-3'>
         <Form.Group controlId='formPassword'>
             <Form.Label>Password</Form.Label>
             <Form.Control type="password" onChange={(e)=>setPassword(e.target.value)} required />
             <Form.Control.Feedback type="invalid">
               Please set a password.
             </Form.Control.Feedback>
         </Form.Group>
         </Row>
         
         
         <Button variant="link" onClick={onclick}  className='p-0 mb-3'>Dont have a account? Register Now</Button>
         {/* <Link to="">Dont have a account? Register Now</Link> */}
         <br/>
         <Container className='text-center'>
         <Button type="submit" variant='dark'>Login</Button>
         </Container>
        </Form>
     </Container>
    )
}