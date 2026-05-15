import { useCallback, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  addNewUser,
  deleteUser,
  getAllUsers,
  IUser,
} from "../db/models/UserModel";
import api from "../Api/api";
import { syncHouseholdData, syncSettingData } from "../db/seed";
import {
  deleteAllData,
  getAllHousehold,
  getCompletedHouseholds,
  getPendingHouseholds,
  getSentHouseholds,
} from "../db/models/Household";
import LoadingOverlay from "./LoadingOverlay";

const initialAuth = {
  name: "",
  username: "",
  phone: "",
  password: "",
  office_name: "",
  office_id: "",
} as IUser;

const sabikWardCacheTtl = 24 * 60 * 60 * 1000;

const getSabikWardCacheKey = (userData: IUser) =>
  `vp_sabik_wards_${userData?.office_id ?? ""}_${userData?.id ?? ""}`;

const getCachedSabikWards = (userData: IUser) => {
  try {
    const rawValue = window.localStorage.getItem(getSabikWardCacheKey(userData));
    if (!rawValue) {
      return null;
    }

    const cached = JSON.parse(rawValue);
    if (Date.now() - cached.savedAt > sabikWardCacheTtl) {
      window.localStorage.removeItem(getSabikWardCacheKey(userData));
      return null;
    }

    return Array.isArray(cached.value) ? cached.value : null;
  } catch (error) {
    return null;
  }
};

const setCachedSabikWards = (userData: IUser, value: any[]) => {
  try {
    window.localStorage.setItem(
      getSabikWardCacheKey(userData),
      JSON.stringify({ savedAt: Date.now(), value })
    );
  } catch (error) {
    // Browser storage can be unavailable in private mode.
  }
};

const clearCachedSabikWards = (userData: IUser) => {
  try {
    window.localStorage.removeItem(getSabikWardCacheKey(userData));
  } catch (error) {}
};

