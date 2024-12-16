import toast from "react-hot-toast";
export const parseError = (error) => {
    // Your error parsing logic here
    console.error(error);
    toast.error("An error occurred. Please try again.");
  };