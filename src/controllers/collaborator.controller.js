import { db } from "../libs/db.js";

const addCollaborator = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId, role } = req.body;

    const existing = await db.collaborator.findFirst({
      where: {
        projectId,
        userId,
        deletedAt: null,
      },
    });

    if (existing) {
      return res.status(400).json({ message: "Already a collaborator" });
    }

    const collaborator = await db.collaborator.create({
      data: {
        userId,
        projectId,
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Collaborator successfully added",
      collaborator,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getCollaborators = async (req, res) => {
  const { projectId } = req.params;
  let { limit = 10, page = 1 } = req.query;

  if (page <= 0) page = 1;
  if (limit <= 0 || limit >= 50) {
    limit = 10;
  }

  const skip = (page - 1) * limit;

  try {
    const collaborators = await db.collaborator.findMany({
      where: {
        projectId,
        deletedAt: null,
      },
      take: parseInt(limit),
      skip: parseInt(skip),
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!collaborators || collaborators?.length === 0) {
      return res.status(404).json({
        message: "Collaborators not found",
      });
    }

    const totalCollaborators = await db.collaborator.count({});
    const totalPages = Math.ceil(totalCollaborators / limit);

    return res.status(200).json({
      success: true,
      message: "Collaborators fetched successfully",
      collaborators,
      metadata: {
        totalPages,
        currentPage: page,
        currentLimit: limit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateCollaborator = async (req, res) => {
  try {
    const { projectId, collaboratorId } = req.params;
    const { role } = req.body;

    const existingCollaborator = await db.collaborator.findFirst({
      where: {
        id: collaboratorId,
        projectId,
        deletedAt: null,
      },
    });

    if (!existingCollaborator) {
      return res.status(404).json({ message: "Collaborator not found" });
    }

    const collaborator = await db.collaborator.update({
      where: {
        id: collaboratorId,
      },
      data: {
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!collaborator) {
      return res.status(500).json({
        message: "Problem while updating collaborator",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Collaborator updated successfully",
      collaborator,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteCollaborator = async (req, res) => {
  try {
    const { projectId, collaboratorId } = req.params;

    const existing = await db.collaborator.findFirst({
      where: {
        id: collaboratorId,
        projectId,
        deletedAt: null,
      },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Collaborator not found",
      });
    }

    const collaborator = await db.collaborator.update({
      where: {
        id: collaboratorId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    if(!collaborator) {
      return res.status(500).json({
      message: "Problem while deleting collaborator",
    });
    }

    return res.status(200).json({
      success: true,
      message: "Collaborator deleted successfully",
      collaborator,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export {
  addCollaborator,
  getCollaborators,
  updateCollaborator,
  deleteCollaborator,
};
