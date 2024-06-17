"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createManyJobs = exports.deleteJob = exports.updateJob = exports.getJobs = exports.createJob = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// const itJobs = [
//   {
//     jobTitle: "Software Developer",
//     jobDescription:
//       "Designs, codes, tests, and maintains software applications, ensuring functionality and performance.",
//   },
//   {
//     jobTitle: "Web Developer",
//     jobDescription:
//       "Develops and maintains websites and web applications using languages like HTML, CSS, and JavaScript.",
//   },
//   {
//     jobTitle: "Database Administrator",
//     jobDescription:
//       "Manages and maintains database systems, ensuring data integrity, security, and availability.",
//   },
//   {
//     jobTitle: "Network Engineer",
//     jobDescription:
//       "Designs, implements, and manages computer networks, ensuring reliable connectivity and security.",
//   },
//   {
//     jobTitle: "Cybersecurity Analyst",
//     jobDescription:
//       "Protects an organization's systems and data from cyber threats and ensures compliance with security policies.",
//   },
//   {
//     jobTitle: "Cloud Engineer",
//     jobDescription:
//       "Develops and manages cloud-based solutions using platforms like AWS, Azure, and Google Cloud.",
//   },
//   {
//     jobTitle: "DevOps Engineer",
//     jobDescription:
//       "Combines software development and IT operations to improve collaboration and automate processes.",
//   },
//   {
//     jobTitle: "System Administrator",
//     jobDescription:
//       "Maintains and supports an organization's IT infrastructure, including servers, networks, and hardware.",
//   },
//   {
//     jobTitle: "IT Support Specialist",
//     jobDescription:
//       "Provides technical support and troubleshooting assistance to users and resolves IT issues.",
//   },
//   {
//     jobTitle: "Software Tester/QA Engineer",
//     jobDescription:
//       "Tests software applications to identify and fix bugs, ensuring high-quality and reliable products.",
//   },
//   {
//     jobTitle: "Project Manager",
//     jobDescription:
//       "Plans, executes, and oversees IT projects, ensuring they are completed on time and within budget.",
//   },
//   {
//     jobTitle: "Business Analyst",
//     jobDescription:
//       "Analyzes business needs and processes to develop IT solutions that improve efficiency and effectiveness.",
//   },
//   {
//     jobTitle: "Data Scientist",
//     jobDescription:
//       "Extracts insights from large datasets using statistical methods, machine learning, and data visualization.",
//   },
//   {
//     jobTitle: "Data Analyst",
//     jobDescription:
//       "Analyzes and interprets data to provide actionable insights and support decision-making processes.",
//   },
//   {
//     jobTitle: "Machine Learning Engineer",
//     jobDescription:
//       "Develops and implements machine learning algorithms and models to solve complex problems.",
//   },
//   {
//     jobTitle: "UI/UX Designer",
//     jobDescription:
//       "Designs user interfaces and experiences to enhance the usability and appeal of software and applications.",
//   },
//   {
//     jobTitle: "Mobile Application Developer",
//     jobDescription:
//       "Creates applications for mobile devices using platforms such as iOS and Android.",
//   },
//   {
//     jobTitle: "IT Manager",
//     jobDescription:
//       "Oversees the IT department, manages IT projects, and aligns technology with business goals.",
//   },
//   {
//     jobTitle: "Information Security Manager",
//     jobDescription:
//       "Leads the development and implementation of security policies and procedures to protect information assets.",
//   },
//   {
//     jobTitle: "Blockchain Developer",
//     jobDescription:
//       "Develops and implements blockchain-based applications and solutions for secure and decentralized transactions.",
//   },
//   {
//     jobTitle: "IoT Developer",
//     jobDescription:
//       "Develops and manages interconnected devices and systems that communicate over the internet.",
//   },
//   {
//     jobTitle: "RPA Developer",
//     jobDescription:
//       "Creates robotic process automation solutions to automate repetitive tasks and improve operational efficiency.",
//   },
//   {
//     jobTitle: "Technical Writer",
//     jobDescription:
//       "Creates technical documentation, manuals, and guides to help users understand and use software and systems.",
//   },
//   {
//     jobTitle: "IT Consultant",
//     jobDescription:
//       "Provides expert advice and solutions to organizations to improve their IT systems and processes.",
//   },
//   {
//     jobTitle: "Full Stack Developer",
//     jobDescription:
//       "Works on both the front-end and back-end of web applications, handling all aspects of development.",
//   },
//   {
//     jobTitle: "Artificial Intelligence Engineer",
//     jobDescription:
//       "Develops AI systems and applications, focusing on creating intelligent machines and algorithms.",
//   },
//   {
//     jobTitle: "System Architect",
//     jobDescription:
//       "Designs and oversees the architecture of complex IT systems, ensuring they meet business requirements.",
//   },
//   {
//     jobTitle: "IT Auditor",
//     jobDescription:
//       "Evaluates and audits an organization's IT systems and processes to ensure compliance and efficiency.",
//   },
//   {
//     jobTitle: "ERP Consultant",
//     jobDescription:
//       "Implements and manages enterprise resource planning (ERP) systems to streamline business processes.",
//   },
//   {
//     jobTitle: "Help Desk Technician",
//     jobDescription:
//       "Provides first-line technical support to users, troubleshooting hardware and software issues.",
//   },
// ];
const createJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jobTitle, jobDescription, skillIDs } = req.body;
    try {
        const newJob = yield prisma.job.create({
            data: {
                jobTitle,
                jobDescription,
                skills: {
                    connect: skillIDs.map((skillId) => ({ skillId })),
                },
            },
        });
        // console.log("Job saved on db - ", newJob);
        res.json(newJob);
    }
    catch (error) {
        console.error("could not save job on db - ", error);
        res.status(500).json({ message: "Could not create job" });
    }
});
exports.createJob = createJob;
const createManyJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jobs } = req.body;
    try {
        const newJobs = yield prisma.job.createMany({
            data: jobs,
        });
        console.log("Jobs saved on db - ", newJobs);
        res.json(newJobs);
    }
    catch (error) {
        console.error("could not save jobs on db - ", error);
        res.status(500).json({ message: "Could not create jobs" });
    }
});
exports.createManyJobs = createManyJobs;
const getJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobs = yield prisma.job.findMany();
        res.json(jobs);
    }
    catch (error) {
        console.error("could not fetch jobs from db - ", error);
        res.status(500).json({ message: "Could not fetch jobs" });
    }
});
exports.getJobs = getJobs;
const updateJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jobId = req.params.jobId;
    const { jobTitle, jobDescription, skillIDs } = req.body;
    try {
        const updatedJob = yield prisma.job.update({
            where: {
                jobId,
            },
            data: {
                jobTitle,
                jobDescription,
                skills: {
                    set: skillIDs.map((skillId) => ({ skillId })),
                },
            },
        });
        console.log("Job updated on db - ", updatedJob);
        res.json(updatedJob);
    }
    catch (error) {
        console.error("could not update job on db - ", error);
        res.status(500).json({ message: "Could not update job" });
    }
});
exports.updateJob = updateJob;
const deleteJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jobId = req.params.jobId;
    try {
        const deletedJob = yield prisma.job.delete({
            where: {
                jobId,
            },
        });
        console.log("Job deleted from db - ", deletedJob);
        res.json({ deletedJob, message: "Job deleted successfully" });
    }
    catch (error) {
        console.error("could not delete job from db - ", error);
        res.status(500).json({ message: "Could not delete job" });
    }
});
exports.deleteJob = deleteJob;
