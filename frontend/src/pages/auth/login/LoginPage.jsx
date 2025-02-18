import { useState } from "react"; // Import useState hook from React
import { Link } from "react-router-dom"; // Import Link component from react-router-dom for navigation

import { MdOutlineMail } from "react-icons/md"; // Import email icon from react-icons
import { MdPassword } from "react-icons/md"; // Import password icon from react-icons
import { useMutation } from "@tanstack/react-query"; // Import useMutation hook from @tanstack/react-query
import toast from "react-hot-toast"; // Import toast for displaying notifications

const LoginPage = () => {
  // State for form data
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // Define the mutation for logging in
  const {
    mutate: loginMutation,
    isError,
    isPending,
    error,
  } = useMutation({
    // Function to execute when the mutation is called
    mutationFn: async ({ username, password }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
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
      toast.success("Login successful");
    },
    // Error callback
    onError: () => {
      toast.error(error.message);
    },
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    loginMutation(formData); // Call the mutation with form data
  };

  // Handle input change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Update form data state
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      {/* Left side image, visible only on large screens */}
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <img
          className="lg:w-2/3 fill-white"
          src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
          alt="website-logo"
        />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        {/* Login form */}
        <form className="lg:w-2/3 flex gap-4 flex-col" onSubmit={handleSubmit}>
          {/* Logo for mobile view */}
          <img
            className="w-24 lg:hidden fill-white"
            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
            alt="website-logo"
          />
          <h1 className="text-4xl font-extrabold text-white">{"Let's"} go.</h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="text"
              className="grow"
              placeholder="username"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
            />
          </label>

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
            {isPending ? "Logging in.." : "Login"}
          </button>
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-white text-lg">{"Don't"} have an account?</p>
          <Link to="/signup">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LoginPage; // Export the LoginPage component
