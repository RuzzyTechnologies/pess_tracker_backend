const { isEmail, isURL } = require('class-validator');

const AppDataSource = require("../data-source");
const { ResourceNotFound } = require("../utils/error");

module.exports = class UserService {


  async _userRepository() {
    const appDataSource = await AppDataSource;
    return appDataSource.getRepository("User");
  }

  async validateEmail(email) {
    if (!isEmail(email)) throw new Error("Invalid Email format")
    return email.toLowerCase();
  }

  async validateProfileUrl(url) {
    if (!isURL(url)) throw new Error("Invalid URL format");
    return url;
  }

  async createUser(firstName, lastName, email, password, url) {
    try {
      const user = await this._userRepository.create({
        firstName,
        lastName,
        email: this.validateEmail(email),
        password,
        url: this.validateProfileUrl(`${url}/${firstName}`)
      });

      this._userRepository.save(user);
    } catch (e) {
      throw new Error("Error creating user", e);
    }
  }

  async getUserById(id) {
    try {
      const user = await this._userRepository.findOneBy({ where: { id } });
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
      const user = await this._userRepository.findOneBy({ where: { email } });
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
      const users = await this._userRepository.find({});
      if (!users) {
        throw new ResourceNotFound("Unable to find users!");
      }
    } catch (e) {
      throw new Error("Error finding users", e)
    }
  }

  async softDeleteUser(id) {
    try {
      const user = await this._userRepository.findOneBy({ where: { id } });
      if (!user) {
        throw new ResourceNotFound("User not found!")
      }
      user.is_userRepositorye;
      await this._userRepository.save(user);
      const deletedUser = await this._userRepository.softDelete({ id });
      return deletedUser;
    } catch (e) {
      throw new Error("Error deleting user", e)
    }
  }

  async updateUser(id) {
    //  update fields like firstname, lastname, email
  }

  async updateProfileName(id, url) {
    // update fields profileName and profileURL.
  }

  async updatePassword(id, newPassword) {
    try {
      const user = await this._getRepository.findOneBy({ where: { id } });
      if (!user) {
        throw new ResourceNotFound("User not found!")
      }

      //  hash new password

      // set user password to new password.

      // return done


    } catch (e) {
      throw new Error("Error finding user", e)
    }
  }

  async comparePassword(password, hashedPassword) {
    // do this in the user model or sumn. 
  }



};