export const validateTicketInput = (title, description) => {
  if (!title || !description)
    return "Title and description are required";

  if (title.length < 5 || title.length > 100)
    return "Title must be 5–100 characters";

  if (description.length < 15 || description.length > 1000)
    return "Description must be meaningful (15–1000 chars)";

  // detect keyboard spam like: aaaaaa, dddddd
  const spamRegex = /(.)\1{4,}/;
  if (spamRegex.test(title) || spamRegex.test(description))
    return "Spam-like input detected";

  return null;
};
