import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { getSabikWardById, ISabikWard } from "../../db/models/SabikWardModel";
import { getBastiById, IBasti } from "../../db/models/BastiModel";
import { getDharmaById, IDharma } from "../../db/models/DharmaModel";
import { getHouseholdById, IHousehold } from "../../db/models/Household";
import { getJaatiById, IJaati } from "../../db/models/JaatiModel";
import { getMargaById, IMarga } from "../../db/models/MargaModel";
import { getMembersbyHousehold, IMember } from "../../db/models/Member";
import { getWardById, IWard } from "../../db/models/WardModel";
import {
  disability_card_types,
  disability_types,
  disease_names,
  education_levels,
  education_statuses,
  foreign_reasons,
  land_types,
  marital_statuses,
  mother_tongues,
  relations,
  residence_types,
  technical_skills,
  vehicle_types,
  yes_nos,
} from "../../enums";

export default function ViewHousehold() {
  let { id } = useParams<{ id: any }>();
  const history = useHistory();

  const [household, setHousehold] = useState({} as IHousehold);
  const [ward, setWard] = useState({} as IWard);
  const [marga, setMarga] = useState({} as IMarga);
  const [sabikWard, setSabikWard] = useState({} as ISabikWard);
  const [basti, setBasti] = useState({} as IBasti);
  const [jaati, setJaati] = useState({} as IJaati);
  const [dharma, setDharma] = useState({} as IDharma);
  const [members, setMembers] = useState([] as IMember[]);

  useEffect(() => {
    getHousehold();
  }, []);

  const getHousehold = async () => {
    let hh = await getHouseholdById(id);
    setHousehold({ ...hh });
    getWard(hh);
    getMarga(hh);
    getSabikWard(hh);
    getBasti(hh);
    getJaati(hh);
    getDharma(hh);
    getMembers(hh);
  };
  const getWard = async (hh: IHousehold) => {
    let w = await getWardById(hh.ward_id);
    setWard(w);
  };
  const getSabikWard = async (hh: IHousehold) => {
    let sw= await getSabikWardById(hh.sabikWard_id);
    setSabikWard(sw);
  };

   const getBasti = async (hh: IHousehold) => {
    let b = await getBastiById(hh.basti_id);
    setBasti(b);
  };

  const getMarga = async (hh: IHousehold) => {
    let m = await getMargaById(hh.marga_id);
    setMarga(m);
  };
  const getJaati = async (hh: IHousehold) => {
    let j = await getJaatiById(hh.jaati_id);
     setJaati(j);
  };
  const getDharma = async (hh: IHousehold) => {
    let d = await getDharmaById(hh.religion_id);
    setDharma(d);
  };
  const getMembers = async (hh: IHousehold) => {
    let mems = await getMembersbyHousehold(hh.id.toString());
    setMembers([...mems]);
  };

  const findInEnumById = (options: any, id: any) => {
    let v = options.find((s: any) => `${s.id}` === `${id}`);
    if (v) {
      return v.name;
    }
    return "-";
  };

  const getValue = (value: any) => {
    if (value === undefined || value === null || value === "") {
      return "-";
    }
    return value;
  };

  const householdName = `${household?.hoh_first_name ?? ""} ${household?.hoh_last_name ?? ""}`.trim();
  const activeMembers = members.filter(
    (member: any) => `${member?.status ?? ""}` !== "0" && `${member?.status ?? ""}` !== "2"
  );
  const inactiveMembers = members.filter(
    (member: any) => `${member?.status ?? ""}` === "0" || `${member?.status ?? ""}` === "2"
  );
  const householdInfo = [
    ["Household Head", householdName],
    ["Resident Type", findInEnumById(residence_types, household.resident_type)],
    ["Migration Date", household.migration_date],
    ["Mobile Number", household.mobile_num ?? household.hoh_contact_num],
  ];

  const extraInfo = [
    ["Responder Name", household.responder_name ?? household.responder_member_name],
    ["Bank Account", findInEnumById(yes_nos, household.has_bank_account)],
    ["Cooperative Account", findInEnumById(yes_nos, household.has_cooperative_account)],
  ];

  const renderDetailList = (items: any[][]) => (
    <div className="view-household-detail-list">
      {items.map(([label, value]) => (
        <div className="view-household-detail-row" key={label}>
          <span>{label}</span>
          <strong>{getValue(value)}</strong>
        </div>
      ))}
    </div>
  );

  const renderCollectionTable = (title: string, rows: any[], columns: any[]) => {
    if (!rows || !rows.length) {
      return null;
    }

    return (
      <div className="view-household-subsection">
        <h4>{title}</h4>
        <table className="table view-household-member-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.label}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`${title}-${rowIndex}`}>
                {columns.map((column) => (
                  <td key={column.label} data-label={column.label}>
                    {getValue(column.value(row, rowIndex))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const getMemberName = (member: any) =>
    `${member?.first_name ?? ""} ${member?.last_name ?? ""}`.trim() || member?.member_name || "-";

  const getEducation = (member: any) => {
    const educationStatus = findInEnumById(education_statuses, member.education_status_id);
    const educationLevel = findInEnumById(education_levels, member.education_level_id);
    return [educationStatus, educationLevel].filter((item) => item && item !== "-").join(" / ") || "-";
  };

  const getVehicleName = (vehicle: any) =>
    vehicle.vehicle_type_name ||
    vehicle.vehicle_type ||
    findInEnumById(vehicle_types, vehicle.vehicle_type_id);

  const getForeignReason = (foreignMember: any) =>
    foreignMember.reason ||
    findInEnumById(foreign_reasons, foreignMember.reason_id);

  const getTechnicalSkill = (skill: any) =>
    skill.skill_name ||
    findInEnumById(technical_skills, skill.skill_id);

  const getDisabilityType = (member: any) =>
    member.disability_type_name ||
    member.disability_type ||
    findInEnumById(disability_types, member.disability_type_id);

  const getDisabilityCard = (member: any) =>
    member.disability_card ||
    findInEnumById(disability_card_types, member.disability_card_id);

  const getDiseaseName = (member: any) =>
    member.disease_name ||
    findInEnumById(disease_names, member.reason_id);

  const getLandType = (land: any) =>
    land.land_type ||
    findInEnumById(land_types, land.land_type_id);

  if (household) {
    return (
      <div className="view-household">
        <div className="view-household-topbar">
          <button
            className="btn btn-default btn-sm"
            onClick={() => history.goBack()}
          >
            Back
          </button>
          {`${household.is_posted ?? ""}` === "0" && (
            <button
              className="btn btn-default btn-sm"
              onClick={() =>
                history.push("/village-profile-app/app/edit/" + household.id)
              }
            >
              Edit
            </button>
          )}
        </div>

        <h2>{householdName || "Household"}</h2>

        {household.hoh_image && (
          <img className="view-household-photo" src={household.hoh_image} alt={householdName || "Household head"} />
        )}

        <section className="view-household-section">
          <h3>Household Information</h3>
          <div className="view-household-inline-grid">
            <div><span>Ward</span><strong>{getValue(ward?.name)}</strong></div>
            <div><span>Sabik Ward</span><strong>{getValue(sabikWard?.name)}</strong></div>
            <div><span>Basti</span><strong>{getValue(basti?.name)}</strong></div>
            <div><span>Marga</span><strong>{getValue(marga?.name)}</strong></div>
          </div>
          <div className="view-household-inline-grid view-household-inline-grid-three">
            <div><span>Jaati</span><strong>{getValue(jaati?.name)}</strong></div>
            <div><span>Dharma</span><strong>{getValue(dharma?.name)}</strong></div>
            <div><span>Mother Language</span><strong>{getValue(findInEnumById(mother_tongues, household.mother_tongue_id))}</strong></div>
          </div>
          {renderDetailList(householdInfo)}
        </section>

        <section className="view-household-section">
          <h3>Member Details</h3>
        {activeMembers && activeMembers.length ? (
            <table className="table view-household-member-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Relation</th>
                  <th>Contact</th>
                  <th>Marriage</th>
                  <th>Education</th>
                </tr>
              </thead>
              <tbody>
                {activeMembers.map((m, key) => (
                  <tr key={key}>
                    <td data-label="Name">{`${m.first_name ?? ""} ${m.last_name ?? ""}`.trim() || "-"}</td>
                    <td data-label="Age">{getValue(m.age)}</td>
                    <td data-label="Relation">{findInEnumById(relations, m.relation_with_hoh_id)}</td>
                    <td data-label="Contact">{getValue(m.mobile_num ?? m.phone_num)}</td>
                    <td data-label="Marriage">{findInEnumById(marital_statuses, m.marital_status_id) || findInEnumById(yes_nos, m.is_married)}</td>
                    <td data-label="Education">{getEducation(m)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        ) : (
            <p className="view-household-empty">No Members</p>
        )}
        </section>

        <section className="view-household-section">
          <h3>Other Details</h3>
          {renderDetailList(extraInfo)}
          {renderCollectionTable("Non Active Members", inactiveMembers, [
            { label: "Name", value: (row: any) => getMemberName(row) },
            { label: "Age", value: (row: any) => row.age },
            { label: "Reason", value: (row: any) => row.remove_reason ?? row.remarks ?? row.status },
          ])}
          {renderCollectionTable("Vehicles", household.vehicles ?? [], [
            { label: "Member", value: (row: any) => row.member_name },
            { label: "Vehicle", value: (row: any) => getVehicleName(row) },
            { label: "Count", value: (row: any) => row.count },
          ])}
          {renderCollectionTable("Foreign Members", household.foreign_members ?? [], [
            { label: "Member", value: (row: any) => row.member_name },
            { label: "Country", value: (row: any) => row.country },
            { label: "Reason", value: (row: any) => getForeignReason(row) },
            { label: "Years", value: (row: any) => row.total_abroad_age },
          ])}
          {renderCollectionTable("Technical Skill", household.technical_skills_members ?? [], [
            { label: "Member", value: (row: any) => row.member_name },
            { label: "Skill", value: (row: any) => getTechnicalSkill(row) },
            { label: "Source", value: (row: any) => `${row.source}` === "0" ? "Self learned" : row.source ? "Training" : "" },
          ])}
          {renderCollectionTable("Disability", household.disability_members ?? household.disabilty_members ?? [], [
            { label: "Member", value: (row: any) => row.member_name },
            { label: "Type", value: (row: any) => getDisabilityType(row) },
            { label: "Card", value: (row: any) => getDisabilityCard(row) },
          ])}
          {renderCollectionTable("Disease", household.chronic_disease_members ?? [], [
            { label: "Member", value: (row: any) => row.member_name },
            { label: "Disease", value: (row: any) => getDiseaseName(row) },
            { label: "Treatment", value: (row: any) => row.treatment_condition },
          ])}
          {renderCollectionTable("Land Details", household.lands ?? [], [
            { label: "Location", value: (row: any) => row.location },
            { label: "Land Type", value: (row: any) => getLandType(row) },
            { label: "Area", value: (row: any) => [row.total_area, row.area_unit].filter(Boolean).join(" ") },
            { label: "Kitta", value: (row: any) => row.kitta_no },
          ])}
          {renderCollectionTable("Business Details", household.businesses ?? [], [
            { label: "Member", value: (row: any) => row.member_name },
            { label: "Business", value: (row: any) => row.business_type },
            { label: "Place", value: (row: any) => row.business_place },
            { label: "Remarks", value: (row: any) => row.remarks },
          ])}
          {household.responder_image && (
            <img className="view-household-photo" src={household.responder_image} alt="Responder" />
          )}
        </section>
      </div>
    );
  } else {
    return <div className="vp-home">Server Loading...</div>;
  }
}
