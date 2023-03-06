import { type Course, type CourseOnMenu, type Menu } from "@prisma/client";
import { useState } from "react";
import { type CoursesOnMenus } from "../../server/api/repository/course.repository";
import { api } from "../../utils/api";
import LoadingButton from "../LoadingButton";

const CourseMatchMenuTable = ({
  data,
}: {
  data: { menus: Menu[]; courses: Course[]; course_on_menu: CourseOnMenu[] };
}) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  const courses = data.courses;
  const menus = data.menus;
  const courseMapMenu: CoursesOnMenus = data.course_on_menu.map(
    (courseOnMenu) => {
      return {
        menu_id: courseOnMenu.menu_id,
        course_id: courseOnMenu.course_id,
      };
    }
  );

  const [courseOnMenus, setCourseOnMenu] = useState<CoursesOnMenus | undefined>(
    courseMapMenu
  );
  const mutation = api.course.mapMenuToCourse.useMutation({
    onError: (e) => setErrorMessage(e.message),
    onSuccess: () => setErrorMessage("saved"),
  });

  async function handleMatcher() {
    await mutation.mutateAsync(courseOnMenus);
  }

  function onToggle(menu_id: number, course_id: number) {
    setErrorMessage(undefined);
    if (courseOnMenus == null) {
      setCourseOnMenu([{ menu_id, course_id }]);
      return;
    }
    const result = courseOnMenus.some((value) => {
      return value.menu_id === menu_id && value.course_id === course_id;
    });
    if (result) {
      const idx = courseOnMenus.findIndex(
        (val) => val.menu_id === menu_id && val.course_id === course_id
      );
      const filtered = courseOnMenus.filter((val, index) => index !== idx);
      setCourseOnMenu(filtered);
    } else {
      const matching = courseOnMenus.concat({
        menu_id,
        course_id,
      });
      setCourseOnMenu(matching);
    }
  }
  if (menus.length === 0 || courses.length === 0) {
    return <p>Please Add some menus and courses before do the matching</p>;
  }
  return (
    <>
      {errorMessage && (
        <p className="text-center text-red-600">{errorMessage}</p>
      )}
      <table>
        <thead>
          <tr className="border-2 border-black">
            <th className="border-2 border-black"></th>
            <th className="border-2 border-black"></th>
            {courses &&
              courses.map((course) => (
                <th key={course.id} className="border-2 border-black px-2">
                  {course.course_name}
                </th>
              ))}
          </tr>
        </thead>
        <tbody className="border-2 border-black">
          {menus &&
            menus.map((menu) => (
              <tr key={menu.id}>
                <td className="border-2 border-black px-2">{menu.id}</td>
                <td className="border-2 border-black px-2">{menu.menu_type}</td>
                {courses &&
                  courses.map((course) => {
                    const registered =
                      courseOnMenus &&
                      courseOnMenus.some(
                        (courseOnMenu) =>
                          courseOnMenu.menu_id === menu.id &&
                          courseOnMenu.course_id === course.id
                      );
                    return (
                      <td
                        key={course.id}
                        className="border-2 border-black px-2"
                      >
                        <button onClick={() => onToggle(menu.id, course.id)}>
                          {registered ? "✔" : "✖"}
                        </button>
                      </td>
                    );
                  })}
              </tr>
            ))}
        </tbody>
      </table>
      {mutation.isLoading ? (
        <LoadingButton />
      ) : (
        <button onClick={() => handleMatcher}>Save</button>
      )}
    </>
  );
};

export default CourseMatchMenuTable;
