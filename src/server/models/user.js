import mongoose, { Schema } from 'mongoose';


const UserSchema = new Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    // required: true,
  },
  password_hash: {
    type: String,
    // required: true,
  },
  is_email_verified: {
    type: Boolean,
    default: false,
  },
});

// UserSchema.virtual('postCount').get(function() {
//   return this.posts.length;
// });

// UserSchema.pre('remove', async function( next ) {
//   const BlogPost = mongoose.model('blogpost');
//   await BlogPost.remove({ _id: { $in: this.blogPosts } });
//   next();
// });

const User = mongoose.model('user', UserSchema);

module.exports = User;
