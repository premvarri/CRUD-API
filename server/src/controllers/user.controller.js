const httpStatus = require('http-status-codes').StatusCodes;
const { v4: uuidv4 } = require('uuid');
const db = require('../utils/db')

const getUsers = async (req, res) => {
  try {

    let getUserSQL = `SELECT * FROM USERS`

    db.db.all(getUserSQL, (err, result) => {
      if (err) {

        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: httpStatus.INTERNAL_SERVER_ERROR, msg: "error", error: err });

        console.error("Error inserting user", err);
      }
      else {

        console.log("%%%%%%%%%%%", result);
        result = result.map(val => ({
          Id: val.id,
          username: val.username,
          age: val.age,
          hobbies: JSON.parse(val.hobbies)
        }));

        console.log('users created');
        res.status(httpStatus.CREATED).send({ statusCode: httpStatus.OK, msg: "Users fetched Successfully", data: result });

      }

      db.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);

          throw err
        } else {
          console.log('Closed the SQLite database connection');
        }
      });
    });

  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: httpStatus.INTERNAL_SERVER_ERROR, msg: "Error closing database", error: error });
  }
}

const getUserById = async (req, res) => {
  try {
    const Id = req.params.userId

    console.log("$$$$$$$$$$$$$$", Id);

    let getUserSQL = `SELECT * FROM USERS WHERE Id = '${Id}'`

    db.db.get(getUserSQL, (err, result) => {

      console.log("%%%%%%%%%%%%%%%%",result);
      if (err) {

        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: httpStatus.INTERNAL_SERVER_ERROR, msg: "error", error: err });

        console.error("Error inserting user", err);
      }
      else {

        if (result) {
          const stringifiedHobbies = JSON.parse(result.hobbies);

          const finlresult = {
            ...result,
            hobbies: stringifiedHobbies
          };

          console.log('users created');
          res.status(httpStatus.OK).send({ statusCode: httpStatus.OK, msg: "User fetched Successfully", data: finlresult });
        }
        else {

          res.status(httpStatus.NOT_FOUND).send({ statusCode: httpStatus.NOT_FOUND, msg: "User Not Found" });

        }
      }

      db.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);

          throw err
        } else {
          console.log('Closed the SQLite database connection');
        }
      });
    });
  }

  catch (error) {
    console.log(`getUser ${req.params.userId} catch error`, error)
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: httpStatus.INTERNAL_SERVER_ERROR, msg: "error", error: error });
  }
}

const postUser = async (req, res) => {

  try {

    const { username, age, hobbies } = req.body;

    const hobbiesString = Array.isArray(hobbies) ? JSON.stringify(hobbies) : '';

    if (!username || !age) {
      return res.status(400).json({ message: 'Username and age are required fields' });
    }

    let uuid = uuidv4()
    let createUserSQL = `INSERT INTO users (id, username, age, hobbies) VALUES (?, ?, ?, ?)`

    const values = [uuid, username, age, hobbiesString];

    db.db.run(createUserSQL, values, (err, result) => {
      if (err) {

        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: httpStatus.INTERNAL_SERVER_ERROR, msg: "error", error: err });

        console.error("Error inserting user", err);
      }
      else {

        console.log('users created');
        res.status(httpStatus.CREATED).send({ statusCode: httpStatus.CREATED, msg: "User Inserted Successfully", data: result });

      }

      db.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);

          throw err
        } else {
          console.log('Closed the SQLite database connection');
        }
      });
    });

  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: httpStatus.INTERNAL_SERVER_ERROR, msg: "Error closing database", error: error });
  }



};

const updateUser = async (req, res) => {

  const { username, age, hobbies } = req.body;

  const userId = req.params.userId;
  const hobbiesString = Array.isArray(hobbies) ? JSON.stringify(hobbies) : '';


  let updateUserSQL = `Update USERS SET username = '${username}',age = '${age}', hobbies = '${hobbiesString}' WHERE Id = '${userId}'`

  db.db.run(updateUserSQL, (err, existingUser) => {
    if (err) {

      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: httpStatus.INTERNAL_SERVER_ERROR, msg: "error", error: err });

      console.error("Error inserting user", err);
    }
    else {

      if (this.changes === 0) {
        return res.status(httpStatus.NOT_FOUND).json({
          statusCode: httpStatus.NOT_FOUND,
          msg: "User not found"
        });
      }

      console.log('users created');
      res.status(httpStatus.CREATED).send({ statusCode: httpStatus.CREATED, msg: "User updated Successfully", data: existingUser });

    }

    db.db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);

        throw err
      } else {
        console.log('Closed the SQLite database connection');
      }
    });
  });

};

const deleteUser = async (req, res) => {

  const userId = req.params.userId;

  let deleteUserSQL = `DELETE FROM USERS WHERE Id = '${userId}'`

  db.db.run(deleteUserSQL, (err, result) => {
    if (err) {

      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: httpStatus.INTERNAL_SERVER_ERROR, msg: "error", error: err });

      console.error("Error Deleting user", err);
    }
    if (this.changes === 0) {
      res.status(httpStatus.NOT_FOUND).send({ statusCode: httpStatus.NOT_FOUND, msg: "User not found", data: result });

    }
    else {

      console.log('users deleted');
      res.status(httpStatus.NO_CONTENT).send({ statusCode: httpStatus.NO_CONTENT, msg: "User deleted Successfully", data: result });

    }

    db.db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);

        throw err
      } else {
        console.log('Closed the SQLite database connection');
      }
    });
  });

};


module.exports = {
  getUsers,
  getUserById,
  postUser,
  updateUser,
  deleteUser
}