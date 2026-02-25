import { income_sources } from "../../enums";
import { db } from "../db";
import { IMember } from "./Member";

interface IObjectKeys {
  [key: string]: any;
}
export interface IMissingDeceasedMember {
  reason_id: string;
  reason: string;
  age?: string;
  name?: string;
  gender?: string;
}
export interface IIncomeExpense {
  source: string;
  source_id: string;
  income_source_id?: string;
  expense_source_id?: string;
  income_amount: string;
  total_income_amount: number;
  total_expense_amount: number;
  expense_amount: string;
  type?: string;
}

export interface ITrainingDetail {
  member_name: string;
  skill_id: string;
  skill_name: string;
  source?: string;
  duration?: string;
}

export interface IFestivals {
  id: string;
  name: string;
}

export interface IFacility {
  id: string;
  name: string;
}

export interface IIncomeSource {
  id: string;
  name: string;
}

export interface IExpenseSource {
  id: string;
  name: string;
}

export interface IHouse {
  house_type_id: string;
  house_type: string;
  location?: string;
  // total_area?: string;
  // area_unit?: string;
  // irrigation?: string;
  // kitta_no?: string;
  house_qty?: string;
  ward_id?: string;
  remarks?: string;
}

export interface IDisaster {
  disaster_type: string;
  disaster_location: string;
  disaster_priority: string;
  remarks?: string;
}

export interface ILand {
  land_type_id: string;
  land_type: string;
  location?: string;
  total_area?: string;
  area_unit?: string;
  irrigation?: string;
  kitta_no?: string;
  ward_id?: string;
  remarks?: string;
}
export interface IFule {
  id: string;
  name: string;
}
export interface IAnimal {
  animal_type_id: string;
  animal: string;
  count: string;
}

export interface IWaterSource {
  water_source_id: string;
  distance: string;
}

export interface IForeignMember {
  member_name: string;
  reason: string;
  reason_id: string;
  country: string;
  country_id: string;
  country_samuha_id: string;
  in_abroad: string;
  // visited_year_bs?: string;
  total_abroad_age?: string;
  // return_year_bs?: string;
  // monthly_income?: string;
}

export interface IChronicDiseaseMember {
  member_name: string;
  disease_name: string;
  reason_id: string;
  treatment_condition: string;
}

export interface IDisabiltyMember {
  member_name: string;
  disability_type: string;
  disability_type_name: string;
  disability_card: string;
}

//  export interface IMissingDeceasedMember {
//   member_name: string;
//   disease_name: string;
//   reason_id: string;
//   treatment_condition: string;
//  }

export interface IVehicle {
  vehicle_type: string;
  vehicle_type_id: string;
  count: string;
}

export interface IHousehold extends IObjectKeys {
  id?: number;
  id_string?: string;
  household_id?: string;
  server_household_id?: number;
  members?: IMember[];
  hoh_first_name?: string;
  hoh_last_name?: string;
  hoh_eng_name?: string;
  hoh_contact_num?: string;
  hoh_image?: string;
  hoh_role?: string;
  hoh_gender?: string;
  hoh?: string;
  province?: string;
  district?: string;
  local_level?: string;
  ward_id?: string;
  sabikWard_id?: string;
  basti_id?: string;
  marga_id?: string;
  religion_id?: string;
  jaati_id?: string;
  mother_tongue_id?: string;
  main_occupation?: string;
  has_bank_acc?: string;
  has_cooperative_acc?: string;
  has_garden?: string;
  member_with_life_insurance?: string;
  member_with_health_insurance?: string;
  is_responder_member?: string;
  responder_member_name?: string;
  responder_name?: string;
  house_num?: string;
  num_of_member?: number;
  resident_type?: string;
  migration_date?: string;
  phone_num?: string;
  mobile_num?: string;
  longitude?: string;
  latitude?: string;
  geo_location?: string;
  altitude?: string;
  accuracy?: string;
  responder_image?: string;
  step?: string;
  status?: string;
  remarks?: string;
  office?: string;
  user_id?: string;
  is_posted?: string;
  is_complete?: string;
  is_deleted?: string;
  jaati_samuha_id?: string;

