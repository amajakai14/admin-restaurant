import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { isValidEmail, isValidPassword } from "../utils/input-validation";

import type { CreateUserInput } from "../schema/user.schema";
import { api } from "../utils/api";
import LoadingButton from "./LoadingButton";

const RegisterForm = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const mutation = api.user.register.useMutation({
    onError: (e) => setErrorMessage(e.message),
    onSuccess: () => router.push("/"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserInput>();

  const onSubmit: SubmitHandler<CreateUserInput> = async (data) => {
    setErrorMessage(undefined);
    if (!isValidEmail(data.email)) {
      setErrorMessage("invalid email");
      return;
    }

    if (!isValidPassword(data.password)) {
      setErrorMessage(
        "password must be at least 8 characters contains lowercase, uppercase, and number"
      );
      return;
    }

    await mutation.mutateAsync(data);
  };

  return (
    <div className="radius flex flex-col items-center gap-2 border p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        {errorMessage && (
          <p className="text-center text-red-600">{errorMessage}</p>
        )}
        <label>Email</label>
        <input
          className="rounded border py-1 px-4"
          type="text"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <p className="text-center text-red-600">This field is required</p>
        )}
        <label>Password</label>
        <input
          className="rounded border py-1 px-4"
          type="password"
          {...register("password", { required: true })}
        />
        {errors.password && (
          <p className="text-center text-red-600">This field is required</p>
        )}

        <label>Corporation</label>
        <input
          className="rounded border py-1 px-4"
          type="text"
          {...register("corporation", { required: true })}
        />
        {errors.password && (
          <p className="text-center text-red-600">This field is required</p>
        )}
        {mutation.isLoading ? (
          <LoadingButton />
        ) : (
          <input
            type="submit"
            className="rounded border py-1 px-4 hover:bg-slate-300 active:bg-slate-400"
          />
        )}
      </form>
    </div>
  );
};

export default RegisterForm;
