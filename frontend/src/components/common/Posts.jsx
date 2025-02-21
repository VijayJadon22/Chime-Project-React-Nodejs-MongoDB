import Post from "./Post"; // Import Post component
import PostSkeleton from "../skeletons/PostSkeleton"; // Import PostSkeleton component for loading state
import { useQuery } from "@tanstack/react-query"; // Import useQuery hook from @tanstack/react-query
import { useEffect } from "react"; // Import useEffect hook from React

const Posts = ({ feedType, username, userId }) => {
  // Function to determine the endpoint based on feed type
  const getPostEndpoint = () => {
    switch (feedType) {
      case "explore":
        return "/api/posts/all"; // Endpoint for explore feed

      case "following":
        return "/api/posts/following"; // Endpoint for following feed

      case "posts":
        return `/api/posts/user/${username}`;

      case "likes":
        return `/api/posts/likes/${userId}`;

      default:
        return "/api/posts/all"; // Default endpoint
    }
  };

  const POST_ENDPOINT = getPostEndpoint(); // Get the endpoint for posts

  // Query to fetch posts data
  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  // Refetch posts when feed type changes
  useEffect(() => {
    refetch();
  }, [feedType, refetch, username]);

  return (
    <>
      {/* Show skeletons while loading or refetching */}
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
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
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts; // Export the Posts component
