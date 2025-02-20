export const formatPostDate = (createdAt) => {
    const currentDate = new Date(); // Get the current date and time
    const createdAtDate = new Date(createdAt); // Convert the createdAt string to a Date object

    // Calculate time differences in various units
    const timeDifferenceInSeconds = Math.floor((currentDate - createdAtDate) / 1000);
    const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);
    const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);
    const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24);

    // Return formatted date based on the time difference
    if (timeDifferenceInDays > 1) {
        // If the post is older than 1 day, return the date in "Month Day" format
        return createdAtDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } else if (timeDifferenceInDays === 1) {
        // If the post is exactly 1 day old, return "1d"
        return "1d";
    } else if (timeDifferenceInHours >= 1) {
        // If the post is at least 1 hour old, return the number of hours
        return `${timeDifferenceInHours}h`;
    } else if (timeDifferenceInMinutes >= 1) {
        // If the post is at least 1 minute old, return the number of minutes
        return `${timeDifferenceInMinutes}m`;
    } else {
        // If the post is less than a minute old, return "Just now"
        return "Just now";
    }
};

export const formatMemberSinceDate = (createdAt) => {
    const date = new Date(createdAt); // Convert the createdAt string to a Date object
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const month = months[date.getMonth()]; // Get the month name from the months array
    const year = date.getFullYear(); // Get the year from the Date object

    // Return the formatted membership date in "Joined Month Year" format
    return `Joined ${month} ${year}`;
};
