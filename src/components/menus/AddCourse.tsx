import { Course } from "@prisma/client";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { CreateCourseInput } from "../../server/api/repository/course.repository";
import { api } from "../../utils/api";
import { isValidPrice } from "../../utils/input.validation";
import LoadingButton from "../LoadingButton";

const AddCourse = () => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const mutation = api.course.register.useMutation({
    onError: (e) => setErrorMessage(e.message),
    onSuccess: (data) => console.log(data),
  });

  const fetchMenu = api.course.get.useQuery();
  const courses = fetchMenu.data?.result;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCourseInput>();

  const onSubmit: SubmitHandler<CreateCourseInput> = async (data) => {
    setErrorMessage(undefined);
    if (!isValidPrice(data.course_timelimit)) {
      setErrorMessage("price should be a positive number");
      return;
    }
    await mutation.mutateAsync(data);
    if (mutation.isError) {
      setErrorMessage(mutation.error.message);
      return;
    }
    await fetchMenu.refetch();
  };

  return (
    <div className="w-full p-4">
      <div className="flex flex-col items-center border py-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          {errorMessage && (
            <p className="text-center text-red-600">{errorMessage}</p>
          )}
          <label>Course name</label>
          <input
            className="rounded border py-1 pr-4"
            type="text"
            {...register("course_name", { required: true })}
          />
          {errors.course_name && (
            <p className="text-center text-red-600">This field is required</p>
          )}
          <label>Course price</label>
          <input
            className="rounded border py-1 px-4"
            type="text"
            {...register("course_price", {
              required: true,
              valueAsNumber: true,
            })}
          />
          {errors.course_price && (
            <p className="text-center text-red-600">This field is required</p>
          )}
          <label>Timelimit</label>
          <input
            className="rounded border py-1 px-4"
            type="text"
            defaultValue={90}
            {...register("course_timelimit", {
              required: true,
              valueAsNumber: true,
            })}
          />
          {mutation.isLoading ? (
            <LoadingButton />
          ) : (
            <input type="submit" className="rounded border py-1 px-4" />
          )}
        </form>
      </div>
      {courses && <CourseTable courses={courses} />}
    </div>
  );
};

export default AddCourse;

const CourseTable = ({ courses }: { courses: Course[] }) => {
  return (
    <div className="flex w-full justify-between py-2 text-sm sm:text-lg">
      <table>
        <thead>
          <tr className="text-left">
            <th className=" px-2">Course Name</th>
            <th className="px-2">Time (Minute)</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => {
            return (
              <tr key={course.id} className="px-2">
                <td className="px-2 text-left">{course.course_name}</td>
                <td className="px-2 text-left">{course.course_timelimit}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
