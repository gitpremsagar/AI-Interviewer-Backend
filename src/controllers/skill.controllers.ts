import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// const itSkills = [
//     {
//         skillName: "Programming languages",
//         skillDescription: "Knowledge of languages such as Python, Java, C++, and JavaScript for software development."
//     },
//     {
//         skillName: "Software development",
//         skillDescription: "Designing, coding, testing, and maintaining software applications."
//     },
//     {
//         skillName: "Web development",
//         skillDescription: "Proficiency in HTML, CSS, JavaScript, and frameworks like React and Angular for building websites and web applications."
//     },
//     {
//         skillName: "Database management",
//         skillDescription: "Managing databases using SQL, NoSQL, Oracle, MySQL, and MongoDB."
//     },
//     {
//         skillName: "Systems analysis",
//         skillDescription: "Analyzing and designing information systems to solve business problems."
//     },
//     {
//         skillName: "Network configuration and management",
//         skillDescription: "Setting up and maintaining network infrastructure, including routers, switches, and firewalls."
//     },
//     {
//         skillName: "Cybersecurity",
//         skillDescription: "Protecting systems and networks from cyber threats and ensuring data security."
//     },
//     {
//         skillName: "Cloud computing",
//         skillDescription: "Utilizing cloud services such as AWS, Azure, and Google Cloud for scalable and flexible IT solutions."
//     },
//     {
//         skillName: "DevOps practices",
//         skillDescription: "Integrating development and operations to improve collaboration and efficiency through practices like CI/CD."
//     },
//     {
//         skillName: "Operating systems",
//         skillDescription: "Understanding and managing operating systems like Windows, Linux, and macOS."
//     },
//     {
//         skillName: "IT support and troubleshooting",
//         skillDescription: "Providing technical support and resolving IT issues for users and organizations."
//     },
//     {
//         skillName: "Virtualization technologies",
//         skillDescription: "Using tools like VMware and Hyper-V to create and manage virtual machines."
//     },
//     {
//         skillName: "IT project management",
//         skillDescription: "Planning, executing, and overseeing IT projects to ensure they are completed on time and within budget."
//     },
//     {
//         skillName: "Agile and Scrum methodologies",
//         skillDescription: "Applying Agile and Scrum frameworks to enhance project flexibility and team collaboration."
//     },
//     {
//         skillName: "Version control",
//         skillDescription: "Using version control systems like Git and SVN to manage code changes and collaboration."
//     },
//     {
//         skillName: "API development and integration",
//         skillDescription: "Creating and integrating application programming interfaces to enable software interactions."
//     },
//     {
//         skillName: "Machine learning and artificial intelligence",
//         skillDescription: "Developing and implementing AI and ML algorithms to automate tasks and gain insights from data."
//     },
//     {
//         skillName: "Big data technologies",
//         skillDescription: "Using Hadoop, Spark, and other tools to manage and analyze large datasets."
//     },
//     {
//         skillName: "Data analysis and visualization",
//         skillDescription: "Interpreting data and creating visual representations to inform decision-making."
//     },
//     {
//         skillName: "IT governance and compliance",
//         skillDescription: "Ensuring IT practices meet regulatory requirements and organizational policies."
//     },
//     {
//         skillName: "Business intelligence",
//         skillDescription: "Using data analysis and tools to support business decision-making processes."
//     },
//     {
//         skillName: "Technical writing and documentation",
//         skillDescription: "Creating clear and concise technical documentation for software and systems."
//     },
//     {
//         skillName: "System architecture design",
//         skillDescription: "Designing the overall structure and organization of IT systems."
//     },
//     {
//         skillName: "Mobile application development",
//         skillDescription: "Creating applications for mobile devices using platforms like iOS and Android."
//     },
//     {
//         skillName: "UI/UX design",
//         skillDescription: "Designing user interfaces and experiences to enhance usability and user satisfaction."
//     },
//     {
//         skillName: "Quality assurance and testing",
//         skillDescription: "Ensuring software meets quality standards through testing and validation."
//     },
//     {
//         skillName: "Network security and ethical hacking",
//         skillDescription: "Identifying and mitigating security vulnerabilities through ethical hacking techniques."
//     },
//     {
//         skillName: "Disaster recovery planning",
//         skillDescription: "Developing strategies to recover IT systems and data after a disaster."
//     },
//     {
//         skillName: "ITIL and service management",
//         skillDescription: "Applying IT Infrastructure Library (ITIL) practices to manage IT services effectively."
//     },
//     {
//         skillName: "Customer service and client management",
//         skillDescription: "Managing client relationships and providing excellent customer service."
//     },
//     {
//         skillName: "Blockchain technology",
//         skillDescription: "Understanding and implementing blockchain solutions for secure and decentralized transactions."
//     },
//     {
//         skillName: "Internet of Things (IoT)",
//         skillDescription: "Developing and managing interconnected devices that communicate over the internet."
//     },
//     {
//         skillName: "Robotic Process Automation (RPA)",
//         skillDescription: "Using RPA tools to automate repetitive tasks and improve efficiency."
//     },
//     {
//         skillName: "Containerization",
//         skillDescription: "Using Docker, Kubernetes, and other tools to deploy and manage applications in containers."
//     }
// ];

const createSkill = async (req: Request, res: Response) => {
  const { skillName, skillDescription } = req.body;

  try {
    const newSkill = await prisma.skill.create({
      data: {
        skillName,
        skillDescription,
      },
    });

    // console.log("Skill saved on db - ", newSkill);
    res.json(newSkill);
  } catch (error) {
    console.error("could not save skill on db - ", error);
    res.status(500).json({ message: "Could not create skill" });
  }
};

const getSkills = async (req: Request, res: Response) => {
  try {
    const skills = await prisma.skill.findMany();
    res.json(skills);
  } catch (error) {
    console.error("could not fetch skills from db - ", error);
    res.status(500).json({ message: "Could not fetch skills" });
  }
};

const updateSkill = async (req: Request, res: Response) => {
  const skillId = req.params.skillId;
  const { skillName, skillDescription } = req.body;

  try {
    const updatedSkill = await prisma.skill.update({
      where: {
        skillId,
      },
      data: {
        skillName,
        skillDescription,
      },
    });

    // console.log("Skill updated on db - ", updatedSkill);
    res.json(updatedSkill);
  } catch (error) {
    console.error("could not update skill on db - ", error);
    res.status(500).json({ message: "Could not update skill" });
  }
};

const deleteSkill = async (req: Request, res: Response) => {
  const skillId = req.params.skillId;

  try {
    const deletedSkill = await prisma.skill.delete({
      where: {
        skillId,
      },
    });

    // console.log("Skill deleted from db - ", skillId);
    res.json({ message: "Skill deleted", deletedSkill });
  } catch (error) {
    console.error("could not delete skill from db - ", error);
    res.status(500).json({ message: "Could not delete skill" });
  }
};

export { createSkill, getSkills, updateSkill, deleteSkill };
