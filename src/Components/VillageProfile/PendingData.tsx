import { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../../Api/api";
import {
  getPendingHouseholds,
  IHousehold,
  updateHousehold,
} from "../../db/models/Household";
import { getMembersbyHousehold } from "../../db/models/Member";
import { getAllUsers, IUser } from "../../db/models/UserModel";
import { getAllBasti } from "../../db/models/BastiModel";
import { getAllMarga } from "../../db/models/MargaModel";
import {
  HOUSEHOLD_PAGE_SIZE,
  getActiveMemberCount,
  getHouseholdHead,
  getHouseholdLocation,
  getHouseholdMobile,
  getPageCount,
  householdMatchesSearch,
} from "./householdListUtils";

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

  const isNumericRef = (value: any) => {
    return value !== undefined && value !== null && `${value}`.trim() !== "" && !Number.isNaN(Number(value));
  };

  const pickFields = (source: any, fields: string[]) => {
    return fields.reduce((payload: any, field) => {
      if (source[field] !== undefined) {
        payload[field] = source[field];
      }
      return payload;
    }, {});
  };

  const householdSyncFields = [
    "server_household_id",
    "household_id",
    "id_string",
    "ward_id",
    "sabikWard_id",
    "basti_id",
    "marga_id",
    "religion_id",
    "jaati_samuha_id",
    "jaati_id",
    "mother_tongue_id",
    "main_occupation",
    "resident_type",
    "resident_origin_type",
    "origin_district_id",
    "origin_country_id",
    "resident_district",
    "migration_date",
    "origin_member_count",
    "is_responder_member",
    "responder_member_name",
    "responder_name",
    "has_foreign_member",
    "has_missing_deceased_member",
    "has_chronic_disease",
    "has_disability",
    "has_vehicle",
    "has_technical_training",
    "has_business",
    "has_pregchild_health",
    "has_pregnant_member",
    "has_pregnancy_test",
    "pregnancy_test_count",
    "has_maternity_member",
    "has_maternity_test",
    "maternity_location",
    "has_maternity_death",
    "maternity_death_condition",
    "child_death",
    "child_death_condition",
    "child_death_count",
    "has_bank_account",
    "has_health_insurance",
    "has_life_insurance",
    "has_cooperative_account",
    "has_smartphone",
    "nearest_road_distance_minute",
    "public_vehicle_distance_minute",
    "nearest_hospital_distance",
    "hospital_distance_minute",
    "primary_distance",
    "secondary_distance",
    "higher_secondary_distance",
    "hoh_income_amount",
    "hoh_expense_amount",
    "agriculture_situation",
    "feelings_for_local_government",
    "gov_complaint",
    "form_complaint",
    "remarks",
    "user_id",
    "office_id",
  ];

  const memberSyncFields = [
    "first_name",
    "last_name",
    "mobile_num",
    "phone_num",
    "gender_id",
    "relation_with_hoh_id",
    "dob_bs",
    "age",
    "education_status_id",
    "education_stage_id",
    "education_level_id",
    "education_faculty",
    "education_leave_reason",
    "main_occupation_id",
    "other_occupation_id",
    "profession_category_id",
    "profession_id",
    "profession_type",
    "main_work_last_12_months",
    "employment_status",
    "employment_occupation",
    "employment_notes",
    "resident_place",
    "is_married",
    "marital_status_id",
    "spouse_id",
    "age_on_marriage",
    "enroll_type",
    "has_informal_education",
    "has_technical_training",
    "has_voter_card",
    "voter_card_location",
    "has_bank_account",
    "has_health_insurance",
    "has_life_insurance",
    "has_cooperative_account",
    "has_smartphone",
    "status",
    "presence_status",
    "remove_reason",
    "remarks",
  ];

  const buildHouseholdSyncPayload = (hh: any, members: any[]) => {
    const payload = {
      ...pickFields(hh, householdSyncFields),
      local_id: hh.id,
      members: members.map((member: any, index: number) => {
        const normalizedMember = normalizeMemberForSync(member);
        const memberPayload: any = {
          ...pickFields(normalizedMember, memberSyncFields),
          local_id: normalizedMember.id ?? `idx-${index}`,
        };

        const serverMemberId = normalizedMember.server_member_id ?? normalizedMember.member_id;
        if (isNumericRef(serverMemberId)) {
          memberPayload.server_member_id = Number(serverMemberId);
        }

        if (normalizedMember.id_string) {
          memberPayload.id_string = normalizedMember.id_string;
        }

        return memberPayload;
      }),
    };

    if (hh.server_household_id) {
      payload.server_household_id = hh.server_household_id;
    } else if (typeof hh.id_string === "string" && hh.id_string.startsWith("server-")) {
      payload.id_string = hh.id_string;
    }

    const nestedCollections = [
      "foreign_members",
      "technical_skills_members",
      "chronic_disease_members",
      "disability_members",
      "vehicles",
      "lands",
      "businesses",
    ];

    nestedCollections.forEach((field) => {
      if (Array.isArray(hh[field])) {
        payload[field] = hh[field].map((item: any) => ({ ...item }));
      }
    });

    return payload;
  };

  const getBackendHouseholdId = (source: any) =>
    source?.household_id ?? source?.houshold_id ?? source?.househol_id;

  const [households, setHousholds] = useState([] as IHousehold[]);
  const [auth, setAuth] = useState({} as IUser);
  const [loading, setLoading] = useState(false);
  const [confirmDeleteHouseholdId, setConfirmDeleteHouseholdId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [bastiNames, setBastiNames] = useState({} as Record<string, string>);
  const [margaNames, setMargaNames] = useState({} as Record<string, string>);

  const history = useHistory();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, households.length]);

  const getHouseholdCode = (hh: any) => {
    return `${getBackendHouseholdId(hh) ?? ""}`.trim();
  };

  const canDeleteHousehold = (hh: any) => getHouseholdCode(hh) === "";

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

  const loadLocationNames = async () => {
    const [bastis, margas] = await Promise.all([getAllBasti(), getAllMarga()]);
    setBastiNames(
      bastis.reduce((names: Record<string, string>, basti: any) => {
        names[`${basti.id}`] = basti.name;
        return names;
      }, {})
    );
    setMargaNames(
      margas.reduce((names: Record<string, string>, marga: any) => {
        names[`${marga.id}`] = marga.name;
        return names;
      }, {})
    );
  };

  const deleteHousehold = async (hh: any) => {
    if (!canDeleteHousehold(hh)) {
      alert("This household already has a backend household ID and cannot be deleted from pending.");
      return;
    }
    setLoading(true);
    hh["members"] = await getMembersbyHousehold(hh.id);
    await updateHousehold({ ...hh, is_deleted: "1" });
    setConfirmDeleteHouseholdId("");
    getHouseholds(auth);
    setLoading(false);
  };

  const postHousehold = async (hh: any) => {
    setLoading(true);
    if (window.navigator.onLine) {
      const members = await getMembersbyHousehold(hh.id);
      const payload = buildHouseholdSyncPayload(hh, members);
      try {
        let res = await api.postHousehold(payload);
        if (res.status === 200) {
          const responseHouseholdId = getBackendHouseholdId(res.data);
          await updateHousehold({
            ...hh,
            is_posted: "1",
            is_deleted: "0",
            household_id: responseHouseholdId ?? hh.household_id,
            server_household_id: res.data?.id ?? hh.server_household_id,
            id_string: res.data?.id ? `server-${res.data.id}` : hh.id_string,
          });
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
    loadLocationNames();
    let auth_ = await getAllUsers();
    if (auth_.length) {
      setAuth({ ...auth_[0] });
      getHouseholds(auth_[0]);
    }
  };

  const filteredHouseholds = useMemo(
    () =>
      households.filter((hh) =>
        householdMatchesSearch(hh, searchText, bastiNames, margaNames)
      ),
    [households, searchText, bastiNames, margaNames]
  );
  const pageCount = getPageCount(filteredHouseholds.length);
  const safeCurrentPage = Math.min(currentPage, pageCount);
  const paginatedHouseholds = filteredHouseholds.slice(
    (safeCurrentPage - 1) * HOUSEHOLD_PAGE_SIZE,
    safeCurrentPage * HOUSEHOLD_PAGE_SIZE
  );

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
        <h3 className="household-list-title">Pending Data</h3>
        <div className="household-list-toolbar">
          <input
            className="form-control household-list-search"
            placeholder="Search by household ID, name, contact, basti, or tole"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
          <span>
            Showing {paginatedHouseholds.length} of {filteredHouseholds.length}
          </span>
        </div>
        <table className="table table-striped table-bordered table-hover pending-data-table">
          <thead>
            <tr>
              <th>S.N.</th>
              <th>Household ID</th>
              <th>Household Name</th>
              <th>Household Mobile</th>
              <th>Basti / Tole</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedHouseholds.length ? (
              paginatedHouseholds.map((hh, key) => (
                <tr key={key}>
                  <td>{(safeCurrentPage - 1) * HOUSEHOLD_PAGE_SIZE + key + 1}</td>
                  <td>{getHouseholdCode(hh)}</td>
                  <td>
                    <p>
                      {getHouseholdHead(hh) || "-"} ({getActiveMemberCount(hh)})
                    </p>
                  </td>
                  <td>{getHouseholdMobile(hh)}</td>
                  <td>{getHouseholdLocation(hh, bastiNames, margaNames)}</td>
                  <td>
                    <>
                      {canDeleteHousehold(hh) && (
                        confirmDeleteHouseholdId === `${hh.id}` ? (
                          <>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => deleteHousehold(hh)}
                            >
                              Confirm Delete
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => setConfirmDeleteHouseholdId("")}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => setConfirmDeleteHouseholdId(`${hh.id}`)}
                          >
                            Delete
                          </button>
                        )
                      )}
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
        {pageCount > 1 && (
          <div className="household-list-pagination">
            <button
              className="btn btn-default btn-sm"
              disabled={safeCurrentPage === 1}
              onClick={() => setCurrentPage(safeCurrentPage - 1)}
            >
              Previous
            </button>
            <span>
              Page {safeCurrentPage} of {pageCount}
            </span>
            <button
              className="btn btn-default btn-sm"
              disabled={safeCurrentPage === pageCount}
              onClick={() => setCurrentPage(safeCurrentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
