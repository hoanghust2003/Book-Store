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

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select('name email role');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await UserModel.findByIdAndDelete(id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await UserModel.findByIdAndUpdate(id, { role }, { new: true });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user role' });
  }
};

module.exports = {
  getUserById, getAllUsers, deleteUser, updateUserRole
};