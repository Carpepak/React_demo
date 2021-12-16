const db = require("../database");

// Select all profiles from the database.
exports.all = async (req, res) => {
  // Eager load the pets.
  const profiles = await db.profile.findAll();

  res.json(profiles);
};

// Select one profile from the database.
exports.one = async (req, res) => {
  if(!req.params.username || req.params.username==="undefined")
      res.json(false);
  let profile = await db.profile.findAll({where:{username: req.params.username}});

  if(profile.length === 0)
    profile = await db.profile.create({username: req.params.username});
  else
    profile = profile[0];

  res.json(profile);
};

exports.update = async (req, res) => {
  const profile = await db.profile.findByPk(req.body.username);
  
  profile.email = req.body.email;
  profile.first_name = req.body.first_name;
  profile.last_name = req.body.last_name;
  profile.mobile = req.body.mobile;
  profile.street = req.body.street;
  profile.city = req.body.city;
  profile.state = req.body.state;
  profile.postcode = req.body.postcode;

  await profile.save();

  res.json(profile);
};

exports.delete = async(req, res) => {
  const profile = await db.profile.findByPk(req.params.username);
  
  profile.first_name = "";
  profile.last_name = "";
  profile.mobile = "";
  profile.street = "";
  profile.city = "";
  profile.state = "";
  profile.postcode = "";
  profile.email = "";

  await profile.save();

  res.json(profile);
}
