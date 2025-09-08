import UserService from "../services/user.services";

export class User {
  #userService;

  contructor() {
    this.#userService = new UserService();
  };

  async signUp(req, res) {
    const { firstName, lastName, email, password, role } = req.body;
    try {
      const user = await this.#userService.createUser(firstName, lastName, email, password, req.url, role);
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

  // find specific user
  async getUser(req, res) {
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

  // get all users
  async getAllUsers(req, res) {
    try {
      const users = await this.#userService.getAllUsers()
      const safeUsers = users.map(({ password, ...data }) => data);
      if (!users)
        return res.status(404).json({
          status: 404,
          message: "User not found"
        })

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


  // delete user

  async deleteUser(req, res) {

  }
};