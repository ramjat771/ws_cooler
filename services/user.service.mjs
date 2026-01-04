import * as userRepo from "../repositories/user.repo.mjs";

export const createUser = async (data) => {
  const existingUser = await userRepo.getUserByEmailRepo(data.email);

  if (existingUser) {
    // Email already exists → Check password
    if (existingUser.password === data.password) {
      return {
        login: true,
        message: "Login successful",
        user: existingUser,
      };
    }

    return {
      login: false,
      message: "Invalid password",
    };
  }

  // Email not found → create new
  const newUser = await userRepo.createUserRepo(data);

  return {
    login: false,
    created: true,
    message: "User created successfully",
    user: newUser,
  };
};
