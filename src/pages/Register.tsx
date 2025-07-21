import React, {useState, useEffect} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../store';
import {registerUser , resetRegistrationSuccess} from '../features/authSlice';
import {useNavigate} from 'react-router-dom';

interface RegisterProps {
    onRegistrationSuccess?: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegistrationSuccess }) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error, registrationSuccess } = useSelector((state: RootState) => state.auth);

    const [values, setValues] = useState({FirstName: '',LastName: '', email: '', password: ''});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (registrationSuccess) {
            if (onRegistrationSuccess) onRegistrationSuccess();
        }
    }, [registrationSuccess, onRegistrationSuccess, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({...values, [e.target.name]: e.target.value});
        setErrors({...errors, [e.target.name]: ''});
    };

    const validateField = (FirstName: string, value: string) => {
        switch (FirstName) {
            case 'FirstName':
                if (!value.trim()) return 'Name is required';
                break;
            case 'email':
                if (!value) return 'Email is required';
                if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
                break;
            case 'password':
                if (!value) return 'Password is required';
                if (value.length < 6) return 'Password must be at least 6 characters';
                break;
            default:
                return '';
        }
        return '';
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        const error = validateField(name, value);
        setErrors(prev => ({...prev, [name]: error}));
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        Object.entries(values).forEach(([name, value]) => {
            const error = validateField(name, value);
            if (error) newErrors[name] = error;
        });
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        dispatch(registerUser(values));
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            {error && (
                <Alert severity="error" sx={{mb: 2}}>
                    {error}
                </Alert>
            )}
            <Stack spacing={2}>
                <TextField
                    label="Name"
                    name="FirstName"
                    fullWidth
                    required
                    value={values.FirstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors.name}
                    helperText={errors.name}
                />
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    fullWidth
                    required
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors.email}
                    helperText={errors.email}
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    fullWidth
                    required
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors.password}
                    helperText={errors.password}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    fullWidth
                    sx={{
                        borderRadius: 3,
                        boxShadow: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '1rem',
                        py: 1.5,
                    }}
                >
                    Register
                </Button>
            </Stack>
        </form>
    );
};

export default Register;