  missing_deceased_members?: IMissingDeceasedMember[];
  has_missing_deceased_member?: string;
  has_foreign_member?: string;
  has_chronic_disease: string;
  treatment_condition: string;
  disease_name: string;
  has_disability?: string;
  has_technical_training?: string;
  disability_type?: string;
  disability_card?: string;

  has_health_insurance?: string;
  has_life_insurance?: string;
  has_bank_account?: string;
  has_cooperative_account?: string;
  has_smartphone: string;
  feelings_for_local_government: string;

  technical_skills_members?: ITrainingDetail[];
  foreign_members?: IForeignMember[];
  chronic_disease_members?: IChronicDiseaseMember[];
  vehicles?: IVehicle[];
  disabilty_members?: IDisabiltyMember[];

  animal_count?: string;
  business_count?: string;
  rent_business_count?: string;
  annual_expense?: string;
  festivals?: IFestivals[];
  water_source_id?: string;
  water_source_location?: string;
  water_source_distance?: string;
  public_vehicle_distance_meter?: string;
  public_vehicle_distance_minute?: string;
  nearest_road_distance_meter?: string;
  nearest_road_distance_minute?: string;

  has_pregchild_health?: string;
  has_pregnant_member?: string;
  has_pregnancy_test?: string;
  pregnancy_test_count?: string;
  has_maternity_member?: string;
  has_maternity_test?: string;
  maternity_location?: string;
  has_maternity_death?: string;
  maternity_death_condition?: string;
  child_death?: string;
  child_death_condition?: string;
  child_death_count?: string;
  nearest_hospital_distance?: string;
  hospital_distance_minute?: number;
  cooking_fuels?: IFule[];
  light_fuels?: IFule[];
  higher_secondary_distance?: string;
  secondary_distance?: string;
  primary_distance?: string;
  toilet_type_id?: string;
  earthquake_house_relief_status?: string;
  earthquake_house_damage_count?: string;
  has_earthquake_relief_plan?: string;
  hoh_income_amount?: number;
  hoh_expense_amount?: number;
  map_pass?: string;
  animals?: IAnimal[];
  lands?: ILand[];
  houses?: IHouse[];
  disasters?: IDisaster[];
  income_expenses?: IIncomeExpense[];
  facilities?: IFacility[];
  income_sources?: IIncomeSource[];
  income_expense?: IExpenseSource[];
  gov_complaint?: string;
  form_complaint?: string;
}
export class Household {
  id: number;
  id_string?: string;
  household_id?: string;
  server_household_id?: number;
  hoh_first_name?: string;
  hoh_last_name?: string;
  hoh_eng_name?: string;
  hoh_contact_num?: string;
  hoh_image?: string;
  hoh_role?: string;
  hoh_gender?: string;
  hoh?: string;
  ward_id?: string;
  sabikWard_id?: string;
  basti_id?: string;
  marga_id?: string;
  religion_id?: string;
  jaati_id?: string;
  mother_tongue_id?: string;
  main_occupation?: string;
  has_bank_acc?: string;
  has_cooperative_acc?: string;
  has_garden?: string;
  member_with_life_insurance?: string;
  member_with_health_insurance?: string;
  is_responder_member?: string;
  responder_member_name?: string;
  responder_name?: string;
  responder_image?: string;
  house_num?: string;
  num_of_member?: number;
  resident_type?: string;
  migration_date?: string;
  phone_num?: string;
  mobile_num?: string;
  longitude?: string;
  latitude?: string;
  geo_location?: string;
  altitude?: string;
  accuracy?: string;

  step?: string;
  status?: string;
  remarks?: string;
  user_id?: string;
  is_posted?: string;
  is_complete?: string;
  is_deleted?: string;
  jaati_samuha_id?: string;

  missing_deceased_members?: IMissingDeceasedMember[];
  has_missing_deceased_member?: string;
  has_foreign_member?: string;
  has_chronic_disease: string;
  has_vehicle: string;
  treatment_condition: string;
  disease_name: string;
  has_disability?: string;
  agriculture_situation?: string;
  has_technical_training?: string;
  disability_type?: string;
  disability_card?: string;

