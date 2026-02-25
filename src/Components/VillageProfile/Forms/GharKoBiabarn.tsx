import { useEffect, useState } from "react";
import { IHousehold } from "../../../db/models/Household";
import { gender_choice, residence_types, residence_district } from "../../../enums";
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
    dharmas,
    mother_tongues,
    errors,
  } = props;
  let { handleChange } = props;
  const [household, setHousehold] = useState({ ...hh } as IHousehold);

  useEffect(() => {
    setHousehold({ ...hh });
  }, [hh]);

  return (
    <>
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

        {/* <RadioComponent
          options={residence_types}
          wrapperClass="options-verical"
          label={"15. निवास प्रकार"}
          name="resident_type"
          handleChange={handleChange}
          defaultValue={household.resident_type}
          id={"resident_type"}
          errors={errors}
        /> */}

        {/* {household.resident_type !== "1" && (
          <div className="child-section">
            <RadioComponent
              options={residence_district}
              wrapperClass="options-verical"
              label={"a. ????? ?????? ?"}
              name="resident_district"
              handleChange={handleChange}
              defaultValue={household.resident_district}
              id={"resident_district"}
              errors={errors}
            />

            <InputComponent
              name={"migration_date"}
              label={"b. ?? ???????? ???????? ??? (??.?.)"}
              wrapperClass={"options-verical"}
              handleChange={handleChange}
              defaultValue={household.migration_date}
              palceholder={"???????? ???????? ???"}
              type={"text"}
              id={"migration_date"}
              errors={errors}
            />
          </div>
        )}

        {household.resident_type == "3" && (
          <div className="child-section">
            <InputComponent
              name={"origin_member_count"}
              label={"c.??? ?????? ?????? (?????? ????? ???)"}
              wrapperClass={"options-verical"}
              handleChange={handleChange}
              defaultValue={household.origin_member_count}
              palceholder={"??? ?????? ?????? (?????? ????? ???)"}
              type={"text"}
              id={"origin_member_count"}
              errors={errors}
            />
          </div>
        )} */}
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
