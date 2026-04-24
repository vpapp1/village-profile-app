import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getSentHouseholds, IHousehold } from "../../db/models/Household";
import { getMembersbyHousehold } from "../../db/models/Member";
import { getAllUsers } from "../../db/models/UserModel";

export default function SentData() {
  const [households, setHousholds] = useState([] as IHousehold[]);
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  useEffect(() => {
    checkUser();
  }, []);

  const getHouseholdCode = (hh: any) => {
    return hh.household_id ?? hh.id_string ?? hh.id;
  };

  const getHouseholdHead = (hh: any) => {
    const members = hh.members ?? [];
    const hohMember =
      members.find((member: any) => `${member?.is_hoh ?? ""}` === "1") ??
      members.find((member: any) => `${member?.relation_with_hoh_id ?? ""}` === "1");

    if (hohMember) {
      return `${hohMember?.first_name ?? ""} ${hohMember?.last_name ?? ""}`.trim();
    }

    return `${hh?.hoh_first_name ?? ""} ${hh?.hoh_last_name ?? ""}`.trim();
  };

  const getHouseholdMobile = (hh: any) => {
    const members = hh.members ?? [];
    const hohMember =
      members.find((member: any) => `${member?.is_hoh ?? ""}` === "1") ??
      members.find((member: any) => `${member?.relation_with_hoh_id ?? ""}` === "1");

    return hohMember?.mobile_num ?? hohMember?.phone_num ?? hh.hoh_contact_num ?? hh.mobile_num ?? "-";
  };

  const getActiveMemberCount = (hh: any) => {
    const members = hh.members ?? [];
    return members.filter(
      (member: any) => `${member?.status ?? ""}` !== "0" && `${member?.status ?? ""}` !== "2"
    ).length;
  };

  const getHouseholds = async () => {
    setLoading(true);
    const hhs = await getSentHouseholds();
    const hhWithMembers = await Promise.all(
      hhs.map(async (hh) => {
        const members = await getMembersbyHousehold(`${hh.id}`);
        return {
          ...hh,
          members,
        };
      })
    );
    setHousholds([...hhWithMembers]);
    setLoading(false);
  };

  const checkUser = async () => {
    const auth_ = await getAllUsers();
    if (auth_.length) {
      getHouseholds();
    }
  };

  if (loading) {
    return <div className="vp-home">Loading...</div>;
  }

  return (
    <div className="pending-data-page">
      <button
        className="btn btn-warning back-btn"
        onClick={() => history.goBack()}
      >
        Back
      </button>
      <div className="pending-data-table-wrap">
        <table className="table table-striped table-bordered table-hover pending-data-table">
          <thead>
            <tr>
              <th>S.N.</th>
              <th>Household ID</th>
              <th>Household Name</th>
              <th>Household Mobile</th>
              <th>Total Members</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {households.length ? (
              households.map((hh, key) => (
                <tr key={key}>
                  <td>{++key}</td>
                  <td>{getHouseholdCode(hh)}</td>
                  <td>
                    <p>{getHouseholdHead(hh) || "-"}</p>
                  </td>
                  <td>{getHouseholdMobile(hh)}</td>
                  <td>{getActiveMemberCount(hh)}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() =>
                        history.push("/village-profile-app/app/edit/" + hh.id)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() =>
                        history.push("/village-profile-app/app/view/" + hh.id)
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>No Data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
