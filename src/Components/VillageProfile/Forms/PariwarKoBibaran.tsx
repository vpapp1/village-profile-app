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
    education_backgrounds,
    current_bs_date,
    profession_categories,
    professions,
    technical_skills,
    errors,
  } = props;
  let { handleMemberChange, handleAddMember, handleRemoveMemberRequest } = props;
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
  const mainWorkLast12MonthsOptions = [
    { id: "krishi_self", name: "खेतीपाती/पशुपालन (स्वयं रोजगारी)" },
    { id: "non_krishi_self", name: "गैरकृषि क्षेत्र (स्वयं रोजगारी)" },
    { id: "gov_salaried", name: "सरकारी/अर्धसरकारीमा तलबी" },
    { id: "private_salaried", name: "गैरसरकारी/निजी संस्थामा तलबी" },
    { id: "krishi_wage", name: "कृषि क्षेत्रमा ज्याला मजदुरी" },
    { id: "non_krishi_wage", name: "गैरकृषि क्षेत्रमा ज्याला मजदुरी" },
    { id: "pension", name: "नियमितरुपमा पेन्सन पाउने" },
    { id: "housework", name: "घरधन्दा" },
    { id: "student", name: "अध्ययन (विद्यार्थी)" },
    { id: "foreign_employment", name: "वैदेशिक रोजगार" },
    { id: "no_work", name: "कुनै काम नगरेको" },
  ];
  const employmentStatusOptions = [
    { id: "employed", name: "रोजगार (Employed)" },
    { id: "unemployed", name: "बेरोजगार (Unemployed)" },
    { id: "inactive", name: "निष्क्रिय (Economically Inactive)" },
  ];
  const educationBackgroundOptions = [
    { id: 1, name: "कहिल्यै स्कूल नगएको" },
    { id: 2, name: "विगतमा स्कूल/कलेज पढेको" },
    { id: 3, name: "हाल स्कूल/कलेज पढिरहेको" },
    { id: 4, name: "अनौपचारिक" },
  ];

        const formatBsDateInput = (rawValue: string) => {
          const digitsOnly = `${rawValue ?? ""}`.replace(/\D/g, "").slice(0, 8);
          if (digitsOnly.length <= 4) {
            return digitsOnly;
          }
          if (digitsOnly.length <= 6) {
            return `${digitsOnly.slice(0, 4)}-${digitsOnly.slice(4)}`;
          }
          return `${digitsOnly.slice(0, 4)}-${digitsOnly.slice(4, 6)}-${digitsOnly.slice(6, 8)}`;
        };

        const isValidBsDate = (formattedValue: string) => {
          const match = `${formattedValue ?? ""}`.match(/^(\d{4})-(\d{2})-(\d{2})$/);
          if (!match) {
            return false;
          }
          const month = parseInt(match[2], 10);
          const day = parseInt(match[3], 10);
          if (Number.isNaN(month) || Number.isNaN(day)) {
            return false;
          }
          return month >= 1 && month <= 12 && day >= 1 && day <= 32;
        };

        const calculateAgeFromBsDate = (dobBs: string) => {
          if (!isValidBsDate(dobBs)) {
            return "";
          }
          const [dobYearStr, dobMonthStr, dobDayStr] = dobBs.split("-");
          const dobYear = parseInt(dobYearStr, 10);
          const dobMonth = parseInt(dobMonthStr, 10);
          const dobDay = parseInt(dobDayStr, 10);

          const safeCurrentBsDate = isValidBsDate(current_bs_date) ? current_bs_date : "2082-01-15";
          const [currentBsYearStr, currentBsMonthStr, currentBsDayStr] = safeCurrentBsDate.split("-");
          const currentBsYear = parseInt(currentBsYearStr, 10);
          const currentBsMonth = parseInt(currentBsMonthStr, 10);
          const currentBsDay = parseInt(currentBsDayStr, 10);

          let age = currentBsYear - dobYear;
          const birthdayPassed =
            currentBsMonth > dobMonth ||
            (currentBsMonth === dobMonth && currentBsDay >= dobDay);

          if (!birthdayPassed) {
            age -= 1;
          }

          return age >= 0 ? `${age}` : "";
        };

  const getDisplayAge = (member: any) => {
    if (member?.age !== undefined && member?.age !== null && `${member.age}` !== "") {
      return `${member.age}`;
    }
    return "";
  };

  const getMemberStableKey = (member: any, memberKey: any) => {
    return `${member?.id ?? member?.member_id ?? `idx-${memberKey}`}`;
  };

  const getAgeLabel = (member: any, memberKey: any) => {
    const currentAge = getDisplayAge(member);
    if (currentAge) {
      return `${currentAge} वर्ष`;
    }
    return "";
  };

  const isOccupationForProfession = (mainOccupationId: any) => {
    const id = parseInt(`${mainOccupationId ?? ""}`, 10);
    return !Number.isNaN(id) && id > 0 && id <= 6;
  };

  const shouldShowFaculty = (educationStageId: any) => {
    const id = parseInt(`${educationStageId ?? ""}`, 10);
    return !Number.isNaN(id) && id >= 15;
  };

  const getMemberRefIds = (m: any) => {
    const ids = [`${m?.member_id ?? ""}`, `${m?.id ?? ""}`].filter((v) => v !== "");
    return Array.from(new Set(ids));
  };

  const getSpouseOptionId = (m: any, idx: number) => {
    return `${m?.member_id ?? m?.id ?? `idx-${idx}`}`;
  };

  const resolveSpouseSelectValue = (rawSpouseId: any, members: any[]) => {
    const normalized = `${rawSpouseId ?? ""}`;
    if (!normalized) {
      return "";
    }
    const matched = (members ?? []).find((m: any) =>
      getMemberRefIds(m).includes(normalized)
    );
    if (!matched) {
      return normalized;
    }
    return getSpouseOptionId(matched, (members ?? []).indexOf(matched));
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

              <label className="label" id={"resident_place-" + memberKey}>
                B5. बसोबास गर्ने ठाउः
              </label>
              <div className="options-vertical">
                <select
                  className="form-control"
                  name="resident_place"
                  key={"बसोबास गर्ने ठाउः" + memberKey}
                  value={member.resident_place ?? ""}
                  onChange={(e) =>
                    handleMemberChange(memberKey, "resident_place", e.target.value)
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

              <InputComponent
                name={"dob_bs"}
                label={`B6. जन्ममितिः * ${getAgeLabel(member, memberKey)}`}
                wrapperClass={"options-verical"}
                handleChange={(e: any) => {
                  const formattedDobValue = formatBsDateInput(e.target.value);
                  handleMemberChange(memberKey, "dob_bs", formattedDobValue);

                  if (isValidBsDate(formattedDobValue)) {
                    const calculatedAgeStr = calculateAgeFromBsDate(formattedDobValue);
                    handleMemberChange(memberKey, "age", calculatedAgeStr);
                  } else {
                    handleMemberChange(memberKey, "age", "");
                  }
                }}
                defaultValue={member.dob_bs}
                palceholder={"Ex: 2065-10-24"}
                type={"text"}
                maxLength={10}
                inputMode={"numeric"}
                pattern={"\\d{4}-\\d{2}-\\d{2}"}
                title={"Date must be in YYYY-MM-DD format"}
                id={"dob_bs-" + memberKey}
                errors={errors}
              />

              {Number(getDisplayAge(member) || 0) >= 10 && (
                <InputComponent
                  name={"mobile_num"}
                  label={"B7. मोवाईल नम्बर:"}
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
              )}

              {Number(getDisplayAge(member) || 0) >= 10 && (
                <>
                  <label className="label" id={"is_married-" + memberKey}>
                    B8. वैवाविक स्थितिः{" "}
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
                      <label className="label" id={"marital_status_id-" + memberKey}>
                        a. स्थिति{" "}
                      </label>
                      <div className="options-vertical">
                        <select
                          className="form-control"
                          name="marital_status_id"
                          key={"वैवाविक स्थितिः" + memberKey}
                          value={member.marital_status_id ?? ""}
                          onChange={(e) =>
                            handleMemberChange(memberKey, "marital_status_id", e.target.value)
                          }
                        >
                          {marital_statuses.map((ms, keym) => (
                            <option value={ms.id} key={"वैवाविक स्थितिःoption" + keym}>
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
                            handleMemberChange(memberKey, "age_on_marriage", e.target.value)
                          }
                          placeholder="Ex: 26"
                        />
                      </div>
                      <SelectComponent
                        options={(household.members ?? [])
                          .filter((_: any, idx: number) => idx !== memberKey)
                          .map((sp: any, idx: number) => ({
                            id: getSpouseOptionId(sp, idx),
                            name: `${sp.first_name ?? ""} ${sp.last_name ?? ""}`.trim(),
                          }))}
                        wrapperClass="options-verical"
                        label={"c. पति/पत्नी छान्नुहोस्"}
                        name="spouse_id"
                        handleChange={(e: any) =>
                          handleMemberChange(memberKey, "spouse_id", e.target.value)
                        }
                        defaultValue={resolveSpouseSelectValue(
                          member.spouse_id,
                          (household.members ?? []).filter((_: any, idx: number) => idx !== memberKey)
                        )}
                        id={"spouse_id-" + memberKey}
                        placeholder="पति/पत्नी"
                        errors={errors}
                      />
                    </div>
                  )}
                </>
              )}

              {Number(getDisplayAge(member) || 0) >= 5 && (
                <>
                  <SelectComponent
                    options={
                      education_backgrounds && 
                      education_backgrounds.length > 0 && 
                      education_backgrounds[0]?.id ? 
                        education_backgrounds.map((eb: any) => ({
                          id: String(eb.id),
                          name: eb.name
                        })) : 
                        educationBackgroundOptions.map((eb: any) => ({
                          id: String(eb.id),
                          name: eb.name
                        }))
                    }
                    wrapperClass="options-verical"
                    label={"B9. शैक्षिक पृष्ठभूमि"}
                    name="education_status_id"
                    handleChange={(e: any) =>
                      handleMemberChange(
                        memberKey,
                        "education_status_id",
                        e.target.value
                      )
                    }
                    defaultValue={String(member.education_status_id ?? "")}
                    id={"education_status_id-" + memberKey}
                    placeholder="शैक्षिक पृष्ठभूमि"
                    errors={errors}
                  />

                  <SelectComponent
                    options={education_stages}
                    wrapperClass="options-verical"
                    label={"B10. शैक्षिक योग्यता"}
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
                          handleMemberChange(memberKey, "education_faculty", e.target.value)
                        }
                        defaultValue={member.education_faculty}
                        id={"education_faculty-" + memberKey}
                        placeholder="विषय"
                        errors={errors}
                      />
                    </div>
                  )}
                </>
              )}

              {Number(getDisplayAge(member) || 0) >= 10 && (
                <>
                  <SelectComponent
                    options={employmentStatusOptions}
                    wrapperClass="options-verical"
                    label={"B11. रोजगारी स्थिति"}
                    name="employment_status"
                    handleChange={(e: any) =>
                      handleMemberChange(memberKey, "employment_status", e.target.value)
                    }
                    defaultValue={member.employment_status}
                    id={"employment_status-" + memberKey}
                    placeholder="रोजगारी स्थिति"
                    errors={errors}
                  />
                  <SelectComponent
                    options={mainWorkLast12MonthsOptions}
                    wrapperClass="options-verical"
                    label={"B12. विगत १२ महिनाको मुख्य काम"}
                    name="main_work_last_12_months"
                    handleChange={(e: any) =>
                      handleMemberChange(memberKey, "main_work_last_12_months", e.target.value)
                    }
                    defaultValue={member.main_work_last_12_months}
                    id={"main_work_last_12_months-" + memberKey}
                    placeholder="मुख्य काम"
                    errors={errors}
                  />
                </>
              )}
              <SelectComponent
                options={enrollTypes}
                wrapperClass="options-verical"
                label={"B13. दर्ता प्रकार"}
                name="enroll_type"
                handleChange={(e: any) =>
                  handleMemberChange(memberKey, "enroll_type", e.target.value)
                }
                defaultValue={member.enroll_type ?? "जन्म"}
                id={"enroll_type-" + memberKey}
                placeholder="छान्नुहोस्"
                errors={errors}
              />



              {Number(getDisplayAge(member) || 0) >= 16 && (
                <>
                  <label className="label" id={"has_voter_card-" + memberKey}>
                    B14. भोटर कार्ड भएको नभएको ?{" "}
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
                </>
              )}

              <InputComponent
                wrapperClass="options-verical"
                label={"B15. कैफियत"}
                name="employment_notes"
                handleChange={(e: any) =>
                  handleMemberChange(memberKey, "employment_notes", e.target.value)
                }
                defaultValue={member.employment_notes}
                id={"employment_notes-" + memberKey}
                palceholder="कैफियत"
                errors={errors}
              />

              

             
           
           




            </div>
        ))}
    </>
  );
}
