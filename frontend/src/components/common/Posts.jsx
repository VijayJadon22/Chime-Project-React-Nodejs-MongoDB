// Import necessary components and libraries
import Post from "./Post"; // Import Post component for displaying individual posts
import PostSkeleton from "../skeletons/PostSkeleton"; // Import PostSkeleton component for loading state
import { useQuery } from "@tanstack/react-query"; // Import useQuery hook from @tanstack/react-query
import { useEffect } from "react"; // Import useEffect hook from React

// Define the Posts component
const Posts = ({ feedType, username, userId }) => {
  // Function to determine the endpoint based on feed type
  const getPostEndpoint = () => {
    switch (feedType) {
      case "explore":
        return "/api/posts/all"; // Endpoint for explore feed

      case "following":
        return "/api/posts/following"; // Endpoint for following feed

      case "posts":
        return `/api/posts/user/${username}`; // Endpoint for user's posts

      case "likes":
        return `/api/posts/likes/${userId}`; // Endpoint for user's liked posts

      default:
        return "/api/posts/all"; // Default endpoint for posts
    }
  };

  const POST_ENDPOINT = getPostEndpoint(); // Get the endpoint for posts

  // Query to fetch posts data
  const {
    data: posts, // Store fetched posts data
    isLoading, // Loading state
    refetch, // Function to refetch posts data
    isRefetching, // Refetching state
  } = useQuery({
    queryKey: ["posts"], // Define the query key
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT); // Fetch posts data from API
        const data = await res.json(); // Parse response JSON
        if (!res.ok) throw new Error(data.error || "Something went wrong"); // Handle error response
        return data; // Return fetched data
      } catch (error) {
        throw new Error(error); // Handle fetch error
      }
    },
  });

  // Refetch posts when feed type changes
  useEffect(() => {
    refetch(); // Refetch posts data
  }, [feedType, refetch, username]); // Dependency array for useEffect

  return (
    <>
      {/* Show skeletons while loading or refetching */}
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton /> {/* Skeleton for loading state */}
          <PostSkeleton /> {/* Skeleton for loading state */}
          <PostSkeleton /> {/* Skeleton for loading state */}
        </div>
      )}
      {/* Show message if no posts are found */}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {/* Show posts if data is available */}
      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} /> // Render individual posts
          ))}
        </div>
      )}
    </>
  );
};

// Export the Posts component
export default Posts; // Export the Posts component
