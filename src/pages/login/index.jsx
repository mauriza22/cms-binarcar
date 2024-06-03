/** @format */
import carLogin from '../../assets/img/big.car.login.png';
import { Input, Form, FormGroup, Label, Button } from 'reactstrap';
import logo from '../../assets/icon/logo.svg';
import axios from 'axios';
import { useState } from 'react';

const Login = () => {
  const [state, setState] = useState({
    email: '',
    password: '',
  });

  const [err, setErr] = useState('');
  const handleChange = (event) => {
    const { value, name } = event.target;
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchApi = (body) => {
    axios
      .post('https://api-car-rental.binaracademy.org/admin/auth/login', { ...body })
      .then((result) => {
        if (result?.data?.role === 'Customer') {
          console.log('ERROR 404');
        }
        if (result?.data?.role === 'Admin') {
          localStorage.setItem('TOKEN', result?.data?.access_token);
          window.location.replace('/dashboard');
        }
      })
      .catch((error) => {
        setErr(error?.response?.data?.message);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErr('');
    fetchApi(state);
  };

  return (
    <>
      <div className="d-flex flex-row login-container">
        <div className="image-login">
          <img className="login-banner" src={carLogin} alt="car-pict" />
        </div>

        <div className="form-login grid gap-3">
          <img className="p-2 g-col-12" src={logo} alt="logo" style={{ opacity: 70 }} />
          <h4 className="p-2 g-col-12">Welcome, Admin BCR</h4>
          {err && ( // Conditionally render the alert if there's an error message
            <div className="alert alert-danger" role="alert">
              {err}
            </div>
          )}
          <Form onSubmit={handleSubmit}>
            <FormGroup className="p-2 g-col-12">
              <Label for="exampleEmail">Email</Label>
              <Input name="email" placeholder="Contoh: johndee@gmail.com" type="email" onChange={handleChange} />
            </FormGroup>
            <FormGroup className="p-2 g-col-12">
              <Label for="exampleEmail">Password</Label>
              <Input name="password" placeholder="6+ karakter" type="password" onChange={handleChange} />
            </FormGroup>

            <div className="btn-wrapper mt-4">
              <Button className="btn-login p-2 g-col-12" type="submit">
                Sign In
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
