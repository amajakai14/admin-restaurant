import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { isValidTableName } from "../../utils/input-validation";

import type { CreateTableInput } from "../../schema/table.schema";
import { api } from "../../utils/api";

const TableRegisterForm = ({
  refetchStaff,
  setRefetchStaff,
}: {
  refetchStaff: boolean;
  setRefetchStaff: Dispatch<SetStateAction<boolean>>;
}) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const mutation = api.desk.register.useMutation({
    onError: (e) => setErrorMessage(e.message),
    onSuccess: () => {
      setRefetchStaff(!refetchStaff);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTableInput>();

  const onSubmit: SubmitHandler<CreateTableInput> = async (data) => {
    setErrorMessage(undefined);
    if (!isValidTableName(data.table_name)) {
      setErrorMessage("invalid table name");
      return;
    }
    await mutation.mutateAsync(data);
  };

  return (
    <div className="radius flex items-center gap-2 border p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        {errorMessage && (
          <p className="text-center text-red-600">{errorMessage}</p>
        )}
        <label>Table Name</label>
        <input
          className="rounded border py-1 px-4"
          type="text"
          {...register("table_name", { required: true })}
        />
        {errors.table_name && (
          <p className="text-center text-red-600">This field is required</p>
        )}

        <input type="submit" className="rounded border py-1 px-4" />
      </form>
    </div>
  );
};

export default TableRegisterForm;
