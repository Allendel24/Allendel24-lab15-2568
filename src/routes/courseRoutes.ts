import { Router, type Request, type Response } from "express";
import { courses } from "../db/db.js";
import {
    zCourseId,
    zCoursePostBody,
    zCoursePutBody,
    zCourseDeleteBody
} from "../schemas/courseValidator.js"
import { type Course } from "../libs/types.js";

const router: Router = Router();

// READ all
router.get("/courses", (req: Request, res: Response) => {
    try {
        return res.status(200).json(courses);
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something is wrong, please try again",
            error: err
        })
    }
});

// Params URL 
router.get("/courses/:courseId", (req: Request, res: Response) => {
    try {
        const courseId = Number(req.params.courseId);
        const result = zCourseId.safeParse(courseId);

        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.issues[0]?.message,
            });
        }

        //check duplicate studentId
        const foundIndex = courses.findIndex(
            (course) => course.courseId === courseId
        );
        if (foundIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Student is already exists",
            });
        }

        // add new student

        // add response header 'Link'
        res.set("Link", `/students/${courseId}`);

        return res.json({
            success: true,
            message: `Get student ${courseId}`,
            data: courses[foundIndex],
        });
        // return res.json({ ok: true, message: "successfully" });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Somthing is wrong, please try again",
            error: err,
        });
    }
});

router.post("/courses", (req: Request, res: Response) => {
    try {
        const body = req.body as Course;

        const result = zCoursePostBody.safeParse(body); // check zod
        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.issues[0]?.message,
            });
        }

        const foundCourses = courses.find(
            (course) => course.courseId === body.courseId
        );
        if (foundCourses) {
            return res.status(409).json({
                success: false,
                message: "Course Id already exists",
            });
        }
        // add new student
        const new_course = body;
        courses.push(new_course);

        // add response header 'Link'
        res.set("Link", `/courses/${new_course.courseId}`);

        return res.status(201).json({
            success: true,
            message: `Course ${body.courseId} has been added successfully`,
            data: new_course,
        });
    } catch (err) {
        return res.json({
            success: false,
            message: "Somthing is wrong, please try again",
            error: err,
        });
    }
});

router.put("/courses", (req:Request, res:Response) => {
  try {
    const body = req.body as Course;

    // validate req.body with predefined validator
    const result = zCoursePutBody.safeParse(body); 
    if (!result.success) {
      return res.status(400).json({
        success : false,
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
      });
    }

    //check duplicate studentId
    const foundCourse = courses.findIndex(
      (course) => course.courseId === body.courseId
    );

    if (foundCourse === -1) {
      return res.status(404).json({
        success: false,
        message: "Course Id does not exists",
      });
    }

    // update student data
    courses[foundCourse] = { ...courses[foundCourse], ...body };

    // add response header 'Link'
    res.set("Link", `/courses/${body.courseId}`);

    return res.json({
      success: true,
      message: `Course ${body.courseId} has been updated successfully`,
      data: courses[foundCourse],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: err,
    });
  }
});

router.delete("/courses",(req:Request, res:Response) => {
  try {
    const body = req.body;
    const parseResult = zCourseDeleteBody.safeParse(body);

    if (!parseResult.success) {
      return res.status(400).json({
        success : false,
        message: "Validation failed",
        errors: parseResult.error.issues[0]?.message,
      });
    }

    //check duplicate studentId
    const foundCourses = courses.findIndex(
      (course) => course.courseId === body.courseId
    );

    if (foundCourses === -1) {
      return res.status(404).json({
        success: false,
        message: "Course Id does not exists",
      });
    }
    
    const deletedCourse = courses[foundCourses];
    // delete found student from array
    courses.splice(foundCourses, 1);
    res.set("Link", `/courses/${body.courseId}`);
    res.status(200).json({
      success: true,
      message: `Course ${body.courseId} has been deleted successfully`,
      data: deletedCourse
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: err,
    });
  }
});

export default router;
