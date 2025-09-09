const UserService = require("../services/user.services");
const { HttpError } = require("../utils/error")

module.exports = class User {
  #userService;

  contructor() {
    this.#userService = new UserService();
  };

  async signUp(req, res) {
    const { firstName, lastName, email, password, role } = req.body;
    try {
      const user = await this.#userService.createUser({ firstName, lastName, email, password, role }, req.url);
      res.status(201).json({
        status: 201,
        message: "User successfully created",
        data: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      })
    } catch (e) {
      if (e instanceof HttpError) {
        return res.status(e.status_code).json({
          status: e.status_code,
          message: e.message,
        });
      } else {
        return res.status(500).json({
          status: 500,
          message: e.message || "Internal Server Error",
        });
      }
    }
  };

  async loginUser(req, res) {
    const { email, password } = req.body;
    try {
      const user = await this.#userService.getUserByEmail(email);
      if (!user) return res.status(404).json({
        status: 404,
        message: "User not found"
      })

      const isValid = await this.#userService.comparePassword(password, user.password);
      if (!isValid) return res.status(404).json({
        status: 404,
        message: "Wrong Email/Password Combination"
      })

      const token = this.#userService.createToken(user.id, user.email);
      res.status(200).json({
        status: 200,
        message: "Successful",
        data: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          token
        }
      })
    } catch (e) {
      if (e instanceof HttpError) {
        return res.status(e.status_code).json({
          status: e.status_code,
          message: e.message,
        });
      } else {
        return res.status(500).json({
          status: 500,
          message: e.message || "Internal Server Error",
        });
      }
    }
  }

  async getUserById(req, res) {
    const { id } = req.params;

    try {
      const user = await this.#userService.getUserById(id);
      if (!user)
        return res.status(404).json({
          status: 404,
          message: "User not found"
        })

      res.status(200).json({
        status: 200,
        message: "Successful",
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          profileName: user.profileName
        }
      })
    } catch (e) {
      if (e instanceof HttpError) {
        return res.status(e.status_code).json({
          status: e.status_code,
          message: e.message,
        });
      } else {
        return res.status(500).json({
          status: 500,
          message: e.message || "Internal Server Error",
        });
      }
    }
  };

  async getAllUsers(req, res) {
    try {
      const users = await this.#userService.getAllUsers()
      if (!users)
        return res.status(404).json({
          status: 404,
          message: "User not found"
        })
      const safeUsers = users.map(({ password, ...data }) => data);
      res.status(200).json({
        status: 200,
        message: "Successful",
        data: safeUsers,
      })
    } catch (e) {
      if (e instanceof HttpError) {
        return res.status(e.status_code).json({
          status: e.status_code,
          message: e.message,
        });
      } else {
        return res.status(500).json({
          status: 500,
          message: e.message || "Internal Server Error",
        });
      }
    }
  };

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { firstName, lastName, email, profileName } = req.body;

      const user = await this.#userService.updateUser(id, { firstName, lastName, email, profileName });
      res.status(200).send({
        status: 200,
        message: "Successful",
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          profileName: user.profileName,
        }
      })
    } catch (e) {
      if (e instanceof HttpError) return res.status(e.status_code).json({
        status: e.status_code,
        message: e.message
      })
      res.status(500).json({
        status: 500,
        message: e.message || "Internal Server Error",
      })
    }
  }

  async updateUserPassword(req, res) {
    try {
      const { id } = req.params;
      const { password } = req.body;

      await this.#userService.updateUserPassword(id, { password });
      res.status(200).send({
        status: 200,
        message: "Password updated successfully!"
      })
    } catch (e) {
      if (e instanceof HttpError) return res.status(e.status_code).json({
        status: e.status_code,
        message: e.message
      })
      res.status(500).json({
        status: 500,
        message: e.message || "Internal Server Error",
      })
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      await this.#userService.softDeleteUser(id);
      res.status(200).send({
        status: 200,
        message: "Successful",
        message: "User deleted successfully!"
      })
    } catch (e) {
      if (e instanceof HttpError) return res.status(e.status_code).json({
        status: e.status_code,
        message: e.message
      })
      res.status(500).json({
        status: 500,
        message: e.message || "Internal Server Error",
      })
    }
  }
};

