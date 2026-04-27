import { useEffect, useMemo, useState } from "react";
import { getAllUsers, IUser } from "../../db/models/UserModel";
import { householdDefault } from "../../defaultRequired";
import VPForm from "./Forms/VPForm";

export default function AddHousehold() {
  const [auth, setAuth] = useState({} as IUser);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);
  const checkUser = async () => {
    try {
      let auth_ = await getAllUsers();
      if (auth_.length) {
        setAuth({ ...auth_[0] });
      }
    } finally {
      setAuthLoaded(true);
    }
  };

  const formData = useMemo(
    () => ({
      household: { ...householdDefault, user_id: auth?.id },
    }),
    [auth?.id]
  );

  if (!authLoaded) {
    return <div className="vp-home">Loading...</div>;
  }

  return <VPForm data={formData} />;
}
