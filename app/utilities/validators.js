
export const validateField = (name, value) => {
  let message = "";

  switch (name) {
    case "fullName":
      if (!value.trim()) message = "Full Name is required";
      else if (value.trim().length < 3)
        message = "Full Name must be at least 3 characters long";
      break;

    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) message = "Email is required";
      else if (!emailRegex.test(value)) message = "Invalid email format";
      break;

    case "password":
      if (!value.trim()) message = "Password is required";
      else if (value.trim().length < 6)
        message = "Password must be at least 6 characters long";
      break;

    default:
      break;
  }

  return message;
};
