import { Router, type Request, type Response } from "express";
import { students, courses } from "../db/db.js";
import { zStudentId } from "../schemas/studentValidator.js"

const router = Router();

router.get("/students", (req:Request,  res:Response ) => {
    try{
      return res.status(200).json(students);
    }catch (err){
      return res.status(500).json({
        success : false,
        message : "Something is wrong, please try again",
        error : err
      })
    }
});

router.get("/students/:studentId", (req: Request, res: Response) => {
    try {
        const studentId = req.params.studentId;
        const result = zStudentId.safeParse(studentId);

        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.issues[0]?.message,
            });
        }

        //check duplicate studentId
        const foundIndex = students.findIndex(
            (student) => student.studentId === studentId
        );
        if (foundIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Student is already exists",
            });
        }

        // add new student

        // add response header 'Link'
        res.set("Link", `/students/${studentId}`);

        return res.json({
            success: true,
            message: `Get student ${studentId}`,
            data: students[foundIndex],
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

router.get("/students/:studentId/courses", (req:Request, res:Response) => {
  try {
    const studentId = req.params.studentId;
    const result = zStudentId.safeParse(studentId);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
      });
    }

    const foundIndex = students.findIndex(
      (student) => student.studentId === studentId
    );

    if (foundIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Student does not exists",
      });
    }

    
    const havecourse = courses.filter((course) =>
      students[foundIndex]?.courses?.includes(course.courseId)
    ).map(c => ({
      courseId: c.courseId,
      courseTitle: c.courseTitle
    }));

    res.set("Link", `/students/${studentId}`);
    res.status(200).json({
      success: true,
      message : `Get courses detail of student ${studentId}`,
      data : {
        studentId : studentId,
        courses : havecourse,
      }
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
});

export default router;
