import { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  getAllHousehold,
  IHousehold,
  updateHousehold,
} from "../../db/models/Household";
import {
  getMembersByHouseholdMap,
  getMembersbyHousehold,
} from "../../db/models/Member";
import { getAllBasti } from "../../db/models/BastiModel";
import { getAllMarga } from "../../db/models/MargaModel";
import {
  HOUSEHOLD_PAGE_SIZE,
  getActiveMemberCount,
  getHouseholdCode,
  getHouseholdHead,
  getHouseholdLocation,
  getHouseholdMobile,
  getPageCount,
  householdMatchesSearch,
} from "./householdListUtils";
import LoadingOverlay from "../LoadingOverlay";

export default function AllData() {
  const [households, setHousholds] = useState([] as IHousehold[]);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [bastiNames, setBastiNames] = useState({} as Record<string, string>);
  const [margaNames, setMargaNames] = useState({} as Record<string, string>);

  useEffect(() => {
    loadLocationNames();
    getHouseholds();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, households.length]);

  const getHouseholds = async () => {
    setLoading(true);
    let hhs = await getAllHousehold();
    const membersByHousehold = await getMembersByHouseholdMap(
      hhs.map((hh) => hh.id)
    );
    const hhWithMembers = hhs.map((hh) => ({
      ...hh,
      members: membersByHousehold[`${hh.id}`] ?? [],
    }));
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

  const unDeleteHousehold = async (hh: any) => {
    setLoading(true);
    hh["members"] = await getMembersbyHousehold(hh.id);
    await updateHousehold({ ...hh, is_deleted: "0" });
    await getHouseholds();
  };

  const getHouseholdStatus = (hh: any) => {
    if (`${hh.is_deleted ?? ""}` === "1") {
      return "Deleted";
    }

    if (`${hh.is_posted ?? ""}` === "1") {
      return "Sent";
    }

    return "Pending";
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

  return (
    <div className="pending-data-page">
      <button
        className="btn btn-warning back-btn"
        onClick={() => history.goBack()}
      >
        Back
      </button>
      <div className="pending-data-table-wrap">
        <h3 className="household-list-title">All Data</h3>
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
              <th>Status</th>
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
                  <td>{getHouseholdStatus(hh)}</td>
                  <td>
                    {`${hh.is_deleted ?? ""}` === "1" && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => unDeleteHousehold(hh)}
                      >
                        Undelete
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
                <td colSpan={7}>No Data</td>
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
          message="Loading data..."
          detail="Preparing the list from this device."
          onCancel={() => setLoading(false)}
        />
      ) : null}
    </div>
  );
}
