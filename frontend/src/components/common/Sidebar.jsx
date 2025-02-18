// import XSvg from "../svgs/X"; // Commented out import for XSvg, as it's not used

import { MdHomeFilled } from "react-icons/md"; // Import home icon from react-icons
import { IoNotifications } from "react-icons/io5"; // Import notifications icon from react-icons
import { FaUser } from "react-icons/fa"; // Import user icon from react-icons
import { Link } from "react-router-dom"; // Import Link component from react-router-dom for navigation
import { BiLogOut } from "react-icons/bi"; // Import logout icon from react-icons
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; // Import useMutation and useQuery hooks from @tanstack/react-query
import toast from "react-hot-toast"; // Import toast for displaying notifications

const Sidebar = () => {
  const queryClient = useQueryClient(); // Initialize query client

  // Define the mutation for logging out
  const { mutate: logoutMutation } = useMutation({
    // Function to execute when the mutation is called
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        });
        const authUser = await res.json();
        if (!res.ok) throw new Error(authUser.error || "Something went wrong");
        console.log(authUser);
      } catch (error) {
        throw new Error(error);
      }
    },
    // Success callback
    onSuccess: () => {
      // toast.success("Logout successful");
      queryClient.invalidateQueries({ queryKey: ["authUser"] }); // Invalidate the authUser query to trigger a refresh
    },
    // Error callback
    onError: () => {
      toast.error("Logout failed");
    },
  });

  // Query to get the authenticated user data
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  // Handle logout
  const handleLogout = (e) => {
    e.preventDefault(); // Prevent default link behavior as it is wrapped with the Link tag, to redirect us to the user page
    logoutMutation(); // Call the mutation
  };

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        {/* Home link */}
        <Link to="/" className="flex justify-center md:justify-start">
          <img
            className="px-2 w-28 h-20 rounded-full fill-white hover:bg-stone-900"
            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
            alt=""
          />
          {/* <XSvg className="px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900" /> */}
        </Link>
        <ul className="flex flex-col gap-3 mt-4">
          {/* Home link */}
          <li className="flex justify-center md:justify-start">
            <Link
              to="/"
              className="flex gap-3 items-center hover:bg-gray-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <MdHomeFilled className="w-8 h-8" />
              <span className="text-md hidden md:block">Home</span>
            </Link>
          </li>
          {/* Notifications link */}
          <li className="flex justify-center md:justify-start">
            <Link
              to="/notifications"
              className="flex gap-3 items-center hover:bg-gray-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <IoNotifications className="w-6 h-6" />
              <span className="text-md hidden md:block">Notifications</span>
            </Link>
          </li>
          {/* Profile link */}
          <li className="flex justify-center md:justify-start">
            <Link
              to={`/profile/${authUser?.username}`}
              className="flex gap-3 items-center hover:bg-gray-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaUser className="w-6 h-6" />
              <span className="text-md hidden md:block">Profile</span>
            </Link>
          </li>
        </ul>
        {authUser && (
          // User profile link and logout button
          <Link
            to={`/profile/${authUser.username}`}
            className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full"
          >
            <div className="avatar hidden md:inline-flex">
              <div className="w-8 rounded-full">
                <img src={authUser?.profileImg || "/avatar-placeholder.png"} />
              </div>
            </div>
            <div className="flex justify-between flex-1">
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm w-20 truncate">
                  {authUser?.fullName}
                </p>
                <p className="text-slate-500 text-sm">@{authUser?.username}</p>
              </div>
              <BiLogOut
                className="w-5 h-5 cursor-pointer"
                onClick={handleLogout}
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};
export default Sidebar; // Export the Sidebar component
