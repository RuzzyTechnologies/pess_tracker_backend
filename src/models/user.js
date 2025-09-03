const { EntitySchema } = require("typeorm");
const UserRole = require("../enums/userRole");

const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid"
    },
    firstName: {
      type: "varchar",
      nullable: false,
    },
    lastName: {
      type: "varchar",
      nullable: false,
    },
    profileName: {
      type: "varchar",
      unique: true,
      nullable: true,
    },
    email: {
      type: "varchar",
      nullable: false,
      unique: true
    },
    password: {
      type: "varchar",
      nullable: false
    },
    avatar: {
      type: "varchar",
      nullable: true,
    },
    url: {
      type: "varchar",
      nullable: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    role: {
      type: "enum",
      enum: UserRole,
      default: UserRole.USER
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
  },
})

module.exports = User;