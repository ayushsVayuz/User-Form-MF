import { useEffect, useState } from "react";
import React from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { handleNameChange, handleAboutChange, handleEmailChange, handleLocationChange, handlePhoneChange } from "../../utils/util";
import { FaArrowLeft } from "react-icons/fa";
import formStore from "../../store/formStore";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const UserForm = ({ update }) => {
    console.log("update", update);
    
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { id } = useParams();
    const [isChecked, setIsChecked] = useState(false);

    const { usersData, selectedUser, formLoader, getSpecificUserData, postUserData, updateUserData, getSpecificUserLoader } = formStore();

    const {
        handleSubmit,
        control,
        setValue,
        getValues,
        watch,
        trigger,
        formState: { errors },
        reset,
    } = useForm({
        mode: "onChange",
        defaultValues: { name: "", email: "", phone: "", location: "", about: "", status: false }
    });

    const [image, setImage] = useState()
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState("");

    const defaultValues = {
        name: "",
        email: "",
        phone: "",
        location: "",
        about: "",
        status: "",
    };

    /**
     * @param {Event} e - The event triggered by the back action.
     */
    function backToHome(e) {
        e.preventDefault();
        navigate("/home")

    }


    /**
     * @param {Event} e - The event containing the selected file.
     */
    function handleImageChange(e) {

        let type = e.target.files[0]?.type
        type = String(type)
        if (type === "image/png" || type === "image/jpeg" || type === "image/gif" || type === "image/webp" || type === "image/apng") {
            setFileName(e.target.files[0]?.name)
            setFile(URL.createObjectURL(e.target.files[0]));
            setImage(e.target.files[0])

        } else {
            setFileName(null)
            setFile(null);
            setImage(" ")
            toast.error("Select image of type .png, .jpeg, .gif, .webp, .apng")
        }
    }




    /**
     * Warns the user before leaving the page.
     * Runs when `formLoader` changes.
     */
    useEffect(() => {
        window.addEventListener("beforeunload", alertUser);
        return () => {
            window.removeEventListener("beforeunload", alertUser);
        };
    }, [formLoader]);



    const alertUser = (e) => {
        e.preventDefault();
        e.returnValue = "";
    };

    if (update == true) {

        /**
         * @param {string} id - Unique user identifier for retrieval.
         */
        useEffect(() => {
            (getSpecificUserData(id));
        }, [id])



        /**
         * Updates form values with data from the selected user.
         */
        useEffect(() => {


            setValue("name", selectedUser?.name)
            setValue("email", selectedUser?.email)
            setValue("phone", selectedUser?.phone)
            setValue("location", selectedUser?.location)
            setValue("about", selectedUser?.about)
            setValue("status", selectedUser?.status ? true : false)
            trigger();
        }, [selectedUser, trigger])
    }

    const formData = watch();
    const errorLength = Object.keys(errors).length === 0
    const trimming = Object.values(formData).every(value => {
        if (typeof value === 'string') {
            return value.trim() !== "";
        } else if (value === null || value === undefined) {
            return false;
        } else {
            return true;
        }
    });

    const isValid = errorLength && trimming;

    /**
     * @param {Object} data - Contains user details to be updated.
     * @return {Promise<void>} Sends user data to API and redirects upon success.
     */
    const onSubmit = async (data) => {
        let formData = new FormData();
        formData.append("name", data?.name);
        formData.append("email", data?.email);
        formData.append("phone", data?.phone);
        formData.append("location", data?.location);
        formData.append("about", data?.about);
        formData.append("image", image);
        formData.append("status", data?.status ?? false);



        try {
           
            if (update !== true) {

                const response = await postUserData(formData)

                if (response?.data?.statusCode === 201) {
                    navigate("/home");
                }

            } else {
                const response = await updateUserData({ formData, id })
                console.log("response put", response);
                if (response?.data?.statusCode === 200) {
                    navigate(-1);
                }


            }

        } catch (error) {
            console.log("Error: " + (error?.message || "Something went wrong"));
        }

    };


    return (
        getSpecificUserLoader ?
            <div className="flex h-[550px] justify-center items-center mb-5">
                <div className="border-4 border-solid text-center border-blue-700 border-e-transparent rounded-full animate-spin w-10 h-10"></div>
            </div>
            :
            <div className="flex justify-center min-h-screen grid ">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-[50px] pl-10 pr-10 pb-10  h-fit ml-60 mr-60 shadow-2xl bg-white rounded-lg w-auto"
                >


                    <div>
                        <div className="flex items-center h-20">
                            <button
                                onClick={(e) => backToHome(e)}
                                className=" text-blue-600  hover:text-sky-800 rounded-lg font-medium  transition duration-200"
                            >
                                <FaArrowLeft size={"25px"} />
                            </button>
                            <h1 className="w-full text-center font-medium text-blue-600 text-3xl">
                                {update ? "Update User Details" : "Create User Data"}
                            </h1>
                        </div>

                        <div className="grid grid-cols-2  gap-10 h-30">

                            <div>
                                <label className="text-sm font-medium text-gray-700 -mb-1">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{
                                        required: "Full Name is required",
                                        pattern: {
                                            value: /^[a-zA-Z\s]+$/,
                                            message: "Name must contain only letters",
                                        },
                                        minLength: {
                                            value: 2,
                                            message: "Full Name must be at least 2 characters",
                                        }

                                    }}
                                    render={({ field }) => (
                                        <div className="relative">
                                            {console.log("formLoader from useform", formLoader)}

                                            <input
                                                {...field}
                                                type="text"
                                                maxLength={44}
                                                inputMode="text"
                                                className={`p-3 w-full text-base border ${errors.name ? "border-red-500" : "border-blue-500"
                                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                placeholder="Enter your full name"
                                                onChange={(e) => handleNameChange({ e, field })}
                                                disabled={formLoader ? true : false}
                                            />

                                            <p className="text-red-500 text-[13px] -mb-1 min-h-[20px]">{errors.name?.message}</p>

                                        </div>
                                    )}
                                />

                                <label className="text-sm font-medium text-gray-700 -mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{
                                        required: "Email is required",
                                        minLength: {
                                            value: 3,
                                            message: "Email must be at least 3 characters",
                                        },
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: "Invalid email format.",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <div className="relative">
                                            <input
                                                {...field}
                                                type="text"
                                                maxLength={44}
                                                inputMode="email"
                                                disabled={formLoader ? true : false}
                                                className={`p-3 w-full text-base border ${errors.email ? "border-red-500" : "border-blue-500"
                                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                placeholder="Enter your email"
                                                onChange={(e) => handleEmailChange({ e, field })}
                                            />

                                            <p className="text-red-500 text-[13px] -mb-1 min-h-[20px]">{errors.email?.message}</p>

                                        </div>
                                    )}
                                />


                                <label className="text-sm font-medium text-gray-700 -mb-1">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="phone"
                                    control={control}
                                    rules={{
                                        required: "Phone Number is required",
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: "Phone Number must be exactly 10 digits.",
                                        },

                                        validate: (value) => {
                                            if (/^(.)\1{9}$/.test(value)) {
                                                return "Phone number cannot have all identical digits.";
                                            }
                                            return true;
                                        },

                                    }}
                                    render={({ field }) => (
                                        <div className="relative">
                                            <input
                                                {...field}
                                                maxLength={10}
                                                type="tel"
                                                inputMode="numeric"
                                                disabled={formLoader ? true : false}
                                                className={`p-3 w-full text-base border ${errors.phone ? "border-red-500" : "border-blue-500"
                                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                placeholder="Enter your phone number"
                                                onChange={(e) => handlePhoneChange({ e, field })}
                                            />

                                            <p className="text-red-500 text-[13px] -mb-1 min-h-[20px]">{errors.phone?.message}</p>

                                        </div>
                                    )}
                                />

                                <label className="text-sm font-medium text-gray-700 -mb-1">
                                    Location <span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="location"
                                    control={control}
                                    rules={{
                                        required: "Location is required",
                                        minLength: {
                                            value: 3,
                                            message: "Location must be at least 3 characters",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <div className="relative">
                                            <input
                                                {...field}
                                                type="text"
                                                inputMode="text"
                                                maxLength={44}
                                                disabled={formLoader ? true : false}
                                                className={`p-3 w-full text-base border ${errors.location ? "border-red-500" : "border-blue-500"
                                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                placeholder="Enter your location"
                                                onChange={(e) => handleLocationChange({ e, field })}
                                            />

                                            <p className="text-red-500 text-[13px] -mb-1 min-h-[20px]">{errors.location?.message}</p>

                                        </div>
                                    )}
                                />
                            </div>

                            <div>

                                <label className="text-sm font-medium text-gray-700 -mb-1">
                                    About <span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="about"
                                    control={control}
                                    rules={{
                                        required: "About section is required",
                                        minLength: {
                                            value: 15,
                                            message: "About section must be at least 15 characters long",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <div className="relative">
                                            <textarea
                                                {...field}
                                                type="text"
                                                inputMode="text"
                                                maxLength={100}
                                                disabled={formLoader ? true : false}
                                                className={`p-3 w-full text-base border ${errors.about ? "border-red-500" : "border-blue-500"
                                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                placeholder="Tell us about yourself"
                                                onChange={(e) => handleAboutChange({ e, field })}
                                            />

                                            <p className="text-red-500 text-[13px] -mb-1 min-h-[20px]">{errors.about?.message}</p>

                                        </div>
                                    )}
                                />

                                <div className="flex flex-col sm:flex-row gap-4 items-center bg-gray-100 p-4 rounded-lg">
                                    <label htmlFor="files" className="cursor-pointer bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-medium transition duration-300">
                                        Select Image(Optional)
                                    </label>

                                    <input type="file" disabled={formLoader} id='files' style={{ 'display': 'none' }} name="image" onChange={handleImageChange} accept="image/*" />
                                    <p className="text-gray-600 font-medium truncate max-w-xs">{fileName || ""}</p>

                                    {file ? (
                                        <div className="flex items-center gap-4">

                                            <img src={file} className="h-20 w-20 rounded-lg shadow-lg object-cover border-2 border-gray-300" alt="preview" />
                                            <div className="relative w-full">
                                                <button
                                                    className="absolute top-[-65px] right-[-8px] text-2xl text-red-500 px-2 py-1 rounded-lg font-medium transition duration-300"
                                                    onClick={() => {
                                                        setFile(null);
                                                        setImage(null);
                                                        setFileName("");
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faXmark} />
                                                </button>
                                            </div>
                                        </div>) : (
                                        <p className="text-gray-400">No image selected</p>
                                    )}



                                </div>
                          
                                <div className={update ? ` ` : `grid grid-cols-2 mt-2 gap-5 items-center`}>
                                    <input type="reset" onClick={() => reset(defaultValues)} className={update ? `hidden ` : `h-12 mt-5 border-2 border-red-700 text-red-700 rounded-2xl font-medium hover:bg-red-700 hover:text-white text-lg`} />
                                    {
                                        formLoader ?
                                            <div className="flex justify-center h-12 items-center">
                                                <div className="border-4 mt-5 border-solid text-center border-blue-700 border-e-transparent rounded-full animate-spin w-10 h-10"></div>
                                            </div>
                                            :
                                            <button
                                                disabled={!isValid}
                                                className={` h-12  mt-5 w-full font-medium text-lg rounded-xl ${!isValid ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} text-white`}

                                            >
                                                Submit
                                            </button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

    );
}

export default UserForm
