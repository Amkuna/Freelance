import React, {useState} from 'react';
import Autocomplete from '../Autocomplete';
import cities from '../cities';

import { useAuth } from '../context/auth';

import {Link, Redirect} from 'react-router-dom';

import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';

import {Formik, Form, ErrorMessage} from 'formik';
import * as Yup from 'yup';

import axios from '../axios';


import { makeStyles} from '@material-ui/core/styles';

import ReCAPTCHA from 'react-google-recaptcha';

const useStyles = makeStyles( theme => ({
    root: {
        '& > *, & > form > *': {
            marginBottom: theme.spacing(3)
        },
        padding: '20px',
        backgroundColor: '#eee',
        width: '100%',
        margin: '0 auto',
        [theme.breakpoints.up('md')]: {
            width: '750px'
        }
    }
}))


const Register = (props) => {

    const { authTokens } = useAuth();
    const referer = props.location.state? props.location.state.referer: '/'; 

    const classes = useStyles();
    const [inputCity, setInputCity] = useState('');
    const [showPassword, setShowPassword] = useState(false)
    //if is logged in, redirect to previous page
    if( authTokens ) {
        return <Redirect to={referer} />
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const recaptchaRef = React.createRef();
    
    const initialValues = {
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        role: '',
        location: '',
        recaptcha: null
    };

    const validationSchema = Yup.object({
        name: Yup.string().max(255, "Vardas negali būti ilgesnis nei 255 simbolių ilgumo").required('Privalomas laukelis'),
        email: Yup.string().email("Neteisingas el. pašto adresas").required("Privalomas laukelis"),
        password: Yup.string().min(8, "Slaptažodis privalo būti bent 8 simbolių ilgumo").required("Privalomas laukelis"),
        passwordConfirm: Yup.string().when("password", {
            is: val => (val && val.length > 0 ? true : false),
            then: Yup.string().oneOf(
            [Yup.ref("password")],
            "Slaptažodžiai turi sutapti"
            )
        }).required("Privalomas laukelis"),
        location: Yup.string().nullable().required("Privalomas laukelis"),
        role: Yup.string().required("Privalomas laukelis"),
        recaptcha: Yup.string().nullable().required("Privalomas laukelis")
    });

    const handleSubmit = (values, {setErrors, setSubmitting}) => {  
        console.log(values);
        
        axios.post('/register', values)
            .then(res => {
                console.log(res);
                setSubmitting(false);
                //Response is good, but the given values were incorrent
                if(res.status === 200) {
                    if(res.data.error) {
                        if(res.data.error.email) {
                            setErrors({email: "Šis el. paštas jau buvo užregistruotas!"})
                        }
                        recaptchaRef.current.reset();
                    }
                } else if(res.status === 201) {
                    props.history.push({
                        pathname: '/login',
                        state: {registrationSuccesful: true}
                    });
                }
            })
            .catch(err => {
                setSubmitting(false);
                console.log(err);
            })
    }

    return (
        <div className={classes.root}>
            <Formik 
                initialValues={initialValues} 
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
                >
            {({ handleChange, values, setFieldValue, handleBlur, isSubmitting }) => (
                <Form autoComplete='off' >
                    <h2>Registracija</h2>
                    <FormGroup>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Tipas</FormLabel>
                            <RadioGroup row aria-label="gender" name="role" value={values.role} onChange={handleChange}>
                                <FormControlLabel value="2" control={<Radio color='primary' />} label="Klientas" />
                                <FormControlLabel value="3" control={<Radio color='primary' />} label="Freelanceris" />
                            </RadioGroup>
                        </FormControl>
                        <ErrorMessage name='role' render={msg => <div className='text-danger'>{msg}</div>} />
                    </FormGroup>
                    <FormGroup> 
                        <TextField variant='outlined' label='Vardas, Pavardė' name='name' color='primary' onChange={handleChange} onBlur={handleBlur} value={values.name} />
                        <ErrorMessage name='name' render={msg => <div className='text-danger'>{msg}</div>} />
                    </FormGroup>
                    <FormGroup>
                        <Autocomplete 
                            width="300px"
                            name='location'
                            label='Miestas'
                            options={cities}
                            value={values.location}
                            inputValue={inputCity}
                            onInputchange={(e, value) => {
                                setInputCity(value !== null? value: '');
                            }}
                            onChange={(e, value) => {
                                setFieldValue('location', value);
                                if(!value) {
                                    setInputCity('');
                                }
                            }}
                        />
                        <ErrorMessage name='location' render={msg => <div className='text-danger'>{msg}</div>} />
                    </FormGroup>
                    <FormGroup>
                        <TextField variant='outlined' label='El. paštas' name='email' color='primary' onChange={handleChange} onBlur={handleBlur} value={values.email} />
                        <ErrorMessage name='email' render={msg => <div className='text-danger'>{msg}</div>} />
                    </FormGroup>
                    <FormGroup>
                        <TextField variant='outlined' label='Slaptažodis' name='password' color='primary' type={showPassword? 'text': 'password'} onChange={handleChange} onBlur={handleBlur} value={values.password} InputProps={{
                            endAdornment: <InputAdornment position='end'>
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}                   
                                edge="end"
                        >{showPassword ? <Visibility />: <VisibilityOff />}</IconButton>
                            </InputAdornment>}}/>
                        <ErrorMessage name='password' render={msg => <div className='text-danger'>{msg}</div>} />
                    </FormGroup>
                    <FormGroup>
                        <TextField variant='outlined' label='Slaptažodžio patvirtinimas' name='passwordConfirm' color='primary' type={showPassword? 'text': 'password'} onChange={handleChange} onBlur={handleBlur} value={values.passwordConfirm} InputProps={{
                            endAdornment: <InputAdornment position='end'>
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                
                                edge="end"
                        >{showPassword ? <Visibility />: <VisibilityOff />}</IconButton>
                            </InputAdornment>}}/>
                        <ErrorMessage name='passwordConfirm' render={msg => <div className='text-danger'>{msg}</div>} />
                    </FormGroup>
                    <FormGroup>
                        <ReCAPTCHA 
                            ref={recaptchaRef}
                            sitekey='6LfraOgUAAAAAIfS-8yAUT6QO-uhuol29LfgvKxL' 
                            onChange={(response) => setFieldValue("recaptcha", response)}
                            />
                        <ErrorMessage name='recaptcha' render={msg => <div className='text-danger'>{msg}</div>} />
                    </FormGroup>
                    <Button type='submit' disabled={isSubmitting} variant='contained' color='primary' >
                        Registruotis
                    </Button>
                </Form>
            )}
            </Formik>
            <Link to='/login'>Jau turi paskyrą? Prisijunk</Link>
        </div>
    )
};

export default Register;

