pass = process.env.DB_PASS;
proj = process.env.DB_PROJ;
name = process.env.DB_NAME;
DB_URI = `mongodb+srv://AT:${pass}@${proj}.vryil.mongodb.net/${name}?retryWrites=true&w=majority`;

module.exports = {
    mongoURI: DB_URI,
};