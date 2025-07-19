import mongoose from 'mongoose';
import config from '../config/config';
import { Booking } from '../models/Booking';
import { Item } from '../models/Item';
import { Mentor } from '../models/Mentor';
import { Student } from '../models/Student';
import { User } from '../models/User';

const sampleUsers = [
  // Mentors (12 total)
  {
    email: 'john.mentor@example.com',
    password: 'password123',
    role: 'mentor',
    name: 'John Smith',
    isEmailVerified: true,
    isActive: true,
  },
  {
    email: 'sarah.mentor@example.com',
    password: 'password123',
    role: 'mentor',
    name: 'Sarah Johnson',
    isEmailVerified: true,
    isActive: true,
  },
  {
    email: 'mike.mentor@example.com',
    password: 'password123',
    role: 'mentor',
    name: 'Mike Davis',
    isEmailVerified: true,
    isActive: true,
  },
  {
    email: 'emily.mentor@example.com',
    password: 'password123',
    role: 'mentor',
    name: 'Emily Chen',
    isEmailVerified: true,
    isActive: true,
  },
  {
    email: 'david.mentor@example.com',
    password: 'password123',
    role: 'mentor',
    name: 'David Rodriguez',
    isEmailVerified: true,
    isActive: true,
  },
  {
    email: 'lisa.mentor@example.com',
    password: 'password123',
    role: 'mentor',
    name: 'Lisa Thompson',
    isEmailVerified: true,
    isActive: true,
  },
  {
    email: 'james.mentor@example.com',
    password: 'password123',
    role: 'mentor',
    name: 'James Wilson',
    isEmailVerified: true,
    isActive: true,
  },
  {
    email: 'maria.mentor@example.com',
    password: 'password123',
    role: 'mentor',
    name: 'Maria Garcia',
    isEmailVerified: true,
    isActive: true,
  },
  {
    email: 'alex.mentor@example.com',
    password: 'password123',
    role: 'mentor',
    name: 'Alex Kumar',
    isEmailVerified: true,
    isActive: true,
  },
  {
    email: 'rachel.mentor@example.com',
    password: 'password123',
    role: 'mentor',
    name: 'Rachel Brown',
    isEmailVerified: true,
    isActive: true,
  },
  {
    email: 'thomas.mentor@example.com',
    password: 'password123',
    role: 'mentor',
    name: 'Thomas Lee',
    isEmailVerified: true,
    isActive: true,
  },
  {
    email: 'anna.mentor@example.com',
    password: 'password123',
    role: 'mentor',
    name: 'Anna Petrov',
    isEmailVerified: true,
    isActive: true,
  },
  // Students (5 total)
  {
    email: 'alice.student@example.com',
    password: 'password123',
    role: 'student',
    name: 'Alice Cooper',
    isEmailVerified: true,
    isActive: true,
  },
  {
    email: 'bob.student@example.com',
    password: 'password123',
    role: 'student',
    name: 'Bob Wilson',
    isEmailVerified: true,
    isActive: true,
  },
  {
    email: 'maya.student@example.com',
    password: 'password123',
    role: 'student',
    name: 'Maya Patel',
    isEmailVerified: true,
    isActive: true,
  },
  {
    email: 'carlos.student@example.com',
    password: 'password123',
    role: 'student',
    name: 'Carlos Santos',
    isEmailVerified: true,
    isActive: true,
  },
  {
    email: 'zoe.student@example.com',
    password: 'password123',
    role: 'student',
    name: 'Zoe Kim',
    isEmailVerified: true,
    isActive: true,
  },
];