  has_health_insurance?: string;
  has_life_insurance?: string;
  has_bank_account?: string;
  has_cooperative_account?: string;
  has_smartphone: string;
  feelings_for_local_government: string;
  foreign_members?: IForeignMember[];
  technical_skills_members?: ITrainingDetail[];
  animal_count?: string;
  business_count?: string;
  rent_business_count?: string;
  annual_expense?: string;
  festivals?: IFestivals[];
  water_source_id?: string;
  water_source_location?: string;
  water_source_distance?: string;
  public_vehicle_distance_meter?: string;
  public_vehicle_distance_minute?: string;
  nearest_road_distance_meter?: string;
  nearest_road_distance_minute?: string;
  has_pregchild_health?: string;
  has_pregnant_member?: string;
  has_pregnancy_test?: string;
  pregnancy_test_count?: string;
  has_maternity_member?: string;
  has_maternity_test?: string;
  maternity_location?: string;
  has_maternity_death?: string;
  maternity_death_condition?: string;
  hoh_income_amount?: number;
  hoh_expense_amount?: number;
  child_death?: string;
  child_death_condition?: string;
  child_death_count?: string;
  gov_complaint?: string;
  form_complaint?: string;
  nearest_hospital_distance?: string;
  hospital_distance_minute?: number;
  cooking_fuels?: IFule[];
  light_fuels?: IFule[];
  higher_secondary_distance?: string;
  secondary_distance?: string;
  primary_distance?: string;
  toilet_type_id?: string;
  earthquake_house_relief_status?: string;
  earthquake_house_damage_count?: string;
  has_earthquake_relief_plan?: string;
  map_pass?: string;
  animals?: IAnimal[];
  houses?: IHouse[];
  lands?: ILand[];
  income_expenses?: IIncomeExpense[];
  income_sources?: IIncomeSource[];
  expense_sources?: IExpenseSource[];
  facilities?: IFacility[];

