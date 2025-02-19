import { useMutation, useQueryClient } from "@tanstack/react-query"; // Importing necessary hooks from react-query
import toast from "react-hot-toast"; // Importing toast for displaying error messages

const useFollow = () => {
  const queryClient = useQueryClient(); // Getting the query client to interact with the query cache

  const { mutate: followMutation, isPending } = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await fetch(`/api/users/follow/${userId}`, {
          method: "POST",
        }); // Sending a POST request to follow a user with the given userId
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data; // Returning the response data if the request is successful
      } catch (error) {
        throw new Error(error.message); // Throwing an error if the request fails
      }
    },
    onSuccess: () => {
      // Invalidate the suggestedUsers and authUser queries to refresh the data
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
      ]);
      /* 
       Promise.all is used here to invalidate multiple queries concurrently.
       It takes an array of promises and returns a single promise that resolves 
       when all of the input promises have resolved. This ensures that both the 
       suggestedUsers and authUser queries are invalidated at the same time, 
       causing the cache to be refreshed with the latest data.
      */
    },
    onError: (error) => {
      toast.error(error.message); // Displaying an error message using toast
    },
  });

  return { followMutation, isPending }; // Returning the mutation function and its pending state
};

export default useFollow; // Exporting the useFollow hook
