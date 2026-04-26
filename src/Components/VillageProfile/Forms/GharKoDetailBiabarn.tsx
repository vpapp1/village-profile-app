import { useEffect, useState } from "react";
import {
  IAnimal,
  IForeignMember,
  IChronicDiseaseMember,
  IDisabiltyMember,
  IVehicle,
  IHousehold,
  IHouse,
  IDisaster,
  ILand,
  IBusiness,
  IMissingDeceasedMember,
  ITrainingDetail,
} from "../../../db/models/Household";
import {
  developmentOption,
  disability_card_types,
  disability_types,
  disease_names,  cooking_fuels,
  death_reasons,
  expense_sources,
  vehicle_types as static_vehicle_types,
  foreign_reasons,
  income_sources,
  house_types,
  disaster_types,
  disaster_location,
  water_sources,
  land_types as static_land_types,
  technical_skills as static_technical_skills,
} from "../../../enums";
import Multiselect from "multiselect-react-dropdown";

let initialForeignMember = {
  member_name: "",
  reason_id: "",
  reason: "",
  country: "",
  country_id: "",
  country_samuha_id: "",
  in_abroad: "1",
  total_abroad_age:""
  // visited_year_bs: "",
  // return_year_bs: "",
  // monthly_income: "",
} as IForeignMember;

const initialTechSkillMember = {
  member_name: "",
  skill_id: "",
  source: "",
  skill_name: "",
  duration: "",
} as ITrainingDetail;

let initialChronicDiseaseMember = {
  member_name: "",
  disease_name: "",
  reason_id: "",
  treatment_condition: "",
} as IChronicDiseaseMember;

let initialDisabilityMember = {
  member_name: "",
  disability_type: "",
  disability_card: "",
} as IDisabiltyMember;


let initialMissingMember = {
  name: "",
  reason_id: "",
  reason: "",
  gender: "",
  age: "",
} as IMissingDeceasedMember;

const initialInactiveMember = {
  member_index: "",
  status: "1",
  remove_reason: "",
  remarks: "",
};

const initialVehicle = {
  member_name: "",
  vehicle_type: "",
  vehicle_type_id: "",
  count: "",
} as IVehicle;

let initialAnimal = {
  animal: "",
  animal_type_id: "",
  count: "1",
} as IAnimal;
let initialHouse = {
    house_type_id: "",
    house_type: "",
    location: "",
    house_qty: "",
    ward_id: "",
    remarks: "",
} as IHouse;

let initialDisaster = {
  disaster_type: "",
  disaster_location:"",
  disaster_priority: "",
  remarks: "",
} as IDisaster;


let initialLand = {
  land_type_id: "",
  land_type: "",
  location: "",
  total_area: "",
  area_unit: "",
  land_use_type: "",
  uncultivated_land_area: "",
  irrigated_area: "",
  irrigation: "",
  kitta_no: "",
  ward_id: "",
  remarks: "",
} as ILand;

const businessPlaces = [
  { id: "गाउँपालिका", name: "गाउँपालिका" },
  { id: "जिल्ला", name: "जिल्ला" },
  { id: "काठमान्डौ उपत्यका", name: "काठमान्डौ उपत्यका" },
  { id: "बागमती प्रदेस", name: "बागमती प्रदेस" },
  { id: "अन्य प्रदेस", name: "अन्य प्रदेस" },
  { id: "बिदेश", name: "बिदेश" },
];

const businessTypes = [
  { id: "1", name: "कृषि" },
  { id: "2", name: "व्यापार/व्यवसाय" },
  { id: "3", name: "उद्योग" },
  { id: "4", name: "सेवा" },
  { id: "5", name: "अन्य" },
];

