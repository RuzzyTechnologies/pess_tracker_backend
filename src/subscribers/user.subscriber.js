const { EventSubscriber } = require("typeorm")
const decorateClass = require("../utils/decorateClass");
const { generateRandomString } = require("../utils/");


class UserSubscriber {

  listenTo() {
    return "User";
  }

  beforeInsert({ entity }) {
    const str = generateRandomString(10);
    entity.email = entity.email.toLowerCase();
    if (entity && !entity.profileName) {
      entity.profileName = entity.firstName + str;
    }
  }

  beforeUpdate({ entity }) {
    if (entity.url) {
      const [url, profileName] = entity.url.slice("/");
      entity.url = `${url}/${entity.profileName}`;
    }
  }
}

module.exports = decorateClass(EventSubscriber(), UserSubscriber);