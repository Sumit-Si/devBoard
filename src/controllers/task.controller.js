import { db } from "../libs/db.js";

const createTask = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { projectId } = req.params;
    const { title, description, assignedTo, assignedBy } = req.body;

    const project = await db.projects.findUnique({
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

    const task = await db.tasks.create({
      data: {
        title,
        description,
        assignedTo,
        projectId,
        assignedBy,
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

    const existingProject = await db.projects.findUnique({
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

    const tasks = await db.tasks.findMany({
      where: {
        projectId,
      },
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

    if (!tasks) {
      return res.status(404).json({
        message: "Tasks not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const existingTask = await db.tasks.findUnique({
      where: {
        id,
      },
    });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const task = await db.tasks.update({
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

    const existingTask = await db.tasks.findUnique({
      where: {
        id,
      },
    });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const task = await db.tasks.delete({
      where: {
        id,
      }
    })

    if(!task) {
      return res.status(400).json({
        message: "Problem while deleting task",
      })
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      task,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { createTask, getTasks, updateTask, deleteTask };
