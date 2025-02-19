import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Component for creating a post
const CreatePost = () => {
  // State for storing the text and image
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  // Reference to the file input for selecting images
  const imgRef = useRef(null);

  // Fetch authenticated user data
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  // Get the query client instance
  const queryClient = useQueryClient();

  // Mutation for creating a post
  const {
    mutate: createPostMutation,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ text, img }) => {
      try {
        // Send a POST request to create a new post
        const res = await fetch("/api/posts/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, img }),
        });

        // Parse the JSON response
        const data = await res.json();

        // Throw an error if the response is not ok
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      // Reset the text and image states
      setText("");
      setImg(null);

      // Show a success toast notification
      toast.success("Post created successfully");

      // Invalidate the "posts" query to refetch the updated posts data
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // Handle form submission to create a new post
  const handleSubmit = (e) => {
    e.preventDefault();
    createPostMutation({ text, img });
  };

  // Handle image file change
  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      {/* Display authenticated user's profile image */}
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={authUser?.profileImg || "/avatar-placeholder.png"} />
        </div>
      </div>

      {/* Form for creating a new post */}
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        {/* Textarea for entering the post text */}
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800"
          placeholder="What is happening?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Display the selected image if there is one */}
        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
            />
            <img
              src={img}
              className="w-full mx-auto h-72 object-contain rounded"
            />
          </div>
        )}

        {/* Footer with icons for adding images and emojis, and submit button */}
        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
          </div>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />
          <button className="btn btn-primary rounded-full btn-sm text-white px-4">
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>

        {/* Display error message if there is an error */}
        {isError && <div className="text-red-500">{error.message}</div>}
      </form>
    </div>
  );
};

export default CreatePost;
