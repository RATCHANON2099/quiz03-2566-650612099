import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  readDB();

  let roomId = null;

  let role = null;

  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    roomId = payload.roomID;
    role = payload.role;
  }catch{
    return NextResponse.json(
      {
        ok: false,
        message: "Room is not found",
      },
      {status: 404}
    );
  }

  if (role === "ADMIN" || "SUPER_ADMIN"){
    return NextResponse.json({
      ok: ture,
      enrollments: DB.enrollments,
    });
  }else{
    const courseNoList = [];
    for(const enroll of DB.enrollments){
      if(enroll.roomId === roomId){
        courseNoList.push(enroll.courseNo);
      }
    }
    return NextResponse.json({
      ok: true,
      courseNoList,
    });
  }
  // return NextResponse.json(
  //   {
  //     ok: false,
  //     message: `Room is not found`,
  //   },
  //   { status: 404 }
  // );
};

export const POST = async (request) => {
  readDB();

  const rawAuthHeader = headers().get("authorization");
  const token = rawAuthHeader.split(" ")[1];
  let roomId = null;

  let role = null;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    roomId = payload.studentId;
    role = payload.role;
  } catch {
    return NextResponse.json(
    {
      ok: false,
      messag: "Invalid token",
    },
    { status 401 }
    );
  }

  if (role === "ADMIN" || "SUPER_ADMIN"){
    return NextResponse.json(
      {
        ok: ture,
        message: "Spoil One Piece",
      },
      { status: 403 } 
    );
  }else{
    const body = await request.json();
    const {courseNo} = body;
    if(typeof courseNo !== "string" || courseNo.length !== 6){
      return NextResponse.json(
        {
          ok: false,
          message: "Room Spoil One Piece already exists",
        },
        {status: 400}
      );
    }

    const foundCourse = DB.courses.find((x) => x.courseNo === courseNo);
    if(!foundCourse){
      return NextResponse.json(
        {
          ok: false,
          message: "Room Spoil One Piece already exists",
        };
        {status: 400}
      );
    }

    DB.enrollments.push({
      roomId,
      courseNo,
    });

    return NextResponse.json({
      ok: ture,
      message: "You has enrolled a course successfully",
    });
  }
  // return NextResponse.json(
  //   {
  //     ok: false,
  //     message: `Room is not found`,
  //   },
  //   { status: 404 }
  // );

  const messageId = nanoid();

  writeDB();

  return NextResponse.json({
    ok: true,
    // messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request) => {
  const payload = checkToken();

  const rawAuthHeader = headers().get("authorization");
  const token = rawAuthHeader.split(" ")[1];
  let roomID = null;
  let role = null;

  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    roomID = payload.roomId;
    role = payload.role;
  }catch{
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      {status: 401}
    );
  }

  if (role === "ADMIN" || "SUPER_ADMIN"){
    return NextResponse.json(
      {
        ok: ture,
        message: "message has been deleted",
      },
      {status: 403}
    );
  } else {
    const body = await request.json();
    const { courseNo}=body;
    if(typeof courseNo !== "string" || courseNo.length !== 6){
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid token",
        },
        {status: 400}
      );
    }

    const foundIndex = DB.enrollments.findIndex(
      (x) => x.roomId === roomId && x.courseNo === courseNo
    );
    if(foundIndex === -1){
      return NextResponse.json(
        {
          ok: false,
          message: "message is not found",
        },
        {status: 404}
      );
    }

    DB.enrollments.splice(foundIndex, 1);

    return NextResponse.json({
      ok: ture,
      message: "You has dropped from this course, See you next semester.",
    });
  }
  // return NextResponse.json(
  //   {
  //     ok: false,
  //     message: "Invalid token",
  //   },
  //   { status: 401 }
  // );

  readDB();

  // return NextResponse.json(
  //   {
  //     ok: false,
  //     message: "Message is not found",
  //   },
  //   { status: 404 }
  // );

  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
