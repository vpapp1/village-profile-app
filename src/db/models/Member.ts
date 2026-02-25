import { db } from "../db";

interface IObjectKeys {
  [key: string]: any;
}
// export interface ITrainingDetail {
//   skill_id: string;
//   skill_name: string;
//   source?: string;
//   duration?: string;
// }

// export interface IVehicle {
//   vehicle_type: string;
//   vehicle_type_id: string;
//   count: string;
// }
export interface IMember extends IObjectKeys {
  id?: number;
  member_id?: number;
  first_name?: string;
  last_name?: String;
  gender_id?: string;
  dob_ad?: String;
  dob_bs?: String;
   hh_id?: String;
  education_status_id?: String;
  education_stage_id?: String;
  main_occupation_id?: String;
  other_occupation_id?: String;
  profession_category_id?: String;
  profession_id?: String;
  profession_type?: string;
  citizenship_num?: string;
  relation_with_hoh_id?: string;
  phone_num?: String;
  mobile_num?: string;
  age?: string;
  is_married?: String;
  resident_place?: string;
  // monthly_income?: String;
  education_level_id?: String;
  education_faculty?: string;
  education_leave_reason?: string;
  has_informal_education?: String;
  marital_status_id?: string;
  spouse_id?: string;
  marriage_year?: string;
  age_on_marriage?: string;
  enroll_type?: string;

  spouse?: String;
  guardian?: String;
  has_disability?: string;
  has_chronic_disease?: String;
  has_technical_training?: string;
  foreign_stay?: String;
  is_child_marriage?: String;
  is_vaccinated?: String;
  is_hoh?: String;
  bank_account?: String;
  disability_card_id?: String;
  disability_type_id?: String;
  country_visited?: String;
  // technical_skills?: ITrainingDetail[];
  
  has_vehicle?: string;
  has_bank_account?: string;
  has_health_insurance?: string;
  has_life_insurance?: string;
  has_cooperative_account?: string;
  has_pension?: string;
  pension_income?: string;
  has_covid_vaccine?: string;
  covid_vaccine_status?: string;
  covid_infection_status?: string;
  has_smartphone?: string;
  has_voter_card?: string;
  voter_card_location?: string;
  recommendation_for_local_level?: any;
  social_networks?: string[];
  feelings_for_local_government?: string;
  house_count?: string;
  land_count?: string;

  vaccine_name?: String;
  foreign_reason?: String;
  disease_name?: String;
  treatment_condition?: String;
  status?: String;
  remarks?: String;
  user_id?: String;
}
export class Member {
  id?: number;
  member_id?: number;
  first_name?: string;
  last_name?: String;
  gender_id?: string;
  dob_ad?: String;
  dob_bs?: String;
  hh_id?: String;
  education_status_id?: String;
  education_stage_id?: String;
  main_occupation_id?: String;
  other_occupation_id?: String;
  profession_category_id?: String;
  profession_id?: String;
  profession_type?: string;
  citizenship_num?: string;
  relation_with_hoh_id?: string;
  phone_num?: String;
  mobile_num?: string;
  age?: string;
  resident_place?: string;
  is_married?: String;
  // monthly_income?: String;
  education_level_id?: String;
  education_faculty?: string;
  education_leave_reason?: string;
  has_informal_education?: String;
  marital_status_id?: string;
  spouse_id?: string;
  marriage_year?: string;
  age_on_marriage?: string;
  enroll_type?: string;

  spouse?: String;
  guardian?: String;
  has_disability?: string;
  has_chronic_disease?: String;
  has_technical_training?: string;
  foreign_stay?: String;
  is_child_marriage?: String;
  is_vaccinated?: String;
  is_hoh?: String;
  bank_account?: String;
  disability_card_id?: String;
  disability_type_id?: String;
  country_visited?: String;
  // technical_skills?: ITrainingDetail[];
  // vehicles?: IVehicle[];
  has_vehicle?: string;
  has_bank_account?: string;
  has_health_insurance?: string;
  has_life_insurance?: string;
  has_cooperative_account?: string;
  has_pension?: string;
  pension_income?: string;
  has_covid_vaccine?: string;
  covid_vaccine_status?: string;
  covid_infection_status?: string;
  has_smartphone?: string;
  has_voter_card?: string;
  voter_card_location?: string;
  recommendation_for_local_level?: any;
  social_networks?: string[];
  feelings_for_local_government?: string;
  house_count?: string;
  land_count?: string;

