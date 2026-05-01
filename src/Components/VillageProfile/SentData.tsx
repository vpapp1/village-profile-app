import { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { getSentHouseholds, IHousehold } from "../../db/models/Household";
import { getMembersbyHousehold } from "../../db/models/Member";
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
  const [selectedBastiLocation, setSelectedBastiLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [bastiNames, setBastiNames] = useState({} as Record<string, string>);
  const [margaNames, setMargaNames] = useState({} as Record<string, string>);
  const [unlockedHouseholdIds, setUnlockedHouseholdIds] = useState({} as Record<string, boolean>);
  const [webView, setWebView] = useState<{ url: string; title: string } | null>(null);

  const history = useHistory();

  useEffect(() => {
    loadLocationNames();
    getHouseholds();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, selectedBastiLocation, households.length]);

  const getHouseholdDateValue = (hh: any) => {
    const dateFields = [hh?.updated_at, hh?.updatedAt, hh?.modified_at, hh?.modifiedAt, hh?.created_at, hh?.createdAt];
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

  const sortHouseholdsByModifiedDate = (items: any[]) => {
    return [...items].sort((a, b) => {
      const aDate = getHouseholdDateValue(a);
      const bDate = getHouseholdDateValue(b);
      if (aDate !== bDate) {
        return bDate - aDate;
      }
      return (b.id ?? 0) - (a.id ?? 0);
    });
  };

  const getHouseholdCode = (hh: any) => {
    return `${getBackendHouseholdId(hh) ?? ""}`.trim();
  };

  const getBackendWebBaseUrl = () => {
    const configuredBase =
      process.env.REACT_APP_WEB_SERVER ||
      process.env.REACT_APP_SERVER ||
      window.location.origin;

    try {
      const url = new URL(configuredBase, window.location.origin);
      url.pathname = url.pathname.replace(/\/api\/?$/, "/");
      url.search = "";
      url.hash = "";
      return url.toString().replace(/\/$/, "");
    } catch {
      return window.location.origin;
    }
  };

  const openWebHousehold = (hh: any) => {
    const householdId = getHouseholdCode(hh);
    if (!householdId) {
      alert("Household ID is missing. Cannot open web view.");
      return;
    }

    setWebView({
      url: `${getBackendWebBaseUrl()}/vp/households/${encodeURIComponent(householdId)}/check/`,
      title: `${getHouseholdHead(hh) || "Household"} (${householdId})`,
    });
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
      hhs.map(async (hh: IHousehold) => {
        const members = await getMembersbyHousehold(`${hh.id}`);
        return {
          ...hh,
          members,
        };
      })
    );
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

  if (loading) {
    return <div className="vp-home">Loading...</div>;
  }

  return (
    <div className="pending-data-page">
      <style>
        {`
          .sent-web-view-backdrop {
            position: fixed;
            inset: 0;
            z-index: 2000;
            background: rgba(15, 23, 42, 0.55);
            padding: 10px;
          }

          .sent-web-view-panel {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            overflow: hidden;
            border-radius: 10px;
            background: #fff;
            box-shadow: 0 18px 60px rgba(15, 23, 42, 0.34);
          }

          .sent-web-view-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            padding: 8px 10px;
            background: #0d6efd;
            color: #fff;
          }

          .sent-web-view-title {
            min-width: 0;
            margin: 0;
            font-size: 14px;
            font-weight: 700;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .sent-web-view-close {
            flex: 0 0 auto;
            border: 1px solid rgba(255, 255, 255, 0.75);
            border-radius: 6px;
            background: #fff;
            color: #0d6efd;
            font-size: 13px;
            font-weight: 700;
            padding: 4px 10px;
          }

          .sent-web-view-frame {
            flex: 1;
            width: 100%;
            border: 0;
            background: #f8f9fa;
          }

          @media (max-width: 600px) {
            .sent-web-view-backdrop {
              padding: 0;
            }

            .sent-web-view-panel {
              border-radius: 0;
            }
          }
        `}
      </style>
      {webView && (
        <div className="sent-web-view-backdrop" role="dialog" aria-modal="true">
          <div className="sent-web-view-panel">
            <div className="sent-web-view-header">
              <p className="sent-web-view-title">{webView.title}</p>
              <button
                type="button"
                className="sent-web-view-close"
                onClick={() => setWebView(null)}
              >
                Close
              </button>
            </div>
            <iframe
              className="sent-web-view-frame"
              title={webView.title}
              src={webView.url}
            />
          </div>
        </div>
      )}
      <button
        className="btn btn-warning back-btn"
        onClick={() => history.goBack()}
      >
        Back
      </button>
      <div className="pending-data-table-wrap">
        <h3 className="household-list-title">Sent Data</h3>
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
                    {/* {unlockedHouseholdIds[`${hh.id}`] ? (
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
                    )} */}
                    <div className="btn-group btn-group-sm" role="group" aria-label="Household view actions">
                      <button
                        className="btn btn-success"
                        title="View local saved data"
                        onClick={() =>
                          history.push("/village-profile-app/app/view/" + hh.id)
                        }
                      >
                        Local
                      </button>
                      <button
                        className="btn btn-primary"
                        title="View this household in web"
                        onClick={() => openWebHousehold(hh)}
                      >
                        Web
                      </button>
                    </div>
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
