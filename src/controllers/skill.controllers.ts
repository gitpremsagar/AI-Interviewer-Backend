import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

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
