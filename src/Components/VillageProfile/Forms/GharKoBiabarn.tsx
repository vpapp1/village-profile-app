import { useEffect, useState } from "react";
import { IHousehold } from "../../../db/models/Household";
import { residence_types } from "../../../enums";
import InputComponent from "./FormComponent/InputComponent";
import RadioComponent from "./FormComponent/RadioComponent";
import SelectComponent from "./FormComponent/SelectComponent";

export default function GharKoBiabarn(props: any) {
  let {
    bastis,
    sabikWards,
    wards,
    margas,
    hh,
    jaatis,
    jaati_samuhas,
    districts,
    countries,
    dharmas,
    mother_tongues,
    errors,
  } = props;
  let { handleChange } = props;
  const [household, setHousehold] = useState({ ...hh } as IHousehold);

  const householdName = `${household?.hoh_first_name ?? ""} ${household?.hoh_last_name ?? ""}`.trim() || "N/A";
  const householdId = `${household?.household_id ?? ""}`.trim() || "N/A";
  const householdLabel = `${householdName} (${householdId})`;

  useEffect(() => {
    setHousehold({ ...hh });
  }, [hh]);

  const districtOptions = (districts || []).map((item: any) => ({
    ...item,
    name: item.name_ne && item.name_en
      ? `${item.name_ne} (${item.name_en})`
      : (item.name_ne || item.name_en || item.name || `District ${item.id}`),
  }));

  const countryOptions = (countries || []).map((item: any) => ({
    ...item,
    name: item.name_ne && item.name_en
      ? `${item.name_ne} (${item.name_en})`
      : (item.name_ne || item.name_en || item.name),
  }));

  const residentTypeValue = `${household.resident_type ?? ""}`;
  const selectedOriginType = `${household.resident_origin_type ?? ""}`;
  const showMigrationFields = residentTypeValue === "2";
  const showTemporaryFields = residentTypeValue === "3";
  const normalizeOriginType = (value: string) => {
    const normalized = `${value ?? ""}`.trim().toLowerCase();
    if (["inside_nepal", "नेपाल भित्र", "नेपालभित्र", "inside", "1"].includes(normalized)) {
      return "inside_nepal";
    }
    if (["outside_nepal", "नेपाल बाहिर", "नेपालबाहिर", "outside", "2"].includes(normalized)) {
      return "outside_nepal";
    }
    return "";
  };
  const effectiveOriginType = normalizeOriginType(selectedOriginType) || "inside_nepal";

  return (
    <>
      <div
        style={{
          position: "fixed",
          right: "14px",
          top: "72px",
          zIndex: 1050,
          background: "#ffffff",
          border: "1px solid #d9e2ec",
          borderRadius: "10px",
          boxShadow: "0 8px 20px rgba(15, 23, 42, 0.12)",
          padding: "8px 12px",
          minWidth: "180px",
          maxWidth: "300px",
        }}
      >
        <div style={{ fontSize: "13px", fontWeight: 600, color: "#1d4ed8", wordBreak: "break-word" }}>
          {householdLabel}
        </div>
      </div>

      <div className={`form-group`} id="1">
        <h5> A. मुलघरको विवरण</h5>

        <RadioComponent
          options={wards}
          wrapperClass="options-verical"
          label={"A1. वडा"}
          name="ward_id"
          id="ward_id"
          handleChange={handleChange}
          defaultValue={household.ward_id}
          errors={errors}
        />

        <RadioComponent
          options={sabikWards}
          wrapperClass="options-verical"
          label={"A2. साविक वडा"}
          name="sabikWard_id"
          handleChange={handleChange}
          defaultValue={household.sabikWard_id}
          id={"sabikWard_id"}
          errors={errors}
        />

        <RadioComponent
          options={bastis}
          wrapperClass="options-verical"
          label={"A3. बस्ती"}
          name="basti_id"
          handleChange={handleChange}
          defaultValue={household.basti_id}
          id={"basti_id"}
          errors={errors}
        />

        <RadioComponent
          options={margas}
          wrapperClass="options-verical"
          label={"A4. टोल"}
          name="marga_id"
          handleChange={handleChange}
          defaultValue={household.marga_id}
          id={"marga_id"}
          errors={errors}
        />

        <SelectComponent
          options={jaati_samuhas}
          wrapperClass="options-verical"
          label={"A5. जाति समुह"}
          name="jaati_samuha_id"
          handleChange={handleChange}
          defaultValue={household.jaati_samuha_id}
          id={"jaati_samuha_id"}
          placeholder="???????"
          errors={errors}
        />

        <SelectComponent
          options={jaatis}
          wrapperClass="options-verical"
          label={"A6. जाति"}
          name="jaati_id"
          handleChange={handleChange}
          defaultValue={household.jaati_id}
          id={"jaati_id"}
          placeholder="????"
          errors={errors}
        />

        <SelectComponent
          options={dharmas}
          wrapperClass="options-verical"
          label={"A7. धर्म"}
          name="religion_id"
          handleChange={handleChange}
          defaultValue={household.religion_id}
          id={"religion_id"}
          placeholder="????"
          errors={errors}
        />

        <SelectComponent
          options={mother_tongues}
          wrapperClass="options-verical"
          label={"A8. मातृभाषा"}
          name="mother_tongue_id"
          handleChange={handleChange}
          defaultValue={household.mother_tongue_id}
          id={"mother_tongue_id"}
          placeholder="????????"
          errors={errors}
        />

        <SelectComponent
          options={residence_types}
          wrapperClass="options-verical"
          label={"A9. बसोबासको प्रकार"}
          name="resident_type"
          handleChange={handleChange}
          defaultValue={household.resident_type || "1"}
          id={"resident_type"}
          placeholder="बसोबासको प्रकार"
          errors={errors}
        />

        {showMigrationFields && (
          <div className="child-section">
            <SelectComponent
              options={[
                { id: "inside_nepal", name: "नेपाल भित्र" },
                { id: "outside_nepal", name: "नेपाल बाहिर" },
              ]}
              wrapperClass="options-verical"
              label={"a. पहिलेको बसोबासको प्रकार"}
              name="resident_origin_type"
              handleChange={handleChange}
              defaultValue={effectiveOriginType}
              id={"resident_origin_type"}
              placeholder="पहिलेको बसोबासको प्रकार"
              errors={errors}
            />

            {effectiveOriginType === "inside_nepal" && (
              <SelectComponent
                options={districtOptions}
                wrapperClass="options-verical"
                label={"b. पूर्व जिल्ला"}
                name="origin_district_id"
                handleChange={handleChange}
                defaultValue={household.origin_district_id || ""}
                id={"origin_district_id"}
                placeholder="जिल्ला छान्नुहोस्"
                errors={errors}
              />
            )}

            {effectiveOriginType === "outside_nepal" && (
              <SelectComponent
                options={countryOptions}
                wrapperClass="options-verical"
                label={"b. पूर्व देश"}
                name="origin_country_id"
                handleChange={handleChange}
                defaultValue={household.origin_country_id || ""}
                id={"origin_country_id"}
                placeholder="देश छान्नुहोस्"
                errors={errors}
              />
            )}

            <InputComponent
              name={"migration_date"}
              label={"c. पालिकामा आएको साल (वि.सं.)"}
              wrapperClass={"options-verical"}
              handleChange={handleChange}
              defaultValue={household.migration_date}
              palceholder={"उदाहरण: २०७५"}
              type={"text"}
              id={"migration_date"}
              errors={errors}
            />
          </div>
        )}

        {showTemporaryFields && (
          <div className="child-section">
            <InputComponent
              name={"origin_member_count"}
              label={"d. पालिकाबाहिरको कुल परिवार संख्या"}
              wrapperClass={"options-verical"}
              handleChange={handleChange}
              defaultValue={household.origin_member_count}
              palceholder={"उदाहरण: ५"}
              type={"text"}
              id={"origin_member_count"}
              errors={errors}
            />
          </div>
        )}
      </div>

      {/* <div className={`form-group`} id="2">
        <InputComponent
          name={"hoh_first_name"}
          label={"6. ???????? ???"}
          wrapperClass={"options-verical"}
          handleChange={handleChange}
          defaultValue={household.hoh_first_name}
          palceholder={"???????? ???"}
          type={"text"}
          id={"hoh_first_name"}
          errors={errors}
        />

        <InputComponent
          name={"hoh_last_name"}
          label={"7. ???????? ??"}
          wrapperClass={"options-verical"}
          handleChange={handleChange}
          defaultValue={household.hoh_last_name}
          palceholder={"???????? ??"}
          type={"text"}
          id={"hoh_last_name"}
          errors={errors}
        />

        <InputComponent
          name={"hoh_contact_num"}
          label={"9. ???????? ???????"}
          wrapperClass={"options-verical"}
          handleChange={handleChange}
          defaultValue={household.hoh_contact_num}
          palceholder={"???????? ???????"}
          type={"number"}
          id={"hoh_contact_num"}
          errors={errors}
        />

        <RadioComponent
          options={gender_choice}
          wrapperClass="options-verical"
          label={"10. ???????? ????"}
          name="hoh_gender"
          handleChange={handleChange}
          defaultValue={household.hoh_gender}
          id={"hoh_gender"}
          errors={errors}
        />
      </div> */}
    </>
  );
}
