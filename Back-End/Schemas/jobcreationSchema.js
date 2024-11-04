import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
  },
  title: {
    type: String,
    required: [true, 'Job title is required'],
  },
  location: {
    type: String,
    required: [true, 'Job location is required'],
  },
  salary: {
    type: String,
    required: [true, 'Salary range is required'],
  },
  jobDescription: {
    type: String,
    required: [true, 'Job description is required'],
  },
  department: {
    type: String,
    enum: ['CSE/IT', 'ECE', 'EEE', 'MECH/CIVIL', 'All Streams', 'PG'],
    required: [true, 'Department is required'],
  },
  employmentType: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship'],
    required: [true, 'Employment type is required'],
  },
  applicationDeadline: {
    type: Date,
    required: [true, 'Application deadline is required'],
  },
  requiredQualification: {
    type: String,
    required: [true, 'Required qualification is required'],
  },
  jobResponsibilities: {
    type: String,
    required: [true, 'Job responsibilities are required'],
  },
  published: { type: Boolean, default: false }  
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
