import { db } from "../libs/db.js";

const addCollaborator = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId, role } = req.body;

    const existing = await db.collaborator.findFirst({
      where: { projectId, userId, deletedAt: null },
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "User is already a collaborator" });
    }

    const collaborator = await db.collaborator.create({
      data: { userId, projectId, role },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        project: { select: { id: true, name: true } },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Collaborator added",
      collaborator,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};

const listCollaborators = async (req, res) => {
  try {
    const { projectId } = req.params;

    const collaborators = await db.collaborator.findMany({
      where: { projectId, deletedAt: null },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
      },
    });

    return res.status(200).json({ success: true, collaborators });
  } catch (error) {
    return res
      .status(500)
      .json({
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

    const existing = await db.collaborator.findFirst({
      where: { id: collaboratorId, projectId, deletedAt: null },
    });

    if (!existing) {
      return res.status(404).json({ message: "Collaborator not found" });
    }

    const collaborator = await db.collaborator.update({
      where: { id: collaboratorId },
      data: { role },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
      },
    });

    return res
      .status(200)
      .json({ success: true, message: "Collaborator updated", collaborator });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};

const removeCollaborator = async (req, res) => {
  try {
    const { projectId, collaboratorId } = req.params;

    const existing = await db.collaborator.findFirst({
      where: { id: collaboratorId, projectId, deletedAt: null },
    });

    if (!existing) {
      return res.status(404).json({ message: "Collaborator not found" });
    }

    const collaborator = await db.collaborator.update({
      where: { id: collaboratorId },
      data: { deletedAt: new Date() },
    });

    return res
      .status(200)
      .json({ success: true, message: "Collaborator removed", collaborator });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};

export {
  addCollaborator,
  listCollaborators,
  updateCollaborator,
  removeCollaborator,
};
