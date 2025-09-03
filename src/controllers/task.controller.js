import { db } from "../libs/db.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createTask = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { projectId } = req.params;
    const { title, description, assignedTo, assignedBy, status, priority } =
      req.body;

    const project = await db.project.findFirst({
      where: {
        id: projectId,
        createdBy: userId,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    let uploadResult;
    const localFilePath = req.file?.path;

    if (req.file && !localFilePath) {
      return res.status(400).json({
        message: "File is missing",
      });
    }

    try {
      if (localFilePath) uploadResult = await uploadOnCloudinary(localFilePath);

      const task = await db.task.create({
        data: {
          title,
          description,
          projectId,
          assignedTo,
          assignedBy,
          status,
          priority,
          attachments: uploadResult ? uploadResult?.url : null,
        },
      });

      if (!task) {
        return res.status(400).json({
          message: "Problem while creating task",
        });
      }

      res.status(201).json({
        success: true,
        message: "Task created successfully",
        task,
      });
    } catch (error) {}
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { projectId } = req.params;

    let { limit = 10, page = 1 } = req.query;

    if (page <= 0) page = 1;
    if (limit <= 0 || limit >= 50) {
      limit = 10;
    }

    const skip = (page - 1) * limit;

    const existingProject = await db.project.findFirst({
      where: {
        id: projectId,
        createdBy: userId,
      },
    });

    if (!existingProject) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const tasks = await db.task.findMany({
      where: {
        projectId,
      },
      take: parseInt(limit),
      skip: parseInt(skip),
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        assignedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!tasks || tasks?.length === 0) {
      return res.status(404).json({
        message: "Tasks not found",
      });
    }

    const totalTasks = await db.task.count({});
    const totalPages = Math.ceil(totalTasks / limit);

    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      tasks,
      metadata: {
        totalPages,
        currentPage: page,
        currentLimit: limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error?.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const existingTask = await db.task.findUnique({
      where: {
        id,
      },
    });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const task = await db.task.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        status,
      },
    });

    if (!task) {
      return res.status(400).json({
        message: "Problem while updating task",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const existingTask = await db.task.findUnique({
      where: {
        id,
      },
    });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const task = await db.task.delete({
      where: {
        id,
      },
    });

    if (!task) {
      return res.status(400).json({
        message: "Problem while deleting task",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { createTask, getTasks, updateTask, deleteTask };
