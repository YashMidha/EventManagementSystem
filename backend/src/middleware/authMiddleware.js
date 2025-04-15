const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.json({ message: 'Unauthorized' });
};

export default ensureAuthenticated;
