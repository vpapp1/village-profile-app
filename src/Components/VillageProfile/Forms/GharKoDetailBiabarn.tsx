import { useEffect, useState } from "react";
import InputComponent from "./FormComponent/InputComponent";
import SelectComponent from "./FormComponent/SelectComponent";
import {
  IAnimal,
  IForeignMember,
  IChronicDiseaseMember,
  IDisabiltyMember,
  IVehicle,
  IHousehold,
  IIncomeExpense,
  IHouse,
  IDisaster,
  ILand,
  IMissingDeceasedMember,
  ITrainingDetail,
} from "../../../db/models/Household";
import {
  developmentOption,
  disability_card_types,
  disability_types,
  disease_names,
  animal_types,
  cooking_fuels,
  death_reasons,
  expense_sources,
  facilities,
  festivals,
  vehicle_types,
  foreign_reasons,
  income_sources,
  house_types,
  disaster_types,
  disaster_location,
  land_types,
  light_fuels,
  toilet_types,
  water_sources,
  relations,
  yes_nos,
  technical_skills,
} from "../../../enums";
import Multiselect from "multiselect-react-dropdown";
import { IWard } from "../../../db/models/WardModel";

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
  source: "0",
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

const initialVehicle = {
  vehicle_type: "",
  vehicle_type_id: "",
  count: "",
} as IVehicle;

