import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../../Api/api";
import {
  getPendingHouseholds,
  IHousehold,
  updateHousehold,
} from "../../db/models/Household";
import { getMembersbyHousehold } from "../../db/models/Member";
import { getAllUsers, IUser } from "../../db/models/UserModel";

export default function PendingData() {
  const educationBackgroundToStatusId: Record<string, number> = {
    never_school: 1,
    past_student: 2,
    current_student: 3,
    informal: 4,
  };

  const normalizeEducationStatusId = (value: any) => {
    if (typeof value === "number") {
      return value;
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed === "") {
        return value;
      }
      const asNumber = Number(trimmed);
      if (!Number.isNaN(asNumber)) {
        return asNumber;
      }
      if (educationBackgroundToStatusId[trimmed] !== undefined) {
        return educationBackgroundToStatusId[trimmed];
      }
    }
    return value;
  };

  const normalizeMemberForSync = (member: any) => ({
    ...member,
    education_status_id: normalizeEducationStatusId(member.education_status_id),
  });

  const [households, setHousholds] = useState([] as IHousehold[]);
  const [auth, setAuth] = useState({} as IUser);
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

  const getHouseholds = async (auth_: IUser) => {
    setLoading(true);
    let hhs = await getPendingHouseholds();
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

  const deleteHousehold = async (hh: any) => {
    setLoading(true);
    hh["members"] = await getMembersbyHousehold(hh.id);
    await updateHousehold({ ...hh, is_deleted: "1" });
    getHouseholds(auth);
    setLoading(false);
  };

  const postHousehold = async (hh: any) => {
    setLoading(true);
    if (window.navigator.onLine) {
      const members = await getMembersbyHousehold(hh.id);
      const payload: any = {
        ...hh,
        members: members.map((member: any) => ({
          ...normalizeMemberForSync(member),
          member_id: member.member_id,
        })),
      };
      // These fields are no longer needed by API payload for household sync.
      delete payload.hoh;
      delete payload.hoh_first_name;
      delete payload.hoh_last_name;
      delete payload.hoh_contact_num;
      delete payload.hoh_gender;
      delete payload.house_num;
      delete payload.num_of_member;
      delete payload.longitude;
      delete payload.latitude;
      if (hh.server_household_id) {
        payload.household_id = hh.server_household_id;
        payload.server_household_id = hh.server_household_id;
      } else if (typeof hh.id_string === "string" && hh.id_string.startsWith("server-")) {
        const serverId = hh.id_string.replace("server-", "");
        payload.household_id = serverId;
        payload.server_household_id = serverId;
      }
      try {
        let res = await api.postHousehold(payload);
        if (res.status === 200) {
          await updateHousehold({ ...hh, is_posted: 1 });
        } else {
          alert(res.data.message);
        }
        getHouseholds(auth);
      } catch (e: any) {
        alert(e.toString());
      }
    } else {
      alert("Please connect to WIFI!");
    }
    setLoading(false);
  };

  const checkUser = async () => {
    let auth_ = await getAllUsers();
    if (auth_.length) {
      setAuth({ ...auth_[0] });
      getHouseholds(auth_[0]);
    }
  };

  if (loading) {
    return <div className="vp-home">Sending...</div>;
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
                    <>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteHousehold(hh)}
                      >
                        Delete
                      </button>
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
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => postHousehold(hh)}
                      >
                        Send
                      </button>
                    </>
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
