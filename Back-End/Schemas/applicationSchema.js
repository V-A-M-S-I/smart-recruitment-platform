import mongoose from 'mongoose';

const applicantSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  department: { type: String, required: true, enum: ['CSE/IT', 'ECE', 'EEE', 'MECH/CIVIL', 'PG'] },
  qualification: { type: String, required: true },
  institute: { type: String, required: true },
  graduationYear: { type: Number, required: true },
  skills: { type: String, required: true },
  workExperience: { type: String, default: '' },
  resume: { type: String, required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  feedback: { type: String } 
}, { timestamps: true });

const Applicant = mongoose.model('Applicant', applicantSchema);

export default Applicant;
