import { Link } from "react-router-dom"; // Import Link component from react-router-dom for navigation
import { useState } from "react"; // Import useState hook from React
import { useMutation } from "@tanstack/react-query"; // Import useMutation hook from @tanstack/react-query

// import XSvg from "../../../components/svgs/X"; // Commented out import for XSvg, as it's not used

import { MdOutlineMail } from "react-icons/md"; // Import email icon from react-icons
import { FaUser } from "react-icons/fa"; // Import user icon from react-icons
import { MdPassword } from "react-icons/md"; // Import password icon from react-icons
import { MdDriveFileRenameOutline } from "react-icons/md"; // Import full name icon from react-icons
import toast from "react-hot-toast"; // Import toast for displaying notifications

const SignUpPage = () => {
  // State for form data
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  // Define the mutation for signing up
  const {
    mutate: signupMutation,
    isError,
    isPending,
    error,
  } = useMutation({
    // Function to execute when the mutation is called
    mutationFn: async ({ email, username, fullName, password }) => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, username, fullName, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        console.log(data);
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    // Success callback
    onSuccess: () => {
      toast.success("Account created successfully");
    },
    // Error callback
    onError: () => {
      toast.error(error.message);
    },
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    signupMutation(formData); // Call the mutation with form data
  };

  // Handle input change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Update form data state
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      {/* Left side image, visible only on large screens */}
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <img
          className="lg:w-2/3 fill-white"
          src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
          alt="website-logo"
        />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        {/* Sign up form */}
        <form
          className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          {/* Logo for mobile view */}
          <img
            className="w-24 lg:hidden fill-white"
            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
            alt="website-logo"
          />
          <h1 className="text-4xl font-extrabold text-white">Signup Now</h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="email"
              className="grow"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </label>
          <div className="flex gap-4 flex-wrap">
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <FaUser />
              <input
                type="text"
                className="grow"
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
              />
            </label>
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <MdDriveFileRenameOutline />
              <input
                type="text"
                className="grow"
                placeholder="Full Name"
                name="fullName"
                onChange={handleInputChange}
                value={formData.fullName}
              />
            </label>
          </div>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          <button className="btn rounded-full btn-primary text-white">
            {isPending ? "Signing up.." : "Sign up"}
          </button>
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>
        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-white text-lg">Already have an account?</p>
          <Link to="/login">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage; // Export the SignUpPage component
