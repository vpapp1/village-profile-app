import axios from "axios";
import { IUser } from "../db/models/UserModel";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";
const serverBase = `${process.env.REACT_APP_SERVER || ""}`.replace(/\/$/, "");
const server = `${serverBase}/api/`;
const householdSyncEndpoint =
  process.env.REACT_APP_HOUSEHOLD_SYNC_ENDPOINT || "households-export/";
const householdPostEndpoint =
  process.env.REACT_APP_HOUSEHOLD_POST_ENDPOINT || "post-household/";
const api = {
  loadWada: (office_id: String, user_id: String) => axios.get(`${server}wards/`, {params: {office_id: office_id, user_id: user_id}}),
  loadWadaByUser: (office_id:String, user_id: String) => axios.get(`${server}wards/`, {params: {office_id: office_id, user_id:user_id}}),
  loadSabikWada: (office_id: String, user_id: String) =>
    axios.get(`${server}sabik-wards/`, { params: { office_id: office_id, user_id: user_id } }),
  loadMarga: (office_id: String, basti_id?: string) =>
    axios.get(`${server}margas/`, {params: {office_id: office_id, basti_id: basti_id}}),
  loadBasti: (office_id: String) => axios.get(`${server}bastis/`, {params: {office_id: office_id}}),
  loadJaati: () => axios.get(`${server}jaatis/`),
  loadDistrict: () => axios.get(`${server}districts/`),
  loadJaatiSamuhas: () => axios.get(`${server}jaati-samuhas/`),
  loadCountry: () => axios.get(`${server}countries/`),
  loadCountrySamuhas: () => axios.get(`${server}country-samuhas/`),
  loadMotherTongues: () => axios.get(`${server}mother-tongues/`),
  loadDharma: () => axios.get(`${server}dharmas/`),
  loadOccupations: () => axios.get(`${server}occupations/`),
  loadTechnicalSkills: () => axios.get(`${server}technical-skills/`),
  loadVehicleTypes: () => axios.get(`${server}vehicle-types/`),
  loadLandTypes: () => axios.get(`${server}land-types/`),
  loadEducationStages: () => axios.get(`${server}education-stages/`),
  loadEducationBackgrounds: () => axios.get(`${server}education-backgrounds/`),
  loadRelationWithHohs: () => axios.get(`${server}relation-with-hohs/`),
  loadTodayBsDate: () => axios.get(`${server}today-bs/`),
  loadProfessionCategories: () => axios.get(`${server}profession-categories/`),
  loadProfessions: (profession_category_id: string) =>
    axios.get(`${server}professions/`, { params: { profession_category_id } }),
  loadHouseholdsForSync: (office_id: String, user_id: String, sabikWardIds?: string[]) =>
    axios.get(`${server}${householdSyncEndpoint}`, {
      params: {
        office_id: office_id,
        user_id: user_id,
        sabik_ward_ids: sabikWardIds?.join(","),
      },
    }),
  postHousehold: (payload: any) =>
    axios.post(`${server}${householdPostEndpoint}`, { data: payload }),
  login: (auth: IUser) => axios.post(`${server}login/`, { data: auth }),
  loginJsonServer: () => axios.get(`${server}login/`),
  
  loadInactiveMembers: () => axios.get(`${server}inactive-members/`, { params: { status: "0" } }),
};

export default api;
