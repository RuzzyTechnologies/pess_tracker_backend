const { isURL } = require('class-validator');
const bcrypt = require("bcryptjs");

const AppDataSource = require("../data-source");
const { ResourceNotFound } = require("../utils/error");
const userRole = require("../enums/userRole")

module.exports = class UserService {

  async #userRepository() {
    const appDataSource = await AppDataSource;
    return appDataSource.getRepository("User");
  }

  async #validateProfileUrl(url) {
    if (!isURL(url)) throw new Error("Invalid URL format");
    return url;
  }

  async createUser(firstName, lastName, email, password, url, role) {
    try {
      const user = this.#userRepository.findOneBy({ email });
      if (user) {
        throw new Error("Email already exists. Please use a new one.")
      }

      const newUser = await this.#userRepository.create({
        firstName,
        lastName,
        email,
        password,
        url: this.#validateProfileUrl(`${url}/${firstName}`),
        role,
      });

      await this.#userRepository.save(user);
      return newUser;
    } catch (e) {
      throw new Error("Error creating user", e);
    }
  }

  async getUserById(id) {
    try {
      const user = await this.#userRepository.findOneBy({ where: { id } });
      if (!user) {
        throw new ResourceNotFound("User not found!")
      }
      return user;
    } catch (e) {
      throw new Error("Error finding user", e)
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await this.#userRepository.findOneBy({ where: { email } });
      if (!user) {
        throw new ResourceNotFound("User not found!")
      }
      return user;
    } catch (e) {
      throw new Error("Error finding user", e)
    }
  }

  async getAllUsers() {
    try {
      const users = await this.#userRepository.find({});
      if (!users) {
        throw new ResourceNotFound("Unable to find users!");
      }
      return users;
    } catch (e) {
      throw new Error("Error finding users", e)
    }
  }

  async softDeleteUser(id) {
    try {
      const user = await this.#userRepository.findOneBy({ where: { id } });
      if (!user) {
        throw new ResourceNotFound("User not found!")
      }
      user.is_deleted = true;
      await this.#userRepository.save(user);
      const deletedUser = await this.#userRepository.softDelete({ id });
      return deletedUser;
    } catch (e) {
      throw new Error("Error deleting user", e)
    }
  }

  async updateUser(id, payload) {
    try {

      const updates = Object.keys(payload);
      const allowedUpdates = ["firstName", "lastName", "email", "profileName"];
      const isValidOperation = updates.every(update => allowedUpdates.includes(update));

      if (!isValidOperation) {
        throw new Error("Invalid Updates");
      }

      const { firstName, lastName, email, profileName } = payload;

      const user = await this.#userRepository.findOneBy({ where: { id } });
      if (!user) {
        throw new ResourceNotFound("User not found");
      }

      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.profileName = profileName;

      await this.#userRepository.save(user);
      return user;
    } catch (e) {
      throw new Error('Error updating user', e);
    }

  }


  async updatePassword(id, payload) {
    try {
      const user = await this.#userRepository.findOneBy({ where: { id } });
      if (!user) {
        throw new ResourceNotFound("User not found!")
      }

      const { password } = payload;

      user.passsword = password;
      await this.#userRepository.save(user);
      return user;


    } catch (e) {
      throw new Error("Error finding user", e)
    }
  }

  async uploadAvatar(id, file) {

  }

  async updateAvatar(id) {

  }

  async comparePassword(newPassword, hashedPassword) {
    return bcrypt.compare(newPassword, hashedPassword);
  }

  createToken(id, email) {
    const token = jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: "10h" })
    return token;
  };


};