import { getAllUserService } from "../services/user.services";

export const userResolvers = {
  Query: {
    getAllUsers: async () => {
      //obtener todos los usuarios
      const users = await getAllUserService();
      return users;
    }
  }
};
