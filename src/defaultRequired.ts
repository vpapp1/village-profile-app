import { IHousehold } from "./db/models/Household";
import { IMember } from "./db/models/Member";

export const memberDefault = {
  first_name: "",
  last_name: "",
  relation_with_hoh_id: "",
  gender_id: "",
  dob_bs: "",
  marital_status_id: "1",
  voter_card_location: "गाउँपालिका",
  // technical_skills: [],
  // vehicles: [],
  // social_networks: [],
  // recommendation_for_local_level: [{ name: "सडक", id: "सडक" }],
  // education_level_id: "1",
  // education_status_id: "4",
  // has_informal_education: "0",
  // main_occupation_id: "12",
  // other_occupation_id: "",
  // has_technical_training: "0",
  // is_married: "0",
  // resident_place: "",
  // has_vehicle: "0",
  // has_health_insurance: "0",
  // has_life_insurance: "0",
  // has_bank_account: "0",
  // has_cooperative_account: "0",
  // has_pension: "0",
  // has_disability: "0",
  // has_chronic_disease: "0",
  // covid_infection_status: "सक्रमण नभएको",
  // has_covid_vaccine: "0",
  // has_smartphone: "0",
  has_voter_card: "1",
  // voter_card_location: "गाउँपालिका",
  // feelings_for_local_government: "5",
  // education_faculty: "",
  // education_leave_reason: "",
} as IMember;

export const householdDefault = {
  is_posted: "0",
  is_complete: "0",
  is_deleted: "0",
  ward_id: "",
  sabikWard_id: "",
  basti_id: "",
  marga_id: "",
  house_num: "",
  hoh_first_name: "",
  hoh_last_name: "",
  hoh_contact_num: "",
  hoh_eng_name: "",
  // jaati_id: "5",
  num_of_member: 0,
  migration_date: "",
  water_source_id: "1",
  water_source_location: "घरमा",
  cooking_fuels: [{ id: "1", name: "दाउरा" }, ,],
  light_fuels: [
    { id: "1", name: "रास्टिय बिदयुत" },
    { id: "3", name: "सोलार" },
    { id: "4", name: "मट्टितेल" },
    { id: "5", name: "दाउरा" },
  ],
  facilities: [
    { id: "2", name: "टेलिभिजन" },
    { id: "4", name: "स्मार्ट फोन" },
    { id: "17", name: "बिद्युतीय पंखा" },
  ],
  income_sources: [
    { id: "1", name: "कृषि" },
    { id: "7", name: "उद्यम" },
  ],
  expense_sources: [
    { id: "1", name: "खाना/लाउन" },
    { id: "2", name: "शिक्षा " },
  ],

  public_vehicle_distance_meter: "",
  public_vehicle_distance_minute: "",
  hospital_distance_meter: "",
  hospital_distance_minute: "",
  primary_distance: "",
  secondary_distance: "",
  higher_secondary_distance: "",
  toilet_type_id: "1",
  members: [] as IMember[],
  hoh_role: "father",
  hoh_gender: "1",

  // religion_id: "1",
  // mother_tongue_id: "1",
  resident_type: "1",
  has_missing_deceased_member: "0",
  has_chronic_disease: "0",
  has_disability: "0",
  has_natural_disaster: "0",
  animal_count: "",
  business_count: "",
  rent_business_count: "",
  annual_expense: "",
  has_foreign_member: "0",
  festivals: [
    { id: "3", name: "तिहार" },
    { id: "7", name: "दशैँ" },
    { id: "19", name: "माघे संक्रान्ती" },
  ],
  has_technical_training: "0",
  has_pregnant_member: "0",
  has_pregnancy_test: "0",
  has_maternity_member: "0",
  has_maternity_death: "0",
  has_maternity_test: "0",
  maternity_location: "",
  child_death: "0",
  has_earthquake_relief_plan: "0",
  map_pass: "0",
  responder_name: "",
  is_responder_member: "1",
} as unknown as IHousehold;

export const memberRequired = [
  "first_name",
  "last_name",
  "relation_with_hoh_id",
  "gender_id",
  "dob_bs",
  "resident_place",
  // "recommendation_for_local_level",
] as any;

export const householdRequired = [
  "ward_id",
  "sabikWard_id",
  "basti_id",
  "marga_id",
  "house_num",
  "hoh_first_name",
  "hoh_last_name",
  "hoh_eng_name",
  "hoh_contact_num",
  "hoh_gender",
  "jaati_samuha_id",
  "jaati_id",
  "religion_id",
  "mother_tongue_id",
  "resident_type",
  "num_of_member",
  "total_house_count",
  "hoh_income_amount",
  "hoh_expense_amount",
  "water_source_id",
  "cooking_fuels",
  // "nearest_road_distance_minute",
  // "public_vehicle_distance_minute",
  // "nearest_hospital_distance",
  // "hospital_distance_minute",
  // "hospital_distance_minute",
  //  "responder_name",
] as any;