const HomeMenuIcon = ({
  type,
}: {
  type: "add" | "draft" | "send" | "sent" | "all" | "progress";
}) => {
  const commonProps = {
    className: "vp-home-link-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (type === "add") {
    return (
      <svg {...commonProps}>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    );
  }

  if (type === "draft") {
    return (
      <svg {...commonProps}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    );
  }

  if (type === "send") {
    return (
      <svg {...commonProps}>
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </svg>
    );
  }

  if (type === "sent") {
    return (
      <svg {...commonProps}>
        <path d="M20 6 9 17l-5-5" />
      </svg>
    );
  }

  if (type === "progress") {
    return (
      <svg {...commonProps}>
        <path d="M4 19h16" />
        <path d="M7 15v4" />
        <path d="M12 11v8" />
        <path d="M17 7v12" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </svg>
  );
};

export default function VillageProfileHome() {
  const [auth, setAuth] = useState(initialAuth as IUser);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [loadingDetail, setLoadingDetail] = useState("");
  const [updateRegistration, setUpdateRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [wardLoading, setWardLoading] = useState(false);
  const [sabikWards, setSabikWards] = useState([] as any[]);
  const [selectedSabikWardIds, setSelectedSabikWardIds] = useState<string[]>([]);
  const [showSabikWardPicker, setShowSabikWardPicker] = useState(false);
  const [showDeletePanel, setShowDeletePanel] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");
  const [sabikWardError, setSabikWardError] = useState("");
  const [showProgressReport, setShowProgressReport] = useState(false);
  const [progressReportLoading, setProgressReportLoading] = useState(false);
  const [progressReportError, setProgressReportError] = useState("");
  const [progressReportData, setProgressReportData] = useState<any>(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState<any>(null);
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const [myHouseholds, setMyHouseholds] = useState<any | null>(null);
  const [myHouseholdsLoading, setMyHouseholdsLoading] = useState(false);
  const [householdCounts, setHouseholdCounts] = useState({
    drafts: 0,
    readyToSend: 0,
    sent: 0,
    all: 0,
  });
  const history = useHistory();

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

  const progressReportUrl = `${getBackendWebBaseUrl()}/vp/public/vp-progress-report/`;
  const progressReportDataUrl = `${getBackendWebBaseUrl()}/vp/public/vp-progress-report/data/`;
  const progressReportUserDetailsUrl =
    (window as any)?.PROGRESS_REPORT_USER_DETAILS_URL ||
    `${getBackendWebBaseUrl()}/vp/public/vp-progress-report/user-details/`;

  const openProgressReport = async () => {
    setShowProgressReport(true);
    setProgressReportError("");
    setProgressReportLoading(true);
    setSelectedUserDetails(null);

    try {
      const response = await fetch(progressReportDataUrl, { credentials: "same-origin" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const reportData = await response.json();
      setProgressReportData(reportData);

      // Auto-load current user's details
      // prefer `auth.username`, otherwise fall back to first user from IndexedDB
      try {
        let usernameToUse = auth.username;
        let displayNameToUse = auth.name || auth.username;
        if (!usernameToUse) {
          const users = await getAllUsers();
          if (users && users.length) {
            usernameToUse = users[0].username;
            displayNameToUse = users[0].name || usernameToUse;
          }
        }

        if (usernameToUse) {
          const detailsResponse = await fetch(
            `${progressReportUserDetailsUrl}?username=${encodeURIComponent(
              usernameToUse
            )}&source=household`,
            { credentials: "same-origin" }
          );
          if (detailsResponse.ok) {
            const detailsData = await detailsResponse.json();
            setSelectedUserDetails({
              username: usernameToUse,
              displayName: displayNameToUse,
              source: "household",
              data: detailsData,
            });
            setMyHouseholds(detailsData);
          }
        }
      } catch (detailErr) {
        console.log("Could not load current user details", detailErr);
      }
    } catch (err) {
      console.log("Could not load progress report", err);
      setProgressReportError("Progress report data could not be loaded.");
    } finally {
      setProgressReportLoading(false);
    }
  };

  const loadUserDetails = async (username: string, source: "household" | "kobo", displayName: string) => {
    if (!username) {
      // try to get username from IndexedDB if not provided
      const users = await getAllUsers();
      if (users && users.length) {
        username = users[0].username;
        if (!displayName) displayName = users[0].name || username;
      }
      if (!username) {
        console.log("loadUserDetails: username is empty, skipping request", { auth });
        return;
      }
    }
    console.log("loadUserDetails called", { username, source, displayName });
    setUserDetailsLoading(true);
    try {
      const url = `${progressReportUserDetailsUrl}?username=${encodeURIComponent(username)}&source=${encodeURIComponent(source)}`;
      const response = await fetch(url, { credentials: "same-origin" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      console.log("loadUserDetails response", { url, ok: response.ok, data });
      setSelectedUserDetails({
        username,
        displayName,
        source,
        data,
      });
      if (username === auth.username && source === "household") {
        setMyHouseholds(data);
      }
    } catch (err) {
      console.log("Could not load user details", err);
      setSelectedUserDetails({
        username,
        displayName,
        source,
        error: "Failed to load details",
      });
    } finally {
      setUserDetailsLoading(false);
    }
  };

  const loadHouseholdCounts = useCallback(async () => {
    const [drafts, readyToSend, sent, all] = await Promise.all([
      getPendingHouseholds(),
      getCompletedHouseholds(),
      getSentHouseholds(),
      getAllHousehold(),
    ]);

    setHouseholdCounts({
      drafts: drafts.length,
      readyToSend: readyToSend.length,
      sent: sent.length,
      all: all.length,
    });
  }, []);

  const loadSabikWards = useCallback(async (userData: IUser, forceRefresh = false) => {
    if (!userData?.office_id) {
      setSabikWards([]);
      return;
    }

    if (!forceRefresh) {
      const cachedSabikWards = getCachedSabikWards(userData);
      if (cachedSabikWards) {
        setSabikWards(cachedSabikWards);
        return;
      }
    }

    setWardLoading(true);
    try {
      const res = await api.loadSabikWada(
        userData.office_id,
        userData.id?.toString() ?? ""
      );
      const options = Array.isArray(res.data) ? res.data : [];
      setCachedSabikWards(userData, options);
      setSabikWards(options);
    } catch (err) {
      setSabikWards([]);
      console.log("Could not load sabik wards", err);
    } finally {
      setWardLoading(false);
    }
  }, []);

  const checkUser = useCallback(async () => {
    const users = await getAllUsers();
    if (users.length) {
      const savedUser = { ...users[0] };
      setAuth(savedUser);
      await loadSabikWards(savedUser);
      await loadHouseholdCounts();
    }
  }, [loadHouseholdCounts, loadSabikWards]);

  // If the progress report is open and auth becomes available, auto-load user's details
  useEffect(() => {
    if (showProgressReport && auth?.username && !myHouseholds) {
      console.log("ProgressReport auto-load", { showProgressReport, auth, myHouseholds });
      loadUserDetails(auth.username, "household", auth.name || auth.username);
    }
  }, [showProgressReport, auth?.username]);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    let hasReloaded = false;
    const watchedRegistrations = new Set<ServiceWorkerRegistration>();
    const checkedRegistrations = new Set<ServiceWorkerRegistration>();

    const handleControllerChange = () => {
      if (hasReloaded) {
        return;
      }
      hasReloaded = true;
      window.location.reload();
    };

    const showUpdateWhenReady = (registration: ServiceWorkerRegistration) => {
      if (registration.waiting) {
        setUpdateRegistration(registration);
      }
    };

    const watchRegistration = (registration: ServiceWorkerRegistration) => {
      showUpdateWhenReady(registration);

      if (!checkedRegistrations.has(registration)) {
        checkedRegistrations.add(registration);
        registration.update().catch((err) => {
          console.log("Could not check for app update", err);
        });
      }

      if (watchedRegistrations.has(registration)) {
        return;
      }

      watchedRegistrations.add(registration);
      registration.addEventListener("updatefound", () => {
        const installingWorker = registration.installing;
        if (!installingWorker) {
          return;
        }

        installingWorker.addEventListener("statechange", () => {
          if (
            installingWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            setUpdateRegistration(registration);
          }
        });
      });
    };

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      handleControllerChange
    );

    navigator.serviceWorker.ready.then(watchRegistration);
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration) {
        watchRegistration(registration);
      }
    });

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        handleControllerChange
      );
    };
  }, []);

  const handleValueChance = (e: any) => {
    e.persist();
    setAuth((authData) => ({
      ...authData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoadingMessage("Authorizing...");
    setLoadingDetail("Checking your username and password.");
    setLoading(true);
    try {
      let res;
      if (process.env.REACT_APP_SERVER === "https://vp.khandadevi.com/") {
        res = await api.loginJsonServer();
      } else {
        res = await api.login(auth);
      }
      if (res.data) {
        // Merge server response with entered credentials so password/username are persisted locally
        const serverData = res.data || {};
        const merged = {
          ...serverData,
          username: serverData.username || auth.username || "",
          password: serverData.password || auth.password || "",
        };
        await addNewUser(merged);
        await loadSabikWards(merged);
        await loadHouseholdCounts();
        setAuth({ ...merged });
      } else {
        setError("Username or Password did not match!");
      }
    } finally {
      setLoading(false);
    }
  };

  const openSabikWardPicker = async () => {
    setSabikWardError("");
    setShowSabikWardPicker(true);
    if (!sabikWards.length && auth?.office_id) {
      await loadSabikWards(auth);
    }
  };

  const toggleSabikWard = (wardId: string) => {
    setSabikWardError("");
    setSelectedSabikWardIds((current) => {
      if (current.includes(wardId)) {
        return current.filter((id) => id !== wardId);
      }
      if (current.length >= 3) {
        setSabikWardError("Select up to 3 sabik wards at a time.");
        return current;
      }
      return [...current, wardId];
    });
  };

  const pullSettingData = async () => {
    if (!auth?.id || !auth?.office_id) {
      alert("User information is missing. Please login again.");
      return;
    }

    setLoadingMessage("Pulling settings...");
    setLoadingDetail("Updating ward, basti, road, and form settings.");
    setLoading(true);
    try {
      await syncSettingData(auth);
      clearCachedSabikWards(auth);
      await loadSabikWards(auth, true);
      alert("Setting data pulled successfully.");
    } catch (pullError) {
      console.log("setting data pull failed", pullError);
      alert("Failed to pull setting data.");
    } finally {
      setLoading(false);
    }
  };

  const pullHouseholdData = async () => {
    if (!selectedSabikWardIds.length) {
      setSabikWardError("Select at least 1 sabik ward before pulling data.");
      return;
    }

    setLoadingMessage("Pulling household data...");
    setLoadingDetail("Keeping this screen open while offline data is prepared.");
    setLoading(true);
    try {
      const selectedWardLabels = [...selectedSabikWardIds];
      const startedAt = performance.now();
      const result = await syncHouseholdData(auth, {
        sabikWardIds: selectedSabikWardIds,
      });
      const elapsedMs = Math.round(performance.now() - startedAt);
      console.log("sync", auth, result, `${elapsedMs}ms`);
      alert(
        `Sync completed in ${elapsedMs}ms\nSabik wards: ${selectedWardLabels.join(
          ", "
        )}\nHouseholds: ${result?.households ?? 0}\nMembers: ${
          result?.members ?? 0
        }\nInactive Members: ${result?.inactiveMembers ?? 0}`
      );
      setShowSabikWardPicker(false);
      setSelectedSabikWardIds([]);
      setSabikWardError("");
      await loadHouseholdCounts();
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuth({ ...initialAuth });
    setSabikWards([]);
    setSelectedSabikWardIds([]);
    setShowSabikWardPicker(false);
    setSabikWardError("");
    setHouseholdCounts({ drafts: 0, readyToSend: 0, sent: 0, all: 0 });
    deleteUser();
  };

  const handleDelete = async () => {
    if (deleteConfirmText !== "DELETE") {
      return;
    }

    setDeleteLoading(true);
    const res = await deleteAllData("deleteall");
    if (res) {
      setHouseholdCounts({ drafts: 0, readyToSend: 0, sent: 0, all: 0 });
      history.push("/village-profile-app");
    }
    setDeleteLoading(false);
  };

  const updateApp = async () => {
    setUpdateLoading(true);
    const registration =
      updateRegistration ?? (await navigator.serviceWorker.getRegistration());

    if (registration?.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
      return;
    }

    setUpdateRegistration(null);
    setUpdateLoading(false);
  };

  if (!auth.id) {
    return (
      <div className="vp-home">
        <div className="vp-home-demo-badge">V3.2</div>
        <form method="post" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="username"
              placeholder="Username"
              name="username"
              value={auth?.username}
              onChange={handleValueChance}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={auth?.password}
              onChange={handleValueChance}
              required
            />
          </div>
          <p style={{ color: "red" }}>{error}</p>
          <button>↪ Submit</button>
        </form>
        {loading ? (
          <LoadingOverlay
            message={loadingMessage}
            detail={loadingDetail}
            onCancel={() => setLoading(false)}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="vp-home">
      <div className="vp-home-demo-badge">V3.2</div>
      <div className="vp-home-topbar">
        <div className="welcome">👋 Welcome {auth?.name}</div>
        <div className="vp-home-pull-tools">
          {updateRegistration?.waiting ? (
            <button
              type="button"
              className="btn btn-sm btn-warning vp-home-mini-btn"
              onClick={updateApp}
              disabled={updateLoading}
            >
              {updateLoading ? "Updating..." : "Update App"}
            </button>
          ) : null}
        </div>
      </div>

      <Link to="/village-profile-app/app/add-new" className="vp-home-link">
        <span className="vp-home-link-main">
          <HomeMenuIcon type="add" />
          <span>नयाँ घरमुली (Start New)</span>
        </span>
      </Link>
      <Link to="/village-profile-app/app/pending" className="vp-home-link">
        <span className="vp-home-link-main">
          <HomeMenuIcon type="draft" />
          <span>रुजु नगरिएको डाटा (Drafts)</span>
        </span>
        <span className="vp-home-link-count">{householdCounts.drafts}</span>
      </Link>
      <Link to="/village-profile-app/app/completed" className="vp-home-link">
        <span className="vp-home-link-main">
          <HomeMenuIcon type="send" />
          <span>पुरा डाटा (Ready to Send)</span>
        </span>
        <span className="vp-home-link-count">{householdCounts.readyToSend}</span>
      </Link>
      <Link to="/village-profile-app/app/sent" className="vp-home-link">
        <span className="vp-home-link-main">
          <HomeMenuIcon type="sent" />
          <span>पठाईसकेको डाटा (Sent)</span>
        </span>
        <span className="vp-home-link-count">{householdCounts.sent}</span>
      </Link>
      <Link to="/village-profile-app/app/all" className="vp-home-link">
        <span className="vp-home-link-main">
          <HomeMenuIcon type="all" />
          <span>सबै डाटा (All Data)</span>
        </span>
        <span className="vp-home-link-count">{householdCounts.all}</span>
      </Link>
      <a
        href={progressReportUrl}
        className="vp-home-link"
        onClick={(e) => {
          e.preventDefault();
          openProgressReport();
        }}
      >
        <span className="vp-home-link-main">
          <HomeMenuIcon type="progress" />
          <span>प्रगति (Progress Report)</span>
        </span>
      </a>

      {showSabikWardPicker ? (
        <div className="sabik-ward-pull">
          <div className="sabik-ward-title">Pull household data by sabik ward</div>
          <div className="sabik-ward-help">
            Select 1 to 3 wards. This pulls household, member, and inactive member data.
          </div>
          {wardLoading ? (
            <p>Loading sabik wards...</p>
          ) : (
            <div className="sabik-ward-list">
              {sabikWards.map((ward: any) => {
                const wardId = `${ward.id}`;
                const wardLabel = ward.label ?? ward.name ?? wardId;
                return (
                  <label key={wardId} className="sabik-ward-item">
                    <input
                      type="checkbox"
                      checked={selectedSabikWardIds.includes(wardId)}
                      onChange={() => toggleSabikWard(wardId)}
                    />
                    <span>{wardLabel}</span>
                  </label>
                );
              })}
            </div>
          )}
          <p style={{ color: "red" }}>{sabikWardError}</p>
          <div className="sabik-ward-actions">
            <button className="btn btn-sm btn-primary sabik-ward-action-btn" onClick={pullHouseholdData}>
              ✓ Confirm
            </button>
            <button
              className="btn btn-sm btn-light sabik-ward-action-btn"
              onClick={() => {
                setShowSabikWardPicker(false);
                setSabikWardError("");
              }}
            >
              × Cancel
            </button>
          </div>
        </div>
      ) : null}

      <p className="logout" onClick={logout}>
        ⎋ Logout
      </p>
      <div className="vp-home-footer-tools">
        <button className="btn btn-sm btn-secondary" onClick={pullSettingData}>
          ⇣ Pull Setting
        </button>
        {!showSabikWardPicker ? (
          <button className="btn btn-sm btn-primary" onClick={openSabikWardPicker}>
            ⇣ Pull Household
          </button>
        ) : null}
      </div>
      <p>Version: 3.0</p>
      <div className="vp-home-danger-zone">
        {!showDeletePanel ? (
          <button
            type="button"
            className="vp-home-danger-toggle"
            onClick={() => {
              setShowDeletePanel(true);
              setDeleteConfirmText("");
            }}
          >
            Clear local data
          </button>
        ) : (
          <div className="vp-home-danger-card">
            <div>
              <div className="vp-home-danger-title">Clear local data?</div>
              <div className="vp-home-danger-copy">
                This removes the offline database from this device. Type DELETE to confirm.
              </div>
            </div>
            <input
              value={deleteConfirmText}
              onChange={(event) => setDeleteConfirmText(event.target.value)}
              placeholder="Type DELETE"
              className="vp-home-delete-input"
            />
            <div className="vp-home-danger-actions">
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={handleDelete}
                disabled={deleteConfirmText !== "DELETE" || deleteLoading}
              >
                {deleteLoading ? "Clearing..." : "Confirm clear"}
              </button>
              <button
                type="button"
                className="btn btn-sm btn-light"
                onClick={() => {
                  setShowDeletePanel(false);
                  setDeleteConfirmText("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      {loading ? (
        <LoadingOverlay
          message={loadingMessage}
          detail={loadingDetail}
          onCancel={() => setLoading(false)}
        />
      ) : null}
      {showProgressReport ? (
        <div
          className="vp-home-modal-backdrop"
          role="presentation"
          onClick={() => setShowProgressReport(false)}
        >
          <div
            className="vp-home-modal-card"
            role="dialog"
            aria-modal="true"
            aria-label="Progress Report"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="vp-home-modal-header">
              <div>
                <div className="vp-home-modal-title">प्रगति (Progress Report)</div>
                <div className="vp-home-modal-subtitle">{progressReportUrl}</div>
              </div>
              <button
                type="button"
                className="vp-home-modal-close"
                onClick={() => setShowProgressReport(false)}
              >
                × Close
              </button>
            </div>
            <div className="vp-home-progress-report">
              {progressReportLoading ? (
                <div className="vp-home-report-empty">Loading progress report...</div>
              ) : progressReportError ? (
                <div className="vp-home-report-empty">{progressReportError}</div>
              ) : progressReportData ? (
                <>
                  <div className="vp-home-report-summary">
                    <div>
                      <span>Total Household</span>
                      <strong>{progressReportData.total_count ?? 0}</strong>
                    </div>
                    <div>
                      <span>Kobo Total</span>
                      <strong>{progressReportData.kobo_total_count ?? 0}</strong>
                    </div>
                    <div>
                      <span>PHMIS Total</span>
                      <strong>{progressReportData.phmis_total_count ?? 0}</strong>
                    </div>
                  </div>

                  <section className="vp-home-report-section">
                    <h4>VP report</h4>
                    {progressReportData.user_stats?.length ? (
                      <table className="vp-home-report-table">
                        <thead>
                          <tr>
                            <th>User</th>
                            <th>Updated</th>
                            <th>New</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {progressReportData.user_stats.map((user: any, index: number) => (
                            <tr key={`${user.display_name}-${index}`}>
                              <td>{user.display_name}</td>
                              <td>{user.updated_house_count}</td>
                              <td>{user.new_house_count}</td>
                              <td>{user.total_count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="vp-home-report-empty">No progress data found.</div>
                    )}
                  </section>

                  <section className="vp-home-report-section">
                    <h4>CP (Kobo) Report</h4>
                    {progressReportData.kobo_error ? (
                      <div className="vp-home-report-empty">{progressReportData.kobo_error}</div>
                    ) : progressReportData.kobo_stats?.length ? (
                      <table className="vp-home-report-table">
                        <thead>
                          <tr>
                            <th>User</th>
                            <th>18+</th>
                            <th>Under 18</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {progressReportData.kobo_stats.map((user: any, index: number) => (
                            <tr key={`${user.display_name}-${index}`}>
                              <td>{user.display_name}</td>
                              <td>{user.adult_count}</td>
                              <td>{user.under18_count}</td>
                              <td>{user.submission_count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="vp-home-report-empty">No Kobo data found.</div>
                    )}
                  </section>

                  <section className="vp-home-report-section">
                    <h4>PHMIS</h4>
                    {progressReportData.phmis_error ? (
                      <div className="vp-home-report-empty">{progressReportData.phmis_error}</div>
                    ) : progressReportData.phmis_rows?.length ? (
                      <table className="vp-home-report-table">
                        <thead>
                          <tr>
                            <th>Ward</th>
                            <th>Surveyed Households</th>
                          </tr>
                        </thead>
                        <tbody>
                          {progressReportData.phmis_rows.map((row: any, index: number) => (
                            <tr key={index}>
                              {(row.cells || []).map((cell: any, cellIndex: number) => (
                                <td key={cellIndex}>{cell.value}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="vp-home-report-empty">No PHMIS data found.</div>
                    )}
                  </section>

                  <section className="vp-home-report-section">
                    <h4>Household detail data</h4>
                    {myHouseholdsLoading ? (
                      <div className="vp-home-report-empty">Loading household details...</div>
                    ) : myHouseholds ? (
                      <>
                        {((myHouseholds.updated_households || []).length > 0 || (myHouseholds.new_households || []).length > 0) ? (
                          <table className="vp-home-report-table">
                            <thead>
                              <tr>
                                <th>क्र.सं.</th>
                                <th>प्रकार</th>
                                <th>परिवार मूलीको नाम</th>
                                <th>सम्पर्क नं.</th>
                                <th>ठेगाना</th>
                                <th>सिर्जना गर्नेको</th>
                                <th>सिर्जना मिति</th>
                                <th>अद्यावधिक गर्नेको</th>
                                <th>अद्यावधिक मिति</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(myHouseholds.updated_households || []).map((hh: any, idx: number) => (
                                <tr key={`u-${idx}`}>
                                  <td>{idx + 1}</td>
                                  <td style={{ color: "#666", fontWeight: 500 }}>अद्यावधिक</td>
                                  <td>{hh.name}</td>
                                  <td>{hh.mobile}</td>
                                  <td>{hh.address}</td>
                                  <td>{hh.created_by || "-"}</td>
                                  <td>{hh.created_date || "-"}</td>
                                  <td>{hh.updated_by || "-"}</td>
                                  <td>{hh.updated_date || "-"}</td>
                                </tr>
                              ))}
                              {(myHouseholds.new_households || []).map((hh: any, idx: number) => (
                                <tr key={`n-${idx}`}>
                                  <td>{(myHouseholds.updated_households || []).length + idx + 1}</td>
                                  <td style={{ color: "#28a745", fontWeight: 500 }}>नयाँ</td>
                                  <td>{hh.name}</td>
                                  <td>{hh.mobile}</td>
                                  <td>{hh.address}</td>
                                  <td>{hh.created_by || "-"}</td>
                                  <td>{hh.created_date || "-"}</td>
                                  <td>{hh.updated_by || "-"}</td>
                                  <td>{hh.updated_date || "-"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="vp-home-report-empty">No households found for you.</div>
                        )}
                      </>
                    ) : (
                      <div className="vp-home-report-empty">No household preview available.</div>
                    )}
                  </section>

                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

