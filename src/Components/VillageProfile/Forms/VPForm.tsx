import { useEffect, useState } from "react";
import NepaliDate from "nepali-date-converter";
import { useHistory } from "react-router-dom";
import api from "../../../Api/api";
import {getSabikWardById, getSabikWardByWardId, ISabikWard} from "../../../db/models/SabikWardModel";
import {
  getAllCountrys,
  getCountryBySamuhaId,
  ICountry,
} from "../../../db/models/CountryModel";
import {
  getAllCountrySamuhas,
  ICountrySamuha,
} from "../../../db/models/CountrySamuhaModel";
import { getAllDistricts, IDistrict } from "../../../db/models/DistrictModel";
import { getAllDharmas, IDharma } from "../../../db/models/DharmaModel";
import {
  addNewHousehold,
  IHousehold,
  updateHousehold,
} from "../../../db/models/Household";
import {
  getAllJaatis,
  getJaatiBySamuhaId,
  IJaati,
} from "../../../db/models/JaatiModel";
import {
  getAllJaatiSamuhas,
  IJaatiSamuha,
} from "../../../db/models/JaatiSamuhaModel";
import { getBastiBySabikWardId, IBasti } from "../../../db/models/BastiModel";
import { getMargaByBastiId, IMarga } from "../../../db/models/MargaModel";
import {
  addNewMember,
  getAllMember,
  getMembersbyHousehold,
  IMember,
  updateMember,
} from "../../../db/models/Member";
import {
  getAllMotherToungues,
  IMotherTongue,
} from "../../../db/models/MotherTongue";
import { getAllOccupations, IOccupation } from "../../../db/models/Occupation";
import { getAllEducationStages, IEducationStage } from "../../../db/models/EducationStage";
import { getAllProfessionCategories, IProfessionCategory } from "../../../db/models/ProfessionCategory";
import { getAllProfessions, IProfession } from "../../../db/models/Profession";
import {
  getAllTechnicalSkills,
  ITechnicalSkill,
} from "../../../db/models/TechnicalSkill";
import { removeSyncFields } from "../../../db/syncFieldCleanup";
import {
  getAllVehicleTypes,
  IVehicleType,
} from "../../../db/models/VehicleType";
import { getAllUsers, IUser } from "../../../db/models/UserModel";
import { getAllWards, IWard } from "../../../db/models/WardModel";
import { getDistrict } from "../../../db/seed";
import { land_types as staticLandTypes } from "../../../enums";
import {
  memberDefault,
} from "../../../defaultRequired";
import GharKoBiabarn from "./GharKoBiabarn";
import GharKoDetailBiabarn from "./GharKoDetailBiabarn";
import PariwarKoBibaran from "./PariwarKoBibaran";
export interface IError {
  name: string;
  message: string;
}

const partARequiredFields = [
  "ward_id",
  "sabikWard_id",
  "basti_id",
  "marga_id",
  "jaati_samuha_id",
  "jaati_id",
  "religion_id",
  "mother_tongue_id",
  "resident_type",
];

const partBRequiredFields = [
  "first_name",
  "last_name",
  "relation_with_hoh_id",
  "gender_id",
  "resident_place",
  "is_married",
  "education_background",
  "education_stage_id",
  "employment_status",
  "main_work_last_12_months",
  "enroll_type",
  "has_voter_card",
];

const partCRequiredFields = [
  "agriculture_situation",
  "has_business",
  "has_cooperative_account",
  "has_bank_account",
  "is_responder_member",
];