let initialAnimal = {
  animal: "",
  animal_type_id: "",
  count: "1",
} as IAnimal;
let initialIncomeExpense = {
  income_source_id: "",
  expense_source_id: "",
  source: "",
  source_id: "",
  income_amount: "",
  expense_amount: "",
  total_income_amount:0,
  total_expense_amount :0,
  } as IIncomeExpense;

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
  irrigation: "",
  kitta_no: "",
  ward_id: "",
  remarks: "",
} as ILand;
export default function GharKoDetailBiabarn(props: any) {
  let { hh, members, wards, countries, country_samuhas,errors,} = props;
  let { handleChange, handleArrayChangeInHousehold } = props;
  const [household, setHousehold] = useState({ ...hh } as IHousehold);
  const [foreignMember, setForeignMember] = useState(initialForeignMember);
  const [chronicDiseaseMember, setchronicDiseaseMember] = useState(initialChronicDiseaseMember);
  const [techSkillMember, setTechSkillMember] = useState(initialTechSkillMember);
  const [disabilityMember, setdisabilityMember] = useState(initialDisabilityMember);
  const [missingMember, setMissingMember] = useState(initialMissingMember);
  const [vehicle, setVehicle] = useState(initialVehicle);
  const [animal, setAnimal] = useState(initialAnimal);
  const [house, setHouse] = useState(initialHouse);
  const [disaster, setDisaster] = useState(initialDisaster);
  const [land, setLand] = useState(initialLand);
  const [income_expense, setIncomeExpense] = useState(initialIncomeExpense);
  const [filter_countries, setFilterCountries] = useState(countries);

  useEffect(() => {
    setHousehold({ ...hh });
  }, [hh]);

  const handleForeignMemberChange = (e: any) => {
       setForeignMember((foreignMember) => ({
      ...foreignMember,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name == "member_name" && members && members.length) {
      let v = members.find((s: any) => s.first_name == e.target.value);
      if (v) {
        setForeignMember((foreignMember) => ({
          ...foreignMember,
          member_name: v.first_name,
        }));
      }
    }
     if(e.target.name == "country_samuha_id"){
      console.log(countries);
      let new_countries = countries.filter((s: any) => s.country_samuha_id == e.target.value)
          setFilterCountries(new_countries)
    }

    if (e.target.name == "country_id") {
      let v = countries.find((s: any) => s.id == e.target.value);
      setForeignMember((foreignMember) => ({
        ...foreignMember,
        country: v.name,
      }));
    }
  };   

  const handleTechSkillChange = (e: any) => {
    
    setTechSkillMember((techSkillMember) => ({
      ...techSkillMember,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name == "member_name" && members && members.length) {
      
      let v = members.find((s: any) => s.first_name == e.target.value);
      if (v) {
        setTechSkillMember((techSkillMember) => ({
          ...techSkillMember,
          member_name: v.first_name,
        }));
      }
      }
      if (e.target.name == "skill_id") {
        let skill = technical_skills.find((s: any) => s.id == e.target.value);
          setTechSkillMember((techSkillMember) => ({
          ...techSkillMember,
          skill_name: skill.name,
        }));
      }
     };

     const saveTechSkill = (cmd: string, member_name?: any) => {
      let newTechSkillMember;
       
      if (cmd == "add") {
        if (techSkillMember.member_name == "" || techSkillMember.skill_id == "") {
          alert("सदस्य र सीप छान्नुहोस");
          return;
        }
        newTechSkillMember = household.technical_skills_members ?? [];
        newTechSkillMember.push(techSkillMember);
      } else {
        newTechSkillMember = household.technical_skills_members ?? [];
        const index = newTechSkillMember.findIndex(
          (obj: any) => obj.member_name === member_name
        );
        newTechSkillMember.splice(index, 1);
      }
      handleArrayChangeInHousehold("technical_skills_members", newTechSkillMember);
      setTechSkillMember({ ...initialTechSkillMember });
    };
    
  
  const handleChronicDiseaseMemberChange = (e: any) => {
    setchronicDiseaseMember((chronicDiseaseMember) => ({
   ...chronicDiseaseMember,
   [e.target.name]: e.target.value,
 }));
 if (e.target.name == "member_name" && members && members.length) {
   let v = members.find((s: any) => s.first_name == e.target.value);
   if (v) {
     setchronicDiseaseMember((chronicDiseaseMember) => ({
       ...chronicDiseaseMember,
       member_name: v.first_name,
     }));
   }
 }
 };  

 
 const handleDisabilityMemberChange = (e: any) => {
  setdisabilityMember((disabilityMember) => ({
 ...disabilityMember,
 [e.target.name]: e.target.value,
}));
if (e.target.name == "member_name" && members && members.length) {
 let v = members.find((s: any) => s.first_name == e.target.value);
 if (v) {
   setdisabilityMember((disabilityMember) => ({
     ...disabilityMember,
     member_name: v.first_name,
   }));
 }
}
// if (e.target.name == "disability_card") {
//   let disa = disability_types.find((s: any) => s.id == e.target.value);
//   setdisabilityMember((disabilityMember) => ({
//     ...disabilityMember,
//     skill_name: skill.name,
//   }));
// }

};  

  const saveForeignMember = (cmd: string, member_name?: any) => {
    let newForeignMember;
     
    if (cmd == "add") {
      if (foreignMember.member_name == "" || foreignMember.country == "") {
        alert("सदस्य र देश छान्नुहोस।");
        return;
      }
      newForeignMember = household.foreign_members ?? [];
      newForeignMember.push(foreignMember);
    } else {
      newForeignMember = household.foreign_members ?? [];
      const index = newForeignMember.findIndex(
        (obj: any) => obj.member_name === member_name
      );
      newForeignMember.splice(index, 1);
    }
    handleArrayChangeInHousehold("foreign_members", newForeignMember);
    setForeignMember({ ...initialForeignMember });
  };


  const saveChronicDiseaseMember = (cmd: string, member_name?: any) => {
    let newChronicDiseaseMember;
     
    if (cmd == "add") {
      if (chronicDiseaseMember.member_name == "" || chronicDiseaseMember.disease_name == "") {
        alert("सदस्य र रोगको नाम छान्नुहोस।");
        return;
      }
      newChronicDiseaseMember = household.chronic_disease_members ?? [];
      newChronicDiseaseMember.push(chronicDiseaseMember);
    } else {
      newChronicDiseaseMember = household.chronic_disease_members ?? [];
      const index = newChronicDiseaseMember.findIndex(
        (obj: any) => obj.member_name === member_name
      );
      newChronicDiseaseMember.splice(index, 1);
    }
    handleArrayChangeInHousehold("chronic_disease_members", newChronicDiseaseMember);
    setchronicDiseaseMember({ ...initialChronicDiseaseMember });
  };
  const saveDisabilityMember = (cmd: string, member_name?: any) => {
    let newDisabilityMember;
     
    if (cmd == "add") {
      if (disabilityMember.member_name == "" || disabilityMember.disability_type == "") {
        alert("सदस्य र अपाङ्गताको प्रकार छान्नुहोस।");
        return;
      }
      newDisabilityMember = household.disability_members ?? [];
      newDisabilityMember.push(disabilityMember);
    } else {
      newDisabilityMember = household.disability_members ?? [];
      const index = newDisabilityMember.findIndex( 
        (obj: any) => obj.member_name === member_name
      );
      newDisabilityMember.splice(index, 1);
    }
    handleArrayChangeInHousehold("disability_members", newDisabilityMember);
    setdisabilityMember({ ...initialDisabilityMember });
  };

  const handleMissingChange = (e: any) => {
    setMissingMember((missingMember) => ({
      ...missingMember,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name == "reason_id") {
      let v = death_reasons.find((s: any) => s.id == e.target.value);
      setMissingMember((missingMember) => ({
        ...missingMember,
        reason: v.name,
      }));
    }
  };

  const saveMissing = (cmd: string, reason_id?: any) => {
    let newMissingMember;
    if (cmd == "add") {
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
    if (e.target.name == "vehicle_type_id") {
      let v = vehicle_types.find((s: any) => s.id == e.target.value);
      setVehicle((vehicle) => ({
        ...vehicle,
        vehicle_type_name: v.name,
      }));
    }
  };
  
  
  const saveVehicle = (cmd: string, vehicle_name?: any) => {
    
    let newVehicles;
    if (cmd == "add") {
      if (vehicle.vehicle_type_id == "" || vehicle.count =="") {
        alert("सवारीको किसिम र संख्या छान्नुहोस।");
        return;
      }
      newVehicles = household.vehicles ?? [];
      newVehicles.push(vehicle);
    } else {
      newVehicles = household.vehicles ?? [];
      const index = newVehicles.findIndex(
        (obj: any) => obj.vehicle_type_name === vehicle_name
      );
      newVehicles.splice(index, 1);
    }
    handleArrayChangeInHousehold("vehicles", newVehicles);
    setVehicle({ ...initialVehicle });
  };

  // const handleAnimalChange = (e: any) => {
  //   setAnimal((animal) => ({
  //     ...animal,
  //     [e.target.name]: e.target.value,
  //   }));
  //   if (e.target.name == "animal_type_id") {
  //     let v = animal_types.find((s: any) => s.id == e.target.value);
  //     setAnimal((animal) => ({
  //       ...animal,
  //       animal: v.name,
  //     }));
  //   }
  // };

  const saveAnimal = (cmd: string, animal_type_id?: any) => {
    let newAnimal;
    if (cmd == "add") {
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
    if (e.target.name == "house_type_id") {
      let v = house_types.find((s: any) => s.id == e.target.value);
      setHouse((house) => ({
        ...house,
        house_type: v.name,
      }));
    }
  };

  const handleDisasterChange = (e: any) => {
    setDisaster((disaster) => ({
      ...disaster,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name == "disaster_type_id") {
      let v = disaster_types.find((s: any) => s.id == e.target.value);
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
    if (e.target.name == "land_type_id") {
      let v = land_types.find((s: any) => s.id == e.target.value);
      setLand((land) => ({
        ...land,
        land_type: v.name,
      }));
    }
  };

    const saveHouse = (cmd: string, index?: any) => {
    let newHouse;
    newHouse = household.houses ?? [];
    if (cmd == "add") {
      if (house.house_type_id == "" || house.house_qty == "" || house.location == "" ) {
        alert("घरको स्थान, प्रकार र संख्या छान्नुहोस्।");
        return;
      }
      newHouse.push(house);     
    } else {
      newHouse.splice(index, 1);
    }
    handleArrayChangeInHousehold("houses", newHouse);
    setHouse({ ...initialHouse });
  };

  const saveDisaster = (cmd: string, index?: any) => {
    let newDisaster;
    newDisaster = household.disasters ?? [];
    if (cmd == "add") {
      if (disaster.disaster_type == "" || disaster.disaster_location == "" || disaster.disaster_priority == "" ) {
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



  const saveLand = (cmd: string, index?: any) => {
    let newLand;
    newLand = household.lands ?? [];
    if (cmd == "add") {
      if (land.location == "" || land.land_type_id == "" || land.total_area == "" || land.area_unit == "" ) {
        alert("जग्गाको स्थान, प्रकार, क्षेत्रफल र इकाई छान्नुहोस्।");
        return;
      }
      newLand.push(land);
    } else {
      newLand.splice(index, 1);
    }
    handleArrayChangeInHousehold("lands", newLand);
    setLand({ ...initialLand });
  };

  // const handleIEChange = (e: any) => {
  //   setIncomeExpense((income_expense) => ({
  //     ...income_expense,
  //     [e.target.name]: e.target.value,
  //   }));
  //   if (e.target.name == "income_source_id") {
  //     let v = income_sources.find((s: any) => s.id == e.target.value);
  //     setIncomeExpense((income_expense) => ({
  //       ...income_expense,
  //       source: v.name,
  //       source_id: v.id,
  //       type: "1",
  //     }));
  //   }
  //   if (e.target.name == "expense_source_id") {
  //     let v = expense_sources.find((s: any) => s.id == e.target.value);
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
      

  //   if (cmd == "add") {
  //     if (income_expense.source_id == "" &&  (income_expense.income_amount == "" || income_expense.expense_amount == "") ) {
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

        <label className="label" id={"has_foreign_member"}>
          C1. परिवारमा कोई बिदेशमा बसेको वा गएको छ?
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

        {household.has_foreign_member == "1" && (
          <div className="child-section">
            {household.foreign_members &&
              household.foreign_members.map((ts: any, ts_key: any) => (
                <button
                  className="btn btn-outline-primary btn-sm btn-block"
                  key={ts_key}
                  onClick={() => saveForeignMember("remove", ts.member_name)}
                >
                  {ts.member_name} - {ts.country}
                </button>
              ))}
            <br />
            <div className="options-horizontal">
              <select
                className="form-control"
                value={foreignMember.member_name}
                name="member_name"
                onChange={handleForeignMemberChange}
              >
                <option value={""} key={"परिवारमा कोई बिदेशमा-1"}>
                  ---- सदस्य -----
                </option>
                {hh &&
                  hh.members &&
                  hh.members.map((option: any, key: any) => (
                    <option value={option.first_name} key={"option.name" + key}>
                      {option.first_name} {option.last_name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="options-horizontal">
              <select
                className="form-control"
                value={foreignMember.country_samuha_id}
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
                value={foreignMember.country_id}
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
                value={foreignMember.reason_id}
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

            <label className="form-control" id={"in_abroad"}>
                    हाल विदेशमा नै हो?
            </label>
                               
                  
            <select
            className="form-control"
            name="in_abroad"
            key={"हाल विदेशमा नै हो"}
            value={foreignMember.in_abroad}
            onChange={handleForeignMemberChange}
          >
            <option value={"1"}>हो</option>
            <option value={"0"}>होईन</option>
          </select>
            </div>


            <div className="options-horizontal">
              <input
               type="number"
                className="form-control"
                value={foreignMember.total_abroad_age}
                name="total_abroad_age"
                onChange={handleForeignMemberChange}
                placeholder="विदेशमा बिताएको बर्ष"
              />
     
            </div>
          
            <button
              onClick={() => saveForeignMember("add")}
              className="btn btn-sm btn-success"
            >
              थप
            </button>
          </div>
        )}
  {/* <div  
              className={`form-group member-form-four`}
              id={"health5"}
              key={"member-health-2-"}
            > */}   


              <label className="label" id={"has_technical_training-" }>
                C2. प्राविधिक सिप छ?{" "}
              </label>
              <div className="options-vertical">
                <select
                  className="form-control"
                  name="has_technical_training"
                  key={"प्राविधिक सिप छ?"}
                  value={household.has_technical_training ?? "0"}
                  onChange={(e) =>handleChange(e)                  }
                >
                  <option value={"0"}>छैन</option>
                  <option value={"1"}>छ</option>
                </select>
              </div>

              {household.has_technical_training == "1" && (
                <div className="child-section">
                  
                  {household.technical_skills_members &&
              household.technical_skills_members.map((ts: any, ts_key: any) => (
                <button
                  className="btn btn-outline-primary btn-sm btn-block"
                  key={ts_key}
                  onClick={() => saveTechSkill("remove", ts.member_name)}
                >
                 {ts.member_name} - {ts.skill_name}
                </button>
              ))}
            <br />
            <div className="options-horizontal">
              <select
                className="form-control"
                value={techSkillMember.member_name}
                name="member_name"
                onChange={handleTechSkillChange}
              >
                <option value={""} key={"प्राविधिक सिप सदस्य"}>
                  ---- सदस्य -----
                </option>
                {hh &&
                  hh.members &&
                  hh.members.map((option: any, key: any) => (
                    <option value={option.first_name} key={"option.name" + key}>
                      {option.first_name} {option.last_name}
                    </option>
                  ))}
              </select>
            </div>

                  <label className="label" id={"skill_id-" + household}>
                    a. सिपको नामः:{" "}
                  </label>
                  <div className="options-vertical">
                    <select
                      className="form-control"
                      name="skill_id"
                      key={"सिपको नामः:" }
                      value={techSkillMember.skill_id ?? "0"}
                      onChange={handleTechSkillChange}
                    >
                      <option value={""}>----------</option>
                      {technical_skills.map((dt: any, keydt: any) => (
                        <option
                          value={dt.id}
                          key={keydt + "नामः skills_name"}
                        >
                          {dt.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <label
                    className="label"
                    id={"treatment_condition-"}
                  >
                    b. सिप हासिलः{" "}
                  </label>
                  <div className="options-vertical">
                    <select
                      className="form-control"
                      name="source"
                      key={"सिप हासिलः" }
                      value={techSkillMember.source ?? "0"}
                      onChange={handleTechSkillChange}
                    >
                    <option
                        value={""}
                        key={"29.0 सिप हासिलःoption-1"}
                      >
                        ------ सिप हासिल ------
                      </option>
                      <option
                        value={"0"}
                        key={"29.1 सिप हासिलःoption1"}
                      >
                        स्वज्ञान
                      </option>
                      <option
                        value={"1"}
                        key={"29.1 सिप हासिलःoption2" }
                      >
                        तालिम
                      </option>
                    </select>
                  </div>
                  
                  {techSkillMember.source == "1" && (
                    <>
                      <label className="label">
                        c. तालिम लिएको भए तालिमको अविधिः महिनामा{" "}
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="duration"
                        key={
                          "तालिम लिएको भए तालिमको अविधिः महिनामा" 
                        }
                        // value={}
                        onChange={handleTechSkillChange}
                        placeholder="Ex: 3"
                      />
                    </>
                  )}
                  <button
              onClick={() => saveTechSkill("add")}
              className="btn btn-sm btn-success"
            >
              थप
            </button>
                </div>
              )}


<label className="label" id={"has_chronic_disease-" }>
                C3. दिर्घरोग छ?{" "}
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

              {household.has_chronic_disease == "1" && (
                <div className="child-section">
                  
                  {household.chronic_disease_members &&
              household.chronic_disease_members.map((ts: any, ts_key: any) => (
                <button
                  className="btn btn-outline-primary btn-sm btn-block"
                  key={ts_key}
                  onClick={() => saveChronicDiseaseMember("remove", ts.member_name)}
                >
                  {ts.member_name} - {ts.disease_name}- {ts.treatment_condition}
                </button>
              ))}
            <br />
            <div className="options-horizontal">
              <select
                className="form-control"
                value={chronicDiseaseMember.member_name}
                name="member_name"
                onChange={handleChronicDiseaseMemberChange}
              >
                <option value={""} key={"परिवारमा कोई बिदेशमा-1"}>
                  ---- सदस्य -----
                </option>
                {hh &&
                  hh.members &&
                  hh.members.map((option: any, key: any) => (
                    <option value={option.first_name} key={"option.name" + key}>
                      {option.first_name} {option.last_name}
                    </option>
                  ))}
              </select>
            </div>

                  <label className="label" id={"disease_name-" + household}>
                    a. रोगको नाम:{" "}
                  </label>
                  <div className="options-vertical">
                    <select
                      className="form-control"
                      name="disease_name"
                      key={"रोगको नाम:" }
                      value={chronicDiseaseMember.disease_name ?? "0"}
                      onChange={handleChronicDiseaseMemberChange}
                    >
                      <option value={""}>----------</option>
                      {disease_names.map((dt: any, keydt: any) => (
                        <option
                          value={dt.id}
                          key={keydt + "disability_type_id disease_name"}
                        >
                          {dt.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <label
                    className="label"
                    id={"treatment_condition-"}
                  >
                    b. उपचारको अवस्थाः{" "}
                  </label>
                  <div className="options-vertical">
                    <select
                      className="form-control"
                      name="treatment_condition"
                      key={"उपचारको अवस्थाः" }
                      value={chronicDiseaseMember.treatment_condition ?? "0"}
                      onChange={handleChronicDiseaseMemberChange}
                    >
                      <option value={""}>----------</option>
                      <option value={"औषधी गरिरहेको"}>औषधी गरिरहेको</option>
                      <option value={"नगरेको"}>नगरेको</option>
                      <option value={"छाडेको"}>छाडेको</option>
                    </select>
                  </div>

                  <button
              onClick={() => saveChronicDiseaseMember("add")}
              className="btn btn-sm btn-success"
            >
              थप
            </button>
                </div>
              )}



<label className="label" id={"has_disability-" }>
               C4. अपाङ्ता छ?
              </label>
              <div className="options-vertical">
                <select
                  className="form-control"
                  name="has_disability"
                  key={"अपाङ्ता छ?"}
                  value={household.has_disability ?? "0"}
                  onChange={(e) =>
                    handleChange(e)
                  }
                >
                  <option value={"0"}>छैन</option>
                  <option value={"1"}>छ</option>
                </select>
              </div> 

             {household.has_disability == "1" && (
                <div className="child-section">

        {household.disability_members &&
              household.disability_members.map((ts: any, ts_key: any) => (
                <button
                  className="btn btn-outline-primary btn-sm btn-block"
                  key={ts_key}
                  onClick={() => saveDisabilityMember("remove", ts.member_name)}
                >
                  {ts.member_name} - {ts.disability_type} 
                </button>
              ))}
            <br />
            <div className="options-horizontal">
              <select
                className="form-control"
                value={disabilityMember.member_name}
                name="member_name"
                onChange={handleDisabilityMemberChange}
              >
                <option value={""} key={"परिवारमा कोई बिदेशमा-1"}>
                  ---- सदस्य -----
                </option>
                {hh &&
                  hh.members &&
                  hh.members.map((option: any, key: any) => (
                    <option value={option.first_name} key={"option.name" + key}>
                      {option.first_name} {option.last_name}
                    </option>
                  ))}
              </select>
            </div>
                         <label
                    className="label"
                    id={"disability_type" }
                  >
                    a. अपाङ्गताको प्रकार:{" "}
                  </label>
                  <div className="options-vertical">
                    <select
                      className="form-control"
                      name="disability_type"
                      key={"अपाङ्गताको प्रकार:" }
                      value={disabilityMember.disability_type?? ""}
                      onChange={handleDisabilityMemberChange}
                    >
                      <option
                        value={""}
                        key={"disability_type_id"}
                      >
                        ----------
                      </option>
                      {disability_types.map((dt: any, keydt: any) => (
                        <option
                          value={dt.id}
                          key={keydt + "disability_type_id कार्डः"}
                        >
                          {dt.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <label
                    className="label"
                    id={"disability_card_id-" }
                  >
                    c. अपाङ्गताको कार्डः{" "}
                  </label>
                  <div className="options-vertical">
                    <select
                      className="form-control"
                      name="disability_card"
                      key={"अपाङ्गताको कार्डः" }
                      value={disabilityMember.disability_card ?? "0"}
                      onChange = {handleDisabilityMemberChange}
                    
                    >
                      <option value={""}>----------</option>
                      {disability_card_types.map((dt: any, keydt: any) => (
                        <option value={dt.id} key={keydt + "अपाङ्गताको कार्डः"}>
                          {dt.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
              onClick={() => saveDisabilityMember("add")}
              className="btn btn-sm btn-success"
            >
              थप
            </button>
          </div>
        )}
              

        <label className="label" id={"has_missing_deceased_member"}>
         C5. परिवारमा कोही बेपत्ता/मृत्यु(६० वर्ष मुनि)/दुर्घटना/आत्महत्या/हत्या भएको छ?
        </label>
        <div className="options-horizontal">
          <select
            className="form-control"
            name="has_missing_deceased_member"
            key={
              "परिवारमा कोही बेपत्ता/मृत्यु/दुर्घटना/आत्महत्या/हत्या भएको छ? 68 बर्षमुनी"
            }
            value={household.has_missing_deceased_member == "1" ? "1" : ""}
            onChange={(e) => handleChange(e)}
          >
            <option value={"0"}>छैन</option>
            <option value={"1"}>छ</option>
          </select>
        </div>

        {household.has_missing_deceased_member == "1" && (
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
                value={missingMember.reason_id}
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
                value={missingMember.gender}
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
          </div>
        )}

<label className="label" id={"has_vehicle-"}>
                C6. सवारी साधन ?{" "}
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

              {household.has_vehicle == "1" && (
                <div className="child-section">
                  {household.vehicles &&
                  household.vehicles.map((v: any, ts_key: any) => (
                    <button
                      className="btn btn-outline-success btn-block"
                      key={"vehicles" + ts_key}
                      onClick={() =>
                        saveVehicle("remove", v.vehicle_type_name)
                      }
                    >
                      {v.vehicle_type_name} - {v.count}
                    </button>
                  ))}
                  <br />
                  <label className="label" id={"vehicle_type_id-"}>
                    a. सवारी साधनको नामः{" "}
                  </label>
                  <div className="options-vertical">
                    <select
                      className="form-control"
                      key={"28.1 सवारी साधनको नामः" }
                      name="vehicle_type_id"
                      value={vehicle.vehicle_type_id}
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
                      b. कति?{" "}
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
                    <button
                      onClick={() => saveVehicle("add")}
                      className="btn btn-sm btn-success"
                    >
                      थप
                    </button>
                  </div>
                </div>
              )}


        <label className="label" id={"has_pregchild_health"}>
        C7. परिवारमा कोई गर्भवती/ सुत्केरी/ मातृ मृत्युदर/ बाल मृत्युदर छ?
</label>
          <div className="options-horizontal">
          <select
className="form-control"
name="has_pregchild_health"
key={"परिवारमा कोई गर्भवती/ सुत्केरी/ मातृ मृत्युदर/ बाल मृत्युदर छ"}
value={household.has_pregchild_health}
onChange={(e) => handleChange(e)}
>
<option value={"0"}>छैन</option>
<option value={"1"}>छ</option>
</select>            
</div>  

<div className="child-section">

            {household.has_pregchild_health == "1" && (
          <>
            <label className="label" id={"has_pregnant_member"}>
          C7.1 गर्भवर्ती परिवारमा छ/ छैन?
        </label>
        <div className="options-horizontal">
          <select
            className="form-control"
            name="has_pregnant_member"
            key={"गर्भवर्ती परिवारमा छ/ छैन?"}
            value={household.has_pregnant_member == "1" ? "1" : "0"}
            onChange={(e) => handleChange(e)}
          >
            <option value={"0"}>छैन</option>
            <option value={"1"}>छ</option>
          </select>
        </div>
        {household.has_pregnant_member == "1" && (
          <>
            <label className="label" id={"has_pregnancy_test"}>
              a. गर्भ जाच गराएको/ नगराएको?
            </label>
            <div className="options-horizontal">
              <select
                className="form-control"
                name="has_pregnancy_test"
                key={"गर्भ जाच गराएको/ नगराएको?"}
                value={household.has_pregnancy_test == "1" ? "1" : "0"}
                onChange={(e) => handleChange(e)}
              >
                <option value={"0"}>नगराएको</option>
                <option value={"1"}>गराएको</option>
              </select>
            </div>
            {household.has_pregnancy_test == "1" && (
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
          C7.2 परीवारमा ६ महिनाभित्रको सुत्केरी छ/ छैन?
        </label>
        <div className="options-horizontal">
          <select
            className="form-control"
            name="has_maternity_member"
            key={"परीवारमा  ६ महिनाभित्रको सुत्केरी छ/ छैन?"}
            value={household.has_maternity_member == "1" ? "1" : "0"}
            onChange={(e) => handleChange(e)}
          >
            <option value={"0"}>छैन</option>
            <option value={"1"}>छ</option>
          </select>
        </div>

        {household.has_maternity_member == "1" && (
          <>
            <label className="label" id={"maternity_location"}>
              a. कहाँ सुत्केरी भएको?
            </label>
            <div className="options-horizontal">
              <select
                className="form-control"
                name="maternity_location"
                key={"कहाँ सुत्केरी भएको?"}
                value={household.maternity_location}
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
                value={household.has_maternity_test == "1" ? "1" : "0"}
                onChange={(e) => handleChange(e)}
              >
                <option value={"0"}>नगराएको</option>
                <option value={"1"}>गराएको</option>
              </select>
            </div>
          </>
        )}

        <label className="label" id={"has_maternity_death"}>
          C7.3. मातृ मृत्यु भएको छ/ छैन?
        </label>
        <div className="options-horizontal">
          <select
            className="form-control"
            name="has_maternity_death"
            key={"मातृ मृत्यु भएको छ/ छैन?"}
            value={household.has_maternity_death == "1" ? "1" : "0"}
            onChange={(e) => handleChange(e)}
          >
            <option value={"0"}>छैन</option>
            <option value={"1"}>छ</option>
          </select>
        </div>
        {household.has_maternity_death == "1" && (
          <>
            <label className="label" id={"maternity_death_condition"}>
              a. गर्भाअवस्था/ ४५ दिनभितत्रको सुत्केरी?
            </label>
            <div className="options-horizontal">
              <select
                className="form-control"
                name="maternity_death_condition"
                key={"गर्भाअवस्था/ ४५ दिनभितत्रको सुत्केरी?"}
                value={
                  household.maternity_death_condition
                    ? household.maternity_death_condition
                    : "गर्भाअवस्था"
                }
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
          C7.4. नवशिशु / शिशु/ बाल मृत्यु भएको छ?
        </label>
        <div className="options-horizontal">
          <select
            className="form-control"
            name="child_death"
            key={"नवशिशु / शिशु/ बाल मृत्यु भएको छ?"}
            value={household.child_death == "1" ? "1" : "0"}
            onChange={(e) => handleChange(e)}
          >
            <option value={"0"}>छैन</option>
            <option value={"1"}>छ</option>
          </select>
        </div>
        {household.child_death == "1" && (
          <>
            <label className="label" id={"child_death_condition"}>
              a. नवशिशु / शिशु/ बाल मृत्यु
            </label>
            <div className="options-horizontal">
              <select
                className="form-control"
                name="child_death_condition"
                key={"नवशिशु / शिशु/ बाल मृत्यु भएको छ?"}
                value={
                  household.child_death_condition
                    ? household.child_death_condition
                    : "नवशिशु"
                }
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


        <label className="label" id={"total_house_count"}>
          {/* 58. घर सम्बन्धी{" "} */}
        </label>
        <label className="label" id={"total_house_count"}>
         C8. कुल घरको संख्या?
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


        <div className="options-horizontal">
          <div className="child-section">
            {household.houses &&
              household.houses.map((an: any, an_key: any) => (
                <button
                  className="btn btn-outline-info btn-sm btn-block"
                  key={an_key}
                  onClick={() => saveHouse("remove", an_key)}
                >{an.location} - {an.house_type} - {an.house_qty}
               </button>
              ))}
            <br />
            <label className="label" id={"location"}>
              a. घरको स्थान
            </label>

            <div className="options-horizontal">
              <select
                className="form-control"
                value={house.location}
                name="location"
                onChange={handleHouseChange}
              >
                <option value={""} key={"घरको स्थान"}>
                  ---- स्थान -----
                </option>

                <option value={"गाउँपालिका"}>गाउँपालिका</option>
                <option value={"जिल्ला"}>जिल्ला</option>
                <option value={"काठमान्डौ उपत्यका"}>काठमान्डौ उपत्यका, बनेपा, धुलीखेल </option>
                <option value={"बागमती प्रदेस"}>बागमती प्रदेस </option>
                <option value={"अन्य प्रदेस"}>अन्य प्रदेस </option>
                <option value={"बिदेश"}>बिदेश</option>
              </select>
            </div>
            {/* {land.location == "गाउँपालिका" && (
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

            <label className="label" id={"house_type_id"}>
              b. घरको प्रकार
            </label>
            <div className="options-verticle">
              <select
                className="form-control"
                value={house.house_type_id}
                name="house_type_id"
                onChange={handleHouseChange}
              >
                <option value={""} key={"घरको प्रकारः"}>
                  ---- घरको प्रकार -----
                </option>
                {house_types.map((option, key) => (
                  <option value={option.id} key={"घरको प्रकारः" + key}>
                    {option.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                className="form-control"
                value={house.house_qty?? ""}
                name="house_qty"
                onChange={handleHouseChange}
                placeholder="घरको संख्या"
              />

            </div>

                       <button
              onClick={() => saveHouse("add")}
              className="btn btn-sm btn-success" >
              थप
            </button>
          </div>
        </div>

        <label className="label" id={"agriculture_situation"}>
          C9.  खेतीपातीको अवस्था ?
        </label>
        <div className="options-horizontal">
          <select
            className="form-control"
            name="agriculture_situation"
            key={"खेतीपातीको अवस्था?"}
            value={household.agriculture_situation}
            onChange={(e) => handleChange(e)}
          >
             <option value={""} key={"खेतीपातीको अवस्था"}>
                  ---- खेतीपातीको अवस्था -----
                </option>
            <option value={"0"}>खेतीपाती आफैले गरेको</option> 
            <option value={"1"}>खेतीपाती अरुले गरेको</option> 
            <option value={"2"}>खेतीपाती नगरेको (बाझो)</option>
            <option value={"3"}>खेतीयोग्य जमिन नै नभएको</option>

          </select>
        </div>

        <label className="label" id={"total_area"}>
         C10. जग्गा सम्बन्धी{" "}
        </label>


        <div className="options-horizontal">
          <div className="child-section">
            {household.lands &&
              household.lands.map((an: any, an_key: any) => (
                <button
                  className="btn btn-outline-info btn-sm btn-block"
                  key={an_key}
                  onClick={() => saveLand("remove", an_key)}
                >
                  {an.location} - {an.total_area} {an.area_unit}
                </button>
              ))}
            <br />
            <label className="label" id={"location"}>
              a. जग्गाको स्थान
            </label>

            <div className="options-horizontal">
              <select
                className="form-control"
                value={land.location}
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
                value={land.land_type_id}
                name="land_type_id"
                onChange={handleLandChange}
              >
                <option value={""} key={"जग्गाको प्रकारः"}>
                  ---- जग्गाको प्रकार -----
                </option>
                {land_types.map((option, key) => (
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
                value={land.area_unit}
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
           
            <label className="label" id={"irrigation"}>
              d. सिचाई सुविधा
            </label>
            <div className="options-horizontal">
              <div className="radio" key={"irrigation"}>
                <label>
                  <input
                    type="radio"
                    value={"1"}
                    name="irrigation"
                    checked={land.irrigation == "1"}
                    onChange={handleLandChange}
                  />
                  छ
                </label>
              </div>
              <div className="radio" key={"irrigation2"}>
                <label>
                  <input
                    type="radio"
                    value={"0"}
                    name="irrigation"
                    checked={land.irrigation == "0"}
                    onChange={handleLandChange}
                  />
                  छैन
                </label>
              </div>
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
              onClick={() => saveLand("add")}
              className="btn btn-sm btn-success"
            >
              थप
            </button>
          </div>
        </div>
        <label className="label" id={"has_natural_disaster"}>
          C11.  प्राकृतिक प्रकोपको जोखिम छ  ?
        </label>
        <div className="options-horizontal">
          <select
            className="form-control"
            name="has_natural_disaster"
            key={"प्राकृतिक प्रकोपको जोखिम छ?"}
            value={household.has_natural_disaster}
            onChange={(e) => handleChange(e)}
          >
            <option value={"0"}>छैन</option>
            <option value={"1"}>छ</option>
          </select>
        </div>
            <br />

            {household.has_natural_disaster == "1" && (

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
                value={disaster.disaster_type}
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
                value={disaster.disaster_location}
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
                value={disaster.disaster_priority}
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


        
              <label className="label" id={"income_expense"}>
             C12. वार्षिक आय/ व्ययको विवरण (रु. हजारमा)
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

        <label className="label" id={"light_fuels"}>
         C13. मुख्य ३ वटा सम्म परिवारको आयको स्रोत छान्नुहोस। प्राथमिकता अनुसार ?
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

        <label className="label" id={"light_fuels"}>
          C14. मुख्य ३ वटा सम्म परिवारको खर्च स्रोत छान्नुहोस। प्राथमिकता अनुसार
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

      
      
        <h5> स्रोतहरु </h5>
        <label className="label" id={"water_source_id"}>
          C15. खानेपानीको मुख्य श्रोत
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
        {(household.water_source_id == "1" ||
          household.water_source_id == "2") && (
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
            {            household.water_source_location == "साझा" &&
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
{(household.water_source_id != "1" &&
          household.water_source_id != "2") && (
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
        <label className="label" id={"cooking_fuels"}>
         C16. खाना पकाउन
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

        
        <label className="label" id={"nearest_road_distance_minute"}>
          C17. सडक सम्मको दुरी ? (मिनेटमा)
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
       
        <label className="label" id={"nearest_hospital_distance"}>
         C18. स्वास्थ्य संस्था सम्म लाग्ने दुरी? (मिनेट)
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
        <label className="label" id={"primary_distance"}>
          C19. विद्यालय सम्म लाग्ने समय (मिनेटमा)
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
      
        <br/>
            <h5> बित्तिय विवरण </h5>

            <label className="label" id={"has_health_insurance-"}>
                C20. स्वास्थ्य बिमा/ जीवन बिमा गर्नेको परिवारमा संख्या ?{" "}
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
             
              <label className="label" id={"has_bank_account-" }>
               C21.  सहकारी/बैङ्कमा खाता हुने सदस्यको संख्या
              </label>
              <div className="options-horizontal">
              <input
                  className="form-control"
                  type="number"
                  name="has_cooperative_account"
                  key={"सहकारीमा सदस्य हुनुहुन्छ?" }
                  value={household.has_cooperative_account ?? ""}
                  onChange={handleChange}
                  placeholder="सहकारी खाता"
               />
                <input
                  type="number"
                  className="form-control"
                  name="has_bank_account"
                  key={"बैंकमा खाता छ?" }
                  value={household.has_bank_account ?? ""}
                  onChange={handleChange}
                  placeholder="बैङ्क खाता"
                />
                                
              
                  
              </div> 


              <label className="label" id={"has_bank_account-" }>
                C22.स्मार्टफोन/ अनौपचारिक शिक्षा सदस्यको संख्या
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

              <label className="label"
                id={"recommendation_for_local_level-"  }>             
               C23. गाउँपालिकाले तिब्र विकासको लागि कुन क्षेत्रमा बढी ध्यान
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

              <label className="label" id={"feelings_for_local_government"}>
              C24. अहिलेको स्थानिय सरकारको काम कस्तो लागेको छ?
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


              <label className="label" id={"complaint"}>
              C25. केही गुनासो भएमा?
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


        <label className="label" id={"is_responder_member"}>
          C26. उत्तरदाता घरपरिवारकै सदस्य हो ?
        </label>
        <div className="options-horizontal">
          <select
            className="form-control"
            name="is_responder_member"
            key={"उत्तरदाता घरपरिवारकै सदस्य हो?"}
            value={household.is_responder_member}
            onChange={(e) => handleChange(e)}
          >
            <option value={"1"}>हो </option>
            <option value={"0"}>होईन</option>
          </select>
        </div>
            <br />
            {household.is_responder_member == "1" && (
              <div className="child-section">
                <label className="label" id={"responder_name"}>
              a. उत्तरदाताको सदस्यको नाम
            </label>
            <div className="options-horizontal">
              <select
                className="form-control"
                value={household.responder_member}
                name="responder_member_name" 
                 onChange={handleChange}
              >
                <option value={""} key={"responder_member_name"}>
                  ---- सदस्य -----
                </option>
                {hh &&
                  hh.members &&
                  hh.members.map((option: any, key: any) => (
                    <option value={option.first_name} key={"option.name" + key}>
                      {option.first_name} {option.last_name}
                    </option>
                  ))}
              </select>
            </div>
            </div>
)}

            {household.is_responder_member == "0" && (
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
