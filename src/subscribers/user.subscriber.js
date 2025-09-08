const { EventSubscriber } = require("typeorm")
const { isEmail } = require("class-validator");
const bcrypt = require("bcryptjs");
const decorateClass = require("../utils/decorateClass");
const { generateRandomString, urlParser, validateCompanyEmail } = require("../utils/index");

class UserSubscriber {

  listenTo() {
    return "User";
  }

  async beforeInsert({ entity }) {
    const str = generateRandomString(10);
    entity.email = entity.email.toLowerCase();
    if (entity && !entity.profileName) {
      entity.profileName = entity.firstName + str;
    }
    if (entity) {
      entity.password = await this.#hashPassword(entity.password);
      entity.email = this.#validateEmail(entity.email);
    }
  }

  async beforeUpdate({ entity }) {
    if (entity.url) {
      const [url, profileName] = urlParser(entity.url);
      entity.url = `${url}/${entity.profileName}`;
    }
    if (entity) {
      entity.password = await this.#hashPassword(entity.password);
    }
  }

  async #hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  #validateEmail(email) {
    if (!isEmail(email)) throw new Error("Invalid Email format")

    if (!validateCompanyEmail(email)) throw new Error("Invalid Email. Use Company Assigned Email");
    return email;
  }
}

module.exports = decorateClass(EventSubscriber(), UserSubscriber);