const isRequiredValueMissing = (value: any) => {
  if (value === undefined || value === null) {
    return true;
  }
  if (typeof value === "string") {
    return value.trim() === "";
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return false;
};

const settingsCacheTtl = 24 * 60 * 60 * 1000;
const settingsMemoryCache: Record<string, any> = {};

const getCachedSetting = (key: string) => {
  if (settingsMemoryCache[key]) {
    return settingsMemoryCache[key];
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    if (!rawValue) {
      return null;
    }

    const cached = JSON.parse(rawValue);
    if (Date.now() - cached.savedAt > settingsCacheTtl) {
      window.localStorage.removeItem(key);
      return null;
    }

    settingsMemoryCache[key] = cached.value;
    return cached.value;
  } catch (error) {
    return null;
  }
};

const setCachedSetting = (key: string, value: any) => {
  settingsMemoryCache[key] = value;
  try {
    window.localStorage.setItem(
      key,
      JSON.stringify({ savedAt: Date.now(), value })
    );
  } catch (error) {
    // Browser storage can be unavailable in private mode.
  }
};

export default function VPForm(props: any) {
  const history = useHistory();
  let { data } = props;
  const sectionTabs = [
    { id: "home", label: "मुलघरको विवरण", target: "ward_id", fallback: "hoh_contact_num" },
    { id: "family_member", label: "परिवार सदस्य", target: "pariwar-ko-bibaran-section", fallback: "pariwar-ko-bibaran-section" },
    { id: "family_extra_info", label: "सदस्यको विविध विवरण", target: "has_foreign_member", fallback: "has_technical_training-" },
    // { id: "house_land", label: "घर/जग्गा/व्यवसाय", target: "total_house_count", fallback: "agriculture_situation" },
    // { id: "animal", label: "कृषि/पशु चौपाया", target: "agriculture_situation", fallback: "total_house_count" },
    // { id: "disaster", label: "प्राकृतिक प्रकोप", target: "has_natural_disaster", fallback: "agriculture_situation" },
    // { id: "pregnancy", label: "प्रसूती", target: "has_pregchild_health", fallback: "has_natural_disaster" },
    // { id: "other_details", label: "विविध", target: "is_responder_member", fallback: "has_pregchild_health" },
  ];

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([] as IError[]);
  const [activeSection, setActiveSection] = useState("home");
  const [auth, setAuth] = useState({} as IUser);
  const [wards, setWards] = useState([] as IWard[]);
  const [sabikWards, setSabikWards] = useState([] as ISabikWard[]);
  const [bastis, setBastis] = useState([] as IBasti[]);
  const [margas, setMargas] = useState([] as IMarga[]);
  const [jaatis, setJaatis] = useState([] as IJaati[]);
  const [countries, setCountries] = useState([] as ICountry[]);
  const [districts, setDistricts] = useState([] as IDistrict[]);
  const [country_samuhas, setCountrySamuhas] = useState([] as ICountrySamuha[]);
  const [mother_tongues, setMotherTongues] = useState([] as IMotherTongue[]);
  const [jaatiSamuhas, setJaatiSamuhas] = useState([] as IJaatiSamuha[]);
  const [dharmas, setDharmas] = useState([] as IDharma[]);
  const [household, setHousehold] = useState({} as IHousehold);
  // const [members, setMembers] = useState([] as IMember[]);
  const [occupations, setOccupations] = useState([] as IOccupation[]);
  const [education_stages, setEducationStages] = useState([] as IEducationStage[]);
  const [education_backgrounds, setEducationBackgrounds] = useState([] as any[]);
  const [current_bs_date, setCurrentBsDate] = useState("");
  const [profession_categories, setProfessionCategories] = useState([] as IProfessionCategory[]);
  const [professions, setProfessions] = useState([] as IProfession[]);
  const [existingMemberPool, setExistingMemberPool] = useState([] as IMember[]);
  const [technical_skills, setTechnicalSkills] = useState(
    [] as ITechnicalSkill[]
  );
  const [vehicle_types, setVehicleTypes] = useState([] as IVehicleType[]);
  const [land_types, setLandTypes] = useState([] as any[]);
  
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [errors.length]);
  useEffect(() => {
    checkUser();
    loadAllWada();
    loadJaatiAndDharma();
  }, []);

  useEffect(() => {
    const baseHousehold = { ...data.household };
    if (!baseHousehold.id && (!baseHousehold.members || !baseHousehold.members.length)) {
      baseHousehold.num_of_member = 0;
      baseHousehold.members = [];
    }
    setHousehold(baseHousehold);
    loadExistingMemberPool(baseHousehold.id);
    if (data.household) {
      if (data.household.ward_id) {
        loadSabikWardByWadaId(data.household.ward_id);
      }
      if (data.household.sabikWard_id) {
        loadBastiBySabikWadaId(data.household.sabikWard_id);
      }
      // if (data.household.ward_id) {
      //   loadBastiByWadaId(data.household.ward_id);
      // }
      if (data.household.basti_id) {
        loadMargaByBastiId(data.household.basti_id);
      }
      if (data.household.id) {
        loadMembersByHoushold(data.household.id);
      }
    }
  }, [data.household]);

  useEffect(() => {
    // In edit mode, rehydrate dependent option lists so saved defaults can be selected.
    if (!household?.id) {
      return;
    }
    if (household.ward_id) {
      loadSabikWardByWadaId(household.ward_id);
    }
    if (household.sabikWard_id) {
      loadBastiBySabikWadaId(household.sabikWard_id);
    }
    if (household.basti_id) {
      loadMargaByBastiId(household.basti_id);
    }
  }, [household?.id, household?.ward_id, household?.sabikWard_id, household?.basti_id, auth?.office_id]);

  const loadMembersByHoushold = async (household_id: string) => {
    let mems = await getMembersbyHousehold(household_id);
    // setHousehold((household) => ({
    //   ...household,
    //   members: [...mems],
    // }));
    console.log("nnn",data.household.num_of_member, mems)
    setHousehold((household) => ({
      ...household,
      members: [...mems],
    }));
    // setMembersInHousehold(data.household.num_of_member, mems);
  };

  const loadExistingMemberPool = async (currentHouseholdId?: any) => {
    const allMembers = await getAllMember();
    const normalizedHouseholdId = `${currentHouseholdId ?? household?.id ?? ""}`;
    const pool = allMembers.filter((member: any) => {
      if (`${member?.status ?? ""}` !== "0") {
        return false;
      }
      if (!normalizedHouseholdId) {
        return true;
      }
      return `${member?.hh_id ?? ""}` !== normalizedHouseholdId;
    });
    setExistingMemberPool(pool);
  };

  const checkUser = async () => {
    let auth_ = await getAllUsers();
    if (auth_.length) {
      setAuth({ ...auth_[0] });
    }
  };

  async function loadAllWada() {
    let wards = await getAllWards();
    setWards([...wards]);
  }

  const loadJaatiAndDharma = async () => {
    let mts = await getAllMotherToungues();
    setMotherTongues([...mts]);
    let jaatis_samuhas = await getAllJaatiSamuhas();
    setJaatiSamuhas([...jaatis_samuhas]);
    let jaatis_ = await getAllJaatis();
    setJaatis([...jaatis_]);
    let CountryS_samuhas = await getAllCountrySamuhas();
    setCountrySamuhas([...CountryS_samuhas]);
    let CountryS_ = await getAllCountrys();
    setCountries([...CountryS_]);
    let districts_ = await getAllDistricts();
    if (!districts_.length && window.navigator.onLine) {
      await getDistrict();
      districts_ = await getAllDistricts();
    }
    setDistricts([...districts_]);
    let dharmas_ = await getAllDharmas();
    setDharmas([...dharmas_]);
    let occupations_ = await getAllOccupations();
    setOccupations([...occupations_]);
    let education_stages_ = await getAllEducationStages();
    setEducationStages([...education_stages_]);
    const cachedEducationBackgrounds = getCachedSetting("vp_education_backgrounds");
    if (cachedEducationBackgrounds) {
      setEducationBackgrounds([...cachedEducationBackgrounds]);
    } else {
      try {
        let education_backgrounds_ = await api.loadEducationBackgrounds();
        const options = education_backgrounds_?.data ?? [];
        setCachedSetting("vp_education_backgrounds", options);
        setEducationBackgrounds([...options]);
      } catch (error) {
        setEducationBackgrounds([]);
      }
    }
    const cachedLandTypes = getCachedSetting("vp_land_types");
    try {
      if (cachedLandTypes) {
        setLandTypes([...cachedLandTypes]);
      } else {
        const landTypesResponse = await api.loadLandTypes();
        const options = landTypesResponse?.data ?? staticLandTypes;
        setCachedSetting("vp_land_types", options);
        setLandTypes([...options]);
      }
    } catch (error) {
      setLandTypes([...staticLandTypes]);
    }
    setCurrentBsDate(new NepaliDate().format("YYYY-MM-DD"));
    let profession_categories_ = await getAllProfessionCategories();
    setProfessionCategories([...profession_categories_]);
    let professions_ = await getAllProfessions();
    setProfessions([...professions_]);
    let ts = await getAllTechnicalSkills();
    setTechnicalSkills([...ts]);
    let vts = await getAllVehicleTypes();
    setVehicleTypes([...vts]);
  };

  const saveAndExitHousehold = async () => {
    setLoading(true);
    let hh_id: any;
    if (household.id) {
      hh_id = household.id;
      await updateHousehold({ ...household, is_posted: "0", is_deleted: "0" });
    } else {
      hh_id = await addNewHousehold({
        ...household,
        status: "0",
        is_posted: "0",
        is_deleted: "0",
        user_id: auth.id?.toString(),
      });
      setHousehold((household) => ({
        ...household,
        id: hh_id,
        is_posted: "0",
        is_deleted: "0",
        user_id: auth.id?.toString(),
      }));
    }
    await saveMembers(hh_id);

    setLoading(false);
    history.push("/village-profile-app/app");
  };

  const saveHousehold = async () => {
   
    setLoading(true);
    let hh_id: any;
    if (household.id) {
      hh_id = household.id;
      await updateHousehold({ ...household, is_posted: "0", is_deleted: "0" });
    } else {
      hh_id = await addNewHousehold({
        ...household,
        status: "0",
        is_posted: "0",
        is_deleted: "0",
        user_id: auth.id?.toString(),
      });
      setHousehold((household) => ({
        ...household,
        id: hh_id,
        is_posted: "0",
        is_deleted: "0",
        user_id: auth.id?.toString(),
      }));
    }
    await saveMembers(hh_id);
    setLoading(false);
    return hh_id;
  };

  const saveMembers = async (hh_id: any) => {
    setLoading(true);
    const memberList = [...(household.members ?? [])];
    if (memberList.length) {
      const normalizedHouseholdId = Number(hh_id);
      const memberHouseholdId = Number.isNaN(normalizedHouseholdId)
        ? `${hh_id ?? ""}`
        : normalizedHouseholdId;

      await Promise.all(
        memberList.map(async (member, key) => {
          const normalizedMember = {
            ...member,
            hh_id: memberHouseholdId as any,
            user_id: member?.user_id ?? auth.id?.toString(),
          } as IMember;

          delete (normalizedMember as any).__memberIndex;

          if (normalizedMember.id) {
            await updateMember(normalizedMember);
            memberList[key] = normalizedMember;
            return;
          }

          const m_id = await addNewMember(normalizedMember);
          memberList[key] = {
            ...normalizedMember,
            id: m_id,
          };
        })
      );

      setHousehold((prev) => ({
        ...prev,
        members: memberList,
      }));
    }
    setLoading(false);
  };

  // const loadSabikWardByWadaId = async (wardId: any) => {
  //   let sabikWards = await getSabikWardById(wardId);
  //   setsabikWards([...sabikWards]);
  // };
   const loadSabikWardByWadaId = async (wardId: any) => {
    let sabikWards = await getSabikWardByWardId(wardId);
    setSabikWards([...sabikWards]);
  };

  // const loadBastiByWadaId = async (wardId: any) => {
  //   let bastis = await getBastiByWardId(wardId);
  //   setBastis([...bastis]);
  // };

  const loadBastiBySabikWadaId = async (sabikWardId: any) => {
    let bastis = await getBastiBySabikWardId(sabikWardId);
    setBastis([...bastis]);
  };

  const loadMargaByBastiId = async (bastiId: any) => {
    const localMargas = await getMargaByBastiId(bastiId);
    if (localMargas.length) {
      setMargas([...localMargas]);
      return;
    }

    // Fallback for stale local sync: fetch filtered marga directly from server.
    let officeId = auth?.office_id;
    if (!officeId) {
      const users = await getAllUsers();
      officeId = users?.[0]?.office_id;
    }

    if (window.navigator.onLine && officeId) {
      try {
        const response = await api.loadMarga(officeId, `${bastiId}`);
        if (response.status === 200 && Array.isArray(response.data)) {
          const normalized = response.data.map((m: any) => ({
            id: Number(m.id),
            name: m.name,
            status: Number(m.status),
            wardId: Number(m.ward_id ?? m.wardId),
            sabikWardId: Number(m.sabik_ward_id ?? m.sabikWardId),
            bastiId: Number(m.basti_id ?? m.bastiId),
          }));
          setMargas(normalized);
          return;
        }
      } catch (error) {
        console.log("marga fallback load failed", error);
      }
    }

    setMargas([]);
  };

  const loadJaatiByJaatiSamuhaId = async (jaati_samuha_id: any) => {
    let jaatis = await getJaatiBySamuhaId(parseInt(jaati_samuha_id));
    setJaatis([...jaatis]);
  };

  const loadAllJaati = async () => {
    let jaatis = await getAllJaatis();
    setJaatis([...jaatis]);
  };

  const loadCountryByCountrySamuhaId = async (country_samuha_id: any) => {
    let cs = await getCountryBySamuhaId(parseInt(country_samuha_id));
    setCountries([...cs]);
  };

  const loadAllCountry = async () => {
    let countries = await getAllCountrys();
    setCountries([...countries]);
  };

  const handleChange = (e: any) => {
    // if (e.target.name === "ward_id") {
    //   loadBastiBySabikWadaId(e.target.value);
    // }

    if (e.target.name === "ward_id") {
      loadSabikWardByWadaId(e.target.value);
    }
    if (e.target.name === "sabikWard_id") {
      loadBastiBySabikWadaId(e.target.value);
    }
    if (e.target.name === "basti_id") {
      loadMargaByBastiId(e.target.value);
      setHousehold((household) => ({
        ...household,
        basti_id: e.target.value,
        marga_id: "",
      }));
      return;
    }
    if (e.target.name === "jaati_samuha_id") {
      if (e.target.value) {
        loadJaatiByJaatiSamuhaId(e.target.value);
      } else {
        loadAllJaati();
      }
    }
    if (e.target.name === "country_samuha_id") {
      if (e.target.value) {
        loadCountryByCountrySamuhaId(e.target.value);
      } else {
        loadAllCountry();
      }
    }
    if (e.target.name === "resident_type") {
      const selectedType = `${e.target.value ?? ""}`;
      if (selectedType === "2") {
        setHousehold((household) => ({
          ...household,
          resident_type: selectedType,
          resident_origin_type: household.resident_origin_type || "inside_nepal",
          origin_member_count: "",
        }));
      } else if (selectedType === "3") {
        setHousehold((household) => ({
          ...household,
          resident_type: selectedType,
          resident_origin_type: household.resident_origin_type || "inside_nepal",
          origin_member_count: "",
        }));
      } else {
        setHousehold((household) => ({
          ...household,
          resident_type: selectedType,
          resident_origin_type: "",
          origin_district_id: "",
          origin_country_id: "",
          migration_date: "",
          origin_member_count: "",
          resident_district: "",
        }));
      }
      return;
    }
    if (e.target.name === "resident_origin_type") {
      if (e.target.value === "inside_nepal") {
        console.log("Switching to inside_nepal, migration_date:", household.migration_date);
        setHousehold((household) => ({
          ...household,
          resident_origin_type: e.target.value,
          origin_country_id: "",
          resident_district: "",
          migration_date: household.migration_date,
          origin_member_count: household.origin_member_count,
        }));
      } else if (e.target.value === "outside_nepal") {
        console.log("Switching to outside_nepal, migration_date:", household.migration_date);
        setHousehold((household) => ({
          ...household,
          resident_origin_type: e.target.value,
          origin_district_id: "",
          resident_district: "",
          migration_date: household.migration_date,
          origin_member_count: household.origin_member_count,
        }));
      }
      return;
    }
    if (e.target.name === "origin_district_id") {
      const selectedDistrict = districts.find((item: any) => `${item.id}` === `${e.target.value}`);
      console.log("Selected district, migration_date before:", household.migration_date);
      setHousehold((household) => ({
        ...household,
        origin_district_id: e.target.value,
        origin_country_id: "",
        resident_district: selectedDistrict?.name || "",
        migration_date: household.migration_date,
        origin_member_count: household.origin_member_count,
      }));
      return;
    }
    if (e.target.name === "origin_country_id") {
      const selectedCountry = countries.find((item: any) => `${item.id}` === `${e.target.value}`);
      console.log("Selected country, migration_date before:", household.migration_date);
      setHousehold((household) => ({
        ...household,
        origin_country_id: e.target.value,
        origin_district_id: "",
        resident_district: selectedCountry?.name || "",
        migration_date: household.migration_date,
        origin_member_count: household.origin_member_count,
      }));
      return;
    }
    if (e.target.name === "num_of_member") {
      if (e.target.value > 30) return;
      setMembersInHousehold(e.target.value, household.members);
    }
    if (e.target.name === "migration_date") {
      console.log("migration_date changed to:", e.target.value);
    }
    setHousehold((household) => ({
      ...household,
      [e.target.name]: e.target.value,
    }));
  };
  const setMembersInHousehold = (num_of_member: string, hhm: IMember[]) => {
    console.log(num_of_member, hhm)
    var newMemberList_ = [] as IMember[];
    // let existingMembersCount = hhm.length;
    // if (existingMembersCount > parseInt(num_of_member)) {
    //   newMemberList_ = hhm;
    //   for (
    //     let x = 0;
    //     x <= existingMembersCount - parseInt(num_of_member);
    //     x++
    //   ) {
    //     newMemberList_.splice(-1);
    //   }
    // } else if (parseInt(num_of_member) > existingMembersCount) {
    //   for (let i = 0; i < parseInt(num_of_member), i++) {
    //     newMemberList_.push(memberDefault);
    //   }
    // }
    for (let i = 0; i < parseInt(num_of_member); i++) {
      console.log("zzz", i)
      let newMember = {} as IMember
      if(hhm.length > i){
        newMember = {... hhm[i]}
        // newMemberList_.push(hhm[i]);
      }else{
        newMember = {...memberDefault}
      }
      if(i === 0 ){
        newMember.first_name = household.hoh_first_name
        newMember.last_name = household.hoh_last_name
        newMember.gender_id = household.hoh_gender
        newMember.mobile_num = household.hoh_contact_num
        newMember.relation_with_hoh_id = "1"
        
      }else{
        newMember.last_name = household.hoh_last_name
      }
      newMemberList_.push(newMember);
    }
    console.log("nm", newMemberList_)
    setHousehold((household) => ({
      ...household,
      members: [...newMemberList_],
    }));
  };
  const handleArrayChangeInHousehold = (name: string, value: any) => {
    setHousehold((household) => ({
      ...household,
      [name]: value,
    }));
  };

  const normalizeEducationBackground = (value: any) => {
    const mapping: Record<string, string> = {
      "1": "never_school",
      "2": "past_student",
      "3": "current_student",
      "4": "informal",
    };
    return mapping[`${value ?? ""}`] ?? value;
  };

  const handleMemberChange = (index: number, name: string, value: any) => {
    // Use functional state update so sequential field writes in one event
    // (e.g. dob_bs and age) are composed instead of overwriting each other.
    setHousehold((prev) => {
      const mems = [...(prev.members ?? [])];
      const current = mems[index] ?? ({} as IMember);
      const normalizedValue =
        name === "education_background" ? normalizeEducationBackground(value) : value;
      const mem = { ...current, [name]: normalizedValue };

      if (name === "relation_with_hoh_id" && `${value}` === "1") {
        const nextMembers = mems.map((m: any, i: number) => {
          if (i === index) {
            return { ...mem, is_hoh: "1" };
          }
          if (`${m?.relation_with_hoh_id ?? ""}` === "1") {
            return { ...m, relation_with_hoh_id: "", is_hoh: "0" };
          }
          return m;
        });
        return {
          ...prev,
          members: nextMembers,
        };
      }

      mems[index] =
        name === "relation_with_hoh_id"
          ? { ...mem, is_hoh: `${value}` === "1" ? "1" : "0" }
          : mem;

      return {
        ...prev,
        members: mems,
      };
    });
  };

  const handleAddMember = () => {
    const currentMembers = household.members ?? [];
    const newMember = {
      ...memberDefault,
      last_name: household.hoh_last_name ?? "",
      relation_with_hoh_id: "",
      __isNewlyAdded: "1",
    } as IMember;
    handleArrayChangeInHousehold("members", [...currentMembers, newMember]);
    setHousehold((prev) => ({
      ...prev,
      num_of_member: (currentMembers.length + 1) as any,
    }));
  };

  const handleAddExistingMember = (selectedMember: any) => {
    if (!selectedMember) {
      return;
    }

    const currentMembers = household.members ?? [];
    const selectedRef = `${selectedMember?.member_id ?? selectedMember?.id ?? ""}`;
    const selectedIndex = currentMembers.findIndex(
      (member: any, index: number) =>
        index === selectedMember.__memberIndex ||
        `${member?.member_id ?? member?.id ?? ""}` === selectedRef
    );
    const nextMembers = [...currentMembers];
    const normalizedSelectedMember = {
      ...selectedMember,
      hh_id: `${household?.id ?? ""}`,
      status: "1",
      present_status: selectedMember?.present_status ?? "1",
      is_hoh: "0",
      relation_with_hoh_id: "",
      remove_reason: "",
      __isNewlyAdded: undefined,
    } as any;
    delete normalizedSelectedMember.__memberIndex;

    if (selectedIndex > -1) {
      nextMembers[selectedIndex] = {
        ...nextMembers[selectedIndex],
        ...normalizedSelectedMember,
      };
    } else {
      nextMembers.push(normalizedSelectedMember);
    }

    const memberToPersist =
      selectedIndex > -1
        ? nextMembers[selectedIndex]
        : normalizedSelectedMember;

    if (memberToPersist?.id) {
      updateMember(memberToPersist);
    }

    handleArrayChangeInHousehold("members", nextMembers);
    setExistingMemberPool((pool) =>
      pool.filter((member: any) => `${member?.member_id ?? member?.id ?? ""}` !== selectedRef)
    );
    setHousehold((prev) => ({
      ...prev,
      members: nextMembers,
      num_of_member: nextMembers.filter(
        (member: any) => `${member?.status ?? ""}` !== "2" && `${member?.status ?? ""}` !== "0"
      ).length as any,
    }));
  };

  const handleDiscardNewMember = (index: number) => {
    const currentMembers = household.members ?? [];
    const targetMember = currentMembers[index] as any;
    if (!targetMember) {
      return;
    }
    if (targetMember.id || targetMember.member_id || `${targetMember.__isNewlyAdded ?? ""}` !== "1") {
      return;
    }

    const nextMembers = currentMembers.filter((_member: any, memberIndex: number) => memberIndex !== index);
    handleArrayChangeInHousehold("members", nextMembers);
    setHousehold((prev) => ({
      ...prev,
      members: nextMembers,
      num_of_member: nextMembers.length as any,
    }));
  };

  const getStableMemberRef = (member: any) =>
    `${member?.member_id ?? member?.id ?? ""}`;

  const normalizePulledMember = (
    rawMember: any,
    existingMember?: any
  ) => {
    const remoteMemberId = `${rawMember?.member_id ?? rawMember?.id ?? ""}`;
    const normalizedMember: any = {
      ...existingMember,
      ...removeSyncFields(rawMember),
      id: existingMember?.id,
      member_id: remoteMemberId ? Number(remoteMemberId) : existingMember?.member_id,
      hh_id: existingMember?.hh_id ?? rawMember?.hh_id ?? "",
      status: "0",
      __isNewlyAdded: undefined,
    };

    delete normalizedMember.__memberIndex;
    return normalizedMember as IMember;
  };

  const handleRemoveMemberRequest = async (index: number, removal: any) => {
    const currentMembers = household.members ?? [];
    if (currentMembers.length <= 1) {
      alert("At least one member is required.");
      return;
    }
    const targetMember = currentMembers[index];
    if (`${targetMember?.relation_with_hoh_id ?? ""}` === "1") {
      alert("You cannot delete household head. Change head first.");
      return;
    }

    const isExistingMember = Boolean(targetMember?.id || targetMember?.member_id);
    if (!isExistingMember) {
      const nextMembers = currentMembers.filter((_member: any, memberIndex: number) => memberIndex !== index);
      handleArrayChangeInHousehold("members", nextMembers);
      setHousehold((prev) => ({
        ...prev,
        members: nextMembers,
        num_of_member: nextMembers.filter(
          (member: any) => `${member?.status ?? ""}` !== "2" && `${member?.status ?? ""}` !== "0"
        ).length as any,
      }));
      return;
    }

    if (removal?.type === "death") {
      const oldMissing = household.missing_deceased_members ?? [];
      const newMissing = [
        ...oldMissing,
        {
          name: targetMember?.first_name
            ? `${targetMember.first_name} ${targetMember?.last_name ?? ""}`.trim()
            : "",
          gender: `${targetMember?.gender_id ?? ""}`,
          age: `${targetMember?.age ?? ""}`,
          reason_id: `${removal.reason_id ?? ""}`,
          reason: `${removal.reason_name ?? ""}`,
          date_of_death_bs: `${removal.date_of_death_bs ?? ""}`,
          remarks: `${removal.remarks ?? ""}`,
        } as any,
      ];
      handleArrayChangeInHousehold("missing_deceased_members", newMissing);
      handleArrayChangeInHousehold("has_missing_deceased_member", "1");
    } else if (removal?.type === "other") {
      // Keep audit note for migration/marriage/divorce/other removal.
      const previous = household.form_complaint ?? "";
      const memberName = `${targetMember?.first_name ?? ""} ${targetMember?.last_name ?? ""}`.trim();
      const note = `[Removed: ${memberName} | ${removal?.reason ?? "other"}]`;
      handleArrayChangeInHousehold("form_complaint", previous ? `${previous}; ${note}` : note);
    }

    const nextMembers = [...currentMembers];
    nextMembers[index] = {
      ...targetMember,
      status: "0",
      removed_from_household: "1",
      remove_reason:
        removal?.type === "death"
          ? (removal?.reason_name || "मृत्यु")
          : `${removal?.reason ?? "other"}`,
      remarks:
        removal?.type === "death"
          ? `${removal?.remarks ?? ""}`
          : `${targetMember?.remarks ?? ""}`,
    };

    handleArrayChangeInHousehold("members", nextMembers);
    setHousehold((prev) => ({
      ...prev,
      members: nextMembers,
      num_of_member: nextMembers.filter(
        (member: any) => `${member?.status ?? ""}` !== "2" && `${member?.status ?? ""}` !== "0"
      ).length as any,
    }));
    if (nextMembers[index]?.id) {
      await updateMember(nextMembers[index]);
    }
    await loadExistingMemberPool(household?.id);
  };

  const handlePullExistingMembers = async () => {
    try {
      setLoading(true);
      const householdId = household.id ? household.id : await saveHousehold();
      const response = await api.loadInactiveMembers();
      const inactiveMembers = response.data || [];

      const currentMembers = household.members ?? [];
      const allLocalMembers = await getAllMember();
      const localInactiveMembers = allLocalMembers.filter(
        (member: any) => `${member?.status ?? ""}` === "0"
      );
      const mergedMembers = [...currentMembers];
      const pulledExistingMembers: IMember[] = [];
      let addedCount = 0;
      let updatedCount = 0;

      for (const rawMember of inactiveMembers) {
        const remoteRef = `${rawMember?.member_id ?? rawMember?.id ?? ""}`;
        if (!remoteRef) {
          continue;
        }

        const existingStateIndex = mergedMembers.findIndex(
          (member: any) => getStableMemberRef(member) === remoteRef
        );
        const existingLocalMember = localInactiveMembers.find(
          (member: any) => `${member?.member_id ?? ""}` === remoteRef
        );
        const existingStateMember =
          existingStateIndex > -1 ? mergedMembers[existingStateIndex] : undefined;
        const normalizedMember = normalizePulledMember(
          rawMember,
          existingLocalMember ?? existingStateMember
        );

        if (normalizedMember.id) {
          await updateMember(normalizedMember);
          updatedCount += 1;
        } else {
          const localMemberId = await addNewMember(normalizedMember);
          normalizedMember.id = localMemberId;
          addedCount += 1;
        }

        if (existingStateIndex > -1) {
          mergedMembers[existingStateIndex] = normalizedMember;
        }
        pulledExistingMembers.push(normalizedMember);
      }

      if (addedCount === 0 && updatedCount === 0) {
        alert("No inactive members found to pull.");
        return;
      }

      handleArrayChangeInHousehold("members", mergedMembers);
      setExistingMemberPool((pool) => {
        const byRef = new Map<string, any>();
        [...pool, ...pulledExistingMembers].forEach((member: any) => {
          const ref = getStableMemberRef(member);
          if (ref) {
            byRef.set(ref, member);
          }
        });
        return Array.from(byRef.values());
      });
      setHousehold((prev) => ({
        ...prev,
        id: householdId,
        members: mergedMembers,
      }));

      alert(`Pulled members synced. Added: ${addedCount}, Updated: ${updatedCount}.`);
    } catch (error) {
      console.error("Error fetching inactive members:", error);
      alert("Failed to fetch inactive members. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const validate = (hh: IHousehold) => {
    let allErrors = [] as IError[];
    const addRequiredError = (name: string, messageKey = name) => {
      if (allErrors.some((error) => error.name === name)) {
        return;
      }
      var newError = {} as IError;
      newError.name = name;
      newError.message = getErrorMessage(messageKey);
      allErrors.push(newError);
    };
    const activeMembers = (hh.members ?? [])
      .map((member: IMember, index: number) => ({ member, index }))
      .filter(({ member }) => {
        const presentStatus = `${member?.present_status ?? ""}`.trim().toLowerCase();
        const isPresent =
          presentStatus === "" ||
          presentStatus === "1" ||
          presentStatus === "true" ||
          presentStatus === "present";

        return (
          `${member?.status ?? ""}` !== "2" &&
          `${member?.status ?? ""}` !== "0" &&
          isPresent
        );
      });
    const householdHeads = activeMembers.filter(
      ({ member }) => `${member?.relation_with_hoh_id ?? ""}` === "1"
    );

    [...partARequiredFields, ...partCRequiredFields].forEach((key) => {
      if (isRequiredValueMissing(hh[key])) {
        addRequiredError(key);
      }
    });

    if (["2", "3"].includes(`${hh.resident_type ?? ""}`)) {
      if (isRequiredValueMissing(hh.resident_origin_type)) {
        addRequiredError("resident_origin_type");
      }
      if (`${hh.resident_origin_type ?? "inside_nepal"}` === "outside_nepal") {
        if (isRequiredValueMissing(hh.origin_country_id)) {
          addRequiredError("origin_country_id");
        }
      } else if (isRequiredValueMissing(hh.origin_district_id)) {
        addRequiredError("origin_district_id");
      }
      if (isRequiredValueMissing(hh.migration_date)) {
        addRequiredError("migration_date");
      }
    }

    if (`${hh.is_responder_member ?? ""}` === "1") {
      if (isRequiredValueMissing(hh.responder_member_name)) {
        addRequiredError("responder_name", "responder_member_name");
      }
    } else if (`${hh.is_responder_member ?? ""}` === "0") {
      if (isRequiredValueMissing(hh.responder_name)) {
        addRequiredError("responder_name");
      }
    }

    activeMembers.forEach(({ member, index }) => {
      partBRequiredFields.forEach((mkey) => {
        if (isRequiredValueMissing(member[mkey])) {
          addRequiredError(mkey + "-" + index, mkey);
        }
      });
    });

    if (activeMembers.length > 0 && householdHeads.length !== 1) {
      var newError = {} as IError;
      newError.name = `relation_with_hoh_id-${activeMembers[0].index}`;
      newError.message =
        householdHeads.length === 0
          ? "One member must be selected as Head of House."
          : "Only one member can be selected as Head of House.";
      allErrors.push(newError);
    }

    setErrors([...allErrors]);
    return allErrors.length;
  };

  const getErrorMessage = (key: string) => {
    let msg = key + " is required";
    const requiredMessages: Record<string, string> = {
      resident_place: "Member residence place is required.",
      is_married: "Marital status is required.",
      education_background: "Education background is required.",
      education_stage_id: "Education qualification is required.",
      employment_status: "Employment status is required.",
      main_work_last_12_months: "Main work in last 12 months is required.",
      enroll_type: "Registration type is required.",
      has_voter_card: "Voter card status is required.",
      resident_origin_type: "Previous residence type is required.",
      origin_district_id: "Previous district is required.",
      origin_country_id: "Previous country is required.",
      migration_date: "Migration year is required.",
      agriculture_situation: "Agriculture situation is required.",
      has_business: "Business status is required.",
      has_cooperative_account: "Cooperative account count is required.",
      has_bank_account: "Bank account count is required.",
      is_responder_member: "Responder member status is required.",
      responder_member_name: "Responder member name is required.",
      responder_name: "Responder name is required.",
    };
    if (requiredMessages[key]) {
      return requiredMessages[key];
    }
    switch (key) {
      case "ward_id": {
        msg = "वडाको नाम";
        break;
      }
      case "sabikWard_id": {
        msg = "साविक. वडा";
        // msg = "टोलको नाम";
        break;
      }

      case "basti_id": {
        msg = "बस्तिको नाम";
        // msg = "टोलको नाम";
        break;
      }
      case "marga_id": {
        msg = "टोलको नाम";
        // msg = "मार्गको नाम";
        break;
      }
      case "hoh_first_name": {
        msg = "घरमुलीको नाम छुटेको छ।";
         break;
      }
      case "hoh_last_name": {
        msg = "घरमुलीको थर छुटेको छ।";
         break;
      }
      case "hoh_contact_num": {
        msg = "घरमुलीको सम्पर्क छुटेको छ।";
         break;
      }
      case "dob_bs": {
        msg = "जन्ममिति छुटेको छ।";
         break;
      }
      case "first_name": {
        msg = "सदस्यको नाम छुटेको छ।";
         break;
      }
      case "last_name": {
        msg = "सदस्यको थर छुटेको छ।";
         break;
      }
      case "relation_with_hoh_id": {
        msg = "घरमुलीसँग नाता छुटेको छ।";
         break;
      }
      // case "gender_id": {
      //   msg = "जन्ममिति छुटेको छ।";
      //    break;
      // }
      case "gender_id": {
        msg = "लिङ्ग छुटेको छ।";
         break;
      }
      // case "gender_id": {
      //   msg = "लिङ्ग छुटेको छ।";
      //    break;
      // }
    }
    return msg;
  };

  const complete = async () => {
    let hh_id = await saveHousehold();
    let errorLength = validate(household);
    if (errorLength === 0) {
      await updateHousehold({ ...household, is_complete: "1", is_posted: "0", is_deleted: "0", id: hh_id });
      history.push("/village-profile-app/app");
    }
  };

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const goToSection = (id: string, target: string, fallback?: string) => {
    setActiveSection(id);
    const targetElement = document.getElementById(target);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (fallback) {
      scrollTo(fallback);
    }
  };
  if (loading) {
    return <div className="loading">Loading..</div>;
  }
  return (
    <div className="vp-form-wrapper">
      <button
        className="btn btn-sm btn-warning back-btn"
        onClick={() => history.goBack()}
        style={{ zIndex: 9999, position: "absolute", right: "10px", top: "10px" }}
      >
        Back
      </button>
      <div className="save-btns">
        <div>
          <button
            className="btn btn-sm btn-warning"
            onClick={() => scrollTo("ward_id")}
          >
            &#x2191;
          </button>
          <button
            className="btn btn-sm btn-info"
            onClick={() => scrollTo("last")}
          >
            &#x2193;
          </button>
        </div>
      </div>
      <div className="vp-form">
        <div className="vp-form-tabs">
          {sectionTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`btn btn-sm ${
                activeSection === tab.id ? "btn-primary" : "btn-outline-secondary"
              }`}
              onClick={() => goToSection(tab.id, tab.target, tab.fallback)}
              style={{ margin: "4px" }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <GharKoBiabarn
          hh={household}
          handleChange={handleChange}
          wards={wards}
          sabikWards={sabikWards}
          bastis={bastis}
          margas={margas}
          jaatis={jaatis}
          jaati_samuhas={jaatiSamuhas}
          districts={districts}
          countries={countries}
          dharmas={dharmas}
          mother_tongues={mother_tongues}
          handleArrayChangeInHousehold={handleArrayChangeInHousehold}
          errors={errors}
        />
        <div id="pariwar-ko-bibaran-section">
          <PariwarKoBibaran
            household={household}
            existingMemberPool={existingMemberPool}
            handleMemberChange={handleMemberChange}
            handleAddMember={handleAddMember}
            handleAddExistingMember={handleAddExistingMember}
            handleDiscardNewMember={handleDiscardNewMember}
            handleRemoveMemberRequest={handleRemoveMemberRequest}
            handlePullExistingMembers={handlePullExistingMembers}
            occupations={occupations}
            education_stages={education_stages}
            education_backgrounds={education_backgrounds}
            current_bs_date={current_bs_date}
            profession_categories={profession_categories}
            professions={professions}
            technical_skills={technical_skills}
            handleArrayChangeInHousehold={handleArrayChangeInHousehold}
            errors={errors}
          />
        </div>
        <GharKoDetailBiabarn
          hh={household}
          handleChange={handleChange}
          wards={wards}
          countries={countries}
          country_samuhas={country_samuhas}
          land_types={land_types}
          technical_skills={technical_skills}
          vehicle_types={vehicle_types}
          handleArrayChangeInHousehold={handleArrayChangeInHousehold}
          errors={errors}
        />
        <div className="" style={{ height: "15vh" }} id="last">
          <div className="" style={{textAlign: "center", marginTop:"20px"}}>
            <div className="btn btn-success" onClick={complete}>
              पुरा भयो ।
            </div>
          </div>
        </div>
      </div>
      {errors.length > 0 && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            backgroundColor: "white",
            border: "2px solid red",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            zIndex: 1000,
            maxWidth: "300px",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <h4 style={{ color: "red", marginTop: 0 }}>Required fields missing</h4>
          <ol style={{ paddingLeft: "20px", marginBottom: 0 }}>
            {errors.map((error, index) => (
              <li
                key={index}
                onClick={() => scrollTo(error.name)}
                style={{ cursor: "pointer", color: "blue" }}
              >
                {error.message}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
