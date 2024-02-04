/* eslint-disable max-len */
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const { randomBytes, scryptSync, timingSafeEqual } = require('crypto');
const Models = require('../../models');

function SaltAndHash(password) {
  const salt = randomBytes(16).toString('hex');
  const hashedPassword = scryptSync(password, salt, 64).toString('hex');
  return { hashedPassword, salt };
}

function VerifyPassword(password, hash, salt) {
  const testHash = scryptSync(password, salt, 64);
  const realHash = Buffer.from(hash, 'hex');
  const auth = timingSafeEqual(testHash, realHash);
  return auth;
}

class Controller {
  async register(req, res) {
    const data = req.body;
    const schema = joi.object().keys({
      email: joi.string().email().required(),
      username: joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
      firstname: joi.string().required(),
      lastname: joi.string().required(),
      password: joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/).required(),
    });

    // const id = Math.ceil(Math.random() * 9999999);

    try {
      await schema.validateAsync(data);
    } catch (err) {
      res.status(400).json(
        { ...err.details }[0].message.split('"').join(''),
      );
    }

    try {
      const HashResult = SaltAndHash(data.password);

      const registeredUser = await Models.User.create({ ...data, hash: HashResult.hashedPassword, salt: HashResult.salt });

      const Token = jwt.sign(registeredUser.dataValues.id, process.env.SECRET_JWT, {
        expiresIn: '5 days',
      });

      res.status(201).json({
        status: 'success',
        message: 'resource created',
        data: { id: registeredUser.dataValues.id, ...data },
        auth: true,
        token: Token,
      });
    } catch (err) {
      res.status(500).json({
        ...err,
      });
    }
  }

  async login(req, res) {
    const data = req.body;
    const schema = joi.object().keys({
      username: joi.string()
        .alphanum()
        .min(3)
        .max(30),
      email: joi.string().email(),
      password: joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/).required(),
    }).xor('username', 'email');

    try {
      await schema.validateAsync(data);
    } catch (err) {
      res.status(400).json(
        { ...err.details }[0].message.split('"').join(''),
      );
    }

    try {
      let user;
      if (!data.username) {
        user = await Models.User.findOne({ where: { email: data.email } });
      } else {
        user = await Models.User.findOne({ where: { username: data.username } });
      }
      const authenticated = VerifyPassword(data.password, user.dataValues.hash, user.dataValues.salt);
      if (authenticated) {
        const Token = jwt.sign({ id: user.dataValues.id }, process.env.SECRET_JWT, {
          expiresIn: '5 days',
        });

        res.status(201).json({
          status: 'success',
          message: 'login successful',
          data: { id: user.dataValues.id },
          auth: true,
          token: Token,
        });
      } else {
        res.status(400).json({
          status: 'error',
          message: 'incorrect password',
          auth: false,
        });
      }
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: 'Cannot find user',
        auth: false,
      });
    }
  }

  logout(req, res) {
    res.json({
      auth: false,
      token: null,
    });
  }

  getCourses(req, res) {
    res.status(200).json({
      courses: ['foo', 'bar'],
    });
  }
}
module.exports = Controller;