let initialBusiness = {
  member_name: "",
  member_id: "",
  business_type_id: "",
  business_type: "",
  business_place: "",
  type: "",
  remarks: "",
} as IBusiness;
export default function GharKoDetailBiabarn(props: any) {
  let {
    hh,
    members,
    countries,
    country_samuhas,
    land_types = static_land_types,
    technical_skills = static_technical_skills,
    vehicle_types = static_vehicle_types,
  } = props;
  let { handleChange, handleArrayChangeInHousehold } = props;
  const [household, setHousehold] = useState({ ...hh } as IHousehold);
  const [foreignMember, setForeignMember] = useState(initialForeignMember);
  const [chronicDiseaseMember, setchronicDiseaseMember] = useState(initialChronicDiseaseMember);
  const [techSkillMember, setTechSkillMember] = useState(initialTechSkillMember);
  const [disabilityMember, setdisabilityMember] = useState(initialDisabilityMember);
  const [missingMember, setMissingMember] = useState(initialMissingMember);
  const [inactiveMember, setInactiveMember] = useState(initialInactiveMember);
  const [vehicle, setVehicle] = useState(initialVehicle);
  const [animal, setAnimal] = useState(initialAnimal);
  const [house, setHouse] = useState(initialHouse);
  const [disaster, setDisaster] = useState(initialDisaster);
  const [land, setLand] = useState(initialLand);
  const [business, setBusiness] = useState(initialBusiness);
  const [filter_countries, setFilterCountries] = useState([]);
  
  // Edit mode states
  const [editingForeignMemberId, setEditingForeignMemberId] = useState<number | null>(null);
  const [editingInactiveMemberId, setEditingInactiveMemberId] = useState<number | null>(null);
  const [editingVehicleId, setEditingVehicleId] = useState<number | null>(null);
  const [editingHouseId, setEditingHouseId] = useState<number | null>(null);
  const [editingLandId, setEditingLandId] = useState<number | null>(null);
  const [editingBusinessId, setEditingBusinessId] = useState<number | null>(null);
  const [editingTechSkillId, setEditingTechSkillId] = useState<number | null>(null);
  const [editingChronicDiseaseId, setEditingChronicDiseaseId] = useState<number | null>(null);
  const [editingDisabilityId, setEditingDisabilityId] = useState<number | null>(null);

  useEffect(() => {
    setHousehold({ ...hh });
  }, [hh]);

  land_types = land_types && land_types.length ? land_types : static_land_types;
  technical_skills = technical_skills && technical_skills.length ? technical_skills : static_technical_skills;
  vehicle_types = vehicle_types && vehicle_types.length ? vehicle_types : static_vehicle_types;

  const hasTechnicalSkillRows = (household.technical_skills_members ?? []).length > 0;
  const effectiveHasTechnicalTraining =
    `${household.has_technical_training ?? ""}` === "1" || hasTechnicalSkillRows;
  const hasDisabilityRows = (household.disability_members ?? []).length > 0;
  const effectiveHasDisability =
    `${household.has_disability ?? ""}` === "1" || hasDisabilityRows;

  const hiddenCQuestions = new Set([
    7, 8, 9, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 24, 25, 26,
  ]);
  const shouldHideCQuestion = (questionNo: number) => hiddenCQuestions.has(questionNo);

  const handleHouseholdFieldChange = (e: any) => {
    const { name, value } = e.target;
    setHousehold((household) => ({
      ...household,
      [name]: value,
    }));
    handleArrayChangeInHousehold(name, value);
  };

  const handleForeignMemberChange = (e: any) => {
       setForeignMember((foreignMember) => ({
      ...foreignMember,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name === "member_name" && members && members.length) {
      let v = members.find((s: any) => s.first_name === e.target.value);
      if (v) {
        setForeignMember((foreignMember) => ({
          ...foreignMember,
          member_name: v.first_name,
        }));
      }
    }
    if(e.target.name === "country_samuha_id"){
      let new_countries = (countries ?? []).filter((s: any) => `${s.country_samuha_id ?? ""}` === `${e.target.value ?? ""}`);
      setFilterCountries(new_countries);
      setForeignMember((foreignMember) => ({
        ...foreignMember,
        country_id: "",
        country: "",
      }));
    }

    if (e.target.name === "country_id") {
      let v = (countries ?? []).find((s: any) => `${s.id ?? ""}` === `${e.target.value ?? ""}`);
      setForeignMember((foreignMember) => ({
        ...foreignMember,
        country: v?.name ?? "",
      }));
    }
  };   

  const handleTechSkillChange = (e: any) => {
    setTechSkillMember((techSkillMember) => ({
      ...techSkillMember,
      [e.target.name]: e.target.value,
    }));

    if (e.target.name === "member_name" && members && members.length) {
      let v = members.find((s: any) => s.first_name === e.target.value);
      if (v) {
        setTechSkillMember((techSkillMember) => ({
          ...techSkillMember,
          member_name: v.first_name,
        }));
      }
    }

    if (e.target.name === "skill_id") {
      let skill = technical_skills.find((s: any) => `${s.id}` === `${e.target.value}`);
      if (skill) {
        setTechSkillMember((techSkillMember) => ({
          ...techSkillMember,
          skill_id: `${skill.id}`,
          skill_name: skill.name,
        }));
      }
    }

    if (e.target.name === "source" && e.target.value !== "1") {
      setTechSkillMember((techSkillMember) => ({
        ...techSkillMember,
        duration: "",
      }));
    }
  };

     const saveTechSkill = (cmd: string, index?: any) => {
      let newTechSkillMember;
       
      if (cmd === "add") {
        if (techSkillMember.member_name === "" || techSkillMember.skill_id === "") {
          alert("सदस्य र सीप छान्नुहोस");
          return;
        }
        newTechSkillMember = [...(household.technical_skills_members ?? [])];
        newTechSkillMember.push({ ...techSkillMember });
      } else if (cmd === "edit") {
        if (techSkillMember.member_name === "" || techSkillMember.skill_id === "") {
          alert("सदस्य र सीप छान्नुहोस");
          return;
        }
        newTechSkillMember = [...(household.technical_skills_members ?? [])];
        newTechSkillMember[index] = { ...techSkillMember };
        setEditingTechSkillId(null);
      } else {
        newTechSkillMember = [...(household.technical_skills_members ?? [])];
        newTechSkillMember.splice(index, 1);
      }
      handleArrayChangeInHousehold("technical_skills_members", newTechSkillMember);
      handleArrayChangeInHousehold("has_technical_training", newTechSkillMember.length > 0 ? "1" : "0");
      setTechSkillMember({ ...initialTechSkillMember });
    };

    const editTechSkill = (index: number) => {
      const techSkillToEdit = household.technical_skills_members?.[index];
      if (techSkillToEdit) {
        let skillId = techSkillToEdit.skill_id;
        if (!skillId && techSkillToEdit.skill_name) {
          const foundSkill = technical_skills.find(
            (skill: any) => skill.name === techSkillToEdit.skill_name
          );
          skillId = foundSkill?.id || "";
        }

        setTechSkillMember({
          ...techSkillToEdit,
          skill_id: skillId,
          source:
            techSkillToEdit.source === undefined || techSkillToEdit.source === null
              ? ""
              : `${techSkillToEdit.source}`,
        });
      } else {
        setTechSkillMember({ ...initialTechSkillMember });
      }
      setEditingTechSkillId(index);
    };

    const cancelEditTechSkill = () => {
      setTechSkillMember({ ...initialTechSkillMember });
      setEditingTechSkillId(null);
    };
    
  
  const handleChronicDiseaseMemberChange = (e: any) => {
    setchronicDiseaseMember((chronicDiseaseMember) => ({
      ...chronicDiseaseMember,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name === "member_name" && members && members.length) {
      let v = members.find((s: any) => s.first_name === e.target.value);
      if (v) {
        setchronicDiseaseMember((chronicDiseaseMember) => ({
          ...chronicDiseaseMember,
          member_name: v.first_name,
        }));
      }
    }
    if (e.target.name === "disease_name") {
      let disease = disease_names.find((d: any) => d.id === e.target.value);
      if (disease) {
        setchronicDiseaseMember((chronicDiseaseMember) => ({
          ...chronicDiseaseMember,
          disease_name: disease.name,
        }));
      }
    }
  };  

 
 const handleDisabilityMemberChange = (e: any) => {
  setdisabilityMember((disabilityMember) => ({
    ...disabilityMember,
    [e.target.name]: e.target.value,
  }));
  if (e.target.name === "member_name" && members && members.length) {
    let v = members.find((s: any) => s.first_name === e.target.value);
    if (v) {
      setdisabilityMember((disabilityMember) => ({
        ...disabilityMember,
        member_name: v.first_name,
      }));
    }
  }
  if (e.target.name === "disability_type") {
    let disType = disability_types.find((d: any) => `${d.id}` === `${e.target.value}`);
    if (disType) {
      setdisabilityMember((disabilityMember) => ({
        ...disabilityMember,
        disability_type: `${disType.id}`,
        disability_type_name: disType.name,
      }));
    }
  }
};  

  const saveForeignMember = (cmd: string, index?: any) => {
    let newForeignMember;
     
    if (cmd === "add") {
      if (foreignMember.member_name === "" || foreignMember.country === "") {
        alert("सदस्य र देश छान्नुहोस।");
        return;
      }
      newForeignMember = [...(household.foreign_members ?? [])];
      newForeignMember.push({ ...foreignMember });
    } else if (cmd === "edit") {
      if (foreignMember.member_name === "" || foreignMember.country === "") {
        alert("सदस्य र देश छान्नुहोस।");
        return;
      }
      newForeignMember = [...(household.foreign_members ?? [])];
      newForeignMember[index] = { ...foreignMember };
      setEditingForeignMemberId(null);
    } else {
      newForeignMember = [...(household.foreign_members ?? [])];
      newForeignMember.splice(index, 1);
    }
    handleArrayChangeInHousehold("foreign_members", newForeignMember);
    setForeignMember({ ...initialForeignMember });
  };

  const editForeignMember = (index: number) => {
    const memberToEdit = household.foreign_members?.[index] || initialForeignMember;
    setForeignMember(memberToEdit);
    // Filter countries based on selected country_samuha_id
    if (memberToEdit.country_samuha_id) {
      let new_countries = (countries ?? []).filter((s: any) => `${s.country_samuha_id ?? ""}` === `${memberToEdit.country_samuha_id ?? ""}`);
      setFilterCountries(new_countries);
    }
    setEditingForeignMemberId(index);
  };

  const cancelEditForeignMember = () => {
    setForeignMember({ ...initialForeignMember });
    setEditingForeignMemberId(null);
  };


  const saveChronicDiseaseMember = (cmd: string, index?: any) => {
    let newChronicDiseaseMember;
     
    if (cmd === "add") {
      if (chronicDiseaseMember.member_name === "" || chronicDiseaseMember.disease_name === "") {
        alert("सदस्य र रोगको नाम छान्नुहोस।");
        return;
      }
      newChronicDiseaseMember = [...(household.chronic_disease_members ?? [])];
      newChronicDiseaseMember.push({ ...chronicDiseaseMember });
    } else if (cmd === "edit") {
      if (chronicDiseaseMember.member_name === "" || chronicDiseaseMember.disease_name === "") {
        alert("सदस्य र रोगको नाम छान्नुहोस।");
        return;
      }
      newChronicDiseaseMember = [...(household.chronic_disease_members ?? [])];
      newChronicDiseaseMember[index] = { ...chronicDiseaseMember };
      setEditingChronicDiseaseId(null);
    } else {
      newChronicDiseaseMember = [...(household.chronic_disease_members ?? [])];
      newChronicDiseaseMember.splice(index, 1);
    }
    handleArrayChangeInHousehold("chronic_disease_members", newChronicDiseaseMember);
    setchronicDiseaseMember({ ...initialChronicDiseaseMember });
  };

  const editChronicDiseaseMember = (index: number) => {
    setchronicDiseaseMember(household.chronic_disease_members?.[index] || initialChronicDiseaseMember);
    setEditingChronicDiseaseId(index);
  };

  const cancelEditChronicDiseaseMember = () => {
    setchronicDiseaseMember({ ...initialChronicDiseaseMember });
    setEditingChronicDiseaseId(null);
  };
  const saveDisabilityMember = (cmd: string, index?: any) => {
    let newDisabilityMember;
     
    if (cmd === "add") {
      if (disabilityMember.member_name === "" || disabilityMember.disability_type === "") {
        alert("सदस्य र अपाङ्गताको प्रकार छान्नुहोस।");
        return;
      }
      newDisabilityMember = [...(household.disability_members ?? [])];
      newDisabilityMember.push({ ...disabilityMember });
    } else if (cmd === "edit") {
      if (disabilityMember.member_name === "" || disabilityMember.disability_type === "") {
        alert("सदस्य र अपाङ्गताको प्रकार छान्नुहोस।");
        return;
      }
      newDisabilityMember = [...(household.disability_members ?? [])];
      newDisabilityMember[index] = { ...disabilityMember };
      setEditingDisabilityId(null);
    } else {
      newDisabilityMember = [...(household.disability_members ?? [])];
      newDisabilityMember.splice(index, 1);
    }
    handleArrayChangeInHousehold("disability_members", newDisabilityMember);
    handleArrayChangeInHousehold("has_disability", newDisabilityMember.length > 0 ? "1" : "0");
    setdisabilityMember({ ...initialDisabilityMember });
  };

  const editDisabilityMember = (index: number) => {
    setdisabilityMember(household.disability_members?.[index] || initialDisabilityMember);
    setEditingDisabilityId(index);
  };

  const cancelEditDisabilityMember = () => {
    setdisabilityMember({ ...initialDisabilityMember });
    setEditingDisabilityId(null);
  };

  const handleMissingChange = (e: any) => {
    setMissingMember((missingMember) => ({
      ...missingMember,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name === "reason_id") {
      let v = death_reasons.find((s: any) => s.id === e.target.value);
      setMissingMember((missingMember) => ({
        ...missingMember,
        reason: v.name,
      }));
    }
  };

  const saveMissing = (cmd: string, reason_id?: any) => {
    let newMissingMember;
    if (cmd === "add") {
      newMissingMember = household.missing_deceased_members ?? [];
      newMissingMember.push(missingMember);
    } else {
      newMissingMember = household.missing_deceased_members ?? [];
      const index = newMissingMember.findIndex(
        (obj: any) => obj.reason_id === reason_id
      );
      newMissingMember.splice(index, 1);
    }
    handleArrayChangeInHousehold("missing_deceased_members", newMissingMember);
    setMissingMember({ ...initialMissingMember });
  };


  const handleVehicleChange = (e: any) => {
    setVehicle((vehicle) => ({
      ...vehicle,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name === "member_name" && members && members.length) {
      let v = members.find((s: any) => s.first_name === e.target.value);
      if (v) {
        setVehicle((vehicle) => ({
          ...vehicle,
          member_name: v.first_name,
        }));
      }
    }
    if (e.target.name === "vehicle_type_id") {
      let v = vehicle_types.find((s: any) => s.id === e.target.value);
      if (v) {
        setVehicle((vehicle) => ({
          ...vehicle,
          vehicle_type: v.name,
          vehicle_type_name: v.name,
        }));
      }
    }
  };
  
  
  const saveVehicle = (cmd: string, index?: any) => {
    
    let newVehicles;
    if (cmd === "add") {
      if (vehicle.member_name === "" || vehicle.vehicle_type_id === "" || vehicle.count ==="") {
        alert("सदस्य, सवारीको किसिम र संख्या छान्नुहोस।");
        return;
      }
      newVehicles = [...(household.vehicles ?? [])];
      newVehicles.push({...vehicle});
    } else if (cmd === "edit") {
      if (vehicle.member_name === "" || vehicle.vehicle_type_id === "" || vehicle.count ==="") {
        alert("à¤¸à¤µà¤¾à¤°à¥€à¤•à¥‹ à¤•à¤¿à¤¸à¤¿à¤® à¤° à¤¸à¤‚à¤–à¥à¤¯à¤¾ à¤›à¤¾à¤¨à¥à¤¨à¥à¤¹à¥‹à¤¸à¥¤");
        return;
      }
      newVehicles = [...(household.vehicles ?? [])];
      newVehicles[index] = {...vehicle};
      setEditingVehicleId(null);
    } else {
      newVehicles = [...(household.vehicles ?? [])];
      newVehicles.splice(index, 1);
    }
    handleArrayChangeInHousehold("vehicles", newVehicles);
    setVehicle({ ...initialVehicle });
  };

  const editVehicle = (index: number) => {
    const vehicleToEdit = household.vehicles?.[index];
    if (vehicleToEdit) {
      // Find the vehicle_type_id from vehicle_type_name
      let vehicleTypeId = vehicleToEdit.vehicle_type_id;
      if (!vehicleTypeId && vehicleToEdit.vehicle_type_name) {
        const foundType = vehicle_types.find((v: any) => v.name === vehicleToEdit.vehicle_type_name);
        vehicleTypeId = foundType?.id || "";
      }
      setVehicle({
        ...vehicleToEdit,
        vehicle_type_id: vehicleTypeId
      });
    } else {
      setVehicle(initialVehicle);
    }
    setEditingVehicleId(index);
  };

  const cancelEditVehicle = () => {
    setVehicle({ ...initialVehicle });
    setEditingVehicleId(null);
  };

  const getVehicleDisplayName = (vehicleItem: any) => {
    if (vehicleItem.vehicle_type_name || vehicleItem.vehicle_type) {
      return vehicleItem.vehicle_type_name || vehicleItem.vehicle_type;
    }

    const foundType = vehicle_types.find((v: any) => `${v.id}` === `${vehicleItem.vehicle_type_id}`);
    return foundType?.name || "";
  };

  const getHouseDisplayName = (houseItem: any) => {
    if (houseItem.house_type) {
      return houseItem.house_type;
    }

    const foundType = house_types.find((h: any) => `${h.id}` === `${houseItem.house_type_id}`);
    return foundType?.name || "";
  };

  const getLandDisplayName = (landItem: any) => {
    if (landItem.land_type) {
      return landItem.land_type;
    }

    const foundType = land_types.find((l: any) => `${l.id}` === `${landItem.land_type_id}`);
    return foundType?.name || "";
  };

  const getBusinessDisplayName = (businessItem: any) => {
    if (businessItem.business_type) {
      return businessItem.business_type;
    }

    const foundType = businessTypes.find(
      (b: any) => `${b.id}` === `${businessItem.business_type_id}`
    );
    return foundType?.name || "";
  };

  const getDisabilityTypeDisplayName = (disabilityItem: any) => {
    const foundType = disability_types.find(
      (d: any) =>
        `${d.id}` === `${disabilityItem.disability_type}` ||
        `${d.id}` === `${disabilityItem.disability_type_id}` ||
        d.name === disabilityItem.disability_type
    );

    return foundType?.name || disabilityItem.disability_type || "";
  };

  const getDisabilityCardDisplayName = (disabilityItem: any) => {
    const foundCard = disability_card_types.find(
      (d: any) =>
        `${d.id}` === `${disabilityItem.disability_card}` ||
        `${d.id}` === `${disabilityItem.card_type_id}` ||
        d.name === disabilityItem.disability_card
    );

    return foundCard?.name || disabilityItem.disability_card || "";
  };

  const getForeignReasonDisplayName = (foreignMemberItem: any) => {
    const foundReason = foreign_reasons.find(
      (reason: any) =>
        `${reason.id}` === `${foreignMemberItem.reason_id}` ||
        reason.name === foreignMemberItem.reason
    );

    return foundReason?.name || foreignMemberItem.reason || "";
  };

  const archivedMembers = (household.members ?? [])
    .map((member: any, index: number) => ({ ...member, __memberIndex: index }))
    .filter(
      (member: any) => `${member?.status ?? ""}` === "2"
    );

  const activeMemberOptions = (household.members ?? []).filter(
    (member: any) => `${member?.status ?? ""}` !== "2"
  );

  const handleInactiveMemberChange = (e: any) => {
    setInactiveMember((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const saveInactiveMember = (cmd: string, memberIndex?: number) => {
    const newMembers = [...(household.members ?? [])];

    if (cmd === "edit" && memberIndex !== undefined) {
      newMembers[memberIndex] = {
        ...newMembers[memberIndex],
        status: inactiveMember.status || "1",
        remove_reason: inactiveMember.remove_reason || "",
        remarks: inactiveMember.remarks || "",
      };
      setEditingInactiveMemberId(null);
    } else if (cmd === "remove" && memberIndex !== undefined) {
      newMembers[memberIndex] = {
        ...newMembers[memberIndex],
        status: "0",
        remove_reason: "",
        remarks: "",
      };
    }

    handleArrayChangeInHousehold("members", newMembers);
    setHousehold((prev) => ({
      ...prev,
      members: newMembers,
    }));
    setInactiveMember({ ...initialInactiveMember });
  };

  const editInactiveMember = (memberIndex: number) => {
    const memberToEdit = household.members?.[memberIndex];
    if (!memberToEdit) {
      return;
    }

    setInactiveMember({
      member_index: `${memberIndex}`,
      status: `${memberToEdit.status ?? "1"}`,
      remove_reason: `${memberToEdit.remove_reason ?? ""}`,
      remarks: `${memberToEdit.remarks ?? ""}`,
    });
    setEditingInactiveMemberId(memberIndex);
  };

  const cancelEditInactiveMember = () => {
    setInactiveMember({ ...initialInactiveMember });
    setEditingInactiveMemberId(null);
  };

  // const handleAnimalChange = (e: any) => {
  //   setAnimal((animal) => ({
  //     ...animal,
  //     [e.target.name]: e.target.value,
  //   }));
  //   if (e.target.name === "animal_type_id") {
  //     let v = animal_types.find((s: any) => s.id === e.target.value);
  //     setAnimal((animal) => ({
  //       ...animal,
  //       animal: v.name,
  //     }));
  //   }
  // };

  const saveAnimal = (cmd: string, animal_type_id?: any) => {
    let newAnimal;
    if (cmd === "add") {
      newAnimal = household.animals ?? [];
      newAnimal.push(animal);
    } else {
      newAnimal = household.animals ?? [];
      const index = newAnimal.findIndex(
        (obj: any) => obj.animal_type_id === animal_type_id
      );
      newAnimal.splice(index, 1);
    }
    handleArrayChangeInHousehold("animals", newAnimal);
    setAnimal({ ...initialAnimal });
  };

    const handleHouseChange = (e: any) => {
    setHouse((house) => ({
      ...house,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name === "house_type_id") {
      let v = house_types.find((s: any) => s.id === e.target.value);
      if (v) {
        setHouse((house) => ({
          ...house,
          house_type: v.name,
        }));
      }
    }
  };

  const handleDisasterChange = (e: any) => {
    setDisaster((disaster) => ({
      ...disaster,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name === "disaster_type_id") {
      let v = disaster_types.find((s: any) => s.id === e.target.value);
      setDisaster((disaster) => ({
        ...disaster,
        disaster_type: v.name,
      }));
    }
  };


  const handleLandChange = (e: any) => {
    setLand((land) => ({
      ...land,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name === "land_type_id") {
      let v = land_types.find((s: any) => `${s.id}` === `${e.target.value}`);
      if (v) {
        setLand((land) => ({
          ...land,
          land_type: v.name,
        }));
      }
    }
  };

  const handleBusinessChange = (e: any) => {
    const { name, value } = e.target;
    setBusiness((prevBusiness) => {
      const nextBusiness: any = {
        ...prevBusiness,
        [name]: value,
      };

      if (name === "member_name") {
        const selectedMember = (activeMemberOptions ?? []).find(
          (member: any) =>
            member.first_name === value ||
            `${member.first_name ?? ""} ${member.last_name ?? ""}`.trim() === value
        );
        if (selectedMember) {
          nextBusiness.member_name = selectedMember.first_name;
          nextBusiness.member_id = `${selectedMember.id ?? selectedMember.member_id ?? ""}`;
        }
      }

      if (name === "business_type_id") {
        const foundType = businessTypes.find((option: any) => `${option.id}` === `${value}`);
        if (foundType) {
          nextBusiness.business_type = foundType.name;
        }
      }

      return nextBusiness;
    });
  };

    const saveHouse = (cmd: string, index?: any) => {
    let newHouse = [...(household.houses ?? [])];
    if (cmd === "add") {
      if (house.house_type_id === "" || house.house_qty === "" || house.location === "" ) {
        alert("घरको स्थान, प्रकार र संख्या छान्नुहोस्।");
        return;
      }
      newHouse.push({ ...house });     
    } else if (cmd === "edit") {
      if (house.house_type_id === "" || house.house_qty === "" || house.location === "" ) {
        alert("à¤˜à¤°à¤•à¥‹ à¤¸à¥à¤¥à¤¾à¤¨, à¤ªà¥à¤°à¤•à¤¾à¤° à¤° à¤¸à¤‚à¤–à¥à¤¯à¤¾ à¤›à¤¾à¤¨à¥à¤¨à¥à¤¹à¥‹à¤¸à¥à¥¤");
        return;
      }
      newHouse[index] = { ...house };
      setEditingHouseId(null);
    } else {
      newHouse.splice(index, 1);
    }
    handleArrayChangeInHousehold("houses", newHouse);
    setHouse({ ...initialHouse });
  };

  const saveDisaster = (cmd: string, index?: any) => {
    let newDisaster;
    newDisaster = household.disasters ?? [];
    if (cmd === "add") {
      if (disaster.disaster_type === "" || disaster.disaster_location === "" || disaster.disaster_priority === "" ) {
        alert("जोखिमको प्रकार, पर्ने स्थान र प्राथमिकता इकाई छान्नुहोस्।");
        return;
      }
      newDisaster.push(disaster);
    } else {
      newDisaster.splice(index, 1);
    }
    handleArrayChangeInHousehold("disasters", newDisaster);
    setDisaster({ ...initialDisaster});
  };

  const editHouse = (index: number) => {
    const houseToEdit = household.houses?.[index];
    if (houseToEdit) {
      let houseTypeId = houseToEdit.house_type_id;
      if (!houseTypeId && houseToEdit.house_type) {
        const foundType = house_types.find((h: any) => h.name === houseToEdit.house_type);
        houseTypeId = foundType?.id || "";
      }
      setHouse({
        ...houseToEdit,
        house_type_id: houseTypeId,
      });
    } else {
      setHouse(initialHouse);
    }
    setEditingHouseId(index);
  };

  const cancelEditHouse = () => {
    setHouse({ ...initialHouse });
    setEditingHouseId(null);
  };



  const saveLand = (cmd: string, index?: any) => {
    let newLand = [...(household.lands ?? [])];
    if (cmd === "add") {
      if (land.location === "" || land.land_type_id === "" || land.total_area === "" || land.area_unit === "" ) {
        alert("जग्गाको स्थान, प्रकार, क्षेत्रफल र इकाई छान्नुहोस्।");
        return;
      }
      newLand.push({ ...land });
    } else if (cmd === "edit") {
      if (land.location === "" || land.land_type_id === "" || land.total_area === "" || land.area_unit === "" ) {
        alert("à¤œà¤—à¥à¤—à¤¾à¤•à¥‹ à¤¸à¥à¤¥à¤¾à¤¨, à¤ªà¥à¤°à¤•à¤¾à¤°, à¤•à¥à¤·à¥‡à¤¤à¥à¤°à¤«à¤² à¤° à¤‡à¤•à¤¾à¤ˆ à¤›à¤¾à¤¨à¥à¤¨à¥à¤¹à¥‹à¤¸à¥à¥¤");
        return;
      }
      newLand[index] = { ...land };
      setEditingLandId(null);
    } else {
      newLand.splice(index, 1);
    }
    handleArrayChangeInHousehold("lands", newLand);
    setLand({ ...initialLand });
  };

  const saveBusiness = (cmd: string, index?: any) => {
    const newBusinesses = [...(household.businesses ?? [])];
    if (cmd === "add") {
      if (
        business.member_name === "" ||
        (business.business_type_id === "" && business.business_type === "") ||
        business.business_place === "" ||
        business.type === ""
      ) {
        alert("सदस्य, व्यवसायको प्रकार, स्थान र प्रकार छान्नुहोस्।");
        return;
      }
      newBusinesses.push({ ...business });
    } else if (cmd === "edit") {
      if (
        business.member_name === "" ||
        (business.business_type_id === "" && business.business_type === "") ||
        business.business_place === "" ||
        business.type === ""
      ) {
        alert("सदस्य, व्यवसायको प्रकार, स्थान र प्रकार छान्नुहोस्।");
        return;
      }
      newBusinesses[index] = { ...business };
      setEditingBusinessId(null);
    } else {
      newBusinesses.splice(index, 1);
    }
    handleArrayChangeInHousehold("businesses", newBusinesses);
    setBusiness({ ...initialBusiness });
  };

  const editLand = (index: number) => {
    const landToEdit = household.lands?.[index];
    if (landToEdit) {
      let landTypeId = landToEdit.land_type_id;
      if (!landTypeId && landToEdit.land_type) {
        const foundType = land_types.find((l: any) => l.name === landToEdit.land_type);
        landTypeId = foundType?.id || "";
      }
      setLand({
        ...landToEdit,
        land_type_id: landTypeId,
      });
    } else {
      setLand(initialLand);
    }
    setEditingLandId(index);
  };

  const cancelEditLand = () => {
    setLand({ ...initialLand });
    setEditingLandId(null);
  };

  const editBusiness = (index: number) => {
    const businessToEdit = household.businesses?.[index];
    if (!businessToEdit) {
      setBusiness({ ...initialBusiness });
      setEditingBusinessId(null);
      return;
    }

    let businessTypeId = businessToEdit.business_type_id;
    if (!businessTypeId && businessToEdit.business_type) {
      const foundType = businessTypes.find(
        (option: any) => option.name === businessToEdit.business_type
      );
      businessTypeId = foundType?.id || "";
    }

    setBusiness({
      ...businessToEdit,
      business_type_id: businessTypeId,
    });
    setEditingBusinessId(index);
  };

  const cancelEditBusiness = () => {
    setBusiness({ ...initialBusiness });
    setEditingBusinessId(null);
  };

  // const handleIEChange = (e: any) => {
  //   setIncomeExpense((income_expense) => ({
  //     ...income_expense,
  //     [e.target.name]: e.target.value,
  //   }));
  //   if (e.target.name === "income_source_id") {
  //     let v = income_sources.find((s: any) => s.id === e.target.value);
  //     setIncomeExpense((income_expense) => ({
  //       ...income_expense,
  //       source: v.name,
  //       source_id: v.id,
  //       type: "1",
  //     }));
  //   }
  //   if (e.target.name === "expense_source_id") {
  //     let v = expense_sources.find((s: any) => s.id === e.target.value);
  //     setIncomeExpense((income_expense) => ({
  //       ...income_expense,
  //       source: v.name,
  //       source_id: v.id,
  //       type: "2",
  //     }));
  //   }
  // };

  // const saveIE = (cmd: string, index?: any) => {
  //   let newIE;
  //   let d;
         
  //     newIE = household.income_expenses ?? [];
      

  //   if (cmd === "add") {
  //     if (income_expense.source_id === "" &&  (income_expense.income_amount === "" || income_expense.expense_amount === "") ) {
  //       alert("Add source and amount");
    
  //       return;
  //     }
  //     // income_expense.total_income_amount += parseInt(income_expense.income_amount);
  //     household.hoh_income_amount += parseInt(income_expense.income_amount);
      
  //     newIE.push(income_expense);
  //   } else {
  //     household.hoh_income_amount -=parseInt(newIE[index].income_amount);
  //     // income_expense.total_income_amount -= parseInt(newIE[index].income_amount);
  //     newIE.splice(index, 1);
  //     console.log(newIE)
      
  //   }
    
    
  //   handleArrayChangeInHousehold("income_expenses", newIE);
  //   setIncomeExpense({ ...initialIncomeExpense, total_income_amount:(income_expense.total_income_amount)});
  //      setHousehold({...household,hoh_income_amount:household.hoh_income_amount})
  //   // console.log(income_expense.total_income_amount)
  //   console.log(household.hoh_income_amount)
  // };

  const getHohPhoto = async () => {
    if (
      "mediaDevices" in navigator &&
      "getUserMedia" in navigator.mediaDevices
    ) {
      let video = document.querySelector(
        "#responder_image_video"
      ) as HTMLVideoElement;
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: "environment",
          },
        })
        .then((stream) => (video.srcObject = stream))
        .catch(console.error);

      let click_photo = document.querySelector(
        "#responder_image_click-photo"
      ) as HTMLButtonElement;

      video.style.display = "block";
      click_photo.style.display = "block";
      let existingImage = document.getElementById("imageDisplay");
      if (existingImage) {
        existingImage.style.display = "none";
      }
    }
  };

  const clickPhoto = async () => {
    let video = document.querySelector(
      "#responder_image_video"
    ) as HTMLVideoElement;
    let canvas = document.querySelector(
      "#responder_image_canvas"
    ) as HTMLCanvasElement;
    canvas!.getContext("2d").drawImage(video, 0, 0, video.width, video.height);
    let image_data_url = canvas.toDataURL("image/jpeg");
    video.style.display = "none";
    canvas.style.display = "block";
    let click_photo = document.querySelector(
      "#responder_image_click-photo"
    ) as HTMLButtonElement;
    let reset = document.querySelector(
      "#responder_imagereset-photo"
    ) as HTMLButtonElement;
    click_photo.style.display = "none";
    reset.style.display = "block";
    let existingImage = document.getElementById("imageDisplay");
    if (existingImage) {
      existingImage.style.display = "none";
    }
    handleArrayChangeInHousehold("responder_image", image_data_url);
  };

  const resetPhoto = async () => {
    let canvas = document.querySelector(
      "#responder_image_canvas"
    ) as HTMLCanvasElement;
    let reset = document.querySelector(
      "#responder_imagereset-photo"
    ) as HTMLButtonElement;
    reset.style.display = "none";
    canvas.style.display = "none";
    let existingImage = document.getElementById("imageDisplay");
    if (existingImage) {
      existingImage.style.display = "none";
    }
    getHohPhoto();
  };

  return (
    <>
      <div className={`form-group`} id="16">
        <h5> C. पारिवारिक विवरण </h5>

        <label className="label" id={"inactive_members"}>
          C1. निस्क्रिय सदस्यहरु
        </label>
        <div className="child-section">
          <div className="card mb-3">
            <div className="card-header bg-secondary text-white">
              <h6 className="mb-0">निस्क्रिय सदस्य अभिलेख</h6>
            </div>
            <div className="card-body" style={{ padding: "10px" }}>
              {archivedMembers.length > 0 ? (
                archivedMembers.map((member: any, memberKey: number) => (
                  <div
                    key={`inactive-member-${member.id ?? memberKey}`}
                    className="d-flex justify-content-between align-items-center mb-2 p-2"
                    style={{
                      backgroundColor:
                        editingInactiveMemberId === member.__memberIndex ? "#fff3cd" : "#f8f9fa",
                      borderLeft: "4px solid #6c757d",
                    }}
                  >
                    <div className="flex-grow-1">
                      <strong>{`${member.first_name ?? ""} ${member.last_name ?? ""}`.trim() || "-"}</strong>
                      <br />
                      <small className="text-muted">
                        कारण: {member.remove_reason || "-"} | अवस्था: {member.status || "-"}
                        {member.remarks ? ` | कैफियत: ${member.remarks}` : ""}
                      </small>
                    </div>
                    <div>
                      <button
                        onClick={() => editInactiveMember(member.__memberIndex)}
                        className="btn btn-warning btn-sm mr-2"
                        title="Edit"
                        style={{ padding: "4px 8px", fontSize: "14px", display: "inline-flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => saveInactiveMember("remove", member.__memberIndex)}
                        className="btn btn-danger btn-sm"
                        title="Delete"
                        style={{ padding: "4px 8px", fontSize: "14px", display: "inline-flex", alignItems: "center", justifyContent: "center", lineHeight: 1, gap: "4px" }}
                      >
                        ✕
                        <span className="hh-action-label hh-action-label--full">सदस्य हटाउनुहोस्</span>
                        <span className="hh-action-label hh-action-label--compact">हटाउनुहोस्</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-muted">निस्क्रिय सदस्य अभिलेख उपलब्ध छैन।</div>
              )}
            </div>
          </div>

          {editingInactiveMemberId !== null && (
            <div className="card border-warning">
              <div className="card-header bg-warning">
                <h6 className="mb-0">निस्क्रिय सदस्य सम्पादन गर्नुहोस्</h6>
              </div>
              <div className="card-body">
                <label className="label">अवस्था</label>
                <input
                  type="number"
                  className="form-control"
                  name="status"
                  value={inactiveMember.status ?? ""}
                  onChange={handleInactiveMemberChange}
                />

                <label className="label mt-3">कारण</label>
                <input
                  type="text"
                  className="form-control"
                  name="remove_reason"
                  value={inactiveMember.remove_reason ?? ""}
                  onChange={handleInactiveMemberChange}
                />

                <label className="label mt-3">कैफियत</label>
                <input
                  type="text"
                  className="form-control"
                  name="remarks"
                  value={inactiveMember.remarks ?? ""}
                  onChange={handleInactiveMemberChange}
                />

                <div className="options-horizontal mt-3">
                  <button
                    onClick={() => saveInactiveMember("edit", editingInactiveMemberId)}
                    className="btn btn-warning btn-sm"
                  >
                    अपडेट गर्नुहोस्
                  </button>
                  <button
                    onClick={cancelEditInactiveMember}
                    className="btn btn-secondary btn-sm ml-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <label className="label" id={"has_foreign_member"}>
          C2. परिवारमा कोई बिदेशमा बसेको वा गएको छ?
        </label>
        <div className="options-horizontal">
          <select
            className="form-control"
            name="has_foreign_member"
            key={"परिवारमा कोई बिदेशमा बसेको वा गएको छ?"}
            value={household.has_foreign_member}
            onChange={(e) => handleChange(e)}
          >
            <option value={"0"}>छैन</option>
            <option value={"1"}>छ</option>
          </select>
        </div>

        {household.has_foreign_member === "1" && (
          <div className="child-section">
            {/* Display list of foreign members */}
            {household.foreign_members && household.foreign_members.length > 0 && (
              <div className="card mb-3">
                <div className="card-header bg-primary text-white">
                  <h6 className="mb-0">सदस्यहरु</h6>
                </div>
                <div className="card-body" style={{ padding: "10px" }}>
                  {household.foreign_members.map((ts: any, ts_key: any) => (
                    <div 
                      key={ts_key} 
                      className="d-flex justify-content-between align-items-center mb-2 p-2"
                      style={{ backgroundColor: editingForeignMemberId === ts_key ? "#e7f3ff" : "#f8f9fa", borderLeft: "4px solid #007bff" }}
                    >
                      <div className="flex-grow-1">
                        <strong>{ts.member_name}</strong> - {ts.country}
                        <br/>
                        <small className="text-muted">
                          कारण: {getForeignReasonDisplayName(ts) || "-"} | बिताएका वर्ष: {ts.total_abroad_age || "-"}
                        </small>
                      </div>
                      <div>
                        <button
                          onClick={() => editForeignMember(ts_key)}
                          className="btn btn-warning btn-sm mr-2"
                          title="Edit"
                          style={{ padding: "4px 8px", fontSize: "14px", display: "inline-flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => saveForeignMember("remove", ts_key)}
                          className="btn btn-danger btn-sm"
                          title="Delete"
                          style={{ padding: "4px 8px", fontSize: "14px", display: "inline-flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={`card ${editingForeignMemberId !== null ? "border-warning" : ""}`}>
              <div className={`card-header ${editingForeignMemberId !== null ? "bg-warning" : "bg-light"}`}>
                <h6 className="mb-0">{editingForeignMemberId !== null ? "सदस्य सम्पादन गर्नुहोस्" : "नयाँ सदस्य थप्नुहोस्"}</h6>
              </div>
              <div className="card-body">
                <div className="options-horizontal">
                  <select
                    className="form-control"
                    value={foreignMember.member_name ?? ""}
                    name="member_name"
                    onChange={handleForeignMemberChange}
                  >
                    <option value={""} key={"परिवारमा कोई बिदेशमा-1"}>
                      ---- सदस्य -----
                    </option>
                    {activeMemberOptions.map((option: any, key: any) => (
                        <option value={option.first_name} key={"option.name" + key}>
                          {option.first_name} {option.last_name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="options-horizontal">
                  <select
                    className="form-control"
                    value={foreignMember.country_samuha_id ?? ""}
                    name="country_samuha_id"
                    onChange={handleForeignMemberChange}
                  >
                    <option value={""} key={"देश समुह-1"}>
                      ---- देश समुह-----
                    </option>
                    {country_samuhas.map((option: any, key: any) => (
                      <option value={option.id} key={"death_reasons" + key}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-control"
                    value={foreignMember.country_id ?? ""}
                    name="country_id"
                    onChange={handleForeignMemberChange}
                  >
                    <option value={""} key={"देश-1"}>
                      ---- देश -----
                    </option>
                    {filter_countries.map((option: any, key: any) => (
                      <option value={option.id} key={"death_reasons" + key}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-control"
                    value={foreignMember.reason_id ?? ""}
                    name="reason_id"
                    onChange={handleForeignMemberChange}
                  >
                    <option value={""} key={"कारन-1"}>
                      ---- कारन -----
                    </option>
                    {foreign_reasons.map((option, key) => (
                      <option value={option.id} key={"death_reasons" + key}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="options-horizontal">
                  <div style={{ flex: 1 }}>
                    <label className="form-label">हाल विदेशमा नै हो?</label>
                    <select
                      className="form-control"
                      name="in_abroad"
                      value={foreignMember.in_abroad ?? "1"}
                      onChange={handleForeignMemberChange}
                    >
                      <option value={"1"}>हो</option>
                      <option value={"0"}>होईन</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="form-label">विदेशमा बिताएको बर्ष</label>
                    <input
                      type="number"
                      className="form-control"
                      value={foreignMember.total_abroad_age}
                      name="total_abroad_age"
                      onChange={handleForeignMemberChange}
                      placeholder="विदेशमा बिताएको बर्ष"
                    />
                  </div>
                </div>

                <div className="options-horizontal mt-3">
                  <button
                    onClick={() => 
                      editingForeignMemberId !== null 
                        ? saveForeignMember("edit", editingForeignMemberId)
                        : saveForeignMember("add")
                    }
                    className={`btn btn-sm ${editingForeignMemberId !== null ? "btn-warning" : "btn-success"}`}
                  >
                    {editingForeignMemberId !== null ? "अपडेट गर्नुहोस्" : "थप"}
                  </button>
                  {editingForeignMemberId !== null && (
                    <button
                      onClick={cancelEditForeignMember}
                      className="btn btn-secondary btn-sm ml-2"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        <label className="label" id={"has_vehicle-"}>
                C3. सवारी साधन ?{" "}
              </label>
              <div className="options-vertical">
                <select
                  className="form-control"
                  name="has_vehicle"
                  key={"सवारी साधन ?" }
                  value={household.has_vehicle ?? "0"}
                  onChange={(e) =>
                    handleChange(e)
                  }
                >
                  <option value={"0"}>छैन</option>
                  <option value={"1"}>छ</option>
                </select>
              </div>

              {household.has_vehicle === "1" && (
                <div className="child-section">
                  {household.vehicles && household.vehicles.length > 0 && (
                    <div className="card mb-3">
                      <div className="card-header bg-success text-white">
                        <h6 className="mb-0">सवारी साधनहरू</h6>
                      </div>
                      <div className="card-body" style={{ padding: "10px" }}>
                        {household.vehicles.map((v: any, ts_key: any) => (
                          <div
                            key={"vehicles" + ts_key}
                            className="d-flex justify-content-between align-items-center mb-2 p-2"
                            style={{ backgroundColor: editingVehicleId === ts_key ? "#e8fff0" : "#f8f9fa", borderLeft: "4px solid #28a745" }}
                          >
                            <div className="flex-grow-1">
                              <strong>{v.member_name || "-"}</strong> - {getVehicleDisplayName(v) || "-"} - {v.count}
                            </div>
                            <div>
                              <button
                                onClick={() => editVehicle(ts_key)}
                                className="btn btn-warning btn-sm mr-2"
                                title="Edit"
                                style={{ padding: "4px 8px", fontSize: "14px" }}
                              >
                                ✎
                              </button>
                              <button
                                onClick={() => saveVehicle("remove", ts_key)}
                                className="btn btn-danger btn-sm"
                                title="Delete"
                                style={{ padding: "4px 8px", fontSize: "14px" }}
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className={`card ${editingVehicleId !== null ? "border-warning" : ""}`}>
                    <div className={`card-header ${editingVehicleId !== null ? "bg-warning" : "bg-light"}`}>
                      <h6 className="mb-0">{editingVehicleId !== null ? "सवारी साधन सम्पादन गर्नुहोस्" : "नयाँ सवारी साधन थप्नुहोस्"}</h6>
                    </div>
                    <div className="card-body">
                      <label className="label" id={"member_name-"}>
                        a. सदस्य{" "}
                      </label>
                      <div className="options-horizontal">
                        <select
                          className="form-control"
                          value={vehicle.member_name ?? ""}
                          name="member_name"
                          onChange={handleVehicleChange}
                        >
                          <option value={""} key={"सवारी साधन सदस्य"}>
                            ---- सदस्य -----
                          </option>
                          {activeMemberOptions.map((option: any, key: any) => (
                              <option value={option.first_name} key={"option.name" + key}>
                                {option.first_name} {option.last_name}
                              </option>
                            ))}
                        </select>
                      </div>
                      <label className="label" id={"vehicle_type_id-"}>
                        b. सवारी साधनको नामः{" "}
                      </label>
                      <div className="options-vertical">
                        <select
                          className="form-control"
                          key={"28.1 सवारी साधनको नामः" }
                          name="vehicle_type_id"
                          value={vehicle.vehicle_type_id ?? ""}
                          onChange={handleVehicleChange}
                        >
                          <option
                            value={""}
                            key={"29.0 सिप सवारी साधनको नामः"}
                          >
                            ------ सवारी साधनको नाम ------
                          </option>
                          {vehicle_types.map((ms: any, keyv: any) => (
                            <option
                              value={ms.id}
                              key={"28.1 सवारी साधनको नाम नामःoption" + keyv}
                            >
                              {ms.name}
                            </option>
                          ))}
                        </select>
                        <label className="label" id={"count-" }>
                          c. कति?{" "}
                        </label>
                        <div className="options-vertical">
                          <input
                            type="number"
                            className="form-control"
                            name="count"
                            key={"b.  कति?"}
                            onChange={handleVehicleChange}
                            placeholder=""
                            value={vehicle.count}
                          />
                        </div>
                        <div className="options-horizontal mt-3">
                          <button
                            onClick={() =>
                              editingVehicleId !== null
                                ? saveVehicle("edit", editingVehicleId)
                                : saveVehicle("add")
                            }
                            className={`btn btn-sm ${editingVehicleId !== null ? "btn-warning" : "btn-success"}`}
                          >
                            {editingVehicleId !== null ? "अपडेट गर्नुहोस्" : "थप"}
                          </button>
                          {editingVehicleId !== null && (
                            <button
                              onClick={cancelEditVehicle}
                              className="btn btn-secondary btn-sm ml-2"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
  {/* <div  
              className={`form-group member-form-four`}
              id={"health5"}
              key={"member-health-2-"}
            > */}   


              <label className="label" id={"has_technical_training-" }>
                C4. प्राविधिक सिप छ?{" "}
              </label>
              <div className="options-vertical">
                <select
                  className="form-control"
                  name="has_technical_training"
                  key={"प्राविधिक सिप छ?"}
                  value={effectiveHasTechnicalTraining ? "1" : "0"}
                  onChange={(e) =>handleChange(e)                  }
                >
                  <option value={"0"}>छैन</option>
                  <option value={"1"}>छ</option>
                </select>
              </div>

              {effectiveHasTechnicalTraining && (
                <div className="child-section">
                  {/* Display list of technical skills */}
                  {household.technical_skills_members && household.technical_skills_members.length > 0 && (
                    <div className="card mb-3">
                      <div className="card-header bg-info text-white">
                        <h6 className="mb-0">सदस्यहरु र तिनीहरुको सिपहरु</h6>
                      </div>
                      <div className="card-body" style={{ padding: "10px" }}>
                        {household.technical_skills_members.map((ts: any, ts_key: any) => (
                          <div 
                            key={ts_key} 
                            className="d-flex justify-content-between align-items-center mb-2 p-2"
                            style={{ backgroundColor: editingTechSkillId === ts_key ? "#e7f7ff" : "#f8f9fa", borderLeft: "4px solid #17a2b8" }}
                          >
                            <div className="flex-grow-1">
                              <strong>{ts.member_name}</strong> - {ts.skill_name}
                              <br/>
                              <small className="text-muted">{`${ts.source}` === "0" ? "स्वज्ञान" : "तालिम"}</small>
                            </div>
                            <div>
                              <button
                                onClick={() => editTechSkill(ts_key)}
                                className="btn btn-warning btn-sm mr-2"
                                title="Edit"
                                style={{ padding: "4px 8px", fontSize: "14px" }}
                              >
                                ✎
                              </button>
                              <button
                                onClick={() => saveTechSkill("remove", ts_key)}
                                className="btn btn-danger btn-sm"
                                title="Delete"
                                style={{ padding: "4px 8px", fontSize: "14px" }}
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={`card ${editingTechSkillId !== null ? "border-warning" : ""}`}>
                    <div className={`card-header ${editingTechSkillId !== null ? "bg-warning" : "bg-light"}`}>
                      <h6 className="mb-0">{editingTechSkillId !== null ? "सिप सम्पादन गर्नुहोस्" : "नयाँ सिप थप्नुहोस्"}</h6>
                    </div>
                    <div className="card-body">
                      <div className="options-horizontal">
                        <select
                          className="form-control"
                          value={techSkillMember.member_name ?? ""}
                          name="member_name"
                          onChange={handleTechSkillChange}
                        >
                          <option value={""} key={"प्राविधिक सिप सदस्य"}>
                            ---- सदस्य -----
                          </option>
                          {activeMemberOptions.map((option: any, key: any) => (
                              <option value={option.first_name} key={"option.name" + key}>
                                {option.first_name} {option.last_name}
                              </option>
                            ))}
                        </select>
                      </div>

                      <label className="label">a. सिपको नाम</label>
                      <div className="options-vertical">
                        <select
                          className="form-control"
                          name="skill_id"
                          value={techSkillMember.skill_id ?? ""}
                          onChange={handleTechSkillChange}
                        >
                          <option value={""}>----------</option>
                          {technical_skills.map((dt: any, keydt: any) => (
                            <option value={dt.id} key={keydt + "नामः skills_name"}>
                              {dt.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <label className="label">b. सिप हासिल</label>
                      <div className="options-vertical">
                        <select
                          className="form-control"
                          name="source"
                          value={techSkillMember.source ?? ""}
                          onChange={handleTechSkillChange}
                        >
                          <option value={""}>------ सिप हासिल ------</option>
                          <option value={"0"}>स्वज्ञान</option>
                          <option value={"1"}>तालिम</option>
                        </select>
                      </div>
                      
                      {techSkillMember.source === "1" && (
                        <>
                          <label className="label">c. तालिमको अविधि (महिनामा)</label>
                          <input
                            type="number"
                            className="form-control"
                            name="duration"
                            value={techSkillMember.duration ?? ""}
                            onChange={handleTechSkillChange}
                            placeholder="Ex: 3"
                          />
                        </>
                      )}

                      <div className="options-horizontal mt-3">
                        <button
                          onClick={() => 
                            editingTechSkillId !== null 
                              ? saveTechSkill("edit", editingTechSkillId)
                              : saveTechSkill("add")
                          }
                          className={`btn btn-sm ${editingTechSkillId !== null ? "btn-warning" : "btn-success"}`}
                        >
                          {editingTechSkillId !== null ? "अपडेट गर्नुहोस्" : "थप"}
                        </button>
                        {editingTechSkillId !== null && (
                          <button
                            onClick={cancelEditTechSkill}
                            className="btn btn-secondary btn-sm ml-2"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}


<label className="label" id={"has_chronic_disease-" }>
                C5. दिर्घरोग छ?{" "}
              </label>
              <div className="options-vertical">
                <select
                  className="form-control"
                  name="has_chronic_disease"
                  key={"रोग छ?"}
                  value={household.has_chronic_disease ?? "0"}
                  onChange={(e) =>handleChange(e)                  }
                >
                  <option value={"0"}>छैन</option>
                  <option value={"1"}>छ</option>
                </select>
              </div>

              {household.has_chronic_disease === "1" && (
                <div className="child-section">
                  {/* Display list of chronic disease members */}
                  {household.chronic_disease_members && household.chronic_disease_members.length > 0 && (
                    <div className="card mb-3">
                      <div className="card-header bg-danger text-white">
                        <h6 className="mb-0">रोगी सदस्यहरु</h6>
                      </div>
                      <div className="card-body" style={{ padding: "10px" }}>
                        {household.chronic_disease_members.map((ts: any, ts_key: any) => (
                          <div 
                            key={ts_key} 
                            className="d-flex justify-content-between align-items-center mb-2 p-2"
                            style={{ backgroundColor: editingChronicDiseaseId === ts_key ? "#ffe7e7" : "#f8f9fa", borderLeft: "4px solid #dc3545" }}
                          >
                            <div className="flex-grow-1">
                              <strong>{ts.member_name}</strong> - {ts.disease_name}
                              <br/>
                              <small className="text-muted">उपचार: {ts.treatment_condition}</small>
                            </div>
                            <div>
                              <button
                                onClick={() => editChronicDiseaseMember(ts_key)}
                                className="btn btn-warning btn-sm mr-2"
                                title="Edit"
                                style={{ padding: "4px 8px", fontSize: "14px" }}
                              >
                                ✎
                              </button>
                              <button
                                onClick={() => saveChronicDiseaseMember("remove", ts_key)}
                                className="btn btn-danger btn-sm"
                                title="Delete"
                                style={{ padding: "4px 8px", fontSize: "14px" }}
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={`card ${editingChronicDiseaseId !== null ? "border-warning" : ""}`}>
                    <div className={`card-header ${editingChronicDiseaseId !== null ? "bg-warning" : "bg-light"}`}>
                      <h6 className="mb-0">{editingChronicDiseaseId !== null ? "रोग सम्पादन गर्नुहोस्" : "नयाँ रोग थप्नुहोस्"}</h6>
                    </div>
                    <div className="card-body">
                      <div className="options-horizontal">
                        <select
                          className="form-control"
                          value={chronicDiseaseMember.member_name ?? ""}
                          name="member_name"
                          onChange={handleChronicDiseaseMemberChange}
                        >
                          <option value={""} key={"परिवारमा कोई बिदेशमा-1"}>
                            ---- सदस्य -----
                          </option>
                          {activeMemberOptions.map((option: any, key: any) => (
                              <option value={option.first_name} key={"option.name" + key}>
                                {option.first_name} {option.last_name}
                              </option>
                            ))}
                        </select>
                      </div>

                      <label className="label">a. रोगको नाम</label>
                      <div className="options-vertical">
                        <select
                          className="form-control"
                          name="disease_name"
                          value={chronicDiseaseMember.disease_name ? disease_names.find((d: any) => d.name === chronicDiseaseMember.disease_name)?.id ?? "" : ""}
                          onChange={handleChronicDiseaseMemberChange}
                        >
                          <option value={""}>----------</option>
                          {disease_names.map((dt: any, keydt: any) => (
                            <option value={dt.id} key={keydt + "disability_type_id disease_name"}>
                              {dt.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <label className="label">b. उपचारको अवस्था</label>
                      <div className="options-vertical">
                        <select
                          className="form-control"
                          name="treatment_condition"
                          value={chronicDiseaseMember.treatment_condition ?? ""}
                          onChange={handleChronicDiseaseMemberChange}
                        >
                          <option value={""}>----------</option>
                          <option value={"औषधी गरिरहेको"}>औषधी गरिरहेको</option>
                          <option value={"नगरेको"}>नगरेको</option>
                          <option value={"छाडेको"}>छाडेको</option>
                        </select>
                      </div>

                      <div className="options-horizontal mt-3">
                        <button
                          onClick={() => 
                            editingChronicDiseaseId !== null 
                              ? saveChronicDiseaseMember("edit", editingChronicDiseaseId)
                              : saveChronicDiseaseMember("add")
                          }
                          className={`btn btn-sm ${editingChronicDiseaseId !== null ? "btn-warning" : "btn-success"}`}
                        >
                          {editingChronicDiseaseId !== null ? "अपडेट गर्नुहोस्" : "थप"}
                        </button>
                        {editingChronicDiseaseId !== null && (
                          <button
                            onClick={cancelEditChronicDiseaseMember}
                            className="btn btn-secondary btn-sm ml-2"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}



<label className="label" id={"has_disability-" }>
               C6. अपाङ्ता छ?
              </label>
              <div className="options-vertical">
                <select
                  className="form-control"
                  name="has_disability"
                  key={"अपाङ्ता छ?"}
                  value={effectiveHasDisability ? "1" : "0"}
                  onChange={(e) =>
                    handleChange(e)
                  }
                >
                  <option value={"0"}>छैन</option>
                  <option value={"1"}>छ</option>
                </select>
              </div> 

             {effectiveHasDisability && (
                <div className="child-section">
                  {/* Display list of disability members */}
                  {household.disability_members && household.disability_members.length > 0 && (
                    <div className="card mb-3">
                      <div className="card-header bg-secondary text-white">
                        <h6 className="mb-0">अपाङ्ग सदस्यहरु</h6>
                      </div>
                      <div className="card-body" style={{ padding: "10px" }}>
                        {household.disability_members.map((ts: any, ts_key: any) => (
                          <div 
                            key={ts_key} 
                            className="d-flex justify-content-between align-items-center mb-2 p-2"
                            style={{ backgroundColor: editingDisabilityId === ts_key ? "#e7e7ff" : "#f8f9fa", borderLeft: "4px solid #6c757d" }}
                          >
                            <div className="flex-grow-1">
                              <strong>{ts.member_name}</strong> - {getDisabilityTypeDisplayName(ts)}
                              {getDisabilityCardDisplayName(ts) ? ` - ${getDisabilityCardDisplayName(ts)}` : ""}
                            </div>
                            <div>
                              <button
                                onClick={() => editDisabilityMember(ts_key)}
                                className="btn btn-warning btn-sm mr-2"
                                title="Edit"
                                style={{ padding: "4px 8px", fontSize: "14px" }}
                              >
                                ✎
                              </button>
                              <button
                                onClick={() => saveDisabilityMember("remove", ts_key)}
                                className="btn btn-danger btn-sm"
                                title="Delete"
                                style={{ padding: "4px 8px", fontSize: "14px" }}
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={`card ${editingDisabilityId !== null ? "border-warning" : ""}`}>
                    <div className={`card-header ${editingDisabilityId !== null ? "bg-warning" : "bg-light"}`}>
                      <h6 className="mb-0">{editingDisabilityId !== null ? "अपाङ्गता सम्पादन गर्नुहोस्" : "नयाँ अपाङ्गता थप्नुहोस्"}</h6>
                    </div>
                    <div className="card-body">
                      <div className="options-horizontal">
                        <select
                          className="form-control"
                          value={disabilityMember.member_name ?? ""}
                          name="member_name"
                          onChange={handleDisabilityMemberChange}
                        >
                          <option value={""} key={"परिवारमा कोई बिदेशमा-1"}>
                            ---- सदस्य -----
                          </option>
                          {activeMemberOptions.map((option: any, key: any) => (
                              <option value={option.first_name} key={"option.name" + key}>
                                {option.first_name} {option.last_name}
                              </option>
                            ))}
                        </select>
                      </div>

                      <label className="label">a. अपाङ्गताको प्रकार</label>
                      <div className="options-vertical">
                        <select
                          className="form-control"
                          name="disability_type"
                          value={disabilityMember.disability_type ? disability_types.find((d: any) => d.name === disabilityMember.disability_type || `${d.id}` === `${disabilityMember.disability_type}`)?.id ?? "" : ""}
                          onChange={handleDisabilityMemberChange}
                        >
                          <option value={""}>----------</option>
                          {disability_types.map((dt: any, keydt: any) => (
                            <option value={dt.id} key={keydt + "disability_type_id कार्डः"}>
                              {dt.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <label className="label">b. अपाङ्गताको कार्ड</label>
                      <div className="options-vertical">
                        <select
                          className="form-control"
                          name="disability_card"
                          value={disabilityMember.disability_card ? disability_card_types.find((d: any) => d.name === disabilityMember.disability_card || `${d.id}` === `${disabilityMember.disability_card}`)?.id ?? "" : ""}
                          onChange={handleDisabilityMemberChange}
                        >
                          <option value={""}>----------</option>
                          {disability_card_types.map((dt: any, keydt: any) => (
                            <option value={dt.id} key={keydt + "अपाङ्गताको कार्डः"}>
                              {dt.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="options-horizontal mt-3">
                        <button
                          onClick={() => 
                            editingDisabilityId !== null 
                              ? saveDisabilityMember("edit", editingDisabilityId)
                              : saveDisabilityMember("add")
                          }
                          className={`btn btn-sm ${editingDisabilityId !== null ? "btn-warning" : "btn-success"}`}
                        >
                          {editingDisabilityId !== null ? "अपडेट गर्नुहोस्" : "थप"}
                        </button>
                        {editingDisabilityId !== null && (
                          <button
                            onClick={cancelEditDisabilityMember}
                            className="btn btn-secondary btn-sm ml-2"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              

        <div style={shouldHideCQuestion(7) ? { display: "none" } : undefined}>
        <label className="label" id={"has_missing_deceased_member"}>
         C7. परिवारमा कोही बेपत्ता/मृत्यु(६० वर्ष मुनि)/दुर्घटना/आत्महत्या/हत्या भएको छ?
        </label>
        <div className="options-horizontal">
          <select
            className="form-control"
            name="has_missing_deceased_member"
            key={
              "परिवारमा कोही बेपत्ता/मृत्यु/दुर्घटना/आत्महत्या/हत्या भएको छ? 68 बर्षमुनी"
            }
            value={household.has_missing_deceased_member === "1" ? "1" : ""}
            onChange={(e) => handleChange(e)}
          >
            <option value={"0"}>छैन</option>
            <option value={"1"}>छ</option>
          </select>
        </div>

        {household.has_missing_deceased_member === "1" && (
          <div className="child-section">
            
            {household.missing_deceased_members &&
              household.missing_deceased_members.map((ts: any, ts_key: any) => (
                <button
                  className="btn btn-outline-secondary btn-sm btn-block"
                  key={ts_key}
                  onClick={() => saveMissing("remove", ts.reason_id)}
                >
                  {ts.name} - {ts.reason}
                </button>
              ))}
            <br />
            {/* <label className="label" id={"name"}>a. नाम?</label> */}
            <div className="options-horizontal">
              <input
                className="form-control"
                value={missingMember.name}
                name="name"
                onChange={handleMissingChange}
                placeholder="नाम"
              />
            </div>
            {/* <label className="label" id={"reason_id"}>b. कारन?</label> */}
            <div className="options-horizontal">
              <select
                className="form-control"
                value={missingMember.reason_id ?? ""}
                name="reason_id"
                onChange={handleMissingChange}
              >
                <option value={""} key={"कारन-1"}>
                  ---- कारन -----
                </option>
                {death_reasons.map((option, key) => (
                  <option value={option.id} key={"death_reasons" + key}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            {/* <label className="label" id={"gender"}>c. लिङ्ग?</label> */}
            <div className="options-horizontal">
              <select
                className="form-control"
                value={missingMember.gender ?? ""}
                name="gender"
                onChange={handleMissingChange}
              >
                <option value={""} key={"लिङ्ग-1"}>
                  ----- लिङ्ग ----
                </option>
                <option value={1} key={"death_reasons"}>
                  पुरुष
                </option>
                <option value={2} key={"death_reasonsमहिला"}>
                  महिला
                </option>
                <option value={3} key={"death_reasonsअन्य"}>
                  अन्य
                </option>
              </select>
            </div>
            {/* <label className="label" id={"age"}>d. उमेर?</label> */}
            <div className="options-horizontal">
              <input
                className="form-control"
                value={missingMember.age}
                name="age"
                onChange={handleMissingChange}
                placeholder="उमेर"
              />
            </div>
            <button
              onClick={() => saveMissing("add")}
              className="btn btn-sm btn-success"
            >
              थप
            </button>
            {editingHouseId !== null && (
              <button
                onClick={cancelEditHouse}
                className="btn btn-secondary btn-sm ml-2"
              >
                Cancel
              </button>
            )}
          </div>
        )}
        </div>

        <div style={shouldHideCQuestion(8) ? { display: "none" } : undefined}>
        <label className="label" id={"has_pregchild_health"}>
        C8. परिवारमा कोई गर्भवती/ सुत्केरी/ मातृ मृत्युदर/ बाल मृत्युदर छ?
</label>
          <div className="options-horizontal">
          <select
className="form-control"
name="has_pregchild_health"
key={"परिवारमा कोई गर्भवती/ सुत्केरी/ मातृ मृत्युदर/ बाल मृत्युदर छ"}
value={household.has_pregchild_health ?? "0"}
onChange={(e) => handleChange(e)}
>
<option value={"0"}>छैन</option>
<option value={"1"}>छ</option>
</select>            
</div>  

<div className="child-section">

            {household.has_pregchild_health === "1" && (
          <>
            <label className="label" id={"has_pregnant_member"}>
          C8.1 गर्भवर्ती परिवारमा छ/ छैन?
        </label>
        <div className="options-horizontal">
          <select
            className="form-control"
            name="has_pregnant_member"
            key={"गर्भवर्ती परिवारमा छ/ छैन?"}
            value={household.has_pregnant_member ?? "0"}
            onChange={(e) => handleChange(e)}
          >
            <option value={"0"}>छैन</option>
            <option value={"1"}>छ</option>
          </select>
        </div>
        {household.has_pregnant_member === "1" && (
          <>
            <label className="label" id={"has_pregnancy_test"}>
              a. गर्भ जाच गराएको/ नगराएको?
            </label>
            <div className="options-horizontal">
              <select
                className="form-control"
                name="has_pregnancy_test"
                key={"गर्भ जाच गराएको/ नगराएको?"}
                value={household.has_pregnancy_test ?? "0"}
                onChange={(e) => handleChange(e)}
              >
                <option value={"0"}>नगराएको</option>
                <option value={"1"}>गराएको</option>
              </select>
            </div>
            {household.has_pregnancy_test === "1" && (
              <>
                <label className="label" id={"pregnancy_test_count"}>
                  b. कति पटक?
                </label>
                <div className="options-horizontal">
                  <input
                    className="form-control"
                    name="pregnancy_test_count"
                    key={"कति पटक (गराएको भए)"}
                    value={
                      household.pregnancy_test_count
                        ? household.pregnancy_test_count
                        : "0"
                    }
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </>
            )}
          </>
        )}

        <label className="label" id={"has_maternity_member"}>
          C8.2 परीवारमा ६ महिनाभित्रको सुत्केरी छ/ छैन?
        </label>
        <div className="options-horizontal">
          <select
            className="form-control"
            name="has_maternity_member"
            key={"परीवारमा  ६ महिनाभित्रको सुत्केरी छ/ छैन?"}
            value={household.has_maternity_member ?? "0"}
            onChange={(e) => handleChange(e)}
          >
            <option value={"0"}>छैन</option>
            <option value={"1"}>छ</option>
          </select>
        </div>

        {household.has_maternity_member === "1" && (
          <>
            <label className="label" id={"maternity_location"}>
              a. कहाँ सुत्केरी भएको?
            </label>
            <div className="options-horizontal">
              <select
                className="form-control"
                name="maternity_location"
                key={"कहाँ सुत्केरी भएको?"}
                value={household.maternity_location ?? ""}
                onChange={(e) => handleChange(e)}
              >
                <option value={""}>------</option>

                <option value={"स्वास्थ्य संस्था"}>स्वास्थ्य संस्था(गाउँपालिका भित्रै) </option>
                <option value={"स्वास्थ्य संस्था"}>स्वास्थ्य संस्था</option>
                <option value={"घर"}>घर</option>
              </select>
            </div>
            <label className="label" id={"has_maternity_test"}>
              b. सुत्केरी जाच? गराएको नगराएको?{" "}
            </label>
            <div className="options-horizontal">
              <select
                className="form-control"
                name="has_maternity_test"
                key={"सुत्केरी जाच? गराएको नगराएको?  "}
                value={household.has_maternity_test ?? "0"}
                onChange={(e) => handleChange(e)}
              >
                <option value={"0"}>नगराएको</option>
                <option value={"1"}>गराएको</option>
              </select>
            </div>
          </>
        )}

        <label className="label" id={"has_maternity_death"}>
          C8.3. मातृ मृत्यु भएको छ/ छैन?
        </label>
        <div className="options-horizontal">
          <select
            className="form-control"
            name="has_maternity_death"
            key={"मातृ मृत्यु भएको छ/ छैन?"}
            value={household.has_maternity_death ?? "0"}
            onChange={(e) => handleChange(e)}
          >
            <option value={"0"}>छैन</option>
            <option value={"1"}>छ</option>
          </select>
        </div>
        {household.has_maternity_death === "1" && (
          <>
            <label className="label" id={"maternity_death_condition"}>
              a. गर्भाअवस्था/ ४५ दिनभितत्रको सुत्केरी?
            </label>
            <div className="options-horizontal">
              <select
                className="form-control"
                name="maternity_death_condition"
                key={"गर्भाअवस्था/ ४५ दिनभितत्रको सुत्केरी?"}
                value={household.maternity_death_condition ?? "गर्भाअवस्था"}
                onChange={(e) => handleChange(e)}
              >
                <option value={""}>------</option>
                <option value={"गर्भाअवस्था"}>गर्भाअवस्था</option>
                <option value={"४५ दिनभितत्रको सुत्केरी"}>
                  ४५ दिनभितत्रको सुत्केरी
                </option>
              </select>
            </div>
          </>
        )}

        <label className="label" id={"child_death"}>
          C8.4. नवशिशु / शिशु/ बाल मृत्यु भएको छ?
        </label>
        <div className="options-horizontal">
          <select
            className="form-control"
            name="child_death"
            key={"नवशिशु / शिशु/ बाल मृत्यु भएको छ?"}
            value={household.child_death ?? "0"}
            onChange={(e) => handleChange(e)}
          >
            <option value={"0"}>छैन</option>
            <option value={"1"}>छ</option>
          </select>
        </div>
        {household.child_death === "1" && (
          <>
            <label className="label" id={"child_death_condition"}>
              a. नवशिशु / शिशु/ बाल मृत्यु
            </label>
            <div className="options-horizontal">
              <select
                className="form-control"
                name="child_death_condition"
                key={"नवशिशु / शिशु/ बाल मृत्यु भएको छ?"}
                value={household.child_death_condition ?? "नवशिशु"}
                onChange={(e) => handleChange(e)}
              >
                <option value={""}>------</option>
                <option value={"नवशिशु"}>नवशिशु (२८ दिन सम्मको) </option>
                <option value={"शिशु"}>शिशु (१ वर्ष सम्मको)</option>
                <option value={"बाल"}>बाल (५ वर्ष सम्मको)</option>
              </select>
            </div>
            <label className="label" id={"child_death_count"}>
              b. कतिजना?
            </label>
            <div className="options-horizontal">
              <input
                className="form-control"
                value={household.child_death_count ?? ""}
                name="child_death_count"
                onChange={handleChange}
              />
            </div>
          </>
        )}
          </>
        )}
        </div>
        </div>


        <div style={shouldHideCQuestion(9) ? { display: "none" } : undefined}>
        <label className="label" id={"total_house_count"}>
          {/* 58. घर सम्बन्धी{" "} */}
        </label>
        <label className="label" id={"total_house_count"}>
         C9. कुल घरको संख्या?
        </label>
        <div className="options-verical">
          <input
            onChange={(e) => handleChange(e)}
            type="number"
            className="form-control"
            value={household.total_house_count ?? 0}
            name="total_house_count"
          />
        </div>
        </div>


        <div className="options-horizontal">
          <div className="child-section">
            {false}
            {/* {land.location === "गाउँपालिका" && (
              <>
                <select
                  className="form-control"
                  value={land.ward_id}
                  name="ward_id"
                  onChange={handleLandChange}
                >
                  <option value={""} key={"जग्गाको वडा नं"}>
                    ---- वडा नं -----
                  </option>
                  {wards.map((w: IWard, keyw: any) => (
                    <option value={w.id} key={keyw}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </>
            )} */}

          </div>
        </div>

        <label className="label" id={"agriculture_situation"}>
          C10.  खेतीपातीको अवस्था ?
        </label>
        <div className="options-horizontal">
          <select
            className="form-control"
            name="agriculture_situation"
            key={"खेतीपातीको अवस्था?"}
            value={household.agriculture_situation ?? ""}
            onChange={(e) => handleChange(e)}
          >
             <option value={""} key={"खेतीपातीको अवस्था"}>
                  ---- खेतीपातीको अवस्था -----
                </option>
            <option value={"0"}>खेतीपाती आफैले गरेको</option> 
            <option value={"1"}>खेतीपाती अरुले गरेको</option> 
            <option value={"2"}>खेतीपाती नगरेको (बाझो)</option>
                       <option value={"4"}>अरुको जग्गा कमाई गरेको</option>
             <option value={"3"}>खेतीयोग्य जमिन नै नभएको</option>

          </select>
        </div>

        <label className="label" id={"total_area"}>
         C11. जग्गा सम्बन्धी{" "}
        </label>


        <div className="options-horizontal">
          <div className="child-section">
            {household.lands && household.lands.length > 0 && (
              <div className="card mb-3">
                <div className="card-header bg-info text-white">
                  <h6 className="mb-0">जग्गा विवरणहरू</h6>
                </div>
                <div className="card-body" style={{ padding: "10px" }}>
                  {household.lands.map((an: any, an_key: any) => (
                    <div
                      key={an_key}
                      className="d-flex justify-content-between align-items-center mb-2 p-2"
                      style={{ backgroundColor: editingLandId === an_key ? "#e7f7ff" : "#f8f9fa", borderLeft: "4px solid #17a2b8" }}
                    >
                      <div className="flex-grow-1">
                        <strong>{an.location}</strong> - {getLandDisplayName(an) || "-"} - {an.total_area} {an.area_unit}
                      </div>
                      <div>
                        <button
                          onClick={() => editLand(an_key)}
                          className="btn btn-warning btn-sm mr-2"
                          title="Edit"
                          style={{ padding: "4px 8px", fontSize: "14px" }}
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => saveLand("remove", an_key)}
                          className="btn btn-danger btn-sm"
                          title="Delete"
                          style={{ padding: "4px 8px", fontSize: "14px" }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <label className="label" id={"location"}>
              a. जग्गाको स्थान
            </label>

            <div className="options-horizontal">
              <select
                className="form-control"
                value={land.location ?? ""}
                name="location"
                onChange={handleLandChange}
              >
                <option value={""} key={"जग्गाको स्थान"}>
                  ---- स्थान -----
                </option>

                <option value={"गाउँपालिका"}>गाउँपालिका</option>
                <option value={"जिल्ला"}>जिल्ला</option>
                <option value={"काठमान्डौ"}>काठमान्डौ</option>
                <option value={"अन्य"}>अन्य</option>
              </select>
            </div>
            
            <label className="label" id={"land_type_id"}>
              b. जग्गाको प्रकार
            </label>
            <div className="options-verticle">
              <select
                className="form-control"
                value={land.land_type_id ?? ""}
                name="land_type_id"
                onChange={handleLandChange}
              >
                <option value={""} key={"जग्गाको प्रकारः"}>
                  ---- जग्गाको प्रकार -----
                </option>
                {land_types.map((option: any, key: any) => (
                  <option value={option.id} key={"जग्गाको प्रकारः" + key}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* <label className="label" id={"total_area"}>c. क्षेत्रफल</label> */}
            <div className="options-horizontal">
              <input
                type="number"
                className="form-control"
                value={land.total_area ?? ""}
                name="total_area"
                onChange={handleLandChange}
                placeholder="क्षेत्रफल"
              />
              <select
                className="form-control"
                value={land.area_unit ?? ""}
                name="area_unit"
                onChange={handleLandChange}
              >
                <option value={""} key={"जग्गाको क्षेत्रफल"}>
                  ---- एकाइ -----
                </option>

                <option value={"रोपनी"}>रोपनी</option>
                <option value={"आना"}>आना</option>
                <option value={"दाम"}>दाम</option>
              </select>
            </div>
           
            <div className="options-horizontal">
              <input
                type="number"
                className="form-control"
                value={land.uncultivated_land_area ?? ""}
                name="uncultivated_land_area"
                onChange={handleLandChange}
                placeholder="बाझो जग्गा"
              />
              <input
                type="number"
                className="form-control"
                value={land.irrigated_area ?? ""}
                name="irrigated_area"
                onChange={handleLandChange}
                placeholder="सिचाइ क्षेत्रफल"
              />
            </div>

            <label className="label" id={"land_use_type"}>
              c. अवस्था
            </label>
            <div className="options-horizontal">
              <select
                className="form-control"
                value={land.land_use_type ?? ""}
                name="land_use_type"
                onChange={handleLandChange}
              >
                <option value="">--- अवस्था ---</option>
                <option value="0">आफै</option>
                <option value="1">करार</option>
                <option value="2">अधिया</option>
              </select>
            </div>

            <div className="options-horizontal">
              <input
                type="text"
                className="form-control"
                value={land.remarks ?? ""}
                name="remarks"
                onChange={handleLandChange}
                placeholder="कैफियत"
              />
            </div>
            <button
              onClick={() =>
                editingLandId !== null ? saveLand("edit", editingLandId) : saveLand("add")
              }
              className={`btn btn-sm ${editingLandId !== null ? "btn-warning" : "btn-success"}`}
            >
              थप
            </button>
          </div>
        </div>

        <label className="label" id={"has_business"}>
          C12. व्यवसाय छ?
        </label>
        <div className="options-horizontal">
          <select
            className="form-control"
            value={household.has_business ?? "0"}
            name="has_business"
            onChange={handleChange}
          >
            <option value={"0"}>छैन</option>
            <option value={"1"}>छ</option>
          </select>
        </div>

        {`${household.has_business ?? "0"}` === "1" && (
          <div className="options-horizontal">
            <div className="child-section">
              {household.businesses && household.businesses.length > 0 && (
                <div className="card mb-3">
                  <div className="card-header bg-secondary text-white">
                    <h6 className="mb-0">व्यवसाय विवरणहरू</h6>
                  </div>
                  <div className="card-body" style={{ padding: "10px" }}>
                    {household.businesses.map((entry: any, entryKey: any) => (
                      <div
                        key={entryKey}
                        className="d-flex justify-content-between align-items-center mb-2 p-2"
                        style={{
                          backgroundColor: editingBusinessId === entryKey ? "#f3f3f3" : "#f8f9fa",
                          borderLeft: "4px solid #6c757d",
                        }}
                      >
                        <div className="flex-grow-1">
                          <strong>{entry.member_name || "-"}</strong> -{" "}
                          {getBusinessDisplayName(entry) || "-"} - {entry.business_place || "-"} -{" "}
                          {`${entry.type ?? ""}` === "1" ? "साझेदारी" : "एकल"}
                        </div>
                        <div>
                          <button
                            onClick={() => editBusiness(entryKey)}
                            className="btn btn-warning btn-sm mr-2"
                            title="Edit"
                            style={{ padding: "4px 8px", fontSize: "14px" }}
                          >
                             ✎
                          </button>
                          <button
                            onClick={() => saveBusiness("remove", entryKey)}
                            className="btn btn-danger btn-sm"
                            title="Delete"
                            style={{ padding: "4px 8px", fontSize: "14px" }}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <label className="label" id={"business_member_name"}>
                a. सदस्य
              </label>
              <div className="options-horizontal">
                <select
                  className="form-control"
                  value={business.member_name ?? ""}
                  name="member_name"
                  onChange={handleBusinessChange}
                >
                  <option value={""}>---- सदस्य ----</option>
                  {activeMemberOptions.map((option: any, key: any) => (
                    <option value={option.first_name} key={"business-member-" + key}>
                      {option.first_name} {option.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <label className="label" id={"business_type_id"}>
                b. व्यवसायको प्रकार
              </label>
              <div className="options-horizontal">
                <select
                  className="form-control"
                  value={business.business_type_id ?? ""}
                  name="business_type_id"
                  onChange={handleBusinessChange}
                >
                  <option value={""}>--- प्रकार छान्नुहोस् ---</option>
                  {businessTypes.map((option: any, key: any) => (
                    <option value={option.id} key={"business-type-" + key}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              <label className="label" id={"business_place"}>
                c. स्थान
              </label>
              <div className="options-horizontal">
                <select
                  className="form-control"
                  value={business.business_place ?? ""}
                  name="business_place"
                  onChange={handleBusinessChange}
                >
                  <option value={""}>--- स्थान छान्नुहोस् ---</option>
                  {businessPlaces.map((option: any, key: any) => (
                    <option value={option.id} key={"business-place-" + key}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              <label className="label" id={"business_type_mode"}>
                d. प्रकार
              </label>
              <div className="options-horizontal">
                <select
                  className="form-control"
                  value={business.type ?? ""}
                  name="type"
                  onChange={handleBusinessChange}
                >
                  <option value={""}>--- प्रकार ---</option>
                  <option value={"0"}>एकल</option>
                  <option value={"1"}>साझेदारी</option>
                </select>
              </div>

              <div className="options-horizontal">
                <input
                  type="text"
                  className="form-control"
                  value={business.remarks ?? ""}
                  name="remarks"
                  onChange={handleBusinessChange}
                  placeholder="कैफियत"
                />
              </div>

              <button
                onClick={() =>
                  editingBusinessId !== null
                    ? saveBusiness("edit", editingBusinessId)
                    : saveBusiness("add")
                }
                className={`btn btn-sm ${editingBusinessId !== null ? "btn-warning" : "btn-success"}`}
              >
                थप
              </button>
              {editingBusinessId !== null && (
                <button
                  onClick={cancelEditBusiness}
                  className="btn btn-secondary btn-sm ml-2"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

        <div style={shouldHideCQuestion(12) ? { display: "none" } : undefined}>
        <label className="label" id={"has_natural_disaster"}>
          C12.  प्राकृतिक प्रकोपको जोखिम छ  ?
        </label>
        <div className="options-horizontal">
          <select
            className="form-control"
            name="has_natural_disaster"
            key={"प्राकृतिक प्रकोपको जोखिम छ?"}
            value={household.has_natural_disaster ?? "0"}
            onChange={(e) => handleChange(e)}
          >
            <option value={"0"}>छैन</option>
            <option value={"1"}>छ</option>
          </select>
        </div>
            <br />

            {household.has_natural_disaster === "1" && (

        <div className="options-horizontal">
          <div className="child-section">
            {household.disasters &&
              household.disasters.map((an: any, an_key: any) => (
                <button
                  className="btn btn-outline-info btn-sm btn-block"
                  key={an_key}
                  onClick={() => saveDisaster("remove", an_key)}
                >{an.disaster_type} - {an.disaster_location}- {an.disaster_priority}
               </button>
              ))}
            <br />
            <label className="label" id={"disaster_type"}>
              a. जोखिमको प्रकार
            </label>

            <div className="options-horizontal">
            <select
                className="form-control"
                value={disaster.disaster_type ?? ""}
                name="disaster_type"
                onChange={handleDisasterChange}
              >
                <option value={""} key={"जोखिमको प्रकार"}>
                  ---- जोखिमको प्रकार -----
                </option>
                {disaster_types.map((option, key) => (
                  <option value={option.name} key={"जोखिमको प्रकाररः" + key}>
                    {option.name}
                  </option>
                ))}
              </select>

              </div>
              <label className="label" id={"disaster_location"}>
              b. जोखिम पर्ने स्थान
            </label>

            <div className="options-horizontal">
            <select
                className="form-control"
                value={disaster.disaster_location ?? ""}
                name="disaster_location"
                onChange={handleDisasterChange}
              >
                <option value={""} key={"जोखिम पर्ने स्थान"}>
                  ---- जोखिम पर्ने स्थान -----
                </option>
                {disaster_location.map((option, key) => (
                  <option value={option.name} key={"जोखिम पर्ने स्थान" + key}>
                    {option.name}
                  </option>
                ))}
              </select>

              </div>
            <label className="label" id={"disaster_priority_id"}>
              c. जोखिमको प्राथमिकता 
                          </label>
            <div className="options-verticle">
              <select
                className="form-control"
                value={disaster.disaster_priority ?? ""}
                name="disaster_priority"
                onChange={handleDisasterChange}
              >
                <option value={""} key={"जोखिमको प्राथमिकता"}>
                  ---- जोखिमको प्राथमिकता -----
                </option>
                <option value={"उच्च जोखिम"}>उच्च जोखिम</option>
<option value={"मध्यम जोखिम"}>मध्यम जोखिम</option>
<option value={"न्यून जोखिम"}>न्यून जोखिम</option>
              </select>
              <div className="options-horizontal">
              <input
                type="text"
                className="form-control"
                value={disaster.remarks ?? ""}
                name="remarks"
                onChange={handleDisasterChange}
                placeholder="कैफियत"
              />
            </div>

            </div>

                       <button
              onClick={() => saveDisaster("add")}
              className="btn btn-sm btn-success" >
              थप
            </button>
          </div>
        </div>
            )}
        </div>


        
              <div style={shouldHideCQuestion(13) ? { display: "none" } : undefined}>
              <label className="label" id={"income_expense"}>
             C13. वार्षिक आय/ व्ययको विवरण (रु. हजारमा)
            </label>
            <div className="options-horizontal">
              <input 
                type="number"
                className="form-control"
                value={household.hoh_income_amount?? ""}
                name="hoh_income_amount"
                onChange={(e) => handleChange(e)}
                placeholder="आय"
              />

        
              <input 
                type="number"
                className="form-control"
                value={household.hoh_expense_amount?? ""}
                name="hoh_expense_amount"
                onChange={(e) => handleChange(e)}
                placeholder=" व्यय (खर्च)"
              />

</div>
              </div>

        <div style={shouldHideCQuestion(14) ? { display: "none" } : undefined}>
        <label className="label" id={"light_fuels"}>
         C14. मुख्य ३ वटा सम्म परिवारको आयको स्रोत छान्नुहोस। प्राथमिकता अनुसार ?
        </label>
        <div className="options-horizontal">
          <Multiselect
            options={income_sources}
            selectedValues={household.income_sources}
            onSelect={(value) =>
              handleArrayChangeInHousehold("income_sources", value)
            }
            onRemove={(value) =>
              handleArrayChangeInHousehold("income_sources", value)
            }
            displayValue="name"
            selectionLimit={3}
          />
        </div>
        </div>

        <div style={shouldHideCQuestion(15) ? { display: "none" } : undefined}>
        <label className="label" id={"light_fuels"}>
          C15. मुख्य ३ वटा सम्म परिवारको खर्च स्रोत छान्नुहोस। प्राथमिकता अनुसार
        </label>
        <div className="options-horizontal">
          <Multiselect
            options={expense_sources}
            selectedValues={household.expense_sources}
            onSelect={(value) =>
              handleArrayChangeInHousehold("expense_sources", value)
            }
            onRemove={(value) =>
              handleArrayChangeInHousehold("expense_sources", value)
            }
            displayValue="name"
            selectionLimit={3}
          />
      
        
</div>
        </div>

      
      
        {/* <h5> स्रोतहरु </h5> */}
        <div style={shouldHideCQuestion(16) ? { display: "none" } : undefined}>
        <label className="label" id={"water_source_id"}>
          C16. खानेपानीको मुख्य श्रोत
        </label>
        <div className="options-horizontal">
          <select
            className="form-control"
            value={household.water_source_id ?? ""}
            name="water_source_id"
            onChange={handleChange}
          >
            <option value={""} key={"श्रोत-1"}>
              ---- श्रोत -----
            </option>
            {water_sources.map((option, key) => (
              <option value={option.id} key={"water_source_id" + key}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
        {(household.water_source_id === "1" ||
          household.water_source_id === "2") && (
          <div className="child-section">
            <label className="label" id={"water_source_location"}>
              a. घरमा कि साझा ?
            </label>

            <div className="options-horizontal">
              <select
                className="form-control"
                value={household.water_source_location ?? "घरमा"}
                name="water_source_location"
                onChange={handleChange}
              >
                <option value={"घरमा"} key={"घरमा121"}>
                  घरमा
                </option>
                <option value={"साझा"} key={"घरमा"}>
                  साझा
                </option>
              </select>
            </div>
            {            household.water_source_location === "साझा" &&
            (
              <>
                <label className="label" id={"water_source_distance"}>
                  b. लाग्ने समय ? (मिनेट)
                </label>
                <div className="options-horizontal">
                  <input
                    className="form-control"

                    value={household.water_source_distance ?? ""}
                    name="water_source_distance"
                    onChange={handleChange}
                    placeholder="दुरी (मिनेट)"
                  />
                </div>
              </>
            )}
          </div>
        )}
{(household.water_source_id !== "1" &&
          household.water_source_id !== "2") && (
          <div className="child-section">
           
            
              <>
                <label className="label" id={"water_source_distance"}>
                  b. लाग्ने समय ? (मिनेट)
                </label>
                <div className="options-horizontal">
                  <input
                    type="number"
                    className="form-control"
                    value={household.water_source_distance ?? ""}
                    name="water_source_distance"
                    onChange={handleChange}
                    placeholder="दुरी (मिनेट)"
                  /> 
                </div>
              </>
            
          </div>
        )}
        </div>
        <div style={shouldHideCQuestion(17) ? { display: "none" } : undefined}>
        <label className="label" id={"cooking_fuels"}>
         C17. खाना पकाउन
        </label>
        <div className="options-vertical">
          <Multiselect
            options={cooking_fuels}
            selectedValues={household.cooking_fuels}
            onSelect={(value) =>
              handleArrayChangeInHousehold("cooking_fuels", value)
            }
            onRemove={(value) =>
              handleArrayChangeInHousehold("cooking_fuels", value)
            }
            displayValue="name"
            selectionLimit={5}
          />
        </div>
        </div>

        
        <div style={shouldHideCQuestion(18) ? { display: "none" } : undefined}>
        <label className="label" id={"nearest_road_distance_minute"}>
          C18. सडक सम्मको दुरी ? (मिनेटमा)
        </label>
        <div className="options-horizontal">
        
        <input
            type="number"
            className="form-control"
            value={household.nearest_road_distance_minute ?? ""}
            name="nearest_road_distance_minute"
            onChange={handleChange}
            placeholder="नजिकको सडक"
          />
          <input
            type="number"
            className="form-control"
            value={household.public_vehicle_distance_minute ?? ""}
            name="public_vehicle_distance_minute"
            onChange={handleChange}
            placeholder="सार्वजनिक यातायात चल्ने सम्मको)"
          />
        </div>
        </div>
       
        <div style={shouldHideCQuestion(19) ? { display: "none" } : undefined}>
        <label className="label" id={"nearest_hospital_distance"}>
         C19. स्वास्थ्य संस्था सम्म लाग्ने दुरी? (मिनेट)
        </label>
        <div className="options-horizontal">
          <input
            type="number"
            className="form-control"
            value={household.nearest_hospital_distance ?? ""}
            name="nearest_hospital_distance"
            onChange={handleChange}
            placeholder="नजिकको स्वास्थ्य संस्था"
          />
          <input
            type="number"
            className="form-control"
            value={household.hospital_distance_minute ?? ""}
            name="hospital_distance_minute"
            onChange={handleChange}
            placeholder="स्वास्थ्य चौकी/ अस्पताल"
          />
        </div>
        </div>
        <div style={shouldHideCQuestion(20) ? { display: "none" } : undefined}>
        <label className="label" id={"primary_distance"}>
          C20. विद्यालय सम्म लाग्ने समय (मिनेटमा)
        </label>
        <div className="options-horizontal">
          <input
            type="number"
            className="form-control"
            value={household.primary_distance ?? ""}
            name="primary_distance"
            onChange={handleChange}
            placeholder="आ.वि सम्म"
          />
          
          <input
            type="number"
            className="form-control"
            value={household.secondary_distance ?? ""}
            name="secondary_distance"
            onChange={handleChange}
            placeholder="मा.वि सम्म"
          />

<input
            type="number"
            className="form-control"
            value={household.higher_secondary_distance ?? ""}
            name="higher_secondary_distance"
            onChange={handleChange}
            placeholder="क्याम्पस सम्म"
          />
        
       
        </div>
        </div>
      
        <br/>
            {/* <h5> बित्तिय विवरण </h5> */}

            <div style={shouldHideCQuestion(21) ? { display: "none" } : undefined}>
            <label className="label" id={"has_health_insurance-"}>
                C21. स्वास्थ्य बिमा/ जीवन बिमा गर्नेको परिवारमा संख्या ?{" "}
              </label>
              <div className="options-horizontal">
               <input 
                type="number"
                className="form-control"
                value={household.has_health_insurance ?? ""}
                name="has_health_insurance"
                onChange={handleChange}
                placeholder="स्वास्थ्य बिमा"
              />

<input 
                type="number"
                className="form-control"
                value={household.has_life_insurance ?? ""}
                name="has_life_insurance"
                onChange={handleChange}
                placeholder="जिबन बिमा"
              />


</div>
              </div>
             
              <div>
              <label className="label" id={"has_bank_account-" }>
               C13.  सहकारी/बैङ्कमा खाता हुने सदस्यको संख्या
              </label>
              <div className="options-horizontal">
              <input
                  className="form-control"
                  type="number"
                  name="has_cooperative_account"
                  key={"सहकारीमा सदस्य हुनुहुन्छ?" }
                  value={household.has_cooperative_account ?? ""}
                  onChange={handleHouseholdFieldChange}
                  placeholder="सहकारी खाता"
               />
                <input
                  type="number"
                  className="form-control"
                  name="has_bank_account"
                  key={"बैंकमा खाता छ?" }
                  value={household.has_bank_account ?? ""}
                  onChange={handleHouseholdFieldChange}
                  placeholder="बैङ्क खाता"
                />
                                
              
                  
              </div> 
              </div>
              <div style={shouldHideCQuestion(23) ? { display: "none" } : undefined}>
              <label className="label" id={"has_bank_account-" }>
                C23.स्मार्टफोन/ अनौपचारिक शिक्षा सदस्यको संख्या
              </label>
              <div className="options-horizontal">
                <input
                type="number"
                  className="form-control"
                  name="has_smartphone"
                  key={"स्मार्टफोन" }
                  value={household.has_smartphone ?? ""}
                  onChange={handleChange}
                  placeholder="स्मार्टफोन"
                />
                                
                <input
                type="number"
                  className="form-control"
                  name="has_informal_education"
                  key={"अनौपचारिक शिक्षा" }
                  value={household.has_informal_education ?? ""}
                  onChange={handleChange}
                  placeholder="अनौपचारिक शिक्षा"
               />
                  
              </div> 

              </div>
              <div style={shouldHideCQuestion(24) ? { display: "none" } : undefined}>
              <label className="label"
                id={"recommendation_for_local_level-"  }>             
               C24. गाउँपालिकाले तिब्र विकासको लागि कुन क्षेत्रमा बढी ध्यान
                दिनुपर्छ ? (२ वटा मात्र)
              </label>
              <div className="options-vertical">
                <Multiselect
                   options={developmentOption}
                   selectedValues={household.developmentOption}
                   onSelect={(value) =>
                     handleArrayChangeInHousehold("developmentOption", value)
                   }
                   onRemove={(value) =>
                     handleArrayChangeInHousehold("developmentOption", value)
                   }
                   displayValue="name"
                   selectionLimit={2}
                 
                />
              </div>

              </div>
              <div style={shouldHideCQuestion(25) ? { display: "none" } : undefined}>
              <label className="label" id={"feelings_for_local_government"}>
              C25. अहिलेको स्थानिय सरकारको काम कस्तो लागेको छ?
              </label>
              <div className="options-vertical">
                <select
                  className="form-control"
                  name="feelings_for_local_government"
                  key={
                    "अहिलेको स्थानिय सरकारको काम कस्तो लागेको छ?" 
                  }
                  value={household.feelings_for_local_government ?? "0"}
                  onChange={(e) =>
                    handleChange(e)
                  }
                >
                  <option value={"5"}>राम्रो</option>
                  <option value={"3"}>ठिकै सन्तोषजनक</option>
                  <option value={"1"}>नराम्रो</option>
                </select>
              </div>


              </div>
              <div style={shouldHideCQuestion(26) ? { display: "none" } : undefined}>
              <label className="label" id={"complaint"}>
              C26. केही गुनासो भएमा?
              </label>
              <div className="options-vertical">
                <input
                type="text"
                                  className="form-control"
                  name="gov_complaint"
                  key={
                    "सरकार सम्बन्धी गुनासो?" 
                  }
                  value={household.gov_complaint ?? ""}
                  placeholder="सरकार सम्बन्धी गुनासो"
                  onChange={(e) =>
                    handleChange(e)
                  }
                >
                  
                </input>
              </div>
              <div className="options-vertical">
                <input
                type="text"
                                  className="form-control"
                  name="form_complaint"
                  key={
                    "फाराम सम्बन्धी गुनासो?" 
                  }
                  value={household.form_complaint ?? ""}
                  placeholder="फाराम सम्बन्धी गुनासो"
                  onChange={(e) =>
                    handleChange(e)
                  }
                >
                  
                </input>
              </div>
     
        {/* <h5> उत्तरदाताको विवरण</h5> */}


              </div>
        <label className="label" id={"is_responder_member"}>
          C14. उत्तरदाता घरपरिवारकै सदस्य हो ?
        </label>
        <div className="options-horizontal">
          <select
            className="form-control"
            name="is_responder_member"
            key={"उत्तरदाता घरपरिवारकै सदस्य हो?"}
            value={household.is_responder_member ?? "0"}
            onChange={(e) => handleChange(e)}
          >
            <option value={"1"}>हो </option>
            <option value={"0"}>होईन</option>
          </select>
        </div>
            <br />
            {household.is_responder_member === "1" && (
              <div className="child-section">
                <label className="label" id={"responder_name"}>
              a. उत्तरदाताको सदस्यको नाम
            </label>
            <div className="options-horizontal">
              <select
                className="form-control"
                value={household.responder_member_name ?? ""}
                name="responder_member_name" 
                 onChange={handleChange}
              >
                <option value={""} key={"responder_member_name"}>
                  ---- सदस्य -----
                </option>
                {activeMemberOptions.map((option: any, key: any) => (
                    <option value={option.first_name} key={"option.name" + key}>
                      {option.first_name} {option.last_name}
                    </option>
                  ))}
              </select>
            </div>
            </div>
)}

            {household.is_responder_member === "0" && (
              <div className="child-section">
              <div>
              <label className="label" id={"responder_name"}>
               a.उत्तरदाताको नाम
            </label>
            <div className="options-horizontal">
              <input
                className="form-control"
                value={household.responder_name ?? ""}
                name="responder_name"
                onChange={handleChange}
                placeholder="उत्तरदाताको नाम"
                             />
            </div>
            </div>
            </div>

            )}
            
                    
              </div>
    </>
  );
}
