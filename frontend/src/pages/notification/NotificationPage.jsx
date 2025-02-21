// Import necessary components and libraries
import { Link } from "react-router-dom"; // Import Link component for navigation
import LoadingSpinner from "../../components/common/LoadingSpinner"; // Import LoadingSpinner component

// Import icons from react-icons library
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

// Import hooks from react-query and toast notification library
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Define the NotificationPage component
const NotificationPage = () => {
  // Get the queryClient instance for managing query cache
  const queryClient = useQueryClient();

  // Fetch notifications using useQuery hook
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"], // Define the query key
    queryFn: async () => {
      try {
        const res = await fetch("/api/notifications/"); // Fetch notifications data from API
        const data = await res.json(); // Parse response JSON
        if (!res.ok) throw new Error(data.Error || "Something went wrong"); // Handle error response
        return data; // Return fetched data
      } catch (error) {
        throw new Error(error); // Handle fetch error
      }
    },
  });

  // Define the deleteNotificationsMutation using useMutation hook
  const { mutate: deleteNotificationsMutation } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/notifications/", {
          method: "DELETE", // Set request method to DELETE
        });
        const data = await res.json(); // Parse response JSON
        if (!res.ok) throw new Error(data.error || "Something went wrong"); // Handle error response
        return data; // Return fetched data
      } catch (error) {
        throw new Error(error); // Handle fetch error
      }
    },
    onSuccess: () => {
      toast.success("Notifications deleted successfully"); // Show success toast message
      queryClient.invalidateQueries({ queryKey: ["notifications"] }); // Invalidate and refetch notifications query
    },
    onError: (error) => {
      toast.error(error.message); // Show error toast message
    },
  });

  // Function to handle deleting notifications
  const deleteNotifications = () => {
    deleteNotificationsMutation(); // Trigger mutation to delete notifications
  };

  return (
    <>
      {/* Main container with flex properties */}
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
        {/* Header section with title and settings dropdown */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <p className="font-bold">Notifications</p>

          {/* Dropdown menu for settings */}
          <div className="dropdown ">
            <div tabIndex={0} role="button" className="m-1">
              <IoSettingsOutline className="w-4" /> {/* Settings icon */}
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a onClick={deleteNotifications}>Delete all notifications</a>{" "}
                {/* Delete notifications option */}
              </li>
            </ul>
          </div>
        </div>

        {/* Show loading spinner while loading notifications */}
        {isLoading && (
          <div className="flex justify-center h-full items-center">
            <LoadingSpinner size="lg" /> {/* Loading spinner */}
          </div>
        )}

        {/* Show message when there are no notifications */}
        {notifications?.length === 0 && (
          <div className="text-center p-4 font-bold">No notifications 🤔</div>
        )}

        {/* Render notifications */}
        {notifications?.map((notification) => (
          <div className="border-b border-gray-700" key={notification._id}>
            <div className="flex gap-2 p-4">
              {/* Icon based on notification type */}
              {notification.type === "follow" && (
                <FaUser className="w-7 h-7 text-primary" />
              )}
              {notification.type === "like" && (
                <FaHeart className="w-7 h-7 text-red-500" />
              )}

              {/* Link to notification sender's profile */}
              <Link to={`/profile/${notification.from.username}`}>
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img
                      src={
                        notification.from.profileImg ||
                        "/avatar-placeholder.png"
                      } // Profile image or placeholder
                    />
                  </div>
                </div>

                {/* Notification message */}
                <div className="flex gap-1">
                  <span className="font-bold">
                    @{notification.from.username}
                  </span>{" "}
                  {notification.type === "follow"
                    ? "followed you"
                    : "liked your post"}
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

// Export the NotificationPage component
export default NotificationPage;