  vaccine_name?: String;
  foreign_reason?: String;
  disease_name?: String;
  treatment_condition?: String;
  status?: String;
  remarks?: String;
  user_id?: String;

  constructor(data: IMember) {
    this.member_id = data.member_id;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.gender_id = data.gender_id;
    this.dob_ad = data.dob_ad;
    this.dob_bs = data.dob_bs;
    this.hh_id = data.hh_id;
    this.education_status_id = data.education_status_id;
    this.education_stage_id = data.education_stage_id;
    this.main_occupation_id = data.main_occupation_id;
    this.other_occupation_id = data.other_occupation_id;
    this.profession_category_id = data.profession_category_id;
    this.profession_id = data.profession_id;
    this.profession_type = data.profession_type;
    this.citizenship_num = data.citizenship_num;
    this.relation_with_hoh_id = data.relation_with_hoh_id;
    this.phone_num = data.phone_num;
    this.mobile_num = data.mobile_num;
    this.age = data.age;
    this.is_married = data.is_married;
    this.resident_place = data.resident_place;
    // this.monthly_income = data.monthly_income;
    this.education_level_id = data.education_level_id;
    this.education_faculty = data.education_faculty;
    this.education_leave_reason = data.education_leave_reason;
    this.marital_status_id = data.marital_status_id;
    this.spouse_id = data.spouse_id;
    this.marriage_year = data.marriage_year;
    this.age_on_marriage = data.age_on_marriage;
    this.enroll_type = data.enroll_type;

    this.spouse = data.spouse;
    this.guardian = data.guardian;
    this.has_disability = data.has_disability;
    this.has_chronic_disease = data.has_chronic_disease;
    this.has_informal_education = data.has_informal_education;
    this.has_technical_training = data.has_technical_training;
    this.foreign_stay = data.foreign_stay;
    this.is_child_marriage = data.is_child_marriage;
    this.is_vaccinated = data.is_vaccinated;
    this.is_hoh = data.is_hoh;
    this.bank_account = data.bank_account;
    this.disability_card_id = data.disability_card_id;
    this.disability_type_id = data.disability_type_id;
    this.country_visited = data.country_visited;

    // this.technical_skills = data.technical_skills;
    // this.vehicles = data.vehicles;
    this.has_vehicle = data.has_vehicle;
    this.has_bank_account = data.has_bank_account;
    this.has_health_insurance = data.has_health_insurance;
    this.has_life_insurance = data.has_life_insurance;
    this.has_cooperative_account = data.has_cooperative_account;
    this.has_pension = data.has_pension;
    this.pension_income = data.pension_income;
    this.covid_infection_status = data.covid_infection_status;
    this.covid_vaccine_status = data.covid_vaccine_status;
    this.has_covid_vaccine = data.has_covid_vaccine;
    this.has_smartphone = data.has_smartphone;
    this.has_voter_card = data.has_voter_card;
    this.voter_card_location = data.voter_card_location;
    this.feelings_for_local_government = data.feelings_for_local_government;
    this.recommendation_for_local_level = data.recommendation_for_local_level;
    this.social_networks = data.social_networks;
    this.house_count = data.house_count;
    this.land_count = data.land_count;

    this.vaccine_name = data.vaccine_name;
    this.foreign_reason = data.foreign_reason;
    this.disease_name = data.disease_name;
    this.treatment_condition = data.treatment_condition;
    this.status = data.status;
    this.remarks = data.remarks;
    this.user_id = data.user_id;
    if (data.id) this.id = data.id;
    db.members.mapToClass(Member);
  }
  save() {
    return db.members.put(this);
  }
}

export async function addNewMember(data: IMember) {
  return await db.transaction("rw", db.members, async function () {
    return await db.members.add(new Member({ ...data }));
  });
}

export async function getAllMember() {
  return await db.transaction("r", db.members, async function () {
    let members = await db.members.toArray();
    return members;
  });
}

export async function getMemberById(id: string) {
  return await db.members.get(id);
}

export async function getMembersbyHousehold(hh_id: string) {
  return await db.members.where("hh_id").equals(parseInt(hh_id)).toArray();
}

export async function updateMember(data: IMember) {
  return await db.members.put({ ...data });
}

export async function deleteMemberById(id: any) {
  return await db.members.delete(parseInt(id));
}

export async function getMemberCountByHousehold(hh_id: string) {
  let x = await db.members.where("hh_id").equals(hh_id).count();
  console.log(x)
}