const sampleItems = [
  { name: 'Mathematics Textbook' },
  { name: 'Science Lab Kit' },
  { name: 'Programming Guide' },
  { name: 'History Reference Book' },
  { name: 'English Literature Collection' },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(config.mongodb.uri);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Mentor.deleteMany({});
    await Student.deleteMany({});
    await Item.deleteMany({});
    await Booking.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create Users
    const users = await User.insertMany(sampleUsers);
    console.log(`👥 Created ${users.length} users`);

    // Create Mentors
    const mentorUsers = users.filter(user => user.role === 'mentor');
    const sampleMentors = [
      // 1. John Smith - Software Engineering
      {
        userId: mentorUsers[0]._id,
        fullName: 'John Smith',
        age: 32,
        contactNumber: '+1-555-0101',
        bio: 'Experienced software engineer with 8+ years in web development. Passionate about teaching React, Node.js, and database design.',
        professionalRole: 'Senior Software Engineer',
        subjects: ['Programming', 'Web Development', 'Databases'],
        experienceYears: 8,
        preferredStudentLevels: ['Beginner', 'Intermediate'],
        linkedinUrl: 'https://linkedin.com/in/johnsmith',
        ratePerSession: 50,
        currency: 'USD',
        availableHours: ['09:00-12:00', '14:00-17:00'],
        timezone: 'UTC-5',
        totalSessions: 45,
        totalEarnings: 2250,
        averageRating: 4.8,
        totalReviews: 42,
        isVerified: true,
        isAvailable: true,
        specializations: ['React', 'Node.js', 'MongoDB'],
        languages: ['English', 'Spanish'],
      },
      // 2. Sarah Johnson - Mathematics
      {
        userId: mentorUsers[1]._id,
        fullName: 'Sarah Johnson',
        age: 29,
        contactNumber: '+1-555-0102',
        bio: 'Mathematics PhD with 5 years of tutoring experience. Specializing in calculus, statistics, and helping students overcome math anxiety.',
        professionalRole: 'Mathematics Professor',
        subjects: ['Mathematics', 'Statistics', 'Calculus'],
        experienceYears: 5,
        preferredStudentLevels: ['Intermediate', 'Advanced'],
        linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
        ratePerSession: 45,
        currency: 'USD',
        availableHours: ['10:00-13:00', '15:00-18:00'],
        timezone: 'UTC-8',
        totalSessions: 67,
        totalEarnings: 3015,
        averageRating: 4.9,
        totalReviews: 63,
        isVerified: true,
        isAvailable: true,
        specializations: ['Calculus', 'Statistics', 'Linear Algebra'],
        languages: ['English', 'French'],
      },
      // 3. Mike Davis - Physics
      {
        userId: mentorUsers[2]._id,
        fullName: 'Mike Davis',
        age: 35,
        contactNumber: '+1-555-0103',
        bio: 'Physics researcher and educator with expertise in quantum mechanics and experimental physics. Love making complex concepts accessible.',
        professionalRole: 'Research Scientist',
        subjects: ['Physics', 'Science', 'Research Methods'],
        experienceYears: 10,
        preferredStudentLevels: ['Intermediate', 'Advanced'],
        portfolioUrl: 'https://mikedavis.science',
        ratePerSession: 60,
        currency: 'USD',
        availableHours: ['08:00-11:00', '13:00-16:00'],
        timezone: 'UTC-6',
        totalSessions: 34,
        totalEarnings: 2040,
        averageRating: 4.7,
        totalReviews: 31,
        isVerified: true,
        isAvailable: true,
        specializations: ['Quantum Physics', 'Experimental Design', 'Data Analysis'],
        languages: ['English', 'German'],
      },
      // 4. Emily Chen - Data Science & AI
      {
        userId: mentorUsers[3]._id,
        fullName: 'Emily Chen',
        age: 28,
        contactNumber: '+1-555-0104',
        bio: 'Data scientist with expertise in machine learning and AI. Former Google engineer who loves teaching Python, statistics, and ML concepts.',
        professionalRole: 'Senior Data Scientist',
        subjects: ['Data Science', 'Machine Learning', 'Python', 'Statistics'],
        experienceYears: 6,
        preferredStudentLevels: ['Intermediate', 'Advanced'],
        linkedinUrl: 'https://linkedin.com/in/emilychen',
        portfolioUrl: 'https://emilychen.dev',
        ratePerSession: 75,
        currency: 'USD',
        availableHours: ['16:00-19:00', '20:00-22:00'],
        timezone: 'UTC-8',
        totalSessions: 52,
        totalEarnings: 3900,
        averageRating: 4.9,
        totalReviews: 48,
        isVerified: true,
        isAvailable: true,
        specializations: ['TensorFlow', 'PyTorch', 'SQL', 'Pandas'],
        languages: ['English', 'Mandarin'],
      },
      // 5. David Rodriguez - Chemistry & Biology
      {
        userId: mentorUsers[4]._id,
        fullName: 'David Rodriguez',
        age: 31,
        contactNumber: '+1-555-0105',
        bio: 'Biochemistry PhD working in pharmaceutical research. Passionate about organic chemistry, molecular biology, and research methodology.',
        professionalRole: 'Research Scientist',
        subjects: ['Chemistry', 'Biology', 'Biochemistry', 'Research Methods'],
        experienceYears: 7,
        preferredStudentLevels: ['Beginner', 'Intermediate', 'Advanced'],
        linkedinUrl: 'https://linkedin.com/in/davidrodriguez',
        ratePerSession: 55,
        currency: 'USD',
        availableHours: ['18:00-21:00'],
        timezone: 'UTC-5',
        totalSessions: 38,
        totalEarnings: 2090,
        averageRating: 4.6,
        totalReviews: 35,
        isVerified: true,
        isAvailable: true,
        specializations: ['Organic Chemistry', 'Molecular Biology', 'Lab Techniques'],
        languages: ['English', 'Spanish'],
      },
      // 6. Lisa Thompson - English & Literature
      {
        userId: mentorUsers[5]._id,
        fullName: 'Lisa Thompson',
        age: 26,
        contactNumber: '+1-555-0106',
        bio: 'English Literature graduate with teaching certification. Specializing in academic writing, essay composition, and literature analysis.',
        professionalRole: 'High School English Teacher',
        subjects: ['English', 'Literature', 'Writing', 'Language Arts'],
        experienceYears: 4,
        preferredStudentLevels: ['Beginner', 'Intermediate'],
        linkedinUrl: 'https://linkedin.com/in/lisathompson',
        ratePerSession: 35,
        currency: 'USD',
        availableHours: ['15:00-18:00', '19:00-21:00'],
        timezone: 'UTC-6',
        totalSessions: 73,
        totalEarnings: 2555,
        averageRating: 4.8,
        totalReviews: 68,
        isVerified: true,
        isAvailable: true,
        specializations: ['Academic Writing', 'Essay Structure', 'Grammar'],
        languages: ['English'],
      },
      // 7. James Wilson - Economics & Business
      {
        userId: mentorUsers[6]._id,
        fullName: 'James Wilson',
        age: 34,
        contactNumber: '+1-555-0107',
        bio: 'MBA graduate working as business analyst. Expert in economics, finance, and business strategy with real-world corporate experience.',
        professionalRole: 'Senior Business Analyst',
        subjects: ['Economics', 'Business', 'Finance', 'Accounting'],
        experienceYears: 9,
        preferredStudentLevels: ['Intermediate', 'Advanced'],
        linkedinUrl: 'https://linkedin.com/in/jameswilson',
        ratePerSession: 65,
        currency: 'USD',
        availableHours: ['17:00-20:00'],
        timezone: 'UTC-5',
        totalSessions: 29,
        totalEarnings: 1885,
        averageRating: 4.7,
        totalReviews: 27,
        isVerified: true,
        isAvailable: true,
        specializations: ['Financial Analysis', 'Market Research', 'Business Planning'],
        languages: ['English'],
      },
      // 8. Maria Garcia - History & Social Studies
      {
        userId: mentorUsers[7]._id,
        fullName: 'Maria Garcia',
        age: 30,
        contactNumber: '+1-555-0108',
        bio: 'History professor with specialization in World History and Political Science. Passionate about making historical events come alive for students.',
        professionalRole: 'Assistant Professor of History',
        subjects: ['History', 'Social Studies', 'Political Science', 'Geography'],
        experienceYears: 6,
        preferredStudentLevels: ['Beginner', 'Intermediate', 'Advanced'],
        linkedinUrl: 'https://linkedin.com/in/mariagarcia',
        ratePerSession: 42,
        currency: 'USD',
        availableHours: ['14:00-17:00', '19:00-21:00'],
        timezone: 'UTC-7',
        totalSessions: 56,
        totalEarnings: 2352,
        averageRating: 4.8,
        totalReviews: 52,
        isVerified: true,
        isAvailable: true,
        specializations: ['World History', 'European History', 'Research Methods'],
        languages: ['English', 'Spanish', 'Portuguese'],
      },
      // 9. Alex Kumar - Computer Science & Algorithms
      {
        userId: mentorUsers[8]._id,
        fullName: 'Alex Kumar',
        age: 27,
        contactNumber: '+1-555-0109',
        bio: 'Computer Science MS graduate working at tech startup. Expert in algorithms, data structures, and competitive programming. Great for interview prep.',
        professionalRole: 'Software Developer',
        subjects: ['Computer Science', 'Algorithms', 'Data Structures', 'Programming'],
        experienceYears: 5,
        preferredStudentLevels: ['Beginner', 'Intermediate', 'Advanced'],
        linkedinUrl: 'https://linkedin.com/in/alexkumar',
        githubUrl: 'https://github.com/alexkumar',
        ratePerSession: 58,
        currency: 'USD',
        availableHours: ['20:00-23:00'],
        timezone: 'UTC-8',
        totalSessions: 41,
        totalEarnings: 2378,
        averageRating: 4.9,
        totalReviews: 39,
        isVerified: true,
        isAvailable: true,
        specializations: ['Leetcode', 'System Design', 'Java', 'C++'],
        languages: ['English', 'Hindi'],
      },
      // 10. Rachel Brown - Art & Design
      {
        userId: mentorUsers[9]._id,
        fullName: 'Rachel Brown',
        age: 25,
        contactNumber: '+1-555-0110',
        bio: 'Digital artist and UX designer with fine arts background. Teaching digital art, design principles, and creative software like Photoshop and Illustrator.',
        professionalRole: 'UX/UI Designer',
        subjects: ['Art', 'Design', 'Digital Media', 'Visual Arts'],
        experienceYears: 3,
        preferredStudentLevels: ['Beginner', 'Intermediate'],
        linkedinUrl: 'https://linkedin.com/in/rachelbrown',
        portfolioUrl: 'https://rachelbrown.design',
        ratePerSession: 48,
        currency: 'USD',
        availableHours: ['16:00-19:00', '21:00-23:00'],
        timezone: 'UTC-5',
        totalSessions: 64,
        totalEarnings: 3072,
        averageRating: 4.7,
        totalReviews: 59,
        isVerified: true,
        isAvailable: true,
        specializations: ['Adobe Creative Suite', 'UI/UX Design', 'Digital Illustration'],
        languages: ['English'],
      },
      // 11. Thomas Lee - Engineering & CAD
      {
        userId: mentorUsers[10]._id,
        fullName: 'Thomas Lee',
        age: 36,
        contactNumber: '+1-555-0111',
        bio: 'Mechanical engineer with 12 years in automotive industry. Expert in CAD software, engineering principles, and project management.',
        professionalRole: 'Senior Mechanical Engineer',
        subjects: ['Engineering', 'Mechanical Engineering', 'CAD Design', 'Mathematics'],
        experienceYears: 12,
        preferredStudentLevels: ['Intermediate', 'Advanced'],
        linkedinUrl: 'https://linkedin.com/in/thomaslee',
        ratePerSession: 70,
        currency: 'USD',
        availableHours: ['18:00-21:00'],
        timezone: 'UTC-6',
        totalSessions: 25,
        totalEarnings: 1750,
        averageRating: 4.6,
        totalReviews: 23,
        isVerified: true,
        isAvailable: true,
        specializations: ['AutoCAD', 'SolidWorks', 'Project Management'],
        languages: ['English', 'Korean'],
      },
      // 12. Anna Petrov - Music & Arts
      {
        userId: mentorUsers[11]._id,
        fullName: 'Anna Petrov',
        age: 28,
        contactNumber: '+1-555-0112',
        bio: 'Professional pianist and music teacher with conservatory training. Teaching piano, music theory, and composition for all skill levels.',
        professionalRole: 'Music Teacher & Performer',
        subjects: ['Music', 'Piano', 'Music Theory', 'Arts'],
        experienceYears: 8,
        preferredStudentLevels: ['Beginner', 'Intermediate', 'Advanced'],
        linkedinUrl: 'https://linkedin.com/in/annapetrov',
        portfolioUrl: 'https://annapetrov.music',
        ratePerSession: 52,
        currency: 'USD',
        availableHours: ['15:00-18:00', '20:00-22:00'],
        timezone: 'UTC-5',
        totalSessions: 87,
        totalEarnings: 4524,
        averageRating: 4.9,
        totalReviews: 82,
        isVerified: true,
        isAvailable: true,
        specializations: ['Classical Piano', 'Jazz', 'Music Composition'],
        languages: ['English', 'Russian', 'French'],
      },
    ];

    const mentors = await Mentor.insertMany(sampleMentors);
    console.log(`🎓 Created ${mentors.length} mentors`);

    // Create Students
    const studentUsers = users.filter(user => user.role === 'student');
    const sampleStudents = [
      // 1. Alice Cooper - Computer Science Student
      {
        userId: studentUsers[0]._id,
        fullName: 'Alice Cooper',
        age: 20,
        contactNumber: '+1-555-0201',
        school: 'State University',
        educationLevel: 'Undergraduate',
        subjects: ['Programming', 'Mathematics'],
        skills: [
          { subject: 'JavaScript', level: 'Beginner' },
          { subject: 'Python', level: 'Intermediate' },
        ],
        preferredLearningStyle: 'Visual and hands-on',
        completedSessions: 12,
        totalSpent: 600,
        averageRating: 4.5,
      },
      // 2. Bob Wilson - Engineering Student
      {
        userId: studentUsers[1]._id,
        fullName: 'Bob Wilson',
        age: 18,
        contactNumber: '+1-555-0202',
        school: 'Community College',
        educationLevel: 'Associate',
        subjects: ['Mathematics', 'Physics'],
        skills: [
          { subject: 'Calculus', level: 'Beginner' },
          { subject: 'Physics', level: 'Beginner' },
        ],
        preferredLearningStyle: 'Step-by-step explanations',
        accommodations: 'Extra time for processing',
        completedSessions: 8,
        totalSpent: 360,
        averageRating: 4.2,
      },
      // 3. Maya Patel - Pre-med Student (our main character)
      {
        userId: studentUsers[2]._id,
        fullName: 'Maya Patel',
        age: 19,
        contactNumber: '+1-555-0203',
        school: 'University of California',
        educationLevel: 'Undergraduate',
        subjects: ['Biology', 'Chemistry', 'Mathematics', 'Physics'],
        skills: [
          { subject: 'Biology', level: 'Intermediate' },
          { subject: 'Chemistry', level: 'Beginner' },
          { subject: 'Mathematics', level: 'Intermediate' },
        ],
        preferredLearningStyle: 'Interactive discussions with real-world examples',
        accommodations: 'Prefers evening sessions',
        completedSessions: 3,
        totalSpent: 150,
        averageRating: 4.7,
        goals: ['Improve in Organic Chemistry', 'Prepare for MCAT', 'Understand research methodology'],
      },
      // 4. Carlos Santos - Business Student
      {
        userId: studentUsers[3]._id,
        fullName: 'Carlos Santos',
        age: 21,
        contactNumber: '+1-555-0204',
        school: 'Business College',
        educationLevel: 'Undergraduate',
        subjects: ['Economics', 'Business', 'Statistics', 'Finance'],
        skills: [
          { subject: 'Economics', level: 'Intermediate' },
          { subject: 'Statistics', level: 'Beginner' },
          { subject: 'Business Analysis', level: 'Beginner' },
        ],
        preferredLearningStyle: 'Case studies and practical applications',
        completedSessions: 15,
        totalSpent: 975,
        averageRating: 4.3,
      },
      // 5. Zoe Kim - Art & Design Student
      {
        userId: studentUsers[4]._id,
        fullName: 'Zoe Kim',
        age: 20,
        contactNumber: '+1-555-0205',
        school: 'Art Institute',
        educationLevel: 'Undergraduate',
        subjects: ['Art', 'Design', 'Digital Media'],
        skills: [
          { subject: 'Digital Art', level: 'Intermediate' },
          { subject: 'UI/UX Design', level: 'Beginner' },
          { subject: 'Photography', level: 'Advanced' },
        ],
        preferredLearningStyle: 'Visual demonstrations and hands-on practice',
        completedSessions: 22,
        totalSpent: 1056,
        averageRating: 4.6,
      },
    ];

    const students = await Student.insertMany(sampleStudents);
    console.log(`🎒 Created ${students.length} students`);

    // Create Items
    const items = await Item.insertMany(sampleItems);
    console.log(`📚 Created ${items.length} items`);

    // Create Sample Bookings
    const sampleBookings = [
      {
        studentId: students[0]._id,
        mentorId: mentors[0]._id,
        sessionDateTime: new Date('2025-01-25T14:00:00Z'),
        durationMinutes: 60,
        paymentProofUrl: 'https://example.com/payment-proof-1.jpg',
        status: 'confirmed',
        totalAmount: 50,
        currency: 'USD',
        meetingLink: 'https://zoom.us/j/123456789',
      },
      {
        studentId: students[1]._id,
        mentorId: mentors[1]._id,
        sessionDateTime: new Date('2025-01-26T15:00:00Z'),
        durationMinutes: 90,
        paymentProofUrl: 'https://example.com/payment-proof-2.jpg',
        status: 'pending',
        totalAmount: 67.5,
        currency: 'USD',
      },
    ];

    const bookings = await Booking.insertMany(sampleBookings);
    console.log(`📅 Created ${bookings.length} bookings`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Mentors: ${mentors.length}`);
    console.log(`   Students: ${students.length}`);
    console.log(`   Items: ${items.length}`);
    console.log(`   Bookings: ${bookings.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the seeding function
seedDatabase();
