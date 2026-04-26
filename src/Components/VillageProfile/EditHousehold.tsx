import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHouseholdById, IHousehold } from "../../db/models/Household";
import VPForm from "./Forms/VPForm";

export default function EditHousehold() {
  let { id } = useParams<{ id: any }>();
  const [household, setHousehold] = useState({} as IHousehold);

  const getHousehold = useCallback(async () => {
    let hh = await getHouseholdById(id);
    setHousehold({ ...hh });
  }, [id]);

  useEffect(() => {
    getHousehold();
  }, [getHousehold]);

  if (household) {
    return <VPForm data={{ household: household }} />;
  } else {
    return <div className="vp-home">Server Loading...</div>;
  }
}

