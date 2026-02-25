import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  getAllHousehold,
  IHousehold,
  updateHousehold,
} from "../../db/models/Household";
import { getMembersbyHousehold } from "../../db/models/Member";

export default function AllData() {
  const [households, setHousholds] = useState([] as IHousehold[]);
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getHouseholds();
  }, []);

  const getHouseholds = async () => {
    let hhs = await getAllHousehold();
    let hhWithMembers = [] as IHousehold[];
    await Promise.all(
      hhs.map(async (hh) => {
        await getMembersbyHousehold(hh.id.toString());
        hhWithMembers.push(hh);
      })
    );
    setHousholds([...hhWithMembers]);
  };

  const getHouseholdCode = (hh: any) => {
    return hh.household_id ?? hh.id_string ?? hh.id;
  };

  const getHouseholdMobile = (hh: any) => {
    return hh.hoh_contact_num ?? hh.mobile_num ?? "-";
  };

  const unDeleteHousehold = async (hh: any) => {
    setLoading(true);
    hh["members"] = await getMembersbyHousehold(hh.id);
    await updateHousehold({ ...hh, is_deleted: "0" });
    getHouseholds();
    setLoading(false);
  };

  if (loading) {
    return <div className="vp-home">Loading...</div>;
  }

  return (
    <div>
      <button
        className="btn btn-warning back-btn"
        onClick={() => history.goBack()}
      >
        Back
      </button>
      <table className="table table-striped table-bordered table-hover">
        <thead>
          <tr>
            <th>S.N.</th>
            <th>Household ID</th>
            <th>Household Name</th>
            <th>Household Mobile</th>
            <th>Total Members</th>
            <th>Sent</th>
            <th>Complete</th>
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
                  <p>{hh.hoh_first_name} {hh.hoh_last_name}</p>
                </td>
                <td>{getHouseholdMobile(hh)}</td>
                <td>{hh.members?.length ?? 0}</td>
                <td>{hh.is_posted == "1" ? "Yes" : "No"}</td>
                <td>{hh.is_complete == "1" ? "Yes" : "No"}</td>
                <td>
                  {hh.is_deleted == "1" && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => unDeleteHousehold(hh)}
                    >
                      Undelete
                    </button>
                  )}
                  {hh.is_posted == "0" && hh.is_deleted == "0" && (
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() =>
                        history.push("/village-profile-app/app/edit/" + hh.id)
                      }
                    >
                      Edit
                    </button>
                  )}
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
              <td colSpan={8}>No Data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
