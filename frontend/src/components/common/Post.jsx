import { FaRegComment } from "react-icons/fa"; // Import comment icon from react-icons
import { BiRepost } from "react-icons/bi"; // Import repost icon from react-icons
import { FaRegHeart } from "react-icons/fa"; // Import heart (like) icon from react-icons
import { FaRegBookmark } from "react-icons/fa6"; // Import bookmark icon from react-icons
import { FaTrash } from "react-icons/fa"; // Import trash (delete) icon from react-icons
import { useState } from "react"; // Import useState hook from React
import { Link } from "react-router-dom"; // Import Link component from react-router-dom for navigation
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; // Import useMutation and useQuery hooks from @tanstack/react-query
import toast from "react-hot-toast"; // Import toast for displaying notifications
import LoadingSpinner from "./LoadingSpinner"; // Import LoadingSpinner component
import { formatPostDate } from "../../utils/date";

// Post component definition
const Post = ({ post }) => {
  const [comment, setComment] = useState(""); // State for storing the comment input
  const { data: authUser } = useQuery({ queryKey: ["authUser"] }); // Query to get authenticated user data

  const queryClient = useQueryClient(); // Initialize query client

  const postOwner = post.user; // Owner of the post
  const isLiked = post.likes.includes(authUser._id); // Check if the authenticated user has liked the post
  const isMyPost = authUser._id === post.user._id; // Check if the post belongs to the authenticated user
  const formattedDate = formatPostDate(post.createdAt); // Format the post creation date using the formatPostDate function

  // Define the mutation for deleting a post
  const { mutate: deletePostMutation, isPending: isDeleting } = useMutation({
    // Function to execute when the mutation is called
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/${post._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Post deleted successfully"); // Display success notification
      // Invalidate the query and fetch posts again
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // Define the mutation for liking a post
  const { mutate: likePostMutation, isPending: isLiking } = useMutation({
    // Function to execute when the mutation is called
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/like/${post._id}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (updatedLikes) => {
      // queryClient.invalidateQueries({ queryKey: ["posts"] });
      //not gonna invalidate query like above as it is gonna refetch all the posts that will be a bad user experince

      //instead, we are gonna directly update the cache of the post
      queryClient.setQueryData(["posts"], (oldData) => {
        return oldData.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: updatedLikes }; // Update the likes array of the post
          }
          return p;
        });
      });
    },
    onError: (error) => {
      toast.error(error.message); // Display error notification
    },
  });

  const { mutate: commentPostMutation, isPending: isCommenting } = useMutation({
    // Define the mutation function for posting a comment
    mutationFn: async () => {
      try {
        // Send a POST request to the server to add a new comment
        const res = await fetch(`/api/posts/comment/${post._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: comment }),
        });

        // Parse the response JSON
        const data = await res.json();
        // Throw an error if the response is not OK
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        // Catch and rethrow any error that occurs during the request
        throw new Error(error);
      }
    },
    // Define the onSuccess callback function
    onSuccess: () => {
      // Display a success toast message
      toast.success("Comment posted successfully");
      // Clear the comment input
      setComment("");
      // Invalidate the queries to refetch the updated data
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    // Define the onError callback function
    onError: (error) => {
      // Display an error toast message
      toast.error(error.message);
    },
  });

  // Handle delete post
  const handleDeletePost = () => {
    deletePostMutation(); // Call the mutation to delete the post
  };

  // Handle post comment
  const handlePostComment = (e) => {
    e.preventDefault(); // Prevent default form submission as the comment section is a form
    if (isCommenting) return;
    commentPostMutation();
  };

  // Handle like post
  const handleLikePost = () => {
    if (isLiking) return;
    likePostMutation(); // Call the mutation to like the post
  };

  return (
    <>
      <div className="flex gap-2 items-start p-4 border-b border-gray-700">
        <div className="avatar">
          <Link
            to={`/profile/${postOwner.username}`}
            className="w-8 rounded-full overflow-hidden"
          >
            <img src={postOwner.profileImg || "/avatar-placeholder.png"} />
          </Link>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-2 items-center">
            <Link to={`/profile/${postOwner.username}`} className="font-bold">
              {postOwner.fullName}
            </Link>
            <span className="text-gray-700 flex gap-1 text-sm">
              <Link to={`/profile/${postOwner.username}`}>
                @{postOwner.username}
              </Link>
              <span>·</span>
              <span>{formattedDate}</span>
            </span>
            {isMyPost && (
              <span className="flex justify-end flex-1">
                {!isDeleting && (
                  <FaTrash
                    className="cursor-pointer hover:text-red-500"
                    onClick={handleDeletePost}
                  />
                )}
                {isDeleting && <LoadingSpinner size="sm" />}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3 overflow-hidden">
            <span>{post.text}</span>
            {post.img && (
              <img
                src={post.img}
                className="h-80 object-contain rounded-lg border border-gray-700"
                alt=""
              />
            )}
          </div>
          <div className="flex justify-between mt-3">
            <div className="flex gap-4 items-center w-2/3 justify-between">
              <div
                className="flex gap-1 items-center cursor-pointer group"
                onClick={() =>
                  document
                    .getElementById("comments_modal" + post._id)
                    .showModal()
                }
              >
                <FaRegComment className="w-4 h-4 text-slate-500 group-hover:text-sky-400" />
                <span className="text-sm text-slate-500 group-hover:text-sky-400">
                  {post.comments.length}
                </span>
              </div>
              {/* We're using Modal Component from DaisyUI */}
              <dialog
                id={`comments_modal${post._id}`}
                className="modal border-none outline-none"
              >
                <div className="modal-box rounded border border-gray-600">
                  <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                  <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                    {post.comments.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No comments yet 🤔 Be the first one 😉
                      </p>
                    )}
                    {post.comments.map((comment) => (
                      <div key={comment._id} className="flex gap-2 items-start">
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            <img
                              src={
                                comment.user.profileImg ||
                                "/avatar-placeholder.png"
                              }
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="font-bold">
                              {comment.user.fullName}
                            </span>
                            <span className="text-gray-700 text-sm">
                              @{comment.user.username}
                            </span>
                          </div>
                          <div className="text-sm">{comment.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form
                    className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
                    onSubmit={handlePostComment}
                  >
                    <textarea
                      className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none border-gray-800"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button className="btn btn-primary rounded-full btn-sm text-white px-4">
                      {isCommenting ? <LoadingSpinner size="md" /> : "Post"}
                    </button>
                  </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button className="outline-none">close</button>
                </form>
              </dialog>
              <div className="flex gap-1 items-center group cursor-pointer">
                <BiRepost className="w-6 h-6 text-slate-500 group-hover:text-green-500" />
                <span className="text-sm text-slate-500 group-hover:text-green-500">
                  0
                </span>
              </div>
              <div
                className="flex gap-1 items-center group cursor-pointer"
                onClick={handleLikePost}
              >
                {isLiking && <LoadingSpinner size="sm" />}
                {!isLiked && !isLiking && (
                  <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500" />
                )}

                {isLiked && !isLiking && (
                  <FaRegHeart className="w-4 h-4 cursor-pointer text-pink-500" />
                )}

                <span
                  className={`text-sm  group-hover:text-pink-500 ${
                    isLiked ? "text-pink-500" : "text-slate-500"
                  }`}
                >
                  {post.likes.length}
                </span>
              </div>
            </div>
            <div className="flex w-1/3 justify-end gap-2 items-center">
              <FaRegBookmark className="w-4 h-4 text-slate-500 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post; // Export the Post component
