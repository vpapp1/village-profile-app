import React, { useEffect, useState } from "react";
import NepaliDate from "nepali-date-converter";
import {
  death_reasons,
  education_faculties,
  gender_choice,
  marital_statuses,
  yes_nos,
} from "../../../enums";
import InputComponent from "./FormComponent/InputComponent";
import SelectComponent from "./FormComponent/SelectComponent";


export default function PariwarKoBibaran(props: any) {
  let {
    household,
    existingMemberPool,
    education_stages,
    education_backgrounds,
    relations = [],
    current_bs_date,
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
  const [existingMemberSearchName, setExistingMemberSearchName] = useState("");
  const [existingMemberSearchAge, setExistingMemberSearchAge] = useState("");
  const otherRemovalReasons = [
    { id: "migration", name: "स्थानान्तरण" },
    { id: "marriage", name: "विवाह" },
    { id: "divorce", name: "सम्बन्ध विच्छेद" },
    { id: "other", name: "अन्य" },
  ];
  const enrollTypes = [
    { id: "जन्म", name: "जन्म" },
    { id: "विवाह", name: "विवाह भई आएको (पालिका भित्रैबाट)" },
    { id: "विवाह-बाहिर", name: "विवाह भई आएको (पालिका बाहिरबाट)" },
    { id: "सम्बन्ध-विच्छेद-बाहिर", name: "सम्बन्ध-विच्छेद भई आएको (पालिका बाहिरबाट)" },
    { id: "अस्थायी-बाहिर", name: "अस्थायी (पालिका-बाहिरबाट)" },
    { id: "अन्य", name: "अन्य" },
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
    { id: "never_school", name: "कहिल्यै स्कूल नगएको" },
    { id: "past_student", name: "विगतमा स्कूल/कलेज पढेको" },
    { id: "current_student", name: "हाल स्कूल/कलेज पढिरहेको" },
    { id: "informal", name: "अनौपचारिक" },
  ];
  const residentPlaceOptions = [
    { id: "गाउँ", name: "गाउँ(खाँडादेवी)" },
    { id: "काठमान्डौँ उपत्यका", name: "काठमान्डौँ उपत्यका" },
    { id: "रामेछाप जिल्ला अन्य पालिका", name: "रामेछाप जिल्ला अन्य पालिका" },
    { id: "बागमती प्रदेश", name: "बागमती प्रदेश" },
    { id: "बिदेश", name: "बिदेश" },
    { id: "अन्य जिल्ला", name: "अन्य जिल्ला" },
  ];
  const voterCardLocationOptions = [
    { id: "गाउँपालिका", name: "गाउँपालिका" },
    { id: "गाउँपालिका बाहिर (रामेछाप जिल्ला)", name: "गाउँपालिका बाहिर (रामेछाप जिल्ला)" },
    { id: "काठमान्डौ", name: "काठमान्डौ" },
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

          const safeCurrentBsDate = isValidBsDate(current_bs_date) ? current_bs_date : "2082-01-15";
          const [currentBsYearStr, currentBsMonthStr, currentBsDayStr] = safeCurrentBsDate.split("-");

          const dobAd = new NepaliDate(
            parseInt(dobYearStr, 10),
            parseInt(dobMonthStr, 10) - 1,
            parseInt(dobDayStr, 10)
          ).toJsDate();
          const currentAd = new NepaliDate(
            parseInt(currentBsYearStr, 10),
            parseInt(currentBsMonthStr, 10) - 1,
            parseInt(currentBsDayStr, 10)
          ).toJsDate();

          if (currentAd.getTime() < dobAd.getTime()) {
            return "";
          }

          let years = currentAd.getUTCFullYear() - dobAd.getUTCFullYear();
          let months = currentAd.getUTCMonth() - dobAd.getUTCMonth();
          let days = currentAd.getUTCDate() - dobAd.getUTCDate();

          if (days < 0) {
            months -= 1;
            const previousMonth = new Date(Date.UTC(currentAd.getUTCFullYear(), currentAd.getUTCMonth(), 0));
            days += previousMonth.getUTCDate();
          }

          if (months < 0) {
            years -= 1;
            months += 12;
          }

          return [
            `${years} वर्ष`,
            `${months} महिना`,
            `${days} दिन`,
          ].join(" ");
        };

  const getDisplayAge = (member: any) => {
    if (member?.age !== undefined && member?.age !== null && `${member.age}` !== "") {
      return `${member.age}`;
    }
    return "";
  };

  const getAgeYears = (ageValue: any) => {
    const normalized = `${ageValue ?? ""}`.trim();
    if (!normalized) {
      return null;
    }

    const match = normalized.match(/^(\d+)/);
    if (!match) {
      return null;
    }

    const years = parseInt(match[1], 10);
    return Number.isNaN(years) ? null : years;
  };

  const getMemberAgeYears = (member: any) => getAgeYears(member?.age);

  const isMemberUnder15 = (member: any) => {
    const ageYears = getMemberAgeYears(member);
    return ageYears !== null && ageYears < 15;
  };

  const isMemberUnder18 = (member: any) => {
    const ageYears = getMemberAgeYears(member);
    return ageYears !== null && ageYears < 18;
  };

  const isMemberUnder4 = (member: any) => {
    const ageYears = getMemberAgeYears(member);
    return ageYears !== null && ageYears < 4;
  };

  const getEmploymentStatusValue = (member: any) =>
    isMemberUnder15(member) ? "inactive" : `${member?.employment_status ?? ""}`;

  const getMainWorkOptions = (member: any) => {
    const employmentStatus = getEmploymentStatusValue(member);
    if (employmentStatus === "unemployed") {
      return [
        { id: "no_work", name: "कुनै काम नगरेको" },
        { id: "housework", name: "घरधन्दा" },
        { id: "student", name: "अध्ययन (विद्यार्थी)" },
        { id: "pension", name: "नियमितरुपमा पेन्सन पाउने" },
      ];
    }

    return mainWorkLast12MonthsOptions;
  };

  const getAgeLabel = (member: any, memberKey: any) => {
    const currentAge = getDisplayAge(member);
    if (currentAge) {
      return currentAge;
    }
    return "";
  };

  const getFieldError = (name: string) =>
    (errors ?? []).find((s: any) => s.name === name);

  const shouldShowFaculty = (educationStageId: any) => {
    const id = parseInt(`${educationStageId ?? ""}`, 10);
    return !Number.isNaN(id) && id >= 15;
  };

  const getEducationStageOptions = (educationBackground: any) => {
    const background = `${educationBackground ?? ""}`;

    if (background === "informal") {
      return [{ id: "informal", name: "अनौपचारिक" }];
    }

    if (background === "never_school") {
      const allowedNames = new Set([
        "निरक्षर",
        "साधारण लेखपढ गर्न जान्ने",
        "तह नखुलेको",
        "अन्य",
      ]);

      return (education_stages ?? []).filter((stage: any) => allowedNames.has(stage?.name));
    }

    return education_stages ?? [];
  };

  const shouldHideEducationStage = (educationBackground: any) =>
    `${educationBackground ?? ""}` === "informal";

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
  const activeMemberRefs = new Set(
    activeMembers.flatMap((member: any) => getMemberRefIds(member))
  );
  const existingMembers = [...(existingMemberPool ?? []), ...(household.members ?? [])]
    .map((member: any, index: number) => ({ ...member, __memberIndex: member.__memberIndex ?? index }))
    .filter((member: any) => `${member?.status ?? ""}` === "0")
    .filter((member: any) =>
      getMemberRefIds(member).every((ref: string) => !activeMemberRefs.has(ref))
    )
    .filter(
      (member: any, index: number, list: any[]) =>
        index ===
        list.findIndex(
          (candidate: any) =>
            `${candidate?.member_id ?? candidate?.id ?? candidate?.__memberIndex ?? ""}` ===
            `${member?.member_id ?? member?.id ?? member?.__memberIndex ?? ""}`
        )
    )
    .sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime());

  useEffect(() => {
    (activeMembers ?? []).forEach((member: any) => {
      const ageYears = getMemberAgeYears(member);
      if (ageYears === null) {
        return;
      }

      if (ageYears < 4) {
        if (`${member?.education_background ?? ""}` !== "") {
          handleMemberChange(member.__memberIndex, "education_background", "");
        }
        if (`${member?.education_stage_id ?? ""}` !== "") {
          handleMemberChange(member.__memberIndex, "education_stage_id", "");
        }
        if (`${member?.education_faculty ?? ""}` !== "") {
          handleMemberChange(member.__memberIndex, "education_faculty", "");
        }
        if (`${member?.main_work_last_12_months ?? ""}` !== "") {
          handleMemberChange(member.__memberIndex, "main_work_last_12_months", "");
        }
        if (`${member?.is_married ?? ""}` !== "0") {
          handleMemberChange(member.__memberIndex, "is_married", "0");
        }
        if (`${member?.marital_status_id ?? ""}` !== "") {
          handleMemberChange(member.__memberIndex, "marital_status_id", "");
        }
        if (`${member?.age_on_marriage ?? ""}` !== "") {
          handleMemberChange(member.__memberIndex, "age_on_marriage", "");
        }
        if (`${member?.spouse_id ?? ""}` !== "") {
          handleMemberChange(member.__memberIndex, "spouse_id", "");
        }
      }

      if (ageYears < 15) {
        if (`${member?.mobile_num ?? ""}` !== "") {
          handleMemberChange(member.__memberIndex, "mobile_num", "");
        }
        if (`${member?.employment_status ?? ""}` !== "inactive") {
          handleMemberChange(member.__memberIndex, "employment_status", "inactive");
        }
        if (`${member?.is_married ?? ""}` !== "0") {
          handleMemberChange(member.__memberIndex, "is_married", "0");
        }
      }

      if (ageYears < 18) {
        if (`${member?.has_voter_card ?? ""}` !== "0") {
          handleMemberChange(member.__memberIndex, "has_voter_card", "0");
        }
        if (`${member?.voter_card_location ?? ""}` !== "") {
          handleMemberChange(member.__memberIndex, "voter_card_location", "");
        }
      }
    });
  }, [activeMembers, handleMemberChange]);

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

  const filteredExistingMembers = existingMembers.filter((member: any) => {
    const nameQuery = `${existingMemberSearchName ?? ""}`.trim().toLowerCase();
    const ageQuery = `${existingMemberSearchAge ?? ""}`.trim().toLowerCase();

    const memberName = `${member?.first_name ?? ""} ${member?.last_name ?? ""}`.trim().toLowerCase();
    const memberLabel = getExistingMemberOptionLabel(member).toLowerCase();
    const memberAge = `${member?.age ?? ""}`.trim().toLowerCase();
    const ageYears = getAgeYears(member?.age);
    const memberAgeYears = ageYears === null ? "" : `${ageYears}`;

    const matchesName = !nameQuery || memberName.includes(nameQuery) || memberLabel.includes(nameQuery);
    const matchesAge = !ageQuery || memberAge.includes(ageQuery) || memberAgeYears.includes(ageQuery);

    return matchesName && matchesAge;
  });

  const addExistingMember = () => {
    if (!selectedExistingMemberIndex) {
      alert("कृपया थप्न विद्यमान सदस्य छान्नुहोस्।");
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

  const getSpouseOptions = (members: any[], currentIndex: number) =>
    members
      .filter((candidate: any) => candidate.__memberIndex !== currentIndex)
      .map((candidate: any) => ({
        id: getSpouseOptionId(candidate, candidate.__memberIndex),
        name: `${candidate?.first_name ?? ""} ${candidate?.last_name ?? ""}`.trim() || `Member ${candidate.__memberIndex + 1}`,
      }));

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
              नयाँ सदस्य थप
            </button>
            <button
              type="button"
              className="btn btn-info btn-sm"
              onClick={() => {
                if (handlePullExistingMembers) {
                  handlePullExistingMembers();
                } else {
                  alert("विद्यमान सदस्य कार्यक्षमता उपलब्ध छैन।");
                }
              }}
            >
              सिस्टम सदस्य प्राप्त गर्नु
            </button>
            <button
              type="button"
              className={`btn btn-sm ${showExistingMembers ? "btn-secondary" : "btn-success"}`}
              onClick={() => {
                setShowRemoveForm(false);
                setShowExistingMembers(!showExistingMembers);
              }}
            >
              {showExistingMembers ? "सिस्टम थप गरेको रद्द गर्नुहोस्" : "सिस्टम सदस्य थप"}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${showRemoveForm ? "btn-secondary" : "btn-danger"}`}
              onClick={() => {
                setShowExistingMembers(false);
                setShowRemoveForm(!showRemoveForm);
              }}
            >
              {showRemoveForm ? "हटाउने रद्द गर्नुहोस्" : "सदस्य हटाउ"}
            </button>
          </div>
        </div>
        {showExistingMembers && (
          <div style={{ marginTop: "10px", display: "grid", gap: "8px" }}>
            {existingMembers.length === 0 ? (
              <div className="text-muted">स्थिति ० सहित कुनै विद्यमान सदस्य फेला परेन।</div>
            ) : (
              <>
                <div className="row" style={{ margin: 0, gap: "8px", display: "flex", flexWrap: "nowrap" }}>
                  <div className="col-md-8" style={{ padding: 0, flex: 1 }}>
                    <input
                      className="form-control"
                      type="text"
                      value={existingMemberSearchName}
                      placeholder="नामले खोज्नुहोस्"
                      onChange={(e) => setExistingMemberSearchName(e.target.value)}
                    />
                  </div>
                  <div className="col-md-4" style={{ padding: 0, flex: "0 0 220px" }}>
                    <input
                      className="form-control"
                      type="text"
                      value={existingMemberSearchAge}
                      placeholder="उमेरले खोज्नुहोस्"
                      onChange={(e) => setExistingMemberSearchAge(e.target.value)}
                    />
                  </div>
                </div>
                <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                  देखाइएको सदस्य: {filteredExistingMembers.length} / {existingMembers.length}
                </div>
                <select
                  className="form-control"
                  value={selectedExistingMemberIndex}
                  onChange={(e) => setSelectedExistingMemberIndex(e.target.value)}
                >
                  <option value="">थप्न सदस्य छान्नुहोस्</option>
                  {filteredExistingMembers.map((m: any, index: number) => (
                    <option
                      key={`existing-member-${getExistingMemberOptionValue(m)}`}
                      value={getExistingMemberOptionValue(m)}
                    >
                      {`${index + 1}. ${getExistingMemberOptionLabel(m)}`}
                    </option>
                  ))}
                </select>
                {filteredExistingMembers.length === 0 && (
                  <div className="text-muted">खोज अनुसार कुनै सदस्य भेटिएन।</div>
                )}
                <button type="button" className="btn btn-success btn-sm" onClick={addExistingMember}>
                  छनोट गरिएको सदस्य थप्नुहोस्
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
            <option value="">हटाउन सदस्य छान्नुहोस्</option>
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
            <option value="other">स्थानान्तरण / विवाह / सम्बन्ध विच्छेद / अन्य</option>
            <option value="death">मृत्यु</option>
          </select>
          {removeType === "death" && (
            <>
              <input
                className="form-control"
                type="text"
                value={deathDate}
                placeholder="मृत्यु मिति (वि.सं.), उदा: २०८२-०१-१५"
                onChange={(e) => setDeathDate(e.target.value)}
              />
              <select
                className="form-control"
                value={deathReasonId}
                onChange={(e) => setDeathReasonId(e.target.value)}
              >
                <option value="">मृत्यु कारण छान्नुहोस्</option>
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
                placeholder="कैफियत"
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
                alert("कृपया पहिले सदस्य छान्नुहोस्।");
                return;
              }
              const idx = parseInt(removeMemberIndex);
              if (removeType === "death") {
                if (!deathDate || !deathReasonId) {
                  alert("कृपया मृत्यु मिति र कारण भर्नुहोस्।");
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
            सदस्य हटाउनुहोस्
          </button>
        </div>}
      </div>
      {activeMembers.map((member: any, memberKey: any) => {
        const isPresent = isPresentMember(member);
        const memberAgeYears = getMemberAgeYears(member);
        const isUnder4 = memberAgeYears !== null && memberAgeYears < 4;
        const isUnder15 = memberAgeYears !== null && memberAgeYears < 15;
        const isUnder18 = memberAgeYears !== null && memberAgeYears < 18;
        const employmentStatusValue = getEmploymentStatusValue(member);
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
                  title="यो नयाँ खाली सदस्य फाराम हटाउनुहोस्"
                >
                  -
                </button>
              )}
            </div>
            <InputComponent
              label={"१. नाम (नेपालीमा)"}
              defaultValue={member.first_name}
              handleChange={(e: any) => handleMemberChange(member.__memberIndex, "first_name", e.target.value)}
              name={"first_name"}
              id={`first_name-${member.__memberIndex}`}
              errors={errors}
            />
            <InputComponent
              label={"२. थर (नेपालीमा)"}
              defaultValue={member.last_name}
              handleChange={(e: any) => handleMemberChange(member.__memberIndex, "last_name", e.target.value)}
              name={"last_name"}
              id={`last_name-${member.__memberIndex}`}
              errors={errors}
            />
            <div className="row">
              <div className="col-md-6">
                <SelectComponent
                  label={"३. घरमूलीसँग नाता"}
                  defaultValue={member.relation_with_hoh_id}
                  handleChange={(e: any) => {
                    const relationId = e.target.value;
                    handleMemberChange(member.__memberIndex, "relation_with_hoh_id", relationId);
                    
                    // Auto-fill gender based on selected relation, default to 0 if null
                    const selectedRelation = relations.find((r: any) => r.id == relationId);
                    if (selectedRelation) {
                      const genderId = selectedRelation.gender_id || 0;
                      handleMemberChange(member.__memberIndex, "gender_id", genderId);
                    }
                  }}
                  name={"relation_with_hoh_id"}
                  id={`relation_with_hoh_id-${member.__memberIndex}`}
                  options={relations}
                  placeholder={"छान्नुहोस्"}
                  errors={errors}
                />
              </div>
              <div className="col-md-6">
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
              </div>
            </div>
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
            {(() => {
              const dobError = getFieldError(`dob_bs-${member.__memberIndex}`) || getFieldError("dob_bs");
              const ageError = getFieldError(`age-${member.__memberIndex}`) || getFieldError("age");
              return (
                <div
                  className={`question ${dobError || ageError ? "error" : ""}`}
                  id={`dob_bs-${member.__memberIndex}`}
                >
                  <label className="label">६. जन्ममिति (वि.सं.) / उमेर (वर्ष, महिना, दिन)</label>
                  <div className="options-horizontal">
                    <input
                      className="form-control"
                      value={member.dob_bs ?? ""}
                      name="dob_bs"
                      placeholder="YYYY-MM-DD"
                      onChange={(e: any) => {
                        const formattedDate = formatBsDateInput(e.target.value);
                        const calculatedAge = calculateAgeFromBsDate(formattedDate);
                        handleMemberChange(member.__memberIndex, "dob_bs", formattedDate);
                        handleMemberChange(member.__memberIndex, "age", calculatedAge);

                        const ageYears = getAgeYears(calculatedAge);
                        if (ageYears !== null && ageYears < 4) {
                          handleMemberChange(member.__memberIndex, "education_background", "");
                          handleMemberChange(member.__memberIndex, "education_stage_id", "");
                          handleMemberChange(member.__memberIndex, "education_faculty", "");
                          handleMemberChange(member.__memberIndex, "main_work_last_12_months", "");
                          handleMemberChange(member.__memberIndex, "is_married", "0");
                          handleMemberChange(member.__memberIndex, "marital_status_id", "");
                          handleMemberChange(member.__memberIndex, "age_on_marriage", "");
                          handleMemberChange(member.__memberIndex, "spouse_id", "");
                        }
                        if (ageYears !== null && ageYears < 15) {
                          handleMemberChange(member.__memberIndex, "mobile_num", "");
                          handleMemberChange(member.__memberIndex, "employment_status", "inactive");
                        }
                        if (ageYears !== null && ageYears < 18) {
                          handleMemberChange(member.__memberIndex, "has_voter_card", "0");
                          handleMemberChange(member.__memberIndex, "voter_card_location", "");
                        }
                      }}
                    />
                    <input
                      className="form-control"
                      value={getAgeLabel(member, memberKey)}
                      name="age"
                      disabled={true}
                      placeholder="उमेर"
                    />
                  </div>
                  {dobError && <div className="text-danger">{dobError.message}</div>}
                  {ageError && <div className="text-danger">{ageError.message}</div>}
                </div>
              );
            })()}
            {!isMemberUnder15(member) && (
              <InputComponent
                label={"७. सम्पर्क नम्बर"}
                defaultValue={member.mobile_num}
                handleChange={(e: any) => handleMemberChange(member.__memberIndex, "mobile_num", e.target.value)}
                name={"mobile_num"}
                id={`mobile_num-${member.__memberIndex}`}
                type={"number"}
                errors={errors}
              />
            )}
            {!isUnder4 && (
              <SelectComponent
                label={"८. वैवाहिक अवस्था"}
                defaultValue={isUnder15 ? "0" : member.is_married}
                handleChange={(e: any) => handleMemberChange(member.__memberIndex, "is_married", e.target.value)}
                name={"is_married"}
                id={`is_married-${member.__memberIndex}`}
                options={[
                  { id: "0", name: "अविवाहित" },
                  { id: "1", name: "विवाहित" },
                ]}
                placeholder={"छान्नुहोस्"}
                disabled={isUnder15}
                errors={errors}
              />
            )}
            {`${member.is_married ?? ""}` === "1" && !isUnder4 && (
              <div className="child-section">
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
              </div>
            )}
            {!isUnder4 && (
              <>
                <SelectComponent
                  label={"९. शैक्षिक पृष्ठभूमि"}
                  defaultValue={member.education_background}
                  handleChange={(e: any) => {
                    const educationBackground = e.target.value;
                    handleMemberChange(member.__memberIndex, "education_background", educationBackground);

                    if (educationBackground === "informal") {
                      handleMemberChange(member.__memberIndex, "education_stage_id", "informal");
                      handleMemberChange(member.__memberIndex, "education_faculty", "");
                      return;
                    }

                    const allowedOptions = getEducationStageOptions(educationBackground);
                    const currentStageId = `${member.education_stage_id ?? ""}`;
                    const currentStageIsAllowed = allowedOptions.some((stage: any) => `${stage.id}` === currentStageId);

                    if (!currentStageIsAllowed) {
                      handleMemberChange(member.__memberIndex, "education_stage_id", "");
                      handleMemberChange(member.__memberIndex, "education_faculty", "");
                    }
                  }}
                  name={"education_background"}
                  id={`education_background-${member.__memberIndex}`}
                  options={education_backgrounds?.length ? education_backgrounds : educationBackgroundOptions}
                  placeholder={"छान्नुहोस्"}
                  errors={errors}
                />
                {( !shouldHideEducationStage(member.education_background) || `${member.education_background ?? ""}` === "informal") && (
                  <SelectComponent
                    label={"१०. शैक्षिक योग्यता"}
                    defaultValue={
                      `${member.education_background ?? ""}` === "informal"
                        ? "informal"
                        : member.education_stage_id
                    }
                    handleChange={(e: any) => handleMemberChange(member.__memberIndex, "education_stage_id", e.target.value)}
                    name={"education_stage_id"}
                    id={`education_stage_id-${member.__memberIndex}`}
                    options={getEducationStageOptions(member.education_background)}
                    placeholder={"छान्नुहोस्"}
                    disabled={`${member.education_background ?? ""}` === "informal"}
                    errors={errors}
                  />
                )}
                {shouldShowFaculty(member.education_stage_id) && !shouldHideEducationStage(member.education_background) && (
                  <div className="child-section">
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
                  </div>
                )}
              </>
            )}
            {!isUnder4 && (
              <SelectComponent
                label={"११. रोजगार स्थिति"}
                defaultValue={employmentStatusValue}
                handleChange={(e: any) => handleMemberChange(member.__memberIndex, "employment_status", e.target.value)}
                name={"employment_status"}
                id={`employment_status-${member.__memberIndex}`}
                options={employmentStatusOptions}
                placeholder={"छान्नुहोस्"}
                disabled={isUnder15}
                errors={errors}
              />
            )}
            {!isUnder4 && (
              <SelectComponent
                label={"१२. विगत १२ महिनाको मुख्य काम"}
                defaultValue={member.main_work_last_12_months}
                handleChange={(e: any) => handleMemberChange(member.__memberIndex, "main_work_last_12_months", e.target.value)}
                name={"main_work_last_12_months"}
                id={`main_work_last_12_months-${member.__memberIndex}`}
                options={getMainWorkOptions(member)}
                placeholder={"छान्नुहोस्"}
                errors={errors}
              />
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
            {!isUnder4 && (
              <SelectComponent
                label={"१५. मतदाता परिचयपत्र"}
                defaultValue={isUnder18 ? "0" : member.has_voter_card}
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
                disabled={isUnder18}
                errors={errors}
              />
            )}
            {!isUnder18 && `${member.has_voter_card ?? ""}` === "1" && !isUnder4 && (
              <div className="child-section">
                <SelectComponent
                  label={"१५.१ मतदाता परिचयपत्र भएको स्थान"}
                  defaultValue={member.voter_card_location}
                  handleChange={(e: any) => handleMemberChange(member.__memberIndex, "voter_card_location", e.target.value)}
                  name={"voter_card_location"}
                  id={`voter_card_location-${member.__memberIndex}`}
                  options={voterCardLocationOptions}
                  placeholder={"छान्नुहोस्"}
                  errors={errors}
                />
              </div>
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
