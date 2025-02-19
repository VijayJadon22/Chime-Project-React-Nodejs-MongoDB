import { Link } from "react-router-dom"; // Importing the Link component from react-router-dom for navigation
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton"; // Importing the RightPanelSkeleton component for loading state
import { useQuery } from "@tanstack/react-query"; // Importing the useQuery hook from react-query for data fetching

const RightPanel = () => {
  // Using the useQuery hook to fetch suggested users data
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"], // Unique key for caching and refetching the query
    queryFn: async () => {
      try {
        // Fetching suggested users from the API
        const res = await fetch("/api/users/suggested");
        const data = await res.json();
        // Throwing an error if the response is not ok
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error); // Handling any errors that occur during the fetch
      }
    },
  });

  // Returning an empty div if there are no suggested users
  if (suggestedUsers?.length === 0) return <div className="md:w-64 w-0"></div>;

  return (
    <div className="hidden lg:block my-4 mx-2">
      {/* Container for the "Who to follow" panel */}
      <div className="bg-[#1f3b75] p-4 rounded-md sticky top-2">
        <p className="font-bold">Who to follow</p>
        <div className="flex flex-col gap-4">
          {/* Rendering the RightPanelSkeleton components while data is loading */}
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {/* Mapping over suggested users and rendering each user as a link */}
          {!isLoading &&
            suggestedUsers?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4"
                key={user._id} // Using user ID as the key
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      {/* User's profile image or a placeholder image */}
                      <img src={user.profileImg || "/avatar-placeholder.png"} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">
                      {/* User's full name */}
                      {user.fullName}
                    </span>
                    <span className="text-sm text-slate-500">
                      {/* User's username */}@{user.username}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    className="btn bg-fuchsia-200 text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                    onClick={(e) => e.preventDefault()} // Preventing the button's default action
                  >
                    Follow
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RightPanel; // Exporting the RightPanel component