  constructor(data: IHousehold) {
    this.id_string = data.id_string;
    this.household_id = data.household_id;
    this.server_household_id = data.server_household_id;
    this.hoh_first_name = data.hoh_first_name;
    this.hoh_last_name = data.hoh_last_name;
    this.hoh_eng_name = data.eng_name;
    this.hoh_contact_num = data.hoh_contact_num;
    this.hoh_image = data.hoh_image;
    this.hoh_role = data.hoh_role;
    this.hoh_gender = data.hoh_gender;
    this.hoh = data.hoh;
    this.ward_id = data.ward_id;
    this.sabikWard_id = data.sabikWard_id;
    this.basti_id = data.basti_id;
    this.marga_id = data.marga_id;
    this.religion_id = data.religion_id;
    this.jaati_id = data.jaati_id;
    this.mother_tongue_id = data.mother_tongue_id;
    this.main_occupation = data.main_occupation;
    this.has_bank_acc = data.has_bank_acc;
    this.has_cooperative_acc = data.has_cooperative_acc;
    this.has_garden = data.has_garden;
    this.member_with_life_insurance = data.member_with_life_insurance;
    this.member_with_health_insurance = data.member_with_health_insurance;
    this.is_responder_member = data.is_responder_member;
    this.responder_member_name = data.responder_member_name;
    this.responder_name = data.responder_name;
    this.house_num = data.house_num;
    this.num_of_member = data.num_of_member;
    this.resident_type = data.resident_type;
    this.migration_date = data.migration_date;
    this.phone_num = data.phone_num;
    this.mobile_num = data.mobile_num;
    this.longitude = data.longitude;
    this.latitude = data.latitude;
    this.geo_location = data.geo_location;
    this.altitude = data.altitude;
    this.accuracy = data.accuracy;
    this.responder_image = data.responder_image;
    this.step = data.step;
    this.status = data.status;
    this.remarks = data.remarks;
    this.user_id = data.user_id;
    this.is_posted = data.is_posted;
    this.is_complete = data.is_complete;
    this.is_deleted = data.is_deleted;
    this.missing_deceased_members = data.missing_deceased_members;
    this.has_missing_deceased_member = data.has_missing_deceased_member;
    this.has_foreign_member = data.has_foreign_member;
    this.has_chronic_disease = data.has_chronic_disease;
    this.treatment_condition = data.treatment_condition;
    this.disease_name = data.disease_name;
    this.has_disability = data.has_disability;
    this.agriculture_situation= data.agriculture_situation;
    this.has_technical_training = data.has_technical_training;
    this.disability_type = data.disability_type;
    this.disability_card = data.disability_card;

    this.has_health_insurance = data.has_health_insurance;
    this.has_life_insurance = data.has_life_insurance;
    this.has_bank_account = data.has_bank_account;
    this.has_cooperative_account = data.has_cooperative_account;
    this.has_smartphone = data.has_smartphone;
    this.feelings_for_local_government = data.feelings_for_local_government;

    this.foreign_members = data.foreign_members;
    this.animal_count = data.animal_count;
    this.business_count = data.business_count;
    this.rent_business_count = data.rent_business_count;
    this.annual_expense = data.annual_expense;
    this.festivals = data.festivals;
    this.water_source_id = data.water_source_id;
    this.water_source_distance = data.water_source_distance;
    this.water_source_location = data.water_source_location;
    this.public_vehicle_distance_minute = data.public_vehicle_distance_minute;
    this.public_vehicle_distance_meter = data.public_vehicle_distance_meter;
    this.nearest_road_distance_minute = data.nearest_road_distance_minute;
    this.nearest_road_distance_meter = data.nearest_road_distance_meter;
    this.has_pregchild_health = data.has_pregchild_health;
    this.has_pregnant_member = data.has_pregnant_member;
    this.has_pregnancy_test = data.has_pregnancy_test;
    this.pregnancy_test_count = data.pregnancy_test_count;
    this.has_maternity_member = data.has_maternity_member;
    this.has_maternity_test = data.has_maternity_test;
    this.maternity_location = data.maternity_location;
    this.has_maternity_death = data.has_maternity_death;
    this.maternity_death_condition = data.maternity_death_condition;
    this.child_death = data.child_death;
    this.child_death_condition = data.child_death_condition;
    this.child_death_count = data.child_death_count;

    this.nearest_hospital_distance = data.nearest_hospital_distance;
    this.hospital_distance_minute = data.hospital_distance_minute;
    this.light_fuels = data.light_fuels;
    this.cooking_fuels = data.cooking_fuels;
    this.higher_secondary_distance = data.higher_secondary_distance;
    this.secondary_distance = data.secondary_distance;
    this.primary_distance = data.primary_distance;
    this.toilet_type_id = data.toilet_type_id;
    this.earthquake_house_damage_count = data.earthquake_house_damage_count;
    this.earthquake_house_relief_status = data.earthquake_house_relief_status;
    this.has_earthquake_relief_plan = data.has_earthquake_relief_plan;
    this.map_pass = data.map_pass;
    this.animals = data.animals;
    this.lands = data.lands;
    this.income_expenses = data.income_expenses;
    this.facilities = data.facilities;
    this.jaati_samuha_id = data.jaati_samuha_id;
    this.hoh_income_amount = data.hoh_income_amount;
    this.hoh_expense_amount = data.hoh_expense_amount;
    this.gov_complaint= data.gov_complaint;
    this.form_complaint= data.form_complaint;

    if (data.id) this.id = data.id;
    db.households.mapToClass(Household);
  }
  save() {
    return db.households.put(this);
  }
}

export async function addNewHousehold(data: IHousehold) {
  return await db.transaction("rw", db.households, async function () {
    return await db.households.add(new Household({ ...data }));
  });
}

export async function getAllHousehold() {
  return await db.transaction("r", db.households, async function () {
    let households = await db.households.toArray();
    return households;
  });
}

export async function getHouseholdById(id: any) {
  return await db.households.get(parseInt(id));
}

export async function getPendingHouseholds() {
  //   return await db.households.where("is_deleted").equals("0").toArray();
  // }

  return await db.households
    // .where("[is_posted+is_complete+is_deleted]")
    // .equals(["0", "1", "0"])
    .toArray();
}

export async function getIncompleteHouseholds(user_id: string) {
  return await db.households.where("is_complete").equals("0").toArray();
}

export async function updateHousehold(data: IHousehold) {
  return await db.households.put({
    ...data,
    hoh_first_name: `${data.hoh_first_name}`,
    hoh_last_name: `${data.hoh_last_name}`,
  });
}

export async function deleteAllData(test: string) {
  if (test === "deleteall") {
    return db
      .delete()
      .then(() => {
        console.log("Database successfully deleted");
        return true;
      })
      .catch((err) => {
        console.error("Could not delete database");
      })
      .finally(async () => {
        await db.open();
        return true;
      });
  }
  return false;
}
