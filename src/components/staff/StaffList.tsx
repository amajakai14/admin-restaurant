import { useState } from "react";
import type { TStaff } from "../../pages/admin/staff";
import CustomPagination from "../CustomPagination";

const StaffList = ({ staffList }: { staffList: TStaff[] | undefined }) => {
  const perPage = 10;
  const [page, setPage] = useState(1);

  if (!staffList) return <div></div>;
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const staffInPage = staffList.slice(start, end);
  return (
    <div>
      <table className="border-2 border-black">
        <thead className="border-2 border-black ">
          <tr>
            <th className="border-2 border-black px-2">name</th>
            <th className="border-2 border-black px-2">mail address</th>
          </tr>
        </thead>
        <tbody className="border-2 border-black px-2">
          {staffList &&
            staffInPage.map((staff) => (
              <tr key={staff.id} className="border-2 border-black">
                <td className="border-2 border-black px-2">
                  {staff.name ? staff.name : "No name registered"}
                </td>
                <td className="border-2 border-black px-2">{staff.email}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <CustomPagination
        perPage={perPage}
        dataCount={staffList.length}
        setPage={setPage}
      />
    </div>
  );
};
export default StaffList;
