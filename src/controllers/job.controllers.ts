import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const createJob = async (req: Request, res: Response) => {
  const { jobTitle, jobDescription, skillIDs } = req.body;

  try {
    const newJob = await prisma.job.create({
      data: {
        jobTitle,
        jobDescription,
        skills: {
          connect: skillIDs.map((skillId: string) => ({ skillId })),
        },
      },
    });

    // console.log("Job saved on db - ", newJob);
    res.json(newJob);
  } catch (error) {
    console.error("could not save job on db - ", error);
    res.status(500).json({ message: "Could not create job" });
  }
};

const getJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await prisma.job.findMany();
    res.json(jobs);
  } catch (error) {
    console.error("could not fetch jobs from db - ", error);
    res.status(500).json({ message: "Could not fetch jobs" });
  }
};

const updateJob = async (req: Request, res: Response) => {
  const jobId = req.params.jobId;
  const { jobTitle, jobDescription, skills } = req.body;

  try {
    const updatedJob = await prisma.job.update({
      where: {
        jobId,
      },
      data: {
        jobTitle,
        jobDescription,
        skills,
      },
    });

    console.log("Job updated on db - ", updatedJob);
    res.json(updatedJob);
  } catch (error) {
    console.error("could not update job on db - ", error);
    res.status(500).json({ message: "Could not update job" });
  }
};

const deleteJob = async (req: Request, res: Response) => {
  const jobId = req.params.jobId;

  try {
    const deletedJob = await prisma.job.delete({
      where: {
        jobId,
      },
    });

    console.log("Job deleted from db - ", deletedJob);
    res.json({ deletedJob, message: "Job deleted successfully" });
  } catch (error) {
    console.error("could not delete job from db - ", error);
    res.status(500).json({ message: "Could not delete job" });
  }
};

export { createJob, getJobs, updateJob, deleteJob };
