import { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../../Api/api";
import {
  getCompletedHouseholds,
  IHousehold,
  updateHousehold,
} from "../../db/models/Household";
import {
  getMembersByHouseholdMap,
  getMembersbyHousehold,
  updateMember,
} from "../../db/models/Member";
import { getAllUsers, IUser } from "../../db/models/UserModel";
import { getAllBasti } from "../../db/models/BastiModel";
import { getAllMarga } from "../../db/models/MargaModel";
import { removeSyncFields } from "../../db/syncFieldCleanup";
import LoadingOverlay from "../LoadingOverlay";
import {
  HOUSEHOLD_PAGE_SIZE,
  getActiveMemberCount,
  getHouseholdHead,
  getHouseholdLocation,
  getHouseholdMobile,
  getPageCount,
  householdMatchesSearch,
} from "./householdListUtils";

export default function CompletedData() {
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
    education_background:
      ({
        "1": "never_school",
        "2": "past_student",
        "3": "current_student",
        "4": "informal",
      } as Record<string, string>)[`${member.education_background ?? ""}`] ?? member.education_background,
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
    "migration_date",
    "is_responder_member",
    "responder_member_name",
    "responder_name",
    "has_foreign_member",
    "has_missing_deceased_member",
    "has_chronic_disease",
    "has_disability",
    "has_technical_training",
    "has_vehicle",
    "has_business",
    "has_bank_account",
    "has_cooperative_account",
    "agriculture_situation",
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
    "education_background",
    "education_stage_id",
    "education_level_id",
    "education_faculty",
    "education_leave_reason",
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
    "has_voter_card",
    "voter_card_location",
    "status",
    "presence_status",
    "remove_reason",
    "remarks",
  ];

  const buildHouseholdSyncPayload = (hh: any, members: any[], authUser?: IUser) => {
    const payload = {
      ...pickFields(hh, householdSyncFields),
      user_id: authUser?.id?.toString() ?? hh.user_id,
      office_id: authUser?.office_id ?? hh.office_id,
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

    // Ensure has_vehicle and has_foreign_member are always included
    if (payload.has_vehicle === undefined) {
      payload.has_vehicle = null;
    }
    if (payload.has_foreign_member === undefined) {
      payload.has_foreign_member = null;
    }

    if (hh.server_household_id) {
      payload.server_household_id = hh.server_household_id;
    } else {
      payload.server_household_id = null;
      if (typeof hh.id_string === "string" && hh.id_string.startsWith("server-")) {
        payload.id_string = hh.id_string;
      }
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

  const getHouseholdDateValue = (hh: any) => {
    const dateFields = [
      hh?.updated_at,
      hh?.updatedAt,
      hh?.modified_at,
      hh?.modifiedAt,
      hh?.created_at,
      hh?.createdAt,
    ];
    for (const value of dateFields) {
      if (value !== undefined && value !== null && `${value}`.trim() !== "") {
        const parsed = new Date(value);
        if (!Number.isNaN(parsed.getTime())) {
          return parsed.getTime();
        }
      }
    }
    return 0;
  };

  const sortHouseholdsByModifiedDate = (households: any[]) => {
    return [...households].sort((a, b) => {
      const aDate = getHouseholdDateValue(a);
      const bDate = getHouseholdDateValue(b);
      if (aDate !== bDate) {
        return bDate - aDate;
      }
      return (b.id ?? 0) - (a.id ?? 0);
    });
  };

  const getBackendHouseholdId = (source: any) =>
    source?.household_id ?? source?.houshold_id ?? source?.househol_id;

  const getResponseHousehold = (data: any) =>
    data?.household ?? data?.data?.household ?? data?.data ?? data;

  const getServerHouseholdId = (source: any) =>
    source?.server_household_id ?? source?.id;

  const getResponseMembers = (data: any) => {
    const candidates = [
      data?.members,
      data?.household?.members,
      data?.data?.members,
      data?.data?.household?.members,
      data?.member_ids,
      data?.data?.member_ids,
      data?.saved_members,
      data?.data?.saved_members,
    ];
    return candidates.find((members) => Array.isArray(members)) ?? [];
  };

  const getServerMemberId = (source: any) => {
    if (typeof source === "number" || typeof source === "string") {
      return source;
    }
    return source?.server_member_id ?? source?.member_id ?? source?.id;
  };

  const getMemberLocalRef = (source: any) => {
    const localRef = source?.local_id ?? source?.local_member_id ?? source?.client_id;
    if (localRef !== undefined && localRef !== null && `${localRef}` !== "") {
      return `${localRef}`;
    }
    return "";
  };

  const buildResponseMemberMap = (responseMembers: any[]) => {
    return responseMembers.reduce((memberMap: Map<string, any>, member: any) => {
      const localRef = getMemberLocalRef(member);
      if (localRef) {
        memberMap.set(localRef, member);
      }
      if (member?.id_string) {
        memberMap.set(`${member.id_string}`, member);
      }
      return memberMap;
    }, new Map<string, any>());
  };

  const getMatchedResponseMember = (
    member: any,
    index: number,
    responseMemberMap: Map<string, any>,
    responseMembers: any[]
  ) => {
    const localRefs = [
      member?.id,
      member?.id_string,
      `idx-${index}`,
    ].filter((value) => value !== undefined && value !== null && `${value}` !== "");

    for (const ref of localRefs) {
      const matchedMember = responseMemberMap.get(`${ref}`);
      if (matchedMember) {
        return matchedMember;
      }
    }
    return responseMembers[index];
  };

  const [households, setHousholds] = useState([] as IHousehold[]);
  const [auth, setAuth] = useState({} as IUser);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading data...");
  const [confirmDeleteHouseholdId, setConfirmDeleteHouseholdId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedBastiLocation, setSelectedBastiLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [bastiNames, setBastiNames] = useState({} as Record<string, string>);
  const [margaNames, setMargaNames] = useState({} as Record<string, string>);

  const history = useHistory();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, selectedBastiLocation, households.length]);

  const getHouseholdCode = (hh: any) => {
    return `${getBackendHouseholdId(hh) ?? ""}`.trim();
  };

  const canDeleteHousehold = (hh: any) => getHouseholdCode(hh) === "";

  const getHouseholds = async (auth_: IUser) => {
    setLoadingMessage("Loading data...");
    setLoading(true);
    let hhs = await getCompletedHouseholds();
    const membersByHousehold = await getMembersByHouseholdMap(
      hhs.map((hh) => hh.id)
    );
    const hhWithMembers = hhs.map((hh) => ({
      ...hh,
      members: membersByHousehold[`${hh.id}`] ?? [],
    }));
    setHousholds(sortHouseholdsByModifiedDate(hhWithMembers));
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
    setLoadingMessage("Deleting data...");
    setLoading(true);
    hh["members"] = await getMembersbyHousehold(hh.id);
    await updateHousehold({ ...hh, is_deleted: "1" });
    setConfirmDeleteHouseholdId("");
    await getHouseholds(auth);
  };

  const postHousehold = async (hh: any) => {
    setLoadingMessage("Sending data...");
    setLoading(true);
    if (window.navigator.onLine) {
      const members = (await getMembersbyHousehold(hh.id)).filter(
        (member: any) =>
          `${member?.status ?? ""}` !== "2" &&
          (`${member?.status ?? ""}` !== "0" || `${member?.removed_from_household ?? ""}` === "1")
      );
      const payload = buildHouseholdSyncPayload(hh, members, auth);
      try {
        let res = await api.postHousehold(payload);
        if (res.status === 200) {
          const responseHousehold = getResponseHousehold(res.data);
          const responseHouseholdId = getBackendHouseholdId(responseHousehold);
          const serverHouseholdId = getServerHouseholdId(responseHousehold);
          const responseMembers = getResponseMembers(res.data);
          const responseMemberMap = buildResponseMemberMap(responseMembers);
          await Promise.all(
            members.map((member: any, index: number) => {
              const responseMember = getMatchedResponseMember(
                member,
                index,
                responseMemberMap,
                responseMembers
              );
              const serverMemberId = getServerMemberId(responseMember);
              const memberUpdate = {
                ...removeSyncFields(member),
                ...(isNumericRef(serverMemberId)
                  ? {
                      member_id: Number(serverMemberId),
                      server_member_id: Number(serverMemberId),
                    }
                  : {}),
              };
              return updateMember(memberUpdate);
            })
          );
          await updateHousehold({
            ...removeSyncFields(hh),
            is_posted: "1",
            is_deleted: "0",
            household_id: responseHouseholdId ?? hh.household_id,
            server_household_id: serverHouseholdId ?? hh.server_household_id,
            id_string: serverHouseholdId ? `server-${serverHouseholdId}` : hh.id_string,
          });
        } else {
          alert(res.data.message);
        }
        await getHouseholds(auth);
      } catch (e: any) {
        alert(e.toString());
      }
    } else {
      alert("Please connect to Internet!");
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
      households
        .filter((hh) =>
          householdMatchesSearch(hh, searchText, bastiNames, margaNames)
        )
        .filter((hh) => {
          if (!selectedBastiLocation) {
            return true;
          }
          return getHouseholdLocation(hh, bastiNames, margaNames) === selectedBastiLocation;
        }),
    [households, searchText, selectedBastiLocation, bastiNames, margaNames]
  );
  const bastiLocationOptions = useMemo(() => {
    const locations = new Map<string, string>();

    households
      .filter((hh) => householdMatchesSearch(hh, searchText, bastiNames, margaNames))
      .forEach((hh) => {
        const location = getHouseholdLocation(hh, bastiNames, margaNames);
        if (location && location !== "-") {
          locations.set(location, location);
        }
      });

    return Array.from(locations.entries()).sort(([, aLabel], [, bLabel]) =>
      aLabel.localeCompare(bLabel)
    );
  }, [households, searchText, bastiNames, margaNames]);
  const pageCount = getPageCount(filteredHouseholds.length);
  const safeCurrentPage = Math.min(currentPage, pageCount);
  const paginatedHouseholds = filteredHouseholds.slice(
    (safeCurrentPage - 1) * HOUSEHOLD_PAGE_SIZE,
    safeCurrentPage * HOUSEHOLD_PAGE_SIZE
  );

  return (
    <div className="pending-data-page">
      <button
        className="btn btn-warning back-btn"
        onClick={() => history.goBack()}
      >
        Back
      </button>
      <div className="pending-data-table-wrap">
        <h3 className="household-list-title">Completed Data</h3>
        <div className="household-list-toolbar">
          <select
            className="form-control household-list-search"
            value={selectedBastiLocation}
            onChange={(event) => setSelectedBastiLocation(event.target.value)}
          >
            <option value="">All Basti / Tole</option>
            {bastiLocationOptions.map(([locationValue, locationLabel]) => (
              <option key={locationValue} value={locationValue}>
                {locationLabel}
              </option>
            ))}
          </select>
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
      {loading ? (
        <LoadingOverlay
          message={loadingMessage}
          detail="Please keep this screen open while the work finishes."
          onCancel={() => setLoading(false)}
        />
      ) : null}
    </div>
  );
}
