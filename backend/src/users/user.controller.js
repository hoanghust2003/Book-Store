const UserModel = require('./user.model');

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id).select('name');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

module.exports = {
  getUserById,
};