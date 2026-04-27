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
import { deleteAllData } from "../db/models/Household";
import LoadingOverlay from "./LoadingOverlay";

const initialAuth = {
  name: "",
  username: "",
  phone: "",
  password: "",
  office_name: "",
  office_id: "",
} as IUser;

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
  const history = useHistory();

  const loadSabikWards = useCallback(async (userData: IUser) => {
    if (!userData?.office_id) {
      setSabikWards([]);
      return;
    }

    setWardLoading(true);
    try {
      const res = await api.loadSabikWada(
        userData.office_id,
        userData.id?.toString() ?? ""
      );
      setSabikWards(Array.isArray(res.data) ? res.data : []);
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
    }
  }, [loadSabikWards]);

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
        const data = res.data;
        await addNewUser(data);
        await loadSabikWards(data);
        setAuth({ ...data });
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
      if (!sabikWards.length) {
        await loadSabikWards(auth);
      }
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
    deleteUser();
  };

  const handleDelete = async () => {
    if (deleteConfirmText !== "DELETE") {
      return;
    }

    setDeleteLoading(true);
    const res = await deleteAllData("deleteall");
    if (res) {
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

      <Link to="/village-profile-app/app/add-new" style={{ display: "block", textAlign: "center" }}>नयाँ घरमुली</Link>
      <Link to="/village-profile-app/app/pending" style={{ display: "block", textAlign: "center" }}>पठाउन बाँकी डाटा</Link>
      <Link to="/village-profile-app/app/completed" style={{ display: "block", textAlign: "center" }}>पूरा भएका डाटा</Link>
      <Link to="/village-profile-app/app/sent" style={{ display: "block", textAlign: "center" }}>पठाईसकेको डाटा</Link>
      <Link to="/village-profile-app/app/all" style={{ display: "block", textAlign: "center" }}>सबै डाटा</Link>

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
    </div>
  );
}
