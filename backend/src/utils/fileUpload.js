const cloudinary = require("../cloud/cloudinary")
const updateAvatarToCloudinary = async (file, avatarId) => {
    if (avatarId){
        //if user already has avatar, remove the old first
        await cloudinary.uploader.destroy(avatarId)
      }
      const {public_id, secure_url, url} = await cloudinary.uploader.upload(file.filepath, {
        width: 300,
        height: 300,
        gravity: 'face',
        crop: 'fill'
      })
      return {id: public_id, url : secure_url}
}

module.exports = updateAvatarToCloudinary