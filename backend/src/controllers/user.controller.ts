import type { NextFunction, Request, Response } from "express";
import {
  fetchOwnProfile,
  fetchUserProfile,
  editProfile,
  removeProfile,
  updateProfilePhoto,
} from "../services/user.service.js";
import { uploadProfilePhoto as uploadProfilePhotoToS3 } from "../services/s3.service.js";
import { getProfilePhotoUrl } from "../services/s3.service.js";

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.params.id as string;

    // Fetch the user data through our service layer
    const user = await fetchUserProfile(userId);

    if (!user || user.isDeleted) {
      res.status(404).json({
        success: false,
        message: "User profile not found",
      });
      return;
    }

    let profilePhotoUrl: string | null = null;

    if (user.profilePhoto) {
      profilePhotoUrl = await getProfilePhotoUrl(user.profilePhoto); // Important
    }

res.status(200).json({
  success: true,
  data: {
    ...user,
    profilePhoto: profilePhotoUrl,
  },
});
  } catch (error) {
    next(error); 
  }
};

export const getOwnProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const user = await fetchOwnProfile(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }
const { password: _, ...safeUser } = user;

let profilePhotoUrl: string | null = null;

if (user.profilePhoto) {
  profilePhotoUrl = await getProfilePhotoUrl(user.profilePhoto); // Important 

}

    res.status(200).json({
      success: true,
      data: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const { name, username, bio, interests, languageProficiency } = req.body;

    const updatedUser = await editProfile(userId, {
      name,
      username,
      bio,
      interests,
      languageProficiency,
    });

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: "User not updated.",
      });
      return;
    }

    const { password: _, ...safeUser } = updatedUser;

    res.status(200).json({
      success: true,
      data: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const user = await removeProfile(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const uploadProfilePhoto = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "Profile photo is required.",
      });
      return;
    }

    const key = await uploadProfilePhotoToS3(req.file);

    const updatedUser = await updateProfilePhoto(userId, key);

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Profile photo uploaded successfully.",
      data: {
        profilePhoto: updatedUser.profilePhoto,
      },
    });
  } catch (error) {
    next(error);
  }
};

