import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik"; // Form library
import * as yup from "yup"; // Validation
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; //for redux
import { setLogin } from "../../../state/reduxConfig.js";
import Dropzone from "react-dropzone"; // to be able to drop files
import FlexBetween from "components/FlexBetween"; //reusable comp

/* Schema for form validation in Yup */
const registerSchema = yup.object().shape({
    firstName: yup.string().required("required"), 
    lastName: yup.string().required("required"), 
    email: yup.string().email("Invalid email").required("required"), 
    picture: yup.string().required("required"), 
});

const loginSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("required"), 
    password: yup.string().required("required"),
});

const initialValuesRegister = {
    firstName: "",
    lastName: "",
    email: "",
    picture: "",
};

const initialValuesLogin = {
    email: "",
    password: "",
};

/* States (boolean gets prefix with "is" to show its boolean) */
const Form = () => {
    const [pageType, setPageType] = useState("login");
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const isLogin = pageType === "login";
    const isRegister = pageType === "register";

    const handleFormSubmit = async (values, onSubmitProps) => {};

    //initialValues initial our isLogin with the login form if not it takes us to register
    //validationSchema works the same
    return (
        <Formik 
        onSubmit={handleFormSubmit}
        initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
        validationSchema={isLogin ? loginSchema : registerSchema}>
        </Formik>
    )
}

export default Form;