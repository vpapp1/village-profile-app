import { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { getSentHouseholds, IHousehold } from "../../db/models/Household";
import { getMembersbyHousehold } from "../../db/models/Member";
import { getAllUsers } from "../../db/models/UserModel";
import { getAllBasti } from "../../db/models/BastiModel";
import { getAllMarga } from "../../db/models/MargaModel";
import {
  HOUSEHOLD_PAGE_SIZE,
  getBackendHouseholdId,
  getActiveMemberCount,
  getHouseholdHead,
  getHouseholdLocation,
  getHouseholdMobile,
  getPageCount,
  householdMatchesSearch,
} from "./householdListUtils";

export default function SentData() {
  const [households, setHousholds] = useState([] as IHousehold[]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [bastiNames, setBastiNames] = useState({} as Record<string, string>);
  const [margaNames, setMargaNames] = useState({} as Record<string, string>);
  const [unlockedHouseholdIds, setUnlockedHouseholdIds] = useState({} as Record<string, boolean>);

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

  const unlockHousehold = (hh: any) => {
    setUnlockedHouseholdIds((current) => ({
      ...current,
      [`${hh.id}`]: true,
    }));
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

  const checkUser = async () => {
    loadLocationNames();
    const auth_ = await getAllUsers();
    if (auth_.length) {
      getHouseholds();
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
        <h3 className="household-list-title">Sent Data</h3>
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
                    {unlockedHouseholdIds[`${hh.id}`] ? (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() =>
                          history.push("/village-profile-app/app/edit/" + hh.id)
                        }
                      >
                        Edit
                      </button>
                    ) : (
                      <button
                        className="btn btn-default btn-sm household-lock-btn"
                        aria-label="Unlock edit"
                        title="Unlock edit"
                        onClick={() => unlockHousehold(hh)}
                      >
                        &#128274;
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
