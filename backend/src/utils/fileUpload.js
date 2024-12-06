const cloudinary = require("../cloud/cloudinary")
const updateAvatarToCloudinary = async (file, avatarId) => {
  try {
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

      console.log("Cloudinary upload result:", { public_id, secure_url });
      return {id: public_id, url : secure_url}
  } catch (error) {
    console.error("Error uploading avatar to Cloudinary", error);
    throw new Error("Failed to upload avatar to Cloudinary");
  }
};

module.exports = updateAvatarToCloudinary