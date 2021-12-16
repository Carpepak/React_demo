const db = require("../database");

//find all data row of post
exports.all = async(req, res) => {
    const posts = await db.post.findAll();

    res.json(posts);
};

exports.one = async(req, res) => {
    const post = await db.post.findByPk(req.params.post_id)
    res.json(post);
}

exports.self = async(req, res) => {
    const posts = await db.post.findAll({where: 
        {
            username: req.params.username,
            reply: -1,
            deleted: false
        }
    })

    res.json(posts);
}
//create post obj into db
exports.create = async(req, res) => {
    let reply = -1;
    if(req.body.reply)
        reply = req.body.reply;
    const post = await db.post.create({
        text: req.body.text,
        username: req.body.username,
        reply: reply,
        imgUrl: req.body.imgUrl,
        deleted: false
    });

    res.json(post);
};

exports.update = async(req, res) => {
    const post = await db.post.findByPk(req.body.post_id);
    post.text = req.body.text,
    post.imgUrl= req.body.imgUrl
    await post.save();

    res.json(post);
};