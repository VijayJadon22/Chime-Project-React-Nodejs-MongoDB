import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdateUserProfile = () => {
  // Initialize the query client for managing query caching and invalidation
  const queryClient = useQueryClient();

  // Use the useMutation hook to create a mutation for updating the user profile
  const { mutateAsync: updateProfileMutation, isPending: isUpdatingProfile } =
    useMutation({
      // Define the mutation function for updating the user profile
      mutationFn: async (formData) => {
        try {
          // Make a POST request to the server with the updated profile data
          const res = await fetch("/api/users/update", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });

          // Parse the JSON response from the server
          const data = await res.json();

          // Throw an error if the response is not OK
          if (!res.ok) throw new Error(data.error || "Something went wrong");

          // Return the parsed data
          return data;
        } catch (error) {
          // Throw the error if the request fails
          throw new Error(error);
        }
      },
      // Define the onSuccess callback to be executed when the mutation succeeds
      onSuccess: () => {
        // Show a success toast notification
        toast.success("Profile updated successfully");

        // Invalidate the queries to refresh the data for the updated user profile and authenticated user
        Promise.all([
          queryClient.invalidateQueries({ queryKey: ["authUser"] }),
          queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
        ]);
      },
      // Define the onError callback to be executed when the mutation fails
      onError: (error) => {
        // Show an error toast notification with the error message
        toast.error(error.message);
      },
    });

  // Return the mutation function and the mutation status
  return { updateProfileMutation, isUpdatingProfile };
};

export default useUpdateUserProfile;
