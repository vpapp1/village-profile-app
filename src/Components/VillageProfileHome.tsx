import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  addNewUser,
  deleteUser,
  getAllUsers,
  IUser,
} from "../db/models/UserModel";
import api from "../Api/api";
import { syncDb } from "../db/seed";
import { deleteAllData } from "../db/models/Household";

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
  const [wardLoading, setWardLoading] = useState(false);
  const [sabikWards, setSabikWards] = useState([] as any[]);
  const [selectedSabikWardIds, setSelectedSabikWardIds] = useState<string[]>([]);
  const [showSabikWardPicker, setShowSabikWardPicker] = useState(false);
  const [error, setError] = useState("");
  const [sabikWardError, setSabikWardError] = useState("");
  const history = useHistory();

  useEffect(() => {
    checkUser();
    // checkGeoLocation();
  }, []);

  // const checkGeoLocation = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition((positions: any) => {
  //       console.log(positions);
  //     });
  //   } else {
  //     console.log("Geolocation is not supported by this browser.");
  //   }
  // };

  const handleValueChance = (e: any) => {
    e.persist();
    setAuth((auth) => ({
      ...auth,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    let res;
    // For JSON Server
    if (process.env.REACT_APP_SERVER === "https://vp.khandadevi.com/") {
    // if (process.env.REACT_APP_SERVER === "https://demo.khandadevi.com/") {
    // if (process.env.REACT_APP_SERVER === "http://localhost:8000/") {
      // if (process.env.REACT_APP_SERVER === "http://192.168.10.33:8000/") {
      res = await api.loginJsonServer();
    }else{
      res = await api.login(auth);
    }
    if (res.data) {
      let data = res.data;
      await addNewUser(data);
      await loadSabikWards(data);
      setAuth({ ...data });
    } else {
      setError("Username or Password did not match!");
    }
    setLoading(false);
  };

  const loadSabikWards = async (userData: IUser) => {
    if (!userData?.office_id) {
      setSabikWards([]);
      return;
    }

    setWardLoading(true);
    try {
      const res = await api.loadSabikWada(userData.office_id, userData.id?.toString() ?? "");
      setSabikWards(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setSabikWards([]);
      console.log("Could not load sabik wards", err);
    } finally {
      setWardLoading(false);
    }
  };

  const checkUser = async () => {
    let auth = await getAllUsers();
    if (auth.length) {
      const savedUser = { ...auth[0] };
      setAuth(savedUser);
      await loadSabikWards(savedUser);
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

  const syncServerData = async () => {
    if (!selectedSabikWardIds.length) {
      setSabikWardError("Select at least 1 sabik ward before pulling data.");
      return;
    }

    setLoading(true);
    try {
      const startedAt = performance.now();
      const result = await syncDb(auth, { sabikWardIds: selectedSabikWardIds });
      const elapsedMs = Math.round(performance.now() - startedAt);
      console.log("sync", auth, result, `${elapsedMs}ms`);
      alert(
        `Sync completed in ${elapsedMs}ms\nSabik wards: ${selectedSabikWardIds.join(", ")}\nHouseholds: ${result?.households ?? 0}\nMembers: ${result?.members ?? 0}`
      );
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

  const handleDelete = async (e:any) => {
    let res = await deleteAllData(e.target.value)
    if(res){
      history.push("/village-profile-app")
    }
  }

  if (loading) {
    return <div className="vp-home">Server Loading...</div>;
  }
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
          <button>Submit</button>
        </form>
      </div>
    );
  }
  return (
    <div className="vp-home">
      <div className="welcome">
        Welcome         {auth?.name}        
      </div>
      
      {/* <Link to="/village-profile-app/app/add-new">Add New Household</Link> */}
      <Link to="/village-profile-app/app/add-new">नयाँ घरमुली</Link>
      {/* <Link to="/village-profile-app/app/pending">Pending Data</Link> */}
      <Link to="/village-profile-app/app/pending"> पठाउन बाँकी डाटा</Link>
      {/* <Link to="/village-profile-app/app/incomplete">Incomplete Data</Link> */}
      <Link to="/village-profile-app/app/incomplete">नसकिएको डाटा</Link>
      {/* <Link to="/village-profile-app/app/all">All Data</Link> */}
      <Link to="/village-profile-app/app/all">सबै डाटा</Link>
      {!showSabikWardPicker ? (
        <button className="btn btn-sm btn-secondary" onClick={openSabikWardPicker}>
          Pull Data
        </button>
      ) : (
        <div className="sabik-ward-pull">
          <div className="sabik-ward-title">Pull data by sabik ward</div>
          <div className="sabik-ward-help">Select 1 to 3 wards. Pulling again replaces the previously downloaded household data.</div>
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
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn btn-sm btn-secondary" onClick={syncServerData}>
              Confirm
            </button>
            <button
              className="btn btn-sm btn-light"
              onClick={() => {
                setShowSabikWardPicker(false);
                setSabikWardError("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <p className="logout" onClick={logout}>
          Logout
        </p>
      <p>Version: 2.0</p>
      <input onChange={handleDelete} title="deleteall" placeholder="DELETE" className="col-md-3"></input>
    </div>
  );
}
