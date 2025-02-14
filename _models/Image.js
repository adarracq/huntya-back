// Image schema in MongoDB.
const imageSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    data: {type: Buffer, required: true},
    contentType: {type: String, required: true},
  });
  
  const Image = mongoose.model('Image', imageSchema);