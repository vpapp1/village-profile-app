import React, { useEffect, useState } from "react";
import {
  developmentOption,
  disability_card_types,
  disability_types,
  death_reasons,
  disease_names,
  education_faculties,
  education_leave_reasons,
  education_levels,
  education_statuses,
  gender_choice,
  marital_statuses,
  relations,
  socialNetworks,
  vehicle_types,
  yes_nos,
} from "../../../enums";
import Multiselect from "multiselect-react-dropdown";
import InputComponent from "./FormComponent/InputComponent";
import SelectComponent from "./FormComponent/SelectComponent";


export default function PariwarKoBibaran(props: any) {
  let {
    household,
    occupations,
    education_stages,
    profession_categories,
    professions,
    technical_skills,
    errors,
  } = props;
  let { handleMemberChange, handleAddMember, handleRemoveMemberRequest } = props;
  const [age, setAge] = useState<number | undefined>();
  const [removeMemberIndex, setRemoveMemberIndex] = useState("");
  const [removeType, setRemoveType] = useState("other");
  const [deathDate, setDeathDate] = useState("");
  const [deathReasonId, setDeathReasonId] = useState("");
  const [deathRemarks, setDeathRemarks] = useState("");
  const [otherReason, setOtherReason] = useState("migration");
  const [showRemoveForm, setShowRemoveForm] = useState(false);
  const [professionsByCategory, setProfessionsByCategory] = useState<Record<string, any[]>>({});
  const otherRemovalReasons = [
    { id: "migration", name: "Migration" },
    { id: "marriage", name: "Marriage" },
    { id: "divorce", name: "Divorce" },
    { id: "other", name: "Other" },
  ];
  const enrollTypes = [
    { id: "जन्म", name: "जन्म" },
    { id: "विवाह-बाहिर", name: "विवाह भई आएको (पालिका बाहिरबाट)" },
    { id: "सम्बन्ध-विच्छेद-बाहिर", name: "सम्बन्ध-विच्छेद भई आएको (पालिका बाहिरबाट)" },
    { id: "अस्थायी-बाहिर", name: "अस्थायी (पालिका-बाहिरबाट)" },
    { id: "अन्य", name: "अन्य" },
  ];
  const professionTypes = [
    { id: "0", name: "गैरसरकारी" },
    { id: "1", name: "सरकारी" },
    { id: "2", name: "वैदेशिक" },
  ];

      



  const getAge = (memberKey: string, newAge: string) => {
    let dateAd = new Date().getFullYear();
    let dateBs = 2079;
    let newYear = newAge.split("-");
    setAge(undefined);
    if (newYear.length > 0) {
      if (newYear[0].length === 4) {
        setAge(dateBs - parseInt(newYear[0]));
      }
    }
    handleMemberChange(memberKey, "dob_bs", newAge);

    
  };

  const isOccupationForProfession = (mainOccupationId: any) => {
    const id = parseInt(`${mainOccupationId ?? ""}`, 10);
    return !Number.isNaN(id) && id > 0 && id <= 6;
  };

  const shouldShowFaculty = (educationStageId: any) => {
    return ["7", "8", "9", "10", "11"].includes(`${educationStageId ?? ""}`);
  };

  useEffect(() => {
    const grouped: Record<string, any[]> = {};
    (professions ?? []).forEach((item: any) => {
      const key = `${item.category_id ?? ""}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });
    setProfessionsByCategory(grouped);
  }, [professions]);



  

  return (
    <>
      <div className="form-group" style={{ minHeight: "auto", padding: "10px 5%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
          <h5 style={{ margin: 0 }}>B. सदस्यको विवरण</h5>
          <div style={{ display: "flex", gap: "8px" }}>
            <button type="button" className="btn btn-primary btn-sm" onClick={handleAddMember}>
              Add New Member
            </button>
            <button
              type="button"
              className={`btn btn-sm ${showRemoveForm ? "btn-secondary" : "btn-danger"}`}
              onClick={() => setShowRemoveForm(!showRemoveForm)}
            >
              {showRemoveForm ? "Cancel Remove" : "Remove Member"}
            </button>
          </div>
        </div>
        {showRemoveForm && <div style={{ marginTop: "10px", display: "grid", gap: "8px" }}>
          <select
            className="form-control"
            value={removeMemberIndex}
            onChange={(e) => setRemoveMemberIndex(e.target.value)}
          >
            <option value="">Select member to remove</option>
            {household.members &&
              household.members.map((m: any, idx: number) => (
                <option key={`remove-member-${idx}`} value={`${idx}`}>
                  {m.first_name} {m.last_name}
                </option>
              ))}
          </select>
          <select
            className="form-control"
            value={removeType}
            onChange={(e) => setRemoveType(e.target.value)}
          >
            <option value="other">Migration / Marriage / Divorce / Other</option>
            <option value="death">Death</option>
          </select>
          {removeType === "death" && (
            <>
              <input
                className="form-control"
                type="text"
                value={deathDate}
                placeholder="Date of death (BS), ex: 2082-01-15"
                onChange={(e) => setDeathDate(e.target.value)}
              />
              <select
                className="form-control"
                value={deathReasonId}
                onChange={(e) => setDeathReasonId(e.target.value)}
              >
                <option value="">Select cause of death</option>
                {death_reasons.map((d) => (
                  <option key={`death-reason-${d.id}`} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <input
                className="form-control"
                type="text"
                value={deathRemarks}
                placeholder="Remarks"
                onChange={(e) => setDeathRemarks(e.target.value)}
              />
            </>
          )}
          {removeType === "other" && (
            <select
              className="form-control"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
            >
              {otherRemovalReasons.map((o) => (
                <option key={`other-reason-${o.id}`} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => {
              if (removeMemberIndex === "") {
                alert("Please select member first.");
                return;
              }
              const idx = parseInt(removeMemberIndex);
              if (removeType === "death") {
                if (!deathDate || !deathReasonId) {
                  alert("Please fill death date and cause.");
                  return;
                }
                const reasonName =
                  death_reasons.find((x) => `${x.id}` === `${deathReasonId}`)?.name ?? "";
                handleRemoveMemberRequest(idx, {
                  type: "death",
                  date_of_death_bs: deathDate,
                  reason_id: deathReasonId,
                  reason_name: reasonName,
                  remarks: deathRemarks,
                });
                setDeathDate("");
                setDeathReasonId("");
                setDeathRemarks("");
              } else {
                handleRemoveMemberRequest(idx, { type: "other", reason: otherReason });
              }
              setRemoveMemberIndex("");
              setShowRemoveForm(false);
            }}
          >
            Remove Member
          </button>
        </div>}
      </div>
      {household.members &&
        household.members.map((member: any, memberKey: any) => (
            <div
              className={`form-group ${memberKey % 2 == 0 ? "member-form-one" : "member-form-two"}`}
              key={"member-form-" + memberKey}
            >
           
                                
                <h5> B.  सदस्यको विवरण</h5>
              <h5> Member: {memberKey + 1} *</h5>

      
               
               
               
             

<InputComponent
                name={"first_name"}
                label={"B1. सदस्यको नाम:*"}
                wrapperClass={"options-verical"}
                handleChange={(e: any) =>
                  handleMemberChange(memberKey, "first_name", e.target.value)
                }
                
                defaultValue={member.first_name}
                palceholder={"नाम"}
                type={"text"}
                id={"first_name-" + memberKey}
                errors={errors}
              />
<InputComponent
                name={"last_name"}
                label={"B2. सदस्यको थर:*"}
                wrapperClass={"options-verical"}
                handleChange={(e: any) =>
                  handleMemberChange(memberKey, "last_name", e.target.value)
                }
                defaultValue={member.last_name}
                palceholder={"थर"}
                type={"text"}
                id={"last_name-" + memberKey}
                errors={errors}
              />

              

            
              <SelectComponent
                options={gender_choice}
                wrapperClass="options-verical"
                label={"B3. सदस्यको लिंग *"}
                name="gender_id"
                handleChange={(e: any) =>
                  handleMemberChange(memberKey, "gender_id", e.target.value)
                }
                defaultValue={member.gender_id}
                id={"gender_id-" + memberKey}
                placeholder="लिंग"
                errors={errors}
              />
              <SelectComponent
                options={relations}
                wrapperClass="options-verical"
                label={"B4. घरमुलीको नाता:*"}
                name="relation_with_hoh_id"
                handleChange={(e: any) =>
                  handleMemberChange(
                    memberKey,
                    "relation_with_hoh_id",
                    e.target.value
                  )
                }
                defaultValue={member.relation_with_hoh_id}
                id={"relation_with_hoh_id-" + memberKey}
                placeholder="नाता"
                errors={errors}
              />

               
              <InputComponent
                name={"dob_bs"}
                label={`B5. जन्ममितिः * ${age ? `${age} वर्ष` : ""}`}
                wrapperClass={"options-verical"}
                handleChange={(e: any) => {
                  getAge(memberKey, e.target.value);
                }}
                defaultValue={member.dob_bs}
                palceholder={"Ex: 2065-10-24"}
                type={"text"}
                id={"dob_bs-" + memberKey}
                errors={errors}
              />  
             { age > 15 && (
  <>

              <InputComponent
                name={"mobile_num"}
                label={"B6. मोवाईल नम्बर:"}
                wrapperClass={"options-verical"}
                handleChange={(e: any) =>
                  handleMemberChange(memberKey, "mobile_num", e.target.value)
                }
                defaultValue={member.mobile_num}
                palceholder={"मोवाईल नम्बर"}
                type={"number"}
                id={"mobile_num-" + memberKey}
                errors={errors}
              />   
                </>)}





<label className="label" id={"is_married-" + memberKey}>
                B7. वैवाविक स्थितिः{" "}
              </label>
              <div className="options-vertical">
                <select
                  className="form-control"
                  name="is_married"
                  key={"वैवाविक स्थितिः" + memberKey}
                  value={member.is_married ?? ""}
                  onChange={(e) =>
                    handleMemberChange(memberKey, "is_married", e.target.value)
                  }
                >
                  <option value={""}>----- वैवाविक स्थिति ------</option>

                  <option value={"0"}>अविवाहित</option>
                  <option value={"1"}>विवाहित</option>
                </select>
              </div>
              {member.is_married == "1" && (
                <div className="child-section">
                  <label
                    className="label"
                    id={"marital_status_id-" + memberKey}
                  >
                    a. स्थिति{" "}
                  </label>
                  <div className="options-vertical">
                    <select
                      className="form-control"
                      name="marital_status_id"
                      key={"वैवाविक स्थितिः" + memberKey}
                      value={member.marital_status_id ?? ""}
                      onChange={(e) =>
                        handleMemberChange(
                          memberKey,
                          "marital_status_id",
                          e.target.value
                        )
                      }
                    >
                      {marital_statuses.map((ms, keym) => (
                        <option
                          value={ms.id}
                          key={"वैवाविक स्थितिःoption" + keym}
                        >
                          {ms.name}
                        </option>
                      ))}
                    </select>
                  </div>
                 
                  <label className="label" id={"age_on_marriage-" + memberKey}>
                    b. विबाह हुँदाको उमेर{" "}
                  </label>
                  <div className="options-vertical">
                    <input
                      type="number"
                      className="form-control"
                      name="age_on_marriage"
                      key={"विबाह हुँदाको उमेर" + memberKey}
                      value={member.age_on_marriage ?? ""}
                      onChange={(e) =>
                        handleMemberChange(
                          memberKey,
                          "age_on_marriage",
                          e.target.value
                        )
                      }
                      placeholder="Ex: 26"
                    />
                  </div>
                  <SelectComponent
                    options={(household.members ?? [])
                      .filter((_: any, idx: number) => idx !== memberKey)
                      .map((sp: any, idx: number) => ({
                        id: sp.id ?? `${idx}`,
                        name: `${sp.first_name ?? ""} ${sp.last_name ?? ""}`.trim(),
                      }))}
                    wrapperClass="options-verical"
                    label={"c. पति/पत्नी छान्नुहोस्"}
                    name="spouse_id"
                    handleChange={(e: any) =>
                      handleMemberChange(memberKey, "spouse_id", e.target.value)
                    }
                    defaultValue={member.spouse_id ?? ""}
                    id={"spouse_id-" + memberKey}
                    placeholder="पति/पत्नी"
                    errors={errors}
                  />
                  </div>



              )}

                  <label className="label" id={"resident_place-" + memberKey}>
                B8. बसोबास गर्ने ठाउः
              </label>
              <div className="options-vertical">
                <select
                  className="form-control"
                  name="resident_place"
                  key={"बसोबास गर्ने ठाउः" + memberKey}
                  value={member.resident_place ?? ""}
                  onChange={(e) =>
                    handleMemberChange(
                      memberKey,
                      "resident_place",
                      e.target.value
                    )
                  }
                >
                  <option value={""}>----- बसोबास गर्ने ठाउ ------</option>
                  <option value={"गाउँ"}>गाउँ</option>
                  <option value={"काठमान्डौ उपत्यका"}>काठमान्डौ उपत्यका</option>
                  <option value={"रामेछाप जिल्ला अन्य पालिका"}>रामेछाप जिल्ला अन्य पालिका</option>
                  <option value={"बागमती प्रदेश"}>बागमती प्रदेश</option>
                  <option value={"बिदेश"}>बिदेश</option>
                  <option value={"अन्य जिल्ला"}>अन्य जिल्ला</option>
                </select>
             
             


                                

              
            </div>

              


              <SelectComponent
                options={education_stages}
                wrapperClass="options-verical"
                label={"B9. शैक्षिक योग्यता"}
                name="education_stage_id"
                handleChange={(e: any) =>
                  handleMemberChange(
                    memberKey,
                    "education_stage_id",
                    e.target.value
                  )
                }
                defaultValue={member.education_stage_id}
                id={"education_stage_id-" + memberKey}
                placeholder="शैक्षिक योग्यता"
                errors={errors}
              />
              {shouldShowFaculty(member.education_stage_id) && (
                <div className="child-section">
                  <SelectComponent
                    options={education_faculties}
                    wrapperClass="options-verical"
                    label={"a. विषय"}
                    name="education_faculty"
                    handleChange={(e: any) =>
                      handleMemberChange(
                        memberKey,
                        "education_faculty",
                        e.target.value
                      )
                    }
                    defaultValue={member.education_faculty}
                    id={"education_faculty-" + memberKey}
                    placeholder="विषय"
                    errors={errors}
                  />
                </div>
              )}

              <SelectComponent
                options={occupations}
                wrapperClass="options-verical"
                label={"B10. मुख्य पेशा"}
                name="main_occupation_id"
                handleChange={(e: any) => {
                  const value = e.target.value;
                  handleMemberChange(memberKey, "main_occupation_id", value);
                  if (!isOccupationForProfession(value)) {
                    handleMemberChange(memberKey, "profession_type", "");
                    handleMemberChange(memberKey, "profession_category_id", "");
                    handleMemberChange(memberKey, "profession_id", "");
                  }
                }}
                defaultValue={member.main_occupation_id}
                id={"main_occupation_id-" + memberKey}
                placeholder="मुख्य पेशा"
                errors={errors}
              />
              {isOccupationForProfession(member.main_occupation_id) && (
                <>
                  <SelectComponent
                    options={professionTypes}
                    wrapperClass="options-verical"
                    label={"B11. प्रकार (रोजगारी भएमा)"}
                    name="profession_type"
                    handleChange={(e: any) =>
                      handleMemberChange(memberKey, "profession_type", e.target.value)
                    }
                    defaultValue={member.profession_type}
                    id={"profession_type-" + memberKey}
                    placeholder="प्रकार"
                    errors={errors}
                  />
                  <SelectComponent
                    options={profession_categories}
                    wrapperClass="options-verical"
                    label={"B12. पेशा समूह"}
                    name="profession_category_id"
                    handleChange={(e: any) => {
                      const categoryId = e.target.value;
                      handleMemberChange(memberKey, "profession_category_id", categoryId);
                      handleMemberChange(memberKey, "profession_id", "");
                    }}
                    defaultValue={member.profession_category_id}
                    id={"profession_category_id-" + memberKey}
                    placeholder="पेशा समूह"
                    errors={errors}
                  />
                  {(member.profession_category_id ?? "") !== "" && (
                    <SelectComponent
                      options={professionsByCategory[`${member.profession_category_id}`] ?? []}
                      wrapperClass="options-verical"
                      label={"B13. पेशा"}
                      name="profession_id"
                      handleChange={(e: any) =>
                        handleMemberChange(memberKey, "profession_id", e.target.value)
                      }
                      defaultValue={member.profession_id}
                      id={"profession_id-" + memberKey}
                      placeholder="पेशा छान्नुहोस्"
                      errors={errors}
                    />
                  )}
                </>
              )}
              <SelectComponent
                options={enrollTypes}
                wrapperClass="options-verical"
                label={"B14. दर्ता प्रकार"}
                name="enroll_type"
                handleChange={(e: any) =>
                  handleMemberChange(memberKey, "enroll_type", e.target.value)
                }
                defaultValue={member.enroll_type ?? "जन्म"}
                id={"enroll_type-" + memberKey}
                placeholder="छान्नुहोस्"
                errors={errors}
              />



<label className="label" id={"has_voter_card-" + memberKey}>
               B15. भोटर कार्ड भएको नभएको ?{" "}
              </label>
              <div className="options-vertical">
                <select
                  className="form-control"
                  name="has_voter_card"
                  key={"भोटर कार्ड भएको नभएको ?" + memberKey}
                  value={member.has_voter_card ?? "0"}
                  onChange={(e) =>
                    handleMemberChange(
                      memberKey,
                      "has_voter_card",
                      e.target.value
                    )
                  }
                >
                  <option value={"0"}>छैन</option>
                  <option value={"1"}>छ</option>
                </select>
              </div>

              {member.has_voter_card == "1" && (
                <div className="child-section">
                  <label
                    className="label"
                    id={"voter_card_location-" + memberKey}
                  >
                    a. भोटर कार्ड कुन स्थानको भएको?
                  </label>
                  <div className="options-vertical">
                    <select
                      className="form-control"
                      name="voter_card_location"
                      key={"भोटर कार्ड भएको नभएको ?" + memberKey}
                      value={member.voter_card_location ?? "0"}
                      onChange={(e) =>
                        handleMemberChange(
                          memberKey,
                          "voter_card_location",
                          e.target.value
                        )
                      }
                    >
                      <option value={"गाउँपालिका"}>गाउँपालिका</option>
                      <option value={"गाउँपालिका बाहिर (रामेछाप जिल्ला)"}>
                        गाउँपालिका बाहिर (रामेछाप जिल्ला)
                      </option>
                      <option value={"काठमान्डौ"}>काठमान्डौ</option>
                      <option value={"अन्य जिल्ला"}>अन्य जिल्ला</option>
                    </select>
                  </div>
                </div>
              )}

              

             
           
           




            </div>
        ))}
    </>
  );
}
