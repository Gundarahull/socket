const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { Sequelize, DataTypes, where, UUIDV4 } = require("sequelize");

const connectDB = new Sequelize("testing", "postgres", "Aariya@1105", {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
});

connectDB
  .authenticate()
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("Error=====", err);
  });

const User = connectDB.define(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  { timestamps: true, tableName: "users" }
);

connectDB
  .sync({ alter: false })
  .then(() => {
    console.log("Modified");
  })
  .catch((err) => {
    console.log("error-------", err);
  });

app.post("/post", async (req, res) => {
  try {
    const updatedName = await bcryptjs.hash(req.body.name, 10);
    console.log("updatedname----", updatedName);
    console.log("normal name-----", req.body.name);

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
    });

    const forToken = {
      id: 2,
      role: "Admin",
      name: "rahul",
    };

    const token = await jwt.sign(forToken, "SecretKEy1234", {
      expiresIn: "1d",
    });
    console.log("token------", token);

    return res.status(200).json({
      message: "Created Succesfully!",
      data: user,
      token,
    });
  } catch (error) {
    console.log("whats the roor----", error);
  }
});

app.use((req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log("token----- from middleware-", token);
  const decoded = jwt.verify(token, "SecretKEy1234");
  console.log("decoded from middleware----", decoded);
  req.user = decoded;
  if (decoded.id === 1) {
    next();
  } else {
    return res.status(403).json({
      message: "UnAuthenticated",
    });
  }
});

app.get("/get", async (req, res) => {
  console.log("authenticated one---", req.user);

  const user = await User.findAll();
  return res.status(200).json({
    message: "ALL Succesfully!",
    data: user,
  });
});

app.get("/get/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  return res.status(200).json({
    message: "One Succesfully!",
    data: user,
  });
});

app.patch("/patch", async (req, res) => {
  const user = await User.update(
    {
      name: req.body.name,
    },
    {
      where: {
        id: req.body.id,
      },
      returning: true,
    }
  );
  return res.status(200).json({
    message: "update Succesfully!",
    data: user,
  });
});

app.delete("/del", async (req, res) => {
  const user = await User.destroy({
    where: {
      id: req.body.id,
    },
  });
  return res.status(200).json({
    message: "delete Succesfully!",
    data: user,
  });
});

app.listen(9000, () => {
  console.log("Server Strarted");
});
