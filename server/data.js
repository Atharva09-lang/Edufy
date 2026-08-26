// data.js
// Run this once with: node data.js
// It connects to your DB, inserts sample Tag documents, then exits.
// After running, check your MongoDB (Compass / Atlas UI) in the "tags" collection.

const mongoose = require('mongoose');
require('dotenv').config();
const Tag = require('./models/Tag');

const sampleTags = [
    { name: "Web Development", description: "Learn to build modern websites and web applications from scratch." },
    { name: "Data Science", description: "Analyze data, build models, and extract insights using Python and statistics." },
    { name: "Mobile Development", description: "Build native and cross-platform mobile apps for Android and iOS." },
    { name: "Machine Learning", description: "Understand algorithms that let computers learn from data." },
    { name: "UI/UX Design", description: "Design intuitive and visually appealing user interfaces and experiences." },
    { name: "Cloud Computing", description: "Deploy and scale applications using AWS, Azure, and Google Cloud." },
    { name: "Cybersecurity", description: "Learn to protect systems, networks, and data from digital attacks." },
    { name: "DevOps", description: "Bridge development and operations with CI/CD, Docker, and Kubernetes." },
    { name: "Blockchain", description: "Understand decentralized systems, smart contracts, and crypto fundamentals." },
    { name: "Game Development", description: "Create 2D and 3D games using engines like Unity and Unreal." },
    { name: "Digital Marketing", description: "Learn SEO, social media, and content strategy to grow an audience." },
    { name: "Cloud Networking", description: "Master networking concepts and protocols used in modern cloud infrastructure." },
];

async function seedTags() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB");

        await Tag.deleteMany({}); // clears old tags before inserting fresh ones
        const inserted = await Tag.insertMany(sampleTags);

        console.log(`✅ Inserted ${inserted.length} tags successfully`);
        inserted.forEach(tag => console.log(`- ${tag.name} (${tag._id})`));

        process.exit(0);
    } catch (err) {
        console.error("❌ Error seeding tags:", err);
        process.exit(1);
    }
}

seedTags();