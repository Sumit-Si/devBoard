import { db } from "../libs/db.js";

const createProject = async (req, res) => {
  const { name, description } = req.body;
  const userId = req?.user?.id;

  try {
    const existingProject = await db.project.findFirst({
      where: {
        name,
        createdBy: userId,
      },
    });

    if (existingProject) {
      return res.status(400).json({
        message: "Project already exists",
      });
    }

    const project = await db.project.create({
      data: {
        name,
        description,
        createdBy: userId,
      },
    });

    if (!project) {
      return res.status(400).json({
        message: "Problem when creating project",
      });
    }

    const populatedProjectInfo = await db.project.findUnique({
      where: {
        id: project?.id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: populatedProjectInfo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getProjects = async (req, res) => {
  const userId = req.user?.id;
  let { limit = 10, page = 1 } = req.query;

  if (page <= 0) page = 1;
  if (limit <= 0 || limit >= 50) {
    limit = 10;
  }

  const skip = (page - 1) * limit;

  try {
    const projects = await db.project.findMany({
      where: {
        createdBy: userId,
      },
      take: parseInt(limit),
      skip: parseInt(skip),
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!projects || projects?.length === 0) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const totalProjects = await db.project.count({});
    const totalPages = Math.ceil(totalProjects / limit);

    res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      projects,
      metadata: {
        totalPages,
        currentPage: page,
        currentLimit: limit,
      },
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: "Internal server error",
      projects,
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const project = await db.project.findFirst({
      where: {
        id,
        createdBy: userId,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project fetched successfully",
      project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { name, description } = req.body;

    const existingProject = await db.project.findFirst({
      where: {
        id,
        createdBy: userId,
      },
    });

    if (!existingProject) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const project = await db.project.update({
      where: {
        id,
      },
      data: {
        name,
        description,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!project) {
      return res.status(400).json({
        message: "Problem while updating project",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const existingProject = await db.project.findFirst({
      where: {
        id,
        createdBy: userId,
        deletedAt: null,
      },
    });

    if (!existingProject) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const project = await db.project.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!project) {
      return res.status(400).json({
        message: "Problem while deleting project",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export {
  createProject,
  getProjects,
  getProjectById,
  updateProjectById,
  deleteProjectById,
};
