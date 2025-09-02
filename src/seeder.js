const AppDataSource = require("./data-source");
const log = require("./utils/logger");


const createUsers = async () => {

  const appDataSource = await AppDataSource;
  const userRepository = appDataSource.getRepository("User");

  try {
    log.info("Creating user1...");
    const user1 = userRepository.create({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password",
    });

    await userRepository.save(user1);

    const user2 = userRepository.create({
      firstName: "Jane",
      lastName: "Doe",
      email: "janedoe@example.com",
      password: "password",
    })
    await userRepository.save(user2);

    log.info("User2 created: ", user2);

    log.info("Saving users...");
    log.info("Users created successfully!");


    log.info("Seeding completed successfully!");
    // return [user1, user2];
  } catch (e) {
    log.error("Error creating users", e.message);
    throw e;
  }
}

createUsers();