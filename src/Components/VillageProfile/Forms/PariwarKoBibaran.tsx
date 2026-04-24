import React, { useEffect, useState } from "react";
import {
  death_reasons,
  education_faculties,
  gender_choice,
  marital_statuses,
  relations,
  yes_nos,
} from "../../../enums";
import InputComponent from "./FormComponent/InputComponent";
import SelectComponent from "./FormComponent/SelectComponent";


export default function PariwarKoBibaran(props: any) {
  let {
    household,
    existingMemberPool,
    occupations,
    education_stages,
    education_backgrounds,
    current_bs_date,
    profession_categories,
    professions,
    errors,
  } = props;
  let {
    handleMemberChange,
    handleAddMember,
    handleDiscardNewMember,
    handleRemoveMemberRequest,
    handleAddExistingMember,
    handlePullExistingMembers,
  } = props;
  const [removeMemberIndex, setRemoveMemberIndex] = useState("");
  const [removeType, setRemoveType] = useState("other");
  const [deathDate, setDeathDate] = useState("");
  const [showExistingMembers, setShowExistingMembers] = useState(false);
  const [selectedExistingMemberIndex, setSelectedExistingMemberIndex] = useState("");
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
    { id: "विवाह", name: "विवाह भई आएको (पालिका भित्रैबाट)" },
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
  const residentPlaceOptions = [
    { id: "गाउँ", name: "गाउँ(खाँडादेवी)" },
    { id: "काठमान्डौँ उपत्यका", name: "काठमान्डौँ उपत्यका" },
    { id: "रामेछाप जिल्ला अन्य पालिका", name: "रामेछाप जिल्ला अन्य पालिका" },
    { id: "बागमती प्रदेश", name: "बागमती प्रदेश" },
    { id: "विदेश", name: "विदेश" },
    { id: "अन्य जिल्ला", name: "अन्य जिल्ला" },
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

  const isPresentMember = (member: any) => {
    const present = `${member?.present_status ?? ""}`.trim().toLowerCase();
    if (present === "" || present === "1" || present === "true" || present === "present") {
      return true;
    }
    return false;
  };

  const activeMembers = (household.members ?? [])
    .map((member: any, index: number) => ({ ...member, __memberIndex: index }))
    .filter(
      (member: any) =>
        `${member?.status ?? ""}` !== "2" &&
        `${member?.status ?? ""}` !== "0" &&
        isPresentMember(member)
    );

  const existingMembers = [...(existingMemberPool ?? []), ...(household.members ?? [])]
    .map((member: any, index: number) => ({ ...member, __memberIndex: member.__memberIndex ?? index }))
    .filter((member: any) => `${member?.status ?? ""}` === "0")
    .filter(
      (member: any, index: number, list: any[]) =>
        index ===
        list.findIndex(
          (candidate: any) =>
            `${candidate?.member_id ?? candidate?.id ?? candidate?.__memberIndex ?? ""}` ===
            `${member?.member_id ?? member?.id ?? member?.__memberIndex ?? ""}`
        )
    );

  const getExistingMemberOptionValue = (member: any) =>
    `${member?.member_id ?? member?.id ?? member?.__memberIndex ?? ""}`;

  const selectedExistingMember = existingMembers.find(
    (member: any) => getExistingMemberOptionValue(member) === selectedExistingMemberIndex
  );

  const getExistingMemberWardLabel = (member: any) => {
    const wardValue =
      member?.ward_label ??
      member?.ward_no ??
      member?.ward ??
      member?.ward_id ??
      member?.ward_number;
    return `${wardValue ?? ""}`.trim();
  };

  const getExistingMemberBastiLabel = (member: any) => {
    const bastiValue =
      member?.basti_label ??
      member?.basti_tole ??
      member?.basti ??
      member?.basti_name ??
      member?.tole ??
      member?.marga;
    return `${bastiValue ?? ""}`.trim();
  };

  const getExistingMemberOptionLabel = (member: any) => {
    const parts = [`${member?.first_name ?? ""} ${member?.last_name ?? ""}`.trim()];
    const age = `${member?.age ?? ""}`.trim();
    const phone = `${member?.mobile_num ?? member?.phone_num ?? ""}`.trim();
    const removeRemark = `${member?.remove_reason ?? member?.remarks ?? ""}`.trim();
    if (age) {
      parts.push(`Age: ${age}`);
    }
    if (phone) {
      parts.push(`Phone: ${phone}`);
    }
    if (removeRemark) {
      parts.push(`Remark: ${removeRemark}`);
    }

    return parts.filter(Boolean).join(" - ");
  };

  const addExistingMember = () => {
    if (!selectedExistingMemberIndex) {
      alert("Please select an existing member to add.");
      return;
    }
    if (handleAddExistingMember) {
      handleAddExistingMember(selectedExistingMember);
    } else {
      handleAddMember(selectedExistingMember);
    }
    setSelectedExistingMemberIndex("");
    setShowExistingMembers(false);
  };

  const getProfessionOptions = (member: any) => {
    const categoryKey = `${member?.profession_category_id ?? ""}`;
    return professionsByCategory[categoryKey] ?? [];
  };

  const getSpouseOptions = (members: any[], currentIndex: number) =>
    members
      .filter((candidate: any) => candidate.__memberIndex !== currentIndex)
      .map((candidate: any) => ({
        id: getSpouseOptionId(candidate, candidate.__memberIndex),
        name: `${candidate?.first_name ?? ""} ${candidate?.last_name ?? ""}`.trim() || `Member ${candidate.__memberIndex + 1}`,
      }));

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
          <h5 style={{ margin: 0 }}>
            B. सदस्यको विवरण
            <span style={{ marginLeft: "8px", fontSize: "0.9rem", color: "#495057" }}>
              (कुल खुला फाराम: {activeMembers.length})
            </span>
          </h5>
          <div style={{ display: "flex", gap: "8px" }}>
            <button type="button" className="btn btn-primary btn-sm" onClick={handleAddMember}>
              Add New Member
            </button>
            <button
              type="button"
              className="btn btn-info btn-sm"
              onClick={() => {
                if (handlePullExistingMembers) {
                  handlePullExistingMembers();
                } else {
                  alert("Pull existing members functionality not available.");
                }
              }}
            >
              Pull Existing Members
            </button>
            <button
              type="button"
              className={`btn btn-sm ${showExistingMembers ? "btn-secondary" : "btn-success"}`}
              onClick={() => {
                setShowRemoveForm(false);
                setShowExistingMembers(!showExistingMembers);
              }}
            >
              {showExistingMembers ? "Cancel Add Existing" : "Add Existing Member"}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${showRemoveForm ? "btn-secondary" : "btn-danger"}`}
              onClick={() => {
                setShowExistingMembers(false);
                setShowRemoveForm(!showRemoveForm);
              }}
            >
              {showRemoveForm ? "Cancel Remove" : "Remove Member"}
            </button>
          </div>
        </div>
        {showExistingMembers && (
          <div style={{ marginTop: "10px", display: "grid", gap: "8px" }}>
            {existingMembers.length === 0 ? (
              <div className="text-muted">No existing members found with status 0.</div>
            ) : (
              <>
                <select
                  className="form-control"
                  value={selectedExistingMemberIndex}
                  onChange={(e) => setSelectedExistingMemberIndex(e.target.value)}
                >
                  <option value="">Select member to add</option>
                  {existingMembers.map((m: any) => (
                    <option
                      key={`existing-member-${getExistingMemberOptionValue(m)}`}
                      value={getExistingMemberOptionValue(m)}
                    >
                      {getExistingMemberOptionLabel(m)}
                    </option>
                  ))}
                </select>
                <button type="button" className="btn btn-success btn-sm" onClick={addExistingMember}>
                  Add Selected Member
                </button>
              </>
            )}
          </div>
        )}
        {showRemoveForm && <div style={{ marginTop: "10px", display: "grid", gap: "8px" }}>
          <select
            className="form-control"
            value={removeMemberIndex}
            onChange={(e) => setRemoveMemberIndex(e.target.value)}
          >
            <option value="">Select member to remove</option>
            {activeMembers.map((m: any) => (
                <option key={`remove-member-${m.__memberIndex}`} value={`${m.__memberIndex}`}>
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
      {activeMembers.map((member: any, memberKey: any) => {
        const isPresent = isPresentMember(member);
        const canDiscardNewMember =
          !member?.id &&
          !member?.member_id &&
          `${member?.__isNewlyAdded ?? ""}` === "1";
        return (
          <div
            className={`form-group ${memberKey % 2 === 0 ? "member-form-one" : "member-form-two"}`}
            key={"member-form-" + member.__memberIndex}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
              <div>
                <h5> B.  सदस्यको विवरण</h5>
                <h5>
                  Member: {memberKey + 1} *
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "0.9rem",
                      color: isPresent ? "#28a745" : "#6c757d",
                    }}
                  >
                    [{isPresent ? "उपस्थित" : "अनुपस्थित"}]
                  </span>
                </h5>
              </div>
              {canDiscardNewMember && (
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDiscardNewMember(member.__memberIndex)}
                  title="Remove this new blank member form"
                >
                  -
                </button>
              )}
            </div>
            <InputComponent
              label={"१. नाम"}
              defaultValue={member.first_name}
              handleChange={(e: any) => handleMemberChange(member.__memberIndex, "first_name", e.target.value)}
              name={"first_name"}
              id={`first_name-${member.__memberIndex}`}
              errors={errors}
            />
            <InputComponent
              label={"२. थर"}
              defaultValue={member.last_name}
              handleChange={(e: any) => handleMemberChange(member.__memberIndex, "last_name", e.target.value)}
              name={"last_name"}
              id={`last_name-${member.__memberIndex}`}
              errors={errors}
            />
            <SelectComponent
              label={"३. घरमूलीसँग नाता"}
              defaultValue={member.relation_with_hoh_id}
              handleChange={(e: any) => handleMemberChange(member.__memberIndex, "relation_with_hoh_id", e.target.value)}
              name={"relation_with_hoh_id"}
              id={`relation_with_hoh_id-${member.__memberIndex}`}
              options={relations}
              placeholder={"छान्नुहोस्"}
              errors={errors}
            />
            <SelectComponent
              label={"४. लिङ्ग"}
              defaultValue={member.gender_id}
              handleChange={(e: any) => handleMemberChange(member.__memberIndex, "gender_id", e.target.value)}
              name={"gender_id"}
              id={`gender_id-${member.__memberIndex}`}
              options={gender_choice}
              placeholder={"छान्नुहोस्"}
              errors={errors}
            />
            <SelectComponent
              label={"५. बसोबास गर्ने ठाउँ"}
              defaultValue={member.resident_place}
              handleChange={(e: any) => handleMemberChange(member.__memberIndex, "resident_place", e.target.value)}
              name={"resident_place"}
              id={`resident_place-${member.__memberIndex}`}
              options={residentPlaceOptions}
              placeholder={"छान्नुहोस्"}
              errors={errors}
            />
            <InputComponent
              label={"६. जन्ममिति (वि.सं.)"}
              defaultValue={member.dob_bs}
              handleChange={(e: any) => {
                const formattedDate = formatBsDateInput(e.target.value);
                handleMemberChange(member.__memberIndex, "dob_bs", formattedDate);
                handleMemberChange(member.__memberIndex, "age", calculateAgeFromBsDate(formattedDate));
              }}
              name={"dob_bs"}
              id={`dob_bs-${member.__memberIndex}`}
              palceholder={"YYYY-MM-DD"}
              errors={errors}
            />
            <InputComponent
              label={"उमेर"}
              defaultValue={getAgeLabel(member, memberKey)}
              handleChange={(_e: any): void => {}}
              name={"age"}
              id={`age-${member.__memberIndex}`}
              disabled={true}
              errors={errors}
            />
            <InputComponent
              label={"७. सम्पर्क नम्बर"}
              defaultValue={member.mobile_num}
              handleChange={(e: any) => handleMemberChange(member.__memberIndex, "mobile_num", e.target.value)}
              name={"mobile_num"}
              id={`mobile_num-${member.__memberIndex}`}
              type={"number"}
              errors={errors}
            />
            <SelectComponent
              label={"८. वैवाहिक अवस्था"}
              defaultValue={member.is_married}
              handleChange={(e: any) => handleMemberChange(member.__memberIndex, "is_married", e.target.value)}
              name={"is_married"}
              id={`is_married-${member.__memberIndex}`}
              options={[
                { id: "0", name: "अविवाहित" },
                { id: "1", name: "विवाहित" },
              ]}
              placeholder={"छान्नुहोस्"}
              errors={errors}
            />
            {`${member.is_married ?? ""}` === "1" && (
              <>
                <SelectComponent
                  label={"८.१ विवाहको प्रकार"}
                  defaultValue={member.marital_status_id}
                  handleChange={(e: any) => handleMemberChange(member.__memberIndex, "marital_status_id", e.target.value)}
                  name={"marital_status_id"}
                  id={`marital_status_id-${member.__memberIndex}`}
                  options={marital_statuses}
                  placeholder={"छान्नुहोस्"}
                  errors={errors}
                />
                <InputComponent
                  label={"८.२ पहिलो विवाह हुँदा उमेर"}
                  defaultValue={member.age_on_marriage}
                  handleChange={(e: any) => handleMemberChange(member.__memberIndex, "age_on_marriage", e.target.value)}
                  name={"age_on_marriage"}
                  id={`age_on_marriage-${member.__memberIndex}`}
                  type={"number"}
                  errors={errors}
                />
                <SelectComponent
                  label={"८.३ पति/पत्नी"}
                  defaultValue={resolveSpouseSelectValue(member.spouse_id, activeMembers)}
                  handleChange={(e: any) => handleMemberChange(member.__memberIndex, "spouse_id", e.target.value)}
                  name={"spouse_id"}
                  id={`spouse_id-${member.__memberIndex}`}
                  options={getSpouseOptions(activeMembers, member.__memberIndex)}
                  placeholder={"छान्नुहोस्"}
                  errors={errors}
                />
              </>
            )}
            <SelectComponent
              label={"९. शैक्षिक पृष्ठभूमि"}
              defaultValue={member.education_status_id}
              handleChange={(e: any) => handleMemberChange(member.__memberIndex, "education_status_id", e.target.value)}
              name={"education_status_id"}
              id={`education_status_id-${member.__memberIndex}`}
              options={education_backgrounds?.length ? education_backgrounds : educationBackgroundOptions}
              placeholder={"छान्नुहोस्"}
              errors={errors}
            />
            <SelectComponent
              label={"१०. शैक्षिक योग्यता"}
              defaultValue={member.education_stage_id}
              handleChange={(e: any) => handleMemberChange(member.__memberIndex, "education_stage_id", e.target.value)}
              name={"education_stage_id"}
              id={`education_stage_id-${member.__memberIndex}`}
              options={education_stages}
              placeholder={"छान्नुहोस्"}
              errors={errors}
            />
            {shouldShowFaculty(member.education_stage_id) && (
              <SelectComponent
                label={"१०.१ विषय"}
                defaultValue={member.education_faculty}
                handleChange={(e: any) => handleMemberChange(member.__memberIndex, "education_faculty", e.target.value)}
                name={"education_faculty"}
                id={`education_faculty-${member.__memberIndex}`}
                options={education_faculties}
                placeholder={"छान्नुहोस्"}
                errors={errors}
              />
            )}
            <SelectComponent
              label={"११. रोजगार स्थिति"}
              defaultValue={member.employment_status}
              handleChange={(e: any) => handleMemberChange(member.__memberIndex, "employment_status", e.target.value)}
              name={"employment_status"}
              id={`employment_status-${member.__memberIndex}`}
              options={employmentStatusOptions}
              placeholder={"छान्नुहोस्"}
              errors={errors}
            />
            <SelectComponent
              label={"१२. विगत १२ महिनाको मुख्य काम"}
              defaultValue={member.main_work_last_12_months}
              handleChange={(e: any) => handleMemberChange(member.__memberIndex, "main_work_last_12_months", e.target.value)}
              name={"main_work_last_12_months"}
              id={`main_work_last_12_months-${member.__memberIndex}`}
              options={mainWorkLast12MonthsOptions}
              placeholder={"छान्नुहोस्"}
              errors={errors}
            />
            <SelectComponent
              label={"१३. मुख्य पेशा/Occupation"}
              defaultValue={member.main_occupation_id}
              handleChange={(e: any) => {
                handleMemberChange(member.__memberIndex, "main_occupation_id", e.target.value);
                if (!isOccupationForProfession(e.target.value)) {
                  handleMemberChange(member.__memberIndex, "profession_category_id", "");
                  handleMemberChange(member.__memberIndex, "profession_id", "");
                  handleMemberChange(member.__memberIndex, "profession_type", "");
                }
              }}
              name={"main_occupation_id"}
              id={`main_occupation_id-${member.__memberIndex}`}
              options={occupations}
              placeholder={"छान्नुहोस्"}
              errors={errors}
            />
            {isOccupationForProfession(member.main_occupation_id) && (
              <>
                <SelectComponent
                  label={"१३.१ पेशा समूह"}
                  defaultValue={member.profession_category_id}
                  handleChange={(e: any) => {
                    handleMemberChange(member.__memberIndex, "profession_category_id", e.target.value);
                    handleMemberChange(member.__memberIndex, "profession_id", "");
                  }}
                  name={"profession_category_id"}
                  id={`profession_category_id-${member.__memberIndex}`}
                  options={profession_categories}
                  placeholder={"छान्नुहोस्"}
                  errors={errors}
                />
                <SelectComponent
                  label={"१३.२ पेशा"}
                  defaultValue={member.profession_id}
                  handleChange={(e: any) => handleMemberChange(member.__memberIndex, "profession_id", e.target.value)}
                  name={"profession_id"}
                  id={`profession_id-${member.__memberIndex}`}
                  options={getProfessionOptions(member)}
                  placeholder={"छान्नुहोस्"}
                  errors={errors}
                />
                <SelectComponent
                  label={"१३.३ पेशाको प्रकार"}
                  defaultValue={member.profession_type}
                  handleChange={(e: any) => handleMemberChange(member.__memberIndex, "profession_type", e.target.value)}
                  name={"profession_type"}
                  id={`profession_type-${member.__memberIndex}`}
                  options={professionTypes}
                  placeholder={"छान्नुहोस्"}
                  errors={errors}
                />
              </>
            )}
            <SelectComponent
              label={"१४. दर्ता प्रकार"}
              defaultValue={member.enroll_type}
              handleChange={(e: any) => handleMemberChange(member.__memberIndex, "enroll_type", e.target.value)}
              name={"enroll_type"}
              id={`enroll_type-${member.__memberIndex}`}
              options={enrollTypes}
              placeholder={"छान्नुहोस्"}
              errors={errors}
            />
            <SelectComponent
              label={"१५. मतदाता परिचयपत्र"}
              defaultValue={member.has_voter_card}
              handleChange={(e: any) => {
                handleMemberChange(member.__memberIndex, "has_voter_card", e.target.value);
                if (`${e.target.value}` !== "1") {
                  handleMemberChange(member.__memberIndex, "voter_card_location", "");
                }
              }}
              name={"has_voter_card"}
              id={`has_voter_card-${member.__memberIndex}`}
              options={yes_nos}
              placeholder={"छान्नुहोस्"}
              errors={errors}
            />
            {`${member.has_voter_card ?? ""}` === "1" && (
              <InputComponent
                label={"१५.१ मतदाता परिचयपत्र भएको स्थान"}
                defaultValue={member.voter_card_location}
                handleChange={(e: any) => handleMemberChange(member.__memberIndex, "voter_card_location", e.target.value)}
                name={"voter_card_location"}
                id={`voter_card_location-${member.__memberIndex}`}
                errors={errors}
              />
            )}
            <InputComponent
              label={"१६. कैफियत"}
              defaultValue={member.remarks}
              handleChange={(e: any) => handleMemberChange(member.__memberIndex, "remarks", e.target.value)}
              name={"remarks"}
              id={`remarks-${member.__memberIndex}`}
              errors={errors}
            />
            </div>
          );
        })}
    </>
  );
}
