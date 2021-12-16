const db = require("../database");
const argon2 = require("argon2");

// Select all users from the database.
exports.all = async (req, res) => {
    const users = await db.user.findAll();

    res.json(users);
};

// Select one user from the database.
exports.one = async (req, res) => {
    const user = await db.user.findByPk(req.params.id);

    res.json(user);
};

// Select one user from the database if username and password are a match.
exports.login = async (req, res) => {
    const user = await db.user.findByPk(req.query.username);

    if (user === null || await argon2.verify(user.password_hash, req.query.password) === false || user.blocked === true)
        // Login failed.
        res.json(null);
    else
        res.json(user);
};

// Create a user in the database.
exports.create = async (req, res) => {
    const hash = await argon2.hash(req.body.password, {
        type: argon2.argon2id
    });

    const user = await db.user.create({
        username: req.body.username,
        password_hash: hash,
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        blocked: false
    });

    const profile = await db.profile.create({
        username: req.body.username,
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        email: req.body.email
    });

    res.json(user);
};

exports.in = async (req, res) => {
    const user = await db.user.findByPk(req.params.username);

    if (!user)
        return false;

    user.login_time = new Date();
    await user.save();

    res.json(user);
}

exports.out = async (req, res) => {
    const user = await db.user.findByPk(req.params.username);

    if (user === null)
        return false;

    user.logout_time = new Date();
    await user.save();
    let time = await db.time.findAll({
        where: {
            username: req.params.username,
            date: new Date().toLocaleDateString().replace(/\//g, "-")
        }
    });

    time = time[0];
    if (time) {
        time.time += (new Date() - user.login_time);
        await time.save();
    } else
        time = await db.time.create({
            date: new Date().toLocaleDateString().replace(/\//g, "-"),
            username: req.params.username,
            time: (new Date() - user.login_time)
        })

    res.json(user);
}